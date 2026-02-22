<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Header, TabBar } from '$lib/components/layout';
	import { SettingsModal, MonitorFormModal, AddDataModal } from '$lib/components/modals';
	import { AlertStack } from '$lib/components/common';
	import {
		NewsPanel,
		MarketsPanel,
		HeatmapPanel,
		CommoditiesPanel,
		CryptoPanel,
		CorrelationPanel,
		NarrativePanel,
		MonitorsPanel,
		MapPanel,
		PolymarketSection,
		IntelPanel,
		SituationPanel
	} from '$lib/components/panels';
	import {
		news,
		markets,
		monitors,
		settings,
		sources,
		refresh,
		allNewsItems,
		activeTab,
		language
	} from '$lib/stores';
	import { t } from '$lib/i18n';
	import { filterNews } from '$lib/utils';
	import { refreshAllNewsProgressive, fetchAllMarkets, fetchPolymarket } from '$lib/api';
	import type { Prediction } from '$lib/api';
	import type { CustomMonitor, NewsCategory } from '$lib/types';
	import { getTabPanels, type PanelId, type TabId } from '$lib/config';
	import { detectAlerts } from '$lib/alerts/engine';
	import { alertPopups } from '$lib/stores/alertPopups';

	type NewsLoadReason = 'initial' | 'refresh' | 'tabSwitch' | 'deferred';

	// Modal state
	let settingsOpen = $state(false);
	let monitorFormOpen = $state(false);
	let addDataOpen = $state(false);
	let editingMonitor = $state<CustomMonitor | null>(null);

	// Misc panel data
	let predictions = $state<Prediction[]>([]);

	const NEWS_REFRESH_CATEGORIES: NewsCategory[] = [
		'politics',
		'tech',
		'finance',
		'gov',
		'ai',
		'intel',
		'brazil',
		'latam',
		'iran',
		'venezuela',
		'greenland'
	];
	const PANEL_TO_NEWS_CATEGORY: Partial<Record<PanelId, NewsCategory>> = {
		politics: 'politics',
		tech: 'tech',
		finance: 'finance',
		gov: 'gov',
		ai: 'ai',
		intel: 'intel',
		brazil: 'brazil',
		latam: 'latam',
		iran: 'iran',
		venezuela: 'venezuela',
		greenland: 'greenland'
	};

	function getVisibleNewsCategories(tabId: TabId): NewsCategory[] {
		const enabledSettings = get(settings).enabled;
		const tabPanels = getTabPanels(tabId);
		const visibleCategories = tabPanels
			.filter((panelId) => enabledSettings[panelId] !== false)
			.map((panelId) => PANEL_TO_NEWS_CATEGORY[panelId])
			.filter((category): category is NewsCategory => !!category);
		return [...new Set(visibleCategories)];
	}

	function getRemainingNewsCategories(visibleCategories: NewsCategory[]): NewsCategory[] {
		const visibleSet = new Set(visibleCategories);
		return NEWS_REFRESH_CATEGORIES.filter((category) => !visibleSet.has(category));
	}

	let initialLoadDone = $state(false);
	let inFlightCategories = $state<Set<NewsCategory>>(new Set());
	let tabSwitchController = $state<AbortController | null>(null);
	let deferredLoadTimer = $state<ReturnType<typeof setTimeout> | null>(null);

	function isAbortError(error: unknown): boolean {
		return error instanceof DOMException && error.name === 'AbortError';
	}

	function addInFlightCategories(categories: NewsCategory[]): void {
		inFlightCategories = new Set([...inFlightCategories, ...categories]);
	}

	function removeInFlightCategories(categories: NewsCategory[]): void {
		const next = new Set(inFlightCategories);
		for (const category of categories) {
			next.delete(category);
		}
		inFlightCategories = next;
	}

	function getUnloadedCategories(categories: NewsCategory[]): NewsCategory[] {
		const state = get(news);
		return categories.filter(
			(category) => state.categories[category].items.length === 0 && !inFlightCategories.has(category)
		);
	}

	function beginLoad(reason: NewsLoadReason): void {
		if (reason === 'tabSwitch' || reason === 'deferred') {
			refresh.startBackgroundSync();
		}
	}

	function endLoad(reason: NewsLoadReason): void {
		if (reason === 'tabSwitch' || reason === 'deferred') {
			refresh.endBackgroundSync();
		}
	}

	async function loadNews(
		categories: NewsCategory[],
		options: { reason: NewsLoadReason; signal?: AbortSignal; force?: boolean }
	): Promise<void> {
		const uniqueCategories = [...new Set(categories)];
		const categoriesToLoad = (options.force ? uniqueCategories : getUnloadedCategories(uniqueCategories)).filter(
			(category) => !inFlightCategories.has(category)
		);

		if (categoriesToLoad.length === 0) return;

		beginLoad(options.reason);
		addInFlightCategories(categoriesToLoad);
		categoriesToLoad.forEach((category) => news.setLoading(category, true));

		const completedCategories = new Set<NewsCategory>();
		let aborted = false;

		try {
			await refreshAllNewsProgressive({
				timeoutMs: 30000,
				categoryConcurrency: 3,
				categories: categoriesToLoad,
				preferEdge: true,
				signal: options.signal,
				onCachedCategory: (category, items) => {
					news.setItems(category, items);
					completedCategories.add(category);
				},
				onFreshCategory: (category, items) => {
					news.setItems(category, items);
					completedCategories.add(category);
				},
				onCategoryError: (category, error) => {
					completedCategories.add(category);
					if (!isAbortError(error)) {
						news.setError(category, String(error));
					}
				}
			});
		} catch (error) {
			aborted = isAbortError(error);
			if (!aborted) {
				for (const category of categoriesToLoad) {
					if (!completedCategories.has(category)) {
						news.setError(category, String(error));
					}
				}
			}
		} finally {
			for (const category of categoriesToLoad) {
				if (!completedCategories.has(category)) {
					news.setLoading(category, false);
				}
			}
			removeInFlightCategories(categoriesToLoad);
			endLoad(options.reason);
		}

		if (aborted) {
			return;
		}
	}

	async function loadMarkets() {
		try {
			const data = await fetchAllMarkets();
			markets.setIndices(data.indices);
			markets.setSectors(data.sectors);
			markets.setCommodities(data.commodities);
			markets.setCrypto(data.crypto);
		} catch (error) {
			console.error('Failed to load markets:', error);
		}
	}

	async function loadMiscData() {
		try {
			predictions = await fetchPolymarket();
		} catch (error) {
			console.error('Failed to load misc data:', error);
		}
	}

	// Refresh handlers
	async function handleRefresh() {
		tabSwitchController?.abort();
		tabSwitchController = null;
		refresh.startRefresh();
		try {
			const visibleCategories = getVisibleNewsCategories($activeTab);
			const remainingCategories = getRemainingNewsCategories(visibleCategories);
			await Promise.all([
				loadNews(visibleCategories, { reason: 'refresh', force: true }),
				loadMarkets()
			]);
			if (remainingCategories.length > 0) {
				void loadNews(remainingCategories, { reason: 'deferred', force: true });
			}
			runAlertDetection();
			refresh.endRefresh();
		} catch (error) {
			refresh.endRefresh([String(error)]);
		}
	}

	// Monitor handlers
	function handleCreateMonitor() {
		editingMonitor = null;
		monitorFormOpen = true;
	}

	function handleEditMonitor(monitor: CustomMonitor) {
		editingMonitor = monitor;
		monitorFormOpen = true;
	}

	function handleDeleteMonitor(id: string) {
		monitors.deleteMonitor(id);
	}

	function handleToggleMonitor(id: string) {
		monitors.toggleMonitor(id);
	}

	// Get panel visibility
	function isPanelVisible(id: PanelId): boolean {
		return $settings.enabled[id] !== false;
	}

	function getPanelForNews(item: { category: string }): PanelId | undefined {
		switch (item.category) {
			case 'politics':
				return 'politics';
			case 'tech':
				return 'tech';
			case 'finance':
				return 'finance';
			case 'gov':
				return 'gov';
			case 'ai':
				return 'ai';
			case 'intel':
				return 'intel';
			case 'brazil':
				return 'brazil';
			case 'latam':
				return 'latam';
			case 'iran':
				return 'iran';
			case 'venezuela':
				return 'venezuela';
			case 'greenland':
				return 'greenland';
			case 'fringe':
				return 'intel';
			default:
				return undefined;
		}
	}

	function runAlertDetection() {
		const popups = detectAlerts({
			newsItems: get(allNewsItems),
			marketsState: get(markets),
			locale: get(language),
			getPanelForNews
		});
		alertPopups.push(popups);
	}

	// On tab switch: load data if needed and cancel stale tab-switch requests
	$effect(() => {
		const tab = $activeTab;
		if (!initialLoadDone) return;

		tabSwitchController?.abort();
		const controller = new AbortController();
		tabSwitchController = controller;

		const categories = getVisibleNewsCategories(tab);
		const unloadedCategories = getUnloadedCategories(categories);
		if (unloadedCategories.length === 0) {
			tabSwitchController = null;
			return;
		}

		void loadNews(unloadedCategories, { reason: 'tabSwitch', signal: controller.signal }).finally(() => {
			if (tabSwitchController === controller) {
				tabSwitchController = null;
			}
		});
	});

	// Initial load
	onMount(() => {
		// Initialize tab store from localStorage
		activeTab.init();
		sources.init();

		// Load initial data: visible tab first, defer rest
		async function initialLoad() {
			refresh.startRefresh();
			try {
				const currentTab = $activeTab;
				const visibleCategories = getVisibleNewsCategories(currentTab);
				await Promise.all([
					loadNews(visibleCategories, { reason: 'initial' }),
					loadMarkets(),
					loadMiscData()
				]);
				initialLoadDone = true;
				runAlertDetection();
				refresh.endRefresh();

				// Defer remaining categories after 5s
				const remainingCategories = getRemainingNewsCategories(visibleCategories);
				if (remainingCategories.length > 0) {
					deferredLoadTimer = setTimeout(() => {
						void loadNews(remainingCategories, { reason: 'deferred' });
					}, 5000);
				}
			} catch (error) {
				initialLoadDone = true;
				refresh.endRefresh([String(error)]);
			}
		}
		initialLoad();
		refresh.setupAutoRefresh(handleRefresh);

		return () => {
			tabSwitchController?.abort();
			if (deferredLoadTimer) {
				clearTimeout(deferredLoadTimer);
			}
			refresh.stopAutoRefresh();
		};
	});
