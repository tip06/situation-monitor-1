/**
 * Server-side data fetching module
 * Fetches RSS feeds directly (no CORS proxy needed), GDELT, Finnhub, CoinGecko
 */

import type { NewsItem, NewsCategory, MarketItem, SectorPerformance, CryptoItem } from '$lib/types';
import { FEEDS, type FeedSource } from '$lib/config/feeds';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { classifyRegionalItem } from '$lib/utils/regional-filter';
import {
	hashCode,
	transformGdeltArticle,
	filterByAge,
	GDELT_QUERIES,
	RSS_ONLY_CATEGORIES,
	RSS_PLUS_GDELT_CATEGORIES,
	type GdeltResponse
} from '$lib/shared/news-parser';
import { INDICES, SECTORS, COMMODITIES, CRYPTO } from '$lib/config/markets';
import {
	CircuitBreaker,
	CircuitBreakerRegistry
} from '$lib/services/circuit-breaker';
import {
	upsertNewsItems,
	setMarketData,
	getMeta,
	setMeta
} from './db';

// --- Configuration ---

const FEED_TIMEOUT_MS = 8000;
const FEED_CONCURRENCY = 5;
const FINNHUB_TIMEOUT_MS = 10000;
const FINNHUB_STAGGER_MS = 100;
const NEWS_MAX_AGE_DAYS = 7;
const BETWEEN_CATEGORIES_DELAY_MS = 500;
const FEED_HEALTH_MAX_FAILURES = 5;
const FEED_HEALTH_RETRY_AFTER_MS = 60 * 60 * 1000; // 1 hour

const FINNHUB_API_KEY = process.env.VITE_FINNHUB_API_KEY ?? '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// --- Circuit Breakers ---

const feedBreakerRegistry = new CircuitBreakerRegistry();
const finnhubBreaker = new CircuitBreaker('finnhub', {
	failureThreshold: 3,
	resetTimeout: 60000
});

// --- Utilities ---

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, timeoutMs: number, accept?: string): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, {
			signal: controller.signal,
			headers: accept ? { Accept: accept } : undefined
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Promise pool - limits concurrency for a list of async tasks
 */
async function promisePool<T>(
	tasks: (() => Promise<T>)[],
	concurrency: number
): Promise<T[]> {
	const results: T[] = [];
	let index = 0;

	const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
		while (index < tasks.length) {
			const i = index++;
			results[i] = await tasks[i]();
		}
	});

	await Promise.all(workers);
	return results;
}

// --- Feed Health Tracking ---

export interface FeedHealthInfo {
	lastAttempt: number;
	lastSuccess: number;
	consecutiveFailures: number;
	avgResponseTimeMs: number;
	lastError: string | null;
	totalRequests: number;
	totalSuccesses: number;
}

function getFeedHealthKey(category: string, sourceName: string): string {
	return `feedHealth:${category}:${sourceName}`;
}

function getFeedHealth(category: string, sourceName: string): FeedHealthInfo {
	const meta = getMeta<FeedHealthInfo>(getFeedHealthKey(category, sourceName));
	return meta?.value ?? {
		lastAttempt: 0,
		lastSuccess: 0,
		consecutiveFailures: 0,
		avgResponseTimeMs: 0,
		lastError: null,
		totalRequests: 0,
		totalSuccesses: 0
	};
}

function updateFeedHealth(
	category: string,
	sourceName: string,
	success: boolean,
	responseTimeMs: number,
	error?: string
): void {
	const health = getFeedHealth(category, sourceName);
	health.lastAttempt = Date.now();
	health.totalRequests++;

	if (success) {
		health.lastSuccess = Date.now();
		health.consecutiveFailures = 0;
		health.totalSuccesses++;
		health.lastError = null;
		// Rolling average
		health.avgResponseTimeMs =
			health.totalSuccesses === 1
				? responseTimeMs
				: health.avgResponseTimeMs * 0.8 + responseTimeMs * 0.2;
	} else {
		health.consecutiveFailures++;
		health.lastError = error ?? 'Unknown error';
	}

	setMeta(getFeedHealthKey(category, sourceName), health);
}

