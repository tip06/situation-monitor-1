<script lang="ts">
	import { Panel, Badge, InfoTooltip } from '$lib/components/common';
	import { Modal } from '$lib/components/modals';
	import { analyzeCorrelations } from '$lib/analysis/correlation';
	import {
		appendCompoundPatternManualAddition,
		loadCompoundPatternManualAdditions,
		type CompoundPatternAdditionCategory,
		type CompoundPatternManualAdditions
	} from '$lib/config/analysis';
	import type { NewsItem } from '$lib/types';
	import { language, alertNavigation } from '$lib/stores';
	import { t } from '$lib/i18n';
	import type { MessageKey } from '$lib/i18n/messages/en';
	import { untrack } from 'svelte';

	interface Props {
		news?: NewsItem[];
		loading?: boolean;
		error?: string | null;
	}

	let { news = [], loading = false, error = null }: Props = $props();

	const analysis = $derived(analyzeCorrelations(news, $language));

	// Modal state
	let modalOpen = $state(false);
	let modalTitle = $state('');
	let modalHeadlines = $state<Array<{ title: string; link: string; source: string }>>([]);
	let expandedSignals = $state<Record<string, boolean>>({});
	let expandedCompoundId = $state<string | null>(null);
	let collapsingCompoundId = $state<string | null>(null);
	let collapseTimer: ReturnType<typeof setTimeout> | null = null;
	let addCompoundId = $state<string | null>(null);
	let addCategory = $state<CompoundPatternAdditionCategory>('keyJudgments');
	let addText = $state('');
	let compoundAdditions = $state<CompoundPatternManualAdditions>({});

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

	function toggleCompoundDetails(signalId: string) {
		expandedSignals = {
			...expandedSignals,
			[signalId]: !expandedSignals[signalId]
		};
	}

	function toggleCompoundExpand(signalId: string) {
		const isExpanding = expandedCompoundId !== signalId;
		if (!isExpanding) {
			beginCollapse(signalId);
			return;
		}
		expandedCompoundId = signalId;
		collapsingCompoundId = null;
		if (collapseTimer) {
			clearTimeout(collapseTimer);
			collapseTimer = null;
		}
		if (isExpanding) {
			expandedSignals = {
				...expandedSignals,
				[signalId]: true
			};
		}
	}

	function openAddAnalysis(signalId: string) {
		expandedCompoundId = signalId;
		collapsingCompoundId = null;
		if (collapseTimer) {
			clearTimeout(collapseTimer);
			collapseTimer = null;
		}
		expandedSignals = {
			...expandedSignals,
			[signalId]: true
		};
		addCompoundId = signalId;
		addCategory = 'keyJudgments';
		addText = '';
	}

	function confirmAddAnalysis() {
		if (!addCompoundId) return;
		const value = addText.trim();
		if (!value) return;
		compoundAdditions = appendCompoundPatternManualAddition(
			$language,
			addCompoundId,
			addCategory,
			value
		);
		addText = '';
	}

	function cancelAddAnalysis() {
		addCompoundId = null;
		addText = '';
	}

	function closeExpandedCompound() {
		if (expandedCompoundId) {
			beginCollapse(expandedCompoundId);
		}
	}

	function beginCollapse(signalId: string) {
		if (addCompoundId === signalId) {
			addCompoundId = null;
			addText = '';
		}
		collapsingCompoundId = signalId;
		if (collapseTimer) {
			clearTimeout(collapseTimer);
		}
		collapseTimer = setTimeout(() => {
			if (collapsingCompoundId === signalId) {
				expandedCompoundId = null;
				collapsingCompoundId = null;
			}
			collapseTimer = null;
		}, 160);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && expandedCompoundId) {
			closeExpandedCompound();
		}
	}

	$effect(() => {
		compoundAdditions = loadCompoundPatternManualAdditions($language);
	});

	let lastNavNonce = 0;
	$effect(() => {
		const nav = $alertNavigation;
		if (nav.nonce === 0 || nav.nonce === lastNavNonce) return;
		if (nav.panelId !== 'correlation' || !nav.sourceId) return;
		lastNavNonce = nav.nonce;

		const currentAnalysis = untrack(() => analysis);
		if (!currentAnalysis) return;

		const compound = currentAnalysis.compoundSignals.find((s) => s.id === nav.sourceId);
		if (compound) {
			toggleCompoundExpand(compound.id);
			return;
		}

		const emerging = currentAnalysis.emergingPatterns.find((p) => p.id === nav.sourceId);
		if (emerging) {
			openHeadlines(emerging.name, emerging.headlines);
			return;
		}

		const momentum = currentAnalysis.momentumSignals.find((s) => s.id === nav.sourceId);
		if (momentum) {
			openHeadlines(momentum.name, momentum.headlines);
			return;
		}

		const predictive = currentAnalysis.predictiveSignals.find((s) => s.id === nav.sourceId);
		if (predictive) {
			openHeadlines(predictive.name, predictive.headlines);
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!expandedCompoundId) return;
		const { body } = document;
		const prevOverflow = body.style.overflow;
		const prevTouchAction = body.style.touchAction;
		body.classList.add('compound-expanded');
		body.style.overflow = 'hidden';
		body.style.touchAction = 'none';
		return () => {
			body.classList.remove('compound-expanded');
			body.style.overflow = prevOverflow;
			body.style.touchAction = prevTouchAction;
		};
	});

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
		const translated = t($language, `topic.${id}` as MessageKey);
		if (translated !== `topic.${id}`) return translated;
		return id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}

	function getAdded(signalId: string, key: CompoundPatternAdditionCategory): string[] {
		return compoundAdditions[signalId]?.[key] ?? [];
	}

