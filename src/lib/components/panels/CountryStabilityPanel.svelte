<script lang="ts">
	import { Panel } from '$lib/components/common';
	import { intelligence } from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';

	const COUNTRY_LABELS: Record<string, { name: string; flag: string }> = {
		usa: { name: 'United States', flag: '🇺🇸' },
		china: { name: 'China', flag: '🇨🇳' },
		russia: { name: 'Russia', flag: '🇷🇺' },
		iran: { name: 'Iran', flag: '🇮🇷' },
		israel: { name: 'Israel', flag: '🇮🇱' },
		ukraine: { name: 'Ukraine', flag: '🇺🇦' },
		venezuela: { name: 'Venezuela', flag: '🇻🇪' },
		brazil: { name: 'Brazil', flag: '🇧🇷' },
		india: { name: 'India', flag: '🇮🇳' },
		pakistan: { name: 'Pakistan', flag: '🇵🇰' },
		northkorea: { name: 'North Korea', flag: '🇰🇵' },
		taiwan: { name: 'Taiwan', flag: '🇹🇼' },
		saudiarabia: { name: 'Saudi Arabia', flag: '🇸🇦' },
		turkey: { name: 'Turkey', flag: '🇹🇷' },
		germany: { name: 'Germany', flag: '🇩🇪' }
	};

	const state = $derived($intelligence);

	const sortedCountries = $derived(
		Object.entries(COUNTRY_LABELS)
			.map(([key, meta]) => ({
				key,
				name: meta.name,
				flag: meta.flag,
				score: (state.stability?.scores ?? {})[key] ?? null
			}))
			.sort((a, b) => {
				if (a.score === null) return 1;
				if (b.score === null) return -1;
				return a.score - b.score; // lowest stability first (most at-risk)
			})
	);

	function getScoreClass(score: number | null): string {
		if (score === null) return 'score-unknown';
		if (score >= 75) return 'score-stable';
		if (score >= 50) return 'score-moderate';
		return 'score-unstable';
	}

	function getScoreLabel(score: number | null): string {
		if (score === null) return '–';
		if (score >= 75) return 'Stable';
		if (score >= 50) return 'Moderate';
		return 'Unstable';
	}

	function formatTime(ms: number): string {
		const date = new Date(ms);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<Panel
	id="country_stability"
	title={t($language, 'panelName.country_stability')}
	loading={state.stabilityLoading}
	error={state.stabilityError}
>
	{#if state.stabilityLoading}
		<div class="skeleton-list">
			{#each Array(8) as _}
				<div class="skeleton-row"></div>
			{/each}
		</div>
	{:else if state.stability}
		<div class="stability-list">
			{#each sortedCountries as country}
				<div class="country-row">
					<span class="country-flag">{country.flag}</span>
					<span class="country-name">{country.name}</span>
					<div class="score-bar-container">
						<div
							class="score-bar {getScoreClass(country.score)}"
							style="width: {country.score ?? 50}%"
						></div>
					</div>
					<span class="score-value {getScoreClass(country.score)}">
						{country.score !== null ? country.score : '–'}
					</span>
					<span class="score-label {getScoreClass(country.score)}">
						{getScoreLabel(country.score)}
					</span>
				</div>
			{/each}
		</div>
		<div class="last-updated">
			Updated {formatTime(state.stability.generatedAt)}
		</div>
	{:else}
		<div class="empty-state">No stability data available.</div>
	{/if}
</Panel>

<style>
	.stability-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.25rem 0;
	}

	.country-row {
		display: grid;
		grid-template-columns: 1.5rem 7rem 1fr 2rem 4.5rem;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
	}

	.country-flag {
		font-size: 1rem;
		line-height: 1;
	}

	.country-name {
		color: var(--text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.score-bar-container {
		height: 6px;
		background: var(--bg-secondary, #1e1e1e);
		border-radius: 3px;
		overflow: hidden;
	}

	.score-bar {
		height: 100%;
		border-radius: 3px;
		transition: width 0.4s ease;
	}

	.score-bar.score-stable { background: #22c55e; }
	.score-bar.score-moderate { background: #eab308; }
	.score-bar.score-unstable { background: #ef4444; }
	.score-bar.score-unknown { background: #555; width: 0 !important; }

	.score-value {
		font-weight: 600;
		text-align: right;
		font-size: 0.75rem;
	}

	.score-label {
		font-size: 0.7rem;
		text-align: right;
		white-space: nowrap;
	}

	.score-stable { color: #22c55e; }
	.score-moderate { color: #eab308; }
	.score-unstable { color: #ef4444; }
	.score-unknown { color: #555; }

	.last-updated {
		font-size: 0.7rem;
		color: var(--text-muted, #666);
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border, #333);
	}

	.skeleton-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.skeleton-row {
		height: 1.2rem;
		background: var(--bg-secondary, #2a2a2a);
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 0.8; }
	}

	.empty-state {
		color: var(--text-muted, #666);
		font-size: 0.8rem;
		padding: 1rem 0;
		text-align: center;
	}
</style>
