/**
 * Cloudflare Worker
 * - CORS proxy mode: /?url=<encoded-url>
 * - News aggregator mode:
 *   - POST /news/snapshot { categories: string[], sinceByCategory?: Record<string, number> }
 *   - POST /news/refresh { categories?: string[] }
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

	// Politics
	'feeds.washingtonpost.com',
	'www.foreignaffairs.com',
	'rss.politico.com',
	'foreignpolicy.com',
	'www.economist.com',
	'www.aljazeera.com',

	// Finance
	'api.coingecko.com',
	'www.cnbc.com',
	'feeds.marketwatch.com',
	'finance.yahoo.com',
	'www.ft.com',
	'fred.stlouisfed.org',
	'www.reuters.com',
	'feeds.bloomberg.com',
	'feeds.wsj.com',
	'www.investing.com',

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

	// Intel/Defense
	'www.defensenews.com',
	'www.realcleardefense.com',
	'www.chathamhouse.org',
	'www.iiss.org',
	'www.military.com',

	// AI/Tech
	'openai.com',
	'venturebeat.com',
	'blog.google',
	'news.mit.edu',
	'huggingface.co',
	'deepmind.google',

	// Brazil
	'g1.globo.com',
	'valor.globo.com',
	'feeds.folha.uol.com.br',
	'www.gazetadopovo.com.br',
	'www.cnnbrasil.com.br',
	'www.poder360.com.br',
	'agenciabrasil.ebc.com.br',
	'www.infomoney.com.br',
	'www.defesanet.com.br',
	'www.zona-militar.com',

	// LATAM
	'www.americasquarterly.org',
	'feeds.elpais.com',
	'www.infobae.com',

	// Iran
	'www.tehrantimes.com',
	'en.radiofarda.com',
	'en.mehrnews.com',
	'en.isna.ir',
	'ifpnews.com',
	'iranwire.com',

	// Venezuela
	'www.caracaschronicles.com',
	'www.elnacional.com',
	'venezuelanalysis.com',
	'www.vozdeamerica.com',

	// Greenland/Arctic
	'www.arctictoday.com',
	'en.highnorthnews.com',
	'www.thearcticinstitute.org',
	'arctic-council.org',
	'www.rcinet.ca',

	// Fringe
	'dailycaller.com',
	'www.theepochtimes.com',

	// Other data sources
	'earthquake.usgs.gov',

	// Prediction markets
	'gamma-api.polymarket.com'
];

const NEWS_FEEDS = {
	politics: [
		'https://feeds.bbci.co.uk/news/world/rss.xml',
		'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
		'https://feeds.washingtonpost.com/rss/politics',
		'https://www.theguardian.com/world/rss',
		'https://feeds.npr.org/1001/rss.xml',
		'https://www.foreignaffairs.com/rss.xml',
		'https://rss.politico.com/politics-news.xml',
		'https://foreignpolicy.com/feed/',
		'https://www.economist.com/the-world-this-week/rss.xml',
		'https://www.aljazeera.com/xml/rss/all.xml',
		'https://feeds.wsj.com/xml/rss/3_7455.xml'
	],
	tech: [
		'https://hnrss.org/frontpage',
		'https://feeds.arstechnica.com/arstechnica/technology-lab',
		'https://www.theverge.com/rss/index.xml',
		'https://www.technologyreview.com/feed/',
		'https://rss.arxiv.org/rss/cs.AI',
		'https://openai.com/news/rss.xml',
		'https://techcrunch.com/feed/',
		'https://www.wired.com/feed/rss',
		'https://www.engadget.com/rss.xml',
		'https://gizmodo.com/rss',
		'https://feeds.feedburner.com/canaltechbr',
		'https://feeds.wsj.com/xml/rss/3_7014.xml'
	],
	finance: [
		'https://www.reuters.com/business/rss',
		'https://feeds.bloomberg.com/markets/news.rss',
		'https://www.cnbc.com/id/100003114/device/rss/rss.html',
		'https://feeds.marketwatch.com/marketwatch/topstories',
		'https://www.ft.com/rss/home',
		'https://feeds.wsj.com/xml/rss/3_7085.xml',
		'https://www.economist.com/finance-and-economics/rss.xml',
		'https://feeds.bbci.co.uk/news/business/rss.xml',
		'https://finance.yahoo.com/news/rssindex',
		'https://www.investing.com/rss/news.rss'
	],
	gov: [
		'https://www.whitehouse.gov/news/feed/',
		'https://www.federalreserve.gov/feeds/press_all.xml',
		'https://www.sec.gov/news/pressreleases.rss',
		'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=945'
	],
	ai: ['https://openai.com/news/rss.xml', 'https://rss.arxiv.org/rss/cs.AI'],
	intel: [
		'https://www.defenseone.com/rss/all/',
		'https://breakingdefense.com/feed/',
		'https://warontherocks.com/feed/',
		'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml',
		'https://www.thedrive.com/the-war-zone/feed',
		'https://www.realcleardefense.com/index.xml',
		'https://www.csis.org/analysis/feed',
		'https://www.bellingcat.com/feed/',
		'https://www.chathamhouse.org/rss/all',
		'https://www.iiss.org/rss',
		'https://www.military.com/rss-feeds/content?feed=news-headlines.xml'
	],
	brazil: [
		'https://g1.globo.com/rss/g1/',
		'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml',
		'https://www.reuters.com/world/americas/rss',
		'https://feeds.feedburner.com/canaltechbr',
		'https://g1.globo.com/rss/g1/politica/',
		'https://www.gazetadopovo.com.br/feed/rss/republica.xml',
		'https://www.cnnbrasil.com.br/politica/feed/',
		'https://www.poder360.com.br/feed/',
		'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',
		'https://g1.globo.com/rss/g1/economia/',
		'https://www.infomoney.com.br/feed/',
		'https://www.gazetadopovo.com.br/feed/rss/economia.xml',
		'https://valor.globo.com/feed/',
		'https://www.defesanet.com.br/feed/',
		'https://www.zona-militar.com/feed/',
		'https://breakingdefense.com/tag/latin-america/feed/'
	],
	latam: [
		'https://www.reuters.com/world/americas/rss',
		'https://www.americasquarterly.org/feed/',
		'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada',
		'https://www.infobae.com/america/rss/'
	],
	iran: [
		'https://www.tehrantimes.com/rss',
		'https://www.al-monitor.com/rss',
		'https://en.radiofarda.com/api/zp_qmtl-vomx-tpe_bimr',
		'https://en.mehrnews.com/rss',
		'https://en.isna.ir/rss',
		'https://ifpnews.com/feed',
		'https://iranwire.com/en/feed'
	],
	venezuela: [
		'https://www.caracaschronicles.com/feed',
		'https://www.elnacional.com/feed',
		'https://venezuelanalysis.com/feed',
		'https://www.vozdeamerica.com/api/zt-pemyvi',
		'https://www.reuters.com/world/americas/rss'
	],
	greenland: [
		'https://www.arctictoday.com/feed',
		'https://en.highnorthnews.com/feed',
		'https://www.thearcticinstitute.org/feed',
		'https://arctic-council.org/feed',
		'https://www.rcinet.ca/eye-on-the-arctic/feed/'
	]
};

const RSS_ONLY = new Set(['politics', 'brazil', 'latam', 'finance']);
const RSS_PLUS_GDELT = new Set(['intel']);
const ALL_NEWS_CATEGORIES = Object.keys(NEWS_FEEDS);
const NEWS_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const SOURCE_TIMEOUT_MS = 30000;
const CATEGORY_CACHE_TTL_MS = 2 * 60 * 1000;

const GDELT_QUERIES = {
	politics: '(politics OR government OR election OR congress)',
	tech: '(technology OR software OR startup OR "silicon valley")',
	finance: '(finance OR "stock market" OR economy OR banking)',
	gov: '("federal government" OR "white house" OR congress OR regulation)',
	ai: '("artificial intelligence" OR "machine learning" OR AI OR ChatGPT)',
	intel: '(intelligence OR security OR military OR defense)',
	brazil: '(Brazil OR Brasilia OR "Sao Paulo" OR Lula OR Bolsonaro)',
	latam: '("Latin America" OR Mexico OR Argentina OR Colombia OR Chile OR Peru)',
	iran: '(Iran OR Tehran OR IRGC OR Khamenei OR "Iranian government" OR "Persian Gulf")',
	venezuela: '(Venezuela OR Maduro OR Caracas OR "Venezuelan government" OR "Venezuelan crisis")',
	greenland:
		'(Greenland OR Arctic OR "Danish territory" OR Nuuk OR "Arctic council" OR "polar region")'
};

const memoryStore = new Map();

function hashCode(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash).toString(36);
}

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Expose-Headers': '*'
		}
	});
}

function normalizeCategoryList(input) {
	const requested = Array.isArray(input) && input.length > 0 ? input : ALL_NEWS_CATEGORIES;
	return requested.filter((category) => Object.hasOwn(NEWS_FEEDS, category));
}

function isAllowedDomain(url) {
	try {
		const parsed = new URL(url);
		return ALLOWED_DOMAINS.some(
			(domain) => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
		);
	} catch {
		return false;
	}
}

function decodeHtml(text) {
	return text
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function extractTag(block, tag) {
	const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
	return match ? decodeHtml(match[1]) : '';
}

function extractLink(block) {
	const atomHref = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
	if (atomHref) return atomHref[1].trim();
	const rssLink = extractTag(block, 'link');
	return rssLink || '';
}

function parseTimestamp(raw) {
	if (!raw) return Date.now();
	const date = new Date(raw);
	if (!Number.isNaN(date.getTime())) return date.getTime();
	const gdelt = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
	if (gdelt) {
		const [, y, m, d, h, min, s] = gdelt;
		return new Date(`${y}-${m}-${d}T${h}:${min}:${s}Z`).getTime();
	}
	return Date.now();
}

function pruneAndSort(items) {
	const cutoff = Date.now() - NEWS_MAX_AGE_MS;
	const dedup = new Map();
	for (const item of items) {
		if (!item || !item.title || !item.link) continue;
		if ((item.timestamp || 0) < cutoff) continue;
		const key = `${item.link}::${item.category}`;
		const existing = dedup.get(key);
		if (!existing || existing.timestamp < item.timestamp) dedup.set(key, item);
	}
	return [...dedup.values()].sort((a, b) => b.timestamp - a.timestamp);
}

async function fetchWithTimeout(url, timeoutMs = SOURCE_TIMEOUT_MS) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, {
			signal: controller.signal,
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SituationMonitor/2.0)' }
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

function parseFeedXml(xml, category, sourceUrl) {
	const sourceHost = (() => {
		try {
			return new URL(sourceUrl).hostname;
		} catch {
			return 'unknown';
		}
	})();
	const blocks = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0]);
	const entries =
		blocks.length > 0 ? blocks : [...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
	return entries
		.map((block) => {
			const title = extractTag(block, 'title');
			const link = extractLink(block);
			const pubDate =
				extractTag(block, 'pubDate') ||
				extractTag(block, 'published') ||
				extractTag(block, 'updated');
			const description =
				extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');
			if (!title || !link) return null;
			const timestamp = parseTimestamp(pubDate);
			return {
				id: `rss-${category}-${hashCode(link)}`,
				title,
				link,
				pubDate,
				timestamp,
				description: description.slice(0, 200),
				source: sourceHost,
				category
			};
		})
		.filter(Boolean);
}

async function fetchRssCategory(category) {
	const urls = NEWS_FEEDS[category] || [];
	const responses = await Promise.all(
		urls.map(async (url) => {
			try {
				if (!isAllowedDomain(url)) return [];
				const res = await fetchWithTimeout(url, SOURCE_TIMEOUT_MS);
				if (!res.ok) return [];
				const xml = await res.text();
				return parseFeedXml(xml, category, url);
			} catch {
				return [];
			}
		})
	);
	return responses.flat();
}

async function fetchGdeltCategory(category) {
	const query = GDELT_QUERIES[category];
	if (!query) return [];
	const fullQuery = `${query} sourcelang:english`;
	const url =
		'https://api.gdeltproject.org/api/v2/doc/doc?query=' +
		encodeURIComponent(fullQuery) +
		'&timespan=7d&mode=artlist&maxrecords=50&format=json&sort=date';
	try {
		const res = await fetchWithTimeout(url, SOURCE_TIMEOUT_MS);
		if (!res.ok) return [];
		const data = await res.json();
		const articles = Array.isArray(data?.articles) ? data.articles : [];
		return articles
			.map((article, index) => {
				const title = article?.title || '';
				const link = article?.url || '';
				if (!title || !link) return null;
				const timestamp = parseTimestamp(article?.seendate);
				return {
					id: `gdelt-${category}-${hashCode(link)}-${index}`,
					title,
					link,
					pubDate: article?.seendate,
					timestamp,
					source: article?.domain || 'gdelt',
					category
				};
			})
			.filter(Boolean);
	} catch {
		return [];
	}
}

async function buildCategoryItems(category) {
	if (!Object.hasOwn(NEWS_FEEDS, category)) return [];
	if (RSS_ONLY.has(category)) {
		return pruneAndSort(await fetchRssCategory(category));
	}
	if (RSS_PLUS_GDELT.has(category)) {
		const [rssItems, gdeltItems] = await Promise.all([
			fetchRssCategory(category),
			fetchGdeltCategory(category)
		]);
		return pruneAndSort([...rssItems, ...gdeltItems]);
	}
	return pruneAndSort(await fetchGdeltCategory(category));
}

function getKvBinding(env) {
	return env?.NEWS_KV || null;
}

async function getStoreValue(env, key) {
	const kv = getKvBinding(env);
	if (!kv) return memoryStore.get(key) || null;
	const raw = await kv.get(key);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

async function setStoreValue(env, key, value) {
	const kv = getKvBinding(env);
	if (!kv) {
		memoryStore.set(key, value);
		return;
	}
	await kv.put(key, JSON.stringify(value));
}

function getCategoryKeys(category) {
	return {
		payload: `news:cat:${category}:payload`,
		checkpoint: `news:cat:${category}:checkpoint`
	};
}

async function readCategoryPayload(env, category) {
	const { payload, checkpoint } = getCategoryKeys(category);
	const storedPayload = await getStoreValue(env, payload);
	const storedCheckpoint = await getStoreValue(env, checkpoint);
	return {
		items: Array.isArray(storedPayload?.items) ? storedPayload.items : [],
		updatedAt: Number(storedPayload?.updatedAt || 0),
		checkpoint: Number(storedCheckpoint?.lastTimestamp || 0)
	};
}

async function writeCategoryPayload(env, category, items) {
	const { payload, checkpoint } = getCategoryKeys(category);
	const nextItems = pruneAndSort(items);
	const nextCheckpoint = nextItems.length > 0 ? nextItems[0].timestamp : 0;
	await setStoreValue(env, payload, {
		items: nextItems,
		updatedAt: Date.now()
	});
	await setStoreValue(env, checkpoint, { lastTimestamp: nextCheckpoint });
	return { items: nextItems, checkpoint: nextCheckpoint };
}

async function refreshCategory(env, category) {
	const items = await buildCategoryItems(category);
	return writeCategoryPayload(env, category, items);
}

async function getCategorySnapshot(env, ctx, category, sinceTimestamp = 0) {
	const stored = await readCategoryPayload(env, category);
	const age = Date.now() - stored.updatedAt;

	if (stored.items.length === 0) {
		const fresh = await refreshCategory(env, category);
		return {
			items: fresh.items.filter((item) => item.timestamp > sinceTimestamp),
			checkpoint: fresh.checkpoint
		};
	}

	if (age > CATEGORY_CACHE_TTL_MS) {
		ctx.waitUntil(refreshCategory(env, category));
	}

	return {
		items: stored.items.filter((item) => item.timestamp > sinceTimestamp),
		checkpoint: stored.checkpoint
	};
}

function parseSinceByCategory(input) {
	if (!input || typeof input !== 'object') return {};
	const result = {};
	for (const [key, value] of Object.entries(input)) {
		if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
	}
	return result;
}

async function handleNewsSnapshot(request, env, ctx) {
	let body = {};
	if (request.method === 'POST') {
		try {
			body = await request.json();
		} catch {
			body = {};
		}
	}

	const url = new URL(request.url);
	const categoriesFromQuery = url.searchParams.get('categories')?.split(',').filter(Boolean) || [];
	const categories = normalizeCategoryList(body.categories || categoriesFromQuery);
	const sinceByCategory = parseSinceByCategory(body.sinceByCategory || {});

	const response = { categories: {}, checkpoints: {}, generatedAt: Date.now(), partial: false, errors: {} };

	await Promise.all(
		categories.map(async (category) => {
			try {
				const snapshot = await getCategorySnapshot(env, ctx, category, sinceByCategory[category] || 0);
				response.categories[category] = snapshot.items;
				response.checkpoints[category] = snapshot.checkpoint;
			} catch (error) {
				response.partial = true;
				response.errors[category] = [String(error)];
				response.categories[category] = [];
				response.checkpoints[category] = 0;
			}
		})
	);

	return jsonResponse(response);
}

async function handleNewsRefresh(request, env) {
	let body = {};
	try {
		body = await request.json();
	} catch {
		body = {};
	}
	const categories = normalizeCategoryList(body.categories || []);
	const refreshed = {};
	await Promise.all(
		categories.map(async (category) => {
			const result = await refreshCategory(env, category);
			refreshed[category] = { count: result.items.length, checkpoint: result.checkpoint };
		})
	);
	return jsonResponse({ refreshed, timestamp: Date.now() });
}

async function handleProxyRequest(request) {
	const url = new URL(request.url);
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return jsonResponse({ error: 'Missing url parameter' }, 400);
	}

	let decodedUrl;
	try {
		decodedUrl = decodeURIComponent(targetUrl);
	} catch {
		return jsonResponse({ error: 'Invalid URL encoding' }, 400);
	}

	if (!isAllowedDomain(decodedUrl)) {
		return jsonResponse({ error: 'Domain not allowed' }, 403);
	}

	try {
		const response = await fetch(decodedUrl, {
			method: request.method,
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; SituationMonitor/2.0)'
			}
		});

		const newHeaders = new Headers(response.headers);
		newHeaders.set('Access-Control-Allow-Origin', '*');
		newHeaders.set('Access-Control-Expose-Headers', '*');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders
		});
	} catch (error) {
		return jsonResponse({ error: 'Fetch failed', message: String(error) }, 502);
	}
}

function corsPreflight() {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400'
		}
	});
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return corsPreflight();
		}

		const url = new URL(request.url);
		if (url.pathname === '/news/snapshot' && (request.method === 'GET' || request.method === 'POST')) {
			return handleNewsSnapshot(request, env, ctx);
		}
		if (url.pathname === '/news/refresh' && request.method === 'POST') {
			return handleNewsRefresh(request, env);
		}

		return handleProxyRequest(request);
	}
};
