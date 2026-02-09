/**
 * Miscellaneous API functions for specialized panels
 * Note: Some of these use mock data as the original APIs require authentication
 */

import { cacheManager } from '$lib/services/cache';
import { CORS_PROXIES } from '$lib/config/api';

export type PredictionCategory = 'politics' | 'geopolitics' | 'tech' | 'finance' | 'elections';

export interface Prediction {
	id: string;
	question: string;
	yes: number;
	volume: number;
	volume24hr?: number;
	url: string;
	endDate?: string;
	category: PredictionCategory;
}

// Polymarket API types
interface PolymarketMarket {
	id: string;
	question: string;
	slug: string;
	events?: { slug: string }[];
	volumeNum: number;
	volume24hr: number;
	outcomePrices: string; // JSON string like '["0.65","0.35"]'
	outcomes: string; // JSON string like '["Yes","No"]'
	endDate: string;
}

// Reliable tag IDs for fetching markets
const POLYMARKET_FETCH_TAGS = [2, 100265, 120, 100056, 100001]; // politics, geopolitics, finance, tech, elections

// Keywords for categorizing markets by content
const CATEGORY_KEYWORDS: Record<PredictionCategory, RegExp> = {
	elections: /\b(election|vote|ballot|primary|electoral|polling|candidate|democrat|republican|GOP|senate|congress|governor|mayor|presidency|presidential)\b/i,
	geopolitics: /\b(war|invasion|military|NATO|UN|sanction|treaty|border|conflict|nuclear|missile|troops|ceasefire|territory|occupation|China|Russia|Ukraine|Taiwan|Israel|Gaza|Iran|Korea|Syria)\b/i,
	tech: /\b(AI|artificial intelligence|GPT|OpenAI|Anthropic|Google|Apple|Microsoft|Meta|Amazon|Tesla|SpaceX|crypto|bitcoin|ethereum|blockchain|chip|semiconductor|quantum|robot)\b/i,
	finance: /\b(Fed|interest rate|inflation|GDP|recession|stock|S&P|Nasdaq|Dow|bond|treasury|bank|economy|trade|tariff|debt|default|market|dollar|euro|yuan)\b/i,
	politics: /\b(Trump|Biden|president|White House|Congress|Senate|House|Supreme Court|DOJ|FBI|CIA|policy|legislation|bill|law|government|federal|executive order)\b/i
};

/**
 * Categorize a market question based on keyword matching
 * Returns the first matching category, with politics as fallback
 */
function categorizeMarket(question: string): PredictionCategory {
	// Check in priority order: elections, geopolitics, tech, finance, politics
	const categoryOrder: PredictionCategory[] = ['elections', 'geopolitics', 'tech', 'finance', 'politics'];

	for (const category of categoryOrder) {
		if (CATEGORY_KEYWORDS[category].test(question)) {
			return category;
		}
	}

	return 'politics'; // Default fallback
}

// Patterns to exclude (sports, meme coins, entertainment)
const EXCLUDED_PATTERNS = [
	/\b(NFL|NBA|MLB|NHL|soccer|football|tennis|golf|boxing|UFC|MMA|F1|NASCAR|Premier League|Champions League|World Cup|Super Bowl|playoffs|championship)\b/i,
	/\b(meme ?coin|shib|doge|pepe|bonk|floki)\b/i,
	/\b(movie|tv show|grammy|oscar|emmy|golden globe|billboard|spotify|netflix|disney|marvel)\b/i,
	/\b(tiktok|youtube|streamer|influencer|pewdiepie|mrbeast)\b/i,
	/\b(bachelor|bachelorette|survivor|big brother|american idol|the voice)\b/i
];

const POLYMARKET_CACHE_KEY = 'polymarket_predictions';
const POLYMARKET_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface WhaleTransaction {
	coin: string;
	amount: number;
	usd: number;
	hash: string;
}

export interface Contract {
	agency: string;
	description: string;
	vendor: string;
	amount: number;
}

