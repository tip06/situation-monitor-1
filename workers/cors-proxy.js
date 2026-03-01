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

const COUNTRY_STABILITY_QUERIES = {
	usa: 'United States OR "White House" OR Congress',
	china: 'China OR Beijing OR "Xi Jinping"',
	russia: 'Russia OR Moscow OR Putin OR Kremlin',
	iran: 'Iran OR Tehran OR IRGC OR Khamenei',
	israel: 'Israel OR Tel Aviv OR Netanyahu OR Gaza',
	ukraine: 'Ukraine OR Kyiv OR Zelensky OR Donbas',
	venezuela: 'Venezuela OR Maduro OR Caracas',
	brazil: 'Brazil OR Brasilia OR Lula',
	india: 'India OR Modi OR "New Delhi"',
	pakistan: 'Pakistan OR Islamabad OR ISI',
	northkorea: '"North Korea" OR Pyongyang OR Kim Jong',
	taiwan: 'Taiwan OR Taipei OR "Taiwan Strait"',
	saudiarabia: '"Saudi Arabia" OR Riyadh OR MBS',
	turkey: 'Turkey OR Ankara OR Erdogan',
	germany: 'Germany OR Berlin OR Bundestag'
};

const COUNTRY_STABILITY_BASELINE = {
	usa: 72,
	china: 67,
	russia: 44,
	iran: 34,
	israel: 56,
	ukraine: 28,
	venezuela: 30,
	brazil: 62,
	india: 59,
	pakistan: 41,
	northkorea: 32,
	taiwan: 69,
	saudiarabia: 58,
	turkey: 55,
	germany: 79
};

const INSTABILITY_PATTERNS = [
	[/\bcoup\b/i, 32],
	[/\bcivil war\b/i, 30],
	[/\binvasion\b/i, 30],
	[/\bstate of emergency\b/i, 28],
	[/\bassassinat(?:ion|ed)\b/i, 26],
	[/\bmissile\b/i, 24],
	[/\bdrone strike\b/i, 24],
	[/\bterror(?:ist|ism)\b/i, 24],
	[/\bairstrike\b/i, 22],
	[/\bmilitary offensive\b/i, 22],
	[/\briot(?:s)?\b/i, 18],
	[/\bprotest(?:s)?\b/i, 15],
	[/\bunrest\b/i, 15],
	[/\bclash(?:es)?\b/i, 14],
	[/\bsanction(?:s|ed)?\b/i, 12],
	[/\bcrisis\b/i, 11],
	[/\btension(?:s)?\b/i, 10],
	[/\bstrike(?:s)?\b/i, 8]
];

const STABILIZING_PATTERNS = [
	[/\bceasefire\b/i, 12],
	[/\bde-?escalat(?:e|ion)\b/i, 10],
	[/\bpeace talk(?:s)?\b/i, 10],
	[/\bdiplomatic breakthrough\b/i, 9],
	[/\bagreement\b/i, 8],
	[/\btruce\b/i, 8],
	[/\bmediation\b/i, 7],
	[/\breform\b/i, 6],
	[/\bstability\b/i, 4]
];

const OUTAGE_CACHE_KEY = 'outages:snapshot:v1';
const OUTAGE_CACHE_TTL_MS = 5 * 60 * 1000;
const CLOUDFLARE_RADAR_URL =
	'https://api.cloudflare.com/client/v4/radar/annotations/outages?dateRange=7d&limit=50';

