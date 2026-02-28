/**
 * Quick script to test all RSS feed URLs and report which are failing.
 * Run with: node test-feeds.mjs
 */

const FEEDS = {
	politics: [
		{ name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
		{ name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
		{ name: 'Washington Post', url: 'https://news.google.com/rss/search?q=site:washingtonpost.com%20politics&hl=en&gl=US&ceid=US:en' },
		{ name: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
		{ name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
		{ name: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/rss.xml' },
		{ name: 'Politico', url: 'https://rss.politico.com/politics-news.xml' },
		{ name: 'Foreign Policy', url: 'https://foreignpolicy.com/feed/' },
		{ name: 'The Economist', url: 'https://www.economist.com/the-world-this-week/rss.xml' },
		{ name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
		{ name: 'WSJ Politics', url: 'https://news.google.com/rss/search?q=site:wsj.com%20politics&hl=en&gl=US&ceid=US:en' },
	],
	tech: [
		{ name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
		{ name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
		{ name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
		{ name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' },
		{ name: 'ArXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
		{ name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
		{ name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
		{ name: 'Wired', url: 'https://www.wired.com/feed/rss' },
		{ name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
		{ name: 'Gizmodo', url: 'https://gizmodo.com/rss' },
		{ name: 'Canaltech', url: 'https://feeds.feedburner.com/canaltechbr' },
		{ name: 'WSJ Tech', url: 'https://news.google.com/rss/search?q=site:wsj.com%20technology&hl=en&gl=US&ceid=US:en' },
	],
	finance: [
		{ name: 'Reuters Business', url: 'https://news.google.com/rss/search?q=site:reuters.com%20business&hl=en&gl=US&ceid=US:en' },
		{ name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
		{ name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
		{ name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
		{ name: 'Financial Times', url: 'https://www.ft.com/rss/home' },
		{ name: 'Wall Street Journal', url: 'https://news.google.com/rss/search?q=site:wsj.com%20finance%20markets&hl=en&gl=US&ceid=US:en' },
		{ name: 'The Economist', url: 'https://www.economist.com/finance-and-economics/rss.xml' },
		{ name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
		{ name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
		{ name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss' },
	],
	gov: [
		{ name: 'White House', url: 'https://www.whitehouse.gov/news/feed/' },
		{ name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
		{ name: 'SEC Announcements', url: 'https://www.sec.gov/news/pressreleases.rss' },
		{ name: 'DoD News', url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=945' },
	],
	ai: [
		{ name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
		{ name: 'ArXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
	],
	intel: [
		{ name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
		{ name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/' },
		{ name: 'War on the Rocks', url: 'https://warontherocks.com/feed/' },
		{ name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml' },
		{ name: 'The War Zone', url: 'https://www.thedrive.com/the-war-zone/feed' },
		{ name: 'RealClearDefense', url: 'https://www.realcleardefense.com/index.xml' },
		{ name: 'CSIS', url: 'https://news.google.com/rss/search?q=site:csis.org&hl=en&gl=US&ceid=US:en' },
		{ name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/' },
		{ name: 'Chatham House', url: 'https://news.google.com/rss/search?q=site:chathamhouse.org&hl=en&gl=US&ceid=US:en' },
		{ name: 'IISS', url: 'https://news.google.com/rss/search?q=site:iiss.org&hl=en&gl=US&ceid=US:en' },
		{ name: 'Military.com', url: 'https://www.military.com/rss-feeds/content?feed=news-headlines.xml' },
	],
	brazil: [
		{ name: 'G1 Brasil', url: 'https://g1.globo.com/rss/g1/' },
		{ name: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml' },
		{ name: 'Reuters Brazil', url: 'https://news.google.com/rss/search?q=site%3Areuters.com%20%22brazil%22&hl=pt-BR&gl=BR&ceid=BR%3Apt-419' },
		{ name: 'Canaltech', url: 'https://feeds.feedburner.com/canaltechbr' },
		{ name: 'G1 Politica', url: 'https://g1.globo.com/rss/g1/politica/' },
		{ name: 'Gazeta do Povo', url: 'https://www.gazetadopovo.com.br/feed/rss/republica.xml' },
		{ name: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br/tudo-sobre/politica/feed/feed/' },
		{ name: 'Poder360', url: 'https://www.poder360.com.br/feed/' },
		{ name: 'Agencia Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml' },
		{ name: 'G1 Economia', url: 'https://g1.globo.com/rss/g1/economia/' },
		{ name: 'InfoMoney', url: 'https://www.infomoney.com.br/feed/' },
		{ name: 'Gazeta Economia', url: 'https://www.gazetadopovo.com.br/feed/rss/economia.xml' },
		{ name: 'Valor Economico', url: 'https://news.google.com/rss/search?q=site%3Avalor.globo.com&hl=pt-BR&gl=BR&ceid=BR%3Apt-419' },
		{ name: 'Banco Central', url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/blogdobc' },
		{ name: 'DefesaNet', url: 'https://www.defesanet.com.br/feed/' },
		{ name: 'Zona Militar', url: 'https://www.zona-militar.com/feed/' },
		{ name: 'Breaking Defense LATAM', url: 'https://breakingdefense.com/tag/latin-america/feed/' },
	],
	latam: [
		{ name: 'Reuters Latin America', url: 'https://news.google.com/rss/search?q=site:reuters.com%20americas%20latin%20america&hl=en&gl=US&ceid=US:en' },
		{ name: 'Americas Quarterly', url: 'https://www.americasquarterly.org/feed/' },
		{ name: 'El Pais America', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada' },
		{ name: 'Infobae America', url: 'https://news.google.com/rss/search?q=site:infobae.com%20america&hl=es&gl=US&ceid=US:es' },
	],
	iran: [
		{ name: 'Tehran Times', url: 'https://news.google.com/rss/search?q=site:tehrantimes.com&hl=en&gl=US&ceid=US:en' },
		{ name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss' },
		{ name: 'Radio Farda', url: 'https://news.google.com/rss/search?q=site:radiofarda.com&hl=en&gl=US&ceid=US:en' },
		{ name: 'Mehr News', url: 'https://en.mehrnews.com/rss' },
		{ name: 'ISNA', url: 'https://news.google.com/rss/search?q=site:isna.ir%20english&hl=en&gl=US&ceid=US:en' },
		{ name: 'IFP News', url: 'https://ifpnews.com/feed' },
		{ name: 'IranWire', url: 'https://news.google.com/rss/search?q=site:iranwire.com&hl=en&gl=US&ceid=US:en' },
	],
	venezuela: [
		{ name: 'Caracas Chronicles', url: 'https://www.caracaschronicles.com/feed' },
		{ name: 'El Nacional', url: 'https://www.elnacional.com/feed' },
		{ name: 'Venezuelanalysis', url: 'https://venezuelanalysis.com/feed' },
		{ name: 'VOA Americas', url: 'https://news.google.com/rss/search?q=site:voanews.com%20americas&hl=en&gl=US&ceid=US:en' },
		{ name: 'Reuters Americas', url: 'https://news.google.com/rss/search?q=site:reuters.com%20americas%20latin%20america&hl=en&gl=US&ceid=US:en' },
	],
	greenland: [
		{ name: 'Arctic Today', url: 'https://www.arctictoday.com/feed' },
		{ name: 'High North News', url: 'https://news.google.com/rss/search?q=site:highnorthnews.com&hl=en&gl=US&ceid=US:en' },
		{ name: 'The Arctic Institute', url: 'https://www.thearcticinstitute.org/feed' },
		{ name: 'Arctic Council', url: 'https://news.google.com/rss/search?q=site:arctic-council.org&hl=en&gl=US&ceid=US:en' },
		{ name: 'Eye on the Arctic', url: 'https://www.rcinet.ca/eye-on-the-arctic/feed/' },
	],
	fringe: [
		{ name: 'ZeroHedge', url: 'https://feeds.feedburner.com/zerohedge/feed' },
		{ name: 'Breitbart', url: 'https://feeds.feedburner.com/breitbart' },
		{ name: 'Daily Caller', url: 'https://dailycaller.com/feed/' },
		{ name: 'Epoch Times', url: 'https://www.theepochtimes.com/c-us/feed' },
	],
};

// Simple RSS item counter
function countRssItems(text) {
	const itemMatches = text.match(/<item[\s>]/gi) || [];
	const entryMatches = text.match(/<entry[\s>]/gi) || [];
	return itemMatches.length + entryMatches.length;
}

function isHtml(text) {
	const start = text.substring(0, 500).toLowerCase();
	return start.includes('<!doctype html') || start.includes('<html');
}

async function testFeed(category, feed) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);

	try {
		const resp = await fetch(feed.url, {
			signal: controller.signal,
			headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
			redirect: 'follow'
		});
		clearTimeout(timeout);

		if (!resp.ok) {
			return { category, name: feed.name, status: 'HTTP_ERROR', code: resp.status, items: 0 };
		}

		const text = await resp.text();
		const items = countRssItems(text);
		const html = isHtml(text);

		if (items === 0 && html) {
			return { category, name: feed.name, status: 'HTML_NOT_RSS', code: resp.status, items: 0, textLen: text.length };
		}
		if (items === 0) {
			return { category, name: feed.name, status: 'EMPTY', code: resp.status, items: 0, textLen: text.length, snippet: text.substring(0, 200) };
		}

		return { category, name: feed.name, status: 'OK', code: resp.status, items };
	} catch (err) {
		clearTimeout(timeout);
		return { category, name: feed.name, status: 'ERROR', error: err.message };
	}
}

async function main() {
	const results = [];
	const allFeeds = [];

	for (const [category, feeds] of Object.entries(FEEDS)) {
		for (const feed of feeds) {
			allFeeds.push({ category, feed });
		}
	}

	console.log(`Testing ${allFeeds.length} feeds...\n`);

	// Test 5 at a time
	for (let i = 0; i < allFeeds.length; i += 5) {
		const batch = allFeeds.slice(i, i + 5);
		const batchResults = await Promise.all(
			batch.map(({ category, feed }) => testFeed(category, feed))
		);
		results.push(...batchResults);
		// Progress
		process.stdout.write(`  ${Math.min(i + 5, allFeeds.length)}/${allFeeds.length}\r`);
	}

	console.log('\n');

	// Report failures
	const failures = results.filter(r => r.status !== 'OK');
	const successes = results.filter(r => r.status === 'OK');

	console.log(`=== RESULTS ===`);
	console.log(`OK: ${successes.length}/${results.length}`);
	console.log(`FAILING: ${failures.length}/${results.length}\n`);

	if (failures.length > 0) {
		console.log('=== FAILING FEEDS ===\n');
		for (const f of failures) {
			console.log(`[${f.category}] ${f.name}`);
			console.log(`  Status: ${f.status}${f.code ? ` (${f.code})` : ''}`);
			if (f.error) console.log(`  Error: ${f.error}`);
			if (f.textLen) console.log(`  Text length: ${f.textLen}`);
			if (f.snippet) console.log(`  Snippet: ${f.snippet.replace(/\n/g, ' ').substring(0, 120)}`);
			console.log();
		}
	}

	console.log('=== OK FEEDS ===\n');
	for (const f of successes) {
		console.log(`  [${f.category}] ${f.name}: ${f.items} items`);
	}
}

main().catch(console.error);
