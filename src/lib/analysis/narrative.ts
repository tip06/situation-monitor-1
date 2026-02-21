/**
 * Narrative tracker - analyzes mainstream narrative trends and fringe-to-mainstream propagation
 */

import type { NewsItem } from '$lib/types';
import {
	NARRATIVE_PATTERNS,
	SOURCE_TYPES,
	MAINSTREAM_NARRATIVE_PATTERNS,
	type NarrativePattern
} from '$lib/config/analysis';

// Types for narrative results
export interface NarrativeData {
	id: string;
	name: string;
	category: string;
	severity: NarrativePattern['severity'];
	count: number;
	fringeCount: number;
	mainstreamCount: number;
	sources: string[];
	headlines: NewsItem[];
	keywords: string[];
}

export interface EmergingFringe extends NarrativeData {
	status: 'emerging' | 'spreading' | 'viral';
}

export interface FringeToMainstream extends NarrativeData {
	status: 'crossing';
	crossoverLevel: number;
}

// New type for trending mainstream narratives
export interface TrendingNarrative {
	id: string;
	name: string;
	category: string;
	region?: 'global' | 'brazil' | 'latam' | 'mena';
	count: number;
	sources: string[];
	headlines: NewsItem[];
	momentum: 'rising' | 'stable' | 'falling';
	sentiment: 'positive' | 'neutral' | 'negative';
}

export interface NarrativeResults {
	trendingNarratives: TrendingNarrative[];
	emergingFringe: EmergingFringe[];
	fringeToMainstream: FringeToMainstream[];
	narrativeWatch: NarrativeData[];
	disinfoSignals: NarrativeData[];
}

// Track narrative history for momentum calculation
const narrativeHistory: Record<
	string,
	{
		firstSeen: number;
		counts: { timestamp: number; count: number }[];
		sources: Set<string>;
	}
> = {};

// Minimum mentions to show a trending narrative
const MIN_TRENDING_MENTIONS = 2;

import { t } from '$lib/i18n';
import type { Locale } from '$lib/i18n/types';
import type { MessageKey } from '$lib/i18n/messages/en';

/**
 * Format narrative ID to display name with translation support
 */
