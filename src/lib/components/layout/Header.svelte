<script lang="ts">
	import { isRefreshing, lastRefresh, language } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { toIntlLocale } from '$lib/i18n/types';

	interface Props {
		onSettingsClick?: () => void;
		onAddDataClick?: () => void;
	}

	let { onSettingsClick, onAddDataClick }: Props = $props();

	const intlLocale = $derived(toIntlLocale($language));
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
