/**
 * Correlation engine - analyzes patterns across news items
 */

import type { NewsItem } from '$lib/types';
import {
	CORRELATION_TOPICS,
	COMPOUND_PATTERNS,
	getSourceWeight,
	type CorrelationTopic,
	type CompoundPattern
} from '$lib/config/analysis';

// Types for correlation results
export interface TopicStats {
	count: number;
	weightedCount: number; // Count adjusted by source weights
	sources: Set<string>;
	headlines: Array<{ title: string; link: string; source: string }>;
	velocity: number; // Rate of change (mentions/minute)
	acceleration: number; // Change in velocity
	zScore: number; // Standard deviations from baseline
}

export interface EmergingPattern {
	id: string;
	name: string;
	category: string;
	count: number;
	weightedCount: number;
	level: 'high' | 'elevated' | 'emerging';
	sources: string[];
	headlines: Array<{ title: string; link: string; source: string }>;
	zScore: number;
}

export interface MomentumSignal {
	id: string;
	name: string;
	category: string;
	current: number;
	delta: number;
	velocity: number;
	acceleration: number;
	momentum: 'surging' | 'rising' | 'stable';
	headlines: Array<{ title: string; link: string; source: string }>;
}

export interface CrossSourceCorrelation {
	id: string;
	name: string;
	category: string;
	sourceCount: number;
	sources: string[];
	level: 'high' | 'elevated' | 'emerging';
	headlines: Array<{ title: string; link: string; source: string }>;
}

export interface PredictiveSignal {
	id: string;
	name: string;
	category: string;
	score: number;
	confidence: number;
	prediction: string;
	level: 'high' | 'medium' | 'low';
	headlines: Array<{ title: string; link: string; source: string }>;
}

export interface CompoundSignal {
	id: string;
	name: string;
	topics: string[];
	activeTopics: string[]; // Which topics triggered
	score: number;
	keyJudgments: string[];
	indicators: string[];
	assumptions: string[];
	changeTriggers: string[];
	level: 'critical' | 'high' | 'elevated';
}

export interface CorrelationResults {
	emergingPatterns: EmergingPattern[];
	momentumSignals: MomentumSignal[];
	crossSourceCorrelations: CrossSourceCorrelation[];
	predictiveSignals: PredictiveSignal[];
	compoundSignals: CompoundSignal[];
	topicStats: Record<string, TopicStats>;
}

// Topic history for momentum analysis (in-memory)
const topicHistory: Record<number, Record<string, number>> = {};
const velocityHistory: Record<string, number[]> = {};

// History retention in minutes
const HISTORY_RETENTION_MINUTES = 30;

// Time window for momentum comparison in minutes
const MOMENTUM_WINDOW_MINUTES = 10;

// Persistence layer
const STORAGE_KEY = 'correlation_history';
const HISTORY_HOURS = 168; // 7 days of hourly data

interface PersistedHistory {
	hourlyAverages: Record<string, number[]>; // topicId -> last 168 hourly averages
	lastUpdate: number;
}

function isLocalStorageAvailable(): boolean {
	try {
		if (typeof localStorage === 'undefined' || typeof window === 'undefined') return false;
		const testKey = '__test__';
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

function loadHistory(): PersistedHistory {
	if (!isLocalStorageAvailable()) {
		return { hourlyAverages: {}, lastUpdate: Date.now() };
	}
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			if (data.hourlyAverages && data.lastUpdate) {
				return data;
			}
		}
	} catch (e) {
		console.warn('Failed to load correlation history:', e);
	}
	return { hourlyAverages: {}, lastUpdate: Date.now() };
}

function saveHistory(history: PersistedHistory): void {
	if (!isLocalStorageAvailable()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	} catch (e) {
		console.warn('Failed to save correlation history:', e);
	}
}

