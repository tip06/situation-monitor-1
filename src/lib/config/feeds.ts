/**
 * RSS feed and news source configuration
 */

import type { NewsCategory } from '$lib/types';

export interface FeedSource {
	name: string;
	url: string;
}

export interface IntelSource extends FeedSource {
	type: 'think-tank' | 'defense' | 'regional' | 'osint' | 'govt' | 'cyber';
	topics: string[];
	region?: string;
}

export const FEEDS: Record<NewsCategory, FeedSource[]> = {
	politics: [
		{ name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
		{ name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
		{ name: 'Washington Post', url: 'https://feeds.washingtonpost.com/rss/politics' },
		{ name: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
		{ name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
		{ name: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/rss.xml' },
		{ name: 'Politico', url: 'https://rss.politico.com/politics-news.xml' },
		{ name: 'Foreign Policy', url: 'https://foreignpolicy.com/feed/' },
		{ name: 'The Economist', url: 'https://www.economist.com/the-world-this-week/rss.xml' },
		{ name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' }
	],
	tech: [
		{ name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
		{ name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
		{ name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
		{ name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' },
		{ name: 'ArXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
		{ name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' }
	],
	finance: [
		{ name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
		{ name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
		{ name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
		{ name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
		{ name: 'FT', url: 'https://www.ft.com/rss/home' }
	],
	gov: [
		{ name: 'White House', url: 'https://www.whitehouse.gov/news/feed/' },
		{ name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
		{ name: 'SEC Announcements', url: 'https://www.sec.gov/news/pressreleases.rss' },
		{
			name: 'DoD News',
			url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=945'
		}
	],
	ai: [
		{ name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
		{ name: 'ArXiv AI', url: 'https://rss.arxiv.org/rss/cs.AI' }
	],
	intel: [
		{ name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
		{ name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/' },
		{ name: 'War on the Rocks', url: 'https://warontherocks.com/feed/' },
		{ name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml' },
		{ name: 'The War Zone', url: 'https://www.thedrive.com/the-war-zone/feed' },
		{ name: 'RealClearDefense', url: 'https://www.realcleardefense.com/index.xml' },
		{ name: 'CSIS', url: 'https://www.csis.org/analysis/feed' },
		{ name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/' },
		{ name: 'Chatham House', url: 'https://www.chathamhouse.org/rss/all' },
		{ name: 'IISS', url: 'https://www.iiss.org/rss' },
		{ name: 'Military.com', url: 'https://www.military.com/rss-feeds/content?feed=news-headlines.xml' }
	],
	brazil: [
		// === GENERAL (3) ===
		{ name: 'G1 Brasil', url: 'https://g1.globo.com/rss/g1/' },
		{ name: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml' },
		{ name: 'Reuters Brazil', url: 'https://www.reuters.com/world/americas/rss' },

		// === POLITICS (5) ===
		{ name: 'G1 Politica', url: 'https://g1.globo.com/rss/g1/politica/' },
		{ name: 'Gazeta do Povo', url: 'https://www.gazetadopovo.com.br/feed/rss/republica.xml' },
		{ name: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br/politica/feed/' },
		{ name: 'Poder360', url: 'https://www.poder360.com.br/feed/' },
		{ name: 'Agencia Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml' },

		// === ECONOMY (4) ===
		{ name: 'G1 Economia', url: 'https://g1.globo.com/rss/g1/economia/' },
		{ name: 'InfoMoney', url: 'https://www.infomoney.com.br/feed/' },
		{ name: 'Gazeta Economia', url: 'https://www.gazetadopovo.com.br/feed/rss/economia.xml' },
		{ name: 'Valor Economico', url: 'https://valor.globo.com/feed/' },

		// === MILITARY/DEFENSE (3) ===
		{ name: 'DefesaNet', url: 'https://www.defesanet.com.br/feed/' },
		{ name: 'Zona Militar', url: 'https://www.zona-militar.com/feed/' },
		{ name: 'Breaking Defense LATAM', url: 'https://breakingdefense.com/tag/latin-america/feed/' }
	],
	latam: [
		{ name: 'Reuters Latin America', url: 'https://www.reuters.com/world/americas/rss' },
		{ name: 'Americas Quarterly', url: 'https://www.americasquarterly.org/feed/' },
		{ name: 'El Pais America', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada' }
	],
	iran: [
		{ name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss' },
		{ name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss' },
		{ name: 'Radio Farda', url: 'https://en.radiofarda.com/api/zp_qmtl-vomx-tpe_bimr' },
		{ name: 'Mehr News', url: 'https://en.mehrnews.com/rss' },
		{ name: 'ISNA', url: 'https://en.isna.ir/rss' },
		{ name: 'IFP News', url: 'https://ifpnews.com/feed' },
		{ name: 'IranWire', url: 'https://iranwire.com/en/feed' }
	],
	venezuela: [
		{ name: 'Caracas Chronicles', url: 'https://www.caracaschronicles.com/feed' },
		{ name: 'El Nacional', url: 'https://www.elnacional.com/feed' },
		{ name: 'Venezuelanalysis', url: 'https://venezuelanalysis.com/feed' },
		{ name: 'VOA Americas', url: 'https://www.vozdeamerica.com/api/zt-pemyvi' },
		{ name: 'Reuters Americas', url: 'https://www.reuters.com/world/americas/rss' }
	],
	greenland: [
		{ name: 'Arctic Today', url: 'https://www.arctictoday.com/feed' },
		{ name: 'High North News', url: 'https://en.highnorthnews.com/feed' },
		{ name: 'The Arctic Institute', url: 'https://www.thearcticinstitute.org/feed' },
		{ name: 'Arctic Council', url: 'https://arctic-council.org/feed' },
		{ name: 'Eye on the Arctic', url: 'https://www.rcinet.ca/eye-on-the-arctic/feed/' }
	]
};

export const INTEL_SOURCES: IntelSource[] = [
	{
		name: 'CSIS',
		url: 'https://www.csis.org/analysis/feed',
		type: 'think-tank',
		topics: ['defense', 'geopolitics']
	},
	{
		name: 'Brookings',
		url: 'https://www.brookings.edu/feed/',
		type: 'think-tank',
		topics: ['policy', 'geopolitics']
	},
	{
		name: 'CFR',
		url: 'https://www.cfr.org/rss.xml',
		type: 'think-tank',
		topics: ['foreign-policy']
	},
	{
		name: 'Defense One',
		url: 'https://www.defenseone.com/rss/all/',
		type: 'defense',
		topics: ['military', 'defense']
	},
	{
		name: 'War on Rocks',
		url: 'https://warontherocks.com/feed/',
		type: 'defense',
		topics: ['military', 'strategy']
	},
	{
		name: 'Breaking Defense',
		url: 'https://breakingdefense.com/feed/',
		type: 'defense',
		topics: ['military', 'defense']
	},
	{
		name: 'The Drive War Zone',
		url: 'https://www.thedrive.com/the-war-zone/feed',
		type: 'defense',
		topics: ['military']
	},
	{
		name: 'The Diplomat',
		url: 'https://thediplomat.com/feed/',
		type: 'regional',
		topics: ['asia-pacific'],
		region: 'APAC'
	},
	{
		name: 'Al-Monitor',
		url: 'https://www.al-monitor.com/rss',
		type: 'regional',
		topics: ['middle-east'],
		region: 'MENA'
	},
	{
		name: 'Bellingcat',
		url: 'https://www.bellingcat.com/feed/',
		type: 'osint',
		topics: ['investigation', 'osint']
	},
	{
		name: 'CISA Alerts',
		url: 'https://www.cisa.gov/uscert/ncas/alerts.xml',
		type: 'cyber',
		topics: ['cyber', 'security']
	},
	{
		name: 'Krebs Security',
		url: 'https://krebsonsecurity.com/feed/',
		type: 'cyber',
		topics: ['cyber', 'security']
	}
];
