/**
 * Markets API - Client-side fetching via local server API
 *
 * All Finnhub/CoinGecko fetching now happens server-side.
 * The client simply calls /api/markets.
 */

import type {
	MarketItem,
	SectorPerformance,
	CryptoItem,
	MarketHealthMap,
	MarketCategoryKey
} from '$lib/types';
import { INDICES, SECTORS, COMMODITIES, CRYPTO } from '$lib/config/markets';

interface AllMarketsData {
	crypto: CryptoItem[];
	indices: MarketItem[];
	sectors: SectorPerformance[];
	commodities: MarketItem[];
	marketHealth: MarketHealthMap;
	updatedAt: number;
	stale: boolean;
	refreshing: boolean;
}

function createDefaultHealth(category: MarketCategoryKey) {
	return {
		category,
		source: category === 'crypto' ? 'coingecko' : 'finnhub',
		stale: false,
		reason: null,
		lastAttempt: null,
		lastSuccess: null,
		consecutiveFailures: 0
	} as const;
}

function createEmptyMarkets(): AllMarketsData {
	return {
		indices: INDICES.map((i) => ({
			symbol: i.symbol,
			name: i.name,
			price: NaN,
			change: NaN,
			changePercent: NaN,
			type: 'index' as const
		})),
		sectors: SECTORS.map((s) => ({
			symbol: s.symbol,
			name: s.name,
			price: NaN,
			change: NaN,
			changePercent: NaN
		})),
		commodities: COMMODITIES.map((c) => ({
			symbol: c.symbol,
			name: c.name,
			price: NaN,
			change: NaN,
			changePercent: NaN,
			type: 'commodity' as const
		})),
		crypto: CRYPTO.map((c) => ({
			id: c.id,
			symbol: c.symbol,
			name: c.name,
			current_price: 0,
			price_change_24h: 0,
			price_change_percentage_24h: 0
		})),
		marketHealth: {
			indices: createDefaultHealth('indices'),
			sectors: createDefaultHealth('sectors'),
			commodities: createDefaultHealth('commodities'),
			crypto: createDefaultHealth('crypto')
		},
		updatedAt: 0,
		stale: true,
		refreshing: false
	};
}

/**
 * Fetch all market data from the server API
 */
export async function fetchAllMarkets(): Promise<AllMarketsData> {
	try {
		const res = await fetch('/api/markets');
		if (!res.ok) throw new Error(`Server error: ${res.status}`);
		const data = await res.json();
		const empty = createEmptyMarkets();
		return {
			indices: data.indices?.length ? data.indices : empty.indices,
			sectors: data.sectors?.length ? data.sectors : empty.sectors,
			commodities: data.commodities?.length ? data.commodities : empty.commodities,
			crypto: data.crypto?.length ? data.crypto : empty.crypto,
			marketHealth: data.marketHealth ?? empty.marketHealth,
			updatedAt: data.updatedAt ?? 0,
			stale: data.stale === true,
			refreshing: data.refreshing === true
		};
	} catch (error) {
		console.error('Failed to fetch markets from server:', error);
		return createEmptyMarkets();
	}
}

// Re-export individual functions for backward compatibility
export async function fetchCryptoPrices(): Promise<CryptoItem[]> {
	const data = await fetchAllMarkets();
	return data.crypto;
}

export async function fetchIndices(): Promise<MarketItem[]> {
	const data = await fetchAllMarkets();
	return data.indices;
}

export async function fetchSectorPerformance(): Promise<SectorPerformance[]> {
	const data = await fetchAllMarkets();
	return data.sectors;
}

export async function fetchCommodities(): Promise<MarketItem[]> {
	const data = await fetchAllMarkets();
	return data.commodities;
}