function updatePersistedHistory(topicCounts: Record<string, number>): PersistedHistory {
	const history = loadHistory();
	const now = Date.now();
	const currentHour = Math.floor(now / 3600000);
	const lastHour = Math.floor(history.lastUpdate / 3600000);

	// Only update once per hour
	if (currentHour > lastHour) {
		for (const [topicId, count] of Object.entries(topicCounts)) {
			if (!history.hourlyAverages[topicId]) {
				history.hourlyAverages[topicId] = [];
			}
			history.hourlyAverages[topicId].push(count);

			// Trim to last 168 hours (7 days)
			if (history.hourlyAverages[topicId].length > HISTORY_HOURS) {
				history.hourlyAverages[topicId] = history.hourlyAverages[topicId].slice(-HISTORY_HOURS);
			}
		}
		history.lastUpdate = now;
		saveHistory(history);
	}

	return history;
}

// Statistical functions
function calculateZScore(value: number, historyValues: number[]): number {
	if (historyValues.length < 3) return 0;

	const mean = historyValues.reduce((a, b) => a + b, 0) / historyValues.length;
	const variance =
		historyValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / historyValues.length;
	const stdDev = Math.sqrt(variance);

	if (stdDev === 0) return 0;
	return (value - mean) / stdDev;
}

function calculateVelocity(
	topicId: string,
	history: Record<number, Record<string, number>>
): number {
	const times = Object.keys(history)
		.map(Number)
		.sort((a, b) => b - a);
	if (times.length < 2) return 0;

	const recent = times.slice(0, 5);
	const deltas: number[] = [];

	for (let i = 0; i < recent.length - 1; i++) {
		const timeDiff = recent[i] - recent[i + 1];
		if (timeDiff > 0) {
			const currentCount = history[recent[i]]?.[topicId] || 0;
			const previousCount = history[recent[i + 1]]?.[topicId] || 0;
			deltas.push((currentCount - previousCount) / timeDiff);
		}
	}

	if (deltas.length === 0) return 0;
	return deltas.reduce((a, b) => a + b, 0) / deltas.length;
}

function calculateAcceleration(velocities: number[]): number {
	if (velocities.length < 2) return 0;
	return velocities[0] - velocities[1];
}

/**
 * Format topic ID to display name
 */
