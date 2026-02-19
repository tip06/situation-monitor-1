/**
 * Settings store - panel visibility, order, and UI preferences
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	PANELS,
	NON_DRAGGABLE_PANELS,
	PRESETS,
	ONBOARDING_STORAGE_KEY,
	PRESET_STORAGE_KEY,
	type PanelId
} from '$lib/config';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEYS = {
	panels: 'situationMonitorPanels',
	order: 'panelOrder',
	sizes: 'panelSizes',
	fringeFeeds: 'enableFringeFeeds',
	theme: 'uiThemePreference'
} as const;

export interface PanelSettings {
	enabled: Record<PanelId, boolean>;
	order: PanelId[];
	sizes: Record<PanelId, { width?: number; height?: number }>;
	enableFringeFeeds: boolean;
	theme: ThemeMode;
}

export interface SettingsState extends PanelSettings {
	initialized: boolean;
}

function applyTheme(theme: ThemeMode): void {
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
}

function getSystemTheme(): ThemeMode {
	if (!browser || typeof window.matchMedia !== 'function') return 'dark';
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getDefaultSettings(): PanelSettings {
	const allPanelIds = Object.keys(PANELS) as PanelId[];
	return {
		enabled: Object.fromEntries(allPanelIds.map((id) => [id, true])) as Record<PanelId, boolean>,
		order: allPanelIds,
		sizes: {} as Record<PanelId, { width?: number; height?: number }>,
		enableFringeFeeds: false,
		theme: 'dark'
	};
}

function loadFromStorage(): Partial<PanelSettings> {
	if (!browser) return {};

	try {
		const panels = localStorage.getItem(STORAGE_KEYS.panels);
		const order = localStorage.getItem(STORAGE_KEYS.order);
		const sizes = localStorage.getItem(STORAGE_KEYS.sizes);
		const fringeFeeds = localStorage.getItem(STORAGE_KEYS.fringeFeeds);
		const theme = localStorage.getItem(STORAGE_KEYS.theme);

		return {
			enabled: panels ? JSON.parse(panels) : undefined,
			order: order ? JSON.parse(order) : undefined,
			sizes: sizes ? JSON.parse(sizes) : undefined,
			enableFringeFeeds: fringeFeeds ? JSON.parse(fringeFeeds) : undefined,
			theme: theme === 'light' || theme === 'dark' ? theme : undefined
		};
	} catch (e) {
		console.warn('Failed to load settings from localStorage:', e);
		return {};
	}
}

function saveToStorage(key: keyof typeof STORAGE_KEYS, value: unknown): void {
	if (!browser) return;
	try {
		if (key === 'theme') {
			localStorage.setItem(STORAGE_KEYS.theme, String(value));
			return;
		}
		localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
	} catch (e) {
		console.warn(`Failed to save ${key} to localStorage:`, e);
	}
}

function createSettingsStore() {
	const defaults = getDefaultSettings();
	const saved = loadFromStorage();
	const initialTheme = saved.theme ?? defaults.theme;

	const initialState: SettingsState = {
		enabled: { ...defaults.enabled, ...saved.enabled },
		order: saved.order ?? defaults.order,
		sizes: { ...defaults.sizes, ...saved.sizes },
		enableFringeFeeds: saved.enableFringeFeeds ?? defaults.enableFringeFeeds,
		theme: initialTheme,
		initialized: false
	};

	if (browser) {
		applyTheme(initialTheme);
	}

	const { subscribe, set, update } = writable<SettingsState>(initialState);

	return {
		subscribe,

		init() {
			update((state) => ({ ...state, initialized: true }));
		},

		initThemeFromSystem() {
			if (!browser) return;
			const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
			if (savedTheme === 'dark' || savedTheme === 'light') {
				applyTheme(savedTheme);
				update((state) => ({ ...state, theme: savedTheme }));
				return;
			}

			const systemTheme = getSystemTheme();
			saveToStorage('theme', systemTheme);
			applyTheme(systemTheme);
			update((state) => ({ ...state, theme: systemTheme }));
		},

		setTheme(theme: ThemeMode) {
			update((state) => {
				saveToStorage('theme', theme);
				applyTheme(theme);
				return { ...state, theme };
			});
		},

		toggleTheme() {
			update((state) => {
				const nextTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
				saveToStorage('theme', nextTheme);
				applyTheme(nextTheme);
				return { ...state, theme: nextTheme };
			});
		},

		isPanelEnabled(panelId: PanelId): boolean {
			const state = get({ subscribe });
			return state.enabled[panelId] ?? true;
		},

		togglePanel(panelId: PanelId) {
			update((state) => {
				const newEnabled = {
					...state.enabled,
					[panelId]: !state.enabled[panelId]
				};
				saveToStorage('panels', newEnabled);
				return { ...state, enabled: newEnabled };
			});
		},

		enablePanel(panelId: PanelId) {
			update((state) => {
				const newEnabled = { ...state.enabled, [panelId]: true };
				saveToStorage('panels', newEnabled);
				return { ...state, enabled: newEnabled };
			});
		},

		disablePanel(panelId: PanelId) {
			update((state) => {
				const newEnabled = { ...state.enabled, [panelId]: false };
				saveToStorage('panels', newEnabled);
				return { ...state, enabled: newEnabled };
			});
		},

		updateOrder(newOrder: PanelId[]) {
			update((state) => {
				saveToStorage('order', newOrder);
				return { ...state, order: newOrder };
			});
		},

		movePanel(panelId: PanelId, toIndex: number) {
			if (NON_DRAGGABLE_PANELS.includes(panelId)) return;

			update((state) => {
				const currentIndex = state.order.indexOf(panelId);
				if (currentIndex === -1) return state;

				const newOrder = [...state.order];
				newOrder.splice(currentIndex, 1);
				newOrder.splice(toIndex, 0, panelId);

				saveToStorage('order', newOrder);
				return { ...state, order: newOrder };
			});
		},

		updateSize(panelId: PanelId, size: { width?: number; height?: number }) {
			update((state) => {
				const newSizes = {
					...state.sizes,
					[panelId]: { ...state.sizes[panelId], ...size }
				};
				saveToStorage('sizes', newSizes);
				return { ...state, sizes: newSizes };
			});
		},

		toggleFringeFeeds() {
			update((state) => {
				const newValue = !state.enableFringeFeeds;
				saveToStorage('fringeFeeds', newValue);
				return { ...state, enableFringeFeeds: newValue };
			});
		},

		isFringeFeedsEnabled(): boolean {
			const state = get({ subscribe });
			return state.enableFringeFeeds;
		},

		reset() {
			const defaults = getDefaultSettings();
			if (browser) {
				localStorage.removeItem(STORAGE_KEYS.panels);
				localStorage.removeItem(STORAGE_KEYS.order);
				localStorage.removeItem(STORAGE_KEYS.sizes);
				localStorage.removeItem(STORAGE_KEYS.fringeFeeds);
				localStorage.removeItem(STORAGE_KEYS.theme);
			}
			applyTheme(defaults.theme);
			set({ ...defaults, initialized: true });
		},

		getPanelSize(panelId: PanelId): { width?: number; height?: number } | undefined {
			const state = get({ subscribe });
			return state.sizes[panelId];
		},

		isOnboardingComplete(): boolean {
			if (!browser) return true;
			return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
		},

		getSelectedPreset(): string | null {
			if (!browser) return null;
			return localStorage.getItem(PRESET_STORAGE_KEY);
		},

		applyPreset(presetId: string) {
			const preset = PRESETS[presetId];
			if (!preset) {
				console.error('Unknown preset:', presetId);
				return;
			}

			const allPanelIds = Object.keys(PANELS) as PanelId[];
			const newEnabled = Object.fromEntries(
				allPanelIds.map((id) => [id, preset.panels.includes(id)])
			) as Record<PanelId, boolean>;

			update((state) => {
				saveToStorage('panels', newEnabled);
				return { ...state, enabled: newEnabled };
			});

			if (browser) {
				localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
				localStorage.setItem(PRESET_STORAGE_KEY, presetId);
			}
		},

		resetOnboarding() {
			if (browser) {
				localStorage.removeItem(ONBOARDING_STORAGE_KEY);
				localStorage.removeItem(PRESET_STORAGE_KEY);
			}
		}
	};
}

export const settings = createSettingsStore();

export const enabledPanels = derived(settings, ($settings) =>
	$settings.order.filter((id) => $settings.enabled[id])
);

export const disabledPanels = derived(settings, ($settings) =>
	$settings.order.filter((id) => !$settings.enabled[id])
);

export const draggablePanels = derived(enabledPanels, ($enabled) =>
	$enabled.filter((id) => !NON_DRAGGABLE_PANELS.includes(id))
);
