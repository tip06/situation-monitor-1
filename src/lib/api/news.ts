/**
 * News API - Fetch news from RSS feeds and GDELT
 */

import type { NewsItem, NewsCategory } from '$lib/types';
import { FEEDS } from '$lib/config/feeds';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { fetchWithProxy, API_DELAYS, CACHE_TTLS, CORS_PROXIES, logger } from '$lib/config/api';
import { classifyRegionalItem } from '$lib/utils/regional-filter';
import { getEnabledSourcesForCategory } from '$lib/stores/sources';
import { cacheManager } from '$lib/services/cache';
import { deduplicateNews } from '$lib/utils';
import { browser } from '$app/environment';

/** Categories that use RSS feeds only (no GDELT) */
const RSS_ONLY_CATEGORIES: NewsCategory[] = ['politics', 'brazil', 'latam', 'finance'];

/** Categories that use both RSS feeds AND GDELT */
const RSS_PLUS_GDELT_CATEGORIES: NewsCategory[] = ['intel'];
const NEWS_SOURCE_TIMEOUT_MS = 30000;
const NEWS_CATEGORY_CONCURRENCY = 3;
const NEWS_CACHE_TTL_MS = CACHE_TTLS.news;
const NEWS_MAX_AGE_DAYS = 7;
const EDGE_RESPONSE_TIMEOUT_MS = 12000;
const NEWS_CHECKPOINTS_STORAGE_KEY = 'newsCheckpoints';

/**
 * Simple hash function to generate unique IDs from URLs
 */
function hashCode(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash).toString(36);
}

interface FetchCategoryNewsOptions {
	timeoutMs?: number;
}

type NewsCheckpointMap = Partial<Record<NewsCategory, number>>;

export interface RefreshAllNewsProgressiveOptions {
	timeoutMs?: number;
	categoryConcurrency?: number;
	categories?: NewsCategory[];
	preferEdge?: boolean;
	sinceByCategory?: NewsCheckpointMap;
	onCachedCategory?: (
		category: NewsCategory,
		items: NewsItem[],
		meta: { stale: boolean; source: 'memory' | 'storage' }
	) => void;
	onFreshCategory?: (category: NewsCategory, items: NewsItem[]) => void;
	onCategoryError?: (category: NewsCategory, error: unknown) => void;
	onCheckpointUpdate?: (category: NewsCategory, checkpoint: number) => void;
}

interface EdgeSnapshotResponse {
	categories?: Partial<Record<NewsCategory, NewsItem[]>>;
	checkpoints?: NewsCheckpointMap;
}

function getCategorySourceSignature(category: NewsCategory): string {
	const enabledSources = getEnabledSourcesForCategory(category)
		.map((source) => `${source.name}|${source.url}`)
		.sort();
	return hashCode(enabledSources.join('::'));
}

function getCategoryCacheKey(category: NewsCategory, sourceSignature: string): string {
	return `news:${category}:${sourceSignature}`;
}

function getEdgeAggregatorBaseUrl(): string {
	return CORS_PROXIES.primary.split('?')[0].replace(/\/$/, '');
}

function getStoredCheckpoints(): NewsCheckpointMap {
	if (!browser) return {};
	try {
		const raw = localStorage.getItem(NEWS_CHECKPOINTS_STORAGE_KEY);
		return raw ? (JSON.parse(raw) as NewsCheckpointMap) : {};
	} catch {
		return {};
	}
}

function setStoredCheckpoints(checkpoints: NewsCheckpointMap): void {
	if (!browser) return;
	try {
		localStorage.setItem(NEWS_CHECKPOINTS_STORAGE_KEY, JSON.stringify(checkpoints));
	} catch {
		// Ignore storage write errors
	}
}

function mergeNewsItems(existing: NewsItem[], incoming: NewsItem[]): NewsItem[] {
	const merged = deduplicateNews([...incoming, ...existing]);
	return filterByAge(merged, NEWS_MAX_AGE_DAYS).sort((a, b) => b.timestamp - a.timestamp);
}

