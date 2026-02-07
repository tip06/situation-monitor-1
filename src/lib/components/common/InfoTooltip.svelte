<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	let visible = $state(false);
</script>

<span
	class="info-tooltip-wrapper"
	role="presentation"
	onmouseenter={() => (visible = true)}
	onmouseleave={() => (visible = false)}
>
	<button class="info-icon" onclick={() => (visible = !visible)} aria-label="More info">?</button>
	{#if visible}
		<span class="tooltip">{text}</span>
	{/if}
</span>

<style>
	.info-tooltip-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		margin-left: 0.3rem;
	}

	.info-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-muted);
		font-size: 0.5rem;
		font-weight: 600;
		cursor: help;
		padding: 0;
		line-height: 1;
	}

	.info-icon:hover {
		color: var(--text-secondary);
		border-color: var(--text-muted);
	}

	.tooltip {
		position: absolute;
		top: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		font-size: 0.55rem;
		font-weight: 400;
		text-transform: none;
		letter-spacing: normal;
		line-height: 1.4;
		padding: 0.4rem 0.5rem;
		border-radius: 4px;
		max-width: 220px;
		width: max-content;
		pointer-events: none;
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
</style>
