<script lang="ts">
	interface Props {
		lines?: number;
	}

	let { lines = 5 }: Props = $props();
</script>

<div class="skeleton-container">
	{#each Array(lines) as _, i}
		<div class="skeleton-item" style:animation-delay="{i * 80}ms">
			<div class="skeleton-badge"></div>
			<div class="skeleton-content">
				<div class="skeleton-title" style:width="{60 + Math.random() * 30}%"></div>
				<div class="skeleton-meta" style:width="{30 + Math.random() * 20}%"></div>
			</div>
		</div>
	{/each}
</div>

<style>
	.skeleton-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}

	.skeleton-item {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 0.35rem 0;
		border-bottom: 1px solid var(--border);
		opacity: 0;
		animation: skeleton-fade-in 0.3s ease-out forwards;
	}

	@keyframes skeleton-fade-in {
		to { opacity: 1; }
	}

	.skeleton-badge {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 50%;
		background: var(--border);
		margin-top: 0.2rem;
		flex-shrink: 0;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	.skeleton-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.skeleton-title {
		height: 0.55rem;
		background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%);
		background-size: 200% 100%;
		border-radius: 2px;
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
	}

	.skeleton-meta {
		height: 0.4rem;
		background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%);
		background-size: 200% 100%;
		border-radius: 2px;
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
		opacity: 0.6;
	}

	@keyframes skeleton-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	@keyframes skeleton-pulse {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 0.6; }
	}
</style>