function shouldSkipFeed(category: string, sourceName: string): boolean {
	const health = getFeedHealth(category, sourceName);
	if (health.consecutiveFailures < FEED_HEALTH_MAX_FAILURES) return false;
	// Retry after cooldown
	return Date.now() - health.lastAttempt < FEED_HEALTH_RETRY_AFTER_MS;
}

// --- RSS Parsing (server-side, no DOMParser) ---

function parseRssFeedXml(xml: string, sourceName: string, category: NewsCategory): NewsItem[] {
	const items: NewsItem[] = [];

	// Simple regex-based XML parsing for server-side (no DOMParser)
	// Extract items from RSS 2.0 <item> or Atom <entry>
	const itemRegex = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
	let match;

	while ((match = itemRegex.exec(xml)) !== null) {
		const content = match[1] || match[2];
		if (!content) continue;

		const title = extractTag(content, 'title');
		const pubDate =
			extractTag(content, 'pubDate') ||
			extractTag(content, 'published') ||
			extractTag(content, 'updated');
		let description =
			extractTag(content, 'description') ||
			extractTag(content, 'summary') ||
			extractTag(content, 'content');

		// Extract link: try href attribute first (Atom), then tag content (RSS 2.0)
		let link = extractLinkHref(content) || extractTag(content, 'link');

		if (!title || !link) continue;

		const timestamp = pubDate ? new Date(pubDate).getTime() : Date.now();
		const urlHash = hashCode(link);
		const id = `rss-${category}-${sourceName.toLowerCase().replace(/\s+/g, '-')}-${urlHash}`;

		const alert = containsAlertKeyword(title);
		const cleanDesc = description ? stripHtml(description).slice(0, 200) : undefined;
		const detectText = `${title} ${cleanDesc ?? ''}`;

		const regionalDecision = classifyRegionalItem({ title, description: cleanDesc, category });
		if (!regionalDecision.accepted) continue;

		items.push({
			id,
			title: stripHtml(title),
			link,
			pubDate: pubDate ?? undefined,
			timestamp: isNaN(timestamp) ? Date.now() : timestamp,
			description: cleanDesc,
			source: sourceName,
			category,
			isAlert: !!alert,
			alertKeyword: alert?.keyword || undefined,
			region: detectRegion(detectText) ?? undefined,
			topics: detectTopics(detectText)
		});
	}

	return items;
}

