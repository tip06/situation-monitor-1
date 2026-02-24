import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { addSource, getAllSources } from '$lib/server/sources';

export const GET: RequestHandler = async () => {
	return json({ records: getAllSources() });
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: { category?: NewsCategory; name?: string; url?: string };
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'required' }, { status: 400 });
	}

	const result = addSource({
		category: payload.category as NewsCategory,
		name: payload.name ?? '',
		url: payload.url ?? ''
	});

	if (!result.ok) {
		return json({ error: result.error }, { status: 400 });
	}

	return json({ record: result.record }, { status: 201 });
};
