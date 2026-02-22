import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { getNewsByCategory } from '$lib/server/db';
import { fetchCategoryNewsServer } from '$lib/server/fetcher';

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

	// If no data in SQLite, trigger a server-side fetch
	if (items.length === 0) {
		items = await fetchCategoryNewsServer(category);
	}

	const checkpoint = items.length > 0 ? items[0].timestamp : Date.now();

	return json({ items, checkpoint });
};
