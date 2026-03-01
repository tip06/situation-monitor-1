import type { InternetOutage } from '$lib/api/outages';
import type { Theater } from '$lib/config/theaters';
import type { NewsItem } from '$lib/types';

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'convergence' | 'outage' | 'stability' | 'composite';
export type RiskTrend = 'escalating' | 'stable' | 'de-escalating';
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'critical';
type SignalType = 'military' | 'cyber' | 'economic' | 'political' | 'social';

export interface UnifiedAlert {
	id: string;
	type: AlertType;
	priority: AlertPriority;
	title: string;
	summary: string;
	location?: { lat: number; lon: number; label: string };
	countries: string[];
	timestamp: Date;
}

export interface TheaterRiskScore {
	theaterId: string;
	theaterName: string;
	score: number;
	signalCount: number;
	typeCount: number;
	alertCount: number;
	topHeadlines: string[];
	topSignals: Array<{
		id: string;
		title: string;
		link: string;
		source: string;
		timestamp: number;
		priority: AlertPriority;
	}>;
	centerLat: number;
	centerLon: number;
}

export interface CountryRiskScore {
	key: string;
	name: string;
	stability: number;
	instability: number;
	level: RiskLevel;
}

export interface StrategicRiskOverview {
	convergenceAlerts: number;
	avgCIIDeviation: number;
	infrastructureIncidents: number;
	compositeScore: number;
	trend: RiskTrend;
	level: RiskLevel;
	topRisks: string[];
	topConvergenceZones: Array<{ theaterId: string; name: string; lat: number; lon: number; score: number }>;
	unstableCountries: CountryRiskScore[];
	theaterScores: TheaterRiskScore[];
	recentAlerts: UnifiedAlert[];
	timestamp: Date;
	breakdown: {
		convergenceScore: number;
		ciiRiskScore: number;
		infraScore: number;
		theaterBoost: number;
		breakingBoost: number;
	};
}

export interface StrategicRiskInput {
	news: NewsItem[];
	stabilityScores: Record<string, number> | null | undefined;
	outages: InternetOutage[];
	theaters: Theater[];
	previousCompositeScore?: number | null;
	now?: number;
}

const COUNTRY_NAMES: Record<string, string> = {
	usa: 'United States',
	china: 'China',
	russia: 'Russia',
	iran: 'Iran',
	israel: 'Israel',
	ukraine: 'Ukraine',
	venezuela: 'Venezuela',
	brazil: 'Brazil',
	india: 'India',
	pakistan: 'Pakistan',
	northkorea: 'North Korea',
	taiwan: 'Taiwan',
	saudiarabia: 'Saudi Arabia',
	turkey: 'Turkey',
	germany: 'Germany'
};

const SIGNAL_PATTERNS: Record<SignalType, RegExp[]> = {
	military: [
		/\bwar\b/i,
		/\bmilitary\b/i,
		/\bmissile\b/i,
		/\bdrone strike\b/i,
		/\bnato\b/i,
		/\binvasion\b/i
	],
	cyber: [/\bcyber\b/i, /\bransomware\b/i, /\bmalware\b/i, /\bhack(ed|ing)?\b/i, /\boutage\b/i],
	economic: [/\binflation\b/i, /\brecession\b/i, /\bbank(ing)? crisis\b/i, /\bdebt\b/i, /\bsanction/i],
	political: [/\belection\b/i, /\bcoup\b/i, /\bparliament\b/i, /\bgovernment\b/i, /\bdiplomatic\b/i],
	social: [/\bprotest\b/i, /\briot\b/i, /\bunrest\b/i, /\bmigration\b/i, /\bstrike\b/i]
};

const PRIORITY_PATTERNS = {
	critical: [/\bnuclear\b/i, /\binvasion\b/i, /\bdeclares? war\b/i, /\bstate of emergency\b/i],
	high: [/\bmissile\b/i, /\bairstrike\b/i, /\bterror\b/i, /\bmajor outage\b/i, /\bcoup\b/i],
	medium: [/\bcyber\b/i, /\bsanction\b/i, /\bmilitary\b/i, /\bprotest\b/i, /\bunrest\b/i]
};