function formatTopicName(id: string): string {
	return id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get pattern level based on z-score and count
 */
function getPatternLevel(zScore: number, count: number): EmergingPattern['level'] {
	// Z-score based (statistical significance)
	if (zScore >= 2.5 || count >= 8) return 'high'; // >99% unusual
	if (zScore >= 1.5 || count >= 5) return 'elevated'; // >93% unusual
	return 'emerging'; // Default
}

/**
 * Get momentum level based on velocity and acceleration
 */
function getMomentumLevel(
	velocity: number,
	acceleration: number,
	delta: number
): MomentumSignal['momentum'] {
	if (velocity > 0.5 && acceleration > 0) return 'surging'; // Fast and accelerating
	if (velocity > 0.2 || acceleration > 0.1 || delta >= 4) return 'rising'; // Moderate or accelerating
	return 'stable';
}

/**
 * Detect compound patterns (cross-topic correlations)
 */
function detectCompoundPatterns(
	topicStats: Record<string, TopicStats>,
	compoundPatterns: CompoundPattern[]
): CompoundSignal[] {
	const signals: CompoundSignal[] = [];

	for (const pattern of compoundPatterns) {
		const activeTopics = pattern.topics.filter((topicId) => {
			const stats = topicStats[topicId];
			return stats && stats.count >= 2; // Topic must have at least 2 mentions
		});

		if (activeTopics.length >= pattern.minTopics) {
			const baseScore = activeTopics.reduce(
				(sum, tid) => sum + (topicStats[tid]?.weightedCount || 0),
				0
			);
			const score = baseScore * pattern.boostFactor;

			signals.push({
				id: pattern.id,
				name: pattern.name,
				topics: pattern.topics,
				activeTopics,
				score,
				keyJudgments: pattern.keyJudgments,
				indicators: pattern.indicators,
				assumptions: pattern.assumptions,
				changeTriggers: pattern.changeTriggers,
				level: score >= 30 ? 'critical' : score >= 20 ? 'high' : 'elevated'
			});
		}
	}

	return signals.sort((a, b) => b.score - a.score);
}

/**
 * Analyze correlations across all news items
 */
export function analyzeCorrelations(allNews: NewsItem[]): CorrelationResults | null {
	if (!allNews || allNews.length === 0) return null;

	const now = Date.now();
	const currentTime = Math.floor(now / 60000); // Current minute

	const results: CorrelationResults = {
		emergingPatterns: [],
		momentumSignals: [],
		crossSourceCorrelations: [],
		predictiveSignals: [],
		compoundSignals: [],
		topicStats: {}
	};

	// Track topic statistics
	const topicStats: Record<string, TopicStats> = {};
	const topicCounts: Record<string, number> = {};

	// Analyze each news item
	for (const item of allNews) {
		const title = item.title || '';
		const source = item.source || 'Unknown';
		const sourceWeight = getSourceWeight(source);

		for (const topic of CORRELATION_TOPICS) {
			const matches = topic.patterns.some((p) => p.test(title));
			if (matches) {
				if (!topicStats[topic.id]) {
					topicStats[topic.id] = {
						count: 0,
						weightedCount: 0,
						sources: new Set(),
						headlines: [],
						velocity: 0,
						acceleration: 0,
						zScore: 0
					};
				}
				topicStats[topic.id].count++;
				topicStats[topic.id].weightedCount += sourceWeight;
				topicStats[topic.id].sources.add(source);
				if (topicStats[topic.id].headlines.length < 5) {
					topicStats[topic.id].headlines.push({ title, link: item.link, source });
				}
				topicCounts[topic.id] = topicStats[topic.id].count;
			}
		}
	}

	// Update persisted history and calculate z-scores
	const persistedHistory = updatePersistedHistory(topicCounts);

	// Calculate z-scores for each topic
	for (const topicId of Object.keys(topicStats)) {
		const historyValues = persistedHistory.hourlyAverages[topicId] || [];
		topicStats[topicId].zScore = calculateZScore(topicStats[topicId].count, historyValues);
	}

	// Update topic history for momentum tracking
	if (!topicHistory[currentTime]) {
		topicHistory[currentTime] = { ...topicCounts };

		// Clean old history entries
		for (const timeKey of Object.keys(topicHistory)) {
			if (currentTime - parseInt(timeKey) > HISTORY_RETENTION_MINUTES) {
				delete topicHistory[parseInt(timeKey)];
			}
		}
	}

	// Calculate velocity and acceleration for each topic
	for (const topicId of Object.keys(topicStats)) {
		const velocity = calculateVelocity(topicId, topicHistory);
		topicStats[topicId].velocity = velocity;

		// Track velocity history for acceleration
		if (!velocityHistory[topicId]) {
			velocityHistory[topicId] = [];
		}
		velocityHistory[topicId].unshift(velocity);
		if (velocityHistory[topicId].length > 10) {
			velocityHistory[topicId] = velocityHistory[topicId].slice(0, 10);
		}

		topicStats[topicId].acceleration = calculateAcceleration(velocityHistory[topicId]);
	}

	// Get old counts for momentum comparison
	const oldTime = currentTime - MOMENTUM_WINDOW_MINUTES;
	const oldCounts = topicHistory[oldTime] || {};

	// Process each topic
	for (const topic of CORRELATION_TOPICS) {
		const stats = topicStats[topic.id];
		if (!stats) continue;

		const count = stats.count;
		const weightedCount = stats.weightedCount;
		const sources = Array.from(stats.sources);
		const headlines = stats.headlines;
		const oldCount = oldCounts[topic.id] || 0;
		const delta = count - oldCount;
		const zScore = stats.zScore;
		const velocity = stats.velocity;
		const acceleration = stats.acceleration;

		// Emerging Patterns (3+ mentions)
		if (count >= 3) {
			const level = getPatternLevel(zScore, count);

			results.emergingPatterns.push({
				id: topic.id,
				name: formatTopicName(topic.id),
				category: topic.category,
				count,
				weightedCount,
				level,
				sources,
				headlines,
				zScore
			});
		}

		// Momentum Signals (rising topics)
		if (delta >= 2 || (count >= 3 && delta >= 1) || velocity > 0.2) {
			const momentum = getMomentumLevel(velocity, acceleration, delta);

			results.momentumSignals.push({
				id: topic.id,
				name: formatTopicName(topic.id),
				category: topic.category,
				current: count,
				delta,
				velocity,
				acceleration,
				momentum,
				headlines
			});
		}

		// Cross-Source Correlations (3+ sources)
		if (sources.length >= 3) {
			const level: CrossSourceCorrelation['level'] =
				sources.length >= 5 ? 'high' : sources.length >= 4 ? 'elevated' : 'emerging';

			results.crossSourceCorrelations.push({
				id: topic.id,
				name: formatTopicName(topic.id),
				category: topic.category,
				sourceCount: sources.length,
				sources,
				level,
				headlines
			});
		}

		// Predictive Signals (based on combined weighted score)
		const score = weightedCount * 2 + sources.length * 3 + delta * 5 + zScore * 3;

		if (score >= 15) {
			const confidence = Math.min(95, Math.round(score * 1.5));
			const prediction = getPrediction(topic, count);
			const level: PredictiveSignal['level'] =
				confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';

			results.predictiveSignals.push({
				id: topic.id,
				name: formatTopicName(topic.id),
				category: topic.category,
				score,
				confidence,
				prediction,
				level,
				headlines
			});
		}
	}

	// Detect compound patterns
	results.compoundSignals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);

	// Expose topicStats for headline lookups
	results.topicStats = topicStats;

	// Sort results
	results.emergingPatterns.sort((a, b) => b.weightedCount - a.weightedCount);
	results.momentumSignals.sort((a, b) => b.velocity - a.velocity || b.delta - a.delta);
	results.crossSourceCorrelations.sort((a, b) => b.sourceCount - a.sourceCount);
	results.predictiveSignals.sort((a, b) => b.score - a.score);

	return results;
}

