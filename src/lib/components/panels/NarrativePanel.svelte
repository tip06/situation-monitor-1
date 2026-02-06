<script lang="ts">
	import { Panel, Badge } from '$lib/components/common';
	import { analyzeNarratives, type TrendingNarrative } from '$lib/analysis/narrative';
	import type { NewsItem } from '$lib/types';

	interface Props {
		news?: NewsItem[];
		loading?: boolean;
		error?: string | null;
	}

	let { news = [], loading = false, error = null }: Props = $props();

	const analysis = $derived(analyzeNarratives(news));

	function getStatusVariant(status: string): 'default' | 'warning' | 'danger' | 'success' | 'info' {
		switch (status) {
			case 'viral':
				return 'danger';
			case 'spreading':
				return 'warning';
			case 'emerging':
				return 'info';
			case 'crossing':
				return 'warning';
			default:
				return 'default';
		}
	}

	function getSeverityVariant(
		severity: string
	): 'default' | 'warning' | 'danger' | 'success' | 'info' {
		switch (severity) {
			case 'high':
				return 'danger';
			case 'medium':
				return 'warning';
			default:
				return 'default';
		}
	}

	function getMomentumIcon(momentum: TrendingNarrative['momentum']): string {
		switch (momentum) {
			case 'rising':
				return '▲';
			case 'falling':
				return '▼';
			default:
				return '─';
		}
	}

	function getMomentumClass(momentum: TrendingNarrative['momentum']): string {
		switch (momentum) {
			case 'rising':
				return 'momentum-rising';
			case 'falling':
				return 'momentum-falling';
			default:
				return 'momentum-stable';
		}
	}

	function getSentimentIndicator(sentiment: TrendingNarrative['sentiment']): string {
		switch (sentiment) {
			case 'positive':
				return '+';
			case 'negative':
				return '-';
			default:
				return '=';
		}
	}

	function getSentimentClass(sentiment: TrendingNarrative['sentiment']): string {
		switch (sentiment) {
			case 'positive':
				return 'sentiment-positive';
			case 'negative':
				return 'sentiment-negative';
			default:
				return 'sentiment-neutral';
		}
	}

	function getRegionLabel(region?: string): string {
		switch (region) {
			case 'brazil':
				return 'BR';
			case 'latam':
				return 'LATAM';
			case 'mena':
				return 'MENA';
			default:
				return '';
		}
	}
</script>

