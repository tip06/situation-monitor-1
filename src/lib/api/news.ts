/**
 * News API - Fetch news from RSS feeds and GDELT
 */

import type { NewsItem, NewsCategory } from '$lib/types';
import { FEEDS } from '$lib/config/feeds';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { fetchWithProxy, API_DELAYS, logger } from '$lib/config/api';
import { classifyRegionalItem } from '$lib/utils/regional-filter';
import { getEnabledSourcesForCategory } from '$lib/stores/sources';

/** Categories that use RSS feeds only (no GDELT) */
const RSS_ONLY_CATEGORIES: NewsCategory[] = ['politics', 'brazil', 'latam', 'finance'];

/** Categories that use both RSS feeds AND GDELT */
const RSS_PLUS_GDELT_CATEGORIES: NewsCategory[] = ['intel'];

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
	category: NewsCategory
): Promise<NewsItem[]> {
	try {
		logger.log('RSS', `Fetching ${sourceName}`);
		const response = await fetchWithProxy(url);

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
async function fetchRssNews(category: NewsCategory): Promise<NewsItem[]> {
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
		feeds.map((feed) => fetchRssFeed(feed.url, feed.name, category))
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
async function fetchGdeltNews(category: NewsCategory): Promise<NewsItem[]> {
	try {
		const baseQuery = GDELT_QUERIES[category];
		const fullQuery = `${baseQuery} sourcelang:english`;

		// Build the raw GDELT URL with 7 day timespan
		const encodedQuery = encodeURIComponent(fullQuery);
		const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodedQuery}&timespan=7d&mode=artlist&maxrecords=50&format=json&sort=date`;

		logger.log('GDELT', `Fetching ${category}`);

		const response = await fetchWithProxy(gdeltUrl);
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
export async function fetchCategoryNews(category: NewsCategory): Promise<NewsItem[]> {
	// RSS only categories
	if (RSS_ONLY_CATEGORIES.includes(category)) {
		const items = await fetchRssNews(category);
		return filterByAge(items, 7).sort((a, b) => b.timestamp - a.timestamp);
	}

	// RSS + GDELT categories
	if (RSS_PLUS_GDELT_CATEGORIES.includes(category)) {
		// Fetch both in parallel
		const [rssItems, gdeltItems] = await Promise.all([
			fetchRssNews(category),
			fetchGdeltNews(category)
		]);

		// Combine, filter by age, and sort
		const allItems = [...rssItems, ...gdeltItems];
		logger.log(
			'News API',
			`${category}: ${rssItems.length} RSS + ${gdeltItems.length} GDELT = ${allItems.length} total`
		);

		return filterByAge(allItems, 7).sort((a, b) => b.timestamp - a.timestamp);
	}

	// GDELT only (default)
	const items = await fetchGdeltNews(category);
	return filterByAge(items, 7).sort((a, b) => b.timestamp - a.timestamp);
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

		result[category] = await fetchCategoryNews(category);
	}

	return result;
}