function extractTag(xml: string, tag: string): string | null {
	// Handle CDATA sections
	const cdataRegex = new RegExp(
		`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
		'i'
	);
	const cdataMatch = xml.match(cdataRegex);
	if (cdataMatch) return cdataMatch[1].trim();

	const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
	const match = xml.match(regex);
	return match ? match[1].trim() : null;
}

function extractLinkHref(xml: string): string | null {
	// Match <link> tags with href attribute (Atom format, including self-closing)
	// Prefer rel="alternate" if available, otherwise take the first one
	const alternateMatch = xml.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i)
		|| xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/i);
	if (alternateMatch) return alternateMatch[1];

	const anyMatch = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
	return anyMatch ? anyMatch[1] : null;
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// --- Server-side RSS fetching ---

async function fetchRssFeedServer(
	url: string,
	sourceName: string,
	category: NewsCategory,
	timeoutMs: number = FEED_TIMEOUT_MS
): Promise<NewsItem[]> {
	if (shouldSkipFeed(category, sourceName)) {
		return [];
	}

	const breaker = feedBreakerRegistry.get(`feed:${category}:${sourceName}`, {
		failureThreshold: 2,
		resetTimeout: 300000 // 5 min
	});

	if (!breaker.canRequest()) {
		return [];
	}

	const start = Date.now();
	try {
		// Direct fetch - no CORS proxy needed on server!
		const response = await fetchWithTimeout(url, timeoutMs, 'application/rss+xml, application/xml, text/xml, */*');

		if (!response.ok) {
			breaker.recordFailure();
			updateFeedHealth(category, sourceName, false, Date.now() - start, `HTTP ${response.status}`);
			return [];
		}

		const xml = await response.text();
		const items = parseRssFeedXml(xml, sourceName, category);
		if (items.length > 0) {
			console.log(`[Fetcher] ${category}/${sourceName}: ${items.length} items`);
		} else {
			console.warn(`[Fetcher] ${category}/${sourceName}: 0 items (xml length: ${xml.length})`);
		}
		breaker.recordSuccess();
		updateFeedHealth(category, sourceName, true, Date.now() - start);
		return items;
	} catch (error) {
		breaker.recordFailure();
		const msg = error instanceof Error ? error.message : String(error);
		updateFeedHealth(category, sourceName, false, Date.now() - start, msg);
		return [];
	}
}

// --- Server-side GDELT fetching ---

async function fetchGdeltNewsServer(
	category: NewsCategory,
	timespanMinutes?: number
): Promise<NewsItem[]> {
	try {
		const baseQuery = GDELT_QUERIES[category];
		const fullQuery = `${baseQuery} sourcelang:english`;
		const encodedQuery = encodeURIComponent(fullQuery);

		// Use delta if we have a checkpoint
		let timespan = '7d';
		if (timespanMinutes && timespanMinutes < 7 * 24 * 60) {
			timespan = `${timespanMinutes}min`;
		}

		const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodedQuery}&timespan=${timespan}&mode=artlist&maxrecords=50&format=json&sort=date`;

		const response = await fetchWithTimeout(gdeltUrl, FEED_TIMEOUT_MS, 'application/json');
		if (!response.ok) return [];

		const contentType = response.headers.get('content-type');
		if (!contentType?.includes('application/json')) return [];

		const text = await response.text();
		let data: GdeltResponse;
		try {
			data = JSON.parse(text);
		} catch {
			return [];
		}

		if (!data?.articles) return [];

		return data.articles.map((article, index) =>
			transformGdeltArticle(article, category, article.domain || 'News', index)
		);
	} catch {
		return [];
	}
}

// --- Category fetching ---

export async function fetchCategoryNewsServer(
	category: NewsCategory,
	feeds?: FeedSource[]
): Promise<NewsItem[]> {
	const categoryFeeds = feeds ?? FEEDS[category] ?? [];

	// Build RSS fetch tasks with concurrency pool
	const rssTasks = categoryFeeds.map(
		(feed) => () => fetchRssFeedServer(feed.url, feed.name, category)
	);
	const rssResults = await promisePool(rssTasks, FEED_CONCURRENCY);
	const rssItems = rssResults.flat();

	let allItems = rssItems;

	// Add GDELT if needed
	if (RSS_PLUS_GDELT_CATEGORIES.includes(category)) {
		// Check checkpoint for delta query
		const checkpoint = getMeta<number>(`checkpoint:${category}`);
		let timespanMinutes: number | undefined;
		if (checkpoint) {
			timespanMinutes = Math.max(15, Math.ceil((Date.now() - checkpoint.updatedAt) / 60000));
		}
		const gdeltItems = await fetchGdeltNewsServer(category, timespanMinutes);
		allItems = [...rssItems, ...gdeltItems];
	} else if (!RSS_ONLY_CATEGORIES.includes(category)) {
		// GDELT-only categories
		const checkpoint = getMeta<number>(`checkpoint:${category}`);
		let timespanMinutes: number | undefined;
		if (checkpoint) {
			timespanMinutes = Math.max(15, Math.ceil((Date.now() - checkpoint.updatedAt) / 60000));
		}
		const gdeltItems = await fetchGdeltNewsServer(category, timespanMinutes);
		allItems = [...rssItems, ...gdeltItems];
	}

	const filtered = filterByAge(allItems, NEWS_MAX_AGE_DAYS);
	filtered.sort((a, b) => b.timestamp - a.timestamp);

	// Store in SQLite
	if (filtered.length > 0) {
		upsertNewsItems(filtered);
		setMeta(`checkpoint:${category}`, filtered[0].timestamp);
	}

	return filtered;
}