/**
 * Generate prediction text based on topic and count
 */
function getPrediction(topic: CorrelationTopic, count: number): string {
	if (topic.id === 'tariffs' && count >= 4) {
		return 'Market volatility likely in next 24-48h';
	}
	if (topic.id === 'fed-rates') {
		return 'Expect increased financial sector coverage';
	}
	if (topic.id.includes('china') || topic.id.includes('russia')) {
		return 'Geopolitical escalation narrative forming';
	}
	if (topic.id === 'layoffs') {
		return 'Employment concerns may dominate news cycle';
	}
	if (topic.category === 'Conflict') {
		return 'Breaking developments likely within hours';
	}
	return 'Topic gaining mainstream traction';
}

/**
 * Get correlation summary for status display
 */
export function getCorrelationSummary(results: CorrelationResults | null): {
	totalSignals: number;
	status: string;
} {
	if (!results) {
		return { totalSignals: 0, status: 'NO DATA' };
	}

	const totalSignals =
		results.emergingPatterns.length +
		results.momentumSignals.length +
		results.predictiveSignals.length +
		results.compoundSignals.length;

	return {
		totalSignals,
		status: totalSignals > 0 ? `${totalSignals} SIGNALS` : 'MONITORING'
	};
}

/**
 * Clear topic history (for testing or reset)
 */
export function clearCorrelationHistory(): void {
	for (const key of Object.keys(topicHistory)) {
		delete topicHistory[parseInt(key)];
	}
	for (const key of Object.keys(velocityHistory)) {
		delete velocityHistory[key];
	}
}

/**
 * Clear persisted history (for testing)
 */
export function clearPersistedHistory(): void {
	if (isLocalStorageAvailable()) {
		localStorage.removeItem(STORAGE_KEY);
	}
}

// Export for testing
export { calculateZScore, calculateVelocity, calculateAcceleration, detectCompoundPatterns };
export type { PersistedHistory };
