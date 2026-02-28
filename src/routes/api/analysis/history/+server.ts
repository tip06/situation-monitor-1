import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCorrelationHistory, upsertCorrelationHistory } from '$lib/server/analysis-persistence';

const DEFAULT_KEEP_HOURS = 168;

export const GET: RequestHandler = async ({ url }) => {
	const hours = Number.parseInt(url.searchParams.get('hours') ?? `${DEFAULT_KEEP_HOURS}`, 10);
	const keepHours = Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_KEEP_HOURS;
	return json({
		points: getCorrelationHistory(keepHours),
		keepHours
	});
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: {
		points?: Array<{ hourBucket?: number; topicId?: string; count?: number }>;
		keepHours?: number;
	};

	try {
		payload = await request.json();
	} catch {
		return json({ error: 'required' }, { status: 400 });
	}

	const points =
		payload.points?.filter(
			(point) =>
				point &&
				typeof point.topicId === 'string' &&
				typeof point.hourBucket === 'number' &&
				typeof point.count === 'number'
		) ?? [];

	const keepHours =
		typeof payload.keepHours === 'number' && Number.isFinite(payload.keepHours) && payload.keepHours > 0
			? payload.keepHours
			: DEFAULT_KEEP_HOURS;

	upsertCorrelationHistory(
		points.map((point) => ({
			hourBucket: point.hourBucket as number,
			topicId: point.topicId as string,
			count: point.count as number
		})),
		keepHours
	);

	return json({ ok: true });
};
