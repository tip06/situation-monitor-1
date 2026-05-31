<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { TABS, type TabId } from '$lib/config';
	import { activeTab, language } from '$lib/stores';
	import { t } from '$lib/i18n';

	interface Props {
		orientation?: 'horizontal' | 'sidebar';
	}

	let { orientation = 'horizontal' }: Props = $props();
	let tabClickSequence = 0;

	async function handleTabClick(tabId: TabId) {
		if (typeof performance !== 'undefined' && typeof requestAnimationFrame === 'function') {
			const sequence = ++tabClickSequence;
			const start = performance.now();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (sequence !== tabClickSequence) return;
					const duration = performance.now() - start;
					if (duration > 500) {
						console.warn(`Slow tab activation (${tabId}): ${Math.round(duration)}ms`);
					}
				});
			});
		}

		activeTab.setTab(tabId);
		if ($page.url.pathname !== '/') {
			await goto('/');
		}
	}
</script>

<nav class="tab-bar" class:vertical={orientation === 'sidebar'} aria-label="Primary">
	<div class="tab-container">
		<a
			class="tab"
			class:active={$page.url.pathname === '/map'}
			href="/map"
			aria-current={$page.url.pathname === '/map' ? 'page' : undefined}
		>
			{t($language, 'tabs.map')}
		</a>
		{#each TABS as tab}
			<button
				class="tab"
				class:active={$page.url.pathname === '/' && $activeTab === tab.id}
				onclick={() => handleTabClick(tab.id)}
				aria-current={$page.url.pathname === '/' && $activeTab === tab.id ? 'page' : undefined}
			>
				{t($language, tab.nameKey)}
			</button>
		{/each}
	</div>
</nav>

<style>
	.tab-bar {
		width: 100%;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		padding: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.tab-container {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.tab-bar.vertical {
		width: 12rem;
		min-height: 100%;
		border-right: 1px solid var(--border);
		border-bottom: 0;
		margin-bottom: 0;
		padding: 0.6rem;
		flex-shrink: 0;
	}

	.tab-bar.vertical .tab-container {
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		flex-wrap: nowrap;
		position: sticky;
		top: 3.25rem;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1.25rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-dim);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s ease;
		text-decoration: none;
	}

	.tab:hover {
		color: var(--text);
		background: var(--surface-hover);
		border-color: var(--border-light);
	}

	.tab.active {
		color: #ffffff;
		background: var(--indigo);
		border-color: var(--indigo-dark);
	}

	.tab.active:hover {
		background: var(--indigo-dark);
	}

	@media (max-width: 640px) {
		.tab-bar.vertical {
			width: 100%;
			min-height: auto;
			border-right: 0;
			border-bottom: 1px solid var(--border);
			margin-bottom: 0.5rem;
			padding: 0.5rem;
		}

		.tab-bar.vertical .tab-container {
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
			position: static;
		}

		.tab {
			padding: 0.4rem 0.75rem;
			font-size: 0.7rem;
		}
	}
</style>
