import { writable } from 'svelte/store';
import type { AIBrief } from '$lib/api/ai-brief';
import type { StabilitySnapshot } from '$lib/api/stability';
import type { FearGreedData } from '$lib/api/fear-greed';

export interface IntelligenceState {
	brief: AIBrief | null;
	briefLoading: boolean;
	briefError: string | null;
	stability: StabilitySnapshot | null;
	stabilityLoading: boolean;
	stabilityError: string | null;
	fearGreed: FearGreedData | null;
	fearGreedLoading: boolean;
	initialized: boolean;
}

function createIntelligenceStore() {
	const { subscribe, update } = writable<IntelligenceState>({
		brief: null,
		briefLoading: false,
		briefError: null,
		stability: null,
		stabilityLoading: false,
		stabilityError: null,
		fearGreed: null,
		fearGreedLoading: false,
		initialized: false
	});

	return {
		subscribe,
		setBrief: (brief: AIBrief) =>
			update((s) => ({ ...s, brief, briefLoading: false, briefError: null })),
		setBriefLoading: (loading: boolean) => update((s) => ({ ...s, briefLoading: loading })),
		setBriefError: (err: string) => update((s) => ({ ...s, briefError: err, briefLoading: false })),
		setStability: (stability: StabilitySnapshot) =>
			update((s) => ({ ...s, stability, stabilityLoading: false })),
		setStabilityLoading: (loading: boolean) =>
			update((s) => ({ ...s, stabilityLoading: loading })),
		setStabilityError: (err: string) =>
			update((s) => ({ ...s, stabilityError: err, stabilityLoading: false })),
		setFearGreed: (fg: FearGreedData) => update((s) => ({ ...s, fearGreed: fg })),
		setInitialized: () => update((s) => ({ ...s, initialized: true }))
	};
}

export const intelligence = createIntelligenceStore();
