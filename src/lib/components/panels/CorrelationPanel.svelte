<script lang="ts">
	import { Panel, Badge, InfoTooltip } from '$lib/components/common';
	import { Modal } from '$lib/components/modals';
	import { analyzeCorrelations } from '$lib/analysis/correlation';
	import type { NewsItem } from '$lib/types';

	interface Props {
		news?: NewsItem[];
		loading?: boolean;
		error?: string | null;
	}

	let { news = [], loading = false, error = null }: Props = $props();

	const analysis = $derived(analyzeCorrelations(news));

	// Modal state
	let modalOpen = $state(false);
	let modalTitle = $state('');
	let modalHeadlines = $state<Array<{ title: string; link: string; source: string }>>([]);

	function openHeadlines(title: string, headlines: Array<{ title: string; link: string; source: string }>) {
		modalTitle = title;
		modalHeadlines = headlines;
		modalOpen = true;
	}

	function openCompoundHeadlines(signalName: string, activeTopics: string[]) {
		if (!analysis) return;
		const seen = new Set<string>();
		const combined: Array<{ title: string; link: string; source: string }> = [];
		for (const topicId of activeTopics) {
			const stats = analysis.topicStats[topicId];
			if (stats) {
				for (const h of stats.headlines) {
					if (!seen.has(h.link)) {
						seen.add(h.link);
						combined.push(h);
					}
				}
			}
		}
		openHeadlines(signalName, combined);
	}

	function getLevelVariant(level: string): 'default' | 'warning' | 'danger' | 'success' | 'info' {
		switch (level) {
			case 'high':
			case 'critical':
				return 'danger';
			case 'elevated':
				return 'warning';
			case 'surging':
				return 'danger';
			case 'rising':
				return 'warning';
			default:
				return 'default';
		}
	}

	function getMomentumClass(momentum: string): string {
		switch (momentum) {
			case 'surging':
				return 'signal-strong';
			case 'rising':
				return 'signal-medium';
			default:
				return 'signal-weak';
		}
	}

	function formatTopicName(id: string): string {
		return id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}
</script>