</script>

<svelte:head>
	<title>{t($language, 'app.title')}</title>
	<meta name="description" content={t($language, 'app.description')} />
</svelte:head>

<div class="app">
	<Header
		onSettingsClick={() => (settingsOpen = true)}
		onAddDataClick={() => (addDataOpen = true)}
	/>

	<main class="main-content">
		<!-- Map Panel - Always visible at top -->
		{#if isPanelVisible('map')}
			<div class="map-container">
				<MapPanel monitors={$monitors.monitors} />
			</div>
		{/if}

		<!-- Tab Navigation -->
		<TabBar />

		<!-- Tab Content -->
		<div class="tab-content">
			{#if $activeTab === 'global'}
				<!-- Global Tab: 2-row grid layout -->
				<div class="grid-2row">
					<div class="grid-row">
						{#if isPanelVisible('iran')}
							<div class="panel-slot">
								<SituationPanel
									panelId="iran"
									config={{
										title: t($language, 'situation.iran.title'),
										subtitle: t($language, 'situation.iran.subtitle'),
										criticalKeywords: [
											'protest',
											'uprising',
											'revolution',
											'crackdown',
											'killed',
											'nuclear',
											'strike',
											'attack',
											'irgc',
											'khamenei'
										]
									}}
									news={filterNews(
										$allNewsItems.filter(
											(n) =>
												n.title.toLowerCase().includes('iran') ||
												n.title.toLowerCase().includes('tehran') ||
												n.title.toLowerCase().includes('irgc')
										),
										{ maxItems: 10, maxAgeDays: 7 }
									)}
								/>
							</div>
						{/if}

						{#if isPanelVisible('venezuela')}
							<div class="panel-slot">
								<SituationPanel
									panelId="venezuela"
									config={{
										title: t($language, 'situation.venezuela.title'),
										subtitle: t($language, 'situation.venezuela.subtitle'),
										criticalKeywords: ['maduro', 'caracas', 'venezuela', 'guaido']
									}}
									news={filterNews(
										$allNewsItems.filter(
											(n) =>
												n.title.toLowerCase().includes('venezuela') ||
												n.title.toLowerCase().includes('maduro')
										),
										{ maxItems: 10, maxAgeDays: 7 }
									)}
								/>
							</div>
						{/if}

						{#if isPanelVisible('greenland')}
							<div class="panel-slot">
								<SituationPanel
									panelId="greenland"
									config={{
										title: t($language, 'situation.greenland.title'),
										subtitle: t($language, 'situation.greenland.subtitle'),
										criticalKeywords: ['greenland', 'arctic', 'nuuk', 'denmark']
									}}
									news={filterNews(
										$allNewsItems.filter(
											(n) =>
												n.title.toLowerCase().includes('greenland') ||
												n.title.toLowerCase().includes('arctic')
										),
										{ maxItems: 10, maxAgeDays: 7 }
									)}
								/>
							</div>
						{/if}
					</div>

					<div class="grid-row">
						{#if isPanelVisible('politics')}
							<div class="panel-slot">
								<NewsPanel
									category="politics"
									panelId="politics"
									title={t($language, 'newsTitle.politics')}
								/>
							</div>
						{/if}

						{#if isPanelVisible('intel')}
							<div class="panel-slot">
								<IntelPanel />
							</div>
						{/if}

						{#if isPanelVisible('monitors')}
							<div class="panel-slot">
								<MonitorsPanel
									monitors={$monitors.monitors}
									matches={$monitors.matches}
									onCreateMonitor={handleCreateMonitor}
									onEditMonitor={handleEditMonitor}
									onDeleteMonitor={handleDeleteMonitor}
									onToggleMonitor={handleToggleMonitor}
								/>
							</div>
						{/if}
					</div>
				</div>
			{:else if $activeTab === 'regional'}
				<!-- Regional Tab: Side-by-side layout -->
				<div class="side-by-side">
					{#if isPanelVisible('brazil')}
						<div class="panel-slot side-panel">
							<NewsPanel category="brazil" panelId="brazil" title={t($language, 'newsTitle.brazil')} />
						</div>
					{/if}

					{#if isPanelVisible('latam')}
						<div class="panel-slot side-panel">
							<NewsPanel category="latam" panelId="latam" title={t($language, 'newsTitle.latam')} />
						</div>
					{/if}
				</div>
			{:else if $activeTab === 'economy'}
				<!-- Economy Tab: Row 1 = crypto, markets, heatmap, commodities; Row 2 = finance (wide) -->
				<div class="columns-layout">
					{#if isPanelVisible('crypto')}
						<div class="panel-slot">
							<CryptoPanel />
						</div>
					{/if}

					{#if isPanelVisible('markets')}
						<div class="panel-slot">
							<MarketsPanel />
						</div>
					{/if}

					{#if isPanelVisible('heatmap')}
						<div class="panel-slot">
							<HeatmapPanel />
						</div>
					{/if}

					{#if isPanelVisible('commodities')}
						<div class="panel-slot">
							<CommoditiesPanel />
						</div>
					{/if}

					{#if isPanelVisible('finance')}
						<div class="panel-slot panel-wide">
							<NewsPanel
								category="finance"
								panelId="finance"
								title={t($language, 'newsTitle.finance')}
							/>
						</div>
					{/if}
				</div>
			{:else if $activeTab === 'social'}
				<!-- Trends and Analysis Tab: 2-row layout -->
				<div class="analysis-layout">
					<div class="analysis-row">
						{#if isPanelVisible('correlation')}
							<div class="panel-slot">
								<CorrelationPanel news={$allNewsItems} />
							</div>
						{/if}

						{#if isPanelVisible('narrative')}
							<div class="panel-slot">
								<NarrativePanel news={$allNewsItems} />
							</div>
						{/if}
					</div>

					{#if isPanelVisible('polymarket')}
						<PolymarketSection {predictions} />
					{/if}
				</div>
			{:else if $activeTab === 'technology'}
				<!-- Technology Tab: Standard columns layout -->
				<div class="columns-layout">
					{#if isPanelVisible('tech')}
						<div class="panel-slot">
							<NewsPanel category="tech" panelId="tech" title={t($language, 'newsTitle.tech')} />
						</div>
					{/if}

					{#if isPanelVisible('ai')}
						<div class="panel-slot">
							<NewsPanel category="ai" panelId="ai" title={t($language, 'newsTitle.ai')} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>

	<AlertStack />

	<!-- Modals -->
	<SettingsModal open={settingsOpen} onClose={() => (settingsOpen = false)} />
	<MonitorFormModal
		open={monitorFormOpen}
		onClose={() => (monitorFormOpen = false)}
		editMonitor={editingMonitor}
	/>
	<AddDataModal open={addDataOpen} onClose={() => (addDataOpen = false)} />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
	}

	.main-content {
		flex: 1;
		padding: 0.5rem;
		overflow-y: auto;
	}

	.map-container {
		margin-bottom: 0.5rem;
	}

	/* Tab content container */
	.tab-content {
		width: 100%;
	}

	/* Grid 2-row layout for Global tab */
	.grid-2row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.grid-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	/* Side-by-side layout for Regional tab */
	.side-by-side {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	.side-panel {
		min-height: 400px;
	}

	/* Standard columns layout for Economy, Social, Technology tabs */
	.columns-layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 0.5rem;
		width: 100%;
	}

	/* Wide panel spanning 2 columns */
	.panel-wide {
		grid-column: span 2;
	}

	/* Trends and Analysis tab layout */
	.analysis-layout {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.analysis-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	@media (max-width: 1024px) {
		.grid-row {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.main-content {
			padding: 0.25rem;
		}

		.grid-row {
			grid-template-columns: 1fr;
		}

		.side-by-side {
			grid-template-columns: 1fr;
		}

		.columns-layout {
			grid-template-columns: 1fr;
		}

		.panel-wide {
			grid-column: span 1;
		}

		.analysis-row {
			grid-template-columns: 1fr;
		}
	}
</style>
