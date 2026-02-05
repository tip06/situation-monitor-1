/**
 * Map Layers store - controls visibility of map layers
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'mapLayers';

export interface MapLayersState {
	hotspots: boolean;
	conflictZones: boolean;
	chokepoints: boolean;
	cableLandings: boolean;
	nuclearSites: boolean;
	militaryBases: boolean;
	monitors: boolean;
	customMarkers: boolean;
}

const DEFAULT_STATE: MapLayersState = {
	hotspots: true,
	conflictZones: true,
	chokepoints: true,
	cableLandings: true,
	nuclearSites: true,
	militaryBases: true,
	monitors: true,
	customMarkers: true
};

// Load state from localStorage
function loadState(): MapLayersState {
	if (!browser) return DEFAULT_STATE;

	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (data) {
			const parsed = JSON.parse(data);
			// Merge with defaults to handle new properties
			return { ...DEFAULT_STATE, ...parsed };
		}
	} catch (e) {
		console.warn('Failed to load map layers from localStorage:', e);
	}
	return DEFAULT_STATE;
}

// Save state to localStorage
function saveState(state: MapLayersState): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn('Failed to save map layers to localStorage:', e);
	}
}

// Create the store
function createMapLayersStore() {
	const { subscribe, set, update } = writable<MapLayersState>(loadState());

	return {
		subscribe,

		/**
		 * Toggle a specific layer
		 */
		toggleLayer(layer: keyof MapLayersState): void {
			update((state) => {
				const newState = { ...state, [layer]: !state[layer] };
				saveState(newState);
				return newState;
			});
		},

		/**
		 * Set a specific layer visibility
		 */
		setLayer(layer: keyof MapLayersState, visible: boolean): void {
			update((state) => {
				const newState = { ...state, [layer]: visible };
				saveState(newState);
				return newState;
			});
		},

		/**
		 * Show all layers
		 */
		showAll(): void {
			const allVisible = Object.keys(DEFAULT_STATE).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{} as MapLayersState
			);
			saveState(allVisible);
			set(allVisible);
		},

		/**
		 * Hide all layers
		 */
		hideAll(): void {
			const allHidden = Object.keys(DEFAULT_STATE).reduce(
				(acc, key) => ({ ...acc, [key]: false }),
				{} as MapLayersState
			);
			saveState(allHidden);
			set(allHidden);
		},

		/**
		 * Reset to defaults
		 */
		reset(): void {
			saveState(DEFAULT_STATE);
			set(DEFAULT_STATE);
		}
	};
}

// Export singleton store
export const mapLayers = createMapLayersStore();

// Derived stores for individual layers
export const showHotspots = derived(mapLayers, ($mapLayers) => $mapLayers.hotspots);
export const showConflictZones = derived(mapLayers, ($mapLayers) => $mapLayers.conflictZones);
export const showChokepoints = derived(mapLayers, ($mapLayers) => $mapLayers.chokepoints);
export const showCableLandings = derived(mapLayers, ($mapLayers) => $mapLayers.cableLandings);
export const showNuclearSites = derived(mapLayers, ($mapLayers) => $mapLayers.nuclearSites);
export const showMilitaryBases = derived(mapLayers, ($mapLayers) => $mapLayers.militaryBases);
export const showMonitors = derived(mapLayers, ($mapLayers) => $mapLayers.monitors);
export const showCustomMarkers = derived(mapLayers, ($mapLayers) => $mapLayers.customMarkers);

// Count of visible layers
export const visibleLayerCount = derived(mapLayers, ($mapLayers) =>
	Object.values($mapLayers).filter(Boolean).length
);

// Total layer count
export const totalLayerCount = Object.keys(DEFAULT_STATE).length;
