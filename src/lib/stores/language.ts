import { writable } from 'svelte/store';
import type { Locale } from '$lib/i18n/types';

function createLanguageStore() {
	const { subscribe, set, update } = writable<Locale>('en');

	return {
		subscribe,
		setLocale(next: Locale) {
			if (next === 'en' || next === 'pt-BR') {
				set(next);
			}
		},
		toggleLocale() {
			update((value) => (value === 'en' ? 'pt-BR' : 'en'));
		}
	};
}

export const language = createLanguageStore();
