import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { FEEDS } from '$lib/config/feeds';

vi.mock('$app/environment', () => ({
	browser: true
}));

const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

describe('Sources Store', () => {
	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('should initialize with built-in sources', async () => {
		const { sources } = await import('./sources');
		sources.init();
		const state = get(sources);

		expect(state.initialized).toBe(true);
		expect(state.records.length).toBeGreaterThan(0);
	});

	it('should add a valid custom source', async () => {
		const { sources } = await import('./sources');
		sources.init();

		const result = sources.addSource({
			category: 'latam',
			name: 'Test Feed',
			url: 'https://example.com/feed.xml'
		});

		expect(result).toEqual({ ok: true });
		const state = get(sources);
		expect(
			state.records.some((record) => record.name === 'Test Feed' && record.category === 'latam')
		).toBe(true);
	});

	it('should reject invalid and duplicate sources', async () => {
		const { sources } = await import('./sources');
		sources.init();

		const invalid = sources.addSource({
			category: 'brazil',
			name: 'Bad',
			url: 'not-an-url'
		});
		expect(invalid).toEqual({ ok: false, error: 'invalid-url' });

		const existing = FEEDS.brazil[0];
		const duplicate = sources.addSource({
			category: 'brazil',
			name: existing.name,
			url: existing.url
		});
		expect(duplicate).toEqual({ ok: false, error: 'duplicate' });
	});

	it('should apply source toggles when resolving enabled sources', async () => {
		const { sources, getEnabledSourcesForCategory } = await import('./sources');
		sources.init();

		const initial = getEnabledSourcesForCategory('latam');
		expect(initial.length).toBeGreaterThan(0);

		const state = get(sources);
		const target = state.records.find((record) => record.category === 'latam');
		expect(target).toBeDefined();
		sources.toggleSource(target!.id);

		const afterToggle = getEnabledSourcesForCategory('latam');
		expect(afterToggle.length).toBe(initial.length - 1);
	});
});
