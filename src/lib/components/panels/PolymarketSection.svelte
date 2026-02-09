<script lang="ts">
	import { Panel } from '$lib/components/common';
	import SpeedometerGauge from './SpeedometerGauge.svelte';
	import type { PredictionCategory } from '$lib/api/misc';

	type SortOption = 'volume' | 'probability' | 'volume24hr';
	type FilterOption = 'all' | PredictionCategory;

	interface Prediction {
		id: string;
		question: string;
		yes: number;
		volume: number;
		volume24hr?: number;
		url?: string;
		endDate?: string;
		category: PredictionCategory;
	}

	interface Props {
		predictions?: Prediction[];
		loading?: boolean;
		error?: string | null;
	}

	let { predictions = [], loading = false, error = null }: Props = $props();

	// Row 3 state
	let sortBy = $state<SortOption>('volume');
	let filterBy = $state<FilterOption>('all');

	const filterOptions: { value: FilterOption; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'politics', label: 'Politics' },
		{ value: 'geopolitics', label: 'Geo' },
		{ value: 'tech', label: 'Tech' },
		{ value: 'finance', label: 'Finance' },
		{ value: 'elections', label: 'Elections' }
	];

	const categoryLabels: Record<PredictionCategory, string> = {
		politics: 'Politics',
		geopolitics: 'Geopolitics',
		tech: 'Tech',
		finance: 'Finance',
		elections: 'Elections'
	};

	// Row 1: Top 3 geopolitical markets by volume
	const topGeopolitical = $derived(
		predictions
			.filter((p) => p.category === 'geopolitics')
			.sort((a, b) => b.volume - a.volume)
			.slice(0, 3)
	);

	// Row 2: Category feeds — top 10 by 24h volume per category
	const categoryFeeds = $derived.by(() => {
		const categories: PredictionCategory[] = ['politics', 'geopolitics', 'tech', 'finance', 'elections'];
		const feeds: Record<string, Prediction[]> = {};
		for (const cat of categories) {
			feeds[cat] = predictions
				.filter((p) => p.category === cat)
				.sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0))
				.slice(0, 10);
		}
		return feeds;
	});

	// Row 3: Filterable table
	const filteredPredictions = $derived.by(() => {
		let filtered = filterBy === 'all' ? predictions : predictions.filter((p) => p.category === filterBy);
		const sorted = [...filtered];
		switch (sortBy) {
			case 'volume':
				sorted.sort((a, b) => b.volume - a.volume);
				break;
			case 'probability':
				sorted.sort((a, b) => b.yes - a.yes);
				break;
			case 'volume24hr':
				sorted.sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0));
				break;
		}
		const limit = filterBy === 'all' ? 20 : 10;
		return sorted.slice(0, limit);
	});

	const tableCount = $derived(filteredPredictions.length);

	function formatVolume(v: number): string {
		if (!v) return '$0';
		if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
		if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
		return '$' + v.toFixed(0);
	}
</script>

