import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import type { NewsCategory } from '$lib/types';
import { FEEDS, type FeedSource } from '$lib/config/feeds';

const STORAGE_KEYS = {
	overrides: 'newsSourcesOverrides',
	custom: 'newsCustomSources'
} as const;

type SourceId = string;

export interface SourceRecord {
	id: SourceId;
	category: NewsCategory;
	name: string;
	url: string;
	enabled: boolean;
	isCustom: boolean;
}

interface SourcesState {
	records: SourceRecord[];
	initialized: boolean;
}

interface AddSourceInput {
	category: NewsCategory;
	name: string;
	url: string;
}

function normalizeValue(value: string): string {
	return value.trim().toLowerCase();
}

function buildSourceId(category: NewsCategory, name: string, url: string): SourceId {
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

function loadOverrides(): Record<string, boolean> {
	if (!browser) return {};
	try {
		const value = localStorage.getItem(STORAGE_KEYS.overrides);
		return value ? JSON.parse(value) : {};
	} catch {
		return {};
	}
}

function loadCustomSources(): SourceRecord[] {
	if (!browser) return [];
	try {
		const value = localStorage.getItem(STORAGE_KEYS.custom);
		const raw = value ? (JSON.parse(value) as SourceRecord[]) : [];
		return raw.filter(
			(item) =>
				item &&
				typeof item.id === 'string' &&
				typeof item.name === 'string' &&
				typeof item.url === 'string' &&
				typeof item.category === 'string'
		);
	} catch {
		return [];
	}
}

function saveOverrides(records: SourceRecord[]): void {
	if (!browser) return;
	const builtInState = records
		.filter((record) => !record.isCustom)
		.reduce<Record<string, boolean>>((acc, record) => {
			acc[record.id] = record.enabled;
			return acc;
		}, {});
	localStorage.setItem(STORAGE_KEYS.overrides, JSON.stringify(builtInState));
}

function saveCustomSources(records: SourceRecord[]): void {
	if (!browser) return;
	const custom = records.filter((record) => record.isCustom);
	localStorage.setItem(STORAGE_KEYS.custom, JSON.stringify(custom));
}

function createInitialState(): SourcesState {
	return {
		records: createBuiltInSources(),
		initialized: false
	};
}

function createSourcesStore() {
	const { subscribe, set, update } = writable<SourcesState>(createInitialState());

	return {
		subscribe,

		init() {
			update((state) => {
				if (state.initialized) return state;

				const overrides = loadOverrides();
				const customSources = loadCustomSources();
				const builtIn = createBuiltInSources().map((record) => ({
					...record,
					enabled: overrides[record.id] ?? true
				}));
				const records = [...builtIn, ...customSources].sort((a, b) => a.name.localeCompare(b.name));
				return { records, initialized: true };
			});
		},

		addSource(input: AddSourceInput): { ok: true } | { ok: false; error: 'required' | 'invalid-url' | 'duplicate' } {
			const name = input.name.trim();
			const url = input.url.trim();
			if (!name || !url) return { ok: false, error: 'required' };
			if (!isValidHttpUrl(url)) return { ok: false, error: 'invalid-url' };

			const candidateUrl = normalizeValue(url);
			const state = get({ subscribe });
			const duplicate = state.records.some(
				(record) => record.category === input.category && normalizeValue(record.url) === candidateUrl
			);
			if (duplicate) return { ok: false, error: 'duplicate' };

			update((current) => {
				const newRecord: SourceRecord = {
					id: buildSourceId(input.category, name, url),
					category: input.category,
					name,
					url,
					enabled: true,
					isCustom: true
				};
				const records = [...current.records, newRecord].sort((a, b) => a.name.localeCompare(b.name));
				saveCustomSources(records);
				return { ...current, records };
			});

			return { ok: true };
		},

		toggleSource(id: SourceId) {
			update((state) => {
				const records = state.records.map((record) =>
					record.id === id ? { ...record, enabled: !record.enabled } : record
				);
				saveOverrides(records);
				saveCustomSources(records);
				return { ...state, records };
			});
		},

		getEnabledByCategory(category: NewsCategory): FeedSource[] {
			const state = get({ subscribe });
			return state.records
				.filter((record) => record.category === category && record.enabled)
				.map((record) => ({ name: record.name, url: record.url }));
		},

		getByCategory(category: NewsCategory): SourceRecord[] {
			const state = get({ subscribe });
			return state.records.filter((record) => record.category === category);
		},

		reset() {
			if (browser) {
				localStorage.removeItem(STORAGE_KEYS.overrides);
				localStorage.removeItem(STORAGE_KEYS.custom);
			}
			set(createInitialState());
		}
	};
}

export const sources = createSourcesStore();

export function getEnabledSourcesForCategory(category: NewsCategory): FeedSource[] {
	const state = get(sources);
	if (!state.initialized) {
		return FEEDS[category] ?? [];
	}
	return state.records
		.filter((record) => record.category === category && record.enabled)
		.map((record) => ({ name: record.name, url: record.url }));
}
