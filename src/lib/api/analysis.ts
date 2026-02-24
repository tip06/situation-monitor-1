import type { Locale } from '$lib/i18n/types';
import type {
	CompoundPatternAdditionCategory,
	CompoundPatternManualAdditions
} from '$lib/config/analysis';

export interface CorrelationHistoryPoint {
	hourBucket: number;
	topicId: string;
	count: number;
}

export async function fetchManualAdditions(
	locale: Locale
): Promise<CompoundPatternManualAdditions> {
	const res = await fetch(`/api/analysis/insights?locale=${encodeURIComponent(locale)}`);
	if (!res.ok) throw new Error(`Failed to load manual insights (${res.status})`);
	const data = (await res.json()) as { additions?: CompoundPatternManualAdditions };
	return data.additions ?? {};
}

export async function createManualInsight(input: {
	locale: Locale;
	signalId: string;
	category: CompoundPatternAdditionCategory;
	text: string;
}): Promise<CompoundPatternManualAdditions> {
	const res = await fetch('/api/analysis/insights', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({ error: 'required' }));
		throw new Error(data?.error ?? `Failed to create insight (${res.status})`);
	}
	const data = (await res.json()) as { additions?: CompoundPatternManualAdditions };
	return data.additions ?? {};
}

export async function fetchCorrelationHistory(hours = 168): Promise<CorrelationHistoryPoint[]> {
	const res = await fetch(`/api/analysis/history?hours=${hours}`);
	if (!res.ok) throw new Error(`Failed to load correlation history (${res.status})`);
	const data = (await res.json()) as { points?: CorrelationHistoryPoint[] };
	return data.points ?? [];
}

export async function persistCorrelationHistory(
	points: CorrelationHistoryPoint[],
	keepHours = 168
): Promise<void> {
	await fetch('/api/analysis/history', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ points, keepHours })
	});
}
