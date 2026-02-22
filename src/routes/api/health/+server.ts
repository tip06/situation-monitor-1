import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNewsCount, getMeta } from '$lib/server/db';
import { getAllFeedHealth, getCircuitBreakerStatus } from '$lib/server/fetcher';

export const GET: RequestHandler = async () => {
	const feedHealth = getAllFeedHealth();
	const circuitBreakers = getCircuitBreakerStatus();
	const newsCount = getNewsCount();
	const lastRefresh = getMeta<number>('lastRefreshTime');

	return json({
		newsCount,
		lastRefreshTime: lastRefresh?.value ?? null,
		feedHealth,
		circuitBreakers
	});
};
