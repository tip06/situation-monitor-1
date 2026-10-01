import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMarketData } from '$lib/server/db';
import { fetchAllMarketsServer, getAllMarketHealth } from '$lib/server/fetcher';
import type { MarketItem, SectorPerformance, CryptoItem, MarketHealthMap } from '$lib/types';

const STALE_THRESHOLD_MS = 60000; // 1 minute

export const GET: RequestHandler = async () => {
	const indicesCache = getMarketData<MarketItem[]>('indices');
	const sectorsCache = getMarketData<SectorPerformance[]>('sectors');
	const commoditiesCache = getMarketData<MarketItem[]>('commodities');
	const cryptoCache = getMarketData<CryptoItem[]>('crypto');

	const now = Date.now();
	const cacheTimestamps = [
		indicesCache?.updatedAt,
		sectorsCache?.updatedAt,
		commoditiesCache?.updatedAt,
		cryptoCache?.updatedAt
	].filter((value): value is number => typeof value === 'number');

	const oldestTimestamp = cacheTimestamps.length > 0 ? Math.min(...cacheTimestamps) : null;
	const isStale =
		!indicesCache ||
		!sectorsCache ||
		!commoditiesCache ||
		!cryptoCache ||
		(oldestTimestamp !== null && now - oldestTimestamp > STALE_THRESHOLD_MS);

	if (isStale) {
		void fetchAllMarketsServer().catch((error) => {
			console.error('[API] Background market refresh failed:', error);
		});
		const marketHealth: MarketHealthMap = Object.fromEntries(
			Object.entries(getAllMarketHealth()).map(([category, health]) => [
				category,
				{
					...health,
					stale: true,
					reason: health.reason ?? 'Showing cached values while updating market data'
				}
			])
		) as MarketHealthMap;

		return json({
			indices: indicesCache?.data ?? [],
			sectors: sectorsCache?.data ?? [],
			commodities: commoditiesCache?.data ?? [],
			crypto: cryptoCache?.data ?? [],
			marketHealth,
			updatedAt: oldestTimestamp ?? 0,
			stale: true,
			refreshing: true
		});
	}

	const marketHealth: MarketHealthMap = getAllMarketHealth();

	return json({
		indices: indicesCache.data,
		sectors: sectorsCache.data,
		commodities: commoditiesCache.data,
		crypto: cryptoCache.data,
		marketHealth,
		stale: false,
		refreshing: false,
		updatedAt: Math.max(
			indicesCache.updatedAt,
			sectorsCache.updatedAt,
			commoditiesCache.updatedAt,
			cryptoCache.updatedAt
		)
	});
};