<Panel id="narrative" title="Narrative Tracker" {loading} {error}>
	{#if news.length === 0 && !loading && !error}
		<div class="empty-state">Insufficient data for narrative analysis</div>
	{:else if analysis}
		<div class="narrative-content">
			{#if analysis.trendingNarratives.length > 0}
				<div class="section">
					<div class="section-title">Trending Narratives</div>
					{#each analysis.trendingNarratives.slice(0, 6) as narrative}
						<div class="trending-item">
							<div class="trending-header">
								<span class="trending-name">
									{narrative.name}
									{#if narrative.region && narrative.region !== 'global'}
										<span class="region-tag">{getRegionLabel(narrative.region)}</span>
									{/if}
								</span>
								<div class="trending-indicators">
									<span
										class="momentum-indicator {getMomentumClass(narrative.momentum)}"
										title="Momentum: {narrative.momentum}"
									>
										{getMomentumIcon(narrative.momentum)}
									</span>
									<span
										class="sentiment-indicator {getSentimentClass(narrative.sentiment)}"
										title="Sentiment: {narrative.sentiment}"
									>
										{getSentimentIndicator(narrative.sentiment)}
									</span>
								</div>
							</div>
							<div class="trending-meta">
								<span class="mention-count">{narrative.count} mentions</span>
								<span class="category-tag">{narrative.category}</span>
							</div>
							{#if narrative.sources.length > 0}
								<div class="trending-sources">
									{narrative.sources.slice(0, 3).join(' · ')}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.emergingFringe.length > 0}
				<div class="section">
					<div class="section-title">Emerging Fringe</div>
					{#each analysis.emergingFringe.slice(0, 4) as narrative}
						<div class="narrative-item">
							<div class="narrative-header">
								<span class="narrative-name">{narrative.name}</span>
								<Badge
									text={narrative.status.toUpperCase()}
									variant={getStatusVariant(narrative.status)}
								/>
							</div>
							<div class="narrative-meta">
								<span class="mention-count">{narrative.count} mentions</span>
							</div>
							{#if narrative.sources.length > 0}
								<div class="narrative-sources">
									{narrative.sources.slice(0, 3).join(' · ')}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.fringeToMainstream.length > 0}
				<div class="section">
					<div class="section-title">Fringe → Mainstream Crossovers</div>
					{#each analysis.fringeToMainstream.slice(0, 3) as crossover}
						<div class="crossover-item">
							<div class="crossover-narrative">{crossover.name}</div>
							<div class="crossover-path">
								<span class="from">Fringe ({crossover.fringeCount})</span>
								<span class="arrow">→</span>
								<span class="to">Mainstream ({crossover.mainstreamCount})</span>
							</div>
							<div class="crossover-level">
								Crossover level: {Math.round(crossover.crossoverLevel * 100)}%
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.narrativeWatch.length > 0}
				<div class="section">
					<div class="section-title">Narrative Watch</div>
					<div class="themes-grid">
						{#each analysis.narrativeWatch.slice(0, 6) as narrative}
							<div class="theme-tag">
								{narrative.name}
								<span class="theme-count">{narrative.count}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if analysis.disinfoSignals.length > 0}
				<div class="section">
					<div class="section-title">Disinfo Signals</div>
					{#each analysis.disinfoSignals.slice(0, 3) as signal}
						<div class="disinfo-item">
							<div class="disinfo-header">
								<span class="disinfo-name">{signal.name}</span>
								<Badge
									text={signal.severity.toUpperCase()}
									variant={getSeverityVariant(signal.severity)}
								/>
							</div>
							<div class="disinfo-meta">{signal.count} mentions</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.trendingNarratives.length === 0 && analysis.emergingFringe.length === 0 && analysis.fringeToMainstream.length === 0}
				<div class="empty-state">
					No significant narratives detected in current data.
					{#if news.length < 50}
						<br /><span class="hint">Try refreshing to load more articles.</span>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">No significant narratives detected</div>
	{/if}
</Panel>

<style>
	.narrative-content {
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
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.4rem;
	}

	/* Trending narratives styles */
	.trending-item {
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--border);
	}

	.trending-item:last-child {
		border-bottom: none;
	}

	.trending-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.2rem;
	}

	.trending-name {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.region-tag {
		font-size: 0.5rem;
		padding: 0.1rem 0.25rem;
		background: rgba(99, 102, 241, 0.2);
		color: var(--accent);
		border-radius: 2px;
		font-weight: 600;
	}

	.trending-indicators {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}

	.momentum-indicator {
		font-size: 0.6rem;
		font-weight: bold;
		width: 1rem;
		text-align: center;
	}

	.momentum-rising {
		color: var(--success);
	}

	.momentum-falling {
		color: var(--danger);
	}

	.momentum-stable {
		color: var(--text-muted);
	}

	.sentiment-indicator {
		font-size: 0.6rem;
		font-weight: bold;
		width: 0.8rem;
		height: 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 2px;
	}

	.sentiment-positive {
		background: rgba(34, 197, 94, 0.2);
		color: var(--success);
	}

	.sentiment-negative {
		background: rgba(239, 68, 68, 0.2);
		color: var(--danger);
	}

	.sentiment-neutral {
		background: rgba(255, 255, 255, 0.1);
		color: var(--text-muted);
	}

	.trending-meta {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 0.15rem;
	}

	.category-tag {
		font-size: 0.5rem;
		padding: 0.1rem 0.2rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
		color: var(--text-muted);
	}

	.trending-sources {
		font-size: 0.5rem;
		color: var(--text-muted);
	}

	/* Original narrative styles */
	.narrative-item {
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--border);
	}

	.narrative-item:last-child {
		border-bottom: none;
	}

	.narrative-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.2rem;
	}

	.narrative-name {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.narrative-meta {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 0.15rem;
	}

	.mention-count {
		font-size: 0.55rem;
		color: var(--text-secondary);
	}

	.narrative-sources {
		font-size: 0.5rem;
		color: var(--text-muted);
	}

	.crossover-item {
		padding: 0.35rem 0;
		border-left: 2px solid var(--warning);
		padding-left: 0.5rem;
		margin: 0.25rem 0;
	}

	.crossover-narrative {
		font-size: 0.6rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.crossover-path {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.55rem;
		margin: 0.15rem 0;
	}

	.crossover-path .from {
		color: var(--text-secondary);
	}

	.crossover-path .arrow {
		color: var(--warning);
	}

	.crossover-path .to {
		color: var(--success);
	}

	.crossover-level {
		font-size: 0.5rem;
		color: var(--text-muted);
	}

	.themes-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.theme-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.4rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
		font-size: 0.55rem;
		color: var(--text-secondary);
	}

	.theme-count {
		font-size: 0.5rem;
		color: var(--text-muted);
		background: rgba(255, 255, 255, 0.1);
		padding: 0.1rem 0.2rem;
		border-radius: 2px;
	}

	.disinfo-item {
		padding: 0.3rem 0;
	}

	.disinfo-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.disinfo-name {
		font-size: 0.6rem;
		color: var(--text-primary);
	}

	.disinfo-meta {
		font-size: 0.5rem;
		color: var(--text-muted);
		margin-top: 0.1rem;
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.7rem;
		padding: 1rem;
	}

	.hint {
		font-size: 0.6rem;
		color: var(--text-muted);
	}
</style>
