<script lang="ts">
	import { Panel } from '$lib/components/common';
	import { intelligence, allNewsItems } from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { fetchAIBrief } from '$lib/api';

	const state = $derived($intelligence);

	function formatTime(ms: number): string {
		const date = new Date(ms);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	async function handleRegenerate() {
		intelligence.setBriefLoading(true);
		try {
			const headlines = $allNewsItems.slice(0, 50).map((item) => item.title).filter(Boolean);
			const brief = await fetchAIBrief(headlines);
			intelligence.setBrief(brief);
		} catch (e) {
			intelligence.setBriefError(String(e));
		}
	}

	const paragraphs = $derived(
		state.brief?.text
			? state.brief.text
					.split('\n')
					.map((p) => p.trim())
					.filter((p) => p.length > 0)
			: []
	);
</script>

<Panel
	id="ai_brief"
	title={t($language, 'panelName.ai_brief')}
	loading={state.briefLoading}
	error={state.briefError}
>
	{#snippet actions()}
		<button class="regen-btn" onclick={handleRegenerate} disabled={state.briefLoading}>
			{state.briefLoading ? '...' : '↺'}
		</button>
	{/snippet}

	{#if state.briefLoading}
		<div class="skeleton-container">
			<div class="skeleton-line long"></div>
			<div class="skeleton-line medium"></div>
			<div class="skeleton-line long"></div>
			<div class="skeleton-line short"></div>
			<div class="skeleton-line long"></div>
			<div class="skeleton-line medium"></div>
		</div>
	{:else if state.brief}
		<div class="brief-content">
			{#each paragraphs as paragraph}
				<p class="brief-paragraph">{paragraph}</p>
			{/each}
			<div class="brief-meta">
				<span>Generated at {formatTime(state.brief.generatedAt)}</span>
				<span>·</span>
				<span>{state.brief.headlineCount} headlines analyzed</span>
			</div>
		</div>
	{:else if !state.briefError}
		<div class="empty-state">
			<p>No brief available. Loading intelligence data...</p>
		</div>
	{/if}
</Panel>

<style>
	.brief-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.5rem 0;
	}

	.brief-paragraph {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--text);
	}

	.brief-meta {
		display: flex;
		gap: 0.5rem;
		font-size: 0.7rem;
		color: var(--text-muted, #666);
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border, #333);
	}

	.skeleton-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.skeleton-line {
		height: 0.75rem;
		background: var(--bg-secondary, #2a2a2a);
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.skeleton-line.long { width: 100%; }
	.skeleton-line.medium { width: 75%; }
	.skeleton-line.short { width: 50%; }

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 0.8; }
	}

	.regen-btn {
		background: none;
		border: 1px solid var(--border, #333);
		color: var(--text-muted, #888);
		border-radius: 4px;
		padding: 2px 6px;
		cursor: pointer;
		font-size: 0.8rem;
		transition: color 0.2s;
	}

	.regen-btn:hover:not(:disabled) {
		color: var(--text);
	}

	.regen-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.empty-state {
		color: var(--text-muted, #666);
		font-size: 0.8rem;
		padding: 1rem 0;
		text-align: center;
	}
</style>
