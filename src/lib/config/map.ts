// Map configuration - hotspots, conflict zones, and strategic locations
import {
	SUBMARINE_CABLE_LANDINGS,
	SUBMARINE_CABLE_ROUTES,
	type SubmarineCableRoute
} from './submarine-data';
import { AI_DATA_CENTERS, type AIDataCenter } from './ai-datacenters';
import {
	PIPELINE_COLORS as PIPELINE_TYPE_COLORS,
	PIPELINE_ROUTES,
	type PipelineRoute
} from './pipelines-data';
import { WORLDMONITOR_MILITARY_BASES } from './military-bases-data';

export interface Hotspot {
	name: string;
	lat: number;
	lon: number;
	level: 'critical' | 'high' | 'elevated' | 'low';
	desc: string;
}

export interface ConflictZone {
	name: string;
	coords: [number, number][];
	color: string;
}

export interface Chokepoint {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface CableLanding {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export type { SubmarineCableRoute, AIDataCenter, PipelineRoute };

export interface NuclearSite {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface MilitaryBase {
	name: string;
	lat: number;
	lon: number;
	desc: string;
}

export interface Ocean {
	name: string;
	lat: number;
	lon: number;
}

export const THREAT_COLORS = {
	critical: '#ff0000',
	high: '#ff4444',
	elevated: '#ffcc00',
	low: '#00ff88'
} as const;

export const SANCTIONED_COUNTRY_IDS = [
	364, // Iran
	408, // North Korea
	760, // Syria
	862, // Venezuela
	112, // Belarus
	643, // Russia
	728, // South Sudan
	729 // Sudan
];

export const HOTSPOTS: Hotspot[] = [
	{
		name: 'Sahel',
		lat: 14,
		lon: -1,
		level: 'high',
		desc: 'Region of instability, military coups, and Islamist insurgency. Russian influence growing. Russian influence expanding in former French sphere; jihadist groups gaining territory; migration pressure on Europe'
	},
	{
		name: 'Port-au-Prince',
		lat: 18.5,
		lon: -72.3,
		level: 'high',
		desc: 'Gang violence, government collapse, international security mission. Humanitarian catastrophe at US doorstep; migration surge potential; test of African-led peacekeeping'
	},
	{
		name: 'Horn of Africa',
		lat: 10,
		lon: 49,
		level: 'high',
		desc: 'Resurgent piracy, Al-Shabaab activity, Ethiopia-Somaliland port dispute. Bab el-Mandeb chokepoint security; 12% of global trade at risk; Red Sea shipping rerouting'
	},
	{
		name: 'DC',
		lat: 38.9,
		lon: -77,
		level: 'low',
		desc: 'US government and military headquarters. Intelligence community center.'
	},
	{
		name: 'Silicon Valley',
		lat: 37.4,
		lon: -122.1,
		level: 'low',
		desc: 'Global tech center. AI development hub. Major economic indicator.'
	},
	{
		name: 'Wall Street',
		lat: 40.7,
		lon: -74,
		level: 'low',
		desc: 'Global financial center. Market movements. Fed policy.'
	},
	{
		name: 'Houston',
		lat: 29.76,
		lon: -95.37,
		level: 'low',
		desc: 'Energy sector HQ. NASA mission control. Space industry.'
	},
	{
		name: 'Moscow',
		lat: 55.75,
		lon: 37.6,
		level: 'high',
		desc: 'Russian Federation command center. Military operations hub. Nuclear power at war; energy leverage over Europe; global order revisionism'
	},
	{
		name: 'Beijing',
		lat: 39.9,
		lon: 116.4,
		level: 'elevated',
		desc: 'Chinese Communist Party headquarters. PLA command center. Largest economy by PPP; primary US strategic competitor; Taiwan contingency risk'
	},
	{
		name: 'Kyiv',
		lat: 50.45,
		lon: 30.5,
		level: 'critical',
		desc: 'Active conflict zone. NATO support operations. Largest European war since WWII; NATO Article 5 test; global food/energy security'
	},
	{
		name: 'Taipei',
		lat: 25.03,
		lon: 121.5,
		level: 'elevated',
		desc: 'Taiwan Strait tensions. Semiconductor supply chain. TSMC produces 90% of advanced chips; conflict would devastate global tech supply chains'
	},
	{
		name: 'Tehran',
		lat: 35.7,
		lon: 51.4,
		level: 'high',
		desc: 'Iranian nuclear program. Regional proxy operations. Near-nuclear threshold state; controls Strait of Hormuz; Axis of Resistance coordinator'
	},
	{
		name: 'Tel Aviv',
		lat: 32.1,
		lon: 34.8,
		level: 'critical',
		desc: 'Military operations. Regional security. Intelligence activities. Regional escalation risk to multi-front war; US treaty ally; Iran confrontation flashpoint'
	},
	{
		name: 'Pyongyang',
		lat: 39,
		lon: 125.75,
		level: 'elevated',
		desc: 'Nuclear weapons program. Missile testing. Cyber operations. Nuclear-armed hermit state; ICBM can reach US mainland; cyber threat actor; Russia military supplier'
	},
	{
		name: 'London',
		lat: 51.5,
		lon: -0.12,
		level: 'low',
		desc: 'UK intelligence headquarters. Five Eyes member.'
	},
	{
		name: 'Brussels',
		lat: 50.85,
		lon: 4.35,
		level: 'low',
		desc: 'NATO alliance headquarters. European Union center.'
	},
	{
		name: 'Caracas',
		lat: 10.5,
		lon: -66.9,
		level: 'low',
		desc: 'Political crisis. Economic sanctions. Regional instability.'
	},
	{
		name: 'Mexico City',
		lat: 23.6,
		lon: -102.5,
		level: 'high',
		desc: 'Cartel warfare, fentanyl trafficking, military deployments, state fragility in multiple regions. Largest US land border; fentanyl crisis killing 100k+ Americans/year; regional destabilization; migration driver'
	},
	{
		name: 'Nuuk',
		lat: 64.18,
		lon: -51.7,
		level: 'low',
		desc: 'Arctic strategic territory. US military presence, sovereignty questions.'
	},
	{
		name: 'Riyadh',
		lat: 24.7,
		lon: 46.7,
		level: 'low',
		desc: 'Saudi Arabia power center. OPEC+ decisions. Regional influence.'
	},
	{
		name: 'Cairo',
		lat: 30,
		lon: 31.2,
		level: 'low',
		desc: 'Egyptian command. Gaza border control. Suez Canal security.'
	},
	{
		name: 'Baghdad',
		lat: 33.3,
		lon: 44.4,
		level: 'low',
		desc: 'Iraqi government. Iran-backed militias. US military presence.'
	},
	{
		name: 'Damascus',
		lat: 33.5,
		lon: 36.3,
		level: 'low',
		desc: 'Syrian civil war aftermath. Multiple foreign interventions.'
	},
	{
		name: 'Doha',
		lat: 25.3,
		lon: 51.5,
		level: 'low',
		desc: 'Qatar diplomatic hub. US CENTCOM base. Al Jazeera HQ.'
	},
	{
		name: 'Ankara',
		lat: 39.9,
		lon: 32.9,
		level: 'low',
		desc: 'NATO member. Kurdish conflict. Syria/Libya operations.'
	},
	{
		name: 'Beirut',
		lat: 33.9,
		lon: 35.5,
		level: 'low',
		desc: 'Lebanon crisis. Hezbollah stronghold. Israel border tensions.'
	},
	{
		name: 'Sana\'a',
		lat: 15.4,
		lon: 44.2,
		level: 'high',
		desc: 'Yemen conflict. Houthi Red Sea attacks. Shipping disruption. Disrupting 12% of global trade via Suez; insurance costs spiking; Iran proxy demonstration'
	},
	{
		name: 'Abu Dhabi',
		lat: 24.5,
		lon: 54.4,
		level: 'low',
		desc: 'UAE strategic hub. Regional military operations.'
	}
];

export const CONFLICT_ZONES: ConflictZone[] = [
	{
		name: 'Ukraine',
		coords: [
			[30, 52],
			[40, 52],
			[40, 45],
			[30, 45],
			[30, 52]
		],
		color: '#ff4444'
	},
	{
		name: 'Gaza',
		coords: [
			[34, 32],
			[35, 32],
			[35, 31],
			[34, 31],
			[34, 32]
		],
		color: '#ff4444'
	},
	{
		name: 'Taiwan Strait',
		coords: [
			[117, 28],
			[122, 28],
			[122, 22],
			[117, 22],
			[117, 28]
		],
		color: '#ffaa00'
	},
	{
		name: 'Yemen',
		coords: [
			[42, 19],
			[54, 19],
			[54, 12],
			[42, 12],
			[42, 19]
		],
		color: '#ff6644'
	},
	{
		name: 'Sudan',
		coords: [
			[22, 23],
			[38, 23],
			[38, 8],
			[22, 8],
			[22, 23]
		],
		color: '#ff6644'
	},
	{
		name: 'Myanmar',
		coords: [
			[92, 28],
			[101, 28],
			[101, 10],
			[92, 10],
			[92, 28]
		],
		color: '#ff8844'
	}
];

export const CHOKEPOINTS: Chokepoint[] = [
	{
		name: 'Suez',
		lat: 30.0,
		lon: 32.5,
		desc: 'Suez Canal — 12% of global trade, Europe-Asia route'
	},
	{
		name: 'Panama',
		lat: 9.1,
		lon: -79.7,
		desc: 'Panama Canal — Americas transit, Pacific-Atlantic link'
	},
	{
		name: 'Hormuz',
		lat: 26.5,
		lon: 56.5,
		desc: 'Strait of Hormuz — 21% of global oil, Persian Gulf exit'
	},
	{
		name: 'Malacca',
		lat: 2.5,
		lon: 101.0,
		desc: 'Strait of Malacca — 25% of global trade, China supply line'
	},
	{
		name: 'Bab el-M',
		lat: 12.5,
		lon: 43.3,
		desc: 'Bab el-Mandeb — Red Sea gateway, Houthi threat zone'
	},
	{ name: 'Gibraltar', lat: 36.0, lon: -5.5, desc: 'Strait of Gibraltar — Mediterranean access' },
	{
		name: 'Bosporus',
		lat: 41.1,
		lon: 29.0,
		desc: 'Bosporus Strait — Black Sea access, Russia exports'
	}
];

const CORE_CABLE_LANDINGS: CableLanding[] = [
	{ name: 'NYC', lat: 40.7, lon: -74.0, desc: 'New York — Transatlantic hub, 10+ cables' },
	{ name: 'Cornwall', lat: 50.1, lon: -5.5, desc: 'Cornwall UK — Europe-Americas gateway' },
	{ name: 'Marseille', lat: 43.3, lon: 5.4, desc: 'Marseille — Mediterranean hub, SEA-ME-WE' },
	{ name: 'Mumbai', lat: 19.1, lon: 72.9, desc: 'Mumbai — India gateway, 10+ cables' },
	{ name: 'Singapore', lat: 1.3, lon: 103.8, desc: 'Singapore — Asia-Pacific nexus' },
	{ name: 'Hong Kong', lat: 22.3, lon: 114.2, desc: 'Hong Kong — China connectivity hub' },
	{ name: 'Tokyo', lat: 35.5, lon: 139.8, desc: 'Tokyo — Trans-Pacific terminus' },
	{ name: 'Sydney', lat: -33.9, lon: 151.2, desc: 'Sydney — Australia/Pacific hub' },
	{ name: 'LA', lat: 33.7, lon: -118.2, desc: 'Los Angeles — Pacific gateway' },
	{ name: 'Miami', lat: 25.8, lon: -80.2, desc: 'Miami — Americas/Caribbean hub' }
];

const seenCableLandings = new Set<string>();
export const CABLE_LANDINGS: CableLanding[] = [
	...CORE_CABLE_LANDINGS,
	...SUBMARINE_CABLE_LANDINGS.map((landing) => ({
		name: landing.name,
		lat: landing.lat,
		lon: landing.lon,
		desc: landing.desc
	}))
].filter((landing) => {
	const key = `${landing.name.toLowerCase()}|${landing.lat.toFixed(4)}|${landing.lon.toFixed(4)}`;
	if (seenCableLandings.has(key)) return false;
	seenCableLandings.add(key);
	return true;
});

export const SUBMARINE_CABLES: SubmarineCableRoute[] = SUBMARINE_CABLE_ROUTES;
export const AI_DATACENTERS: AIDataCenter[] = AI_DATA_CENTERS;
export const PIPELINES: PipelineRoute[] = PIPELINE_ROUTES;
export const PIPELINE_COLORS = PIPELINE_TYPE_COLORS;

export const NUCLEAR_SITES: NuclearSite[] = [
	{ name: 'Natanz', lat: 33.7, lon: 51.7, desc: 'Natanz — Iran uranium enrichment' },
	{ name: 'Yongbyon', lat: 39.8, lon: 125.8, desc: 'Yongbyon — North Korea nuclear complex' },
	{ name: 'Dimona', lat: 31.0, lon: 35.1, desc: 'Dimona — Israel nuclear facility' },
	{ name: 'Bushehr', lat: 28.8, lon: 50.9, desc: 'Bushehr — Iran nuclear power plant' },
	{
		name: 'Zaporizhzhia',
		lat: 47.5,
		lon: 34.6,
		desc: 'Zaporizhzhia — Europe largest NPP, conflict zone'
	},
	{ name: 'Chernobyl', lat: 51.4, lon: 30.1, desc: 'Chernobyl — Exclusion zone, occupied 2022' },
	{ name: 'Fukushima', lat: 37.4, lon: 141.0, desc: 'Fukushima — Decommissioning site' }
];

const BRAZIL_MILITARY_BASES: MilitaryBase[] = [
	{
		name: 'Base Aerea de Brasilia',
		lat: -15.869,
		lon: -47.92,
		desc: 'Brazilian Air Force strategic air base in Brasilia'
	},
	{
		name: 'Base Aerea de Anapolis',
		lat: -16.229,
		lon: -48.964,
		desc: 'FAB air defense base with high-readiness fighter operations'
	},
	{
		name: 'Base Aerea de Santa Cruz',
		lat: -22.932,
		lon: -43.719,
		desc: 'Major FAB installation in Rio de Janeiro'
	},
	{
		name: 'Base Aerea do Galeao',
		lat: -22.809,
		lon: -43.25,
		desc: 'Air force and logistics complex in Rio de Janeiro'
	},
	{
		name: 'Base Aerea de Natal',
		lat: -5.911,
		lon: -35.249,
		desc: 'Northeast air operations and mobility base'
	},
	{
		name: 'Base Aerea de Recife',
		lat: -8.126,
		lon: -34.923,
		desc: 'FAB base supporting northeastern coastal air coverage'
	},
	{
		name: 'Base Aerea de Salvador',
		lat: -12.91,
		lon: -38.334,
		desc: 'Northeast coastal defense and transport operations base'
	},
	{
		name: 'Base Aerea de Fortaleza',
		lat: -3.776,
		lon: -38.532,
		desc: 'Air base supporting Atlantic approaches in northeast Brazil'
	},
	{
		name: 'Base Aerea de Belem',
		lat: -1.384,
		lon: -48.478,
		desc: 'Gateway air base to the Amazon and northern coast'
	},
	{
		name: 'Base Aerea de Manaus',
		lat: -3.038,
		lon: -60.05,
		desc: 'Core Amazon-region air operations hub'
	},
	{
		name: 'Base Aerea de Boa Vista',
		lat: 2.841,
		lon: -60.692,
		desc: 'Northern frontier air base near Venezuela-Guyana corridor'
	},
	{
		name: 'Base Aerea de Porto Velho',
		lat: -8.709,
		lon: -63.902,
		desc: 'Western Amazon air surveillance and mobility base'
	},
	{
		name: 'Base Aerea de Campo Grande',
		lat: -20.468,
		lon: -54.672,
		desc: 'Central-west air base for inland operations'
	},
	{
		name: 'Base Aerea de Canoas',
		lat: -29.945,
		lon: -51.144,
		desc: 'Southern air defense base in Rio Grande do Sul'
	},
	{
		name: 'Base Aerea de Florianopolis',
		lat: -27.67,
		lon: -48.552,
		desc: 'Southern coastal monitoring and support base'
	},
	{
		name: 'Base Aerea de Santa Maria',
		lat: -29.711,
		lon: -53.688,
		desc: 'Southern tactical air operations and training base'
	},
	{
		name: 'Base Aerea de Sao Paulo (Campo de Marte)',
		lat: -23.509,
		lon: -46.637,
		desc: 'Urban military aviation and command support facility'
	},
	{
		name: 'Base Naval do Rio de Janeiro',
		lat: -22.902,
		lon: -43.175,
		desc: 'Primary Brazilian Navy base complex in Rio'
	},
	{
		name: 'Base Naval de Aratu',
		lat: -12.782,
		lon: -38.499,
		desc: 'Brazilian Navy Atlantic fleet support base near Salvador'
	},
	{
		name: 'Base Naval de Ladario',
		lat: -19.005,
		lon: -57.603,
		desc: 'Riverine naval operations base in Pantanal region'
	},
	{
		name: 'Base de Submarinos de Itaguai',
		lat: -22.863,
		lon: -43.78,
		desc: 'Brazilian submarine base and PROSUB complex'
	},
	{
		name: 'Centro de Lancamento de Alcantara',
		lat: -2.373,
		lon: -44.396,
		desc: 'Strategic aerospace launch center with military relevance'
	}
];

const seenMilitaryBases = new Set<string>();
export const MILITARY_BASES: MilitaryBase[] = [
	...WORLDMONITOR_MILITARY_BASES,
	...BRAZIL_MILITARY_BASES
].filter((base) => {
	const key = `${base.name.toLowerCase()}|${base.lat.toFixed(3)}|${base.lon.toFixed(3)}`;
	if (seenMilitaryBases.has(key)) return false;
	seenMilitaryBases.add(key);
	return true;
});

export const OCEANS: Ocean[] = [
	{ name: 'ATLANTIC', lat: 25, lon: -40 },
	{ name: 'PACIFIC', lat: 0, lon: -150 },
	{ name: 'INDIAN', lat: -20, lon: 75 },
	{ name: 'ARCTIC', lat: 75, lon: 0 },
	{ name: 'SOUTHERN', lat: -60, lon: 0 }
];

export const WEATHER_CODES: Record<number, string> = {
	0: '☀️ Clear',
	1: '🌤️ Mostly clear',
	2: '⛅ Partly cloudy',
	3: '☁️ Overcast',
	45: '🌫️ Fog',
	48: '🌫️ Fog',
	51: '🌧️ Drizzle',
	53: '🌧️ Drizzle',
	55: '🌧️ Drizzle',
	61: '🌧️ Rain',
	63: '🌧️ Rain',
	65: '🌧️ Heavy rain',
	71: '🌨️ Snow',
	73: '🌨️ Snow',
	75: '🌨️ Heavy snow',
	77: '🌨️ Snow',
	80: '🌧️ Showers',
	81: '🌧️ Showers',
	82: '⛈️ Heavy showers',
	85: '🌨️ Snow',
	86: '🌨️ Snow',
	95: '⛈️ Thunderstorm',
	96: '⛈️ Thunderstorm',
	99: '⛈️ Thunderstorm'
};
