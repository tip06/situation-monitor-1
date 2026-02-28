<script lang="ts">
	import Modal from './Modal.svelte';
	import FeedDiagnostics from './FeedDiagnostics.svelte';
	import { settings, language, sources } from '$lib/stores';
	import { t } from '$lib/i18n';
	import type { NewsCategory, SourceMutationError } from '$lib/types';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	const SOURCE_CATEGORIES: NewsCategory[] = [
		'politics',
		'tech',
		'finance',
		'gov',
		'ai',
		'intel',
		'brazil',
		'latam',
		'iran',
		'venezuela',
		'greenland',
		'fringe'
	];

	let { open = false, onClose }: Props = $props();

	let activeSettingsTab = $state<'general' | 'feeds'>('general');
	let selectedCategory = $state<NewsCategory>('brazil');
	let sourceName = $state('');
	let sourceUrl = $state('');
	let sourceType = $state<'rss' | 'html' | 'auto'>('rss');
	let sourceError = $state('');
	let testResult = $state<{ ok: boolean; message: string; suggestion?: string; googleNewsUrl?: string } | null>(null);
	let isTesting = $state(false);
	let editingSourceId = $state<string | null>(null);
	let editCategory = $state<NewsCategory>('brazil');
	let editName = $state('');
	let editUrl = $state('');
	let editEnabled = $state(true);
	let editSourceType = $state<'rss' | 'html' | 'auto'>('rss');
	let editError = $state('');

	function setLocale(locale: 'en' | 'pt-BR') {
		language.setLocale(locale);
	}

	function setTheme(theme: 'light' | 'dark') {
		settings.setTheme(theme);
	}

	function getSourceErrorMessage(error: SourceMutationError): string {
		if (error === 'required') return t($language, 'settings.requiredField');
		if (error === 'invalid-url') return t($language, 'settings.invalidUrl');
		if (error === 'duplicate') return t($language, 'settings.duplicateSource');
		if (error === 'not-found') return t($language, 'settings.sourceNotFound');
		if (error === 'built-in-protected') return t($language, 'settings.sourceProtected');
		return t($language, 'settings.sourceUpdateFailed');
	}

	async function addSource() {
		const result = sources.addSource({
			category: selectedCategory,
			name: sourceName,
			url: sourceUrl,
			...(sourceType !== 'auto' ? { sourceType } : {})
		});
		const resolved = await result;

		if (!resolved.ok) {
			sourceError = getSourceErrorMessage(resolved.error);
			return;
		}

		sourceName = '';
		sourceUrl = '';
		sourceType = 'rss';
		sourceError = '';
		testResult = null;
	}

	async function testSource() {
		if (!sourceUrl.trim()) {
			sourceError = t($language, 'settings.requiredField');
			return;
		}
		isTesting = true;
		testResult = null;
		sourceError = '';

		try {
			const res = await fetch('/api/sources/test', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url: sourceUrl,
					...(sourceType !== 'auto' ? { sourceType } : {})
				})
			});
			const data = await res.json();

			if (data.ok) {
				testResult = {
					ok: true,
					message: `${t($language, 'settings.testSuccess').replace('{count}', String(data.itemCount))} (${t($language, 'settings.testDetectedAs').replace('{type}', data.detectedType?.toUpperCase() ?? 'RSS')})`
				};
			} else {
				testResult = {
					ok: false,
					message: data.error ?? t($language, 'settings.testFailed'),
					suggestion: data.suggestion,
					googleNewsUrl: data.googleNewsUrl
				};
			}
		} catch {
			testResult = { ok: false, message: t($language, 'settings.testFailed') };
		} finally {
			isTesting = false;
		}
	}

	function applyGoogleNews() {
		if (testResult?.googleNewsUrl) {
			sourceUrl = testResult.googleNewsUrl;
			sourceType = 'rss';
			testResult = null;
		}
	}

	function beginEdit(source: {
		id: string;
		category: NewsCategory;
		name: string;
		url: string;
		enabled: boolean;
		sourceType?: 'rss' | 'html';
	}) {
		editingSourceId = source.id;
		editCategory = source.category;
		editName = source.name;
		editUrl = source.url;
		editEnabled = source.enabled;
		editSourceType = source.sourceType ?? 'auto';
		editError = '';
	}

	function cancelEdit() {
		editingSourceId = null;
		editError = '';
	}

	async function saveEdit() {
		if (!editingSourceId) return;
		const result = await sources.updateSource({
			id: editingSourceId,
			category: editCategory,
			name: editName,
			url: editUrl,
			enabled: editEnabled,
			...(editSourceType !== 'auto' ? { sourceType: editSourceType } : {})
		});
		if (!result.ok) {
			editError = getSourceErrorMessage(result.error);
			return;
		}
		editingSourceId = null;
		editError = '';
	}

	async function toggleSource(id: string) {
		const result = await sources.toggleSource(id);
		if (!result.ok) {
			sourceError = getSourceErrorMessage(result.error);
		}
	}

	async function deleteSource(id: string) {
		const result = await sources.deleteSource(id);
		if (!result.ok) {
			sourceError = getSourceErrorMessage(result.error);
		}
		if (editingSourceId === id) {
			editingSourceId = null;
			editError = '';
		}
	}