async function fetchEdgeNewsSnapshot(
	categories: NewsCategory[],
	sinceByCategory: NewsCheckpointMap
): Promise<EdgeSnapshotResponse> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), EDGE_RESPONSE_TIMEOUT_MS);

	try {
		const response = await fetch(`${getEdgeAggregatorBaseUrl()}/news/snapshot`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ categories, sinceByCategory }),
			signal: controller.signal
		});

		if (!response.ok) {
			throw new Error(`Edge snapshot request failed: ${response.status}`);
		}

		return (await response.json()) as EdgeSnapshotResponse;
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse RSS/Atom XML and extract items
 */
function parseRssFeed(xml: string, sourceName: string, category: NewsCategory): NewsItem[] {
	const items: NewsItem[] = [];
	let regionalDropped = 0;
	const regionalDropReasons: Record<string, number> = {};
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'text/xml');

	// Check for parsing errors
	const parseError = doc.querySelector('parsererror');
	if (parseError) {
		logger.warn('RSS Parser', `Parse error for ${sourceName}`);
		return [];
	}

	// Try RSS 2.0 format first (most common)
	let entries = doc.querySelectorAll('item');

	// If no items, try Atom format
	if (entries.length === 0) {
		entries = doc.querySelectorAll('entry');
	}

	entries.forEach((entry) => {
		// RSS 2.0 fields
		let title = entry.querySelector('title')?.textContent?.trim() || '';
		let link = entry.querySelector('link')?.textContent?.trim() || '';
		let pubDate = entry.querySelector('pubDate')?.textContent?.trim() || '';
		let description = entry.querySelector('description')?.textContent?.trim() || '';

		// Atom format fallback
		if (!link) {
			const linkEl = entry.querySelector('link');
			link = linkEl?.getAttribute('href') || '';
		}
		if (!pubDate) {
			pubDate =
				entry.querySelector('published')?.textContent?.trim() ||
				entry.querySelector('updated')?.textContent?.trim() ||
				'';
		}
		if (!description) {
			description =
				entry.querySelector('summary')?.textContent?.trim() ||
				entry.querySelector('content')?.textContent?.trim() ||
				'';
		}

		// Skip items without title or link
		if (!title || !link) return;

		// Parse date
		const timestamp = pubDate ? new Date(pubDate).getTime() : Date.now();

		// Generate unique ID
		const urlHash = hashCode(link);
		const id = `rss-${category}-${sourceName.toLowerCase().replace(/\s+/g, '-')}-${urlHash}`;

		// Check for alerts
		const alert = containsAlertKeyword(title);
		const detectText = `${title} ${description}`;
		const regionalDecision = classifyRegionalItem({ title, description, category });
		if (!regionalDecision.accepted) {
			regionalDropped += 1;
			for (const reason of regionalDecision.reasons) {
				regionalDropReasons[reason] = (regionalDropReasons[reason] || 0) + 1;
			}
			return;
		}

		items.push({
			id,
			title,
			link,
			pubDate,
			timestamp: isNaN(timestamp) ? Date.now() : timestamp,
			description: description.slice(0, 200), // Truncate description
			source: sourceName,
			category,
			isAlert: !!alert,
			alertKeyword: alert?.keyword || undefined,
			region: detectRegion(detectText) ?? undefined,
			topics: detectTopics(detectText)
		});
	});

	if ((category === 'brazil' || category === 'latam') && regionalDropped > 0) {
		logger.log(
			'Regional Filter',
			`${category}/${sourceName}: kept ${items.length}, dropped ${regionalDropped}, reasons=${JSON.stringify(regionalDropReasons)}`
		);
	}

	return items;
}

/**
 * Fetch and parse a single RSS feed
 */
async function fetchRssFeed(
	url: string,
	sourceName: string,
	category: NewsCategory,
	timeoutMs: number
): Promise<NewsItem[]> {
	try {
		logger.log('RSS', `Fetching ${sourceName}`);
		const response = await fetchWithProxy(url, {
			timeoutMs,
			accept: 'application/rss+xml, application/xml, text/xml, */*'
		});

		if (!response.ok) {
			logger.warn('RSS', `Failed to fetch ${sourceName}: ${response.status}`);
			return [];
		}

		const xml = await response.text();
		return parseRssFeed(xml, sourceName, category);
	} catch (error) {
		logger.error('RSS', `Error fetching ${sourceName}:`, error);
		return [];
	}
}

