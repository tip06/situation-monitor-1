/**
 * Markets API - Fetch market data from various sources
 */

import { INDICES, SECTORS, COMMODITIES, CRYPTO } from '$lib/config/markets';
import type { MarketItem, SectorPerformance, CryptoItem } from '$lib/types';
import { CORS_PROXY_URL, logger } from '$lib/config/api';

interface CoinGeckoPrice {
	usd: number;
	usd_24h_change?: number;
}

interface CoinGeckoPricesResponse {
	[key: string]: CoinGeckoPrice;
}

/**
 * Fetch crypto prices from CoinGecko via proxy
 */
export async function fetchCryptoPrices(): Promise<CryptoItem[]> {
	try {
		const ids = CRYPTO.map((c) => c.id).join(',');
		const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

		// Use proxy to avoid CORS/rate limiting issues
		const proxyUrl = CORS_PROXY_URL + encodeURIComponent(coinGeckoUrl);
		logger.log('Markets API', 'Fetching crypto from:', proxyUrl);

		const response = await fetch(proxyUrl);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data: CoinGeckoPricesResponse = await response.json();

		return CRYPTO.map((crypto) => {
			const priceData = data[crypto.id];
			return {
				id: crypto.id,
				symbol: crypto.symbol,
				name: crypto.name,
				current_price: priceData?.usd || 0,
				price_change_24h: priceData?.usd_24h_change || 0,
				price_change_percentage_24h: priceData?.usd_24h_change || 0
			};
		});
	} catch (error) {
		logger.error('Markets API', 'Error fetching crypto:', error);
		return CRYPTO.map((c) => ({
			id: c.id,
			symbol: c.symbol,
			name: c.name,
			current_price: 0,
			price_change_24h: 0,
			price_change_percentage_24h: 0
		}));
	}
}

/**
 * Fetch market indices (via proxy for Yahoo Finance)
 * Note: Returns placeholder data - would need Yahoo Finance API or similar
 */
export async function fetchIndices(): Promise<MarketItem[]> {
	// TODO: Implement real market data fetching
	// Options: Yahoo Finance API, Alpha Vantage, Polygon.io
	return INDICES.map((index) => ({
		symbol: index.symbol,
		name: index.name,
		price: NaN, // NaN indicates data not available
		change: NaN,
		changePercent: NaN,
		type: 'index' as const
	}));
}

/**
 * Fetch sector performance
 * Note: Returns placeholder data - would need market data provider
 */
export async function fetchSectorPerformance(): Promise<SectorPerformance[]> {
	// TODO: Implement real sector data fetching
	return SECTORS.map((sector) => ({
		symbol: sector.symbol,
		name: sector.name,
		price: NaN,
		change: NaN,
		changePercent: NaN
	}));
}

/**
 * Fetch commodities
 * Note: Returns placeholder data - would need commodities data provider
 */
export async function fetchCommodities(): Promise<MarketItem[]> {
	// TODO: Implement real commodities data fetching
	return COMMODITIES.map((commodity) => ({
		symbol: commodity.symbol,
		name: commodity.name,
		price: NaN,
		change: NaN,
		changePercent: NaN,
		type: 'commodity' as const
	}));
}

/**
 * Fetch all market data
 */
export async function fetchAllMarkets() {
	const [crypto, indices, sectors, commodities] = await Promise.all([
		fetchCryptoPrices(),
		fetchIndices(),
		fetchSectorPerformance(),
		fetchCommodities()
	]);

	return { crypto, indices, sectors, commodities };
}
