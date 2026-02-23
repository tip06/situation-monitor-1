const WORKER_URL = 'https://situation-monitor-proxy.projetip.workers.dev';

export interface StabilitySnapshot {
	scores: Record<string, number>; // country key → 0-100 (higher = more stable)
	generatedAt: number;
}

export async function fetchStabilitySnapshot(): Promise<StabilitySnapshot> {
	const res = await fetch(`${WORKER_URL}/stability/snapshot`, { method: 'POST' });
	if (!res.ok) throw new Error(`Stability fetch failed: ${res.status}`);
	return res.json();
}
