/**
 * Tests for correlation engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	analyzeCorrelations,
	getCorrelationSummary,
	clearCorrelationHistory,
	clearPersistedHistory,
	calculateZScore,
	calculateVelocity,
	calculateAcceleration,
	detectCompoundPatterns,
	type TopicStats
} from './correlation';
import type { NewsItem } from '$lib/types';
import { getSourceWeight, COMPOUND_PATTERNS } from '$lib/config/analysis';

describe('Correlation Engine', () => {
	beforeEach(() => {
		clearCorrelationHistory();
		clearPersistedHistory();
	});

	it('should return null for empty news', () => {
		expect(analyzeCorrelations([])).toBeNull();
		expect(analyzeCorrelations(null as unknown as NewsItem[])).toBeNull();
	});

	it('should detect emerging patterns', () => {
		const news: NewsItem[] = [
			{
				id: '1',
				title: 'Ukraine announces new policy',
				source: 'BBC',
				link: 'a',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '2',
				title: 'Ukraine military update',
				source: 'CNN',
				link: 'b',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '3',
				title: 'Zelensky addresses nation',
				source: 'NYT',
				link: 'c',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const results = analyzeCorrelations(news);

		expect(results).not.toBeNull();
		expect(results!.emergingPatterns.length).toBeGreaterThan(0);

		const ukrainePattern = results!.emergingPatterns.find((p) => p.id === 'russia-ukraine');
		expect(ukrainePattern).toBeDefined();
		expect(ukrainePattern!.count).toBeGreaterThanOrEqual(3);
		expect(ukrainePattern!.level).toBe('emerging');
	});

	it('should categorize pattern levels correctly', () => {
		// Create many Ukraine-related articles to trigger 'high' level
		const news: NewsItem[] = Array.from({ length: 10 }, (_, i) => ({
			id: String(i),
			title: `Ukraine news ${i}`,
			source: `Source${i}`,
			link: `link${i}`,
			timestamp: Date.now(),
			category: 'politics' as const
		}));

		const results = analyzeCorrelations(news);
		const ukrainePattern = results?.emergingPatterns.find((p) => p.id === 'russia-ukraine');

		expect(ukrainePattern?.level).toBe('high');
	});

	it('should track cross-source correlations', () => {
		const news: NewsItem[] = [
			{
				id: '1',
				title: 'Tariff news today',
				source: 'BBC',
				link: 'a',
				timestamp: Date.now(),
				category: 'finance'
			},
			{
				id: '2',
				title: 'Trade war escalates',
				source: 'CNN',
				link: 'b',
				timestamp: Date.now(),
				category: 'finance'
			},
			{
				id: '3',
				title: 'Import tax increases',
				source: 'NYT',
				link: 'c',
				timestamp: Date.now(),
				category: 'finance'
			},
			{
				id: '4',
				title: 'Customs duty update',
				source: 'WSJ',
				link: 'd',
				timestamp: Date.now(),
				category: 'finance'
			}
		];

		const results = analyzeCorrelations(news);
		const tariffCorrelation = results?.crossSourceCorrelations.find((c) => c.id === 'tariffs');

		expect(tariffCorrelation).toBeDefined();
		expect(tariffCorrelation!.sourceCount).toBe(4);
		expect(tariffCorrelation!.sources).toContain('BBC');
	});

	it('should generate predictive signals for high scores', () => {
		// Create many tariff articles to generate predictive signals
		const news: NewsItem[] = Array.from({ length: 8 }, (_, i) => ({
			id: String(i),
			title: `Tariff policy update ${i}`,
			source: `Source${i % 4}`,
			link: `link${i}`,
			timestamp: Date.now(),
			category: 'finance' as const
		}));

		const results = analyzeCorrelations(news);

		expect(results?.predictiveSignals.length).toBeGreaterThan(0);

		const tariffSignal = results?.predictiveSignals.find((s) => s.id === 'tariffs');
		if (tariffSignal) {
			expect(tariffSignal.prediction).toContain('volatility');
		}
	});

	it('should collect headlines for patterns', () => {
		const news: NewsItem[] = [
			{
				id: '1',
				title: 'Gaza conflict escalates',
				source: 'BBC',
				link: 'https://bbc.com/1',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '2',
				title: 'Hamas negotiations',
				source: 'CNN',
				link: 'https://cnn.com/2',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '3',
				title: 'Israel Gaza update',
				source: 'NYT',
				link: 'https://nyt.com/3',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const results = analyzeCorrelations(news);
		const gazaPattern = results?.emergingPatterns.find((p) => p.id === 'israel-gaza');

		expect(gazaPattern?.headlines.length).toBeGreaterThan(0);
		expect(gazaPattern?.headlines[0].link).toBeDefined();
		expect(gazaPattern?.headlines[0].source).toBeDefined();
	});

	it('should return correct summary', () => {
		expect(getCorrelationSummary(null)).toEqual({ totalSignals: 0, status: 'NO DATA' });

		const news: NewsItem[] = [
			{
				id: '1',
				title: 'Ukraine update',
				source: 'BBC',
				link: 'a',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '2',
				title: 'Ukraine news',
				source: 'CNN',
				link: 'b',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '3',
				title: 'Zelensky speaks',
				source: 'NYT',
				link: 'c',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const results = analyzeCorrelations(news);
		const summary = getCorrelationSummary(results);

		expect(summary.totalSignals).toBeGreaterThan(0);
		expect(summary.status).toMatch(/SIGNALS/);
	});

	it('should include compound signals in results', () => {
		const results = analyzeCorrelations([]);
		expect(results).toBeNull();

		// Create news that triggers compound patterns
		const news: NewsItem[] = [
			// Tariffs topic
			{
				id: '1',
				title: 'New tariff announcement',
				source: 'BBC',
				link: 'a',
				timestamp: Date.now(),
				category: 'finance'
			},
			{
				id: '2',
				title: 'Trade war tariffs rise',
				source: 'CNN',
				link: 'b',
				timestamp: Date.now(),
				category: 'finance'
			},
			// China tensions topic
			{
				id: '3',
				title: 'US China tensions grow',
				source: 'NYT',
				link: 'c',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '4',
				title: 'Beijing Washington dispute',
				source: 'WSJ',
				link: 'd',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const resultsWithCompound = analyzeCorrelations(news);
		expect(resultsWithCompound).not.toBeNull();
		expect(resultsWithCompound!.compoundSignals).toBeDefined();

		// Check if trade-war-escalation pattern was detected
		const tradeWarSignal = resultsWithCompound!.compoundSignals.find(
			(s) => s.id === 'trade-war-escalation'
		);
		expect(tradeWarSignal).toBeDefined();
		expect(tradeWarSignal!.activeTopics).toContain('tariffs');
		expect(tradeWarSignal!.activeTopics).toContain('china-tensions');
	});
});

describe('Source Weights', () => {
	it('should return correct weights for known sources', () => {
		expect(getSourceWeight('Reuters')).toBe(1.5);
		expect(getSourceWeight('AP News')).toBe(1.5);
		expect(getSourceWeight('BBC News')).toBe(1.2);
		expect(getSourceWeight('CNN')).toBe(1.2);
		expect(getSourceWeight('ZeroHedge')).toBe(0.4);
		expect(getSourceWeight('Infowars')).toBe(0.4);
		expect(getSourceWeight('Breitbart')).toBe(0.7);
	});

	it('should return default weight for unknown sources', () => {
		expect(getSourceWeight('Unknown Source')).toBe(1.0);
		expect(getSourceWeight('Random Blog')).toBe(1.0);
	});

	it('should apply source weights to patterns', () => {
		const newsHighTier: NewsItem[] = [
			{
				id: '1',
				title: 'Ukraine update',
				source: 'Reuters',
				link: 'a',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '2',
				title: 'Ukraine news',
				source: 'AP',
				link: 'b',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '3',
				title: 'Zelensky speaks',
				source: 'BBC',
				link: 'c',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const newsLowTier: NewsItem[] = [
			{
				id: '1',
				title: 'Ukraine update',
				source: 'ZeroHedge',
				link: 'a',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '2',
				title: 'Ukraine news',
				source: 'Infowars',
				link: 'b',
				timestamp: Date.now(),
				category: 'politics'
			},
			{
				id: '3',
				title: 'Zelensky speaks',
				source: 'NaturalNews',
				link: 'c',
				timestamp: Date.now(),
				category: 'politics'
			}
		];

		const resultsHigh = analyzeCorrelations(newsHighTier);
		const resultsLow = analyzeCorrelations(newsLowTier);

		const patternHigh = resultsHigh?.emergingPatterns.find((p) => p.id === 'russia-ukraine');
		const patternLow = resultsLow?.emergingPatterns.find((p) => p.id === 'russia-ukraine');

		expect(patternHigh).toBeDefined();
		expect(patternLow).toBeDefined();
		// High tier sources should have higher weighted count
		expect(patternHigh!.weightedCount).toBeGreaterThan(patternLow!.weightedCount);
	});
});

describe('Statistical Functions', () => {
	describe('calculateZScore', () => {
		it('should return 0 for insufficient history', () => {
			expect(calculateZScore(5, [])).toBe(0);
			expect(calculateZScore(5, [1])).toBe(0);
			expect(calculateZScore(5, [1, 2])).toBe(0);
		});

		it('should return 0 for zero standard deviation', () => {
			expect(calculateZScore(5, [5, 5, 5, 5])).toBe(0);
		});

		it('should calculate correct z-score', () => {
			// History: mean = 5, std = 2
			const history = [3, 5, 7, 3, 5, 7];
			const zScore = calculateZScore(9, history);
			// (9 - 5) / ~1.63 ≈ 2.45
			expect(zScore).toBeGreaterThan(2);
			expect(zScore).toBeLessThan(3);
		});

		it('should return negative z-score for below average', () => {
			const history = [5, 6, 7, 5, 6, 7];
			const zScore = calculateZScore(2, history);
			expect(zScore).toBeLessThan(0);
		});
	});

	describe('calculateVelocity', () => {
		it('should return 0 for insufficient history', () => {
			expect(calculateVelocity('test-topic', {})).toBe(0);
			expect(calculateVelocity('test-topic', { 1: { 'test-topic': 3 } })).toBe(0);
		});

		it('should calculate positive velocity for increasing values', () => {
			const history: Record<number, Record<string, number>> = {
				100: { 'test-topic': 5 },
				99: { 'test-topic': 4 },
				98: { 'test-topic': 3 },
				97: { 'test-topic': 2 }
			};
			const velocity = calculateVelocity('test-topic', history);
			expect(velocity).toBeGreaterThan(0);
		});

		it('should calculate negative velocity for decreasing values', () => {
			const history: Record<number, Record<string, number>> = {
				100: { 'test-topic': 2 },
				99: { 'test-topic': 3 },
				98: { 'test-topic': 4 },
				97: { 'test-topic': 5 }
			};
			const velocity = calculateVelocity('test-topic', history);
			expect(velocity).toBeLessThan(0);
		});
	});

	describe('calculateAcceleration', () => {
		it('should return 0 for insufficient velocities', () => {
			expect(calculateAcceleration([])).toBe(0);
			expect(calculateAcceleration([1])).toBe(0);
		});

		it('should calculate positive acceleration', () => {
			// velocities[0] - velocities[1] = 5 - 3 = 2
			expect(calculateAcceleration([5, 3])).toBe(2);
		});

		it('should calculate negative acceleration', () => {
			// velocities[0] - velocities[1] = 2 - 5 = -3
			expect(calculateAcceleration([2, 5])).toBe(-3);
		});
	});
});

describe('Compound Pattern Detection', () => {
	it('should detect compound patterns when topics co-occur', () => {
		const topicStats: Record<string, TopicStats> = {
			tariffs: {
				count: 3,
				weightedCount: 3.6,
				sources: new Set(['BBC', 'CNN', 'NYT']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			},
			'china-tensions': {
				count: 2,
				weightedCount: 2.4,
				sources: new Set(['Reuters', 'AP']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
		};

		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);

		expect(signals.length).toBeGreaterThan(0);
		const tradeWar = signals.find((s) => s.id === 'trade-war-escalation');
		expect(tradeWar).toBeDefined();
		expect(tradeWar!.activeTopics).toContain('tariffs');
		expect(tradeWar!.activeTopics).toContain('china-tensions');
		expect(tradeWar!.score).toBeGreaterThan(0);
	});

	it('should not detect patterns when minimum topics not met', () => {
		const topicStats: Record<string, TopicStats> = {
			tariffs: {
				count: 3,
				weightedCount: 3.6,
				sources: new Set(['BBC']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
			// china-tensions missing
		};

		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const tradeWar = signals.find((s) => s.id === 'trade-war-escalation');
		expect(tradeWar).toBeUndefined();
	});

	it('should require minimum count of 2 per topic', () => {
		const topicStats: Record<string, TopicStats> = {
			tariffs: {
				count: 3,
				weightedCount: 3.6,
				sources: new Set(['BBC']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			},
			'china-tensions': {
				count: 1, // Below threshold
				weightedCount: 1.2,
				sources: new Set(['Reuters']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
		};

		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const tradeWar = signals.find((s) => s.id === 'trade-war-escalation');
		expect(tradeWar).toBeUndefined();
	});

	it('should apply boost factor to scores', () => {
		const topicStats: Record<string, TopicStats> = {
			tariffs: {
				count: 4,
				weightedCount: 4.0,
				sources: new Set(['BBC', 'CNN']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			},
			'china-tensions': {
				count: 4,
				weightedCount: 4.0,
				sources: new Set(['Reuters', 'AP']),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
		};

		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const tradeWar = signals.find((s) => s.id === 'trade-war-escalation');

		expect(tradeWar).toBeDefined();
		// Base score = 4 + 4 = 8, boosted by 1.5 = 12
		expect(tradeWar!.score).toBe(12);
	});

	it('should classify signal levels correctly', () => {
		// Create stats that would generate different score levels
		const topicStatsLow: Record<string, TopicStats> = {
			tariffs: {
				count: 2,
				weightedCount: 2.0,
				sources: new Set(),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			},
			'china-tensions': {
				count: 2,
				weightedCount: 2.0,
				sources: new Set(),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
		};

		const topicStatsHigh: Record<string, TopicStats> = {
			tariffs: {
				count: 10,
				weightedCount: 15.0,
				sources: new Set(),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			},
			'china-tensions': {
				count: 10,
				weightedCount: 15.0,
				sources: new Set(),
				headlines: [],
				velocity: 0,
				acceleration: 0,
				zScore: 0
			}
		};

		const signalsLow = detectCompoundPatterns(topicStatsLow, COMPOUND_PATTERNS);
		const signalsHigh = detectCompoundPatterns(topicStatsHigh, COMPOUND_PATTERNS);

		const tradeWarLow = signalsLow.find((s) => s.id === 'trade-war-escalation');
		const tradeWarHigh = signalsHigh.find((s) => s.id === 'trade-war-escalation');

		expect(tradeWarLow?.level).toBe('elevated');
		expect(tradeWarHigh?.level).toBe('critical');
	});
});
