/**
 * Shared news parsing utilities - used by both server and client
 * Pure functions with no browser/server-specific dependencies
 */

import type { NewsItem, NewsCategory } from '$lib/types';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { deduplicateNews } from '$lib/utils/news-filter';

const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;
const CATEGORY_SOURCE_LIMITS: Partial<Record<NewsCategory, Record<string, number>>> = {
	tech: {
		'ArXiv AI': 20
	}
};

/**
 * Simple hash function to generate unique IDs from URLs
 */
export function hashCode(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36);
}

/**
 * Parse GDELT date format (20251202T224500Z) to valid Date
 */
export function parseGdeltDate(dateStr: string): Date {
	if (!dateStr) return new Date();
	const match = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
	if (match) {
		const [, year, month, day, hour, min, sec] = match;
		return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
	}
	return new Date(dateStr);
}

export interface GdeltArticle {
	title: string;
	url: string;
	seendate: string;
	domain: string;
	socialimage?: string;
}

export interface GdeltResponse {
	articles?: GdeltArticle[];
}

/**
 * Transform GDELT article to NewsItem
 */
export function transformGdeltArticle(
	article: GdeltArticle,
	category: NewsCategory,
	source: string,
	index: number
): NewsItem {
	const title = article.title || '';
	const alert = containsAlertKeyword(title);
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

/**
 * Parse a publication date while rejecting missing, malformed, or implausibly future values.
 */
export function parseNewsTimestamp(
	dateInput: string | number | Date | null | undefined
): number | null {
	if (dateInput === null || dateInput === undefined || dateInput === '') return null;
	const timestamp = new Date(dateInput).getTime();
	if (!Number.isFinite(timestamp) || timestamp > Date.now() + MAX_FUTURE_SKEW_MS) return null;
	return timestamp;
}

/**
 * Filter items to last N days
 */
export function filterByAge(items: NewsItem[], maxAgeDays: number): NewsItem[] {
	const now = Date.now();
	const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
	return items.filter(
		(item) =>
			Number.isFinite(item.timestamp) &&
			item.timestamp <= now + MAX_FUTURE_SKEW_MS &&
			now - item.timestamp <= maxAge
	);
}

/**
 * Keep high-volume batch sources from crowding out the mixed category feed.
 */
export function limitNewsByCategorySources(items: NewsItem[], category: NewsCategory): NewsItem[] {
	const limits = CATEGORY_SOURCE_LIMITS[category];
	if (!limits) return items;

	const counts = new Map<string, number>();
	return items.filter((item) => {
		const limit = limits[item.source];
		if (limit === undefined) return true;
		const count = counts.get(item.source) ?? 0;
		if (count >= limit) return false;
		counts.set(item.source, count + 1);
		return true;
	});
}

/**
 * Merge news items: deduplicate and sort by timestamp
 */
export function mergeNewsItems(existing: NewsItem[], incoming: NewsItem[]): NewsItem[] {
	const merged = deduplicateNews([...incoming, ...existing]);
	const recent = filterByAge(merged, 7).sort((a, b) => b.timestamp - a.timestamp);
	const category = recent[0]?.category;
	return category ? limitNewsByCategorySources(recent, category) : recent;
}

/** GDELT query keywords for each category */
export const GDELT_QUERIES: Record<NewsCategory, string> = {
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

/** Categories that use RSS feeds only (no GDELT) */
export const RSS_ONLY_CATEGORIES: NewsCategory[] = ['politics', 'brazil', 'latam', 'finance'];

/** Categories that use both RSS feeds AND GDELT */
export const RSS_PLUS_GDELT_CATEGORIES: NewsCategory[] = ['intel'];

/** All news categories in fetch order */
export const NEWS_CATEGORIES: NewsCategory[] = [
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
