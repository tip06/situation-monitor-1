const WORKER_URL = 'https://situation-monitor-proxy.projetip.workers.dev';

export interface InternetOutage {
	id: string;
	title: string;
	link: string;
	description: string;
	detectedAt: number;
	country: string;
	region: string;
	lat: number;
	lon: number;
	severity: 'partial' | 'major' | 'total';
	categories: string[];
	cause: string;
	outageType: string;
	endedAt: number;
}

export interface OutagesSnapshot {
	outages: InternetOutage[];
	generatedAt: number;
}

export async function fetchOutagesSnapshot(): Promise<OutagesSnapshot> {
	const res = await fetch(`${WORKER_URL}/outages/snapshot`, { method: 'POST' });
	if (!res.ok) throw new Error(`Outages fetch failed: ${res.status}`);
	return res.json();
}
