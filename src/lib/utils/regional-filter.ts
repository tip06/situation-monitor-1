import type { NewsCategory, NewsItem } from '$lib/types';

type RegionalCategory = 'brazil' | 'latam';

export interface RegionalFilterDecision {
	accepted: boolean;
	reasons: string[];
	matchedGeoTerms?: string[];
	matchedPolicyTerms?: string[];
	matchedBlockTerms?: string[];
}

const GEO_TERMS: Record<RegionalCategory, string[]> = {
	brazil: [
		'brazil',
		'brasil',
		'brasileiro',
		'brasileira',
		'brasilia',
		'sao paulo',
		'rio de janeiro',
		'belo horizonte',
		'porto alegre',
		'pernambuco',
		'goias',
		'lula',
		'bolsonaro',
		'stf',
		'camara dos deputados',
		'senado federal'
	],
	latam: [
		'latin america',
		'america latina',
		'latinoamerica',
		'latinoamericana',
		'latam',
		'south america',
		'sudamerica',
		'central america',
		'centroamerica',
		'mexico',
		'brasil',
		'argentina',
		'chile',
		'colombia',
		'peru',
		'ecuador',
		'bolivia',
		'uruguay',
		'paraguay',
		'venezuela',
		'costa rica',
		'guatemala',
		'panama',
		'dominican republic',
		'mercosur',
		'oas',
		'oea',
		'inter-american'
	]
};

const POLICY_TERMS = [
	'election',
	'elections',
	'vote',
	'poll',
	'congress',
	'senate',
	'chamber',
	'court',
	'supreme court',
	'minister',
	'ministry',
	'government',
	'policy',
	'regulation',
	'reform',
	'corruption',
	'protest',
	'fiscal',
	'inflation',
	'gdp',
	'central bank',
	'interest rate',
	'trade',
	'tariff',
	'export',
	'import',
	'commodity',
	'oil',
	'gas',
	'energy',
	'military',
	'defense',
	'security',
	'diplomatic',
	'summit',
	'treaty',
	'sanctions',
	'crime organization',
	'organized crime',
	'president',
	'presidency',
	'cabinet',
	'lawmakers',
	'legislation',
	'budget',
	'deficit',
	'revenue',
	'taxes',
	'treasury',
	'surplus',
	'public spending',
	'interest rates',
	'unemployment',
	'armed forces',
	'foreign minister',
	'eleicao',
	'eleicoes',
	'votacao',
	'congresso',
	'senado',
	'ministro',
	'ministerio',
	'governo',
	'politica',
	'regulacao',
	'reforma',
	'corrupcao',
	'protesto',
	'inflacao',
	'banco central',
	'taxa de juros',
	'comercio',
	'exportacao',
	'importacao',
	'seguranca',
	'diplomatico',
	'tratado',
	'sancoes',
	'presidente',
	'presidencia',
	'diputados',
	'ley',
	'decreto',
	'eleccion',
	'elecciones',
	'voto',
	'encuesta',
	'gobierno',
	'congreso',
	'senado',
	'ministro',
	'ministerio',
	'corte',
	'tribunal',
	'corrupcion',
	'protesta',
	'economia',
	'inflacion',
	'banco central',
	'tasa de interes',
	'tasas de interes',
	'comercio',
	'arancel',
	'aranceles',
	'exportacion',
	'exportaciones',
	'importacion',
	'importaciones',
	'energia',
	'defensa',
	'seguridad',
	'fuerzas armadas',
	'canciller',
	'cumbre',
	'tratado',
	'sanciones',
	'crimen organizado'
];

const BLOCKLIST_TERMS = [
	// Sports
	'football',
	'soccer',
	'fifa',
	'copa',
	'serie a',
	'libertadores',
	'nba',
	'nfl',
	'match',
	'defeat',
	'sports',
	'esporte',
	'futebol',
	'partida',
	// Entertainment and celebrity
	'celebrity',
	'actor',
	'actress',
	'singer',
	'movie',
	'series',
	'streaming',
	'entertainment',
	'gossip',
	'famous',
	'fama',
	'famoso',
	'novela',
	'reality show',
	// Lifestyle and shopping
	'lifestyle',
	'fashion',
	'beauty',
	'recipe',
	'travel tips',
	'horoscope',
	'shopping',
	'deal',
	'coupon',
	'black friday',
	'game review',
	'promo',
	// Weather
	'weather forecast',
	'storm warning',
	'heat wave',
	'chuva',
	'clima',
	'previsao do tempo',
	// Local incidents/traffic
	'traffic',
	'accident',
	'car crash',
	'local crime',
	'robbery',
	'mugging',
	'firefighters',
	'rescue',
	'acidente',
	'engarrafamento',
	'roubo',
	'assalto',
	'bombeiros',
	// Spanish low-signal classes
	'futbol',
	'partido',
	'farandula',
	'famosa',
	'famoso',
	'celebridad',
	'espectaculo',
	'moda',
	'belleza',
	'clima',
	'pronostico del tiempo',
	'accidente',
	'trafico',
	'choque',
	'robo'
];

function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesTerm(text: string, term: string): boolean {
	const normalizedTerm = normalizeText(term);
	if (!normalizedTerm) return false;
	const pattern = normalizedTerm
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => escapeRegExp(part))
		.join('\\s+');
	const regex = new RegExp(`\\b${pattern}\\b`, 'i');
	return regex.test(text);
}

function getMatchedTerms(text: string, terms: string[]): string[] {
	return terms.filter((term) => matchesTerm(text, term));
}

function isRegionalCategory(category: NewsCategory): category is RegionalCategory {
	return category === 'brazil' || category === 'latam';
}

export function classifyRegionalItem(
	item: Pick<NewsItem, 'title' | 'description' | 'category'>
): RegionalFilterDecision {
	if (!isRegionalCategory(item.category)) {
		return { accepted: true, reasons: ['non-regional-category'] };
	}

	const normalizedTitle = normalizeText(item.title || '');
	const normalizedDescription = normalizeText(item.description || '');
	const text = `${normalizedTitle} ${normalizedDescription}`.trim();

	if (!normalizedTitle || normalizedTitle.length < 12) {
		return { accepted: false, reasons: ['low-information'], matchedGeoTerms: [], matchedPolicyTerms: [] };
	}

	const matchedBlockTerms = getMatchedTerms(text, BLOCKLIST_TERMS);
	if (matchedBlockTerms.length > 0) {
		return { accepted: false, reasons: ['blocklist'], matchedBlockTerms };
	}

	const matchedGeoTerms = getMatchedTerms(text, GEO_TERMS[item.category]);
	const matchedPolicyTerms = getMatchedTerms(text, POLICY_TERMS);
	const hasGeo = matchedGeoTerms.length > 0;
	const hasPolicy = matchedPolicyTerms.length > 0;

	if (!hasGeo) {
		return { accepted: false, reasons: ['missing-geo'], matchedPolicyTerms };
	}

	if (!hasPolicy) {
		return { accepted: false, reasons: ['missing-policy'], matchedGeoTerms };
	}

	return { accepted: true, reasons: ['geo-policy-match'], matchedGeoTerms, matchedPolicyTerms };
}

export function isRegionalHighSignal(
	item: Pick<NewsItem, 'title' | 'description' | 'category'>
): boolean {
	return classifyRegionalItem(item).accepted;
}
