import { writable } from 'svelte/store';
import type { AlertPopup } from '$lib/alerts/engine';

interface AlertPopupsState {
	items: AlertPopup[];
	history: AlertPopup[];
}

function createAlertPopupsStore() {
	const { subscribe, update, set } = writable<AlertPopupsState>({ items: [], history: [] });

	return {
		subscribe,
		push(popups: AlertPopup[]) {
			if (!popups.length) return;
			update((state) => ({
				...state,
				items: [...popups, ...state.items].slice(0, 10),
				history: [...popups, ...state.history].slice(0, 30)
			}));
		},
		dismiss(id: string) {
			update((state) => ({
				...state,
				items: state.items.filter((item) => item.id !== id)
			}));
		},
		clearHistory() {
			update((state) => ({
				...state,
				history: []
			}));
		},
		clear() {
			set({ items: [], history: [] });
		}
	};
}

export const alertPopups = createAlertPopupsStore();