/**
 * Fetch news from RSS feeds for a category
 */
async function fetchRssNews(
	category: NewsCategory,
	options: FetchCategoryNewsOptions = {}
): Promise<NewsItem[]> {
	const timeoutMs = options.timeoutMs ?? NEWS_SOURCE_TIMEOUT_MS;
	const feeds = getEnabledSourcesForCategory(category);
	if (feeds.length === 0) {
		if ((FEEDS[category] || []).length > 0) {
			logger.warn('RSS', `No enabled feeds for ${category}`);
		} else {
			logger.warn('RSS', `No feeds configured for ${category}`);
		}
		return [];
	}

	logger.log('RSS', `Fetching ${feeds.length} feeds for ${category}`);

	// Fetch all feeds in parallel
	const results = await Promise.all(
		feeds.map((feed) => fetchRssFeed(feed.url, feed.name, category, timeoutMs))
	);

	// Combine all items and sort by timestamp (newest first)
	const allItems = results.flat();
	allItems.sort((a, b) => b.timestamp - a.timestamp);

	logger.log('RSS', `Got ${allItems.length} items for ${category}`);
	return allItems;
}

/**
 * Parse GDELT date format (20251202T224500Z) to valid Date
 */
function parseGdeltDate(dateStr: string): Date {
	if (!dateStr) return new Date();
	// Convert 20251202T224500Z to 2025-12-02T22:45:00Z
	const match = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
	if (match) {
		const [, year, month, day, hour, min, sec] = match;
		return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
	}
	// Fallback to standard parsing
	return new Date(dateStr);
}

interface GdeltArticle {
	title: string;
	url: string;
	seendate: string;
	domain: string;
	socialimage?: string;
}

interface GdeltResponse {
	articles?: GdeltArticle[];
}

/**
 * Transform GDELT article to NewsItem
 */
function transformGdeltArticle(
	article: GdeltArticle,
	category: NewsCategory,
	source: string,
	index: number
): NewsItem {
	const title = article.title || '';
	const alert = containsAlertKeyword(title);
	// Generate unique ID using category, URL hash, and index
	const urlHash = article.url ? hashCode(article.url) : Math.random().toString(36).slice(2);
	const uniqueId = `gdelt-${category}-${urlHash}-${index}`;

	const parsedDate = parseGdeltDate(article.seendate);

	return {
		id: uniqueId,
		title,
		link: article.url,
		pubDate: article.seendate,
		timestamp: parsedDate.getTime(),
		source: source || article.domain || 'Unknown',
		category,
		isAlert: !!alert,
		alertKeyword: alert?.keyword || undefined,
		region: detectRegion(title) ?? undefined,
		topics: detectTopics(title)
	};
}

/** GDELT query keywords for each category */
const GDELT_QUERIES: Record<NewsCategory, string> = {
	politics: '(politics OR government OR election OR congress)',
	tech: '(technology OR software OR startup OR "silicon valley")',
	finance: '(finance OR "stock market" OR economy OR banking)',
	gov: '("federal government" OR "white house" OR congress OR regulation)',
	ai: '("artificial intelligence" OR "machine learning" OR AI OR ChatGPT)',
	intel: '(intelligence OR security OR military OR defense)',
	brazil: '(Brazil OR Brasilia OR "Sao Paulo" OR Lula OR Bolsonaro)',
	latam: '("Latin America" OR Mexico OR Argentina OR Colombia OR Chile OR Peru)',
	iran: '(Iran OR Tehran OR IRGC OR Khamenei OR "Iranian government" OR "Persian Gulf")',
	venezuela: '(Venezuela OR Maduro OR Caracas OR "Venezuelan government" OR "Venezuelan crisis")',
	greenland:
		'(Greenland OR Arctic OR "Danish territory" OR Nuuk OR "Arctic council" OR "polar region")',
	fringe: '(conspiracy OR "deep state" OR "globalist agenda")'
};

/**
 * Fetch news from GDELT for a category
 */
