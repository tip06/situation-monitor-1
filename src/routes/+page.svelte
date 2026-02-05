<script lang="ts">
	import { onMount } from 'svelte';
	import { Header, TabBar } from '$lib/components/layout';
	import { SettingsModal, MonitorFormModal, AddDataModal } from '$lib/components/modals';
	import {
		NewsPanel,
		MarketsPanel,
		HeatmapPanel,
		CommoditiesPanel,
		CryptoPanel,
		MainCharPanel,
		CorrelationPanel,
		NarrativePanel,
		MonitorsPanel,
		MapPanel,
		PolymarketPanel,
		LayoffsPanel,
		IntelPanel,
		SituationPanel
	} from '$lib/components/panels';
	import {
		news,
		markets,
		monitors,
		settings,
		refresh,
		allNewsItems,
		activeTab
	} from '$lib/stores';
	import { filterNews } from '$lib/utils';
	import {
		fetchAllNews,
		fetchAllMarkets,
		fetchPolymarket,
		fetchLayoffs
	} from '$lib/api';
	import type { Prediction, Layoff } from '$lib/api';
	import type { CustomMonitor } from '$lib/types';
	import type { PanelId } from '$lib/config';

	// Modal state
	let settingsOpen = $state(false);
	let monitorFormOpen = $state(false);
	let addDataOpen = $state(false);
	let editingMonitor = $state<CustomMonitor | null>(null);

	// Misc panel data
	let predictions = $state<Prediction[]>([]);
	let layoffs = $state<Layoff[]>([]);

	// Data fetching
	async function loadNews() {
		// Set loading for all categories
		const categories = ['politics', 'tech', 'finance', 'gov', 'ai', 'intel', 'brazil', 'latam', 'iran', 'venezuela', 'greenland'] as const;
		categories.forEach((cat) => news.setLoading(cat, true));

		try {
			const data = await fetchAllNews();
			Object.entries(data).forEach(([category, items]) => {
				news.setItems(category as keyof typeof data, items);
			});
		} catch (error) {
			categories.forEach((cat) => news.setError(cat, String(error)));
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
			const [predictionsData, layoffsData] = await Promise.all([
				fetchPolymarket(),
				fetchLayoffs()
			]);
			predictions = predictionsData;
			layoffs = layoffsData;
		} catch (error) {
			console.error('Failed to load misc data:', error);
		}
	}

	// Refresh handlers
	async function handleRefresh() {
		refresh.startRefresh();
		try {
			await Promise.all([loadNews(), loadMarkets()]);
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

	// Initial load
	onMount(() => {
		// Initialize tab store from localStorage
		activeTab.init();

		// Load initial data and track as refresh
		async function initialLoad() {
			refresh.startRefresh();
			try {
				await Promise.all([
					loadNews(),
					loadMarkets(),
					loadMiscData()
				]);
				refresh.endRefresh();
			} catch (error) {
				refresh.endRefresh([String(error)]);
			}
		}
		initialLoad();
		refresh.setupAutoRefresh(handleRefresh);

		return () => {
			refresh.stopAutoRefresh();
		};
	});
</script>

<svelte:head>
	<title>Situation Monitor</title>
	<meta name="description" content="Real-time global situation monitoring dashboard" />
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
										title: 'Iran Crisis',
										subtitle: 'Revolution protests, regime instability & nuclear program',
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
										title: 'Venezuela Watch',
										subtitle: 'Humanitarian crisis monitoring',
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
										title: 'Greenland Watch',
										subtitle: 'Arctic geopolitics monitoring',
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
								<NewsPanel category="politics" panelId="politics" title="Politics" />
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
							<NewsPanel category="brazil" panelId="brazil" title="Brazil" />
						</div>
					{/if}

					{#if isPanelVisible('latam')}
						<div class="panel-slot side-panel">
							<NewsPanel category="latam" panelId="latam" title="Latin America" />
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
							<NewsPanel category="finance" panelId="finance" title="Finance" />
						</div>
					{/if}
				</div>

			{:else if $activeTab === 'social'}
				<!-- Social Tab: Standard columns layout -->
				<div class="columns-layout">
					{#if isPanelVisible('mainchar')}
						<div class="panel-slot">
							<MainCharPanel />
						</div>
					{/if}

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

					{#if isPanelVisible('layoffs')}
						<div class="panel-slot">
							<LayoffsPanel {layoffs} />
						</div>
					{/if}

					{#if isPanelVisible('polymarket')}
						<div class="panel-slot">
							<PolymarketPanel {predictions} />
						</div>
					{/if}
				</div>

			{:else if $activeTab === 'technology'}
				<!-- Technology Tab: Standard columns layout -->
				<div class="columns-layout">
					{#if isPanelVisible('tech')}
						<div class="panel-slot">
							<NewsPanel category="tech" panelId="tech" title="Tech" />
						</div>
					{/if}

					{#if isPanelVisible('ai')}
						<div class="panel-slot">
							<NewsPanel category="ai" panelId="ai" title="AI" />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>

	<!-- Modals -->
	<SettingsModal
		open={settingsOpen}
		onClose={() => (settingsOpen = false)}
	/>
	<MonitorFormModal
		open={monitorFormOpen}
		onClose={() => (monitorFormOpen = false)}
		editMonitor={editingMonitor}
	/>
	<AddDataModal
		open={addDataOpen}
		onClose={() => (addDataOpen = false)}
	/>
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
	}
</style>