const COUNTRY_COORDS = {
	AF: [33.94, 67.71],
	AL: [41.15, 20.17],
	DZ: [28.03, 1.66],
	AO: [-11.2, 17.87],
	AR: [-38.42, -63.62],
	AM: [40.07, 45.04],
	AU: [-25.27, 133.78],
	AT: [47.52, 14.55],
	AZ: [40.14, 47.58],
	BH: [26.07, 50.56],
	BD: [23.69, 90.36],
	BY: [53.71, 27.95],
	BE: [50.5, 4.47],
	BJ: [9.31, 2.32],
	BO: [-16.29, -63.59],
	BA: [43.92, 17.68],
	BW: [-22.33, 24.68],
	BR: [-14.24, -51.93],
	BG: [42.73, 25.49],
	BF: [12.24, -1.56],
	BI: [-3.37, 29.92],
	KH: [12.57, 104.99],
	CM: [7.37, 12.35],
	CA: [56.13, -106.35],
	CF: [6.61, 20.94],
	TD: [15.45, 18.73],
	CL: [-35.68, -71.54],
	CN: [35.86, 104.2],
	CO: [4.57, -74.3],
	CG: [-0.23, 15.83],
	CD: [-4.04, 21.76],
	CR: [9.75, -83.75],
	HR: [45.1, 15.2],
	CU: [21.52, -77.78],
	CY: [35.13, 33.43],
	CZ: [49.82, 15.47],
	DK: [56.26, 9.5],
	DJ: [11.83, 42.59],
	EC: [-1.83, -78.18],
	EG: [26.82, 30.8],
	SV: [13.79, -88.9],
	ER: [15.18, 39.78],
	EE: [58.6, 25.01],
	ET: [9.15, 40.49],
	FI: [61.92, 25.75],
	FR: [46.23, 2.21],
	GA: [-0.8, 11.61],
	GM: [13.44, -15.31],
	GE: [42.32, 43.36],
	DE: [51.17, 10.45],
	GH: [7.95, -1.02],
	GR: [39.07, 21.82],
	GT: [15.78, -90.23],
	GN: [9.95, -9.7],
	HT: [18.97, -72.29],
	HN: [15.2, -86.24],
	HK: [22.32, 114.17],
	HU: [47.16, 19.5],
	IN: [20.59, 78.96],
	ID: [-0.79, 113.92],
	IR: [32.43, 53.69],
	IQ: [33.22, 43.68],
	IE: [53.14, -7.69],
	IL: [31.05, 34.85],
	IT: [41.87, 12.57],
	CI: [7.54, -5.55],
	JP: [36.2, 138.25],
	JO: [30.59, 36.24],
	KZ: [48.02, 66.92],
	KE: [-0.02, 37.91],
	KW: [29.31, 47.48],
	KG: [41.2, 74.77],
	LA: [19.86, 102.5],
	LV: [56.88, 24.6],
	LB: [33.85, 35.86],
	LY: [26.34, 17.23],
	LT: [55.17, 23.88],
	LU: [49.82, 6.13],
	MG: [-18.77, 46.87],
	MW: [-13.25, 34.3],
	MY: [4.21, 101.98],
	ML: [17.57, -4],
	MR: [21.01, -10.94],
	MX: [23.63, -102.55],
	MD: [47.41, 28.37],
	MN: [46.86, 103.85],
	MA: [31.79, -7.09],
	MZ: [-18.67, 35.53],
	MM: [21.92, 95.96],
	NA: [-22.96, 18.49],
	NP: [28.39, 84.12],
	NL: [52.13, 5.29],
	NZ: [-40.9, 174.89],
	NI: [12.87, -85.21],
	NE: [17.61, 8.08],
	NG: [9.08, 8.68],
	KP: [40.34, 127.51],
	NO: [60.47, 8.47],
	OM: [21.47, 55.98],
	PK: [30.38, 69.35],
	PS: [31.95, 35.23],
	PA: [8.54, -80.78],
	PG: [-6.32, 143.96],
	PY: [-23.44, -58.44],
	PE: [-9.19, -75.02],
	PH: [12.88, 121.77],
	PL: [51.92, 19.15],
	PT: [39.4, -8.22],
	QA: [25.35, 51.18],
	RO: [45.94, 24.97],
	RU: [61.52, 105.32],
	RW: [-1.94, 29.87],
	SA: [23.89, 45.08],
	SN: [14.5, -14.45],
	RS: [44.02, 21.01],
	SL: [8.46, -11.78],
	SG: [1.35, 103.82],
	SK: [48.67, 19.7],
	SI: [46.15, 14.99],
	SO: [5.15, 46.2],
	ZA: [-30.56, 22.94],
	KR: [35.91, 127.77],
	SS: [6.88, 31.31],
	ES: [40.46, -3.75],
	LK: [7.87, 80.77],
	SD: [12.86, 30.22],
	SE: [60.13, 18.64],
	CH: [46.82, 8.23],
	SY: [34.8, 38.997],
	TW: [23.7, 120.96],
	TJ: [38.86, 71.28],
	TZ: [-6.37, 34.89],
	TH: [15.87, 100.99],
	TG: [8.62, 0.82],
	TT: [10.69, -61.22],
	TN: [33.89, 9.54],
	TR: [38.96, 35.24],
	TM: [38.97, 59.56],
	UG: [1.37, 32.29],
	UA: [48.38, 31.17],
	AE: [23.42, 53.85],
	GB: [55.38, -3.44],
	US: [37.09, -95.71],
	UY: [-32.52, -55.77],
	UZ: [41.38, 64.59],
	VE: [6.42, -66.59],
	VN: [14.06, 108.28],
	YE: [15.55, 48.52],
	ZM: [-13.13, 27.85],
	ZW: [-19.02, 29.15]
};

