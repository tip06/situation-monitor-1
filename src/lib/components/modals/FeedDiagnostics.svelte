<script lang="ts">
	import { onMount } from 'svelte';

	interface FeedHealthInfo {
		lastAttempt: number;
		lastSuccess: number;
		consecutiveFailures: number;
		avgResponseTimeMs: number;
		lastError: string | null;
		totalRequests: number;
		totalSuccesses: number;
	}

	interface HealthData {
		newsCount: number;
		lastRefreshTime: number | null;
		feedHealth: Record<string, FeedHealthInfo>;
		circuitBreakers: Record<string, { state: string; failures: number; canRequest: boolean }>;
	}

	let healthData = $state<HealthData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let refreshing = $state(false);
	let filterStatus = $state<'all' | 'healthy' | 'failing'>('all');
	let searchQuery = $state('');

	async function loadHealth() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/health');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			healthData = await res.json();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function triggerRefresh() {
		refreshing = true;
		try {
			const res = await fetch('/api/refresh', { method: 'POST' });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const result = await res.json();
			if (result.errors?.length > 0) {
				error = `Refresh completed with ${result.errors.length} errors`;
			}
			await loadHealth();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			refreshing = false;
		}
	}

	function getStatus(health: FeedHealthInfo): 'green' | 'yellow' | 'red' {
		if (health.totalRequests === 0) return 'yellow';
		if (health.consecutiveFailures >= 5) return 'red';
		if (health.consecutiveFailures >= 2) return 'yellow';
		return 'green';
	}

	function getSuccessRate(health: FeedHealthInfo): string {
		if (health.totalRequests === 0) return '-';
		return `${Math.round((health.totalSuccesses / health.totalRequests) * 100)}%`;
	}

	function formatTime(ms: number): string {
		if (!ms) return '-';
		const diff = Date.now() - ms;
		if (diff < 60000) return `${Math.round(diff / 1000)}s ago`;
		if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
		return `${Math.round(diff / 3600000)}h ago`;
	}

	const feeds = $derived.by(() => {
		if (!healthData) return [];
		return Object.entries(healthData.feedHealth)
			.map(([key, health]) => {
				const [category, ...nameParts] = key.split('/');
				return {
					key,
					category,
					name: nameParts.join('/'),
					status: getStatus(health),
					health
				};
			})
			.filter((feed) => {
				if (filterStatus === 'healthy' && feed.status !== 'green') return false;
				if (filterStatus === 'failing' && feed.status === 'green') return false;
				if (searchQuery) {
					const q = searchQuery.toLowerCase();
					return feed.name.toLowerCase().includes(q) || feed.category.toLowerCase().includes(q);
				}
				return true;
			})
			.sort((a, b) => {
				// Sort failing first
				const statusOrder = { red: 0, yellow: 1, green: 2 };
				return statusOrder[a.status] - statusOrder[b.status] || a.category.localeCompare(b.category);
			});
	});

	const stats = $derived.by(() => {
		if (!healthData) return { total: 0, healthy: 0, failing: 0, unknown: 0 };
		const entries = Object.values(healthData.feedHealth);
		return {
			total: entries.length,
			healthy: entries.filter((h) => getStatus(h) === 'green').length,
			failing: entries.filter((h) => getStatus(h) === 'red').length,
			unknown: entries.filter((h) => getStatus(h) === 'yellow').length
		};
	});

	onMount(() => {
		loadHealth();
	});
</script>