<div class="polymarket-section">
	<!-- Row 1: Top Geopolitical Markets -->
	{#if topGeopolitical.length > 0}
		<div class="section-block">
			<div class="section-header">Top Geopolitical Markets</div>
			<div class="speedometer-row">
				{#each topGeopolitical as market (market.id)}
					<div class="speedometer-cell">
						<SpeedometerGauge
							value={market.yes}
							label={market.question}
							volume={formatVolume(market.volume)}
							url={market.url || ''}
						/>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Row 2: Category Feeds -->
	<div class="section-block">
		<div class="section-header">Category Feeds</div>
		<div class="category-feeds-row">
			{#each Object.entries(categoryFeeds) as [category, items] (category)}
				<div class="category-column">
					<div class="category-title">{categoryLabels[category as PredictionCategory]}</div>
					<div class="category-list">
						{#if items.length === 0}
							<div class="empty-category">No markets</div>
						{:else}
							{#each items as item (item.id)}
								<a href={item.url} target="_blank" rel="noopener noreferrer" class="feed-item">
									<div class="feed-question">{item.question}</div>
									<div class="feed-meta">
										<span class="feed-yes">{item.yes}%</span>
										<span class="feed-vol">{formatVolume(item.volume24hr || 0)}</span>
									</div>
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Row 3: Filterable Table -->
	<Panel id="polymarket" title="Polymarket" count={tableCount} {loading} {error}>
		{#snippet headerExtra()}
			<div class="sort-controls">
				<button
					class="sort-btn"
					class:active={sortBy === 'volume'}
					onclick={() => (sortBy = 'volume')}
					title="Sort by total volume"
				>
					Vol
				</button>
				<button
					class="sort-btn"
					class:active={sortBy === 'probability'}
					onclick={() => (sortBy = 'probability')}
					title="Sort by Yes probability"
				>
					%
				</button>
				<button
					class="sort-btn"
					class:active={sortBy === 'volume24hr'}
					onclick={() => (sortBy = 'volume24hr')}
					title="Sort by 24h volume"
				>
					24h
				</button>
			</div>
		{/snippet}

		<div class="filter-controls">
			{#each filterOptions as option (option.value)}
				<button
					class="filter-btn"
					class:active={filterBy === option.value}
					onclick={() => (filterBy = option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>

		{#if filteredPredictions.length === 0 && !loading && !error}
			<div class="empty-state">No predictions available</div>
		{:else}
			<div class="predictions-list">
				{#each filteredPredictions as pred (pred.id)}
					<a href={pred.url} target="_blank" rel="noopener noreferrer" class="prediction-item">
						<div class="prediction-info">
							<div class="prediction-question">{pred.question}</div>
							<div class="prediction-meta">
								<span class="prediction-volume">Vol: {formatVolume(pred.volume)}</span>
								{#if pred.volume24hr}
									<span class="prediction-volume-24h">24h: {formatVolume(pred.volume24hr)}</span>
								{/if}
							</div>
						</div>
						<div class="prediction-odds">
							<span class="prediction-yes">{pred.yes}%</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</Panel>
</div>

<style>
	.polymarket-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.section-block {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0.75rem;
	}

	.section-header {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}

	/* Row 1: Speedometers */
	.speedometer-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.speedometer-cell {
		display: flex;
		justify-content: center;
	}

	/* Row 2: Category Feeds */
	.category-feeds-row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.category-column {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.category-title {
		font-size: 0.55rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--accent);
		padding-bottom: 0.35rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 0.35rem;
	}

	.category-list {
		max-height: 280px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.empty-category {
		font-size: 0.55rem;
		color: var(--text-muted);
		text-align: center;
		padding: 1rem 0;
	}

	.feed-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.35rem 0.25rem;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
		transition: background 0.15s ease;
	}

	.feed-item:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.feed-item:last-child {
		border-bottom: none;
	}

	.feed-question {
		font-size: 0.55rem;
		color: var(--text-primary);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.feed-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.feed-yes {
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--success);
		font-variant-numeric: tabular-nums;
	}

	.feed-vol {
		font-size: 0.45rem;
		color: var(--text-muted);
	}

	/* Row 3: Table controls (inside Panel) */
	.sort-controls {
		display: flex;
		gap: 0.25rem;
		margin-left: auto;
	}

	.sort-btn {
		background: transparent;
		border: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 0.5rem;
		padding: 0.15rem 0.3rem;
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sort-btn:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}

	.sort-btn.active {
		background: transparent;
		border-color: #ffffff;
		color: #ffffff;
	}

	.filter-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.filter-btn {
		background: transparent;
		border: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 0.5rem;
		padding: 0.15rem 0.35rem;
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.filter-btn:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}

	.filter-btn.active {
		background: transparent;
		border-color: var(--accent);
		color: var(--accent);
	}

	.predictions-list {
		display: flex;
		flex-direction: column;
	}

	.prediction-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
		transition: background 0.15s ease;
	}

	.prediction-item:hover {
		background: var(--bg-secondary);
	}

	.prediction-item:last-child {
		border-bottom: none;
	}

	.prediction-info {
		flex: 1;
		min-width: 0;
	}

	.prediction-question {
		font-size: 0.65rem;
		color: var(--text-primary);
		line-height: 1.3;
		margin-bottom: 0.2rem;
	}

	.prediction-meta {
		display: flex;
		gap: 0.5rem;
	}

	.prediction-volume,
	.prediction-volume-24h {
		font-size: 0.55rem;
		color: var(--text-muted);
	}

	.prediction-odds {
		margin-left: 0.5rem;
	}

	.prediction-yes {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--success);
		font-variant-numeric: tabular-nums;
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.category-feeds-row {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.speedometer-row {
			grid-template-columns: repeat(2, 1fr);
		}

		.category-feeds-row {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.speedometer-row {
			grid-template-columns: 1fr;
		}

		.category-feeds-row {
			grid-template-columns: 1fr;
		}
	}
</style>
