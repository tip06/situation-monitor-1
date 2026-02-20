<script lang="ts">
	import { onMount } from 'svelte';
	import { isRefreshing, lastRefresh, language, activeTab, alertNavigation } from '$lib/stores';
	import { alertPopups } from '$lib/stores/alertPopups';
	import type { AlertPopup } from '$lib/alerts/engine';
	import { t } from '$lib/i18n';
	import { toIntlLocale } from '$lib/i18n/types';

	interface Props {
		onSettingsClick?: () => void;
		onAddDataClick?: () => void;
	}

	let { onSettingsClick, onAddDataClick }: Props = $props();

	const intlLocale = $derived(toIntlLocale($language));
	let alertsOpen = $state(false);
	const alertHistory = $derived($alertPopups.history);
	const alertCount = $derived(alertHistory.length);
	let alertsRef = $state<HTMLDivElement | null>(null);
	const lastRefreshText = $derived(
		$lastRefresh
			? t($language, 'header.lastUpdated', {
					time: new Date($lastRefresh).toLocaleTimeString(intlLocale, {
						hour: 'numeric',
						minute: '2-digit'
					})
				})
			: t($language, 'header.neverRefreshed')
	);

	function handleAlertClick(alert: AlertPopup) {
		alertsOpen = false;
		if (alert.tabId) {
			activeTab.setTab(alert.tabId);
		}
		if (alert.panelId && alert.sourceId) {
			alertNavigation.navigate(alert.panelId, alert.sourceId);
		}
	}

	onMount(() => {
		function handleClick(event: MouseEvent) {
			if (!alertsOpen || !alertsRef) return;
			if (!alertsRef.contains(event.target as Node)) {
				alertsOpen = false;
			}
		}

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});
</script>

<header class="header">
	<div class="header-left">
		<h1 class="logo">{t($language, 'header.brand')}</h1>
	</div>

	<div class="header-center">
		<div class="refresh-status">
			{#if $isRefreshing}
				<span class="status-text loading">{t($language, 'header.refreshing')}</span>
			{:else}
				<span class="status-text">{lastRefreshText}</span>
			{/if}
		</div>
	</div>

	<div class="header-right">
		<div class="alerts-wrapper" bind:this={alertsRef}>
			<button
				class="header-btn alerts-btn"
				onclick={() => (alertsOpen = !alertsOpen)}
				title={t($language, 'header.alerts')}
			>
				<span class="btn-icon">!</span>
				<span class="btn-label">{t($language, 'header.alerts')}</span>
				{#if alertCount > 0}
					<span class="alert-badge">{alertCount}</span>
				{/if}
			</button>
			{#if alertsOpen}
				<div class="alerts-panel">
					<div class="alerts-panel-title">
						{t($language, 'alerts.recent')}
						<button class="alerts-clear" onclick={() => alertPopups.clearHistory()}>
							{t($language, 'alerts.clear')}
						</button>
					</div>
					{#if alertHistory.length === 0}
						<div class="alerts-empty">{t($language, 'alerts.none')}</div>
					{:else}
						<ul class="alerts-list">
							{#each alertHistory as alert (alert.id)}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="alerts-item"
									class:clickable={!!(alert.tabId || (alert.panelId && alert.sourceId))}
									onclick={() => handleAlertClick(alert)}
								>
									<div class="alerts-item-title">
										{t($language, alert.titleKey)}
										<span class="alerts-item-count">({alert.count})</span>
									</div>
									{#if alert.detail}
										<div class="alerts-item-detail">
											{alert.detail}
										</div>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
		<button
			class="header-btn add-data-btn"
			onclick={onAddDataClick}
			title={t($language, 'header.addDataTitle')}
		>
			<span class="btn-icon">+</span>
			<span class="btn-label">{t($language, 'header.addData')}</span>
		</button>
		<button
			class="header-btn settings-btn"
			onclick={onSettingsClick}
			title={t($language, 'header.settings')}
		>
			<span class="btn-icon">⚙</span>
			<span class="btn-label">{t($language, 'header.settings')}</span>
		</button>
	</div>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		z-index: 100;
		gap: 1rem;
	}

	.header-left {
		display: flex;
		align-items: baseline;
		flex-shrink: 0;
	}

	.logo {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--text-primary);
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.header-center {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: center;
		min-width: 0;
	}

	.refresh-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-text {
		font-size: 0.6rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status-text.loading {
		color: var(--accent);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.alerts-wrapper {
		position: relative;
	}

	.alerts-btn {
		position: relative;
	}

	.alert-badge {
		background: var(--danger);
		color: #fff;
		font-size: 0.55rem;
		padding: 0.05rem 0.35rem;
		border-radius: 999px;
	}

	.alerts-panel {
		position: absolute;
		right: 0;
		top: calc(100% + 0.4rem);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.6rem 0.7rem;
		min-width: 260px;
		max-width: 360px;
		max-height: 320px;
		overflow: auto;
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
		z-index: 1300;
	}

	.alerts-panel-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		margin-bottom: 0.4rem;
	}

	.alerts-clear {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		font-size: 0.55rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
		padding: 0;
	}

	.alerts-clear:hover {
		color: var(--text-primary);
	}

	.alerts-empty {
		font-size: 0.62rem;
		color: var(--text-muted);
	}

	.alerts-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.alerts-item {
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		padding-bottom: 0.5rem;
	}

	.alerts-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.alerts-item.clickable {
		cursor: pointer;
		border-radius: 4px;
		margin: 0 -0.3rem;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		transition: background 0.15s ease;
	}

	.alerts-item.clickable:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.alerts-item-title {
		font-size: 0.62rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	.alerts-item-count {
		margin-left: 0.35rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.alerts-item-detail {
		font-size: 0.58rem;
		color: var(--text-secondary);
		margin-top: 0.2rem;
	}

	.header-btn {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		min-height: 2.75rem;
		padding: 0.4rem 0.75rem;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
		font-size: 0.65rem;
	}

	.header-btn:hover {
		background: var(--border);
		color: var(--text-primary);
	}

	.btn-icon {
		font-size: 0.8rem;
	}

	.btn-label {
		display: none;
	}

	@media (min-width: 768px) {
		.btn-label {
			display: inline;
		}
	}
</style>