const BREAKING_WINDOW_MS = 6 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function toRiskLevel(score: number): RiskLevel {
	if (score >= 70) return 'critical';
	if (score >= 50) return 'elevated';
	if (score >= 30) return 'moderate';
	return 'low';
}

function inferSignalTypes(item: NewsItem): Set<SignalType> {
	const types = new Set<SignalType>();
	const text = `${item.title} ${item.description ?? ''}`;

	for (const [type, patterns] of Object.entries(SIGNAL_PATTERNS) as Array<[SignalType, RegExp[]]>) {
		if (patterns.some((pattern) => pattern.test(text))) {
			types.add(type);
		}
	}

	if ((item.topics ?? []).some((topic) => topic.includes('cyber'))) types.add('cyber');
	if ((item.topics ?? []).some((topic) => topic.includes('military') || topic.includes('conflict'))) {
		types.add('military');
	}
	if (item.category === 'finance') types.add('economic');
	if (item.category === 'politics' || item.category === 'gov') types.add('political');

	return types;
}

function classifyPriority(item: NewsItem): AlertPriority {
	const text = `${item.title} ${item.description ?? ''}`;
	if (PRIORITY_PATTERNS.critical.some((pattern) => pattern.test(text))) return 'critical';
	if (PRIORITY_PATTERNS.high.some((pattern) => pattern.test(text))) return 'high';
	if (PRIORITY_PATTERNS.medium.some((pattern) => pattern.test(text)) || item.isAlert) return 'medium';
	return 'low';
}

function priorityValue(priority: AlertPriority): number {
	if (priority === 'critical') return 4;
	if (priority === 'high') return 3;
	if (priority === 'medium') return 2;
	return 1;
}

function countryLabel(key: string): string {
	return COUNTRY_NAMES[key] ?? key;
}

function calculateCountryRisk(scores: Record<string, number> | null | undefined): CountryRiskScore[] {
	if (!scores) return [];

	return Object.entries(scores)
		.map(([key, stability]) => {
			const safeStability = clamp(Number.isFinite(stability) ? stability : 50, 0, 100);
			const instability = clamp(100 - safeStability, 0, 100);
			return {
				key,
				name: countryLabel(key),
				stability: Math.round(safeStability),
				instability: Math.round(instability),
				level: toRiskLevel(instability)
			};
		})
		.sort((a, b) => b.instability - a.instability);
}

function calculateCIIRiskScore(countryRisk: CountryRiskScore[]): number {
	if (countryRisk.length === 0) return 0;
	const top5 = countryRisk.slice(0, 5);
	const weights = [0.4, 0.25, 0.2, 0.1, 0.05];

	let weighted = 0;
	for (let i = 0; i < top5.length; i += 1) {
		const entry = top5[i];
		const weight = weights[i] ?? 0;
		weighted += entry.instability * weight;
	}

	const elevatedCount = countryRisk.filter((entry) => entry.instability >= 50).length;
	const elevatedBonus = Math.min(20, elevatedCount * 5);

	return clamp(Math.round(weighted + elevatedBonus), 0, 100);
}

function isOutageRelevantToTheater(outage: InternetOutage, theater: Theater): boolean {
	const normalizedCountry = outage.country.trim().toLowerCase();
	const normalizedRegion = outage.region.trim().toLowerCase();
	const byCountry = theater.focusCountries.some((country) => normalizedCountry.includes(countryLabel(country).toLowerCase()));
	const byKeyword = theater.keywords.some((keyword) => normalizedCountry.includes(keyword.toLowerCase()) || normalizedRegion.includes(keyword.toLowerCase()));
	return byCountry || byKeyword;
}

