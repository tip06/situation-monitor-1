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

/**
 * Check if a headline contains alert keywords
 */
export function containsAlertKeyword(text: string): { isAlert: boolean; keyword?: string } {
	const lowerText = text.toLowerCase();
	for (const keyword of ALERT_KEYWORDS) {
		if (lowerText.includes(keyword)) {
			return { isAlert: true, keyword };
		}
	}
	return { isAlert: false };
}

/**
 * Detect region from text
 */
export function detectRegion(text: string): string | null {
	const lowerText = text.toLowerCase();
	for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
		if (keywords.some((k) => lowerText.includes(k))) {
			return region;
		}
	}
	return null;
}

/**
 * Detect topics from text
 */
export function detectTopics(text: string): string[] {
	const lowerText = text.toLowerCase();
	const detected: string[] = [];
	for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
		if (keywords.some((k) => lowerText.includes(k))) {
			detected.push(topic);
		}
	}
	return detected;
}
