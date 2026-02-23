<script lang="ts">
	import { Panel } from '$lib/components/common';
	import { allNewsItems } from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { THEATERS } from '$lib/config/theaters';

	type RiskLevel = 'NORMAL' | 'ELEVATED' | 'CRITICAL';

	const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

	const recentNews = $derived(
		$allNewsItems.filter((item) => Date.now() - (item.timestamp ?? 0) < TWENTY_FOUR_HOURS)
	);

	let expandedTheaters = $state<Set<string>>(new Set());

	const theaterRisks = $derived(
		THEATERS.map((theater) => {
			const matchingItems = recentNews.filter((item) => {
				const text = (item.title + ' ' + (item.description ?? '')).toLowerCase();
				return theater.keywords.some((kw) => text.includes(kw.toLowerCase()));
			});

			const matchCount = matchingItems.length;
			const level: RiskLevel =
				matchCount >= 3 ? 'CRITICAL' : matchCount >= 1 ? 'ELEVATED' : 'NORMAL';

			return {
				id: theater.id,
				name: theater.name,
				level,
				matchCount,
				matchingHeadlines: matchingItems.slice(0, 5).map((i) => i.title)
			};
		})
	);

	function toggleExpand(id: string) {
		const next = new Set(expandedTheaters);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedTheaters = next;
	}

	function levelClass(level: RiskLevel): string {
		if (level === 'CRITICAL') return 'level-critical';
		if (level === 'ELEVATED') return 'level-elevated';
		return 'level-normal';
	}
</script>

<Panel id="strategic_risk" title={t($language, 'panelName.strategic_risk')}>
	<div class="theaters-list">
		{#each theaterRisks as theater}
			<div class="theater-card {levelClass(theater.level)}">
				<button
					class="theater-header"
					onclick={() => toggleExpand(theater.id)}
					aria-expanded={expandedTheaters.has(theater.id)}
				>
					<span class="theater-name">{theater.name}</span>
					<span class="theater-count">{theater.matchCount} signals</span>
					<span class="theater-badge {levelClass(theater.level)}">{theater.level}</span>
					{#if theater.matchCount > 0}
						<span class="expand-arrow">{expandedTheaters.has(theater.id) ? '▲' : '▼'}</span>
					{/if}
				</button>

				{#if expandedTheaters.has(theater.id) && theater.matchingHeadlines.length > 0}
					<ul class="headlines-list">
						{#each theater.matchingHeadlines as headline}
							<li class="headline-item">{headline}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</Panel>

<style>
	.theaters-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.theater-card {
		border-radius: 6px;
		border: 1px solid transparent;
		overflow: hidden;
	}

	.theater-card.level-critical { border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05); }
	.theater-card.level-elevated { border-color: rgba(234, 179, 8, 0.4); background: rgba(234, 179, 8, 0.05); }
	.theater-card.level-normal { border-color: var(--border, #333); background: transparent; }

	.theater-header {
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.45rem 0.6rem;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-size: 0.82rem;
	}

	.theater-name {
		color: var(--text);
		font-weight: 500;
	}

	.theater-count {
		color: var(--text-muted, #888);
		font-size: 0.72rem;
		white-space: nowrap;
	}

	.theater-badge {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		padding: 2px 6px;
		border-radius: 3px;
		white-space: nowrap;
	}

	.theater-badge.level-critical { color: #ef4444; background: rgba(239, 68, 68, 0.15); }
	.theater-badge.level-elevated { color: #eab308; background: rgba(234, 179, 8, 0.15); }
	.theater-badge.level-normal { color: #22c55e; background: rgba(34, 197, 94, 0.1); }

	.expand-arrow {
		color: var(--text-muted, #888);
		font-size: 0.65rem;
	}

	.headlines-list {
		list-style: none;
		margin: 0;
		padding: 0 0.6rem 0.5rem 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border-top: 1px solid var(--border, #2a2a2a);
	}

	.headline-item {
		font-size: 0.73rem;
		color: var(--text-muted, #aaa);
		line-height: 1.4;
	}
</style>
