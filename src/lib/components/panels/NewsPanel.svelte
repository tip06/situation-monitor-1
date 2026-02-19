<script lang="ts">
	import { Panel, NewsItem } from '$lib/components/common';
	import type { NewsCategory } from '$lib/types';
	import type { PanelId } from '$lib/config';
	import {
		politicsNews,
		techNews,
		financeNews,
		govNews,
		aiNews,
		intelNews,
		brazilNews,
		latamNews,
		iranNews,
		venezuelaNews,
		greenlandNews,
		fringeNews
	} from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';

	interface Props {
		category: NewsCategory;
		panelId: PanelId;
		title: string;
	}

	let { category, panelId, title }: Props = $props();

	// Filter state
	let searchQuery = $state('');
	let activeRegions = $state<Set<string>>(new Set());
	let activeTopics = $state<Set<string>>(new Set());

	// Get the appropriate derived store based on category
	const categoryStores = {
		politics: politicsNews,
		tech: techNews,
		finance: financeNews,
		gov: govNews,
		ai: aiNews,
		intel: intelNews,
		brazil: brazilNews,
		latam: latamNews,
		iran: iranNews,
		venezuela: venezuelaNews,
		greenland: greenlandNews,
		fringe: fringeNews
	};

	const categoryStore = $derived(categoryStores[category]);
	// Sort items by timestamp (newest first)
	const allItems = $derived([...$categoryStore.items].sort((a, b) => b.timestamp - a.timestamp));
	const loading = $derived($categoryStore.loading);
	const error = $derived($categoryStore.error);

	// Extract available regions and topics from current items
	const availableRegions = $derived(
		[...new Set(allItems.map((item) => item.region).filter((r): r is string => !!r))].sort()
	);
	const availableTopics = $derived(
		[
			...new Set(
				allItems.flatMap((item) => item.topics ?? []).filter((t): t is string => !!t)
			)
		].sort()
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
			result = result.filter((item) => item.region && activeRegions.has(item.region));
		}

		// Topic filter (OR within selected topics)
		if (activeTopics.size > 0) {
			result = result.filter(
				(item) => item.topics && item.topics.some((t) => activeTopics.has(t))
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
</script>

<Panel id={panelId} {title} {count} {loading} {error}>
	{#if allItems.length === 0 && !loading && !error}
		<div class="empty-state">{t($language, 'news.empty')}</div>
	{:else}
		<!-- Filter toolbar -->
		{#if allItems.length > 0}
			<div class="filter-toolbar">
				<div class="search-row">
					<input
						type="text"
						class="search-input"
						placeholder={t($language, 'common.searchHeadlines')}
						bind:value={searchQuery}
					/>
					{#if hasActiveFilters}
						<button class="clear-btn" onclick={clearFilters} title={t($language, 'common.clearFilters')}>
							&times;
						</button>
					{/if}
				</div>

				{#if availableRegions.length > 0}
					<div class="chip-row">
						<span class="chip-label">{t($language, 'common.region')}</span>
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
						<span class="chip-label">{t($language, 'common.topic')}</span>
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

		<!-- News list -->
		{#if items.length === 0 && hasActiveFilters}
			<div class="empty-state">{t($language, 'news.noMatches')}</div>
		{:else}
			<div class="news-list">
				{#each items as item (item.id)}
					<NewsItem {item} />
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

	.news-list {
		display: flex;
		flex-direction: column;
		max-height: 400px;
		overflow-y: auto;
		padding-right: 0.25rem;
	}

	/* Custom scrollbar */
	.news-list::-webkit-scrollbar {
		width: 6px;
	}

	.news-list::-webkit-scrollbar-track {
		background: var(--bg-secondary);
		border-radius: 3px;
	}

	.news-list::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: 3px;
	}

	.news-list::-webkit-scrollbar-thumb:hover {
		background: var(--text-muted);
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}
</style>