</script>

<Modal {open} title={t($language, 'settings.title')} {onClose}>
	<div class="settings-tabs">
		<button
			type="button"
			class="settings-tab"
			class:active={activeSettingsTab === 'general'}
			onclick={() => activeSettingsTab = 'general'}
		>
			Settings
		</button>
		<button
			type="button"
			class="settings-tab"
			class:active={activeSettingsTab === 'feeds'}
			onclick={() => activeSettingsTab = 'feeds'}
		>
			Feed Health
		</button>
	</div>

	{#if activeSettingsTab === 'feeds'}
		<FeedDiagnostics />
	{:else}
	<div class="settings-sections">
		<section class="settings-section">
			<h3 class="section-title">{t($language, 'settings.languageSection')}</h3>
			<div class="segmented-control">
				<button
					type="button"
					class="segmented-btn"
					class:active={$language === 'en'}
					onclick={() => setLocale('en')}
				>
					<span class="flag">🇺🇸</span> {t($language, 'settings.languageEnglish')}
				</button>
				<button
					type="button"
					class="segmented-btn"
					class:active={$language === 'pt-BR'}
					onclick={() => setLocale('pt-BR')}
				>
					<span class="flag">🇧🇷</span> {t($language, 'settings.languagePortuguese')}
				</button>
			</div>
		</section>

		<section class="settings-section">
			<h3 class="section-title">{t($language, 'settings.themeSection')}</h3>
			<div class="segmented-control">
				<button
					type="button"
					class="segmented-btn"
					class:active={$settings.theme === 'light'}
					onclick={() => setTheme('light')}
				>
					{t($language, 'settings.themeLight')}
				</button>
				<button
					type="button"
					class="segmented-btn"
					class:active={$settings.theme === 'dark'}
					onclick={() => setTheme('dark')}
				>
					{t($language, 'settings.themeDark')}
				</button>
			</div>
		</section>

		<section class="settings-section">
			<h3 class="section-title">{t($language, 'settings.addSourceSection')}</h3>
			<div class="form-grid">
				<label>
					<span>{t($language, 'settings.sourceCategory')}</span>
					<select bind:value={selectedCategory}>
						{#each SOURCE_CATEGORIES as category}
							{@const categoryLabel = `panelName.${category}` as const}
							<option value={category}>{t($language, categoryLabel)}</option>
						{/each}
					</select>
				</label>
				<label>
					<span>{t($language, 'settings.sourceType')}</span>
					<div class="segmented-control compact">
						<button type="button" class="segmented-btn" class:active={sourceType === 'rss'} onclick={() => sourceType = 'rss'}>
							{t($language, 'settings.sourceTypeRss')}
						</button>
						<button type="button" class="segmented-btn" class:active={sourceType === 'html'} onclick={() => sourceType = 'html'}>
							{t($language, 'settings.sourceTypeHtml')}
						</button>
						<button type="button" class="segmented-btn" class:active={sourceType === 'auto'} onclick={() => sourceType = 'auto'}>
							{t($language, 'settings.sourceTypeAuto')}
						</button>
					</div>
				</label>
				<label>
					<span>{t($language, 'settings.sourceName')}</span>
					<input type="text" bind:value={sourceName} placeholder={t($language, 'settings.sourceName')} />
				</label>
				<label>
					<span>{t($language, 'settings.sourceUrl')}</span>
					<input
						type="url"
						bind:value={sourceUrl}
						placeholder={sourceType === 'html' ? 'https://example.com/news' : 'https://example.com/feed.xml'}
					/>
				</label>
			</div>
			{#if sourceError}
				<p class="error">{sourceError}</p>
			{/if}
			{#if testResult}
				<p class={testResult.ok ? 'test-success' : 'test-error'}>
					{testResult.message}
				</p>
				{#if testResult.suggestion === 'google-news' && testResult.googleNewsUrl}
					<div class="google-news-suggestion">
						<span>{t($language, 'settings.tryGoogleNews')}</span>
						<button type="button" class="action-btn" onclick={applyGoogleNews}>
							{t($language, 'settings.applyGoogleNews')}
						</button>
					</div>
				{/if}
			{/if}
			<div class="btn-row">
				<button class="primary-btn" onclick={addSource}>{t($language, 'settings.addSource')}</button>
				<button class="primary-btn secondary" onclick={testSource} disabled={isTesting}>
					{isTesting ? t($language, 'settings.testing') : t($language, 'settings.testSource')}
				</button>
			</div>
		</section>

		<section class="settings-section">
			<h3 class="section-title">{t($language, 'settings.manageSources')}</h3>
			<div class="sources-list">
				{#each SOURCE_CATEGORIES as category}
					{@const categoryLabel = `panelName.${category}` as const}
					{@const items = $sources.records.filter((record) => record.category === category)}
					<div class="source-group">
						<h4 class="source-group-title">{t($language, categoryLabel)}</h4>
						{#if items.length === 0}
							<p class="empty">{t($language, 'settings.noSourcesInCategory')}</p>
						{:else}
							{#each items as source}
								<div class="source-row">
									<div class="source-meta">
										{#if source.isCustom && editingSourceId === source.id}
											<div class="edit-grid">
												<label>
													<span>{t($language, 'settings.sourceCategory')}</span>
													<select bind:value={editCategory}>
														{#each SOURCE_CATEGORIES as cat}
															{@const editCategoryLabel = `panelName.${cat}` as const}
															<option value={cat}>{t($language, editCategoryLabel)}</option>
														{/each}
													</select>
												</label>
												<label>
													<span>{t($language, 'settings.sourceType')}</span>
													<div class="segmented-control compact">
														<button type="button" class="segmented-btn" class:active={editSourceType === 'rss'} onclick={() => editSourceType = 'rss'}>RSS</button>
														<button type="button" class="segmented-btn" class:active={editSourceType === 'html'} onclick={() => editSourceType = 'html'}>HTML</button>
														<button type="button" class="segmented-btn" class:active={editSourceType === 'auto'} onclick={() => editSourceType = 'auto'}>Auto</button>
													</div>
												</label>
												<label>
													<span>{t($language, 'settings.sourceName')}</span>
													<input type="text" bind:value={editName} />
												</label>
												<label>
													<span>{t($language, 'settings.sourceUrl')}</span>
													<input type="url" bind:value={editUrl} />
												</label>
											</div>
											{#if editError}
												<p class="error">{editError}</p>
											{/if}
										{:else}
											<div class="source-name-row">
												<span class="source-name">{source.name}</span>
												{#if source.sourceType}
													<span class="source-type-badge">{source.sourceType.toUpperCase()}</span>
												{/if}
											</div>
											<span class="source-url">{source.url}</span>
										{/if}
									</div>
									<div class="source-actions">
										<input
											type="checkbox"
											checked={source.enabled}
											onchange={() => toggleSource(source.id)}
											aria-label={source.enabled
												? t($language, 'settings.sourceEnabled')
												: t($language, 'settings.sourceDisabled')}
										/>
										{#if source.isCustom}
											{#if editingSourceId === source.id}
												<button type="button" class="action-btn" onclick={saveEdit}>
													{t($language, 'settings.saveSource')}
												</button>
												<button type="button" class="action-btn" onclick={cancelEdit}>
													{t($language, 'settings.cancelEdit')}
												</button>
											{:else}
												<button type="button" class="action-btn" onclick={() => beginEdit(source)}>
													{t($language, 'settings.editSource')}
												</button>
											{/if}
											<button type="button" class="action-btn danger" onclick={() => deleteSource(source.id)}>
												{t($language, 'settings.deleteSource')}
											</button>
										{/if}
									</div>
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			</div>
		</section>
	</div>
	{/if}
</Modal>

<style>
	.settings-tabs {
		display: flex;
		gap: 0.3rem;
		margin-bottom: 0.8rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.3rem;
	}

	.settings-tab {
		padding: 0.35rem 0.7rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 4px 4px 0 0;
		color: var(--text-muted);
		font-size: 0.62rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.settings-tab:hover {
		color: var(--text-primary);
	}

	.settings-tab.active {
		color: var(--text-primary);
		border-color: var(--border);
		border-bottom-color: var(--bg);
		background: rgba(255, 255, 255, 0.03);
	}

	.settings-sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		margin: 0;
	}

	.segmented-control {
		display: flex;
		gap: 0.4rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		padding: 0.3rem;
		border-radius: 8px;
	}

	.segmented-btn {
		flex: 1;
		border: 1px solid transparent;
		background: transparent;
		color: var(--text-secondary);
		border-radius: 6px;
		padding: 0.45rem 0.65rem;
		font-size: 0.65rem;
		cursor: pointer;
	}

	.segmented-btn.active {
		border-color: var(--accent);
		background: rgba(var(--accent-rgb), 0.14);
		color: var(--text-primary);
	}

	.flag {
		margin-right: 0.25rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.62rem;
		color: var(--text-secondary);
	}

	select,
	input {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		color: var(--text-primary);
		border-radius: 4px;
		padding: 0.45rem 0.55rem;
		font-size: 0.65rem;
	}

	.primary-btn {
		align-self: flex-start;
		padding: 0.45rem 0.8rem;
		background: rgba(var(--accent-rgb), 0.16);
		border: 1px solid rgba(var(--accent-rgb), 0.4);
		color: var(--text-primary);
		border-radius: 4px;
		font-size: 0.65rem;
		cursor: pointer;
	}

	.error {
		margin: 0;
		font-size: 0.6rem;
		color: var(--danger);
	}

	.sources-list {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		max-height: 340px;
		overflow: auto;
		padding-right: 0.25rem;
	}

	.source-group {
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.02);
	}

	.source-group-title {
		margin: 0 0 0.4rem;
		font-size: 0.68rem;
		color: var(--text-primary);
	}

	.empty {
		margin: 0;
		font-size: 0.6rem;
		color: var(--text-muted);
	}

	.source-row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.3rem 0;
	}

	.source-row + .source-row {
		border-top: 1px solid var(--border);
	}

	.source-meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.source-name {
		font-size: 0.64rem;
		color: var(--text-primary);
	}

	.source-url {
		font-size: 0.56rem;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 280px;
	}

	.source-actions {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.action-btn {
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-secondary);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0.2rem 0.4rem;
		font-size: 0.58rem;
		cursor: pointer;
	}

	.action-btn.danger {
		color: #ff9f9f;
		border-color: rgba(255, 120, 120, 0.35);
	}

	.edit-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.35rem;
	}

	.segmented-control.compact {
		padding: 0.2rem;
	}

	.segmented-control.compact .segmented-btn {
		padding: 0.3rem 0.5rem;
		font-size: 0.6rem;
	}

	.btn-row {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.primary-btn.secondary {
		background: rgba(255, 255, 255, 0.04);
		border-color: var(--border);
	}

	.primary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.test-success {
		margin: 0;
		font-size: 0.6rem;
		color: #6fcf97;
	}

	.test-error {
		margin: 0;
		font-size: 0.6rem;
		color: var(--danger);
	}

	.google-news-suggestion {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.58rem;
		color: var(--text-secondary);
		background: rgba(255, 200, 50, 0.08);
		border: 1px solid rgba(255, 200, 50, 0.2);
		border-radius: 4px;
		padding: 0.3rem 0.5rem;
	}

	.source-name-row {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.source-type-badge {
		font-size: 0.48rem;
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
		background: rgba(var(--accent-rgb), 0.12);
		color: var(--text-secondary);
		font-weight: 600;
		letter-spacing: 0.04em;
	}
</style>
