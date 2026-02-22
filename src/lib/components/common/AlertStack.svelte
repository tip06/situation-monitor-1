<script lang="ts">
	import { alertPopups } from '$lib/stores/alertPopups';
	import { activeTab, alertNavigation } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { language } from '$lib/stores';
	import type { AlertPopup } from '$lib/alerts/engine';
	import type { MessageKey } from '$lib/i18n/messages/en';

	const items = $derived($alertPopups.items);

	function handleClick(item: AlertPopup) {
		if (item.tabId) {
			activeTab.setTab(item.tabId);
		}
		if (item.panelId && item.sourceId) {
			alertNavigation.navigate(item.panelId, item.sourceId);
		}
		alertPopups.dismiss(item.id);
	}

	function handleKeydown(event: KeyboardEvent, item: AlertPopup) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick(item);
		}
	}

	function handleDismiss(event: MouseEvent, id: string) {
		event.stopPropagation();
		alertPopups.dismiss(id);
	}

	function severityClass(severity: AlertPopup['severity']): string {
		if (severity === 'danger') return 'danger';
		if (severity === 'warning') return 'warning';
		return 'info';
	}

	function alertTitleKey(key: string): MessageKey {
		return key as MessageKey;
	}
</script>

{#if items.length > 0}
	<div class="alert-stack" role="status" aria-live="polite">
		{#each items as item (item.id)}
			<div
				class={`alert-popup ${severityClass(item.severity)}`}
				role="button"
				tabindex="0"
				onclick={() => handleClick(item)}
				onkeydown={(event) => handleKeydown(event, item)}
			>
				<div class="alert-header">
					<div class="alert-title">
						{t($language, alertTitleKey(item.titleKey))}
						<span class="alert-count">({item.count})</span>
					</div>
					<button
						class="alert-dismiss"
						onclick={(event) => handleDismiss(event, item.id)}
						aria-label={t($language, 'alerts.dismiss')}
						>
						×
					</button>
				</div>
				{#if item.detail}
					<div class="alert-detail">
						{t($language, 'alerts.example', { value: item.detail })}
					</div>
				{/if}
				<div class="alert-progress-bg">
					<div class="alert-progress-bar"></div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.alert-stack {
		position: fixed;
		top: 4.5rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		z-index: 1200;
		max-width: min(360px, 90vw);
	}

	.alert-popup {
		background: rgba(16, 16, 16, 0.96);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-left-width: 4px;
		border-radius: 8px;
		padding: 0.6rem 0.7rem;
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		position: relative;
		overflow: hidden;
	}

	.alert-popup:hover {
		transform: translateY(-2px);
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
	}

	.alert-popup.danger {
		border-left-color: var(--danger);
	}

	.alert-popup.warning {
		border-left-color: var(--warning);
	}

	.alert-popup.info {
		border-left-color: var(--accent);
	}

	.alert-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.alert-title {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-primary);
	}

	.alert-count {
		margin-left: 0.35rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.alert-dismiss {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
	}

	.alert-dismiss:hover {
		color: var(--text-primary);
	}

	.alert-detail {
		margin-top: 0.35rem;
		font-size: 0.62rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin-bottom: 0.3rem;
	}

	.alert-progress-bg {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: rgba(255, 255, 255, 0.05);
	}

	.alert-progress-bar {
		height: 100%;
		width: 100%;
		background: currentColor;
		opacity: 0.3;
		animation: progress 10s linear forwards;
		transform-origin: left;
	}

	.danger .alert-progress-bar {
		color: var(--danger);
	}

	.warning .alert-progress-bar {
		color: var(--warning);
	}

	.info .alert-progress-bar {
		color: var(--accent);
	}

	@keyframes progress {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>
