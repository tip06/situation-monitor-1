import { analyzeCorrelations } from '$lib/analysis/correlation';
import { analyzeNarratives } from '$lib/analysis/narrative';
import type { MarketsState } from '$lib/stores/markets';
import type { Locale } from '$lib/i18n/types';
import type { NewsItem } from '$lib/types';
import type { PanelId } from '$lib/config';

export type AlertType =
	| 'newsAlert'
	| 'econSwing'
	| 'compound'
	| 'emerging'
	| 'momentum'
	| 'predictive'
	| 'narrativeTracker'
	| 'narrativeWatch';

export type AlertSeverity = 'danger' | 'warning' | 'info';

export interface AlertPopup {
	id: string;
	type: AlertType;
	titleKey: string;
	detail?: string;
	count: number;
	timestamp: number;
	severity: AlertSeverity;
	panelId?: PanelId;
	tabId?: 'global' | 'regional' | 'economy' | 'social' | 'technology';
}

interface DetectAlertsParams {
	newsItems: NewsItem[];
	marketsState: MarketsState;
	locale: Locale;
	getPanelForNews?: (item: NewsItem) => PanelId | undefined;
}

const ECON_THRESHOLDS = {
	indices: 1.5,
	commodities: 3
};

const prevNewsAlertIds = new Set<string>();
const prevCompoundIds = new Set<string>();
const prevEmergingIds = new Set<string>();
const prevMomentumIds = new Set<string>();
const prevPredictiveIds = new Set<string>();
const prevNarrativeTrackerIds = new Set<string>();
const prevNarrativeWatchIds = new Set<string>();
const activeSwingSymbols = new Set<string>();

export function resetAlertState(): void {
	prevNewsAlertIds.clear();
	prevCompoundIds.clear();
	prevEmergingIds.clear();
	prevMomentumIds.clear();
	prevPredictiveIds.clear();
	prevNarrativeTrackerIds.clear();
	prevNarrativeWatchIds.clear();
	activeSwingSymbols.clear();
}

function createPopup(
	type: AlertType,
	count: number,
	detail: string | undefined,
	severity: AlertSeverity,
	panelId?: PanelId,
	tabId?: AlertPopup['tabId']
): AlertPopup {
	return {
		id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		type,
		titleKey: `alerts.title.${type}`,
		detail,
		count,
		timestamp: Date.now(),
		severity,
		panelId,
		tabId
	};
}

function addNewIds(currentIds: string[], prevIds: Set<string>): string[] {
	const newIds: string[] = [];
	for (const id of currentIds) {
		if (!prevIds.has(id)) {
			newIds.push(id);
		}
	}
	prevIds.clear();
	for (const id of currentIds) prevIds.add(id);
	return newIds;
}

function getTabForPanel(panelId?: PanelId): AlertPopup['tabId'] | undefined {
	if (!panelId) return undefined;
	switch (panelId) {
		case 'markets':
		case 'commodities':
		case 'crypto':
		case 'heatmap':
		case 'finance':
			return 'economy';
		case 'correlation':
		case 'narrative':
		case 'polymarket':
			return 'social';
		case 'brazil':
		case 'latam':
			return 'regional';
		case 'tech':
		case 'ai':
			return 'technology';
		default:
			return 'global';
	}
}

