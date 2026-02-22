/**
 * Server hooks - background refresh worker
 */

import { refreshAllNews, fetchAllMarketsServer } from '$lib/server/fetcher';
import { deleteOldNews, setMeta } from '$lib/server/db';
import { NEWS_CATEGORIES } from '$lib/shared/news-parser';

const REFRESH_INTERVAL_MS = parseInt(process.env.REFRESH_INTERVAL_MS || '900000', 10); // 15 min default
let refreshInterval: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;

async function backgroundRefresh(): Promise<void> {
	if (isRefreshing) return;
	isRefreshing = true;

	console.log('[Background] Starting refresh cycle...');
	const start = Date.now();

	try {
		// Fetch news categories sequentially (gentle on the Pi)
		const result = await refreshAllNews(NEWS_CATEGORIES);

		if (result.errors.length > 0) {
			console.warn(`[Background] Refresh completed with ${result.errors.length} errors:`, result.errors.slice(0, 5));
		}

		// Fetch market data
		await fetchAllMarketsServer();

		// Clean up old news
		const deleted = deleteOldNews(7);

		const duration = Date.now() - start;
		setMeta('lastRefreshTime', Date.now());
		console.log(`[Background] Refresh complete in ${(duration / 1000).toFixed(1)}s, cleaned ${deleted} old items`);
	} catch (error) {
		console.error('[Background] Refresh failed:', error);
	} finally {
		isRefreshing = false;
	}
}

// Start background worker on server startup
function startWorker(): void {
	if (refreshInterval) return;

	console.log(`[Background] Starting refresh worker (interval: ${REFRESH_INTERVAL_MS / 1000}s)`);

	// Initial refresh after a short delay to let the server start
	setTimeout(() => {
		backgroundRefresh();
	}, 5000);

	refreshInterval = setInterval(backgroundRefresh, REFRESH_INTERVAL_MS);
}

function stopWorker(): void {
	if (refreshInterval) {
		clearInterval(refreshInterval);
		refreshInterval = null;
		console.log('[Background] Refresh worker stopped');
	}
}

// Start on module load
startWorker();

// Cleanup on process exit
process.on('SIGTERM', stopWorker);
process.on('SIGINT', stopWorker);
