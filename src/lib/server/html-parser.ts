/**
 * HTML-to-RSS parser module
 * Extracts news items from HTML pages using a cascade of strategies:
 * 1. Per-source CSS selectors
 * 2. JSON-LD structured data
 * 3. Semantic <article> tags
 * 4. Common CSS class patterns
 * 5. Open Graph meta fallback (single item)
 */

import * as cheerio from 'cheerio';
import type { NewsItem, NewsCategory } from '$lib/types';
import type { HtmlSelectors } from '$lib/config/feeds';
import { containsAlertKeyword, detectRegion, detectTopics } from '$lib/config/keywords';
import { classifyRegionalItem } from '$lib/utils/regional-filter';
import { hashCode } from '$lib/shared/news-parser';

/**
 * Check if a text response looks like HTML rather than RSS/Atom XML
 */
export function isHtmlContent(text: string): boolean {
	const trimmed = text.trimStart().slice(0, 500).toLowerCase();
	const hasHtmlMarkers = trimmed.includes('<!doctype html') || trimmed.includes('<html');
	const hasRssMarkers =
		trimmed.includes('<rss') ||
		trimmed.includes('<feed') ||
		trimmed.includes('<rdf:rdf') ||
		trimmed.includes('<?xml');
	return hasHtmlMarkers && !hasRssMarkers;
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function resolveUrl(href: string | undefined, baseUrl: string): string | null {
	if (!href) return null;
	try {
		return new URL(href, baseUrl).href;
	} catch {
		return null;
	}
}

function makeId(category: NewsCategory, sourceName: string, link: string): string {
	const normalizedSource = sourceName.toLowerCase().replace(/\s+/g, '-');
	return `html-${category}-${normalizedSource}-${hashCode(link)}`;
}

interface RawArticle {
	title: string;
	link: string;
	date?: string;
	description?: string;
}

function enrichAndFilter(
	articles: RawArticle[],
	sourceName: string,
	category: NewsCategory
): NewsItem[] {
	const items: NewsItem[] = [];
	const seen = new Set<string>();

	for (const article of articles) {
		if (!article.title || !article.link) continue;
		if (seen.has(article.link)) continue;
		seen.add(article.link);

		const title = stripHtml(article.title);
		if (!title) continue;

		const timestamp = article.date ? new Date(article.date).getTime() : Date.now();
		const cleanDesc = article.description ? stripHtml(article.description).slice(0, 200) : undefined;
		const detectText = `${title} ${cleanDesc ?? ''}`;

		const regionalDecision = classifyRegionalItem({ title, description: cleanDesc, category });
		if (!regionalDecision.accepted) continue;

		const alert = containsAlertKeyword(title);

		items.push({
			id: makeId(category, sourceName, article.link),
			title,
			link: article.link,
			pubDate: article.date ?? undefined,
			timestamp: isNaN(timestamp) ? Date.now() : timestamp,
			description: cleanDesc,
			source: sourceName,
			category,
			isAlert: !!alert,
			alertKeyword: alert?.keyword || undefined,
			region: detectRegion(detectText) ?? undefined,
			topics: detectTopics(detectText)
		});
	}

	return items;
}

// --- Strategy 1: Per-source CSS selectors ---

function extractWithSelectors(
	$: cheerio.CheerioAPI,
	baseUrl: string,
	selectors: HtmlSelectors
): RawArticle[] {
	const articles: RawArticle[] = [];
	const containerSelector = selectors.article || 'article';

	$(containerSelector).each((_, el) => {
		const $el = $(el);

		// Title
		const titleSelector = selectors.title || 'h1, h2, h3';
		const $titleEl = $el.find(titleSelector).first();
		const title = $titleEl.text().trim();

		// Link
		const linkSelector = selectors.link || 'a[href]';
		const $linkEl = selectors.link ? $el.find(linkSelector).first() : $titleEl.closest('a').length ? $titleEl.closest('a') : $el.find('a[href]').first();
		const link = resolveUrl($linkEl.attr('href'), baseUrl);

		// Date
		const dateSelector = selectors.date || 'time';
		const $dateEl = $el.find(dateSelector).first();
		const date = $dateEl.attr('datetime') || $dateEl.text().trim() || undefined;

		// Description
		const descSelector = selectors.description || 'p';
		const description = $el.find(descSelector).first().text().trim() || undefined;

		if (title && link) {
			articles.push({ title, link, date, description });
		}
	});

	return articles;
}

// --- Strategy 2: JSON-LD structured data ---

function extractFromJsonLd($: cheerio.CheerioAPI, baseUrl: string): RawArticle[] {
	const articles: RawArticle[] = [];

	$('script[type="application/ld+json"]').each((_, el) => {
		try {
			const raw = $(el).html();
			if (!raw) return;
			const data = JSON.parse(raw);

			const items: unknown[] = [];
			if (Array.isArray(data)) {
				items.push(...data);
			} else if (data?.['@graph'] && Array.isArray(data['@graph'])) {
				items.push(...data['@graph']);
			} else {
				items.push(data);
			}

			for (const item of items) {
				if (!item || typeof item !== 'object') continue;
				const obj = item as Record<string, unknown>;
				const type = String(obj['@type'] || '');
				if (!['NewsArticle', 'Article', 'BlogPosting', 'ReportageNewsArticle'].includes(type)) continue;

				const title = String(obj.headline || obj.name || '').trim();
				const link = resolveUrl(String(obj.url || ''), baseUrl);
				const date = String(obj.datePublished || obj.dateCreated || '').trim() || undefined;
				const description = String(obj.description || '').trim() || undefined;

				if (title && link) {
					articles.push({ title, link, date, description });
				}
			}
		} catch {
			// Invalid JSON-LD, skip
		}
	});

	return articles;
}

// --- Strategy 3: Semantic <article> tags ---

function extractFromArticleTags($: cheerio.CheerioAPI, baseUrl: string): RawArticle[] {
	const articles: RawArticle[] = [];

	$('article').each((_, el) => {
		const $el = $(el);

		const $heading = $el.find('h1, h2, h3').first();
		const title = $heading.text().trim();

		const $link = $heading.find('a[href]').first().length
			? $heading.find('a[href]').first()
			: $heading.closest('a[href]').length
				? $heading.closest('a[href]')
				: $el.find('a[href]').first();
		const link = resolveUrl($link.attr('href'), baseUrl);

		const $time = $el.find('time').first();
		const date = $time.attr('datetime') || $time.text().trim() || undefined;

		const description = $el.find('p').first().text().trim() || undefined;

		if (title && link) {
			articles.push({ title, link, date, description });
		}
	});

	return articles;
}

// --- Strategy 4: Common CSS class patterns ---

const COMMON_CONTAINER_SELECTORS = [
	'.feed-post', '.post', '.entry', '.story', '.news-item', '.card',
	'.article-item', '.post-item', '.feed-item', '.list-item',
	'[class*="article"]', '[class*="story"]'
];

function extractFromCommonPatterns($: cheerio.CheerioAPI, baseUrl: string): RawArticle[] {
	const articles: RawArticle[] = [];

	for (const selector of COMMON_CONTAINER_SELECTORS) {
		const $containers = $(selector);
		if ($containers.length < 2) continue; // Need at least 2 to look like a list

		$containers.each((_, el) => {
			const $el = $(el);

			const $heading = $el.find('h1, h2, h3, h4').first();
			const title = $heading.text().trim() || $el.find('a').first().text().trim();

			// Look for link in heading first, then in heading descendants, then anywhere in container
			let $link = $heading.closest('a[href]');
			if (!$link.length) $link = $heading.find('a[href]').first();
			if (!$link.length) $link = $el.find('a[href]').first();
			const link = resolveUrl($link.attr('href'), baseUrl);

			// Try <time> element, then datetime attribute, then common date class patterns
			const $time = $el.find('time, [datetime], [class*="datetime"], [class*="date"]').first();
			const date = $time.attr('datetime') || $time.text().trim() || undefined;

			const description = $el.find('p, [class*="resumo"], [class*="summary"], [class*="excerpt"]').first().text().trim() || undefined;

			if (title && link) {
				articles.push({ title, link, date, description });
			}
		});

		if (articles.length > 0) break; // Use the first strategy that yields results
	}

	return articles;
}

// --- Strategy 5: Open Graph meta fallback (single item) ---

function extractFromOpenGraph($: cheerio.CheerioAPI): RawArticle[] {
	const title =
		$('meta[property="og:title"]').attr('content') ||
		$('title').text().trim();
	const link =
		$('meta[property="og:url"]').attr('content') ||
		$('link[rel="canonical"]').attr('href');
	const description = $('meta[property="og:description"]').attr('content');
	const date =
		$('meta[property="article:published_time"]').attr('content') ||
		$('meta[name="publication_date"]').attr('content');

	if (title && link) {
		return [{ title, link, date: date || undefined, description: description || undefined }];
	}
	return [];
}

// --- Main parser ---

/**
 * Parse an HTML page and extract news items using a cascade of strategies
 */
export function parseHtmlPage(
	html: string,
	sourceUrl: string,
	sourceName: string,
	category: NewsCategory,
	selectors?: HtmlSelectors
): NewsItem[] {
	const $ = cheerio.load(html);

	let articles: RawArticle[] = [];

	// Strategy 1: Per-source CSS selectors
	if (selectors) {
		articles = extractWithSelectors($, sourceUrl, selectors);
		if (articles.length > 0) {
			return enrichAndFilter(articles, sourceName, category);
		}
	}

	// Strategy 2: JSON-LD structured data
	articles = extractFromJsonLd($, sourceUrl);
	if (articles.length > 0) {
		return enrichAndFilter(articles, sourceName, category);
	}

	// Strategy 3: Semantic <article> tags
	articles = extractFromArticleTags($, sourceUrl);
	if (articles.length > 0) {
		return enrichAndFilter(articles, sourceName, category);
	}

	// Strategy 4: Common CSS class patterns
	articles = extractFromCommonPatterns($, sourceUrl);
	if (articles.length > 0) {
		return enrichAndFilter(articles, sourceName, category);
	}

	// Strategy 5: Open Graph meta fallback
	articles = extractFromOpenGraph($);
	return enrichAndFilter(articles, sourceName, category);
}
