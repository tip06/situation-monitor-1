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
	let sourceError = $state('');
	let editingSourceId = $state<string | null>(null);
	let editCategory = $state<NewsCategory>('brazil');
	let editName = $state('');
	let editUrl = $state('');
	let editEnabled = $state(true);
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
			url: sourceUrl
		});
		const resolved = await result;

		if (!resolved.ok) {
			sourceError = getSourceErrorMessage(resolved.error);
			return;
		}

		sourceName = '';
		sourceUrl = '';
		sourceError = '';
	}

	function beginEdit(source: {
		id: string;
		category: NewsCategory;
		name: string;
		url: string;
		enabled: boolean;
	}) {
		editingSourceId = source.id;
		editCategory = source.category;
		editName = source.name;
		editUrl = source.url;
		editEnabled = source.enabled;
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
			enabled: editEnabled
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
					<span>{t($language, 'settings.sourceName')}</span>
					<input type="text" bind:value={sourceName} placeholder={t($language, 'settings.sourceName')} />
				</label>
				<label>
					<span>{t($language, 'settings.sourceUrl')}</span>
					<input type="url" bind:value={sourceUrl} placeholder="https://example.com/rss.xml" />
				</label>
			</div>
			{#if sourceError}
				<p class="error">{sourceError}</p>
			{/if}
			<button class="primary-btn" onclick={addSource}>{t($language, 'settings.addSource')}</button>
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
											<span class="source-name">{source.name}</span>
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
</style>
