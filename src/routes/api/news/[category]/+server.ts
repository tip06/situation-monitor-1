import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { getNewsByCategory, isNewsCategoryCacheStale } from '$lib/server/db';
import { fetchCategoryNewsServer, isCategoryNewsRefreshInFlight } from '$lib/server/fetcher';
import { getEnabledFeedsByCategory } from '$lib/server/sources';

const VALID_CATEGORIES: NewsCategory[] = [
	'politics', 'tech', 'finance', 'gov', 'ai', 'intel',
	'brazil', 'latam', 'iran', 'venezuela', 'greenland', 'fringe'
];

export const GET: RequestHandler = async ({ params, url }) => {
	const category = params.category as NewsCategory;

	if (!VALID_CATEGORIES.includes(category)) {
		return json({ error: `Invalid category: ${category}` }, { status: 400 });
	}

	const sinceParam = url.searchParams.get('since');
	const since = sinceParam ? parseInt(sinceParam, 10) : undefined;

	// Try SQLite first
	let items = getNewsByCategory(category, since);

	// Serve the SQLite snapshot immediately and refresh stale data in the
	// background. A delta can be empty even when the category cache is healthy.
	if (isNewsCategoryCacheStale(category)) {
		void fetchCategoryNewsServer(category, getEnabledFeedsByCategory(category)).catch((error) => {
			console.error(`[API] Background refresh failed for ${category}:`, error);
		});
	}

	const checkpoint = items.length > 0 ? items[0].timestamp : 0;

	return json({ items, checkpoint, refreshing: isCategoryNewsRefreshInFlight(category) });
};
