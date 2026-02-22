import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { refreshAllNews, fetchAllMarketsServer } from '$lib/server/fetcher';
import { deleteOldNews } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	let categories: NewsCategory[] | undefined;

	try {
		const body = await request.json();
		if (body.categories && Array.isArray(body.categories)) {
			categories = body.categories;
		}
	} catch {
		// No body or invalid JSON — refresh all
	}

	const newsResult = await refreshAllNews(categories);
	await fetchAllMarketsServer();

	// Clean up old news
	const deleted = deleteOldNews(7);

	return json({
		success: newsResult.errors.length === 0,
		duration: newsResult.duration,
		errors: newsResult.errors,
		deletedOldItems: deleted
	});
};
