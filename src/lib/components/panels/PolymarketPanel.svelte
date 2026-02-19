<script lang="ts">
	import { Panel } from '$lib/components/common';
	import { language } from '$lib/stores';
	import { t, type MessageKey } from '$lib/i18n';
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

	let sortBy = $state<SortOption>('volume');
	let filterBy = $state<FilterOption>('all');

	const filterOptions: { value: FilterOption; label: MessageKey }[] = [
		{ value: 'all', label: 'polymarket.filter.all' },
		{ value: 'politics', label: 'polymarket.filter.politics' },
		{ value: 'geopolitics', label: 'polymarket.filter.geopolitics' },
		{ value: 'tech', label: 'polymarket.filter.tech' },
		{ value: 'finance', label: 'polymarket.filter.finance' },
		{ value: 'elections', label: 'polymarket.filter.elections' }
	];

	const filteredPredictions = $derived.by(() => {
		if (filterBy === 'all') return predictions;
		return predictions.filter((p) => p.category === filterBy);
	});

	const sortedPredictions = $derived.by(() => {
		const sorted = [...filteredPredictions];
		switch (sortBy) {
			case 'volume':
				return sorted.sort((a, b) => b.volume - a.volume);
			case 'probability':
				return sorted.sort((a, b) => b.yes - a.yes);
			case 'volume24hr':
				return sorted.sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0));
			default:
				return sorted;
		}
	});

	const count = $derived(filteredPredictions.length);

	function formatVolume(v: number): string {
		if (!v) return '$0';
		if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
		if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
		return '$' + v.toFixed(0);
	}

	function handleSort(option: SortOption) {
		sortBy = option;
	}

	function handleFilter(option: FilterOption) {
		filterBy = option;
	}
</script>

<Panel id="polymarket" title={t($language, 'panelName.polymarket')} {count} {loading} {error}>
	{#snippet headerExtra()}
		<div class="sort-controls">
			<button
				class="sort-btn"
				class:active={sortBy === 'volume'}
				onclick={() => handleSort('volume')}
				title={t($language, 'polymarket.sort.volume')}
			>
				Vol
			</button>
			<button
				class="sort-btn"
				class:active={sortBy === 'probability'}
				onclick={() => handleSort('probability')}
				title={t($language, 'polymarket.sort.probability')}
			>
				%
			</button>
			<button
				class="sort-btn"
				class:active={sortBy === 'volume24hr'}
				onclick={() => handleSort('volume24hr')}
				title={t($language, 'polymarket.sort.volume24hr')}
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
				onclick={() => handleFilter(option.value)}
			>
				{t($language, option.label)}
			</button>
		{/each}
	</div>

	{#if sortedPredictions.length === 0 && !loading && !error}
		<div class="empty-state">{t($language, 'panel.polymarketEmpty')}</div>
	{:else}
		<div class="predictions-list">
			{#each sortedPredictions as pred (pred.id)}
				<a href={pred.url} target="_blank" rel="noopener noreferrer" class="prediction-item">
					<div class="prediction-info">
						<div class="prediction-question">{pred.question}</div>
						<div class="prediction-meta">
							<span class="prediction-volume">
								{t($language, 'polymarket.volume')}: {formatVolume(pred.volume)}
							</span>
							{#if pred.volume24hr}
								<span class="prediction-volume-24h">
									{t($language, 'polymarket.volume24h')}: {formatVolume(pred.volume24hr)}
								</span>
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

<style>
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
</style>
