<script lang="ts">
	import { Panel, MarketItem } from '$lib/components/common';
	import { commodities, vix, language } from '$lib/stores';
	import { t } from '$lib/i18n';

	const items = $derived($commodities.items);
	const loading = $derived($commodities.loading);
	const error = $derived($commodities.error);
	const isStale = $derived($commodities.isStale);
	const staleReason = $derived($commodities.staleReason);

	// VIX status for panel header
	const vixStatus = $derived(getVixStatus($vix?.price));
	const vixClass = $derived(getVixClass($vix?.price));
	const panelStatus = $derived(isStale ? 'STALE' : vixStatus);
	const panelStatusClass = $derived(isStale ? 'elevated' : vixClass);

	function getVixStatus(level: number | undefined): string {
		if (level === undefined) return '';
		if (level >= 30) return t($language, 'panel.vixHighFear');
		if (level >= 20) return t($language, 'threat.elevated').toUpperCase();
		return t($language, 'threat.low').toUpperCase();
	}

	function getVixClass(level: number | undefined): string {
		if (level === undefined) return '';
		if (level >= 30) return 'critical';
		if (level >= 20) return 'elevated';
		return 'monitoring';
	}
</script>

<Panel
	id="commodities"
	title={t($language, 'panelName.commodities')}
	status={panelStatus}
	statusClass={panelStatusClass}
	{loading}
>
	{#if items.length === 0 && !loading}
		{#if error || staleReason}
			<div class="error-state">{error ?? staleReason}</div>
		{:else}
			<div class="empty-state">{t($language, 'panel.commoditiesEmpty')}</div>
		{/if}
	{:else}
		<div class="commodities-list">
			{#if isStale && (staleReason || error)}
				<div class="stale-note">{staleReason ?? error}</div>
			{/if}
			{#each items as item (item.symbol)}
				<MarketItem {item} currencySymbol={item.symbol === '^VIX' ? '' : '$'} />
			{/each}
		</div>
	{/if}
</Panel>

<style>
	.commodities-list {
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
