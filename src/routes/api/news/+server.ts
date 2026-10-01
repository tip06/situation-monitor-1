import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { getNewsByCategoryBatch, isNewsCategoryCacheStale } from '$lib/server/db';
import { fetchCategoryNewsServer, isCategoryNewsRefreshInFlight } from '$lib/server/fetcher';
import { getEnabledFeedsByCategory } from '$lib/server/sources';

const VALID_CATEGORIES: Set<NewsCategory> = new Set([
	'politics', 'tech', 'finance', 'gov', 'ai', 'intel',
	'brazil', 'latam', 'iran', 'venezuela', 'greenland', 'fringe'
]);

export const GET: RequestHandler = async ({ url }) => {
	const categoriesParam = url.searchParams.get('categories');
	if (!categoriesParam) {
		return json({ error: 'Missing categories parameter' }, { status: 400 });
	}

	const categories = categoriesParam.split(',').filter(
		(c): c is NewsCategory => VALID_CATEGORIES.has(c as NewsCategory)
	);

	if (categories.length === 0) {
		return json({ error: 'No valid categories provided' }, { status: 400 });
	}

	// Parse since checkpoints
	let sinceByCategory: Partial<Record<NewsCategory, number>> | undefined;
	const sinceParam = url.searchParams.get('since');
	if (sinceParam) {
		try {
			sinceByCategory = JSON.parse(sinceParam);
		} catch {
			// ignore parse error
		}
	}

	// Get data from SQLite
	const result = getNewsByCategoryBatch(categories, sinceByCategory);

	// Return the SQLite snapshot immediately. Slow feeds refresh in the background;
	// the client can poll while a refresh is in flight and merge the new items.
	const refreshing: Partial<Record<NewsCategory, boolean>> = {};
	for (const category of categories) {
		if (isNewsCategoryCacheStale(category)) {
			void fetchCategoryNewsServer(category, getEnabledFeedsByCategory(category)).catch((error) => {
				console.error(`[API] Background refresh failed for ${category}:`, error);
			});
		}
		refreshing[category] = isCategoryNewsRefreshInFlight(category);
	}

	// Build checkpoints only when the response contains news. A timestamp for an
	// empty result would cause a later background refresh to omit older articles.
	const checkpoints: Partial<Record<NewsCategory, number>> = {};
	for (const category of categories) {
		const items = result[category];
		if (items.length > 0) checkpoints[category] = items[0].timestamp;
	}

	return json({ categories: result, checkpoints, refreshing });
};
