import { get, writable } from 'svelte/store';
import type { NewsCategory, SourceMutationError, SourceRecord } from '$lib/types';
import { FEEDS, type FeedSource } from '$lib/config/feeds';

interface SourcesState {
	records: SourceRecord[];
	initialized: boolean;
}

interface AddSourceInput {
	category: NewsCategory;
	name: string;
	url: string;
}

interface UpdateSourceInput {
	id: string;
	category: NewsCategory;
	name: string;
	url: string;
	enabled: boolean;
}

type SourceMutationResult = { ok: true } | { ok: false; error: SourceMutationError };

function isMutationError(value: unknown): value is SourceMutationError {
	return (
		value === 'required' ||
		value === 'invalid-url' ||
		value === 'duplicate' ||
		value === 'not-found' ||
		value === 'built-in-protected'
	);
}

async function loadSourcesFromServer(): Promise<SourceRecord[]> {
	const res = await fetch('/api/sources');
	if (!res.ok) {
		throw new Error(`Failed to load sources (${res.status})`);
	}
	const data = (await res.json()) as { records?: SourceRecord[] };
	return Array.isArray(data.records) ? data.records : [];
}

function readMutationError(data: unknown): SourceMutationError {
	if (
		typeof data === 'object' &&
		data !== null &&
		'error' in data &&
		isMutationError((data as { error?: unknown }).error)
	) {
		return (data as { error: SourceMutationError }).error;
	}
	return 'required';
}

async function parseMutationResponse(res: Response): Promise<SourceMutationResult> {
	try {
		if (!res.ok) {
			const data = await res.json();
			return { ok: false, error: readMutationError(data) };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'required' };
	}
}

function createInitialState(): SourcesState {
	return {
		records: [],
		initialized: false
	};
}

function createSourcesStore() {
	const { subscribe, update } = writable<SourcesState>(createInitialState());

	return {
		subscribe,

		init() {
			void loadSourcesFromServer()
				.then((records) => {
					update((state) => ({
						...state,
						records: records.sort((a, b) => a.name.localeCompare(b.name)),
						initialized: true
					}));
				})
				.catch(() => {
					update((state) => ({
						...state,
						records: state.records.length > 0 ? state.records : [],
						initialized: true
					}));
				});
		},

		async addSource(input: AddSourceInput): Promise<SourceMutationResult> {
			const res = await fetch('/api/sources', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(input)
			});
			const result = await parseMutationResponse(res);
			if (!result.ok) return result;
			this.init();
			return { ok: true };
		},

		async toggleSource(id: string): Promise<SourceMutationResult> {
			const res = await fetch(`/api/sources/${encodeURIComponent(id)}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'toggle' })
			});
			const result = await parseMutationResponse(res);
			if (!result.ok) return result;
			this.init();
			return { ok: true };
		},

		async updateSource(input: UpdateSourceInput): Promise<SourceMutationResult> {
			const res = await fetch(`/api/sources/${encodeURIComponent(input.id)}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'update',
					category: input.category,
					name: input.name,
					url: input.url,
					enabled: input.enabled
				})
			});
			const result = await parseMutationResponse(res);
			if (!result.ok) return result;
			this.init();
			return { ok: true };
		},

		async deleteSource(id: string): Promise<SourceMutationResult> {
			const res = await fetch(`/api/sources/${encodeURIComponent(id)}`, { method: 'DELETE' });
			const result = await parseMutationResponse(res);
			if (!result.ok) return result;
			this.init();
			return { ok: true };
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
			this.init();
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
