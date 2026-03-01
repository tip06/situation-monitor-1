/**
 * API barrel exports
 */

export { fetchCategoryNews, fetchAllNews, refreshAllNewsProgressive } from './news';
export type { RefreshAllNewsProgressiveOptions } from './news';
export {
	fetchCryptoPrices,
	fetchIndices,
	fetchSectorPerformance,
	fetchCommodities,
	fetchAllMarkets
} from './markets';
export { fetchPolymarket, fetchWhaleTransactions, fetchGovContracts, fetchLayoffs } from './misc';
export type { Prediction, WhaleTransaction, Contract, Layoff } from './misc';
export { fetchWorldLeaders } from './leaders';
export { fetchFedIndicators, fetchFedNews, isFredConfigured } from './fred';
export type { FedIndicators, EconomicIndicator, FedNewsItem, FedNewsType } from './fred';
export { fetchAIBrief } from './ai-brief';
export type { AIBrief } from './ai-brief';
export { fetchStabilitySnapshot } from './stability';
export type { StabilitySnapshot } from './stability';
export { fetchFearGreed } from './fear-greed';
export type { FearGreedData } from './fear-greed';
export { fetchOutagesSnapshot } from './outages';
export type { OutagesSnapshot, InternetOutage } from './outages';
export {
	fetchManualAdditions,
	createManualInsight,
	fetchCorrelationHistory,
	persistCorrelationHistory
} from './analysis';
export type { CorrelationHistoryPoint } from './analysis';
