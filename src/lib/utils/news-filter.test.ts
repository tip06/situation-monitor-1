import { describe, expect, it } from 'vitest';
import type { NewsItem } from '$lib/types';
import { deduplicateNews, filterNews, sortNewsNewestFirst } from './news-filter';

const base = Date.now() - 60 * 60 * 1000;

function news(overrides: Partial<NewsItem>): NewsItem {
	return {
		id: overrides.id ?? 'item',
		title: overrides.title ?? 'Headline',
		source: overrides.source ?? 'Wire',
		link: overrides.link ?? 'https://example.com',
		timestamp: overrides.timestamp ?? base,
		category: overrides.category ?? 'intel',
		...overrides
	};
}

describe('news filtering', () => {
	it('sorts Krypt3ia items without usable dates behind dated items', () => {
		const sorted = sortNewsNewestFirst([
			news({
				id: 'krypt3ia-fallback',
				title: 'Old Krypt3ia item',
				source: 'Krypt3ia',
				timestamp: base + 60_000
			}),
			news({
				id: 'dated-wire',
				title: 'Dated wire item',
				source: 'Wire',
				timestamp: base
			})
		]);

		expect(sorted.map((item) => item.id)).toEqual(['dated-wire', 'krypt3ia-fallback']);
	});

	it('uses a valid Krypt3ia pubDate when one exists', () => {
		const sorted = sortNewsNewestFirst([
			news({
				id: 'wire',
				title: 'Wire item',
				source: 'Wire',
				timestamp: base
			}),
			news({
				id: 'dated-krypt3ia',
				title: 'Dated Krypt3ia item',
				source: 'Krypt3ia',
				pubDate: new Date(base + 60_000).toISOString(),
				timestamp: base + 120_000
			})
		]);

		expect(sorted.map((item) => item.id)).toEqual(['dated-krypt3ia', 'wire']);
	});

	it('applies Krypt3ia ordering during dedupe and feed filtering', () => {
		const duplicateItems = [
			news({
				id: 'krypt3ia-fallback',
				title: 'Shared headline',
				source: 'Krypt3ia',
				timestamp: base + 60_000
			}),
			news({
				id: 'wire',
				title: 'Shared headline',
				source: 'Wire',
				timestamp: base
			})
		];

		expect(deduplicateNews(duplicateItems).map((item) => item.id)).toEqual(['wire']);

		const distinctItems = [
			news({
				id: 'krypt3ia-fallback',
				title: 'Old Krypt3ia item',
				source: 'Krypt3ia',
				timestamp: base + 60_000
			}),
			news({
				id: 'wire',
				title: 'Wire item',
				source: 'Wire',
				timestamp: base
			})
		];

		expect(
			filterNews(distinctItems, { maxItems: 2, maxAgeDays: 30 }).map((item) => item.id)
		).toEqual(['wire', 'krypt3ia-fallback']);
	});
});
