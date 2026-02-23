export interface FearGreedData {
	value: number; // 0-100
	classification: string; // 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed'
	timestamp: number;
}

export async function fetchFearGreed(): Promise<FearGreedData> {
	const res = await fetch('https://api.alternative.me/fng/?limit=1');
	if (!res.ok) throw new Error('Fear & Greed fetch failed');
	const data = await res.json();
	const item = data.data[0];
	return {
		value: Number(item.value),
		classification: item.value_classification,
		timestamp: Number(item.timestamp) * 1000
	};
}
