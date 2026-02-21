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
		fringeNews,
		alertNavigation
	} from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { tick } from 'svelte';

	interface Props {
		category: NewsCategory;
		panelId: PanelId;
		title: string;
	}

	let { category, panelId, title }: Props = $props();
	let isExpanded = $state(false);
	let highlightedId = $state<string | null>(null);
	let newsList = $state<HTMLElement | null>(null);
	let lastNavNonce = 0;

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
	const items = $derived.by(() => {
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

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function closeExpanded() {
		isExpanded = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isExpanded) {
			closeExpanded();
		}
	}

	$effect(() => {
		const nav = $alertNavigation;
		if (nav.nonce === 0 || nav.nonce === lastNavNonce) return;
		if (nav.panelId !== panelId || !nav.sourceId) return;
		lastNavNonce = nav.nonce;

		const targetId = nav.sourceId;
		tick().then(() => {
			if (!newsList) return;
			const el = newsList.querySelector<HTMLElement>(`[data-news-id="${targetId}"]`);
			if (!el) return;
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			highlightedId = targetId;
			setTimeout(() => { highlightedId = null; }, 2000);
		});
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isExpanded}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="expand-backdrop" onclick={closeExpanded}></div>
{/if}

<div class="news-panel-shell" class:expanded={isExpanded}>
	<Panel id={panelId} {title} {count} {loading} {error} draggable={!isExpanded}>
		{#snippet actions()}
			<button
				type="button"
				class="expand-btn"
				onclick={toggleExpanded}
				aria-label={isExpanded ? t($language, 'panel.collapse') : t($language, 'panel.expand')}
				title={isExpanded ? t($language, 'panel.collapse') : t($language, 'panel.expand')}
			>
				{#if isExpanded}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4.5 2h5v5h-2V11.4l-4.3 4.3-1.4-1.4L12.6 10H10.5V8z"
						/>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 8.4L12.6 10H10.5V8h5v5h-2v-1.6l-4.3 4.3-1.4-1.3z"
						/>
					</svg>
				{/if}
			</button>
		{/snippet}

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
				<div class="news-list" bind:this={newsList}>
					{#each items as item (item.id)}
						<div data-news-id={item.id} class:nav-highlight={highlightedId === item.id}>
							<NewsItem {item} />
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</Panel>
</div>

<style>
	.expand-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 1100;
	}

	.news-panel-shell {
		position: relative;
		min-height: 100%;
	}

	.news-panel-shell.expanded {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 1400px);
		height: min(85vh, 1000px);
		z-index: 1101;
		animation: expand-pop 0.18s ease-out;
	}

	@keyframes expand-pop {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	.expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.3rem;
		height: 1.3rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.45);
		border-radius: 3px;
		color: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		padding: 0;
	}

	.expand-btn:hover {
		border-color: #ffffff;
		color: #ffffff;
	}

	.expand-btn svg {
		width: 0.8rem;
		height: 0.8rem;
	}

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

	.news-panel-shell.expanded .news-list {
		max-height: 68vh;
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

	.nav-highlight {
		animation: nav-pulse 2s ease-out;
		border-radius: 4px;
	}

	@keyframes nav-pulse {
		0%   { background: rgba(99, 102, 241, 0.25); }
		60%  { background: rgba(99, 102, 241, 0.1); }
		100% { background: transparent; }
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		.news-panel-shell.expanded {
			width: 96vw;
			height: 88vh;
		}
	}
</style>
