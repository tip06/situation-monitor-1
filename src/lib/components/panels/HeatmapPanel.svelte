<script lang="ts">
	import { Panel, HeatmapCell } from '$lib/components/common';
	import { sectors, language } from '$lib/stores';
	import { t } from '$lib/i18n';

	const items = $derived($sectors.items);
	const loading = $derived($sectors.loading);
	const error = $derived($sectors.error);
	const isStale = $derived($sectors.isStale);
	const staleReason = $derived($sectors.staleReason);
	const status = $derived(isStale ? 'STALE' : '');
</script>

<Panel id="heatmap" title={t($language, 'panelName.heatmap')} {loading} status={status} statusClass="elevated">
	{#if items.length === 0 && !loading}
		{#if error || staleReason}
			<div class="error-state">{error ?? staleReason}</div>
		{:else}
			<div class="empty-state">{t($language, 'panel.heatmapEmpty')}</div>
		{/if}
	{:else}
		<div class="heatmap-grid">
			{#if isStale && (staleReason || error)}
				<div class="stale-note">{staleReason ?? error}</div>
			{/if}
			{#each items as sector (sector.symbol)}
				<HeatmapCell {sector} />
			{/each}
		</div>
	{/if}
</Panel>

<style>
	.heatmap-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.25rem;
	}

	.stale-note {
		grid-column: 1 / -1;
		padding: 0.3rem 0.4rem;
		font-size: 0.65rem;
		border-radius: 3px;
		color: #ffcf73;
		background: rgba(255, 165, 0, 0.12);
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}

	.error-state {
		text-align: center;
		color: var(--danger);
		font-size: 0.7rem;
		padding: 1rem;
	}

	@media (max-width: 400px) {
		.heatmap-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