function scoreTheaters(news: NewsItem[], outages: InternetOutage[], theaters: Theater[]): TheaterRiskScore[] {
	return theaters
		.map((theater) => {
			const matches = news.filter((item) => {
				const text = `${item.title} ${item.description ?? ''}`.toLowerCase();
				return theater.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
			});

			const categoryCount = new Set(matches.map((item) => item.category)).size;
			const typeSet = new Set<SignalType>();
			let highPriorityHits = 0;
			for (const item of matches) {
				for (const type of inferSignalTypes(item)) typeSet.add(type);
				const priority = classifyPriority(item);
				if (priority === 'critical' || priority === 'high') highPriorityHits += 1;
			}

			const outageHits = outages.filter((outage) => isOutageRelevantToTheater(outage, theater)).length;
			const score = clamp(
				matches.length * 12 + categoryCount * 10 + typeSet.size * 15 + highPriorityHits * 10 + outageHits * 10,
				0,
				100
			);
			const sortedMatches = [...matches].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

			return {
				theaterId: theater.id,
				theaterName: theater.name,
				score,
				signalCount: matches.length,
				typeCount: typeSet.size,
				alertCount: highPriorityHits,
				topHeadlines: sortedMatches.slice(0, 4).map((item) => item.title),
				topSignals: sortedMatches.slice(0, 6).map((item) => ({
					id: item.id,
					title: item.title,
					link: item.link,
					source: item.source,
					timestamp: item.timestamp,
					priority: classifyPriority(item)
				})),
				centerLat: theater.centerLat,
				centerLon: theater.centerLon
			};
		})
		.sort((a, b) => b.score - a.score);
}

function buildAlerts(
	news: NewsItem[],
	theaterScores: TheaterRiskScore[],
	outages: InternetOutage[],
	now: number
): UnifiedAlert[] {
	const newsAlerts: UnifiedAlert[] = news
		.filter((item) => now - item.timestamp <= ONE_DAY_MS)
		.map((item) => {
			const priority = classifyPriority(item);
			const matchingTheater = theaterScores.find((theater) => {
				const text = `${item.title} ${item.description ?? ''}`.toLowerCase();
				return text.includes(theater.theaterName.toLowerCase());
			});

			const location = matchingTheater
				? { lat: matchingTheater.centerLat, lon: matchingTheater.centerLon, label: matchingTheater.theaterName }
				: undefined;

			return {
				id: item.id,
				type: matchingTheater ? 'convergence' : 'composite',
				priority,
				title: item.title,
				summary: (item.description ?? '').trim().slice(0, 220) || item.source,
				location,
				countries: [],
				timestamp: new Date(item.timestamp)
			} satisfies UnifiedAlert;
		})
		.filter((alert) => priorityValue(alert.priority) >= priorityValue('medium'));

	const outageAlerts: UnifiedAlert[] = outages
		.filter((outage) => outage.severity === 'major' || outage.severity === 'total')
		.map((outage) => ({
			id: `outage-${outage.id}`,
			type: 'outage',
			priority: outage.severity === 'total' ? 'critical' : 'high',
			title: outage.title,
			summary: outage.description || `${outage.outageType} outage in ${outage.country}`,
			location: { lat: outage.lat, lon: outage.lon, label: outage.country || outage.region },
			countries: outage.country ? [outage.country] : [],
			timestamp: new Date(outage.detectedAt || now)
		}));

	// Theater-level synthetic alerts improve visibility when no article has location metadata.
	const theaterAlerts: UnifiedAlert[] = theaterScores
		.filter((theater) => theater.score >= 60 && theater.signalCount >= 3)
		.slice(0, 3)
			.map((theater) => ({
				id: `theater-${theater.theaterId}`,
				type: 'convergence',
				priority: theater.score >= 80 ? 'critical' : 'high',
				title: `${theater.theaterName} convergence`,
				summary: `${theater.signalCount} signals across ${theater.typeCount} domains`,
				location: { lat: theater.centerLat, lon: theater.centerLon, label: theater.theaterName },
				countries: [],
				timestamp: new Date(now)
			}));

	return [...newsAlerts, ...outageAlerts, ...theaterAlerts]
		.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
		.slice(0, 12);
}

