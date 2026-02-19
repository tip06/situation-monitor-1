/**
 * Onboarding presets for first-time users
 */

import type { PanelId } from './panels';
import type { MessageKey } from '$lib/i18n';

export interface Preset {
	id: string;
	nameKey: MessageKey;
	icon: string;
	descriptionKey: MessageKey;
	panels: PanelId[];
}

export const PRESETS: Record<string, Preset> = {
	'news-junkie': {
		id: 'news-junkie',
		nameKey: 'preset.newsJunkie.name',
		icon: '📰',
		descriptionKey: 'preset.newsJunkie.description',
		panels: ['politics', 'tech', 'finance', 'gov', 'ai', 'mainchar', 'map']
	},
	trader: {
		id: 'trader',
		nameKey: 'preset.trader.name',
		icon: '📈',
		descriptionKey: 'preset.trader.description',
		panels: [
			'markets',
			'heatmap',
			'commodities',
			'crypto',
			'polymarket',
			'whales',
			'printer',
			'finance',
			'map'
		]
	},
	geopolitics: {
		id: 'geopolitics',
		nameKey: 'preset.geopolitics.name',
		icon: '🌍',
		descriptionKey: 'preset.geopolitics.description',
		panels: [
			'map',
			'intel',
			'leaders',
			'politics',
			'gov',
			'venezuela',
			'greenland',
			'iran',
			'correlation',
			'narrative'
		]
	},
	intel: {
		id: 'intel',
		nameKey: 'preset.intel.name',
		icon: '🔍',
		descriptionKey: 'preset.intel.description',
		panels: ['map', 'intel', 'leaders', 'correlation', 'narrative', 'mainchar', 'politics']
	},
	minimal: {
		id: 'minimal',
		nameKey: 'preset.minimal.name',
		icon: '⚡',
		descriptionKey: 'preset.minimal.description',
		panels: ['map', 'politics', 'markets']
	},
	everything: {
		id: 'everything',
		nameKey: 'preset.everything.name',
		icon: '🎛️',
		descriptionKey: 'preset.everything.description',
		panels: [
			'map',
			'politics',
			'tech',
			'finance',
			'gov',
			'heatmap',
			'markets',
			'monitors',
			'commodities',
			'crypto',
			'polymarket',
			'whales',
			'mainchar',
			'printer',
			'contracts',
			'ai',
			'layoffs',
			'venezuela',
			'greenland',
			'iran',
			'leaders',
			'intel',
			'correlation',
			'narrative'
		]
	}
};

export const PRESET_ORDER = [
	'news-junkie',
	'trader',
	'geopolitics',
	'intel',
	'minimal',
	'everything'
];

// Storage keys
export const ONBOARDING_STORAGE_KEY = 'onboardingComplete';
export const PRESET_STORAGE_KEY = 'selectedPreset';
