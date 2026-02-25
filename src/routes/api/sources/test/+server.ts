import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseHtmlPage, isHtmlContent } from '$lib/server/html-parser';

const TEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, {
			signal: controller.signal,
			headers: { Accept: 'application/rss+xml, application/xml, text/xml, text/html, */*' }
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

function tryParseRss(text: string): number {
	// Quick RSS/Atom item count without full parsing
	const itemPattern = /<item[\s>]/gi;
	const entryPattern = /<entry[\s>]/gi;
	const items = text.match(itemPattern);
	const entries = text.match(entryPattern);
	return Math.max(items?.length ?? 0, entries?.length ?? 0);
}

function extractDomain(url: string): string | null {
	try {
		return new URL(url).hostname;
	} catch {
		return null;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	let payload: { url?: string; sourceType?: 'rss' | 'html' };
	try {
		payload = await request.json();
	} catch {
		return json({ ok: false, error: 'Invalid request body' }, { status: 400 });
	}

	const url = payload.url?.trim();
	if (!url || !/^https?:\/\//i.test(url)) {
		return json({ ok: false, error: 'Valid URL required (http/https)' }, { status: 400 });
	}

	const sourceType = payload.sourceType;

	try {
		const response = await fetchWithTimeout(url, TEST_TIMEOUT_MS);

		if (!response.ok) {
			const domain = extractDomain(url);
			const suggestion =
				response.status === 403 || response.status === 451
					? 'google-news'
					: undefined;
			const googleNewsUrl = domain
				? `https://news.google.com/rss/search?q=site:${domain}&hl=en&gl=US&ceid=US:en`
				: undefined;

			return json({
				ok: false,
				error: `HTTP ${response.status} ${response.statusText}`,
				...(suggestion ? { suggestion, googleNewsUrl } : {})
			});
		}

		const text = await response.text();

		// If explicitly HTML, parse as HTML
		if (sourceType === 'html') {
			const items = parseHtmlPage(text, url, 'test', 'politics');
			return json({
				ok: items.length > 0,
				itemCount: items.length,
				detectedType: 'html' as const,
				sampleTitle: items[0]?.title,
				...(items.length === 0 ? { error: 'No items found in HTML page' } : {})
			});
		}

		// Try RSS first
		const rssCount = tryParseRss(text);
		if (rssCount > 0) {
			return json({
				ok: true,
				itemCount: rssCount,
				detectedType: 'rss' as const
			});
		}

		// Auto-detect: try HTML if content looks like HTML
		if (isHtmlContent(text)) {
			const items = parseHtmlPage(text, url, 'test', 'politics');
			if (items.length > 0) {
				return json({
					ok: true,
					itemCount: items.length,
					detectedType: 'html' as const,
					sampleTitle: items[0]?.title
				});
			}
		}

		// Nothing worked
		const domain = extractDomain(url);
		const googleNewsUrl = domain
			? `https://news.google.com/rss/search?q=site:${domain}&hl=en&gl=US&ceid=US:en`
			: undefined;

		return json({
			ok: false,
			error: 'No RSS or HTML items detected',
			suggestion: 'google-news',
			googleNewsUrl
		});
	} catch (err) {
		const message =
			err instanceof Error && err.name === 'AbortError'
				? 'Request timed out'
				: err instanceof Error
					? err.message
					: 'Unknown error';

		const domain = extractDomain(url);
		const googleNewsUrl = domain
			? `https://news.google.com/rss/search?q=site:${domain}&hl=en&gl=US&ceid=US:en`
			: undefined;

		return json({
			ok: false,
			error: message,
			suggestion: 'google-news',
			googleNewsUrl
		});
	}
};
