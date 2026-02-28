import {
	getCorrelationHistorySince,
	getManualInsights,
	insertManualInsight,
	pruneCorrelationHistory,
	upsertCorrelationHistoryPoint
} from './db';
import type {
	CompoundPatternAdditionCategory,
	CompoundPatternManualAdditions
} from '$lib/config/analysis';
import type { Locale } from '$lib/i18n/types';

export interface CorrelationHistoryPoint {
	hourBucket: number;
	topicId: string;
	count: number;
}

const VALID_LOCALES = new Set<Locale>(['en', 'pt-BR']);
const VALID_CATEGORIES = new Set<CompoundPatternAdditionCategory>([
	'keyJudgments',
	'confirmationSignals',
	'assumptions',
	'indicators',
	'changeTriggers'
]);

export function isValidLocale(value: string): value is Locale {
	return VALID_LOCALES.has(value as Locale);
}

export function isValidInsightCategory(value: string): value is CompoundPatternAdditionCategory {
	return VALID_CATEGORIES.has(value as CompoundPatternAdditionCategory);
}

export function buildManualAdditions(locale: Locale): CompoundPatternManualAdditions {
	const rows = getManualInsights(locale);
	const additions: CompoundPatternManualAdditions = {};

	for (const row of rows) {
		const category = row.category as CompoundPatternAdditionCategory;
		if (!isValidInsightCategory(category)) continue;
		const existing = additions[row.signalId] ?? {};
		const list = existing[category] ?? [];
		additions[row.signalId] = {
			...existing,
			[category]: [...list, row.text]
		};
	}

	return additions;
}

export function addManualInsight(input: {
	locale: Locale;
	signalId: string;
	category: CompoundPatternAdditionCategory;
	text: string;
}): { ok: true } | { ok: false; error: 'required' | 'invalid-category' } {
	const signalId = input.signalId.trim();
	const text = input.text.trim();
	if (!signalId || !text) return { ok: false, error: 'required' };
	if (!isValidInsightCategory(input.category)) return { ok: false, error: 'invalid-category' };

	const id = `${input.locale}:${input.signalId}:${input.category}:${Date.now()}:${Math.random()
		.toString(36)
		.slice(2, 10)}`;
	insertManualInsight({
		id,
		locale: input.locale,
		signalId,
		category: input.category,
		text
	});
	return { ok: true };
}

export function getCorrelationHistory(hours: number): CorrelationHistoryPoint[] {
	const nowHour = Math.floor(Date.now() / 3600000);
	const minHour = nowHour - Math.max(1, hours);
	return getCorrelationHistorySince(minHour).map((row) => ({
		hourBucket: row.hourBucket,
		topicId: row.topicId,
		count: row.count
	}));
}

export function upsertCorrelationHistory(points: CorrelationHistoryPoint[], keepHours: number): void {
	for (const point of points) {
		upsertCorrelationHistoryPoint(point.hourBucket, point.topicId, point.count);
	}

	const nowHour = Math.floor(Date.now() / 3600000);
	const minHour = nowHour - Math.max(1, keepHours);
	pruneCorrelationHistory(minHour);
}
