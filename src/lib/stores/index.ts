/**
 * Stores barrel file - re-exports all stores
 */

// Settings store
export {
	settings,
	enabledPanels,
	disabledPanels,
	draggablePanels,
	type PanelSettings,
	type SettingsState
} from './settings';

// Monitors store
export {
	monitors,
	enabledMonitors,
	monitorCount,
	matchCount,
	hasMatches,
	type MonitorMatch,
	type MonitorsState
} from './monitors';

// News store
export {
	news,
	politicsNews,
	techNews,
	financeNews,
	govNews,
	aiNews,
	intelNews,
	brazilNews,
	latamNews,
	iranNews,
	venezuelaNews,
	greenlandNews,
	allNewsItems,
	alerts,
	isLoading as isNewsLoading,
	hasErrors as hasNewsErrors,
	type CategoryState,
	type NewsState
} from './news';

// Markets store
export {
	markets,
	indices,
	sectors,
	commodities,
	crypto,
	isMarketsLoading,
	marketsLastUpdated,
	vix,
	type MarketsState
} from './markets';

// Refresh store
export {
	refresh,
	isRefreshing,
	currentStage,
	lastRefresh,
	autoRefreshEnabled,
	timeSinceRefresh,
	categoriesWithErrors,
	REFRESH_STAGES,
	type RefreshStage,
	type StageConfig,
	type RefreshState
} from './refresh';

// Fed store
export {
	fedIndicators,
	fedNews,
	isFedLoading,
	fedVideos,
	type FedIndicatorsState,
	type FedNewsState
} from './fed';

// Tab store
export {
	activeTab,
	currentTabConfig,
	visiblePanels,
	isPanelInTab
} from './tabs';

// Map layers store
export {
	mapLayers,
	showHotspots,
	showConflictZones,
	showChokepoints,
	showCableLandings,
	showNuclearSites,
	showMilitaryBases,
	showMonitors,
	showCustomMarkers,
	visibleLayerCount,
	totalLayerCount,
	type MapLayersState
} from './mapLayers';
