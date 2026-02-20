import { writable } from 'svelte/store';
import type { PanelId } from '$lib/config';

export interface AlertNavigationTarget {
	panelId: PanelId | null;
	sourceId: string | null;
	/** Incremented on each navigation so panels can detect re-navigation to the same item */
	nonce: number;
}

function createAlertNavigationStore() {
	const { subscribe, set } = writable<AlertNavigationTarget>({
		panelId: null,
		sourceId: null,
		nonce: 0
	});

	return {
		subscribe,
		navigate(panelId: PanelId, sourceId: string) {
			set({ panelId, sourceId, nonce: Date.now() });
		},
		clear() {
			set({ panelId: null, sourceId: null, nonce: 0 });
		}
	};
}

export const alertNavigation = createAlertNavigationStore();