function identifyTopRisks(
	theaterScores: TheaterRiskScore[],
	countryRisk: CountryRiskScore[],
	majorOutages: InternetOutage[]
): string[] {
	const risks: string[] = [];
	const topTheater = theaterScores[0];
	if (topTheater && topTheater.score >= 45) {
		risks.push(`Convergence: ${topTheater.theaterName} (${Math.round(topTheater.score)})`);
	}

	for (const country of countryRisk.slice(0, 2)) {
		if (country.instability >= 40) {
			risks.push(`${country.name} instability: ${country.instability} (${country.level})`);
		}
	}

	if (majorOutages.length > 0) {
		risks.push(`Infrastructure outages: ${majorOutages.length} major/total events`);
	}

	return risks.slice(0, 3);
}

function determineTrend(current: number, previous: number | null | undefined): RiskTrend {
	if (previous === null || previous === undefined) return 'stable';
	const diff = current - previous;
	if (diff >= 3) return 'escalating';
	if (diff <= -3) return 'de-escalating';
	return 'stable';
}

export function calculateStrategicRiskOverview(input: StrategicRiskInput): StrategicRiskOverview {
	const now = input.now ?? Date.now();
	const recentNews = input.news.filter((item) => now - item.timestamp <= ONE_DAY_MS);
	const countryRisk = calculateCountryRisk(input.stabilityScores);
	const ciiRiskScore = calculateCIIRiskScore(countryRisk);

	const theaterScores = scoreTheaters(recentNews, input.outages, input.theaters);
	const convergentTheaters = theaterScores.filter((theater) => theater.signalCount >= 3 && theater.typeCount >= 2);
	const convergenceScore = Math.min(100, convergentTheaters.length * 25);

	const majorOutages = input.outages.filter((outage) => outage.severity === 'major' || outage.severity === 'total');
	const infraScore = Math.min(100, majorOutages.length * 25);

	let theaterBoost = 0;
	for (const theater of theaterScores) {
		if (theater.signalCount === 0) continue;
		const assetScore = Math.min(10, Math.floor(theater.signalCount / 3));
		theaterBoost += theater.alertCount > 0 ? assetScore + 5 : assetScore;
	}
	theaterBoost = Math.min(25, theaterBoost);

	const breakingCandidates = recentNews.filter((item) => now - item.timestamp <= BREAKING_WINDOW_MS);
	let breakingBoost = 0;
	for (const item of breakingCandidates) {
		const priority = classifyPriority(item);
		if (priority === 'critical') breakingBoost += 15;
		else if (priority === 'high') breakingBoost += 8;
	}
	breakingBoost = Math.min(15, breakingBoost);

	const compositeScore = clamp(
		Math.round(convergenceScore * 0.3 + ciiRiskScore * 0.5 + infraScore * 0.2 + theaterBoost + breakingBoost),
		0,
		100
	);

	const alerts = buildAlerts(recentNews, theaterScores, input.outages, now);
	const topRisks = identifyTopRisks(theaterScores, countryRisk, majorOutages);

	return {
		convergenceAlerts: convergentTheaters.length,
		avgCIIDeviation: countryRisk[0]?.instability ?? 0,
		infrastructureIncidents: majorOutages.length,
		compositeScore,
		trend: determineTrend(compositeScore, input.previousCompositeScore),
		level: toRiskLevel(compositeScore),
		topRisks,
		topConvergenceZones: convergentTheaters.slice(0, 3).map((theater) => ({
			theaterId: theater.theaterId,
			name: theater.theaterName,
			lat: theater.centerLat,
			lon: theater.centerLon,
			score: theater.score
		})),
		unstableCountries: countryRisk.filter((country) => country.instability >= 35).slice(0, 5),
		theaterScores: theaterScores.slice(0, 6),
		recentAlerts: alerts,
		timestamp: new Date(now),
		breakdown: {
			convergenceScore,
			ciiRiskScore,
			infraScore,
			theaterBoost,
			breakingBoost
		}
	};
}