export interface Layoff {
	company: string;
	count: number;
	title: string;
	date: string;
}

/**
 * Check if a market question should be excluded based on content patterns
 */
function shouldExcludeMarket(question: string): boolean {
	return EXCLUDED_PATTERNS.some((pattern) => pattern.test(question));
}

/**
 * Parse outcome prices from Polymarket API response
 * Returns the "Yes" probability as a percentage (0-100)
 */
function parseYesProbability(outcomePrices: string, outcomes: string): number {
	try {
		const prices = JSON.parse(outcomePrices) as string[];
		const outcomeNames = JSON.parse(outcomes) as string[];

		// Find the "Yes" outcome index
		const yesIndex = outcomeNames.findIndex(
			(o) => o.toLowerCase() === 'yes' || o.toLowerCase() === 'yes '
		);

		if (yesIndex !== -1 && prices[yesIndex]) {
			return Math.round(parseFloat(prices[yesIndex]) * 100);
		}

		// If no "Yes" outcome, return the first outcome's price
		if (prices[0]) {
			return Math.round(parseFloat(prices[0]) * 100);
		}

		return 0;
	} catch {
		return 0;
	}
}

/**
 * Fetch with Polymarket-compatible CORS proxy
 * The main proxy whitelist doesn't include Polymarket, so we use alternatives
 */
async function fetchPolymarketWithProxy(url: string): Promise<Response> {
	const encodedUrl = encodeURIComponent(url);

	// Try primary proxy first (in case whitelist is updated)
	try {
		const proxyUrl = CORS_PROXIES.primary + encodedUrl;
		const response = await fetch(proxyUrl);
		if (response.ok) {
			return response;
		}
		// Check if domain not allowed error
		const text = await response.text();
		if (text.includes('Domain not allowed')) {
			console.warn('Polymarket: Primary proxy domain not whitelisted, trying fallback');
		}
	} catch (e) {
		console.warn('Polymarket: Primary proxy failed:', e);
	}

	// Fallback to corsproxy.io (works from browser, not server-side)
	const fallbackUrl = CORS_PROXIES.fallback + encodedUrl;
	return fetch(fallbackUrl);
}

/**
 * Fetch markets from Polymarket Gamma API for a specific tag
 */
async function fetchMarketsForTag(tagId: number, limit = 25): Promise<PolymarketMarket[]> {
	const url = new URL('https://gamma-api.polymarket.com/markets');
	url.searchParams.set('tag_id', tagId.toString());
	url.searchParams.set('closed', 'false');
	url.searchParams.set('order', 'volumeNum');
	url.searchParams.set('ascending', 'false');
	url.searchParams.set('limit', limit.toString());

	// Use CORS proxy for browser requests
	const response = await fetchPolymarketWithProxy(url.toString());

	if (!response.ok) {
		throw new Error(`Polymarket API error: ${response.status}`);
	}

	return response.json();
}

/**
 * Fetch Polymarket predictions from the Gamma API
 * Fetches from multiple tags and categorizes by question content
 */
