<script lang="ts">
	import { Panel } from '$lib/components/common';
	import { markets, intelligence } from '$lib/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';

	type SignalDirection = 'bullish' | 'neutral' | 'bearish';

	interface Signal {
		name: string;
		value: string;
		direction: SignalDirection;
	}

	const marketsState = $derived($markets);
	const intelState = $derived($intelligence);

	function findCommodity(symbol: string) {
		return marketsState.commodities.items.find(
			(c) => c.symbol?.toUpperCase() === symbol.toUpperCase()
		);
	}

	function findCrypto(id: string) {
		return marketsState.crypto.items.find(
			(c) => c.id?.toLowerCase() === id.toLowerCase() || c.symbol?.toLowerCase() === id.toLowerCase()
		);
	}

	const signals = $derived((() => {
		const result: Signal[] = [];

		// VIX signal
		const vix = findCommodity('VIX') ?? findCommodity('^VIX');
		if (vix && vix.price != null) {
			const val = vix.price;
			result.push({
				name: 'VIX',
				value: val.toFixed(1),
				direction: val < 20 ? 'bullish' : val <= 25 ? 'neutral' : 'bearish'
			});
		} else {
			result.push({ name: 'VIX', value: '–', direction: 'neutral' });
		}

		// QQQ/XLP ratio (tech vs consumer staples - risk on/off indicator)
		const qqq = marketsState.sectors.items.find((s) => s.symbol === 'QQQ');
		const xlp = marketsState.sectors.items.find((s) => s.symbol === 'XLP');
		if (qqq && xlp && xlp.price && qqq.price) {
			const ratio = qqq.price / xlp.price;
			result.push({
				name: 'QQQ/XLP Ratio',
				value: ratio.toFixed(2),
				direction: ratio > 4.5 ? 'bullish' : ratio > 3.5 ? 'neutral' : 'bearish'
			});
		} else {
			result.push({ name: 'QQQ/XLP Ratio', value: '–', direction: 'neutral' });
		}

		// BTC signal
		const btc = findCrypto('bitcoin') ?? findCrypto('btc');
		if (btc && btc.current_price != null) {
			const price = btc.current_price;
			result.push({
				name: 'BTC',
				value: `$${(price / 1000).toFixed(1)}k`,
				direction: price > 80000 ? 'bullish' : price > 50000 ? 'neutral' : 'bearish'
			});
		} else {
			result.push({ name: 'BTC', value: '–', direction: 'neutral' });
		}

		// Gold signal (use changePercent as direction proxy)
		const gold = findCommodity('GC=F') ?? findCommodity('GOLD') ?? findCommodity('GLD');
		if (gold && gold.price != null) {
			result.push({
				name: 'Gold',
				value: `$${gold.price.toFixed(0)}`,
				direction: (gold.changePercent ?? 0) > 0.5 ? 'bullish' : (gold.changePercent ?? 0) < -0.5 ? 'bearish' : 'neutral'
			});
		} else {
			result.push({ name: 'Gold', value: '–', direction: 'neutral' });
		}

		// 10Y Yield
		const yield10 = findCommodity('^TNX') ?? findCommodity('TNX');
		if (yield10 && yield10.price != null) {
			const val = yield10.price;
			result.push({
				name: '10Y Yield',
				value: `${val.toFixed(2)}%`,
				direction: val < 4.5 ? 'bullish' : val <= 5 ? 'neutral' : 'bearish'
			});
		} else {
			result.push({ name: '10Y Yield', value: '–', direction: 'neutral' });
		}

		// Fear & Greed
		const fg = intelState.fearGreed;
		if (fg) {
			result.push({
				name: 'Fear & Greed',
				value: `${fg.value} (${fg.classification})`,
				direction: fg.value > 55 ? 'bullish' : fg.value >= 45 ? 'neutral' : 'bearish'
			});
		} else {
			result.push({ name: 'Fear & Greed', value: '–', direction: 'neutral' });
		}

		return result;
	})());

	const verdict = $derived((() => {
		const bullishCount = signals.filter((s) => s.direction === 'bullish').length;
		if (bullishCount >= 4) return 'BUY' as const;
		if (bullishCount >= 2) return 'HOLD' as const;
		return 'CASH' as const;
	})());

	function directionArrow(dir: SignalDirection): string {
		if (dir === 'bullish') return '▲';
		if (dir === 'bearish') return '▼';
		return '–';
	}
</script>

<Panel id="market_radar" title={t($language, 'panelName.market_radar')}>
	<div class="radar-content">
		<div class="verdict-badge verdict-{verdict.toLowerCase()}">
			{verdict}
		</div>

		<div class="signals-grid">
			{#each signals as signal}
				<div class="signal-row">
					<span class="signal-name">{signal.name}</span>
					<span class="signal-value">{signal.value}</span>
					<span class="signal-arrow direction-{signal.direction}">
						{directionArrow(signal.direction)}
					</span>
				</div>
			{/each}
		</div>
	</div>
</Panel>

<style>
	.radar-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.verdict-badge {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-align: center;
		padding: 0.5rem;
		border-radius: 6px;
		border: 2px solid currentColor;
	}

	.verdict-buy { color: #22c55e; border-color: #22c55e; background: rgba(34, 197, 94, 0.1); }
	.verdict-hold { color: #eab308; border-color: #eab308; background: rgba(234, 179, 8, 0.1); }
	.verdict-cash { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }

	.signals-grid {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.signal-row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0;
		border-bottom: 1px solid var(--border, #2a2a2a);
		font-size: 0.82rem;
	}

	.signal-row:last-child {
		border-bottom: none;
	}

	.signal-name {
		color: var(--text-muted, #888);
	}

	.signal-value {
		color: var(--text);
		font-weight: 500;
	}

	.signal-arrow {
		width: 1.2rem;
		text-align: center;
		font-size: 0.75rem;
	}

	.direction-bullish { color: #22c55e; }
	.direction-bearish { color: #ef4444; }
	.direction-neutral { color: #888; }
</style>