// --- Market data fetching ---

interface FinnhubQuote {
	c: number;
	d: number;
	dp: number;
	h: number;
	l: number;
	o: number;
	pc: number;
	t: number;
}

const INDEX_ETF_MAP: Record<string, string> = {
	'^DJI': 'DIA',
	'^GSPC': 'SPY',
	'^IXIC': 'QQQ',
	'^RUT': 'IWM'
};

const COMMODITY_SYMBOL_MAP: Record<string, string> = {
	'^VIX': 'VIXY',
	'GC=F': 'GLD',
	'CL=F': 'USO',
	'NG=F': 'UNG',
	'SI=F': 'SLV',
	'HG=F': 'CPER'
};

async function fetchFinnhubQuote(symbol: string): Promise<FinnhubQuote | null> {
	if (!finnhubBreaker.canRequest()) return null;

	try {
		const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
		const response = await fetchWithTimeout(url, FINNHUB_TIMEOUT_MS);

		if (!response.ok) {
			finnhubBreaker.recordFailure();
			return null;
		}

		const data: FinnhubQuote = await response.json();
		if (data.c === 0 && data.pc === 0) return null;

		finnhubBreaker.recordSuccess();
		return data;
	} catch {
		finnhubBreaker.recordFailure();
		return null;
	}
}

async function fetchIndicesServer(): Promise<MarketItem[]> {
	if (!FINNHUB_API_KEY) {
		return INDICES.map((i) => ({
			symbol: i.symbol,
			name: i.name,
			price: NaN,
			change: NaN,
			changePercent: NaN,
			type: 'index' as const
		}));
	}

	const results: MarketItem[] = [];
	for (const index of INDICES) {
		const etfSymbol = INDEX_ETF_MAP[index.symbol] || index.symbol;
		const quote = await fetchFinnhubQuote(etfSymbol);
		results.push({
			symbol: index.symbol,
			name: index.name,
			price: quote?.c ?? NaN,
			change: quote?.d ?? NaN,
			changePercent: quote?.dp ?? NaN,
			type: 'index' as const
		});
		await delay(FINNHUB_STAGGER_MS);
	}
	return results;
}

async function fetchSectorsServer(): Promise<SectorPerformance[]> {
	if (!FINNHUB_API_KEY) {
		return SECTORS.map((s) => ({
			symbol: s.symbol,
			name: s.name,
			price: NaN,
			change: NaN,
			changePercent: NaN
		}));
	}

	const results: SectorPerformance[] = [];
	for (const sector of SECTORS) {
		const quote = await fetchFinnhubQuote(sector.symbol);
		results.push({
			symbol: sector.symbol,
			name: sector.name,
			price: quote?.c ?? NaN,
			change: quote?.d ?? NaN,
			changePercent: quote?.dp ?? NaN
		});
		await delay(FINNHUB_STAGGER_MS);
	}
	return results;
}

async function fetchCommoditiesServer(): Promise<MarketItem[]> {
	if (!FINNHUB_API_KEY) {
		return COMMODITIES.map((c) => ({
			symbol: c.symbol,
			name: c.name,
			price: NaN,
			change: NaN,
			changePercent: NaN,
			type: 'commodity' as const
		}));
	}

	const results: MarketItem[] = [];
	for (const commodity of COMMODITIES) {
		const finnhubSymbol = COMMODITY_SYMBOL_MAP[commodity.symbol] || commodity.symbol;
		const quote = await fetchFinnhubQuote(finnhubSymbol);
		results.push({
			symbol: commodity.symbol,
			name: commodity.name,
			price: quote?.c ?? NaN,
			change: quote?.d ?? NaN,
			changePercent: quote?.dp ?? NaN,
			type: 'commodity' as const
		});
		await delay(FINNHUB_STAGGER_MS);
	}
	return results;
}

