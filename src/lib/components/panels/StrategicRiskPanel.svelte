<script lang="ts">
	import { onMount } from 'svelte';
	import { Panel } from '$lib/components/common';
	import { fetchOutagesSnapshot, type InternetOutage } from '$lib/api/outages';
	import { THEATERS } from '$lib/config/theaters';
	import { t } from '$lib/i18n';
	import { language, allNewsItems, intelligence } from '$lib/stores';
	import {
		calculateStrategicRiskOverview,
		type StrategicRiskOverview,
		type AlertPriority,
		type RiskLevel
	} from '$lib/services/strategic-risk';

	const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

	let outages = $state<InternetOutage[]>([]);
	let outagesGeneratedAt = $state<number | null>(null);
	let outagesError = $state<string | null>(null);
	let outagesLoading = $state(false);
	let overview = $state<StrategicRiskOverview | null>(null);
	let previousCompositeScore: number | null = null;
	let showSignalSources = $state(false);
	let expandedTheaterId = $state<string | null>(null);
	const primaryConvergenceZone = $derived(overview?.topConvergenceZones[0] ?? null);

	const intelState = $derived($intelligence);
	const recentNews = $derived(
		$allNewsItems.filter((item) => Date.now() - (item.timestamp ?? 0) < TWENTY_FOUR_HOURS)
	);
	const panelLoading = $derived(!overview && (intelState.stabilityLoading || outagesLoading));
	const panelError = $derived(!overview ? intelState.stabilityError : null);

	interface MapFocusEventDetail {
		lat: number;
		lon: number;
		zoom?: 'context' | 'tight';
	}

	const STRATEGIC_RISK_COPY = {
		en: {
			helpLabel: 'Show signal sources',
			helpTitle: 'Signal sources',
			sourceTitle: 'Signal provenance',
			newsStream: 'News stream',
			headlinesIn24h: '{count} headlines in last 24h',
			countryStability: 'Country stability',
			countriesLoaded: '{count} countries',
			notLoaded: 'Not loaded',
			infrastructureOutages: 'Infrastructure outages',
			outageEvents: '{count} outage events',
			theaterModel: 'Theater model',
			theaterMapping: '{count} theaters with keyword/topic mapping',
			compositeModel: 'Composite model:',
			currentFactors: 'Current factors:',
			ariaComposite: 'Composite strategic risk score',
			trend: 'Trend',
			updatedAt: 'Updated {time}',
			convergenceZones: 'Convergence zones',
			topInstabilityScore: 'Top instability score',
			majorOutages: 'Major outages',
			activeAlerts: 'Active alerts',
			topRisks: 'Top risks',
			noDominantRisks: 'No dominant risks detected.',
			theaterConvergence: 'Theater convergence',
			signalsCount: '{count} signals',
			showSignalsFor: 'Show signals for {name}',
			signalsExpanded: '▲ Signals',
			signalsCollapsed: '▼ Signals',
			domainsCount: '{count} domains',
			highPriorityCount: '{count} high-priority',
			focusMap: 'Focus map ↗',
			noUnderlyingSignals: 'No underlying signals available.',
			recentAlerts: 'Recent alerts',
			focusMapOn: 'Focus map on {name}',
			noRiskAlerts24h: 'No risk alerts in the last 24 hours.',
			outageFeedWarning: 'Outage feed warning: {error}',
			outageFeedUpdated: 'Outage feed updated at {time}',
			levelCritical: 'Critical',
			levelElevated: 'Elevated',
			levelModerate: 'Moderate',
			levelLow: 'Low',
			trendEscalating: 'Escalating',
			trendDeEscalating: 'De-escalating',
			trendStable: 'Stable',
			justNow: 'just now',
			minutesAgo: '{count}m ago',
			hoursAgo: '{count}h ago'
		},
		'pt-BR': {
			helpLabel: 'Mostrar fontes dos sinais',
			helpTitle: 'Fontes dos sinais',
			sourceTitle: 'Proveniência dos sinais',
			newsStream: 'Fluxo de notícias',
			headlinesIn24h: '{count} manchetes nas últimas 24h',
			countryStability: 'Estabilidade dos países',
			countriesLoaded: '{count} países',
			notLoaded: 'Não carregado',
			infrastructureOutages: 'Falhas de infraestrutura',
			outageEvents: '{count} eventos de indisponibilidade',
			theaterModel: 'Modelo de teatros',
			theaterMapping: '{count} teatros com mapeamento por palavras-chave/tópicos',
			compositeModel: 'Modelo composto:',
			currentFactors: 'Fatores atuais:',
			ariaComposite: 'Pontuação composta de risco estratégico',
			trend: 'Tendência',
			updatedAt: 'Atualizado às {time}',
			convergenceZones: 'Zonas de convergência',
			topInstabilityScore: 'Maior índice de instabilidade',
			majorOutages: 'Falhas graves',
			activeAlerts: 'Alertas ativos',
			topRisks: 'Principais riscos',
			noDominantRisks: 'Nenhum risco dominante detectado.',
			theaterConvergence: 'Convergência por teatro',
			signalsCount: '{count} sinais',
			showSignalsFor: 'Mostrar sinais de {name}',
			signalsExpanded: '▲ Sinais',
			signalsCollapsed: '▼ Sinais',
			domainsCount: '{count} domínios',
			highPriorityCount: '{count} alta prioridade',
			focusMap: 'Focar no mapa ↗',
			noUnderlyingSignals: 'Nenhum sinal subjacente disponível.',
			recentAlerts: 'Alertas recentes',
			focusMapOn: 'Focar no mapa em {name}',
			noRiskAlerts24h: 'Nenhum alerta de risco nas últimas 24 horas.',
			outageFeedWarning: 'Aviso da API de falhas: {error}',
			outageFeedUpdated: 'API de falhas atualizada às {time}',
			levelCritical: 'Crítico',
			levelElevated: 'Elevado',
			levelModerate: 'Moderado',
			levelLow: 'Baixo',
			trendEscalating: 'Escalando',
			trendDeEscalating: 'Desescalando',
			trendStable: 'Estável',
			justNow: 'agora',
			minutesAgo: 'há {count}m',
			hoursAgo: 'há {count}h'
		}
	} as const;

	const copy = $derived($language === 'pt-BR' ? STRATEGIC_RISK_COPY['pt-BR'] : STRATEGIC_RISK_COPY.en);

	function interpolate(template: string, params: Record<string, string | number>): string {
		return template.replace(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? `{${token}}`));
	}

	function getLevelLabel(level: RiskLevel): string {
		if (level === 'critical') return copy.levelCritical;
		if (level === 'elevated') return copy.levelElevated;
		if (level === 'moderate') return copy.levelModerate;
		return copy.levelLow;
	}

	function getTrendLabel(trend: StrategicRiskOverview['trend']): string {
		if (trend === 'escalating') return copy.trendEscalating;
		if (trend === 'de-escalating') return copy.trendDeEscalating;
		return copy.trendStable;
	}

	function getScoreColor(score: number): string {
		if (score >= 70) return '#ef4444';
		if (score >= 50) return '#f59e0b';
		if (score >= 30) return '#facc15';
		return '#22c55e';
	}

	function getPriorityColor(priority: AlertPriority): string {
		if (priority === 'critical') return '#ef4444';
		if (priority === 'high') return '#f59e0b';
		if (priority === 'medium') return '#facc15';
		return '#22c55e';
	}

	function formatRelativeTime(input: Date): string {
		const now = Date.now();
		const ts = input.getTime();
		const diffMs = Math.max(0, now - ts);
		const minutes = Math.floor(diffMs / 60000);
		if (minutes < 1) return copy.justNow;
		if (minutes < 60) return interpolate(copy.minutesAgo, { count: minutes });
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return interpolate(copy.hoursAgo, { count: hours });
		return input.toLocaleDateString();
	}

	function formatSignalTime(timestamp: number): string {
		return formatRelativeTime(new Date(timestamp));
	}

	function toggleTheaterSignals(theaterId: string): void {
		expandedTheaterId = expandedTheaterId === theaterId ? null : theaterId;
	}

	function focusMap(lat: number, lon: number, zoom: 'context' | 'tight' = 'tight'): void {
		if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
		const mapPanel = document.querySelector<HTMLElement>('[data-panel-id="map"]');
		mapPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		window.dispatchEvent(
			new CustomEvent<MapFocusEventDetail>('map:focus-location', {
				detail: { lat, lon, zoom }
			})
		);
	}

	async function loadOutages() {
		outagesLoading = true;
		outagesError = null;
		try {
			const snapshot = await fetchOutagesSnapshot();
			outages = Array.isArray(snapshot?.outages) ? snapshot.outages : [];
			outagesGeneratedAt =
				typeof snapshot?.generatedAt === 'number' ? snapshot.generatedAt : Date.now();
		} catch (error) {
			outagesError = error instanceof Error ? error.message : 'Failed to load outages';
		} finally {
			outagesLoading = false;
		}
	}

	$effect(() => {
		const next = calculateStrategicRiskOverview({
			news: recentNews,
			stabilityScores: intelState.stability?.scores ?? null,
			outages,
			theaters: THEATERS,
			previousCompositeScore
		});
		overview = next;
		previousCompositeScore = next.compositeScore;
	});

	onMount(() => {
		void loadOutages();
		const interval = window.setInterval(() => {
			void loadOutages();
		}, 10 * 60 * 1000);
		return () => window.clearInterval(interval);
	});
