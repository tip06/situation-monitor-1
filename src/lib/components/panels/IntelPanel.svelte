<script lang="ts">
	import { Panel, Badge } from '$lib/components/common';
	import { getRelativeTime } from '$lib/utils';
	import { intelNews } from '$lib/stores';
	import type { NewsItem } from '$lib/types';

	type SourceType = 'osint' | 'govt' | 'think-tank' | 'defense' | 'regional' | 'cyber';

	interface IntelItem {
		id: string;
		title: string;
		description?: string;
		link: string;
		source: string;
		sourceType: SourceType;
		regions: string[];
		topics: string[];
		pubDate?: string;
		isPriority?: boolean;
	}

	// Filter state
	let searchQuery = $state('');
	let activeRegions = $state<Set<string>>(new Set());
	let activeTopics = $state<Set<string>>(new Set());

	// Destructure store state for cleaner access
	const { items: storeItems, loading, error } = $derived($intelNews);

	// Infer source type from source name
	function inferSourceType(source: string): SourceType {
		const s = source.toLowerCase();
		if (s.includes('cisa') || s.includes('krebs') || s.includes('cyber')) return 'cyber';
		if (s.includes('bellingcat')) return 'osint';
		if (s.includes('defense') || s.includes('war') || s.includes('military')) return 'defense';
		if (s.includes('diplomat') || s.includes('monitor')) return 'regional';
		if (s.includes('white house') || s.includes('fed') || s.includes('sec') || s.includes('dod'))
			return 'govt';
		return 'think-tank';
	}

	// Transform NewsItem to IntelItem
	function transformToIntelItem(item: NewsItem): IntelItem {
		return {
			id: item.id,
			title: item.title,
			description: item.description,
			link: item.link,
			source: item.source,
			sourceType: inferSourceType(item.source),
			regions: item.region ? [item.region] : [],
			topics: item.topics || [],
			pubDate: item.pubDate,
			isPriority: item.isAlert
		};
	}

	// Sort by timestamp (newest first) then transform
	const allItems = $derived(
		[...storeItems].sort((a, b) => b.timestamp - a.timestamp).map(transformToIntelItem)
	);

	// Extract available regions and topics from current items
	const availableRegions = $derived(
		[...new Set(allItems.flatMap((item) => item.regions).filter((r) => !!r))].sort()
	);
	const availableTopics = $derived(
		[...new Set(allItems.flatMap((item) => item.topics).filter((t) => !!t))].sort()
	);

	// Filtered items: text AND region AND topic
	const filteredItems = $derived(() => {
		let result = allItems;

		// Text search (case-insensitive on title + description)
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			result = result.filter((item) => {
				const text = `${item.title} ${item.description ?? ''}`.toLowerCase();
				return text.includes(q);
			});
		}

		// Region filter (OR within selected regions)
		if (activeRegions.size > 0) {
			result = result.filter(
				(item) => item.regions.length > 0 && item.regions.some((r) => activeRegions.has(r))
			);
		}

		// Topic filter (OR within selected topics)
		if (activeTopics.size > 0) {
			result = result.filter(
				(item) => item.topics.length > 0 && item.topics.some((t) => activeTopics.has(t))
			);
		}

		return result;
	});

	const items = $derived(filteredItems());
	const count = $derived(items.length);

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || activeRegions.size > 0 || activeTopics.size > 0
	);

	function toggleRegion(region: string) {
		const next = new Set(activeRegions);
		if (next.has(region)) {
			next.delete(region);
		} else {
			next.add(region);
		}
		activeRegions = next;
	}

	function toggleTopic(topic: string) {
		const next = new Set(activeTopics);
		if (next.has(topic)) {
			next.delete(topic);
		} else {
			next.add(topic);
		}
		activeTopics = next;
	}

	function clearFilters() {
		searchQuery = '';
		activeRegions = new Set();
		activeTopics = new Set();
	}

	type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

	const SOURCE_BADGE_VARIANTS: Record<string, BadgeVariant> = {
		osint: 'info',
		govt: 'warning',
		cyber: 'danger'
	};

	function getSourceBadgeVariant(type: string): BadgeVariant {
		return SOURCE_BADGE_VARIANTS[type] ?? 'default';
	}
</script>

<Panel id="intel" title="Intel Feed" {count} {loading} {error}>
	{#if allItems.length === 0 && !loading && !error}
		<div class="empty-state">No intel available</div>
	{:else}
		<!-- Filter toolbar -->
		{#if allItems.length > 0}
			<div class="filter-toolbar">
				<div class="search-row">
					<input
						type="text"
						class="search-input"
						placeholder="Search intel..."
						bind:value={searchQuery}
					/>
					{#if hasActiveFilters}
						<button class="clear-btn" onclick={clearFilters} title="Clear all filters">
							&times;
						</button>
					{/if}
				</div>

				{#if availableRegions.length > 0}
					<div class="chip-row">
						<span class="chip-label">Region:</span>
						{#each availableRegions as region}
							<button
								class="chip"
								class:active={activeRegions.has(region)}
								onclick={() => toggleRegion(region)}
							>
								{region}
							</button>
						{/each}
					</div>
				{/if}

				{#if availableTopics.length > 0}
					<div class="chip-row">
						<span class="chip-label">Topic:</span>
						{#each availableTopics as topic}
							<button
								class="chip"
								class:active={activeTopics.has(topic)}
								onclick={() => toggleTopic(topic)}
							>
								{topic}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Intel list -->
		{#if items.length === 0 && hasActiveFilters}
			<div class="empty-state">No items match filters</div>
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
	{/if}
</Panel>

<style>
	.filter-toolbar {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding-bottom: 0.4rem;
		margin-bottom: 0.4rem;
		border-bottom: 1px solid var(--border);
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.search-input {
		flex: 1;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 3px;
		color: var(--text);
		font-size: 0.6rem;
		padding: 0.25rem 0.4rem;
		outline: none;
		transition: border-color 0.15s;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.search-input:focus {
		border-color: var(--indigo);
	}

	.clear-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: 3px;
		color: var(--text-muted);
		font-size: 0.7rem;
		line-height: 1;
		padding: 0.2rem 0.35rem;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}

	.clear-btn:hover {
		color: var(--red);
		border-color: var(--red);
	}

	.chip-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.chip-label {
		font-size: 0.5rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		min-width: 2.5rem;
	}

	.chip {
		font-size: 0.5rem;
		padding: 0.1rem 0.35rem;
		border-radius: 2px;
		border: 1px solid var(--border-light);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		transition: all 0.15s;
	}

	.chip:hover {
		border-color: var(--indigo);
		color: var(--text);
	}

	.chip.active {
		background: rgba(79, 70, 229, 0.2);
		border-color: var(--indigo);
		color: white;
	}

	.intel-list {
		display: flex;
		flex-direction: column;
		max-height: 400px;
		overflow-y: auto;
		padding-right: 0.25rem;
	}

	/* Custom scrollbar */
	.intel-list::-webkit-scrollbar {
		width: 6px;
	}

	.intel-list::-webkit-scrollbar-track {
		background: var(--bg-secondary);
		border-radius: 3px;
	}

	.intel-list::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: 3px;
	}

	.intel-list::-webkit-scrollbar-thumb:hover {
		background: var(--text-muted);
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
