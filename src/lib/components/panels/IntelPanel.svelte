<script lang="ts">
	import { Panel, Badge } from '$lib/components/common';
	import { getRelativeTime } from '$lib/utils';

	interface IntelItem {
		id: string;
		title: string;
		link: string;
		source: string;
		sourceType: 'osint' | 'govt' | 'think-tank' | 'defense' | 'regional' | 'cyber';
		regions: string[];
		topics: string[];
		pubDate?: string;
		isPriority?: boolean;
	}

	interface Props {
		items?: IntelItem[];
		loading?: boolean;
		error?: string | null;
	}

	let { items = [], loading = false, error = null }: Props = $props();

	const count = $derived(items.length);

	function getSourceBadgeVariant(
		type: string
	): 'default' | 'success' | 'warning' | 'danger' | 'info' {
		switch (type) {
			case 'osint':
				return 'info';
			case 'govt':
				return 'warning';
			case 'cyber':
				return 'danger';
			default:
				return 'default';
		}
	}
</script>

<Panel id="intel" title="Intel Feed" {count} {loading} {error}>
	{#if items.length === 0 && !loading && !error}
		<div class="empty-state">No intel available</div>
	{:else}
		<div class="intel-list">
			{#each items as item (item.id)}
				<div class="intel-item" class:priority={item.isPriority}>
					<div class="intel-header">
						<span class="intel-source">{item.source}</span>
						<div class="intel-tags">
							<Badge
								text={item.sourceType.toUpperCase()}
								variant={getSourceBadgeVariant(item.sourceType)}
							/>
							{#each item.regions.slice(0, 2) as region}
								<Badge text={region} variant="info" />
							{/each}
							{#each item.topics.slice(0, 2) as topic}
								<Badge text={topic} />
							{/each}
						</div>
					</div>
					<a href={item.link} target="_blank" rel="noopener noreferrer" class="intel-title">
						{item.title}
					</a>
					{#if item.pubDate}
						<div class="intel-meta">
							<span>{getRelativeTime(item.pubDate)}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</Panel>

<style>
	.intel-list {
		display: flex;
		flex-direction: column;
	}

	.intel-item {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}

	.intel-item:last-child {
		border-bottom: none;
	}

	.intel-item.priority {
		background: rgba(255, 165, 0, 0.08);
		margin: 0 -0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 165, 0, 0.2);
	}

	.intel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.3rem;
		gap: 0.5rem;
	}

	.intel-source {
		font-size: 0.55rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.intel-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
	}

	.intel-title {
		display: block;
		font-size: 0.65rem;
		color: var(--text-primary);
		text-decoration: none;
		line-height: 1.35;
	}

	.intel-title:hover {
		color: var(--accent);
	}

	.intel-meta {
		margin-top: 0.25rem;
		font-size: 0.55rem;
		color: var(--text-muted);
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}
</style>
