import { describe, it, expect, vi } from 'vitest';

// Mock dependencies that rely on config/regex patterns
vi.mock('$lib/config/keywords', () => ({
	containsAlertKeyword: (text: string) => {
		if (text.toLowerCase().includes('breaking')) return { isAlert: true, keyword: 'breaking' };
		return null;
	},
	detectRegion: () => null,
	detectTopics: () => []
}));

vi.mock('$lib/utils/regional-filter', () => ({
	classifyRegionalItem: () => ({ accepted: true })
}));

vi.mock('$lib/shared/news-parser', () => ({
	hashCode: (str: string) => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return Math.abs(hash).toString(36);
	}
}));

import { parseHtmlPage, isHtmlContent } from './html-parser';

describe('isHtmlContent', () => {
	it('returns true for HTML doctype', () => {
		expect(isHtmlContent('<!DOCTYPE html><html><body></body></html>')).toBe(true);
	});

	it('returns true for <html> tag', () => {
		expect(isHtmlContent('<html lang="en"><head></head><body></body></html>')).toBe(true);
	});

	it('returns false for RSS feed', () => {
		expect(isHtmlContent('<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>')).toBe(false);
	});

	it('returns false for Atom feed', () => {
		expect(isHtmlContent('<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(isHtmlContent('')).toBe(false);
	});
});

describe('parseHtmlPage', () => {
	const baseUrl = 'https://example.com/news';
	const sourceName = 'Test Source';
	const category = 'politics' as const;

	describe('Strategy 1: CSS selectors', () => {
		it('extracts articles using custom selectors', () => {
			const html = `
				<html><body>
					<div class="news-list">
						<div class="item">
							<h3><a href="/article/1">First Article</a></h3>
							<time datetime="2026-01-15">Jan 15</time>
							<p class="summary">Summary of first article</p>
						</div>
						<div class="item">
							<h3><a href="/article/2">Second Article</a></h3>
							<time datetime="2026-01-16">Jan 16</time>
							<p class="summary">Summary of second article</p>
						</div>
					</div>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category, {
				article: '.item',
				title: 'h3',
				link: 'h3 a',
				date: 'time',
				description: '.summary'
			});

			expect(items).toHaveLength(2);
			expect(items[0].title).toBe('First Article');
			expect(items[0].link).toBe('https://example.com/article/1');
			expect(items[0].description).toBe('Summary of first article');
			expect(items[0].source).toBe('Test Source');
			expect(items[0].category).toBe('politics');
			expect(items[0].id).toMatch(/^html-politics-test-source-/);
		});
	});

	describe('Strategy 2: JSON-LD', () => {
		it('extracts articles from JSON-LD structured data', () => {
			const html = `
				<html><head>
					<script type="application/ld+json">
					[
						{
							"@type": "NewsArticle",
							"headline": "JSON-LD Article One",
							"url": "https://example.com/jsonld/1",
							"datePublished": "2026-02-01",
							"description": "Description from JSON-LD"
						},
						{
							"@type": "Article",
							"headline": "JSON-LD Article Two",
							"url": "https://example.com/jsonld/2",
							"datePublished": "2026-02-02"
						}
					]
					</script>
				</head><body></body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(2);
			expect(items[0].title).toBe('JSON-LD Article One');
			expect(items[0].link).toBe('https://example.com/jsonld/1');
			expect(items[0].description).toBe('Description from JSON-LD');
		});

		it('extracts articles from @graph array', () => {
			const html = `
				<html><head>
					<script type="application/ld+json">
					{
						"@graph": [
							{
								"@type": "BlogPosting",
								"headline": "Blog Post",
								"url": "https://example.com/blog/1",
								"datePublished": "2026-02-10"
							}
						]
					}
					</script>
				</head><body></body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
			expect(items[0].title).toBe('Blog Post');
		});
	});

	describe('Strategy 3: Semantic <article> tags', () => {
		it('extracts articles from semantic article elements', () => {
			const html = `
				<html><body>
					<article>
						<h2><a href="/post/1">Article Tag Post</a></h2>
						<time datetime="2026-01-20">Jan 20</time>
						<p>First paragraph as description</p>
					</article>
					<article>
						<h2><a href="/post/2">Second Article Tag Post</a></h2>
						<time datetime="2026-01-21">Jan 21</time>
						<p>Another description</p>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(2);
			expect(items[0].title).toBe('Article Tag Post');
			expect(items[0].link).toBe('https://example.com/post/1');
			expect(items[0].pubDate).toBe('2026-01-20');
		});
	});

	describe('Strategy 4: Common CSS patterns', () => {
		it('extracts from .post containers', () => {
			const html = `
				<html><body>
					<div class="post">
						<h3><a href="/p/1">Post One</a></h3>
						<p>Post one content</p>
					</div>
					<div class="post">
						<h3><a href="/p/2">Post Two</a></h3>
						<p>Post two content</p>
					</div>
					<div class="post">
						<h3><a href="/p/3">Post Three</a></h3>
						<p>Post three content</p>
					</div>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(3);
			expect(items[0].title).toBe('Post One');
		});
	});

	describe('Strategy 5: Open Graph fallback', () => {
		it('extracts single item from OG meta tags', () => {
			const html = `
				<html><head>
					<meta property="og:title" content="OG Title" />
					<meta property="og:url" content="https://example.com/og-article" />
					<meta property="og:description" content="OG Description" />
					<meta property="article:published_time" content="2026-02-15T10:00:00Z" />
				</head><body><p>Page content</p></body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
			expect(items[0].title).toBe('OG Title');
			expect(items[0].link).toBe('https://example.com/og-article');
			expect(items[0].description).toBe('OG Description');
		});
	});

	describe('URL resolution', () => {
		it('resolves relative URLs against base URL', () => {
			const html = `
				<html><body>
					<article>
						<h2><a href="/relative/path">Relative Link</a></h2>
						<p>Description</p>
					</article>
					<article>
						<h2><a href="sibling-path">Sibling Link</a></h2>
						<p>Description</p>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, 'https://example.com/section/', sourceName, category);
			expect(items[0].link).toBe('https://example.com/relative/path');
			expect(items[1].link).toBe('https://example.com/section/sibling-path');
		});
	});

	describe('enrichment', () => {
		it('sets isAlert when title contains alert keyword', () => {
			const html = `
				<html><body>
					<article>
						<h2><a href="/alert">BREAKING: Major Event</a></h2>
						<p>Details</p>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
			expect(items[0].isAlert).toBe(true);
			expect(items[0].alertKeyword).toBe('breaking');
		});
	});

	describe('deduplication', () => {
		it('removes duplicate links', () => {
			const html = `
				<html><body>
					<article>
						<h2><a href="/same-link">First Title</a></h2>
					</article>
					<article>
						<h2><a href="/same-link">Duplicate Title</a></h2>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
		});
	});

	describe('cascade priority', () => {
		it('prefers JSON-LD over article tags when both present', () => {
			const html = `
				<html><head>
					<script type="application/ld+json">
					[{"@type": "NewsArticle", "headline": "From JSON-LD", "url": "https://example.com/jsonld"}]
					</script>
				</head><body>
					<article>
						<h2><a href="/article-tag">From Article Tag</a></h2>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
			expect(items[0].title).toBe('From JSON-LD');
		});

		it('falls through to article tags when JSON-LD is empty', () => {
			const html = `
				<html><head>
					<script type="application/ld+json">
					{"@type": "Organization", "name": "Example"}
					</script>
				</head><body>
					<article>
						<h2><a href="/article-tag">From Article Tag</a></h2>
						<p>Some content</p>
					</article>
				</body></html>
			`;

			const items = parseHtmlPage(html, baseUrl, sourceName, category);
			expect(items).toHaveLength(1);
			expect(items[0].title).toBe('From Article Tag');
		});
	});
});