</script>

<Panel
	id="strategic_risk"
	title={t($language, 'panelName.strategic_risk')}
	loading={panelLoading}
	error={panelError}
>
	{#snippet actions()}
		<button
			type="button"
			class="source-help-btn"
			onclick={() => (showSignalSources = !showSignalSources)}
			aria-label={copy.helpLabel}
			aria-expanded={showSignalSources}
			title={copy.helpTitle}
		>
			?
		</button>
	{/snippet}

	{#if overview}
		{@const scoreColor = getScoreColor(overview.compositeScore)}
		{@const scoreDeg = Math.round((overview.compositeScore / 100) * 360)}
		<div class="risk-root">
			{#if showSignalSources}
				<div class="source-tooltip">
					<div class="source-title">{copy.sourceTitle}</div>
					<div class="source-line">
						<strong>{copy.newsStream}</strong>
						<span>{interpolate(copy.headlinesIn24h, { count: recentNews.length })}</span>
					</div>
					<div class="source-line">
						<strong>{copy.countryStability}</strong>
						<span>
							{intelState.stability
								? interpolate(copy.countriesLoaded, { count: Object.keys(intelState.stability.scores).length })
								: copy.notLoaded}
						</span>
					</div>
					<div class="source-line">
						<strong>{copy.infrastructureOutages}</strong>
						<span>{interpolate(copy.outageEvents, { count: outages.length })}</span>
					</div>
					<div class="source-line">
						<strong>{copy.theaterModel}</strong>
						<span>{interpolate(copy.theaterMapping, { count: THEATERS.length })}</span>
					</div>
					<div class="source-breakdown">
						{copy.compositeModel}
						<code>0.3*convergence + 0.5*instability + 0.2*infrastructure + boosts</code>
					</div>
					<div class="source-breakdown">
						{copy.currentFactors}
						<code>
							c={overview.breakdown.convergenceScore}, i={overview.breakdown.ciiRiskScore},
							infra={overview.breakdown.infraScore}, theater={overview.breakdown.theaterBoost},
							breaking={overview.breakdown.breakingBoost}
						</code>
					</div>
				</div>
			{/if}

			<div class="gauge-row">
				<div
					class="gauge"
					style="--score-color: {scoreColor}; --score-deg: {scoreDeg}deg;"
					aria-label={copy.ariaComposite}
				>
					<div class="gauge-inner">
						<div class="gauge-score" style="color: {scoreColor}">{overview.compositeScore}</div>
						<div class="gauge-level" style="color: {scoreColor}">{getLevelLabel(overview.level)}</div>
					</div>
				</div>
				<div class="gauge-meta">
					<div class="trend-label">{copy.trend}</div>
					<div class="trend-value {overview.trend}">{getTrendLabel(overview.trend)}</div>
					<div class="updated-at">
						{interpolate(copy.updatedAt, { time: overview.timestamp.toLocaleTimeString() })}
					</div>
				</div>
			</div>

			<div class="metrics-grid">
				<div class="metric">
					<div class="metric-value">{overview.convergenceAlerts}</div>
					<div class="metric-label">{copy.convergenceZones}</div>
				</div>
				<div class="metric">
					<div class="metric-value">{overview.avgCIIDeviation.toFixed(1)}</div>
					<div class="metric-label">{copy.topInstabilityScore}</div>
				</div>
				<div class="metric">
					<div class="metric-value">{overview.infrastructureIncidents}</div>
					<div class="metric-label">{copy.majorOutages}</div>
				</div>
				<div class="metric">
					<div class="metric-value">{overview.recentAlerts.length}</div>
					<div class="metric-label">{copy.activeAlerts}</div>
				</div>
			</div>

			<div class="section">
				<div class="section-title">{copy.topRisks}</div>
				{#if overview.topRisks.length > 0}
					<ul class="risk-list">
						{#each overview.topRisks as risk, idx}
							<li class="risk-item">
								<span class="risk-rank">{idx + 1}.</span>
								{#if idx === 0 && primaryConvergenceZone}
									<button
										type="button"
										class="risk-link"
										onclick={() =>
											focusMap(primaryConvergenceZone.lat, primaryConvergenceZone.lon, 'context')}
									>
										{risk}
									</button>
								{:else}
									<span class="risk-text">{risk}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<div class="empty">{copy.noDominantRisks}</div>
				{/if}
			</div>

			<div class="section">
				<div class="section-title">{copy.theaterConvergence}</div>
				<div class="theater-list">
					{#each overview.theaterScores.slice(0, 4) as theater}
						<div class="theater-card" class:expanded={expandedTheaterId === theater.theaterId}>
							<button
								type="button"
								class="theater-row theater-row-btn"
								onclick={() => toggleTheaterSignals(theater.theaterId)}
								title={interpolate(copy.showSignalsFor, { name: theater.theaterName })}
							>
								<div class="theater-header">
									<span class="theater-name">{theater.theaterName}</span>
									<span class="theater-count">{interpolate(copy.signalsCount, { count: theater.signalCount })}</span>
								</div>
								<div class="theater-bar-bg">
									<div class="theater-bar" style="width: {Math.round(theater.score)}%"></div>
								</div>
								<div class="theater-expand-indicator">
									{expandedTheaterId === theater.theaterId ? copy.signalsExpanded : copy.signalsCollapsed}
								</div>
							</button>

							{#if expandedTheaterId === theater.theaterId}
								<div class="theater-signals">
									<div class="theater-signal-meta">
										<span class="theater-chip">{interpolate(copy.domainsCount, { count: theater.typeCount })}</span>
										<span class="theater-chip">{interpolate(copy.highPriorityCount, { count: theater.alertCount })}</span>
										<button
											type="button"
											class="theater-map-btn"
											onclick={() => focusMap(theater.centerLat, theater.centerLon, 'context')}
										>
											{copy.focusMap}
										</button>
									</div>
									{#if theater.topSignals.length > 0}
										<div class="theater-signal-list">
											{#each theater.topSignals as signal}
												<a
													class="theater-signal-item"
													href={signal.link}
													target="_blank"
													rel="noopener noreferrer"
												>
													<div class="signal-title">{signal.title}</div>
													<div class="signal-meta">
														<span>{signal.source}</span>
														<span>{formatSignalTime(signal.timestamp)}</span>
													</div>
												</a>
											{/each}
										</div>
										{:else}
											<div class="empty">{copy.noUnderlyingSignals}</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
			</div>

			<div class="section">
				<div class="section-title">{copy.recentAlerts}</div>
				{#if overview.recentAlerts.length > 0}
					<div class="alerts-list">
						{#each overview.recentAlerts.slice(0, 5) as alert}
							{#if alert.location}
								<button
									type="button"
									class="alert-row alert-row-btn"
									onclick={() => focusMap(alert.location?.lat ?? 0, alert.location?.lon ?? 0)}
									title={interpolate(copy.focusMapOn, { name: alert.location.label })}
								>
									<div class="alert-head">
										<span class="priority" style="background-color: {getPriorityColor(alert.priority)}">
											{alert.priority.toUpperCase()}
										</span>
										<span class="alert-title">{alert.title}</span>
									</div>
									<div class="alert-summary">{alert.summary}</div>
									<div class="alert-time">{formatRelativeTime(alert.timestamp)}</div>
								</button>
							{:else}
								<div class="alert-row">
									<div class="alert-head">
										<span class="priority" style="background-color: {getPriorityColor(alert.priority)}">
											{alert.priority.toUpperCase()}
										</span>
										<span class="alert-title">{alert.title}</span>
									</div>
									<div class="alert-summary">{alert.summary}</div>
									<div class="alert-time">{formatRelativeTime(alert.timestamp)}</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="empty">{copy.noRiskAlerts24h}</div>
				{/if}
			</div>

			<div class="footnote">
				{#if outagesError}
					{interpolate(copy.outageFeedWarning, { error: outagesError })}
				{:else if outagesGeneratedAt}
					{interpolate(copy.outageFeedUpdated, { time: new Date(outagesGeneratedAt).toLocaleTimeString() })}
				{/if}
			</div>
		</div>
	{/if}
</Panel>

<style>
	.risk-root {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.gauge-row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.8rem;
		align-items: center;
	}

	.source-help-btn {
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
		padding: 0;
	}

	.source-help-btn:hover {
		background: rgba(255, 255, 255, 0.16);
	}

	.source-tooltip {
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 6px;
		padding: 0.45rem 0.55rem;
		background: rgba(12, 17, 24, 0.9);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.source-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #c9d6e2;
		font-weight: 700;
	}

	.source-line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
		font-size: 0.7rem;
		color: var(--text-muted, #a9b1b9);
	}

	.source-line strong {
		color: #e4edf4;
		font-weight: 600;
	}

	.source-breakdown {
		font-size: 0.66rem;
		color: var(--text-muted, #94a2b2);
		line-height: 1.35;
	}

	.source-breakdown code {
		background: rgba(255, 255, 255, 0.06);
		padding: 0.07rem 0.25rem;
		border-radius: 4px;
		color: #dde9f4;
		font-size: 0.63rem;
	}

	.gauge {
		width: 102px;
		height: 102px;
		border-radius: 999px;
		background:
			conic-gradient(var(--score-color) 0deg var(--score-deg), rgba(255, 255, 255, 0.08) var(--score-deg) 360deg);
		display: grid;
		place-items: center;
	}

	.gauge-inner {
		width: 80px;
		height: 80px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border, #333);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.gauge-score {
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1;
	}

	.gauge-level {
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-top: 0.15rem;
		font-weight: 600;
	}

	.gauge-meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.trend-label {
		color: var(--text-muted, #7f7f7f);
		font-size: 0.67rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.trend-value {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.trend-value.escalating {
		color: #ef4444;
	}

	.trend-value.stable {
		color: #facc15;
	}

	.trend-value.de-escalating {
		color: #22c55e;
	}

	.updated-at {
		color: var(--text-muted, #7f7f7f);
		font-size: 0.68rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.metric {
		border: 1px solid var(--border, #2f2f2f);
		border-radius: 6px;
		padding: 0.45rem 0.5rem;
		background: rgba(255, 255, 255, 0.015);
	}

	.metric-value {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text);
	}

	.metric-label {
		margin-top: 0.1rem;
		font-size: 0.66rem;
		color: var(--text-muted, #888);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.section {
		border-top: 1px solid var(--border, #2f2f2f);
		padding-top: 0.45rem;
	}

	.section-title {
		font-size: 0.72rem;
		color: var(--text-muted, #888);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 0.35rem;
	}

	.risk-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.risk-item {
		display: flex;
		gap: 0.45rem;
		font-size: 0.78rem;
		align-items: baseline;
	}

	.risk-rank {
		color: #9ca3af;
		min-width: 0.95rem;
	}

	.risk-text {
		color: var(--text);
	}

	.risk-link {
		background: none;
		border: none;
		color: var(--text);
		padding: 0;
		margin: 0;
		font: inherit;
		text-align: left;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.3);
		text-underline-offset: 2px;
	}

	.risk-link:hover {
		text-decoration-color: rgba(255, 255, 255, 0.7);
	}

	.theater-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.theater-row {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.theater-card {
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.015);
	}

	.theater-card.expanded {
		border-color: rgba(255, 255, 255, 0.14);
	}

	.theater-row-btn {
		width: 100%;
		border: 1px solid transparent;
		background: transparent;
		padding: 0.3rem 0.35rem;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
	}

	.theater-row-btn:hover {
		border-color: rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.03);
	}

	.theater-expand-indicator {
		margin-top: 0.2rem;
		font-size: 0.63rem;
		color: var(--text-muted, #8c8c8c);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.theater-signals {
		padding: 0 0.45rem 0.45rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.theater-signal-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.theater-chip {
		font-size: 0.62rem;
		padding: 0.08rem 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 999px;
		color: var(--text-muted, #9ca3af);
	}

	.theater-map-btn {
		margin-left: auto;
		font-size: 0.62rem;
		padding: 0.16rem 0.4rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.06);
		color: #dbe7f1;
		cursor: pointer;
	}

	.theater-map-btn:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	.theater-signal-list {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.theater-signal-item {
		display: block;
		text-decoration: none;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		padding: 0.3rem 0.35rem;
		background: rgba(255, 255, 255, 0.015);
	}

	.theater-signal-item:hover {
		border-color: rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.04);
	}

	.signal-title {
		font-size: 0.7rem;
		line-height: 1.3;
		color: var(--text);
	}

	.signal-meta {
		margin-top: 0.14rem;
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
		font-size: 0.6rem;
		color: var(--text-muted, #8b95a1);
	}

	.theater-header {
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
		font-size: 0.74rem;
	}

	.theater-name {
		color: var(--text);
	}

	.theater-count {
		color: var(--text-muted, #8a8a8a);
		white-space: nowrap;
	}

	.theater-bar-bg {
		height: 5px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 999px;
		overflow: hidden;
	}

	.theater-bar {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, #facc15 0%, #f97316 55%, #ef4444 100%);
	}

	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.alert-row {
		border: 1px solid var(--border, #2f2f2f);
		border-radius: 6px;
		padding: 0.4rem 0.45rem;
		background: rgba(255, 255, 255, 0.015);
	}

	.alert-row-btn {
		width: 100%;
		text-align: left;
		cursor: pointer;
	}

	.alert-row-btn:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.03);
	}

	.alert-head {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.priority {
		color: #0b0b0b;
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		padding: 0.08rem 0.3rem;
		border-radius: 999px;
	}

	.alert-title {
		font-size: 0.73rem;
		color: var(--text);
		font-weight: 600;
		line-height: 1.2;
	}

	.alert-summary {
		margin-top: 0.2rem;
		font-size: 0.68rem;
		color: var(--text-muted, #9b9b9b);
		line-height: 1.35;
	}

	.alert-time {
		margin-top: 0.2rem;
		font-size: 0.63rem;
		color: var(--text-muted, #7f7f7f);
	}

	.empty {
		font-size: 0.73rem;
		color: var(--text-muted, #8d8d8d);
		padding: 0.15rem 0;
	}

	.footnote {
		border-top: 1px dashed var(--border, #2f2f2f);
		padding-top: 0.35rem;
		font-size: 0.64rem;
		color: var(--text-muted, #7d7d7d);
	}
</style>
