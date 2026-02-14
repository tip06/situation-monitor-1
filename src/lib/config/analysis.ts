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
		topics: ['tariffs', 'china-tensions', 'supply-chain'],
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
	},

	// === NEW COMPOUND SIGNALS ===

	// Cyber & Geopolitical
	{
		id: 'cyber-warfare-escalation',
		topics: ['state-hacking', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Cyber Warfare Escalation',
		prediction: 'State-sponsored cyber operations intensifying',
		boostFactor: 2.0
	},
	{
		id: 'critical-infra-attack',
		topics: ['cyberattack', 'energy-transition', 'supply-chain'],
		minTopics: 2,
		name: 'Critical Infrastructure Attack',
		prediction: 'Infrastructure vulnerability exposure rising',
		boostFactor: 2.2
	},
	{
		id: 'cyber-financial-attack',
		topics: ['cyberattack', 'bank-crisis', 'credit-stress'],
		minTopics: 2,
		name: 'Cyber-Financial Attack',
		prediction: 'Financial system cyber vulnerability detected',
		boostFactor: 2.0
	},

	// Energy & Geopolitical
	{
		id: 'energy-weaponization',
		topics: ['oil-opec', 'sanctions', 'russia-ukraine'],
		minTopics: 2,
		name: 'Energy Weaponization',
		prediction: 'Energy used as geopolitical leverage — price volatility expected',
		boostFactor: 1.8
	},
	{
		id: 'resource-war',
		topics: ['rare-earths', 'china-tensions', 'sanctions'],
		minTopics: 2,
		name: 'Resource War',
		prediction: 'Critical mineral supply under geopolitical pressure',
		boostFactor: 1.7
	},
	{
		id: 'green-transition-shock',
		topics: ['energy-transition', 'rare-earths', 'china-tensions'],
		minTopics: 2,
		name: 'Green Transition Shock',
		prediction: 'Energy transition supply chain bottleneck forming',
		boostFactor: 1.5
	},

	// Food & Climate
	{
		id: 'food-crisis-spiral',
		topics: ['food-security', 'extreme-weather', 'supply-chain'],
		minTopics: 2,
		name: 'Food Crisis Spiral',
		prediction: 'Climate-driven food supply disruption accelerating',
		boostFactor: 1.8
	},
	{
		id: 'climate-migration',
		topics: ['extreme-weather', 'refugee-crisis', 'civil-unrest'],
		minTopics: 2,
		name: 'Climate Migration Pressure',
		prediction: 'Climate displacement triggering social instability',
		boostFactor: 1.7
	},
	{
		id: 'agricultural-collapse',
		topics: ['agriculture', 'extreme-weather', 'inflation'],
		minTopics: 2,
		name: 'Agricultural Collapse Signal',
		prediction: 'Crop failures feeding inflation pipeline',
		boostFactor: 1.6
	},

	// Financial & Fiscal
	{
		id: 'sovereign-debt-crisis',
		topics: ['sovereign-debt', 'fed-rates', 'credit-stress'],
		minTopics: 2,
		name: 'Sovereign Debt Crisis',
		prediction: 'Government debt sustainability in question',
		boostFactor: 2.0
	},
	{
		id: 'credit-contagion',
		topics: ['credit-stress', 'bank-crisis', 'housing'],
		minTopics: 2,
		name: 'Credit Contagion',
		prediction: 'Credit stress spreading across sectors',
		boostFactor: 1.9
	},
	{
		id: 'dedollarization-signal',
		topics: ['trade-blocs', 'sanctions', 'crypto'],
		minTopics: 2,
		name: 'Dedollarization Signal',
		prediction: 'Alternative payment systems gaining traction',
		boostFactor: 1.6
	},

	// Social & Political
	{
		id: 'social-tinderbox',
		topics: ['civil-unrest', 'inflation', 'layoffs'],
		minTopics: 2,
		name: 'Social Tinderbox',
		prediction: 'Economic pain fueling civil unrest risk',
		boostFactor: 1.9
	},
	{
		id: 'democratic-stress',
		topics: ['election', 'political-violence', 'civil-unrest'],
		minTopics: 2,
		name: 'Democratic Stress',
		prediction: 'Political institutions under pressure',
		boostFactor: 1.8
	},
	{
		id: 'global-protest-wave',
		topics: ['civil-unrest', 'food-security', 'inflation'],
		minTopics: 2,
		name: 'Global Protest Wave',
		prediction: 'Cost-of-living protests spreading',
		boostFactor: 1.7
	},

	// Military & Escalation
	{
		id: 'arms-race-acceleration',
		topics: ['arms-race', 'nato-defense', 'russia-ukraine'],
		minTopics: 2,
		name: 'Arms Race Acceleration',
		prediction: 'Military spending and procurement surging',
		boostFactor: 1.7
	},
	{
		id: 'multi-domain-conflict',
		topics: ['cyberattack', 'space-military', 'arms-race'],
		minTopics: 2,
		name: 'Multi-Domain Conflict',
		prediction: 'Warfare expanding across cyber, space, and conventional domains',
		boostFactor: 2.3
	},
	{
		id: 'escalation-ladder',
		topics: ['nuclear', 'arms-race', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Escalation Ladder',
		prediction: 'Conflict intensity climbing across theaters',
		boostFactor: 2.5
	},

	// Cross-Domain Red Alert
	{
		id: 'systemic-fragility',
		topics: ['sovereign-debt', 'supply-chain', 'cyberattack', 'extreme-weather'],
		minTopics: 3,
		name: 'Systemic Fragility',
		prediction: 'Multiple system stress points converging — cascading failure risk',
		boostFactor: 2.5
	},
	{
		id: 'polycrisis',
		topics: ['civil-unrest', 'food-security', 'inflation', 'extreme-weather', 'refugee-crisis'],
		minTopics: 3,
		name: 'Polycrisis',
		prediction: 'Simultaneous crises reinforcing each other — monitor all fronts',
		boostFactor: 3.0
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
	},

	// === NEW DOMAINS ===

	// Cyber & InfoSec
	{
		id: 'cyberattack',
		patterns: [/cyberattack/i, /cyber attack/i, /data breach/i, /ransomware/i, /hacking/i, /zero.day/i],
		category: 'Security'
	},
	{
		id: 'state-hacking',
		patterns: [/state.sponsored/i, /\bapt\b/i, /cyber espionage/i, /cyber warfare/i],
		category: 'Security'
	},

	// Space & Satellites
	{
		id: 'space-military',
		patterns: [/space force/i, /satellite weapon/i, /anti.satellite/i, /space militariz/i, /orbital weapon/i],
		category: 'Security'
	},
	{
		id: 'space-race',
		patterns: [/space launch/i, /spacex/i, /moon mission/i, /mars mission/i, /space station/i],
		category: 'Tech'
	},

	// Energy & Resources
	{
		id: 'energy-transition',
		patterns: [/renewable energy/i, /\bsolar\b.*power/i, /wind power/i, /green energy/i, /clean energy/i, /energy transition/i],
		category: 'Environment'
	},
	{
		id: 'rare-earths',
		patterns: [/rare earth/i, /lithium/i, /cobalt/i, /critical mineral/i, /semiconductor supply/i],
		category: 'Economy'
	},
	{
		id: 'oil-opec',
		patterns: [/\bopec\b/i, /oil price/i, /oil production/i, /crude oil/i, /petroleum/i, /oil cut/i],
		category: 'Economy'
	},

	// Sanctions & Economic Warfare
	{
		id: 'sanctions',
		patterns: [/\bsanction/i, /swift ban/i, /asset freeze/i, /export control/i, /trade restriction/i, /\bembargo\b/i],
		category: 'Geopolitics'
	},
	{
		id: 'trade-blocs',
		patterns: [/\bbrics\b/i, /g7 summit/i, /\bg20\b/i, /trade agreement/i, /trade bloc/i, /economic alliance/i],
		category: 'Geopolitics'
	},

	// Food & Agriculture
	{
		id: 'food-security',
		patterns: [/food crisis/i, /crop failure/i, /grain export/i, /food price/i, /\bfamine\b/i, /food shortage/i],
		category: 'Economy'
	},
	{
		id: 'agriculture',
		patterns: [/fertilizer/i, /\bdrought\b/i, /\bharvest\b/i, /agriculture/i, /farming crisis/i],
		category: 'Environment'
	},

	// Debt & Fiscal
	{
		id: 'sovereign-debt',
		patterns: [/national debt/i, /debt ceiling/i, /fiscal deficit/i, /credit rating/i, /bond yield/i, /\btreasury\b/i],
		category: 'Economy'
	},
	{
		id: 'credit-stress',
		patterns: [/credit crunch/i, /default risk/i, /junk bond/i, /high yield/i, /credit spread/i],
		category: 'Finance'
	},

	// Social Unrest
	{
		id: 'civil-unrest',
		patterns: [/\bprotest/i, /\briot/i, /civil unrest/i, /demonstration/i, /\bstrike\b/i, /\buprising\b/i],
		category: 'Politics'
	},
	{
		id: 'political-violence',
		patterns: [/assassination/i, /political violence/i, /insurrection/i, /\bcoup\b/i, /\bextremism\b/i, /domestic terror/i],
		category: 'Security'
	},

	// Biotech & Health
	{
		id: 'biotech',
		patterns: [/gene therapy/i, /\bcrispr\b/i, /biotech breakthrough/i, /drug approval/i, /fda approval/i],
		category: 'Health'
	},
	{
		id: 'antimicrobial',
		patterns: [/antibiotic resistance/i, /superbug/i, /antimicrobial/i, /drug.resistant/i],
		category: 'Health'
	},

	// Migration & Demographics
	{
		id: 'refugee-crisis',
		patterns: [/\brefugee/i, /\bdisplaced\b/i, /humanitarian crisis/i, /refugee camp/i, /migration crisis/i],
		category: 'Politics'
	},
	{
		id: 'demographics',
		patterns: [/aging population/i, /birth rate/i, /fertility rate/i, /population decline/i, /brain drain/i],
		category: 'Economy'
	},

	// Military & Defense
	{
		id: 'arms-race',
		patterns: [/arms deal/i, /weapons sale/i, /military buildup/i, /defense spending/i, /arms race/i, /conscription/i],
		category: 'Security'
	},
	{
		id: 'nato-defense',
		patterns: [/nato spending/i, /nato expansion/i, /european defense/i, /military alliance/i, /collective defense/i],
		category: 'Geopolitics'
	},

	// Extreme Climate
	{
		id: 'extreme-weather',
		patterns: [/extreme weather/i, /heat wave/i, /polar vortex/i, /\btornado\b/i, /\btyphoon\b/i, /\bcyclone\b/i, /ice storm/i, /record temperature/i, /climate emergency/i, /weather disaster/i],
		category: 'Environment'
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
	},
	// === NEW FRINGE NARRATIVES ===
	{
		id: 'grid-collapse',
		keywords: ['grid collapse', 'power grid attack', 'blackout agenda', 'emp attack'],
		category: 'Economy',
		severity: 'emerging'
	},
	{
		id: 'water-wars',
		keywords: ['water privatization', 'water crisis engineered', 'water shortage agenda'],
		category: 'Economy',
		severity: 'watch'
	},
	{
		id: 'lab-grown-food',
		keywords: ['lab grown meat danger', 'fake food', 'synthetic food agenda', 'bug diet'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'weather-manipulation',
		keywords: ['weather weapon', 'haarp', 'geoengineering', 'chemtrail', 'weather control'],
		category: 'Environment',
		severity: 'disinfo'
	},
	{
		id: '15-minute-city',
		keywords: ['15 minute city', 'climate lockdown', 'movement restriction', 'open air prison'],
		category: 'Society',
		severity: 'spreading'
	},
	{
		id: 'digital-id-control',
		keywords: ['digital id', 'digital passport', 'biometric control', 'surveillance state'],
		category: 'Society',
		severity: 'watch'
	},
	{
		id: 'bank-bail-in',
		keywords: ['bail in', 'bank confiscation', 'savings seizure', 'bank theft'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'ai-takeover',
		keywords: ['ai takeover', 'ai control', 'ai overlord', 'machine uprising', 'skynet'],
		category: 'Tech',
		severity: 'watch'
	},
	{
		id: 'space-hoax',
		keywords: ['space fake', 'moon landing hoax', 'flat earth', 'nasa lie'],
		category: 'Tech',
		severity: 'disinfo'
	},
	{
		id: 'cyber-false-flag',
		keywords: ['cyber false flag', 'staged cyberattack', 'internet kill switch'],
		category: 'Security',
		severity: 'watch'
	},
	{
		id: 'demographic-replacement',
		keywords: ['great replacement', 'replacement migration', 'demographic engineering'],
		category: 'Society',
		severity: 'disinfo'
	},
	{
		id: 'pharma-conspiracy',
		keywords: ['big pharma conspiracy', 'suppressed cure', 'medical coverup'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'controlled-demolition',
		keywords: ['controlled demolition economy', 'planned collapse', 'intentional crash'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'sovereignty-erosion',
		keywords: ['sovereignty erosion', 'who treaty', 'un takeover', 'global governance'],
		category: 'Political',
		severity: 'emerging'
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

	// === NEW GLOBAL — Geopolitics & Security ===
	{
		id: 'new-cold-war',
		name: 'New Cold War',
		patterns: [/new cold war/i, /great power competition/i, /bloc rivalry/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'taiwan-contingency',
		name: 'Taiwan Contingency',
		patterns: [/taiwan strait/i, /taiwan invasion/i, /taiwan contingency/i, /cross.strait/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'arctic-competition',
		name: 'Arctic Competition',
		patterns: [/arctic race/i, /arctic military/i, /northern sea route/i, /arctic resource/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'nuclear-posture',
		name: 'Nuclear Posture',
		patterns: [/nuclear deterrent/i, /nuclear moderniz/i, /nuclear treaty/i, /arms control/i],
		category: 'Security',
		region: 'global'
	},
	{
		id: 'cyber-threat-landscape',
		name: 'Cyber Threat Landscape',
		patterns: [/cyber threat/i, /ransomware wave/i, /state hacker/i, /cyber defense/i],
		category: 'Security',
		region: 'global'
	},

	// === NEW GLOBAL — Economy & Finance ===
	{
		id: 'debt-spiral',
		name: 'Debt Spiral',
		patterns: [/debt ceiling/i, /fiscal crisis/i, /national debt/i, /credit downgrade/i, /bond sell.off/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'de-globalization',
		name: 'De-Globalization',
		patterns: [/reshoring/i, /nearshoring/i, /friend.shoring/i, /onshoring/i, /supply chain diversif/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'crypto-regulation',
		name: 'Crypto Regulation',
		patterns: [/crypto regulat/i, /stablecoin law/i, /defi regulat/i, /sec.*crypto/i],
		category: 'Finance',
		region: 'global'
	},
	{
		id: 'commodity-super-cycle',
		name: 'Commodity Super Cycle',
		patterns: [/commodity boom/i, /super cycle/i, /commodity rally/i, /resource nationalism/i],
		category: 'Economy',
		region: 'global'
	},

	// === NEW GLOBAL — Climate & Energy ===
	{
		id: 'energy-security',
		name: 'Energy Security',
		patterns: [/energy security/i, /energy independence/i, /energy crisis/i, /grid resilience/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'climate-tipping-point',
		name: 'Climate Tipping Point',
		patterns: [/tipping point/i, /point of no return/i, /climate emergency/i, /record heat/i, /record warm/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'extreme-weather-impact',
		name: 'Extreme Weather Impact',
		patterns: [/extreme weather/i, /unprecedented storm/i, /record flood/i, /climate disaster/i, /weather catastrophe/i],
		category: 'Environment',
		region: 'global'
	},

	// === NEW GLOBAL — Tech & Society ===
	{
		id: 'ai-arms-race',
		name: 'AI Arms Race',
		patterns: [/ai race/i, /ai competition/i, /ai supremacy/i, /ai dominance/i, /ai lead/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'social-media-regulation',
		name: 'Social Media Regulation',
		patterns: [/social media ban/i, /platform regulation/i, /content moderation/i, /section 230/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'space-race-narrative',
		name: 'Space Race',
		patterns: [/space race/i, /moon race/i, /mars race/i, /commercial space/i, /space economy/i],
		category: 'Tech',
		region: 'global'
	},

	// === GLOBAL — Partisan Framing ===
	{
		id: 'conservative-framing',
		name: 'Conservative Framing',
		patterns: [/\bwoke\b/i, /radical left/i, /socialist agenda/i, /government overreach/i, /nanny state/i, /war on freedom/i, /cancel culture/i, /leftist mob/i, /virtue signal/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'progressive-framing',
		name: 'Progressive Framing',
		patterns: [/far.right/i, /maga extremis/i, /threat to democracy/i, /white nationalis/i, /climate denier/i, /book ban/i, /assault on rights/i, /\bfascis/i, /\bauthoritarian/i],
		category: 'Politics',
		region: 'global'
	},

	// === GLOBAL — Frame Battles ===
	{
		id: 'immigration-security-frame',
		name: 'Immigration Security Frame',
		patterns: [/border crisis/i, /illegal crossing/i, /illegal alien/i, /border invasion/i, /cartel threat/i, /migrant crime/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'immigration-humanitarian-frame',
		name: 'Immigration Humanitarian Frame',
		patterns: [/asylum seeker/i, /refugee rights/i, /family separation/i, /\bdreamer/i, /undocumented worker/i, /humanitarian border/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'climate-urgency-frame',
		name: 'Climate Urgency Frame',
		patterns: [/climate emergency/i, /climate crisis/i, /existential threat/i, /planet burning/i, /code red/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'climate-skeptic-frame',
		name: 'Climate Skeptic Frame',
		patterns: [/climate hoax/i, /climate alarmis/i, /green scam/i, /climate hysteria/i, /climate grift/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'gun-rights-frame',
		name: 'Gun Rights Frame',
		patterns: [/second amendment/i, /gun rights/i, /right to bear/i, /gun freedom/i, /armed citizen/i, /self defense/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'gun-control-frame',
		name: 'Gun Control Frame',
		patterns: [/gun violence epidemic/i, /mass shooting/i, /gun reform/i, /gun safety/i, /ban assault/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'ai-optimist-frame',
		name: 'AI Optimist Frame',
		patterns: [/ai breakthrough/i, /ai revolution/i, /ai opportunity/i, /ai potential/i, /ai benefit/i, /ai progress/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'ai-alarmist-frame',
		name: 'AI Alarmist Frame',
		patterns: [/ai threat/i, /ai danger/i, /ai risk/i, /ai destroy/i, /ai replace/i, /ai out of control/i, /ai unsafe/i],
		category: 'Tech',
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

	// === NEW BRAZIL ===
	{
		id: 'brazil-cyber',
		name: 'Brazil Cyber Threats',
		patterns: [/ciberataque/i, /vazamento de dados/i, /hacker.*brasil/i, /seguran[çc]a digital/i],
		category: 'Security',
		region: 'brazil'
	},
	{
		id: 'brazil-climate',
		name: 'Brazil Climate Events',
		patterns: [/\bseca\b/i, /enchente/i, /chuva extrema/i, /desastre clim[áa]tico/i, /evento extremo/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brazil-fiscal-crisis',
		name: 'Brazil Fiscal Pressure',
		patterns: [/d[íi]vida p[úu]blica/i, /risco fiscal/i, /nota de cr[ée]dito/i, /spread soberano/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-corruption',
		name: 'Institutional Corruption',
		patterns: [/corrup[çc][ãa]o/i, /propina/i, /lavagem de dinheiro/i, /desvio/i, /peculato/i, /improbidade/i, /dela[çc][ãa]o/i, /opera[çc][ãa]o.*policial federal/i, /licita[çc][ãa]o irregular/i, /superfaturamento/i, /caixa dois/i, /tr[áa]fico de influ[êe]ncia/i],
		category: 'Politics',
		region: 'brazil'
	},

	// === BRAZIL — Partisan Framing ===
	{
		id: 'brazil-right-framing',
		name: 'Brazil Right Framing',
		patterns: [/esquerdista/i, /comunista/i, /marxista/i, /doutrina[çc][ãa]o/i, /ideologia de g[êe]nero/i, /vagabundo/i, /mamata/i, /petralha/i, /bolivariano/i, /ditadura do judici[áa]rio/i, /ativismo judicial/i, /aparelhamento/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-left-framing',
		name: 'Brazil Left Framing',
		patterns: [/fascista/i, /golpista/i, /miliciano/i, /genocida/i, /negacionista/i, /bolsonarismo/i, /extrema direita/i, /amea[çc]a [àa] democracia/i, /discurso de [óo]dio/i, /ataque [àa]s institui[çc][õo]es/i, /desmatador/i, /entreguista/i],
		category: 'Politics',
		region: 'brazil'
	},

	// === BRAZIL — Frame Battles ===
	{
		id: 'brazil-security-hardline',
		name: 'Brazil Security Hardline',
		patterns: [/bandido bom [ée] bandido morto/i, /armar o cidad[ãa]o/i, /excludente de ilicitude/i, /redu[çc][ãa]o da maioridade/i, /toler[âa]ncia zero/i, /m[ãa]o dura/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-security-rights',
		name: 'Brazil Security Rights',
		patterns: [/viol[êe]ncia policial/i, /genoc[íi]dio da juventude negra/i, /encarceramento em massa/i, /desmilitariza[çc][ãa]o/i, /direitos humanos/i, /abuso de autoridade/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-economy-liberal',
		name: 'Brazil Free Market Frame',
		patterns: [/privatiza[çc][ãa]o/i, /estado inchado/i, /carga tribut[áa]ria/i, /livre mercado/i, /desburocratiza[çc][ãa]o/i, /menos estado/i, /reforma administrativa/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-economy-statist',
		name: 'Brazil Statist Frame',
		patterns: [/papel do estado/i, /investimento p[úu]blico/i, /programa social/i, /soberania nacional/i, /empresa estrat[ée]gica/i, /neoliberal/i, /privataria/i, /desmonte/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-environment-dev',
		name: 'Brazil Development Frame',
		patterns: [/soberania sobre amaz[ôo]nia/i, /progresso/i, /agroneg[óo]cio/i, /marco temporal/i, /minera[çc][ãa]o/i, /desenvolvimento sustent[áa]vel/i, /regulariza[çc][ãa]o fundi[áa]ria/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brazil-environment-prot',
		name: 'Brazil Environmentalist Frame',
		patterns: [/desmatamento recorde/i, /ecoc[íi]dio/i, /crime ambiental/i, /terra ind[íi]gena/i, /prote[çc][ãa]o ambiental/i, /garimpo ilegal/i, /destrui[çc][ãa]o ambiental/i],
		category: 'Environment',
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