function computeStabilityScore(items, baseline) {
	if (!Array.isArray(items) || items.length === 0) return baseline;

	let riskPoints = 0;
	let stabilizingPoints = 0;
	let riskArticleCount = 0;
	let severeArticleCount = 0;

	for (const item of items) {
		const text = `${item?.title || ''} ${item?.description || ''}`.toLowerCase().trim();
		if (!text) continue;

		let articleRisk = 0;
		let articleStabilizing = 0;
		for (const [pattern, weight] of INSTABILITY_PATTERNS) {
			if (pattern.test(text)) articleRisk += weight;
		}
		for (const [pattern, weight] of STABILIZING_PATTERNS) {
			if (pattern.test(text)) articleStabilizing += weight;
		}

		if (articleRisk > 0) {
			riskArticleCount += 1;
			if (articleRisk >= 24) severeArticleCount += 1;
		}

		riskPoints += Math.min(articleRisk, 45);
		stabilizingPoints += Math.min(articleStabilizing, 20);
	}

	const sampleSize = Math.max(1, Math.min(items.length, 50));
	const confidence = Math.min(1, sampleSize / 20);
	const avgRisk = riskPoints / sampleSize;
	const avgStabilizing = stabilizingPoints / sampleSize;
	const riskShare = riskArticleCount / sampleSize;
	const severeShare = severeArticleCount / sampleSize;

	// Baseline captures structural country risk; recent headlines move score up/down.
	const pressure =
		avgRisk * 1.15 +
		riskShare * 24 +
		severeShare * 18 -
		avgStabilizing * 1.4;
	const adjustedPressure = pressure * (0.5 + confidence * 0.5);
	const score = baseline - adjustedPressure;
	return Math.round(Math.max(0, Math.min(100, score)));
}

function mapOutageSeverity(outageType) {
	if (outageType === 'NATIONWIDE') return 'total';
	if (outageType === 'REGIONAL') return 'major';
	return 'partial';
}

function toEpochMs(value) {
	if (!value) return 0;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function handleOutagesSnapshot(request, env) {
	const cached = await getStoreValue(env, OUTAGE_CACHE_KEY);
	if (cached && Date.now() - cached.generatedAt < OUTAGE_CACHE_TTL_MS) {
		return jsonResponse(cached);
	}

	const token = env.CLOUDFLARE_RADAR_API_KEY || env.CLOUDFLARE_API_TOKEN;
	if (!token) return jsonResponse({ error: 'Cloudflare Radar token not configured' }, 503);

	try {
		// Override headers to include authorization while keeping timeout behavior.
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
		let radarRes;
		try {
			radarRes = await fetch(CLOUDFLARE_RADAR_URL, {
				signal: controller.signal,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'User-Agent': 'Mozilla/5.0 (compatible; SituationMonitor/2.0)'
				}
			});
		} finally {
			clearTimeout(timeoutId);
		}

		if (!radarRes.ok) {
			const fallback = cached || { outages: [], generatedAt: Date.now() };
			return jsonResponse(fallback, cached ? 200 : 502);
		}

		const data = await radarRes.json();
		if (data?.configured === false || data?.success === false || (data?.errors?.length ?? 0) > 0) {
			const fallback = cached || { outages: [], generatedAt: Date.now() };
			return jsonResponse(fallback, cached ? 200 : 502);
		}

		const outages = [];
		for (const raw of data?.result?.annotations || []) {
			const countryCode =
				(raw?.locations && raw.locations[0]) ||
				(raw?.locationsDetails && raw.locationsDetails[0] && raw.locationsDetails[0].code) ||
				'';
			if (!countryCode) continue;

			const coords = COUNTRY_COORDS[countryCode];
			if (!coords) continue;

			const countryName =
				(raw?.locationsDetails && raw.locationsDetails[0] && raw.locationsDetails[0].name) ||
				countryCode;
			const outageCause = raw?.outage?.outageCause || '';
			const outageType = raw?.outage?.outageType || '';
			const categories = ['Cloudflare Radar'];
			if (outageCause) categories.push(String(outageCause).replace(/_/g, ' '));
			if (outageType) categories.push(String(outageType));
			for (const asn of raw?.asnsDetails?.slice(0, 2) || []) {
				if (asn?.name) categories.push(asn.name);
			}

			outages.push({
				id: `cf-${raw.id}`,
				title: raw.scope
					? `${raw.scope} outage in ${countryName}`
					: `Internet disruption in ${countryName}`,
				link: raw.linkedUrl || 'https://radar.cloudflare.com/outage-center',
				description: raw.description || '',
				detectedAt: toEpochMs(raw.startDate),
				country: countryName,
				region: '',
				lat: coords[0],
				lon: coords[1],
				severity: mapOutageSeverity(outageType),
				categories,
				cause: outageCause || '',
				outageType: outageType || '',
				endedAt: toEpochMs(raw.endDate)
			});
		}

		outages.sort((a, b) => (b.detectedAt || 0) - (a.detectedAt || 0));
		const snapshot = { outages, generatedAt: Date.now() };
		await setStoreValue(env, OUTAGE_CACHE_KEY, snapshot);
		return jsonResponse(snapshot);
	} catch {
		const fallback = cached || { outages: [], generatedAt: Date.now() };
		return jsonResponse(fallback, cached ? 200 : 502);
	}
}

