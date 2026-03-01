/**
 * Strategic theater definitions for the Strategic Risk Overview panel.
 * Each theater maps keywords (matched against news titles/descriptions)
 * and correlation topic IDs for risk scoring.
 */

export interface Theater {
	id: string;
	name: string;
	keywords: string[];
	signalTopics: string[];
	centerLat: number;
	centerLon: number;
	focusCountries: string[];
}

export const THEATERS: Theater[] = [
	{
		id: 'persian_gulf',
		name: 'Persian Gulf',
		keywords: ['iran', 'strait', 'hormuz', 'irgc', 'persian'],
		signalTopics: ['iran_escalation', 'oil_shock'],
		centerLat: 26,
		centerLon: 52,
		focusCountries: ['iran', 'saudiarabia', 'israel']
	},
	{
		id: 'east_asia',
		name: 'East Asia / Pacific',
		keywords: ['taiwan', 'china', 'north korea', 'pla', 'south china sea'],
		signalTopics: ['china_taiwan', 'north_korea'],
		centerLat: 26,
		centerLon: 123,
		focusCountries: ['china', 'taiwan', 'northkorea']
	},
	{
		id: 'eastern_europe',
		name: 'Eastern Europe',
		keywords: ['ukraine', 'russia', 'nato', 'kremlin', 'donbas'],
		signalTopics: ['ukraine_conflict', 'nato_escalation'],
		centerLat: 49,
		centerLon: 31,
		focusCountries: ['ukraine', 'russia', 'germany', 'turkey']
	},
	{
		id: 'global_finance',
		name: 'Global Finance',
		keywords: ['market crash', 'recession', 'banking crisis', 'debt ceiling', 'fed'],
		signalTopics: ['market_crash', 'debt_crisis'],
		centerLat: 40.7,
		centerLon: -74,
		focusCountries: ['usa', 'china', 'germany']
	},
	{
		id: 'americas',
		name: 'Americas',
		keywords: ['venezuela', 'maduro', 'latam', 'latin america'],
		signalTopics: ['venezuela', 'latam_instability'],
		centerLat: 8,
		centerLon: -66,
		focusCountries: ['venezuela', 'brazil', 'usa']
	},
	{
		id: 'technology',
		name: 'Technology / Cyber',
		keywords: ['cyberattack', 'hack', 'ai regulation', 'chip', 'semiconductor'],
		signalTopics: ['cyber_attack', 'ai_arms_race'],
		centerLat: 37.4,
		centerLon: -122.1,
		focusCountries: ['usa', 'china', 'taiwan']
	}
];
