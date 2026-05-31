import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NewsItem } from '$lib/types';
import { filterByAge, limitNewsByCategorySources, parseNewsTimestamp } from './news-parser';

function makeItem(
	id: string,
	source: string,
	timestamp: number,
	category: NewsItem['category'] = 'tech'
): NewsItem {
	return {
		id,
		title: id,
		link: `https://example.com/${id}`,
		source,
		category,
		timestamp
	};
}

describe('news timestamp handling', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('rejects missing, malformed, and implausibly future publication dates', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-31T12:00:00Z'));

		expect(parseNewsTimestamp(undefined)).toBeNull();
		expect(parseNewsTimestamp('not-a-date')).toBeNull();
		expect(parseNewsTimestamp('2026-05-31T12:10:00Z')).toBeNull();
		expect(parseNewsTimestamp('2026-05-31T11:55:00Z')).toBe(
			new Date('2026-05-31T11:55:00Z').getTime()
		);
	});

	it('filters invalid and future timestamps out of cached results', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-31T12:00:00Z'));
		const now = Date.now();

		expect(
			filterByAge(
				[
					makeItem('valid', 'TechCrunch', now - 60_000),
					makeItem('invalid', 'TechCrunch', Number.NaN),
					makeItem('future', 'TechCrunch', now + 10 * 60_000)
				],
				7
			).map((item) => item.id)
		).toEqual(['valid']);
	});

	it('filters legacy broad-query War Zone rows while retaining direct TWZ articles', () => {
		const now = Date.now();
		const legacyRow = makeItem('legacy-drive-row', 'The War Zone', now - 60_000, 'intel');
		legacyRow.link = 'https://news.google.com/rss/articles/legacy-drive-row';
		const directRow = makeItem('direct-twz-row', 'The War Zone', now - 60_000, 'intel');
		directRow.link = 'https://www.twz.com/news-features/direct-twz-row';

		expect(filterByAge([legacyRow, directRow], 7).map((item) => item.id)).toEqual([
			'direct-twz-row'
		]);
	});
});

describe('category source limits', () => {
	it('caps ArXiv AI while retaining other tech sources', () => {
		const arxivItems = Array.from({ length: 25 }, (_, index) =>
			makeItem(`arxiv-${index}`, 'ArXiv AI', 1000 - index)
		);
		const techCrunchItem = makeItem('techcrunch', 'TechCrunch', 500);

		const limited = limitNewsByCategorySources([...arxivItems, techCrunchItem], 'tech');

		expect(limited.filter((item) => item.source === 'ArXiv AI')).toHaveLength(20);
		expect(limited).toContainEqual(techCrunchItem);
	});

	it('caps RealClearDefense while retaining other intel sources', () => {
		const realClearItems = Array.from({ length: 15 }, (_, index) =>
			makeItem(`real-clear-${index}`, 'RealClearDefense', 1000 - index, 'intel')
		);
		const defenseNewsItem = makeItem('defense-news', 'Defense News', 500, 'intel');

		const limited = limitNewsByCategorySources([...realClearItems, defenseNewsItem], 'intel');

		expect(limited.filter((item) => item.source === 'RealClearDefense')).toHaveLength(10);
		expect(limited).toContainEqual(defenseNewsItem);
	});
});
