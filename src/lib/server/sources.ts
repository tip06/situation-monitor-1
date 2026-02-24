import type { FeedSource } from '$lib/config/feeds';
import { FEEDS } from '$lib/config/feeds';
import type { NewsCategory, SourceMutationError, SourceRecord } from '$lib/types';
import {
	deleteCustomSource,
	deleteSourceOverride,
	getCustomSources,
	getSourceOverrides,
	insertCustomSource,
	setSourceOverride,
	updateCustomSource
} from './db';

type SourceMutationResult =
	| { ok: true; record: SourceRecord }
	| { ok: false; error: SourceMutationError };

const VALID_CATEGORIES = new Set<NewsCategory>(Object.keys(FEEDS) as NewsCategory[]);

function normalizeValue(value: string): string {
	return value.trim().toLowerCase();
}

function buildSourceId(category: NewsCategory, name: string, url: string): string {
	const normalized = `${category}::${normalizeValue(name)}::${normalizeValue(url)}`;
	return normalized.replace(/[^a-z0-9:/._-]+/g, '-');
}

function isValidHttpUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

function createBuiltInSources(): SourceRecord[] {
	return (Object.entries(FEEDS) as [NewsCategory, FeedSource[]][])
		.flatMap(([category, feeds]) =>
			feeds.map((feed) => ({
				id: buildSourceId(category, feed.name, feed.url),
				category,
				name: feed.name,
				url: feed.url,
				enabled: true,
				isCustom: false
			}))
		)
		.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllSources(): SourceRecord[] {
	const builtIn = createBuiltInSources();
	const custom = getCustomSources().map<SourceRecord>((record) => ({
		id: record.id,
		category: record.category as NewsCategory,
		name: record.name,
		url: record.url,
		enabled: record.enabled,
		isCustom: true
	}));
	const overrides = new Map(getSourceOverrides().map((row) => [row.id, row.enabled]));

	return [...builtIn, ...custom]
		.map((record) => ({
			...record,
			enabled: overrides.get(record.id) ?? record.enabled
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export function getEnabledFeedsByCategory(category: NewsCategory): FeedSource[] {
	return getAllSources()
		.filter((record) => record.category === category && record.enabled)
		.map((record) => ({ name: record.name, url: record.url }));
}

export function addSource(input: {
	category: NewsCategory;
	name: string;
	url: string;
}): SourceMutationResult {
	if (!VALID_CATEGORIES.has(input.category)) {
		return { ok: false, error: 'required' };
	}

	const name = input.name.trim();
	const url = input.url.trim();
	if (!name || !url) return { ok: false, error: 'required' };
	if (!isValidHttpUrl(url)) return { ok: false, error: 'invalid-url' };

	const existing = getAllSources().some(
		(record) =>
			record.category === input.category && normalizeValue(record.url) === normalizeValue(url)
	);
	if (existing) return { ok: false, error: 'duplicate' };

	const id = buildSourceId(input.category, name, url);
	try {
		insertCustomSource({
			id,
			category: input.category,
			name,
			url,
			enabled: true
		});
	} catch {
		return { ok: false, error: 'duplicate' };
	}

	return {
		ok: true,
		record: {
			id,
			category: input.category,
			name,
			url,
			enabled: true,
			isCustom: true
		}
	};
}

export function toggleSource(id: string): SourceMutationResult {
	const source = getAllSources().find((record) => record.id === id);
	if (!source) return { ok: false, error: 'not-found' };

	const nextEnabled = !source.enabled;
	if (source.isCustom) {
		updateCustomSource(id, { enabled: nextEnabled });
	}
	setSourceOverride(id, nextEnabled);

	return {
		ok: true,
		record: {
			...source,
			enabled: nextEnabled
		}
	};
}

export function updateSource(
	id: string,
	updates: Partial<Pick<SourceRecord, 'category' | 'name' | 'url' | 'enabled'>>
): SourceMutationResult {
	const source = getAllSources().find((record) => record.id === id);
	if (!source) return { ok: false, error: 'not-found' };
	if (!source.isCustom) return { ok: false, error: 'built-in-protected' };

	const nextCategory = (updates.category ?? source.category) as NewsCategory;
	const nextName = (updates.name ?? source.name).trim();
	const nextUrl = (updates.url ?? source.url).trim();
	const nextEnabled = updates.enabled ?? source.enabled;

	if (!VALID_CATEGORIES.has(nextCategory) || !nextName || !nextUrl) {
		return { ok: false, error: 'required' };
	}
	if (!isValidHttpUrl(nextUrl)) return { ok: false, error: 'invalid-url' };

	const duplicate = getAllSources().some(
		(record) =>
			record.id !== id &&
			record.category === nextCategory &&
			normalizeValue(record.url) === normalizeValue(nextUrl)
	);
	if (duplicate) return { ok: false, error: 'duplicate' };

	let updated = false;
	try {
		updated = updateCustomSource(id, {
			category: nextCategory,
			name: nextName,
			url: nextUrl,
			enabled: nextEnabled
		});
	} catch {
		return { ok: false, error: 'duplicate' };
	}
	if (!updated) return { ok: false, error: 'not-found' };

	setSourceOverride(id, nextEnabled);

	return {
		ok: true,
		record: {
			id,
			category: nextCategory,
			name: nextName,
			url: nextUrl,
			enabled: nextEnabled,
			isCustom: true
		}
	};
}

export function removeSource(id: string): { ok: true } | { ok: false; error: SourceMutationError } {
	const source = getAllSources().find((record) => record.id === id);
	if (!source) return { ok: false, error: 'not-found' };
	if (!source.isCustom) return { ok: false, error: 'built-in-protected' };

	const deleted = deleteCustomSource(id);
	if (!deleted) return { ok: false, error: 'not-found' };
	deleteSourceOverride(id);
	return { ok: true };
}