<div class="diagnostics">
	<!-- Summary bar -->
	<div class="summary-bar">
		<div class="summary-item">
			<span class="summary-label">News items</span>
			<span class="summary-value">{healthData?.newsCount ?? '-'}</span>
		</div>
		<div class="summary-item">
			<span class="summary-label">Last refresh</span>
			<span class="summary-value">{healthData?.lastRefreshTime ? formatTime(healthData.lastRefreshTime) : '-'}</span>
		</div>
		<div class="summary-item">
			<span class="dot dot-green"></span>
			<span class="summary-value">{stats.healthy}</span>
		</div>
		<div class="summary-item">
			<span class="dot dot-yellow"></span>
			<span class="summary-value">{stats.unknown}</span>
		</div>
		<div class="summary-item">
			<span class="dot dot-red"></span>
			<span class="summary-value">{stats.failing}</span>
		</div>
		<button
			class="refresh-btn"
			onclick={triggerRefresh}
			disabled={refreshing}
		>
			{refreshing ? 'Refreshing...' : 'Refresh All'}
		</button>
	</div>

	<!-- Filters -->
	<div class="filter-row">
		<input
			type="text"
			class="search-input"
			placeholder="Filter feeds..."
			bind:value={searchQuery}
		/>
		<div class="status-filters">
			<button
				class="filter-chip"
				class:active={filterStatus === 'all'}
				onclick={() => filterStatus = 'all'}
			>All</button>
			<button
				class="filter-chip"
				class:active={filterStatus === 'healthy'}
				onclick={() => filterStatus = 'healthy'}
			>Healthy</button>
			<button
				class="filter-chip"
				class:active={filterStatus === 'failing'}
				onclick={() => filterStatus = 'failing'}
			>Failing</button>
		</div>
	</div>

	{#if loading}
		<div class="center-msg">Loading feed health data...</div>
	{:else if error}
		<div class="center-msg error-msg">{error}</div>
	{:else}
		<!-- Feed table -->
		<div class="feed-table-wrap">
			<table class="feed-table">
				<thead>
					<tr>
						<th></th>
						<th>Feed</th>
						<th>Category</th>
						<th>Success</th>
						<th>Avg ms</th>
						<th>Fails</th>
						<th>Last OK</th>
						<th>Error</th>
					</tr>
				</thead>
				<tbody>
					{#each feeds as feed (feed.key)}
						<tr>
							<td><span class="dot dot-{feed.status}"></span></td>
							<td class="feed-name">{feed.name}</td>
							<td class="feed-category">{feed.category}</td>
							<td>{getSuccessRate(feed.health)}</td>
							<td>{feed.health.avgResponseTimeMs ? Math.round(feed.health.avgResponseTimeMs) : '-'}</td>
							<td class:fail-count={feed.health.consecutiveFailures > 0}>{feed.health.consecutiveFailures}</td>
							<td>{feed.health.lastSuccess ? formatTime(feed.health.lastSuccess) : '-'}</td>
							<td class="error-cell" title={feed.health.lastError ?? ''}>{feed.health.lastError ? feed.health.lastError.slice(0, 40) : '-'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Circuit breakers -->
		{#if healthData?.circuitBreakers && Object.keys(healthData.circuitBreakers).length > 0}
			<div class="cb-section">
				<h4 class="cb-title">Circuit Breakers</h4>
				<div class="cb-list">
					{#each Object.entries(healthData.circuitBreakers).filter(([k]) => !k.startsWith('feed:')) as [name, cb]}
						<div class="cb-item">
							<span class="dot" class:dot-green={cb.state === 'CLOSED'} class:dot-red={cb.state === 'OPEN'} class:dot-yellow={cb.state === 'HALF_OPEN'}></span>
							<span class="cb-name">{name}</span>
							<span class="cb-state">{cb.state}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.diagnostics {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.summary-bar {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--border);
	}

	.summary-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.summary-label {
		font-size: 0.58rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.summary-value {
		font-size: 0.65rem;
		color: var(--text-primary);
		font-weight: 600;
	}

	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}

	.dot-green { background: #22c55e; }
	.dot-yellow { background: #eab308; }
	.dot-red { background: #ef4444; }

	.refresh-btn {
		margin-left: auto;
		padding: 0.3rem 0.6rem;
		background: rgba(var(--accent-rgb), 0.16);
		border: 1px solid rgba(var(--accent-rgb), 0.4);
		color: var(--text-primary);
		border-radius: 4px;
		font-size: 0.6rem;
		cursor: pointer;
	}

	.refresh-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filter-row {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.search-input {
		flex: 1;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 3px;
		color: var(--text);
		font-size: 0.6rem;
		padding: 0.25rem 0.4rem;
		outline: none;
	}

	.search-input::placeholder { color: var(--text-muted); }
	.search-input:focus { border-color: var(--indigo); }

	.status-filters {
		display: flex;
		gap: 0.2rem;
	}

	.filter-chip {
		font-size: 0.55rem;
		padding: 0.15rem 0.35rem;
		border-radius: 3px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
	}

	.filter-chip.active {
		background: rgba(79, 70, 229, 0.2);
		border-color: var(--indigo);
		color: white;
	}

	.center-msg {
		text-align: center;
		padding: 1.5rem;
		font-size: 0.65rem;
		color: var(--text-muted);
	}

	.error-msg {
		color: var(--danger);
	}

	.feed-table-wrap {
		max-height: 320px;
		overflow: auto;
	}

	.feed-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.58rem;
	}

	.feed-table th {
		text-align: left;
		color: var(--text-muted);
		font-weight: 500;
		text-transform: uppercase;
		font-size: 0.5rem;
		letter-spacing: 0.04em;
		padding: 0.3rem 0.4rem;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: var(--bg);
	}

	.feed-table td {
		padding: 0.25rem 0.4rem;
		border-bottom: 1px solid var(--border);
		color: var(--text-primary);
	}

	.feed-name {
		font-weight: 500;
		max-width: 140px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.feed-category {
		color: var(--text-muted);
		text-transform: uppercase;
		font-size: 0.52rem;
	}

	.fail-count {
		color: var(--danger);
		font-weight: 600;
	}

	.error-cell {
		color: var(--text-muted);
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.52rem;
	}

	.cb-section {
		border-top: 1px solid var(--border);
		padding-top: 0.5rem;
	}

	.cb-title {
		font-size: 0.62rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin: 0 0 0.3rem;
	}

	.cb-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.cb-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.6rem;
	}

	.cb-name {
		color: var(--text-primary);
		font-weight: 500;
	}

	.cb-state {
		color: var(--text-muted);
		font-size: 0.55rem;
		text-transform: uppercase;
	}
</style>
