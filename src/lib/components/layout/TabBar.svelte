<script lang="ts">
	import { TABS, type TabId } from '$lib/config';
	import { activeTab } from '$lib/stores';

	function handleTabClick(tabId: TabId) {
		activeTab.setTab(tabId);
	}
</script>

<nav class="tab-bar">
	<div class="tab-container">
		{#each TABS as tab}
			<button
				class="tab"
				class:active={$activeTab === tab.id}
				onclick={() => handleTabClick(tab.id)}
			>
				{tab.name}
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

	.tab {
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
		.tab {
			padding: 0.4rem 0.75rem;
			font-size: 0.7rem;
		}
	}
</style>
