/**
 * Keyword configuration for alerts and categorization
 */

export const ALERT_KEYWORDS = [
	'war',
	'invasion',
	'military',
	'nuclear',
	'sanctions',
	'missile',
	'attack',
	'troops',
	'conflict',
	'strike',
	'bomb',
	'casualties',
	'ceasefire',
	'treaty',
	'nato',
	'coup',
	'martial law',
	'emergency',
	'assassination',
	'terrorist',
	'hostage',
	'evacuation'
] as const;

export type AlertKeyword = (typeof ALERT_KEYWORDS)[number];

export const REGION_KEYWORDS: Record<string, string[]> = {
	EUROPE: [
		'nato',
		'eu',
		'european',
		'ukraine',
		'russia',
		'germany',
		'france',
		'uk',
		'britain',
		'poland'
	],
	MENA: [
		'iran',
		'israel',
		'saudi',
		'syria',
		'iraq',
		'gaza',
		'lebanon',
		'yemen',
		'houthi',
		'middle east'
	],
	APAC: [
		'china',
		'taiwan',
		'japan',
		'korea',
		'indo-pacific',
		'south china sea',
		'asean',
		'philippines'
	],
	AMERICAS: ['us', 'america', 'canada', 'mexico', 'brazil', 'venezuela', 'latin'],
	AFRICA: ['africa', 'sahel', 'niger', 'sudan', 'ethiopia', 'somalia']
};

export const TOPIC_KEYWORDS: Record<string, string[]> = {
	CYBER: ['cyber', 'hack', 'ransomware', 'malware', 'breach', 'apt', 'vulnerability'],
	NUCLEAR: ['nuclear', 'icbm', 'warhead', 'nonproliferation', 'uranium', 'plutonium'],
	CONFLICT: ['war', 'military', 'troops', 'invasion', 'strike', 'missile', 'combat', 'offensive'],
	INTEL: ['intelligence', 'espionage', 'spy', 'cia', 'mossad', 'fsb', 'covert'],
	DEFENSE: ['pentagon', 'dod', 'defense', 'military', 'army', 'navy', 'air force'],
	DIPLO: ['diplomat', 'embassy', 'treaty', 'sanctions', 'talks', 'summit', 'bilateral'],
	ECON: [
		'economy',
		'economic',
		'inflation',
		'recession',
		'gdp',
		'interest rate',
		'fiscal',
		'currency',
		'central bank',
		'imf',
		'world bank',
		'unemployment'
	],
	ELECTIONS: [
		'election',
		'vote',
		'ballot',
		'candidate',
		'campaign',
		'runoff',
		'referendum',
		'incumbent',
		'polling'
	],
	UNREST: [
		'protest',
		'riot',
		'uprising',
		'unrest',
		'crackdown',
		'dissident',
		'revolt',
		'demonstration'
	],
	TRADE: [
		'tariff',
		'trade war',
		'embargo',
		'mercosur',
		'brics',
		'free trade',
		'export ban',
		'trade deal',
		'trade agreement'
	],
	ENERGY: [
		'oil',
		'pipeline',
		'opec',
		'petroleum',
		'mining',
		'lithium',
		'renewable',
		'natural gas',
		'energy crisis'
	]
};

interface CompiledKeyword {
	keyword: string;
	pattern: RegExp;
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildKeywordPattern(keyword: string): RegExp {
	const normalized = keyword.trim();
	const escaped = escapeRegex(normalized).replace(/\s+/g, '\\s+');
	const boundary = '[\\p{L}\\p{N}_]';
	return new RegExp(`(?<!${boundary})${escaped}(?!${boundary})`, 'iu');
}

function compileKeywords(keywords: readonly string[]): CompiledKeyword[] {
	return keywords.map((keyword) => ({
		keyword,
		pattern: buildKeywordPattern(keyword)
	}));
}

const COMPILED_ALERT_KEYWORDS = compileKeywords(ALERT_KEYWORDS);
const COMPILED_REGION_KEYWORDS = Object.fromEntries(
	Object.entries(REGION_KEYWORDS).map(([region, keywords]) => [region, compileKeywords(keywords)])
) as Record<string, CompiledKeyword[]>;
const COMPILED_TOPIC_KEYWORDS = Object.fromEntries(
	Object.entries(TOPIC_KEYWORDS).map(([topic, keywords]) => [topic, compileKeywords(keywords)])
) as Record<string, CompiledKeyword[]>;

/**
 * Check if a headline contains alert keywords
 */
export function containsAlertKeyword(text: string): { isAlert: boolean; keyword?: string } {
	for (const { keyword, pattern } of COMPILED_ALERT_KEYWORDS) {
		if (pattern.test(text)) {
			return { isAlert: true, keyword };
		}
	}
	return { isAlert: false };
}

/**
 * Detect region from text
 */
export function detectRegion(text: string): string | null {
	for (const [region, keywords] of Object.entries(COMPILED_REGION_KEYWORDS)) {
		if (keywords.some(({ pattern }) => pattern.test(text))) {
			return region;
		}
	}
	return null;
}

/**
 * Detect topics from text
 */
export function detectTopics(text: string): string[] {
	const detected: string[] = [];
	for (const [topic, keywords] of Object.entries(COMPILED_TOPIC_KEYWORDS)) {
		if (keywords.some(({ pattern }) => pattern.test(text))) {
			detected.push(topic);
		}
	}
	return detected;
}
