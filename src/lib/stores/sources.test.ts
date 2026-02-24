import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import type { SourceRecord } from '$lib/types';

vi.mock('$app/environment', () => ({
	browser: true
}));

function createJsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

describe('Sources Store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('should initialize from server records', async () => {
		const records: SourceRecord[] = [
			{
				id: 'latam::test::https://example.com/feed.xml',
				category: 'latam',
				name: 'Test Feed',
				url: 'https://example.com/feed.xml',
				enabled: true,
				isCustom: true
			}
		];
		globalThis.fetch = vi.fn(async () => createJsonResponse(200, { records })) as typeof fetch;

		const { sources } = await import('./sources');
		sources.init();
		await new Promise((resolve) => setTimeout(resolve, 0));

		const state = get(sources);
		expect(state.initialized).toBe(true);
		expect(state.records).toHaveLength(1);
		expect(state.records[0].name).toBe('Test Feed');
	});

	it('should map server validation error on add', async () => {
		globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			if (typeof input === 'string' && input === '/api/sources' && init?.method === 'POST') {
				return createJsonResponse(400, { error: 'duplicate' });
			}
			return createJsonResponse(200, { records: [] });
		}) as typeof fetch;

		const { sources } = await import('./sources');
		const result = await sources.addSource({
			category: 'brazil',
			name: 'A',
			url: 'https://example.com/rss.xml'
		});

		expect(result).toEqual({ ok: false, error: 'duplicate' });
	});

	it('should call toggle endpoint and return success', async () => {
		globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			if (typeof input === 'string' && input.startsWith('/api/sources/') && init?.method === 'PATCH') {
				return createJsonResponse(200, { record: { id: 'x' } });
			}
			return createJsonResponse(200, { records: [] });
		}) as typeof fetch;

		const { sources } = await import('./sources');
		const result = await sources.toggleSource('source-id');
		expect(result).toEqual({ ok: true });
	});
});
