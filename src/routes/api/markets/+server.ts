import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMarketData } from '$lib/server/db';
import { fetchAllMarketsServer } from '$lib/server/fetcher';
import type { MarketItem, SectorPerformance, CryptoItem } from '$lib/types';

const STALE_THRESHOLD_MS = 60000; // 1 minute

export const GET: RequestHandler = async () => {
	const indicesCache = getMarketData<MarketItem[]>('indices');
	const sectorsCache = getMarketData<SectorPerformance[]>('sectors');
	const commoditiesCache = getMarketData<MarketItem[]>('commodities');
	const cryptoCache = getMarketData<CryptoItem[]>('crypto');

	const now = Date.now();
	const isStale =
		!indicesCache ||
		!sectorsCache ||
		!commoditiesCache ||
		!cryptoCache ||
		now - indicesCache.updatedAt > STALE_THRESHOLD_MS;

	if (isStale) {
		const fresh = await fetchAllMarketsServer();
		return json(fresh);
	}

	return json({
		indices: indicesCache.data,
		sectors: sectorsCache.data,
		commodities: commoditiesCache.data,
		crypto: cryptoCache.data,
		updatedAt: Math.max(
			indicesCache.updatedAt,
			sectorsCache.updatedAt,
			commoditiesCache.updatedAt,
			cryptoCache.updatedAt
		)
	});
};