<Panel id="correlation" title="Pattern Analysis" {loading} {error}>
	{#if news.length === 0 && !loading && !error}
		<div class="empty-state">Insufficient data for analysis</div>
	{:else if analysis}
		<div class="correlation-content">
			{#if analysis.compoundSignals.length > 0}
				<div class="section">
					<div class="section-title">Compound Signals<InfoTooltip text="Cross-topic correlations where multiple topics activate simultaneously, indicating systemic or cascading risks" /></div>
					{#each analysis.compoundSignals.slice(0, 2) as signal}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="compound-item clickable" class:critical={signal.level === 'critical'} onclick={() => openCompoundHeadlines(signal.name, signal.activeTopics)}>
							<div class="compound-header">
								<span class="compound-name">{signal.name}</span>
								<Badge
									text={signal.level.toUpperCase()}
									variant={signal.level === 'critical' ? 'danger' : 'warning'}
								/>
							</div>
							<div class="compound-topics">
								{signal.activeTopics.map((t) => formatTopicName(t)).join(' + ')}
							</div>
							<div class="compound-prediction">{signal.prediction}</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.emergingPatterns.length > 0}
				<div class="section">
					<div class="section-title">Emerging Patterns<InfoTooltip text="Topics with unusual mention spikes detected via z-score analysis against 7-day historical averages" /></div>
					{#each analysis.emergingPatterns.slice(0, 3) as pattern}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="pattern-item clickable" onclick={() => openHeadlines(pattern.name, pattern.headlines)}>
							<div class="pattern-header">
								<span class="pattern-topic">{pattern.name}</span>
								<Badge
									text={pattern.level.toUpperCase()}
									variant={getLevelVariant(pattern.level)}
								/>
							</div>
							<div class="pattern-sources">
								{pattern.sources.slice(0, 3).join(' · ')} ({pattern.count} items)
								{#if pattern.zScore > 1}
									<span class="z-score" class:high={pattern.zScore >= 2}>
										z={pattern.zScore.toFixed(1)}
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.momentumSignals.length > 0}
				<div class="section">
					<div class="section-title">Momentum Signals<InfoTooltip text="Topics with rising velocity and acceleration in mention frequency, showing real-time traction changes" /></div>
					{#each analysis.momentumSignals.slice(0, 3) as signal}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="signal-item clickable {getMomentumClass(signal.momentum)}" onclick={() => openHeadlines(signal.name, signal.headlines)}>
							<span class="signal-topic">{signal.name}</span>
							<span
								class="signal-direction"
								class:up={signal.delta > 0}
								class:down={signal.delta < 0}
							>
								{#if signal.velocity > 0}
									<span class="velocity-indicator">↗</span>
								{:else}
									<span class="velocity-indicator">→</span>
								{/if}
								{signal.current}
								{#if signal.acceleration > 0}
									<span class="accel-indicator">++</span>
								{/if}
							</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.crossSourceCorrelations.length > 0}
				<div class="section">
					<div class="section-title">Cross-Source Links<InfoTooltip text="Topics receiving independent coverage from 3+ news sources, indicating broad awareness and credibility" /></div>
					{#each analysis.crossSourceCorrelations.slice(0, 3) as corr}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="correlation-item clickable" onclick={() => openHeadlines(corr.name, corr.headlines)}>
							<div class="correlation-sources">
								{corr.sources.slice(0, 2).join(' ↔ ')}
							</div>
							<div class="correlation-topic">{corr.name} ({corr.sourceCount} sources)</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.predictiveSignals.length > 0}
				<div class="section">
					<div class="section-title">Predictive Signals<InfoTooltip text="AI-generated outcome predictions based on weighted scoring of source credibility, multi-source confirmation, and statistical significance" /></div>
					{#each analysis.predictiveSignals.slice(0, 2) as signal}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="predictive-item clickable" onclick={() => openHeadlines(signal.name, signal.headlines)}>
							<div class="predictive-pattern">{signal.prediction}</div>
							<div class="predictive-confidence">
								Confidence: {Math.round(signal.confidence)}%
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.emergingPatterns.length === 0 && analysis.momentumSignals.length === 0 && analysis.compoundSignals.length === 0}
				<div class="empty-state">No significant patterns detected</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">No significant patterns detected</div>
	{/if}
</Panel>

<Modal open={modalOpen} title={modalTitle} onClose={() => (modalOpen = false)}>
	{#if modalHeadlines.length > 0}
		<div class="headlines-list">
			{#each modalHeadlines as headline}
				<div class="headline-item">
					<span class="headline-source">{headline.source}</span>
					<a href={headline.link} target="_blank" rel="noopener noreferrer" class="headline-link">{headline.title}</a>
				</div>
			{/each}
		</div>
	{:else}
		<p class="empty-state">No headlines available for this pattern.</p>
	{/if}
</Modal>

<style>
	.correlation-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section {
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.section:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.section-title {
		display: flex;
		align-items: center;
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.4rem;
	}

	.compound-item {
		padding: 0.4rem;
		margin: 0.25rem 0;
		border-radius: 4px;
		background: rgba(255, 165, 0, 0.05);
		border-left: 2px solid var(--warning);
	}

	.compound-item.critical {
		background: rgba(255, 100, 100, 0.08);
		border-left-color: var(--danger);
	}

	.compound-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.2rem;
	}

	.compound-name {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.compound-topics {
		font-size: 0.55rem;
		color: var(--text-secondary);
		margin-bottom: 0.15rem;
	}

	.compound-prediction {
		font-size: 0.55rem;
		color: var(--text-muted);
		font-style: italic;
	}

	.pattern-item {
		padding: 0.3rem 0;
	}

	.pattern-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.2rem;
	}

	.pattern-topic {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.pattern-sources {
		font-size: 0.55rem;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.z-score {
		font-size: 0.5rem;
		padding: 0.1rem 0.25rem;
		border-radius: 3px;
		background: rgba(68, 255, 136, 0.1);
		color: var(--success);
	}

	.z-score.high {
		background: rgba(255, 165, 0, 0.15);
		color: var(--warning);
	}

	.signal-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 0.4rem;
		margin: 0.2rem 0;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.02);
	}

	.signal-item.signal-strong {
		background: rgba(255, 165, 0, 0.1);
		border-left: 2px solid var(--warning);
	}

	.signal-item.signal-medium {
		background: rgba(68, 255, 136, 0.05);
		border-left: 2px solid var(--success);
	}

	.signal-topic {
		font-size: 0.6rem;
		color: var(--text-primary);
	}

	.signal-direction {
		font-size: 0.6rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.signal-direction.up {
		color: var(--success);
	}

	.signal-direction.down {
		color: var(--danger);
	}

	.velocity-indicator {
		font-size: 0.55rem;
	}

	.accel-indicator {
		font-size: 0.5rem;
		color: var(--warning);
		font-weight: 700;
	}

	.correlation-item {
		padding: 0.25rem 0;
	}

	.correlation-sources {
		font-size: 0.6rem;
		color: var(--text-secondary);
	}

	.correlation-topic {
		font-size: 0.55rem;
		color: var(--text-muted);
	}

	.predictive-item {
		padding: 0.3rem 0;
	}

	.predictive-pattern {
		font-size: 0.6rem;
		color: var(--text-primary);
	}

	.predictive-confidence {
		font-size: 0.55rem;
		color: var(--text-muted);
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}

	.clickable {
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.clickable:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.headlines-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.headline-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.03);
		border-left: 2px solid var(--accent);
	}

	.headline-source {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.headline-link {
		font-size: 0.75rem;
		color: var(--text-primary);
		text-decoration: none;
		line-height: 1.4;
	}

	.headline-link:hover {
		color: var(--accent);
		text-decoration: underline;
	}
</style>
