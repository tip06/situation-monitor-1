/**
 * Tab configuration for the dashboard
 */

import type { PanelId } from './panels';

export type TabId = 'global' | 'regional' | 'economy' | 'social' | 'technology';

export type TabLayout = 'grid-2row' | 'side-by-side' | 'columns';

export interface TabConfig {
	id: TabId;
	name: string;
	layout: TabLayout;
	panels?: PanelId[];
	rows?: PanelId[][];
}

export const TABS: TabConfig[] = [
	{
		id: 'global',
		name: 'Global',
		layout: 'grid-2row',
		rows: [
			['iran', 'venezuela', 'greenland'],
			['politics', 'intel', 'monitors']
		]
	},
	{
		id: 'regional',
		name: 'Regional',
		layout: 'side-by-side',
		panels: ['brazil', 'latam']
	},
	{
		id: 'economy',
		name: 'Economy',
		layout: 'columns',
		panels: ['crypto', 'markets', 'heatmap', 'commodities', 'finance']
	},
	{
		id: 'social',
		name: 'Social',
		layout: 'columns',
		panels: ['mainchar', 'correlation', 'narrative', 'polymarket']
	},
	{
		id: 'technology',
		name: 'Technology',
		layout: 'columns',
		panels: ['tech', 'ai']
	}
];

export const DEFAULT_TAB: TabId = 'global';

/**
 * Get tab config by ID
 */
export function getTabConfig(tabId: TabId): TabConfig | undefined {
	return TABS.find((tab) => tab.id === tabId);
}

/**
 * Get all panels for a tab (flattened from rows if grid layout)
 */
export function getTabPanels(tabId: TabId): PanelId[] {
	const tab = getTabConfig(tabId);
	if (!tab) return [];

	if (tab.rows) {
		return tab.rows.flat();
	}
	return tab.panels || [];
}
