import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { MarketsState } from '$lib/stores/markets';

vi.mock('$lib/analysis/correlation', () => ({
	analyzeCorrelations: vi.fn()
}));

vi.mock('$lib/analysis/narrative', () => ({
	analyzeNarratives: vi.fn()
}));

function createEmptyMarkets(): MarketsState {
	return {
		indices: { items: [], loading: false, error: null, lastUpdated: null },
		sectors: { items: [], loading: false, error: null, lastUpdated: null },
		commodities: { items: [], loading: false, error: null, lastUpdated: null },
		crypto: { items: [], loading: false, error: null, lastUpdated: null },
		initialized: true
	};
}

const emptyCorrelation = {
	emergingPatterns: [],
	momentumSignals: [],
	crossSourceCorrelations: [],
	predictiveSignals: [],
	compoundSignals: [],
	topicStats: {}
};

const emptyNarratives = {
	trendingNarratives: [],
	emergingFringe: [],
	fringeToMainstream: [],
	narrativeWatch: [],
	disinfoSignals: []
};

describe('alert engine', () => {
	beforeEach(async () => {
		vi.resetModules();
		const { resetAlertState } = await import('./engine');
		resetAlertState();
	});

	it('creates a popup for alert-tagged news', async () => {
		const { analyzeCorrelations } = await import('$lib/analysis/correlation');
		const { analyzeNarratives } = await import('$lib/analysis/narrative');
		vi.mocked(analyzeCorrelations).mockReturnValue(emptyCorrelation);
		vi.mocked(analyzeNarratives).mockReturnValue(emptyNarratives);

		const { detectAlerts } = await import('./engine');
		const popups = detectAlerts({
			newsItems: [
				{
					id: 'n1',
					title: 'Breaking alert',
					link: 'x',
					timestamp: Date.now(),
					source: 'AP',
					category: 'politics',
					isAlert: true
				}
			],
			marketsState: createEmptyMarkets(),
			locale: 'en'
		});

		expect(popups.length).toBe(1);
		expect(popups[0].type).toBe('newsAlert');
		expect(popups[0].count).toBe(1);
	});

	it('fires once for economic swing and again after reset below threshold', async () => {
		const { analyzeCorrelations } = await import('$lib/analysis/correlation');
		const { analyzeNarratives } = await import('$lib/analysis/narrative');
		vi.mocked(analyzeCorrelations).mockReturnValue(emptyCorrelation);
		vi.mocked(analyzeNarratives).mockReturnValue(emptyNarratives);

		const { detectAlerts } = await import('./engine');
		const markets = createEmptyMarkets();
		markets.indices.items = [
			{ symbol: '^SPX', name: 'S&P 500', price: 100, change: 2, changePercent: 2 }
		];

		const first = detectAlerts({ newsItems: [], marketsState: markets, locale: 'en' });
		expect(first.length).toBe(1);
		expect(first[0].type).toBe('econSwing');

		const second = detectAlerts({ newsItems: [], marketsState: markets, locale: 'en' });
		expect(second.length).toBe(0);

		markets.indices.items = [
			{ symbol: '^SPX', name: 'S&P 500', price: 100, change: 0.2, changePercent: 0.2 }
		];
		detectAlerts({ newsItems: [], marketsState: markets, locale: 'en' });

		markets.indices.items = [
			{ symbol: '^SPX', name: 'S&P 500', price: 100, change: -2, changePercent: -2 }
		];
		const third = detectAlerts({ newsItems: [], marketsState: markets, locale: 'en' });
		expect(third.length).toBe(1);
		expect(third[0].type).toBe('econSwing');
	});

	it('fires for new compound signals only once per id', async () => {
		const { analyzeCorrelations } = await import('$lib/analysis/correlation');
		const { analyzeNarratives } = await import('$lib/analysis/narrative');
		vi.mocked(analyzeNarratives).mockReturnValue(emptyNarratives);

		vi.mocked(analyzeCorrelations).mockReturnValue({
			...emptyCorrelation,
			compoundSignals: [
				{
					id: 'c1',
					name: 'Compound 1',
					topics: [],
					activeTopics: [],
					score: 10,
					keyJudgments: [],
					indicators: [],
					confirmationSignals: [],
					assumptions: [],
					changeTriggers: [],
					level: 'high'
				}
			]
		});

		const { detectAlerts } = await import('./engine');
		const first = detectAlerts({ newsItems: [], marketsState: createEmptyMarkets(), locale: 'en' });
		expect(first.some((p) => p.type === 'compound')).toBe(true);

		const second = detectAlerts({ newsItems: [], marketsState: createEmptyMarkets(), locale: 'en' });
		expect(second.some((p) => p.type === 'compound')).toBe(false);
	});

	it('fires for new narrative watch items', async () => {
		const { analyzeCorrelations } = await import('$lib/analysis/correlation');
		const { analyzeNarratives } = await import('$lib/analysis/narrative');
		vi.mocked(analyzeCorrelations).mockReturnValue(emptyCorrelation);
		vi.mocked(analyzeNarratives).mockReturnValue({
			...emptyNarratives,
			narrativeWatch: [
				{
					id: 'w1',
					name: 'Watch 1',
					category: 'test',
					severity: 'watch',
					count: 3,
					fringeCount: 0,
					mainstreamCount: 0,
					sources: [],
					headlines: [],
					keywords: []
				}
			]
		});

		const { detectAlerts } = await import('./engine');
		const popups = detectAlerts({ newsItems: [], marketsState: createEmptyMarkets(), locale: 'en' });
		expect(popups.some((p) => p.type === 'narrativeWatch')).toBe(true);
	});
});