function formatNarrativeName(id: string, locale: Locale = 'en'): string {
	const key = `narrative.${id}` as MessageKey;
	const translated = t(locale, key);
	if (translated !== key) return translated;
	return id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Classify source type
 */
function classifySource(source: string): 'fringe' | 'alternative' | 'mainstream' | null {
	const lowerSource = source.toLowerCase();

	for (const fringeSource of SOURCE_TYPES.fringe) {
		if (lowerSource.includes(fringeSource)) return 'fringe';
	}
	for (const altSource of SOURCE_TYPES.alternative) {
		if (lowerSource.includes(altSource)) return 'alternative';
	}
	for (const msSource of SOURCE_TYPES.mainstream) {
		if (lowerSource.includes(msSource)) return 'mainstream';
	}
	return null;
}

/**
 * Check if text matches any pattern in the list
 */
function matchesPatterns(text: string, patterns: RegExp[]): boolean {
	return patterns.some((pattern) => pattern.test(text));
}

/**
 * Calculate momentum based on history
 */
function calculateMomentum(
	narrativeId: string,
	currentCount: number
): 'rising' | 'stable' | 'falling' {
	const history = narrativeHistory[narrativeId];
	if (!history || history.counts.length < 2) {
		return 'stable';
	}

	// Compare to previous count
	const previousCounts = history.counts.slice(-3);
	if (previousCounts.length < 2) return 'stable';

	const avgPrevious =
		previousCounts.slice(0, -1).reduce((sum, c) => sum + c.count, 0) / (previousCounts.length - 1);

	if (currentCount > avgPrevious * 1.2) return 'rising';
	if (currentCount < avgPrevious * 0.8) return 'falling';
	return 'stable';
}

/**
 * Estimate sentiment from headlines (simple heuristic)
 */
function estimateSentiment(headlines: NewsItem[]): 'positive' | 'neutral' | 'negative' {
	const positivePatterns = [/surge|gain|rise|boost|rally|success|breakthrough|win|grow/i];
	const negativePatterns = [
		/crash|fall|drop|crisis|fear|risk|warn|threat|fail|lose|plunge|slump|loom|weak/i
	];

	let positive = 0;
	let negative = 0;

	for (const item of headlines) {
		const text = `${item.title || ''} ${item.description || ''}`;
		if (positivePatterns.some((p) => p.test(text))) positive++;
		if (negativePatterns.some((p) => p.test(text))) negative++;
	}

	if (positive > negative) return 'positive';
	if (negative > positive) return 'negative';
	return 'neutral';
}

/**
 * Analyze mainstream narrative patterns
 */
function analyzeMainstreamNarratives(
	allNews: NewsItem[],
	now: number,
	locale: Locale
): TrendingNarrative[] {
	const results: TrendingNarrative[] = [];

	for (const pattern of MAINSTREAM_NARRATIVE_PATTERNS) {
		const matches: NewsItem[] = [];
		const sources = new Set<string>();

		// Find matching news items - check both title AND description
		for (const item of allNews) {
			const title = item.title || '';
			const description = item.description || '';
			const combinedText = `${title} ${description}`;

			if (matchesPatterns(combinedText, pattern.patterns)) {
				matches.push(item);
				sources.add(item.source);
			}
		}

		// Only include if we have minimum mentions
		if (matches.length < MIN_TRENDING_MENTIONS) continue;

		// Update history
		if (!narrativeHistory[pattern.id]) {
			narrativeHistory[pattern.id] = {
				firstSeen: now,
				counts: [],
				sources: new Set()
			};
		}
		narrativeHistory[pattern.id].counts.push({ timestamp: now, count: matches.length });
		// Keep only last 10 data points
		if (narrativeHistory[pattern.id].counts.length > 10) {
			narrativeHistory[pattern.id].counts.shift();
		}
		for (const source of sources) {
			narrativeHistory[pattern.id].sources.add(source);
		}

		const momentum = calculateMomentum(pattern.id, matches.length);
		const sentiment = estimateSentiment(matches);

		results.push({
			id: pattern.id,
			name: formatNarrativeName(pattern.id, locale),
			category: pattern.category,
			region: pattern.region,
			count: matches.length,
			sources: [...sources].slice(0, 5),
			headlines: matches.slice(0, 3),
			momentum,
			sentiment
		});
	}

	// Sort by count descending
	results.sort((a, b) => b.count - a.count);

	return results;
}

/**
 * Analyze fringe narratives (original logic, enhanced with description matching)
 */
function analyzeFringeNarratives(
	allNews: NewsItem[],
	now: number,
	locale: Locale
): {
	emergingFringe: EmergingFringe[];
	fringeToMainstream: FringeToMainstream[];
	narrativeWatch: NarrativeData[];
	disinfoSignals: NarrativeData[];
} {
	const results = {
		emergingFringe: [] as EmergingFringe[],
		fringeToMainstream: [] as FringeToMainstream[],
		narrativeWatch: [] as NarrativeData[],
		disinfoSignals: [] as NarrativeData[]
	};

	for (const narrative of NARRATIVE_PATTERNS) {
		const matches: NewsItem[] = [];
		const sourceMatches: {
			fringe: NewsItem[];
			alternative: NewsItem[];
			mainstream: NewsItem[];
		} = {
			fringe: [],
			alternative: [],
			mainstream: []
		};

		// Find matching news items - now check both title AND description
		for (const item of allNews) {
			const title = (item.title || '').toLowerCase();
			const description = (item.description || '').toLowerCase();
			const combinedText = `${title} ${description}`;
			const source = (item.source || '').toLowerCase();

			const hasMatch = narrative.keywords.some((kw) => combinedText.includes(kw.toLowerCase()));

			if (hasMatch) {
				matches.push(item);

				const sourceType = classifySource(source);
				if (sourceType) {
					sourceMatches[sourceType].push(item);
				}
			}
		}

		if (matches.length === 0) continue;

		// Update narrative history
		const historyKey = `fringe-${narrative.id}`;
		if (!narrativeHistory[historyKey]) {
			narrativeHistory[historyKey] = {
				firstSeen: now,
				counts: [],
				sources: new Set()
			};
		}
		for (const match of matches) {
			narrativeHistory[historyKey].sources.add(match.source);
		}

		// Build narrative data
		const narrativeData: NarrativeData = {
			id: narrative.id,
			name: formatNarrativeName(narrative.id, locale),
			category: narrative.category,
			severity: narrative.severity,
			count: matches.length,
			fringeCount: sourceMatches.fringe.length,
			mainstreamCount: sourceMatches.mainstream.length,
			sources: [...new Set(matches.map((m) => m.source))].slice(0, 5),
			headlines: matches.slice(0, 3),
			keywords: narrative.keywords
		};

		// Categorize narrative
		if (sourceMatches.mainstream.length > 0 && sourceMatches.fringe.length > 0) {
			// Fringe to Mainstream crossover
			results.fringeToMainstream.push({
				...narrativeData,
				status: 'crossing',
				crossoverLevel: sourceMatches.mainstream.length / matches.length
			});
		} else if (narrative.severity === 'disinfo') {
			// Known disinformation pattern
			results.disinfoSignals.push(narrativeData);
		} else if (sourceMatches.fringe.length > 0 || sourceMatches.alternative.length > 0) {
			// Emerging from fringe sources
			const status: EmergingFringe['status'] =
				matches.length >= 5 ? 'viral' : matches.length >= 3 ? 'spreading' : 'emerging';

			results.emergingFringe.push({
				...narrativeData,
				status
			});
		} else {
			// General narrative watch
			results.narrativeWatch.push(narrativeData);
		}
	}

	// Sort results
	results.emergingFringe.sort((a, b) => b.count - a.count);
	results.fringeToMainstream.sort((a, b) => b.crossoverLevel - a.crossoverLevel);
	results.narrativeWatch.sort((a, b) => b.count - a.count);
	results.disinfoSignals.sort((a, b) => b.count - a.count);

	return results;
}

/**
 * Analyze narratives across all news items
 */
export function analyzeNarratives(
	allNews: NewsItem[],
	locale: Locale = 'en'
): NarrativeResults | null {
	if (!allNews || allNews.length === 0) return null;

	const now = Date.now();

	// Analyze mainstream narratives (always active)
	const trendingNarratives = analyzeMainstreamNarratives(allNews, now, locale);

	// Analyze fringe narratives (works best with fringe sources)
	const fringeResults = analyzeFringeNarratives(allNews, now, locale);

	return {
		trendingNarratives,
		...fringeResults
	};
}

/**
 * Get narrative summary for status display
 */
export function getNarrativeSummary(results: NarrativeResults | null): {
	total: number;
	status: string;
} {
	if (!results) {
		return { total: 0, status: 'NO DATA' };
	}

	const total =
		results.trendingNarratives.length +
		results.emergingFringe.length +
		results.fringeToMainstream.length +
		results.narrativeWatch.length +
		results.disinfoSignals.length;

	return {
		total,
		status: total > 0 ? `${total} ACTIVE` : 'MONITORING'
	};
}

/**
 * Clear narrative history (for testing or reset)
 */
export function clearNarrativeHistory(): void {
	for (const key of Object.keys(narrativeHistory)) {
		delete narrativeHistory[key];
	}
}
