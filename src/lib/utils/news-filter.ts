/**
 * News filtering utilities for deduplication, sorting, and limiting
 */

import type { NewsItem } from '$lib/types';

export interface FilterOptions {
	maxItems?: number; // Default: 10
	maxAgeDays?: number; // Default: 7
	maxSources?: number; // Default: 5 (prioritize variety from N sources)
}

const KRYPT3IA_SOURCE_PATTERN = /krypt3ia/i;

/**
 * Some feeds publish without usable item dates. Krypt3ia is one of them, and
 * the fetch fallback stamps every item as "now", which otherwise pins the
 * source to the top of every feed on refresh.
 */
export function getNewsSortTimestamp(item: NewsItem): number {
	if (!KRYPT3IA_SOURCE_PATTERN.test(item.source)) {
		return item.timestamp;
	}

	if (!item.pubDate) {
		return 0;
	}

	const parsed = new Date(item.pubDate).getTime();
	return Number.isFinite(parsed) ? parsed : 0;
}

export function sortNewsNewestFirst<T extends NewsItem>(items: T[]): T[] {
	return items.sort((a, b) => getNewsSortTimestamp(b) - getNewsSortTimestamp(a));
}

/**
 * Calculate word-based Jaccard similarity between two strings
 * Filters out short words to focus on meaningful content
 */
export function titleSimilarity(a: string, b: string): number {
	const wordsA = new Set(
		a
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => w.length > 3)
	);
	const wordsB = new Set(
		b
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => w.length > 3)
	);

	const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
	const union = new Set([...wordsA, ...wordsB]).size;

	return union === 0 ? 0 : intersection / union;
}

/**
 * Deduplicate news items by title similarity
 * Keeps the most recent version when duplicates are found
 *
 * @param items - Array of news items to deduplicate
 * @param threshold - Similarity threshold (0-1), default 0.6
 * @returns Deduplicated array of news items
 */
export function deduplicateNews(items: NewsItem[], threshold: number = 0.6): NewsItem[] {
	// Sort by timestamp first (newest first) so we keep the most recent
	const sorted = sortNewsNewestFirst([...items]);

	const deduplicated: NewsItem[] = [];
	for (const item of sorted) {
		const isDuplicate = deduplicated.some(
			(existing) => titleSimilarity(existing.title, item.title) > threshold
		);
		if (!isDuplicate) {
			deduplicated.push(item);
		}
	}

	return deduplicated;
}

/**
 * Filter, deduplicate, sort, and limit news items
 *
 * @param items - Array of news items to filter
 * @param options - Filter configuration
 * @returns Filtered array of unique, recent news items
 */
export function filterNews(items: NewsItem[], options: FilterOptions = {}): NewsItem[] {
	const { maxItems = 10, maxAgeDays = 7, maxSources = 5 } = options;

	const now = Date.now();
	const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;

	// 1. Filter by date
	let filtered = items.filter((item) => now - item.timestamp <= maxAge);

	// 2. Sort by timestamp (newest first)
	sortNewsNewestFirst(filtered);

	// 3. Deduplicate by title similarity
	const deduplicated: NewsItem[] = [];
	for (const item of filtered) {
		const isDuplicate = deduplicated.some(
			(existing) => titleSimilarity(existing.title, item.title) > 0.6
		);
		if (!isDuplicate) {
			deduplicated.push(item);
		}
	}

	// 4. Prioritize unique sources (up to maxSources different sources)
	const result: NewsItem[] = [];
	const seenSources = new Set<string>();

	// First pass: one item per source until we hit maxSources
	for (const item of deduplicated) {
		if (seenSources.size < maxSources && !seenSources.has(item.source)) {
			result.push(item);
			seenSources.add(item.source);
		}
		if (result.length >= maxItems) break;
	}

	// Second pass: fill remaining slots from any source
	for (const item of deduplicated) {
		if (!result.includes(item) && result.length < maxItems) {
			result.push(item);
		}
	}

	// Re-sort by timestamp since source prioritization may have changed order
	sortNewsNewestFirst(result);

	return result;
}
