<script lang="ts">
	import { Panel, NewsItem } from '$lib/components/common';
	import type { NewsCategory } from '$lib/types';
	import type { PanelId } from '$lib/config';
	import { politicsNews, techNews, financeNews, govNews, aiNews, intelNews, brazilNews, latamNews, iranNews, venezuelaNews, greenlandNews } from '$lib/stores';

	interface Props {
		category: NewsCategory;
		panelId: PanelId;
		title: string;
	}

	let { category, panelId, title }: Props = $props();

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
		greenland: greenlandNews
	};

	const categoryStore = $derived(categoryStores[category]);
	// Sort items by timestamp (newest first)
	const items = $derived(
		[...$categoryStore.items].sort((a, b) => b.timestamp - a.timestamp)
	);
	const loading = $derived($categoryStore.loading);
	const error = $derived($categoryStore.error);
	const count = $derived(items.length);
</script>

<Panel id={panelId} {title} {count} {loading} {error}>
	{#if items.length === 0 && !loading && !error}
		<div class="empty-state">No news available</div>
	{:else}
		<div class="news-list">
			{#each items as item (item.id)}
				<NewsItem {item} />
			{/each}
		</div>
	{/if}
</Panel>

<style>
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
