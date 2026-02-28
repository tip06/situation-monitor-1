<script lang="ts">
	import { Panel, MarketItem } from '$lib/components/common';
	import { indices, language } from '$lib/stores';
	import { t } from '$lib/i18n';

	const items = $derived($indices.items);
	const loading = $derived($indices.loading);
	const error = $derived($indices.error);
	const isStale = $derived($indices.isStale);
	const staleReason = $derived($indices.staleReason);
	const count = $derived(items.length);
	const status = $derived(isStale ? 'STALE' : '');
</script>

<Panel id="markets" title={t($language, 'panelName.markets')} {count} {loading} status={status} statusClass="elevated">
	{#if items.length === 0 && !loading}
		{#if error || staleReason}
			<div class="error-state">{error ?? staleReason}</div>
		{:else}
		<div class="empty-state">{t($language, 'panel.marketsEmpty')}</div>
		{/if}
	{:else}
		<div class="markets-list">
			{#if isStale && (staleReason || error)}
				<div class="stale-note">{staleReason ?? error}</div>
			{/if}
			{#each items as item (item.symbol)}
				<MarketItem {item} />
			{/each}
		</div>
	{/if}
</Panel>

<style>
	.markets-list {
		display: flex;
		flex-direction: column;
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

	.stale-note {
		margin-bottom: 0.4rem;
		padding: 0.3rem 0.4rem;
		font-size: 0.65rem;
		border-radius: 3px;
		color: #ffcf73;
		background: rgba(255, 165, 0, 0.12);
	}
</style>