export function detectAlerts({
	newsItems,
	marketsState,
	locale,
	getPanelForNews
}: DetectAlertsParams): AlertPopup[] {
	const popups: AlertPopup[] = [];

	// News alerts
	const alertNews = newsItems.filter((item) => item.isAlert);
	const alertNewsIds = alertNews.map((item) => item.id);
	const newAlertIds = addNewIds(alertNewsIds, prevNewsAlertIds);
	if (newAlertIds.length > 0) {
		const example = alertNews.find((item) => newAlertIds.includes(item.id));
		const panelId = example && getPanelForNews ? getPanelForNews(example) : undefined;
		const tabId = getTabForPanel(panelId);
		popups.push(
			createPopup(
				'newsAlert',
				newAlertIds.length,
				example?.title,
				'danger',
				panelId,
				tabId
			)
		);
	}

	// Economic indicator swings
	const econItems = [
		...marketsState.indices.items.map((item) => ({ item, category: 'indices' as const })),
		...marketsState.commodities.items.map((item) => ({ item, category: 'commodities' as const }))
	];
	const newSwings: { symbol: string; name: string }[] = [];
	for (const entry of econItems) {
		const threshold = ECON_THRESHOLDS[entry.category];
		const symbol = entry.item.symbol;
		const change = Math.abs(entry.item.changePercent);
		if (change >= threshold) {
			if (!activeSwingSymbols.has(symbol)) {
				activeSwingSymbols.add(symbol);
				newSwings.push({ symbol, name: entry.item.name });
			}
		} else {
			activeSwingSymbols.delete(symbol);
		}
	}
	if (newSwings.length > 0) {
		const example = newSwings[0];
		popups.push(
			createPopup(
				'econSwing',
				newSwings.length,
				example?.name ?? example?.symbol,
				'warning',
				'markets',
				'economy'
			)
		);
	}

	// Correlation-based signals
	const correlation = analyzeCorrelations(newsItems, locale);
	if (correlation) {
		const newCompound = addNewIds(
			correlation.compoundSignals.map((c) => c.id),
			prevCompoundIds
		);
		if (newCompound.length > 0) {
			const example = correlation.compoundSignals.find((c) => newCompound.includes(c.id));
			popups.push(
				createPopup(
					'compound',
					newCompound.length,
					example?.name,
					'danger',
					'correlation',
					'social'
				)
			);
		}

		const newEmerging = addNewIds(
			correlation.emergingPatterns.map((c) => c.id),
			prevEmergingIds
		);
		if (newEmerging.length > 0) {
			const example = correlation.emergingPatterns.find((c) => newEmerging.includes(c.id));
			popups.push(
				createPopup(
					'emerging',
					newEmerging.length,
					example?.name,
					'warning',
					'correlation',
					'social'
				)
			);
		}

		const newMomentum = addNewIds(
			correlation.momentumSignals.map((c) => c.id),
			prevMomentumIds
		);
		if (newMomentum.length > 0) {
			const example = correlation.momentumSignals.find((c) => newMomentum.includes(c.id));
			popups.push(
				createPopup(
					'momentum',
					newMomentum.length,
					example?.name,
					'warning',
					'correlation',
					'social'
				)
			);
		}

		const newPredictive = addNewIds(
			correlation.predictiveSignals.map((c) => c.id),
			prevPredictiveIds
		);
		if (newPredictive.length > 0) {
			const example = correlation.predictiveSignals.find((c) => newPredictive.includes(c.id));
			popups.push(
				createPopup(
					'predictive',
					newPredictive.length,
					example?.prediction ?? example?.name,
					'info',
					'correlation',
					'social'
				)
			);
		}
	}

	// Narrative alerts
	const narrative = analyzeNarratives(newsItems);
	if (narrative) {
		const trackerIds = [
			...narrative.trendingNarratives.map((n) => n.id),
			...narrative.emergingFringe.map((n) => n.id),
			...narrative.fringeToMainstream.map((n) => n.id),
			...narrative.disinfoSignals.map((n) => n.id)
		];
		const newTracker = addNewIds(trackerIds, prevNarrativeTrackerIds);
		if (newTracker.length > 0) {
			const example =
				narrative.trendingNarratives.find((n) => newTracker.includes(n.id)) ??
				narrative.emergingFringe.find((n) => newTracker.includes(n.id)) ??
				narrative.fringeToMainstream.find((n) => newTracker.includes(n.id)) ??
				narrative.disinfoSignals.find((n) => newTracker.includes(n.id));
			popups.push(
				createPopup(
					'narrativeTracker',
					newTracker.length,
					example?.name,
					'info',
					'narrative',
					'social'
				)
			);
		}

		const watchIds = narrative.narrativeWatch.map((n) => n.id);
		const newWatch = addNewIds(watchIds, prevNarrativeWatchIds);
		if (newWatch.length > 0) {
			const example = narrative.narrativeWatch.find((n) => newWatch.includes(n.id));
			popups.push(
				createPopup(
					'narrativeWatch',
					newWatch.length,
					example?.name,
					'info',
					'narrative',
					'social'
				)
			);
		}
	}

	return popups;
}
