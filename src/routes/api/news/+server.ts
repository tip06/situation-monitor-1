import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { getNewsByCategoryBatch } from '$lib/server/db';
import { fetchCategoryNewsServer } from '$lib/server/fetcher';

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

	// For any category with no data, trigger a server-side fetch
	// (even if `since` was provided — an empty DB means we need a full pull)
	const fetchPromises: Promise<void>[] = [];
	for (const category of categories) {
		if (result[category].length === 0) {
			fetchPromises.push(
				fetchCategoryNewsServer(category).then((items) => {
					result[category] = items;
				})
			);
		}
	}
	if (fetchPromises.length > 0) {
		await Promise.all(fetchPromises);
	}

	// Build checkpoints
	const checkpoints: Partial<Record<NewsCategory, number>> = {};
	for (const category of categories) {
		const items = result[category];
		checkpoints[category] = items.length > 0 ? items[0].timestamp : Date.now();
	}

	return json({ categories: result, checkpoints });
};
