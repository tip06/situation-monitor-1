/**
 * Debounced analysis store — runs correlation, narrative, and main-character analysis
 * once per batch of news updates rather than reactively on every category load.
 */

import { writable } from 'svelte/store';
import type { NewsItem } from '$lib/types';
import type { Locale } from '$lib/i18n/types';
import { analyzeCorrelations, type CorrelationResults } from '$lib/analysis/correlation';
import { analyzeNarratives, type NarrativeResults } from '$lib/analysis/narrative';
import { calculateMainCharacter, type MainCharacterResults } from '$lib/analysis/main-character';

export const correlationResults = writable<CorrelationResults | null>(null);
export const narrativeResults = writable<NarrativeResults | null>(null);
export const mainCharResults = writable<MainCharacterResults>({ topCharacter: null, characters: [] });

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastNews: NewsItem[] | null = null;
let lastLocale: Locale | null = null;

export function scheduleAnalysis(news: NewsItem[], locale: Locale): void {
	if (news === lastNews && locale === lastLocale) return;
	lastNews = news;
	lastLocale = locale;

	if (debounceTimer) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		debounceTimer = null;
		const run = () => {
			correlationResults.set(analyzeCorrelations(news, locale));
			narrativeResults.set(analyzeNarratives(news, locale));
			mainCharResults.set(calculateMainCharacter(news));
		};
		if (typeof requestIdleCallback !== 'undefined') {
			requestIdleCallback(run, { timeout: 2000 });
		} else {
			run();
		}
	}, 800);
}
