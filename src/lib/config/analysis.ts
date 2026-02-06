/**
 * Analysis configuration - correlation topics, narrative patterns, source classification
 */

export interface CorrelationTopic {
	id: string;
	patterns: RegExp[];
	category: string;
}

// Source credibility weights for weighted scoring
export const SOURCE_WEIGHTS: Record<string, number> = {
	// Tier 1: Major wire services (weight: 1.5)
	reuters: 1.5,
	ap: 1.5,
	afp: 1.5,

	// Tier 2: Major outlets (weight: 1.2)
	bbc: 1.2,
	nytimes: 1.2,
	wsj: 1.2,
	wapo: 1.2,
	guardian: 1.2,
	cnn: 1.2,
	ft: 1.2,
	economist: 1.2,

	// Tier 3: Standard outlets (weight: 1.0) - default
	// All unlisted sources get 1.0

	// Tier 4: Partisan/tabloid (weight: 0.7)
	breitbart: 0.7,
	dailymail: 0.7,
	nypost: 0.7,

	// Tier 5: Fringe (weight: 0.4)
	zerohedge: 0.4,
	infowars: 0.4,
	naturalnews: 0.4
};

export function getSourceWeight(source: string): number {
	const normalized = source.toLowerCase().replace(/[^a-z]/g, '');
	for (const [key, weight] of Object.entries(SOURCE_WEIGHTS)) {
		if (normalized.includes(key)) return weight;
	}
	return 1.0; // Default weight
}

// Compound patterns for cross-topic correlation detection
export interface CompoundPattern {
	id: string;
	topics: string[]; // Topic IDs that must co-occur
	minTopics: number; // Minimum topics required (default: all)
	name: string;
	prediction: string;
	boostFactor: number; // Score multiplier when detected
}

