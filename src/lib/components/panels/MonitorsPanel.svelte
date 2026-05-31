<script lang="ts">
	import { Panel, Badge } from '$lib/components/common';
	import { timeAgo } from '$lib/utils';
	import type { CustomMonitor } from '$lib/types';
	import type { MonitorMatch } from '$lib/stores/monitors';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';

	interface Props {
		monitors?: CustomMonitor[];
		matches?: MonitorMatch[];
		loading?: boolean;
		error?: string | null;
		onCreateMonitor?: () => void;
		onEditMonitor?: (monitor: CustomMonitor) => void;
		onDeleteMonitor?: (id: string) => void;
		onToggleMonitor?: (id: string) => void;
	}

	let {
		monitors = [],
		matches = [],
		loading = false,
		error = null,
		onCreateMonitor,
		onEditMonitor,
		onDeleteMonitor,
		onToggleMonitor
	}: Props = $props();

	const activeMonitors = $derived(monitors.filter((m) => m.enabled));
	const count = $derived(matches.length);

	function getMatchesForMonitor(monitorId: string): MonitorMatch[] {
		return matches
			.filter((m) => m.monitor.id === monitorId)
			.sort((a, b) => b.item.timestamp - a.item.timestamp)
			.slice(0, 3);
	}

	function getMonitorQuery(monitor: CustomMonitor): string {
		return monitor.query?.trim() || monitor.keywords.join(', ');
	}
</script>

<Panel id="monitors" title={t($language, 'monitors.title')} {count} {loading} {error}>
	<div class="monitors-content">
		{#if monitors.length === 0 && !loading && !error}
			<div class="empty-state">
				<p>{t($language, 'monitors.empty')}</p>
				{#if onCreateMonitor}
					<button class="create-btn" onclick={onCreateMonitor}
						>{t($language, 'monitors.create')}</button
					>
				{/if}
			</div>
		{:else}
			<div class="monitors-header">
				<span class="active-count"
					>{t($language, 'monitors.active', { count: activeMonitors.length })}</span
				>
				{#if onCreateMonitor}
					<button class="add-btn" onclick={onCreateMonitor}>+</button>
				{/if}
			</div>

			<div class="monitors-list">
				{#each monitors as monitor (monitor.id)}
					<div class="monitor-item" class:disabled={!monitor.enabled}>
						<div class="monitor-header">
							<div class="monitor-info">
								{#if monitor.color}
									<span class="monitor-color" style="background: {monitor.color}"></span>
								{/if}
								<span class="monitor-name">{monitor.name}</span>
								{#if monitor.matchCount > 0}
									<Badge text={String(monitor.matchCount)} variant="info" />
								{/if}
							</div>
							<div class="monitor-actions">
								{#if onToggleMonitor}
									<button
										class="action-btn"
										class:active={monitor.enabled}
										onclick={() => onToggleMonitor?.(monitor.id)}
										title={monitor.enabled
											? t($language, 'monitors.disable')
											: t($language, 'monitors.enable')}
									>
										{monitor.enabled ? '●' : '○'}
									</button>
								{/if}
								{#if onEditMonitor}
									<button
										class="action-btn"
										onclick={() => onEditMonitor?.(monitor)}
										title={t($language, 'monitors.edit')}
									>
										✎
									</button>
								{/if}
								{#if onDeleteMonitor}
									<button
										class="action-btn delete"
										onclick={() => onDeleteMonitor?.(monitor.id)}
										title={t($language, 'monitors.delete')}
									>
										×
									</button>
								{/if}
							</div>
						</div>

						{#if getMonitorQuery(monitor)}
							<div class="monitor-keywords">
								<span class="keyword query">{getMonitorQuery(monitor)}</span>
							</div>
						{/if}

						{#if monitor.location}
							<div class="monitor-location">
								📍 {monitor.location.name}
							</div>
						{/if}

						{#if getMatchesForMonitor(monitor.id).length > 0}
							<div class="monitor-matches">
								{#each getMatchesForMonitor(monitor.id) as match}
									<div class="match-item">
										<a
											href={match.item.link}
											target="_blank"
											rel="noopener noreferrer"
											class="match-title"
										>
											{match.item.title.length > 80
												? match.item.title.substring(0, 80) + '...'
												: match.item.title}
										</a>
										<div class="match-meta">
											<span class="match-keyword">"{match.matchedKeywords.join(', ')}"</span>
											<span class="match-time">{timeAgo(match.item.timestamp, $language)}</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
				{#if onCreateMonitor && activeMonitors.length > 0}
					<button class="add-monitor-card" onclick={onCreateMonitor}>
						<span class="add-monitor-icon">+</span>
						<span>{t($language, 'monitors.create')}</span>
					</button>
				{/if}
			</div>
		{/if}
	</div>
</Panel>

<style>
	.monitors-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.monitors-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--border);
	}

	.active-count {
		font-size: 0.55rem;
		color: var(--text-secondary);
	}

	.add-btn {
		width: 1.2rem;
		height: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-secondary);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.add-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--accent);
	}

	.monitors-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.monitor-item {
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.monitor-item.disabled {
		opacity: 0.5;
	}

	.add-monitor-card {
		width: 100%;
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.65rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px dashed var(--border);
		border-radius: 4px;
		color: var(--text-secondary);
		font-size: 0.6rem;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.add-monitor-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: var(--accent);
		color: var(--text-primary);
	}

	.add-monitor-icon {
		width: 1rem;
		height: 1rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		line-height: 1;
	}

	.monitor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.3rem;
	}

	.monitor-info {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.monitor-color {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.monitor-name {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.monitor-actions {
		display: flex;
		gap: 0.2rem;
	}

	.action-btn {
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: var(--text-muted);
		font-size: 0.65rem;
		cursor: pointer;
		border-radius: 2px;
	}

	.action-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--text-primary);
	}

	.action-btn.active {
		color: var(--success);
	}

	.action-btn.delete:hover {
		color: var(--danger);
	}

	.monitor-keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
		margin-bottom: 0.3rem;
	}

	.keyword {
		font-size: 0.5rem;
		padding: 0.1rem 0.3rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
		color: var(--text-secondary);
	}

	.keyword.query {
		max-width: 100%;
		overflow-wrap: anywhere;
		line-height: 1.4;
	}

	.monitor-location {
		font-size: 0.5rem;
		color: var(--text-muted);
		margin-bottom: 0.3rem;
	}

	.monitor-matches {
		border-top: 1px solid var(--border);
		padding-top: 0.3rem;
		margin-top: 0.2rem;
	}

	.match-item {
		padding: 0.2rem 0;
	}

	.match-title {
		display: block;
		font-size: 0.55rem;
		color: var(--text-primary);
		text-decoration: none;
		line-height: 1.3;
	}

	.match-title:hover {
		color: var(--accent);
	}

	.match-meta {
		display: flex;
		justify-content: space-between;
		margin-top: 0.1rem;
	}

	.match-keyword {
		font-size: 0.5rem;
		color: var(--warning);
	}

	.match-time {
		font-size: 0.5rem;
		color: var(--text-muted);
	}

	.empty-state {
		text-align: center;
		padding: 1rem;
	}

	.empty-state p {
		color: var(--text-secondary);
		font-size: 0.7rem;
		margin-bottom: 0.5rem;
	}

	.create-btn {
		padding: 0.4rem 0.8rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-primary);
		font-size: 0.6rem;
		cursor: pointer;
	}

	.create-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--accent);
	}
</style>
