import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsCategory } from '$lib/types';
import { removeSource, toggleSource, updateSource } from '$lib/server/sources';

export const PATCH: RequestHandler = async ({ params, request }) => {
	let payload: {
		action?: 'toggle' | 'update';
		category?: NewsCategory;
		name?: string;
		url?: string;
		enabled?: boolean;
	};

	try {
		payload = await request.json();
	} catch {
		return json({ error: 'required' }, { status: 400 });
	}

	if (payload.action === 'toggle') {
		const toggled = toggleSource(params.id);
		if (!toggled.ok) {
			return json({ error: toggled.error }, { status: 400 });
		}
		return json({ record: toggled.record });
	}

	if (payload.action === 'update') {
		const updated = updateSource(params.id, {
			category: payload.category,
			name: payload.name,
			url: payload.url,
			enabled: payload.enabled
		});
		if (!updated.ok) {
			return json({ error: updated.error }, { status: 400 });
		}
		return json({ record: updated.record });
	}

	return json({ error: 'required' }, { status: 400 });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const result = removeSource(params.id);
	if (!result.ok) {
		return json({ error: result.error }, { status: 400 });
	}
	return json({ ok: true });
};
