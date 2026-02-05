/**
 * News filtering utilities for deduplication, sorting, and limiting
 */

import type { NewsItem } from '$lib/types';

export interface FilterOptions {
	maxItems?: number; // Default: 10
	maxAgeDays?: number; // Default: 7
	maxSources?: number; // Default: 5 (prioritize variety from N sources)
}

/**
 * Calculate word-based Jaccard similarity between two strings
 * Filters out short words to focus on meaningful content
 */
function titleSimilarity(a: string, b: string): number {
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
	filtered.sort((a, b) => b.timestamp - a.timestamp);

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
	result.sort((a, b) => b.timestamp - a.timestamp);

	return result;
}
