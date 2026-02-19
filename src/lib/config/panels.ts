/**
 * Panel configuration
 */

import type { MessageKey } from '$lib/i18n';

export interface PanelConfig {
	nameKey: MessageKey;
	priority: 1 | 2 | 3;
}

export type PanelId =
	| 'map'
	| 'politics'
	| 'tech'
	| 'finance'
	| 'gov'
	| 'heatmap'
	| 'markets'
	| 'monitors'
	| 'commodities'
	| 'crypto'
	| 'polymarket'
	| 'whales'
	| 'mainchar'
	| 'printer'
	| 'contracts'
	| 'ai'
	| 'layoffs'
	| 'venezuela'
	| 'greenland'
	| 'iran'
	| 'leaders'
	| 'intel'
	| 'correlation'
	| 'narrative'
	| 'fed'
	| 'brazil'
	| 'latam';

export const PANELS: Record<PanelId, PanelConfig> = {
	map: { nameKey: 'panelName.map', priority: 1 },
	politics: { nameKey: 'panelName.politics', priority: 1 },
	tech: { nameKey: 'panelName.tech', priority: 1 },
	finance: { nameKey: 'panelName.finance', priority: 1 },
	gov: { nameKey: 'panelName.gov', priority: 2 },
	heatmap: { nameKey: 'panelName.heatmap', priority: 1 },
	markets: { nameKey: 'panelName.markets', priority: 1 },
	monitors: { nameKey: 'monitors.title', priority: 1 },
	commodities: { nameKey: 'panelName.commodities', priority: 2 },
	crypto: { nameKey: 'panel.crypto', priority: 2 },
	polymarket: { nameKey: 'panelName.polymarket', priority: 2 },
	whales: { nameKey: 'panel.whaleTitle', priority: 3 },
	mainchar: { nameKey: 'panelName.mainchar', priority: 2 },
	printer: { nameKey: 'panelName.printer', priority: 2 },
	contracts: { nameKey: 'panelName.contracts', priority: 3 },
	ai: { nameKey: 'panelName.ai', priority: 3 },
	layoffs: { nameKey: 'panelName.layoffs', priority: 3 },
	venezuela: { nameKey: 'panelName.venezuela', priority: 2 },
	greenland: { nameKey: 'panelName.greenland', priority: 2 },
	iran: { nameKey: 'panelName.iran', priority: 2 },
	leaders: { nameKey: 'panelName.leaders', priority: 1 },
	intel: { nameKey: 'panelName.intel', priority: 2 },
	correlation: { nameKey: 'panelName.correlation', priority: 1 },
	narrative: { nameKey: 'narrative.title', priority: 1 },
	fed: { nameKey: 'panelName.fed', priority: 1 },
	brazil: { nameKey: 'panelName.brazil', priority: 1 },
	latam: { nameKey: 'panelName.latam', priority: 1 }
};

export const NON_DRAGGABLE_PANELS: PanelId[] = ['map'];

export const MAP_ZOOM_MIN = 1;
export const MAP_ZOOM_MAX = 4;
export const MAP_ZOOM_STEP = 0.5;
