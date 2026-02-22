/**
 * Markets API - Client-side fetching via local server API
 *
 * All Finnhub/CoinGecko fetching now happens server-side.
 * The client simply calls /api/markets.
 */

import type { MarketItem, SectorPerformance, CryptoItem } from '$lib/types';
import { INDICES, SECTORS, COMMODITIES, CRYPTO } from '$lib/config/markets';

interface AllMarketsData {
	crypto: CryptoItem[];
	indices: MarketItem[];
	sectors: SectorPerformance[];
	commodities: MarketItem[];
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
		}))
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
		return {
			indices: data.indices ?? [],
			sectors: data.sectors ?? [],
			commodities: data.commodities ?? [],
			crypto: data.crypto ?? []
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
