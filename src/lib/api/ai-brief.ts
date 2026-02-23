const WORKER_URL = 'https://situation-monitor-proxy.projetip.workers.dev';

export interface AIBrief {
	text: string;
	generatedAt: number;
	headlineCount: number;
}

export async function fetchAIBrief(headlines: string[] = []): Promise<AIBrief> {
	const res = await fetch(`${WORKER_URL}/ai/brief`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ headlines })
	});
	if (!res.ok) throw new Error(`AI brief fetch failed: ${res.status}`);
	return res.json();
}