export const COMPOUND_PATTERNS: CompoundPattern[] = [
	{
		id: 'trade-war-escalation',
		topics: ['tariffs', 'china-tensions'],
		minTopics: 2,
		name: 'Trade War Escalation',
		prediction: 'Expect market volatility and supply chain disruption',
		boostFactor: 1.5
	},
	{
		id: 'stagflation-risk',
		topics: ['inflation', 'fed-rates', 'layoffs'],
		minTopics: 2,
		name: 'Stagflation Risk',
		prediction: 'Economic headwinds combining - defensive positioning advised',
		boostFactor: 1.8
	},
	{
		id: 'geopolitical-crisis',
		topics: ['russia-ukraine', 'israel-gaza', 'china-tensions'],
		minTopics: 2,
		name: 'Multi-Front Geopolitical Crisis',
		prediction: 'Multiple conflict zones active - risk-off sentiment likely',
		boostFactor: 2.0
	},
	{
		id: 'tech-regulatory-storm',
		topics: ['ai-regulation', 'big-tech', 'crypto'],
		minTopics: 2,
		name: 'Tech Regulatory Storm',
		prediction: 'Coordinated regulatory action may impact tech sector',
		boostFactor: 1.4
	},
	{
		id: 'financial-stress',
		topics: ['bank-crisis', 'fed-rates', 'housing'],
		minTopics: 2,
		name: 'Financial Sector Stress',
		prediction: 'Banking sector under pressure - monitor closely',
		boostFactor: 1.7
	},

	// Geopolitical/Security
	{
		id: 'nuclear-escalation',
		topics: ['russia-ukraine', 'iran', 'nuclear'],
		minTopics: 2,
		name: 'Nuclear Escalation',
		prediction: 'Heightened nuclear rhetoric - extreme risk-off likely',
		boostFactor: 2.5
	},
	{
		id: 'middle-east-escalation',
		topics: ['israel-gaza', 'iran'],
		minTopics: 2,
		name: 'Middle East Escalation',
		prediction: 'Regional conflict expansion risk',
		boostFactor: 1.8
	},
	{
		id: 'energy-supply-shock',
		topics: ['russia-ukraine', 'iran', 'supply-chain'],
		minTopics: 2,
		name: 'Energy Supply Shock',
		prediction: 'Energy price spikes and supply disruption expected',
		boostFactor: 1.7
	},

	// Economic
	{
		id: 'recession-signal',
		topics: ['layoffs', 'housing', 'fed-rates'],
		minTopics: 2,
		name: 'Recession Signal',
		prediction: 'Classic recession indicators aligning',
		boostFactor: 1.9
	},
	{
		id: 'inflation-spiral',
		topics: ['inflation', 'supply-chain', 'climate'],
		minTopics: 2,
		name: 'Inflation Spiral',
		prediction: 'Multiple inflation drivers converging',
		boostFactor: 1.6
	},
	{
		id: 'dollar-stress',
		topics: ['fed-rates', 'crypto', 'china-tensions'],
		minTopics: 2,
		name: 'Dollar Stress',
		prediction: 'Currency instability concerns rising',
		boostFactor: 1.5
	},

	// Tech/AI
	{
		id: 'ai-disruption-wave',
		topics: ['ai-regulation', 'layoffs', 'big-tech'],
		minTopics: 2,
		name: 'AI Disruption Wave',
		prediction: 'AI-driven workforce disruption accelerating',
		boostFactor: 1.6
	},
	{
		id: 'disinfo-storm',
		topics: ['deepfake', 'election', 'ai-regulation'],
		minTopics: 2,
		name: 'Disinfo Storm',
		prediction: 'AI-generated misinformation concerns surging',
		boostFactor: 1.7
	},

	// Crisis Combinations
	{
		id: 'pandemic-redux',
		topics: ['pandemic', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Pandemic Redux',
		prediction: 'Health crisis with economic spillover',
		boostFactor: 2.0
	},
	{
		id: 'climate-shock',
		topics: ['climate', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Climate Shock',
		prediction: 'Weather events disrupting economy',
		boostFactor: 1.6
	},
	{
		id: 'social-pressure',
		topics: ['inflation', 'layoffs', 'immigration', 'election'],
		minTopics: 3,
		name: 'Social Pressure',
		prediction: 'Economic stress combining with political flashpoints',
		boostFactor: 1.8
	}
];

export interface NarrativePattern {
	id: string;
	keywords: string[];
	category: string;
	severity: 'watch' | 'emerging' | 'spreading' | 'disinfo';
}

export interface SourceTypes {
	fringe: string[];
	alternative: string[];
	mainstream: string[];
}

export const CORRELATION_TOPICS: CorrelationTopic[] = [
	{
		id: 'tariffs',
		patterns: [/tariff/i, /trade war/i, /import tax/i, /customs duty/i],
		category: 'Economy'
	},
	{
		id: 'fed-rates',
		patterns: [/federal reserve/i, /interest rate/i, /rate cut/i, /rate hike/i, /powell/i, /fomc/i],
		category: 'Economy'
	},
	{
		id: 'inflation',
		patterns: [/inflation/i, /cpi/i, /consumer price/i, /cost of living/i],
		category: 'Economy'
	},
	{
		id: 'ai-regulation',
		patterns: [/ai regulation/i, /artificial intelligence.*law/i, /ai safety/i, /ai governance/i],
		category: 'Tech'
	},
	{
		id: 'china-tensions',
		patterns: [/china.*taiwan/i, /south china sea/i, /us.*china/i, /beijing.*washington/i],
		category: 'Geopolitics'
	},
	{
		id: 'russia-ukraine',
		patterns: [/ukraine/i, /zelensky/i, /putin.*war/i, /crimea/i, /donbas/i],
		category: 'Conflict'
	},
	{
		id: 'israel-gaza',
		patterns: [/gaza/i, /hamas/i, /netanyahu/i, /israel.*attack/i, /hostage/i],
		category: 'Conflict'
	},
	{
		id: 'iran',
		patterns: [/iran.*nuclear/i, /tehran/i, /ayatollah/i, /iranian.*strike/i],
		category: 'Geopolitics'
	},
	{
		id: 'crypto',
		patterns: [/bitcoin/i, /crypto.*regulation/i, /ethereum/i, /sec.*crypto/i],
		category: 'Finance'
	},
	{
		id: 'housing',
		patterns: [/housing market/i, /mortgage rate/i, /home price/i, /real estate.*crash/i],
		category: 'Economy'
	},
	{
		id: 'layoffs',
		patterns: [/layoff/i, /job cut/i, /workforce reduction/i, /downsizing/i],
		category: 'Business'
	},
	{
		id: 'bank-crisis',
		patterns: [/bank.*fail/i, /banking crisis/i, /fdic/i, /bank run/i],
		category: 'Finance'
	},
	{
		id: 'election',
		patterns: [/election/i, /polling/i, /campaign/i, /ballot/i, /voter/i],
		category: 'Politics'
	},
	{
		id: 'immigration',
		patterns: [/immigration/i, /border.*crisis/i, /migrant/i, /deportation/i, /asylum/i],
		category: 'Politics'
	},
	{
		id: 'climate',
		patterns: [/climate change/i, /wildfire/i, /hurricane/i, /extreme weather/i, /flood/i],
		category: 'Environment'
	},
	{
		id: 'pandemic',
		patterns: [/pandemic/i, /outbreak/i, /virus.*spread/i, /who.*emergency/i, /bird flu/i],
		category: 'Health'
	},
	{
		id: 'nuclear',
		patterns: [/nuclear.*threat/i, /nuclear weapon/i, /atomic/i, /icbm/i],
		category: 'Security'
	},
	{
		id: 'supply-chain',
		patterns: [/supply chain/i, /shipping.*delay/i, /port.*congestion/i, /logistics.*crisis/i],
		category: 'Economy'
	},
	{
		id: 'big-tech',
		patterns: [/antitrust.*tech/i, /google.*monopoly/i, /meta.*lawsuit/i, /apple.*doj/i],
		category: 'Tech'
	},
	{
		id: 'deepfake',
		patterns: [/deepfake/i, /ai.*misinformation/i, /synthetic media/i],
		category: 'Tech'
	}
];

export const NARRATIVE_PATTERNS: NarrativePattern[] = [
	{
		id: 'deep-state',
		keywords: ['deep state', 'shadow government', 'permanent state'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'cbdc-control',
		keywords: ['cbdc control', 'digital currency surveillance', 'social credit'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'wef-agenda',
		keywords: ['great reset', 'wef agenda', 'world economic forum plot'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'bio-weapon',
		keywords: ['lab leak', 'bioweapon', 'gain of function'],
		category: 'Health',
		severity: 'emerging'
	},
	{
		id: 'election-fraud',
		keywords: ['election fraud', 'rigged election', 'stolen election', 'mail ballot fraud'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'ai-doom',
		keywords: ['ai doom', 'ai extinction', 'superintelligence risk', 'agi danger'],
		category: 'Tech',
		severity: 'emerging'
	},
	{
		id: 'ai-consciousness',
		keywords: ['ai sentient', 'ai conscious', 'ai feelings', 'ai alive'],
		category: 'Tech',
		severity: 'emerging'
	},
	{
		id: 'robot-replacement',
		keywords: ['robots replacing', 'automation unemployment', 'job automation'],
		category: 'Economy',
		severity: 'spreading'
	},
	{
		id: 'china-invasion',
		keywords: ['china taiwan invasion', 'china war', 'south china sea conflict'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'nato-expansion',
		keywords: ['nato provocation', 'nato aggression', 'nato encirclement'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'dollar-collapse',
		keywords: ['dollar collapse', 'dedollarization', 'brics currency', 'petrodollar death'],
		category: 'Finance',
		severity: 'spreading'
	},
	{
		id: 'vaccine-injury',
		keywords: ['vaccine injury', 'vaccine side effect', 'vaccine death', 'turbo cancer'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'next-pandemic',
		keywords: ['next pandemic', 'disease x', 'bird flu pandemic'],
		category: 'Health',
		severity: 'emerging'
	},
	{
		id: 'depopulation',
		keywords: ['depopulation agenda', 'fertility crisis', 'population control'],
		category: 'Society',
		severity: 'disinfo'
	},
	{
		id: 'food-crisis',
		keywords: ['food shortage', 'engineered famine', 'food supply attack'],
		category: 'Economy',
		severity: 'emerging'
	},
	{
		id: 'energy-war',
		keywords: ['energy crisis manufactured', 'green agenda', 'energy shortage'],
		category: 'Economy',
		severity: 'spreading'
	}
];

// Mainstream narrative patterns with regex for better matching
export interface MainstreamNarrativePattern {
	id: string;
	name: string;
	patterns: RegExp[];
	category: string;
	region?: 'global' | 'brazil' | 'latam' | 'mena';
}

export const MAINSTREAM_NARRATIVE_PATTERNS: MainstreamNarrativePattern[] = [
	// === GLOBAL ECONOMIC ===
	{
		id: 'soft-landing',
		name: 'Soft Landing',
		patterns: [/soft landing/i, /goldilocks/i, /soft[\s-]?landing/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'recession-fears',
		name: 'Recession Fears',
		patterns: [/recession.{0,20}(risk|fear|warn|loom|threat)/i, /fear.{0,10}recession/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'rate-pivot',
		name: 'Fed Pivot',
		patterns: [/rate cut/i, /fed pivot/i, /dovish/i, /hawkish/i, /fed.{0,10}(pause|hold)/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'china-decoupling',
		name: 'China Decoupling',
		patterns: [/decouple/i, /chip ban/i, /tech war/i, /decoupling/i, /china.{0,20}restrict/i],
		category: 'Geopolitics',
		region: 'global'
	},

	// === TECH/AI ===
	{
		id: 'ai-hype',
		name: 'AI Hype Cycle',
		patterns: [
			/ai revolution/i,
			/generative ai/i,
			/ai boom/i,
			/ai gold rush/i,
			/chatgpt/i,
			/ai transform/i
		],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'ai-regulation',
		name: 'AI Regulation Push',
		patterns: [/ai.{0,20}(regulation|law|ban|rule|govern)/i, /regulat.{0,10}ai/i, /ai act/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'tech-layoffs',
		name: 'Tech Layoffs Wave',
		patterns: [/layoff/i, /job cut/i, /workforce reduction/i, /downsiz/i, /let go.{0,10}employee/i],
		category: 'Business',
		region: 'global'
	},

	// === POLITICAL ===
	{
		id: 'election-coverage',
		name: 'Election Coverage',
		patterns: [/election/i, /campaign/i, /polling/i, /ballot/i, /candidate/i, /vote.{0,5}count/i],
		category: 'Politics',
		region: 'global'
	},

	// === BRAZIL ===
	{
		id: 'lula-government',
		name: 'Lula Government',
		patterns: [/lula/i, /planalto/i, /pt.{0,10}governo/i, /governo federal/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'bolsonaro-factor',
		name: 'Bolsonaro Factor',
		patterns: [/bolsonaro/i, /jan(eiro)?\s*8/i, /8 de janeiro/i, /inelegib/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'selic-rates',
		name: 'Selic Policy',
		patterns: [/selic/i, /banco central/i, /copom/i, /taxa de juros/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'real-pressure',
		name: 'Real Currency',
		patterns: [/dolar.{0,10}real/i, /cambio/i, /desvaloriza/i, /real.{0,10}dolar/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'fiscal-framework',
		name: 'Fiscal Framework',
		patterns: [/arcabou[cç]o fiscal/i, /teto de gastos/i, /meta fiscal/i, /d[ée]ficit/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'amazon-watch',
		name: 'Amazon Watch',
		patterns: [/amaz[oô]nia/i, /desmatamento/i, /ibama/i, /floresta/i, /queimada/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brics-brazil',
		name: 'BRICS Brazil',
		patterns: [/brics/i, /c[úu]pula/i, /sul.{0,5}sul/i, /novo banco/i],
		category: 'Geopolitics',
		region: 'brazil'
	},
	{
		id: 'brazil-crime',
		name: 'Organized Crime',
		patterns: [/pcc/i, /fac[çc][ãa]o/i, /mil[ií]cia/i, /seguran[çc]a p[úu]blica/i, /crime organizado/i],
		category: 'Security',
		region: 'brazil'
	},
	{
		id: 'military-smear',
		name: 'Armed Forces Smear',
		patterns: [
			/ex[ée]rcito.{0,15}(ataque|cr[ií]tica|pol[eê]mica)/i,
			/for[çc]as armadas.{0,15}cr[ií]tica/i,
			/generais.{0,15}pol[eê]mic/i,
			/militares.{0,15}investigad/i
		],
		category: 'Politics',
		region: 'brazil'
	},

	// === LATIN AMERICA ===
	{
		id: 'argentina-milei',
		name: 'Milei Argentina',
		patterns: [/milei/i, /argentina.{0,15}econom/i, /peso argentino/i, /libertad avanza/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'argentina-crisis',
		name: 'Argentina Crisis',
		patterns: [/inflaci[oó]n argentina/i, /crisis argentina/i, /fmi.{0,10}argentina/i, /cepo/i],
		category: 'Economy',
		region: 'latam'
	},
	{
		id: 'mexico-amlo',
		name: 'AMLO/Sheinbaum',
		patterns: [/amlo/i, /sheinbaum/i, /morena/i, /mexico.{0,10}gobierno/i, /lópez obrador/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'mexico-cartel',
		name: 'Mexico Cartel Violence',
		patterns: [/cartel/i, /narco/i, /sinaloa/i, /violencia.{0,10}mexico/i, /cjng/i],
		category: 'Security',
		region: 'latam'
	},
	{
		id: 'venezuela-crisis',
		name: 'Venezuela Crisis',
		patterns: [/maduro/i, /venezuela.{0,15}crisis/i, /oposici[oó]n venezolana/i, /guaid[oó]/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'latam-china',
		name: 'China in LatAm',
		patterns: [
			/china.{0,15}am[eé]rica latina/i,
			/inversi[oó]n china/i,
			/belt and road.{0,10}latam/i,
			/china.{0,10}infraestruct/i
		],
		category: 'Geopolitics',
		region: 'latam'
	},
	{
		id: 'latam-us',
		name: 'US-LatAm Relations',
		patterns: [
			/estados unidos.{0,15}am[eé]rica latina/i,
			/washington.{0,10}regi[oó]n/i,
			/us.{0,10}latin america/i
		],
		category: 'Geopolitics',
		region: 'latam'
	}
];

export const SOURCE_TYPES: SourceTypes = {
	fringe: [
		'zerohedge',
		'infowars',
		'naturalnews',
		'gateway',
		'breitbart',
		'epoch',
		'revolver',
		'dailycaller'
	],
	alternative: ['substack', 'rumble', 'bitchute', 'telegram', 'gab', 'gettr', 'truth social'],
	mainstream: [
		// Wire services
		'reuters',
		'ap news',
		'afp',
		// Major international
		'bbc',
		'cnn',
		'nytimes',
		'wsj',
		'wapo',
		'guardian',
		'abc',
		'nbc',
		'cbs',
		'fox',
		'al jazeera',
		'economist',
		'npr',
		// Business/Finance
		'bloomberg',
		'cnbc',
		'marketwatch',
		'financial times',
		'ft.com',
		'yahoo finance',
		'investing.com',
		// Politics
		'politico',
		'foreign affairs',
		'foreign policy',
		// Tech
		'hacker news',
		'ars technica',
		'verge',
		'mit tech',
		'openai',
		'arxiv',
		// Intel/Defense
		'defense one',
		'breaking defense',
		'war on the rocks',
		'defense news',
		'war zone',
		'realcleardefense',
		'csis',
		'bellingcat',
		'chatham house',
		'iiss',
		'military.com',
		'cfr',
		'brookings',
		'diplomat',
		'al-monitor',
		// Brazil
		'g1',
		'globo',
		'folha',
		'cnn brasil',
		'gazeta do povo',
		'poder360',
		'agencia brasil',
		'infomoney',
		'valor',
		'defesanet',
		'zona militar',
		// Latin America
		'americas quarterly',
		'el pais',
		'infobae',
		'caracas chronicles',
		'el nacional',
		'venezuelanalysis',
		// Middle East
		'tehran times',
		'radio farda',
		'mehr news',
		'isna',
		'ifp news',
		'iranwire',
		// Arctic
		'arctic today',
		'high north news',
		'arctic institute',
		'arctic council'
	]
};

// Main character patterns for tracking prominent figures
export interface PersonPattern {
	pattern: RegExp;
	name: string;
}

export const PERSON_PATTERNS: PersonPattern[] = [
	{ pattern: /\btrump\b/gi, name: 'Trump' },
	{ pattern: /\bbiden\b/gi, name: 'Biden' },
	{ pattern: /\belon\b|\bmusk\b/gi, name: 'Elon Musk' },
	{ pattern: /\bputin\b/gi, name: 'Putin' },
	{ pattern: /\bzelensky\b/gi, name: 'Zelensky' },
	{ pattern: /\bxi\s*jinping\b|\bxi\b/gi, name: 'Xi Jinping' },
	{ pattern: /\bnetanyahu\b/gi, name: 'Netanyahu' },
	{ pattern: /\bsam\s*altman\b/gi, name: 'Sam Altman' },
	{ pattern: /\bmark\s*zuckerberg\b|\bzuckerberg\b/gi, name: 'Zuckerberg' },
	{ pattern: /\bjeff\s*bezos\b|\bbezos\b/gi, name: 'Bezos' },
	{ pattern: /\btim\s*cook\b/gi, name: 'Tim Cook' },
	{ pattern: /\bsatya\s*nadella\b|\bnadella\b/gi, name: 'Satya Nadella' },
	{ pattern: /\bsundar\s*pichai\b|\bpichai\b/gi, name: 'Sundar Pichai' },
	{ pattern: /\bwarren\s*buffett\b|\bbuffett\b/gi, name: 'Warren Buffett' },
	{ pattern: /\bjanet\s*yellen\b|\byellen\b/gi, name: 'Janet Yellen' },
	{ pattern: /\bjerome\s*powell\b|\bpowell\b/gi, name: 'Jerome Powell' },
	{ pattern: /\bkamala\s*harris\b|\bharris\b/gi, name: 'Kamala Harris' },
	{ pattern: /\bnancy\s*pelosi\b|\bpelosi\b/gi, name: 'Nancy Pelosi' },
	{ pattern: /\bjensen\s*huang\b|\bhuang\b/gi, name: 'Jensen Huang' },
	{ pattern: /\bdario\s*amodei\b|\bamodei\b/gi, name: 'Dario Amodei' }
];