interface CoinGeckoPrice {
	usd: number;
	usd_24h_change?: number;
}

async function fetchCryptoServer(): Promise<CryptoItem[]> {
	try {
		const ids = CRYPTO.map((c) => c.id).join(',');
		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
		const response = await fetchWithTimeout(url, FEED_TIMEOUT_MS);

		if (!response.ok) {
			return CRYPTO.map((c) => ({
				id: c.id,
				symbol: c.symbol,
				name: c.name,
				current_price: 0,
				price_change_24h: 0,
				price_change_percentage_24h: 0
			}));
		}

		const data: Record<string, CoinGeckoPrice> = await response.json();

		return CRYPTO.map((crypto) => {
			const priceData = data[crypto.id];
			return {
				id: crypto.id,
				symbol: crypto.symbol,
				name: crypto.name,
				current_price: priceData?.usd || 0,
				price_change_24h: priceData?.usd_24h_change || 0,
				price_change_percentage_24h: priceData?.usd_24h_change || 0
			};
		});
	} catch {
		return CRYPTO.map((c) => ({
			id: c.id,
			symbol: c.symbol,
			name: c.name,
			current_price: 0,
			price_change_24h: 0,
			price_change_percentage_24h: 0
		}));
	}
}

export interface AllMarketsServerData {
	indices: MarketItem[];
	sectors: SectorPerformance[];
	commodities: MarketItem[];
	crypto: CryptoItem[];
	updatedAt: number;
}

export async function fetchAllMarketsServer(): Promise<AllMarketsServerData> {
	// Fetch crypto in parallel with sequential Finnhub calls
	const cryptoPromise = fetchCryptoServer();

	const indices = await fetchIndicesServer();
	const sectors = await fetchSectorsServer();
	const commodities = await fetchCommoditiesServer();
	const crypto = await cryptoPromise;

	const data: AllMarketsServerData = {
		indices,
		sectors,
		commodities,
		crypto,
		updatedAt: Date.now()
	};

	// Store in SQLite
	setMarketData('indices', indices);
	setMarketData('sectors', sectors);
	setMarketData('commodities', commodities);
	setMarketData('crypto', crypto);

	return data;
}

// --- Full refresh ---

export async function refreshAllNews(
	categories?: NewsCategory[]
): Promise<{ duration: number; errors: string[] }> {
	const start = Date.now();
	const errors: string[] = [];
	const targetCategories = categories ?? (Object.keys(FEEDS) as NewsCategory[]);

	for (const category of targetCategories) {
		try {
			await fetchCategoryNewsServer(category);
		} catch (error) {
			const msg = `${category}: ${error instanceof Error ? error.message : String(error)}`;
			errors.push(msg);
		}
		await delay(BETWEEN_CATEGORIES_DELAY_MS);
	}

	return { duration: Date.now() - start, errors };
}

// --- Health info ---

export function getAllFeedHealth(): Record<string, FeedHealthInfo> {
	const result: Record<string, FeedHealthInfo> = {};
	for (const [category, feeds] of Object.entries(FEEDS)) {
		for (const feed of feeds) {
			const key = `${category}/${feed.name}`;
			result[key] = getFeedHealth(category, feed.name);
		}
	}
	return result;
}

export function getCircuitBreakerStatus(): Record<string, ReturnType<CircuitBreaker['getState']>> {
	return {
		finnhub: finnhubBreaker.getState(),
		...feedBreakerRegistry.getStatus()
	};
}