async function handleAiBrief(request, env) {
	// Read headlines from request body
	let headlines = [];
	try {
		const body = await request.json();
		if (Array.isArray(body?.headlines)) {
			headlines = body.headlines.filter((h) => typeof h === 'string' && h.length > 0);
		}
	} catch {}

	// Fall back to KV-cached news if frontend sent none
	if (headlines.length === 0) {
		for (const category of ['politics', 'intel', 'finance', 'tech', 'ai']) {
			const stored = await readCategoryPayload(env, category);
			headlines.push(...stored.items.slice(0, 8).map((i) => i.title));
		}
	}

	// Cache key includes a hash of the headlines so different news produces different briefs
	const cacheKey = 'ai:brief';
	const cached = await getStoreValue(env, cacheKey);
	if (cached && headlines.length === 0 && Date.now() - cached.generatedAt < 6 * 60 * 60 * 1000) {
		return jsonResponse(cached);
	}

	const groqKey = env.GROQ_API_KEY;
	if (!groqKey) return jsonResponse({ error: 'GROQ_API_KEY not configured' }, 503);

	const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			model: 'llama-3.3-70b-versatile',
			messages: [
				{
					role: 'system',
					content: 'You are a senior intelligence analyst. Be direct, analytical, and concise. No fluff.'
				},
				{
					role: 'user',
					content: `Based on these recent news headlines, write a 3-paragraph global situation brief covering: (1) key geopolitical developments, (2) economic and market signals, (3) notable risks or escalation indicators. Headlines:\n${headlines.join('\n')}`
				}
			],
			max_tokens: 600
		})
	});

	if (!response.ok) return jsonResponse({ error: 'Groq API error', status: response.status }, 502);
	const data = await response.json();
	const brief = {
		text: data.choices[0].message.content,
		generatedAt: Date.now(),
		headlineCount: headlines.length
	};
	await setStoreValue(env, 'ai:brief', brief);
	return jsonResponse(brief);
}

async function handleStabilitySnapshot(request, env) {
	const cacheKey = 'stability:snapshot:v2';
	const cached = await getStoreValue(env, cacheKey);
	if (cached && Date.now() - cached.generatedAt < 60 * 60 * 1000) {
		return jsonResponse(cached);
	}

	const scores = {};
	await Promise.all(
		Object.entries(COUNTRY_STABILITY_QUERIES).map(async ([country, query]) => {
			const baseline = COUNTRY_STABILITY_BASELINE[country] ?? 60;
			try {
				const url =
					'https://api.gdeltproject.org/api/v2/doc/doc?query=' +
					encodeURIComponent(`(${query}) sourcelang:english`) +
					'&timespan=7d&mode=artlist&maxrecords=50&format=json&sort=date';
				const res = await fetchWithTimeout(url);
				const data = res.ok ? await res.json() : { articles: [] };
				const items = Array.isArray(data?.articles) ? data.articles : [];
				scores[country] = computeStabilityScore(items, baseline);
			} catch {
				scores[country] = baseline;
			}
		})
	);

	const snapshot = { scores, generatedAt: Date.now() };
	await setStoreValue(env, cacheKey, snapshot);
	return jsonResponse(snapshot);
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
		if (url.pathname === '/ai/brief' && request.method === 'POST') {
			return handleAiBrief(request, env);
		}
		if (url.pathname === '/stability/snapshot' && request.method === 'POST') {
			return handleStabilitySnapshot(request, env);
		}
		if (url.pathname === '/outages/snapshot' && request.method === 'POST') {
			return handleOutagesSnapshot(request, env);
		}

		return handleProxyRequest(request);
	}
};
