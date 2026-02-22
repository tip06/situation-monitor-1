/**
 * News API - Client-side fetching via local server API
 *
 * All RSS/GDELT fetching now happens server-side.
 * The client simply calls /api/news endpoints.
 */

import type { NewsItem, NewsCategory } from '$lib/types';
import { browser } from '$app/environment';
import { mergeNewsItems } from '$lib/shared/news-parser';

type NewsCheckpointMap = Partial<Record<NewsCategory, number>>;

const NEWS_CHECKPOINTS_STORAGE_KEY = 'newsCheckpoints';

export interface RefreshAllNewsProgressiveOptions {
	timeoutMs?: number;
	categoryConcurrency?: number;
	categories?: NewsCategory[];
	preferEdge?: boolean;
	signal?: AbortSignal;
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
 * Fetch news for a single category from the server API
 */
export async function fetchCategoryNews(
	category: NewsCategory,
	options: { since?: number; signal?: AbortSignal } = {}
): Promise<NewsItem[]> {
	const url = options.since
		? `/api/news/${category}?since=${options.since}`
		: `/api/news/${category}`;
	const res = await fetch(url, { signal: options.signal });
	if (!res.ok) throw new Error(`Server error: ${res.status}`);
	const data = await res.json();
	return data.items;
}

/**
 * Fetch all news categories from the server API (batch endpoint)
 */
export async function fetchAllNews(): Promise<Record<NewsCategory, NewsItem[]>> {
	const params = new URLSearchParams();
	params.set('categories', NEWS_CATEGORIES.join(','));
	const res = await fetch(`/api/news?${params}`);
	if (!res.ok) throw new Error(`Server error: ${res.status}`);
	const data = await res.json();

	const result = createEmptyNewsResult();
	for (const category of NEWS_CATEGORIES) {
		result[category] = data.categories?.[category] ?? [];
	}
	return result;
}

/**
 * Refresh all news with progressive loading via server API.
 * Keeps the same callback interface for backward compatibility.
 */
export async function refreshAllNewsProgressive(
	options: RefreshAllNewsProgressiveOptions = {}
): Promise<Record<NewsCategory, NewsItem[]>> {
	const targetCategories = options.categories?.length ? options.categories : NEWS_CATEGORIES;
	const result = createEmptyNewsResult();
	const signal = options.signal;

	// Get stored checkpoints for incremental fetch
	const storedCheckpoints = getStoredCheckpoints();
	const sinceByCategory = { ...storedCheckpoints, ...(options.sinceByCategory ?? {}) };

	// Batch fetch from server API
	const params = new URLSearchParams();
	params.set('categories', targetCategories.join(','));

	// Only send since if we have checkpoints
	const hasSince = Object.keys(sinceByCategory).some((k) =>
		targetCategories.includes(k as NewsCategory)
	);
	if (hasSince) {
		params.set('since', JSON.stringify(sinceByCategory));
	}

	try {
		const res = await fetch(`/api/news?${params}`, { signal });
		if (!res.ok) throw new Error(`Server error: ${res.status}`);

		const data: {
			categories: Record<string, NewsItem[]>;
			checkpoints: Record<string, number>;
		} = await res.json();

		const nextCheckpoints = { ...storedCheckpoints };

		for (const category of targetCategories) {
			const incoming = data.categories?.[category] ?? [];
			const merged = mergeNewsItems(result[category], incoming);
			result[category] = merged;
			options.onFreshCategory?.(category, merged);

			const checkpoint = data.checkpoints?.[category];
			if (typeof checkpoint === 'number' && Number.isFinite(checkpoint)) {
				nextCheckpoints[category] = checkpoint;
				options.onCheckpointUpdate?.(category, checkpoint);
			}
		}

		setStoredCheckpoints(nextCheckpoints);
	} catch (error) {
		if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
			throw error;
		}
		// Fall back to per-category fetch
		for (const category of targetCategories) {
			if (signal?.aborted) {
				throw new DOMException('Request aborted', 'AbortError');
			}
			try {
				const since = sinceByCategory[category];
				const items = await fetchCategoryNews(category, { since, signal });
				const merged = mergeNewsItems(result[category], items);
				result[category] = merged;
				options.onFreshCategory?.(category, merged);

				if (merged.length > 0) {
					storedCheckpoints[category] = merged[0].timestamp;
					options.onCheckpointUpdate?.(category, merged[0].timestamp);
				}
			} catch (catError) {
				options.onCategoryError?.(category, catError);
			}
		}
		setStoredCheckpoints(storedCheckpoints);
	}

	return result;
}
