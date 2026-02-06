/**
 * Cloudflare Worker CORS Proxy
 *
 * Deploy to Cloudflare Workers:
 * 1. Go to https://dash.cloudflare.com/ -> Workers & Pages
 * 2. Create a new Worker or edit existing 'situation-monitor-proxy'
 * 3. Paste this code and deploy
 *
 * Usage: https://your-worker.workers.dev/?url=<encoded-url>
 */

const ALLOWED_DOMAINS = [
	// RSS/News feeds
	'api.rss2json.com',
	'api.gdeltproject.org',
	'feeds.bbci.co.uk',
	'feeds.npr.org',
	'rss.nytimes.com',
	'rss.cnn.com',
	'www.theguardian.com',
	'news.google.com',
	'news.ycombinator.com',
	'hnrss.org',
	'feeds.arstechnica.com',
	'www.theverge.com',
	'www.technologyreview.com',
	'feeds.feedburner.com',
	'arxiv.org',
	'rss.arxiv.org',

	// Finance
	'api.coingecko.com',
	'www.cnbc.com',
	'feeds.marketwatch.com',
	'finance.yahoo.com',
	'www.ft.com',
	'fred.stlouisfed.org',

	// Government
	'www.whitehouse.gov',
	'www.federalreserve.gov',
	'www.sec.gov',
	'www.defense.gov',
	'www.cisa.gov',

	// Think tanks & analysis
	'www.csis.org',
	'www.brookings.edu',
	'www.cfr.org',
	'www.defenseone.com',
	'warontherocks.com',
	'breakingdefense.com',
	'www.thedrive.com',
	'thediplomat.com',
	'www.al-monitor.com',
	'www.bellingcat.com',
	'krebsonsecurity.com',

	// AI/Tech
	'openai.com',
	'venturebeat.com',
	'blog.google',
	'news.mit.edu',
	'huggingface.co',
	'deepmind.google',

	// Other data sources
	'earthquake.usgs.gov',

	// Prediction markets
	'gamma-api.polymarket.com',
];

function isAllowedDomain(url) {
	try {
		const parsed = new URL(url);
		return ALLOWED_DOMAINS.some(domain =>
			parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
		);
	} catch {
		return false;
	}
}

export default {
	async fetch(request) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Max-Age': '86400',
				},
			});
		}

		const url = new URL(request.url);
		const targetUrl = url.searchParams.get('url');

		if (!targetUrl) {
			return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}

		// Decode the URL
		let decodedUrl;
		try {
			decodedUrl = decodeURIComponent(targetUrl);
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid URL encoding' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}

		// Check if domain is allowed
		if (!isAllowedDomain(decodedUrl)) {
			return new Response(JSON.stringify({
				error: 'Domain not allowed',
				allowed: ALLOWED_DOMAINS
			}), {
				status: 403,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}

		// Fetch the target URL
		try {
			const response = await fetch(decodedUrl, {
				method: request.method,
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; SituationMonitor/1.0)',
				},
			});

			// Clone response and add CORS headers
			const newHeaders = new Headers(response.headers);
			newHeaders.set('Access-Control-Allow-Origin', '*');
			newHeaders.set('Access-Control-Expose-Headers', '*');

			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: 'Fetch failed', message: error.message }), {
				status: 502,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}
	},
};
