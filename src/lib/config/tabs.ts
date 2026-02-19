/**
 * Tab configuration for the dashboard
 */

import type { PanelId } from './panels';
import type { MessageKey } from '$lib/i18n';

export type TabId = 'global' | 'regional' | 'economy' | 'social' | 'technology';

export type TabLayout = 'grid-2row' | 'side-by-side' | 'columns';

export interface TabConfig {
	id: TabId;
	nameKey: MessageKey;
	layout: TabLayout;
	panels?: PanelId[];
	rows?: PanelId[][];
}

export const TABS: TabConfig[] = [
	{
		id: 'global',
		nameKey: 'tabs.global',
		layout: 'grid-2row',
		rows: [
			['iran', 'venezuela', 'greenland'],
			['politics', 'intel', 'monitors']
		]
	},
	{
		id: 'regional',
		nameKey: 'tabs.regional',
		layout: 'side-by-side',
		panels: ['brazil', 'latam']
	},
	{
		id: 'economy',
		nameKey: 'tabs.economy',
		layout: 'columns',
		panels: ['crypto', 'markets', 'heatmap', 'commodities', 'finance']
	},
	{
		id: 'social',
		nameKey: 'tabs.social',
		layout: 'columns',
		panels: ['correlation', 'narrative', 'polymarket']
	},
	{
		id: 'technology',
		nameKey: 'tabs.technology',
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