</script>

<svelte:window onkeydown={handleKeydown} />

{#if expandedCompoundId}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="compound-expand-backdrop" onclick={closeExpandedCompound}></div>
{/if}

<Panel id="correlation" title={t($language, 'correlation.title')} {loading} {error} draggable={!expandedCompoundId}>
	{#if news.length === 0 && !loading && !error}
		<div class="empty-state">{t($language, 'correlation.insufficient')}</div>
	{:else if analysis}
		<div class="correlation-content" class:compound-expanded={!!expandedCompoundId}>
			{#if analysis.compoundSignals.length > 0}
				<div class="section">
					<div class="section-title">{t($language, 'correlation.compoundSignals')}<InfoTooltip text={t($language, 'tooltip.correlation.compoundSignals')} /></div>
					{#each analysis.compoundSignals.slice(0, 5) as signal}
						<div
							class="compound-item"
							class:critical={signal.level === 'critical'}
							class:expanded={expandedCompoundId === signal.id}
							class:collapsing={collapsingCompoundId === signal.id}
						>
							<div class="compound-header">
								<span class="compound-name">{signal.name}</span>
								<div class="compound-header-actions">
									<button
										type="button"
										class="compound-expand-btn"
										onclick={() => toggleCompoundExpand(signal.id)}
										aria-label={expandedCompoundId === signal.id ? t($language, 'panel.collapse') : t($language, 'panel.expand')}
										title={expandedCompoundId === signal.id ? t($language, 'panel.collapse') : t($language, 'panel.expand')}
									>
										{#if expandedCompoundId === signal.id}
											<svg viewBox="0 0 24 24" aria-hidden="true">
												<path
													fill="currentColor"
													d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4.5 2h5v5h-2V11.4l-4.3 4.3-1.4-1.4L12.6 10H10.5V8z"
												/>
											</svg>
										{:else}
											<svg viewBox="0 0 24 24" aria-hidden="true">
												<path
													fill="currentColor"
													d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 8.4L12.6 10H10.5V8h5v5h-2v-1.6l-4.3 4.3-1.4-1.3z"
												/>
											</svg>
										{/if}
									</button>
									<button
										type="button"
										class="compound-add-btn"
										onclick={() => openAddAnalysis(signal.id)}
										aria-label={t($language, 'correlation.addAnalysis')}
										title={t($language, 'correlation.addAnalysis')}
									>
										<svg viewBox="0 0 24 24" aria-hidden="true">
											<path
												fill="currentColor"
												d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"
											/>
										</svg>
									</button>
									<Badge
										text={t($language, `level.${signal.level}` as MessageKey).toUpperCase()}
										variant={signal.level === 'critical' ? 'danger' : 'warning'}
									/>
								</div>
							</div>
							<div class="compound-topics">
								{signal.activeTopics.map((t) => formatTopicName(t)).join(' + ')}
							</div>
							<div class="compound-actions">
								<button class="compound-action-btn" onclick={() => toggleCompoundDetails(signal.id)}>
									{expandedSignals[signal.id]
										? t($language, 'correlation.hideIntelligence')
										: t($language, 'correlation.showIntelligence')}
								</button>
								<button
									class="compound-action-btn secondary"
									onclick={() => openCompoundHeadlines(signal.name, signal.activeTopics)}
								>
									{t($language, 'correlation.viewHeadlines')}
								</button>
							</div>
							{#if addCompoundId === signal.id}
								<div class="compound-add-form">
									<div class="compound-add-fields">
										<div class="compound-add-field">
											<label class="compound-add-label" for={`compound-category-${signal.id}`}>
												{t($language, 'correlation.addCategory')}
											</label>
											<select
												id={`compound-category-${signal.id}`}
												class="compound-add-select"
												bind:value={addCategory}
											>
												<option value="keyJudgments">{t($language, 'correlation.category.keyJudgments')}</option>
												<option value="confirmationSignals">{t($language, 'correlation.category.confirmationSignals')}</option>
												<option value="assumptions">{t($language, 'correlation.category.assumptions')}</option>
												<option value="indicators">{t($language, 'correlation.category.indicators')}</option>
												<option value="changeTriggers">{t($language, 'correlation.category.changeTriggers')}</option>
											</select>
										</div>
										<div class="compound-add-field">
											<label class="compound-add-label" for={`compound-text-${signal.id}`}>
												{t($language, 'correlation.addText')}
											</label>
											<textarea
												id={`compound-text-${signal.id}`}
												class="compound-add-input"
												rows="3"
												bind:value={addText}
												placeholder={t($language, 'correlation.addPlaceholder')}
											></textarea>
										</div>
									</div>
									<div class="compound-add-actions">
										<button class="compound-add-confirm" type="button" onclick={confirmAddAnalysis}>
											{t($language, 'correlation.confirmAdd')}
										</button>
										<button class="compound-add-cancel" type="button" onclick={cancelAddAnalysis}>
											{t($language, 'correlation.cancelAdd')}
										</button>
									</div>
								</div>
							{/if}
							{#if expandedSignals[signal.id]}
								<div class="compound-intel">
									<div class="intel-block">
										<div class="intel-heading">{t($language, 'correlation.keyJudgments')}</div>
										<ul class="intel-list">
											{#each [...signal.keyJudgments, ...getAdded(signal.id, 'keyJudgments')] as judgment}
												<li>{judgment}</li>
											{/each}
										</ul>
									</div>
									<div class="intel-block">
										<div class="intel-heading">{t($language, 'correlation.confirmationSignals')}</div>
										<div class="indicator-chips">
											{#each [...signal.confirmationSignals, ...getAdded(signal.id, 'confirmationSignals')] as cs}
												<span class="indicator-chip">{cs}</span>
											{/each}
										</div>
									</div>
									<div class="intel-block">
										<div class="intel-heading">{t($language, 'correlation.assumptions')}</div>
										<ul class="intel-list">
											{#each [...signal.assumptions, ...getAdded(signal.id, 'assumptions')] as assumption}
												<li>{assumption}</li>
											{/each}
										</ul>
									</div>
									<div class="intel-block">
										<div class="intel-heading">{t($language, 'correlation.indicators')}</div>
										<div class="indicator-chips">
											{#each [...signal.indicators, ...getAdded(signal.id, 'indicators')] as indicator}
												<span class="indicator-chip">{indicator}</span>
											{/each}
										</div>
									</div>
									<div class="intel-block">
										<div class="intel-heading">{t($language, 'correlation.changeTriggers')}</div>
										<ul class="intel-list">
											{#each [...signal.changeTriggers, ...getAdded(signal.id, 'changeTriggers')] as trigger}
												<li>{trigger}</li>
											{/each}
										</ul>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.emergingPatterns.length > 0}
				<div class="section">
					<div class="section-title">{t($language, 'correlation.emergingPatterns')}<InfoTooltip text={t($language, 'tooltip.correlation.emergingPatterns')} /></div>
					{#each analysis.emergingPatterns.slice(0, 3) as pattern}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="pattern-item clickable" onclick={() => openHeadlines(pattern.name, pattern.headlines)}>
							<div class="pattern-header">
								<span class="pattern-topic">{pattern.name}</span>
								<Badge
									text={t($language, `level.${pattern.level}` as MessageKey).toUpperCase()}
									variant={getLevelVariant(pattern.level)}
								/>
							</div>
							<div class="pattern-sources">
								{pattern.sources.slice(0, 3).join(' · ')}
								({t($language, 'correlation.items', { count: pattern.count })})
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
					<div class="section-title">{t($language, 'correlation.momentumSignals')}<InfoTooltip text={t($language, 'tooltip.correlation.momentumSignals')} /></div>
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
					<div class="section-title">{t($language, 'correlation.crossSourceLinks')}<InfoTooltip text={t($language, 'tooltip.correlation.crossSourceLinks')} /></div>
					{#each analysis.crossSourceCorrelations.slice(0, 3) as corr}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="correlation-item clickable" onclick={() => openHeadlines(corr.name, corr.headlines)}>
							<div class="correlation-sources">
								{corr.sources.slice(0, 2).join(' ↔ ')}
							</div>
							<div class="correlation-topic">
								{corr.name}
								({t($language, 'correlation.sources', { count: corr.sourceCount })})
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.predictiveSignals.length > 0}
				<div class="section">
					<div class="section-title">{t($language, 'correlation.predictiveSignals')}<InfoTooltip text={t($language, 'tooltip.correlation.predictiveSignals')} /></div>
					{#each analysis.predictiveSignals.slice(0, 2) as signal}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="predictive-item clickable" onclick={() => openHeadlines(signal.name, signal.headlines)}>
							<div class="predictive-pattern">{signal.prediction}</div>
							<div class="predictive-confidence">
								{t($language, 'correlation.confidence', { value: Math.round(signal.confidence) })}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if analysis.emergingPatterns.length === 0 && analysis.momentumSignals.length === 0 && analysis.compoundSignals.length === 0}
				<div class="empty-state">{t($language, 'correlation.noPatterns')}</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">{t($language, 'correlation.noPatterns')}</div>
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
		<p class="empty-state">{t($language, 'correlation.noHeadlines')}</p>
	{/if}
</Modal>

<style>
	.compound-expand-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 1100;
	}

	.correlation-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.correlation-content.compound-expanded .compound-item:not(.expanded),
	.correlation-content.compound-expanded .pattern-item,
	.correlation-content.compound-expanded .signal-item,
	.correlation-content.compound-expanded .correlation-item,
	.correlation-content.compound-expanded .predictive-item,
	.correlation-content.compound-expanded .section-title,
	.correlation-content.compound-expanded .empty-state {
		opacity: 0.35;
		filter: blur(1.2px);
		transition: opacity 0.16s ease, filter 0.16s ease;
	}

	.correlation-content.compound-expanded .compound-item.expanded {
		opacity: 1;
		filter: none;
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

	.compound-header-actions {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.compound-expand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.2rem;
		height: 1.2rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0;
	}

	.compound-expand-btn:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	.compound-expand-btn svg {
		width: 0.75rem;
		height: 0.75rem;
	}

	.compound-add-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.2rem;
		height: 1.2rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		color: var(--text-primary);
		cursor: pointer;
		padding: 0;
	}

	.compound-add-btn:hover {
		background: rgba(255, 255, 255, 0.18);
		border-color: var(--text-primary);
	}

	.compound-add-btn svg {
		width: 0.75rem;
		height: 0.75rem;
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

	.compound-intel {
		margin-top: 0.35rem;
		padding: 0.45rem;
		border-radius: 4px;
		background: rgba(255, 165, 0, 0.1);
		border: 1px solid rgba(255, 165, 0, 0.2);
		font-size: 0.56rem;
		color: var(--warning);
		line-height: 1.4;
	}

	.compound-add-form {
		margin-top: 0.35rem;
		padding: 0.55rem;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.compound-add-fields {
		display: grid;
		gap: 0.45rem;
	}

	.compound-add-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.compound-add-label {
		font-size: 0.52rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.compound-add-select,
	.compound-add-input {
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-primary);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 4px;
		padding: 0.35rem 0.4rem;
		font-size: 0.6rem;
	}

	.compound-add-input {
		min-height: 3.2rem;
		resize: vertical;
	}

	.compound-add-actions {
		display: flex;
		gap: 0.4rem;
		justify-content: flex-end;
	}

	.compound-add-confirm,
	.compound-add-cancel {
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.3rem 0.7rem;
		font-size: 0.58rem;
		cursor: pointer;
	}

	.compound-add-confirm {
		background: rgba(80, 200, 120, 0.22);
		color: var(--text-primary);
		border-color: rgba(80, 200, 120, 0.45);
	}

	.compound-add-cancel {
		background: rgba(255, 80, 80, 0.2);
		color: var(--text-primary);
		border-color: rgba(255, 80, 80, 0.45);
	}

	.compound-item.expanded {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 1100px);
		max-height: min(85vh, 920px);
		overflow: auto;
		z-index: 1101;
		background: rgba(18, 18, 18, 0.98);
		border: 1px solid rgba(255, 165, 0, 0.35);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
		animation: expand-pop 0.18s ease-out;
	}

	.compound-item.expanded.collapsing {
		animation: collapse-pop 0.16s ease-in forwards;
	}

	@keyframes expand-pop {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes collapse-pop {
		from {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		to {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.97);
		}
	}

	.compound-item.expanded .compound-intel {
		font-size: 0.68rem;
	}

	.compound-item.expanded .compound-name {
		font-size: 0.78rem;
	}

	.compound-item.expanded .compound-topics {
		font-size: 0.66rem;
	}

	.compound-item.expanded .intel-heading {
		font-size: 0.58rem;
	}

	.compound-item.expanded .indicator-chip {
		font-size: 0.64rem;
	}

	.intel-block {
		margin-bottom: 0.45rem;
	}

	.intel-block:last-child {
		margin-bottom: 0;
	}

	.intel-heading {
		font-size: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-secondary);
		margin-bottom: 0.22rem;
	}

	.intel-list {
		margin: 0;
		padding-left: 1rem;
		color: var(--text-primary);
	}

	.intel-list li {
		margin-bottom: 0.15rem;
	}

	.intel-list li:last-child {
		margin-bottom: 0;
	}

	.indicator-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.indicator-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
		font-size: 0.54rem;
	}

	.compound-actions {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.3rem;
	}

	.compound-action-btn {
		border: 1px solid var(--warning);
		background: rgba(255, 165, 0, 0.08);
		color: var(--warning);
		font-size: 0.53rem;
		padding: 0.2rem 0.35rem;
		border-radius: 3px;
		cursor: pointer;
	}

	.compound-action-btn:hover {
		background: rgba(255, 165, 0, 0.14);
	}

	.compound-action-btn.secondary {
		border-color: var(--text-secondary);
		background: rgba(255, 255, 255, 0.03);
		color: var(--text-secondary);
	}

	:global(html[data-theme='light']) .compound-action-btn {
		border-color: #b45309;
		background: #f59e0b;
		color: #3b1f00;
	}

	:global(html[data-theme='light']) .compound-action-btn:hover {
		background: #d97706;
		color: #fff7ed;
	}

	:global(html[data-theme='light']) .compound-intel {
		background: #fef3c7;
		border-color: #d97706;
		color: #7c2d12;
	}

	:global(html[data-theme='light']) .intel-heading {
		color: #7c2d12;
	}

	:global(html[data-theme='light']) .indicator-chip {
		border-color: #d97706;
		background: #fde68a;
		color: #7c2d12;
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
