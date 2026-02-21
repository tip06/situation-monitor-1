import { writable } from 'svelte/store';
import type { AlertPopup } from '$lib/alerts/engine';

interface AlertPopupsState {
	items: AlertPopup[];
	history: AlertPopup[];
}

function createAlertPopupsStore() {
	const { subscribe, update, set } = writable<AlertPopupsState>({ items: [], history: [] });

	function dismiss(id: string) {
		update((state) => ({
			...state,
			items: state.items.filter((item) => item.id !== id)
		}));
	}

	return {
		subscribe,
		push(popups: AlertPopup[]) {
			if (!popups.length) return;
			update((state) => ({
				...state,
				items: [...popups, ...state.items].slice(0, 10),
				history: [...popups, ...state.history].slice(0, 30)
			}));

			// Auto-dismiss after 10 seconds
			popups.forEach((popup) => {
				setTimeout(() => {
					dismiss(popup.id);
				}, 10000);
			});
		},
		dismiss,
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