export async function fetchPolymarket(): Promise<Prediction[]> {
	// Check cache first
	const cached = cacheManager.get<Prediction[]>(POLYMARKET_CACHE_KEY);
	if (cached && !cached.isStale) {
		return cached.data;
	}

	try {
		// Fetch from reliable tags in parallel
		const tagResults = await Promise.allSettled(
			POLYMARKET_FETCH_TAGS.map((tagId) => fetchMarketsForTag(tagId, 50))
		);

		// Combine results, filtering out failed requests and deduplicating
		const allMarkets: PolymarketMarket[] = [];
		const seenIds = new Set<string>();

		for (const result of tagResults) {
			if (result.status === 'fulfilled') {
				for (const market of result.value) {
					if (!seenIds.has(market.id)) {
						seenIds.add(market.id);
						allMarkets.push(market);
					}
				}
			}
		}

		// Filter out excluded content and transform to Prediction format
		// Categorize each market based on question keywords
		const predictions: Prediction[] = allMarkets
			.filter((market) => !shouldExcludeMarket(market.question))
			.map((market) => ({
				id: market.id,
				question: market.question,
				yes: parseYesProbability(market.outcomePrices, market.outcomes),
				volume: market.volumeNum || 0,
				volume24hr: market.volume24hr || 0,
				url: `https://polymarket.com/event/${market.events?.[0]?.slug || market.slug}`,
				endDate: market.endDate,
				category: categorizeMarket(market.question)
			}))
			// Sort by volume (highest first) and take top 75
			.sort((a, b) => b.volume - a.volume)
			.slice(0, 75);

		// Cache successful results
		cacheManager.set(POLYMARKET_CACHE_KEY, predictions, POLYMARKET_CACHE_TTL);

		return predictions;
	} catch (error) {
		console.error('Polymarket fetch error:', error);

		// On error, return stale cache if available
		if (cached) {
			console.warn('Polymarket API failed, using stale cache');
			return cached.data;
		}

		// Return empty array instead of throwing to avoid panel error state
		console.warn('Polymarket API failed with no cache, returning empty');
		return [];
	}
}

/**
 * Fetch whale transactions
 * Note: Would use Whale Alert API - returning sample data
 */
export async function fetchWhaleTransactions(): Promise<WhaleTransaction[]> {
	// Sample whale transaction data
	return [
		{ coin: 'BTC', amount: 1500, usd: 150000000, hash: '0x1a2b...3c4d' },
		{ coin: 'ETH', amount: 25000, usd: 85000000, hash: '0x5e6f...7g8h' },
		{ coin: 'BTC', amount: 850, usd: 85000000, hash: '0x9i0j...1k2l' },
		{ coin: 'SOL', amount: 500000, usd: 75000000, hash: '0x3m4n...5o6p' },
		{ coin: 'ETH', amount: 15000, usd: 51000000, hash: '0x7q8r...9s0t' }
	];
}

/**
 * Fetch government contracts
 * Note: Would use USASpending.gov API - returning sample data
 */
export async function fetchGovContracts(): Promise<Contract[]> {
	// Sample government contract data
	return [
		{
			agency: 'DOD',
			description: 'Advanced radar systems development and integration',
			vendor: 'Raytheon',
			amount: 2500000000
		},
		{
			agency: 'NASA',
			description: 'Artemis program lunar lander support services',
			vendor: 'SpaceX',
			amount: 1800000000
		},
		{
			agency: 'DHS',
			description: 'Border security technology modernization',
			vendor: 'Palantir',
			amount: 450000000
		},
		{
			agency: 'VA',
			description: 'Electronic health records system upgrade',
			vendor: 'Oracle Cerner',
			amount: 320000000
		},
		{
			agency: 'DOE',
			description: 'Clean energy grid infrastructure',
			vendor: 'General Electric',
			amount: 275000000
		}
	];
}

/**
 * Fetch layoffs data
 * Note: Would use layoffs.fyi API or similar - returning sample data
 */
export async function fetchLayoffs(): Promise<Layoff[]> {
	const now = new Date();
	const formatDate = (daysAgo: number) => {
		const d = new Date(now);
		d.setDate(d.getDate() - daysAgo);
		return d.toISOString();
	};

	return [
		{ company: 'Meta', count: 1200, title: 'Restructuring engineering teams', date: formatDate(2) },
		{ company: 'Amazon', count: 850, title: 'AWS division optimization', date: formatDate(5) },
		{
			company: 'Salesforce',
			count: 700,
			title: 'Post-acquisition consolidation',
			date: formatDate(8)
		},
		{
			company: 'Intel',
			count: 1500,
			title: 'Manufacturing pivot restructure',
			date: formatDate(12)
		},
		{ company: 'Snap', count: 500, title: 'Cost reduction initiative', date: formatDate(15) }
	];
}