async function fetchGdeltNews(
	category: NewsCategory,
	options: FetchCategoryNewsOptions = {}
): Promise<NewsItem[]> {
	try {
		const timeoutMs = options.timeoutMs ?? NEWS_SOURCE_TIMEOUT_MS;
		const baseQuery = GDELT_QUERIES[category];
		const fullQuery = `${baseQuery} sourcelang:english`;

		// Build the raw GDELT URL with 7 day timespan
		const encodedQuery = encodeURIComponent(fullQuery);
		const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodedQuery}&timespan=7d&mode=artlist&maxrecords=50&format=json&sort=date`;

		logger.log('GDELT', `Fetching ${category}`);

		const response = await fetchWithProxy(gdeltUrl, { timeoutMs, accept: 'application/json' });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		// Check content type before parsing as JSON
		const contentType = response.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			logger.warn('GDELT', `Non-JSON response for ${category}:`, contentType);
			return [];
		}

		const text = await response.text();
		let data: GdeltResponse;
		try {
			data = JSON.parse(text);
		} catch {
			logger.warn('GDELT', `Invalid JSON for ${category}:`, text.slice(0, 100));
			return [];
		}

		if (!data?.articles) return [];

		return data.articles.map((article, index) =>
			transformGdeltArticle(article, category, article.domain || 'News', index)
		);
	} catch (error) {
		logger.error('GDELT', `Error fetching ${category}:`, error);
		return [];
	}
}

/**
 * Filter items to last N days
 */
function filterByAge(items: NewsItem[], maxAgeDays: number): NewsItem[] {
	const now = Date.now();
	const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
	return items.filter((item) => now - item.timestamp <= maxAge);
}

/**
 * Fetch news for a specific category
 * Uses RSS feeds, GDELT, or both depending on category configuration
 */
export async function fetchCategoryNews(
	category: NewsCategory,
	options: FetchCategoryNewsOptions = {}
): Promise<NewsItem[]> {
	// RSS only categories
	if (RSS_ONLY_CATEGORIES.includes(category)) {
		const items = await fetchRssNews(category, options);
		return filterByAge(items, NEWS_MAX_AGE_DAYS).sort((a, b) => b.timestamp - a.timestamp);
	}

	// RSS + GDELT categories
	if (RSS_PLUS_GDELT_CATEGORIES.includes(category)) {
		// Fetch both in parallel
		const [rssItems, gdeltItems] = await Promise.all([
			fetchRssNews(category, options),
			fetchGdeltNews(category, options)
		]);

		// Combine, filter by age, and sort
		const allItems = [...rssItems, ...gdeltItems];
		logger.log(
			'News API',
			`${category}: ${rssItems.length} RSS + ${gdeltItems.length} GDELT = ${allItems.length} total`
		);

		return filterByAge(allItems, NEWS_MAX_AGE_DAYS).sort((a, b) => b.timestamp - a.timestamp);
	}

	// GDELT only (default)
	const items = await fetchGdeltNews(category, options);
	return filterByAge(items, NEWS_MAX_AGE_DAYS).sort((a, b) => b.timestamp - a.timestamp);
}

/** All news categories in fetch order */
const NEWS_CATEGORIES: NewsCategory[] = [
	'politics',
	'tech',
	'finance',
	'gov',
	'ai',
	'intel',
	'brazil',
	'latam',
	'iran',
	'venezuela',
	'greenland'
];

/** Create an empty news result object */
function createEmptyNewsResult(): Record<NewsCategory, NewsItem[]> {
	return {
		politics: [],
		tech: [],
		finance: [],
		gov: [],
		ai: [],
		intel: [],
		brazil: [],
		latam: [],
		iran: [],
		venezuela: [],
		greenland: [],
		fringe: []
	};
}

function getCachedCategoryNews(
	category: NewsCategory,
	sourceSignature: string
): { items: NewsItem[]; stale: boolean; source: 'memory' | 'storage' } | null {
	const key = getCategoryCacheKey(category, sourceSignature);
	const cached = cacheManager.get<NewsItem[]>(key);
	if (!cached) return null;
	return {
		items: cached.data,
		stale: cached.isStale,
		source: cached.fromCache
	};
}

function setCachedCategoryNews(
	category: NewsCategory,
	sourceSignature: string,
	items: NewsItem[]
): void {
	const key = getCategoryCacheKey(category, sourceSignature);
	cacheManager.set(key, items, NEWS_CACHE_TTL_MS);
}

/**
 * Refresh all news with cache-first hydration and progressive background updates.
 */
export async function refreshAllNewsProgressive(
	options: RefreshAllNewsProgressiveOptions = {}
): Promise<Record<NewsCategory, NewsItem[]>> {
	const timeoutMs = options.timeoutMs ?? NEWS_SOURCE_TIMEOUT_MS;
	const categoryConcurrency = Math.max(1, options.categoryConcurrency ?? NEWS_CATEGORY_CONCURRENCY);
	const targetCategories = options.categories?.length ? options.categories : NEWS_CATEGORIES;
	const result = createEmptyNewsResult();
	const sourceSignatures = new Map<NewsCategory, string>();

	// Hydrate from cache first for instant paint.
	for (const category of targetCategories) {
		const sourceSignature = getCategorySourceSignature(category);
		sourceSignatures.set(category, sourceSignature);
		const cached = getCachedCategoryNews(category, sourceSignature);
		if (!cached) continue;
		result[category] = cached.items;
		options.onCachedCategory?.(category, cached.items, {
			stale: cached.stale,
			source: cached.source
		});
	}

	// Prefer edge aggregator delta snapshot first.
	if (options.preferEdge !== false) {
		const storedCheckpoints = getStoredCheckpoints();
		const sinceByCategory = { ...storedCheckpoints, ...(options.sinceByCategory ?? {}) };
		try {
			const edgeData = await fetchEdgeNewsSnapshot(targetCategories, sinceByCategory);
			const nextCheckpoints = { ...storedCheckpoints };

			for (const category of targetCategories) {
				const incoming = edgeData.categories?.[category] ?? [];
				const merged = mergeNewsItems(result[category], incoming);
				result[category] = merged;
				setCachedCategoryNews(category, sourceSignatures.get(category) ?? 'default', merged);
				options.onFreshCategory?.(category, merged);

				const checkpoint = edgeData.checkpoints?.[category];
				if (typeof checkpoint === 'number' && Number.isFinite(checkpoint)) {
					nextCheckpoints[category] = checkpoint;
					options.onCheckpointUpdate?.(category, checkpoint);
				} else if (merged.length > 0) {
					const inferred = merged[0].timestamp;
					nextCheckpoints[category] = inferred;
					options.onCheckpointUpdate?.(category, inferred);
				}
			}

			setStoredCheckpoints(nextCheckpoints);
			return result;
		} catch (error) {
			logger.warn('News API', 'Edge snapshot failed, falling back to direct fetch:', error);
		}
	}

	let index = 0;
	const fallbackCheckpoints = getStoredCheckpoints();
	const workers = Array.from({ length: Math.min(categoryConcurrency, targetCategories.length) }, () =>
		(async () => {
			while (index < targetCategories.length) {
				const category = targetCategories[index++];
				try {
					const items = await fetchCategoryNews(category, { timeoutMs });
					const merged = mergeNewsItems(result[category], items);
					result[category] = merged;
					setCachedCategoryNews(category, sourceSignatures.get(category) ?? 'default', merged);
					options.onFreshCategory?.(category, merged);
					if (merged.length > 0) {
						const checkpoint = merged[0].timestamp;
						fallbackCheckpoints[category] = checkpoint;
						options.onCheckpointUpdate?.(category, checkpoint);
					}
				} catch (error) {
					options.onCategoryError?.(category, error);
				}
			}
		})()
	);

	await Promise.all(workers);
	setStoredCheckpoints(fallbackCheckpoints);
	return result;
}

/**
 * Fetch all news - sequential with delays to avoid rate limiting
 */
export async function fetchAllNews(): Promise<Record<NewsCategory, NewsItem[]>> {
	const result = createEmptyNewsResult();

	for (let i = 0; i < NEWS_CATEGORIES.length; i++) {
		const category = NEWS_CATEGORIES[i];

		if (i > 0) {
			await delay(API_DELAYS.betweenCategories);
		}

		result[category] = await fetchCategoryNews(category, { timeoutMs: NEWS_SOURCE_TIMEOUT_MS });
	}

	return result;
}
