/**
 * Tab store - manages active tab state with localStorage persistence
 */

import { writable, derived } from 'svelte/store';
import { DEFAULT_TAB, getTabConfig, getTabPanels, type TabId, type TabConfig } from '$lib/config';
import type { PanelId } from '$lib/config';

const STORAGE_KEY = 'situation-monitor-active-tab';

/**
 * Load saved tab from localStorage
 */
function loadSavedTab(): TabId {
	if (typeof window === 'undefined') return DEFAULT_TAB;

	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && ['global', 'regional', 'economy', 'social', 'technology'].includes(saved)) {
			return saved as TabId;
		}
	} catch {
		// localStorage not available
	}
	return DEFAULT_TAB;
}

/**
 * Save tab to localStorage
 */
function saveTab(tabId: TabId): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, tabId);
	} catch {
		// localStorage not available
	}
}

/**
 * Create the tab store
 */
function createTabStore() {
	const { subscribe, set } = writable<TabId>(loadSavedTab());

	return {
		subscribe,

		/**
		 * Initialize store from localStorage (call in onMount)
		 */
		init() {
			const saved = loadSavedTab();
			set(saved);
		},

		/**
		 * Set active tab
		 */
		setTab(tabId: TabId) {
			set(tabId);
			saveTab(tabId);
		},

		/**
		 * Get current tab config
		 */
		getConfig(tabId: TabId): TabConfig | undefined {
			return getTabConfig(tabId);
		}
	};
}

// Export singleton store
export const activeTab = createTabStore();

// Derived store for current tab config
export const currentTabConfig = derived(activeTab, ($activeTab) => {
	return getTabConfig($activeTab);
});

// Derived store for visible panels in current tab
export const visiblePanels = derived(activeTab, ($activeTab) => {
	return getTabPanels($activeTab);
});

/**
 * Check if a panel should be visible in the current tab
 */
export function isPanelInTab(panelId: PanelId, tabId: TabId): boolean {
	const panels = getTabPanels(tabId);
	return panels.includes(panelId);
}
