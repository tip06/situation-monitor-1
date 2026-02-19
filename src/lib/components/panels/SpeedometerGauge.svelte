<script lang="ts">
	import { language } from '$lib/stores';
	import { t } from '$lib/i18n';

	/* eslint-disable @typescript-eslint/no-explicit-any */
	let { value = 50, label = '', volume = '', url = '' }: {
		value: number;
		label: string;
		volume: string;
		url: string;
	} = $props();

	let svgEl: SVGSVGElement;
	let d3Module: typeof import('d3') | null = null;

	function getColor(v: number): string {
		if (v <= 25) return '#ef4444';
		if (v <= 40) return '#f97316';
		if (v <= 60) return '#eab308';
		if (v <= 75) return '#84cc16';
		return '#22c55e';
	}

	async function renderGauge() {
		if (!svgEl) return;

		if (!d3Module) {
			d3Module = await import('d3');
		}
		const d3 = d3Module;

		const width = 180;
		const height = 120;
		const radius = 70;
		const innerRadius = 50;

		// Clear previous content
		d3.select(svgEl).selectAll('*').remove();

		const svg = d3.select(svgEl)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		const g = svg.append('g')
			.attr('transform', `translate(${width / 2}, ${height - 15})`);

		// Background arc (full semicircle)
		const bgArc = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI / 2)
			.cornerRadius(3);

		g.append('path')
			.attr('d', bgArc as any)
			.attr('fill', 'rgba(255,255,255,0.08)');

		// Value arc
		const scale = d3.scaleLinear()
			.domain([0, 100])
			.range([-Math.PI / 2, Math.PI / 2])
			.clamp(true);

		const valueArc = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.startAngle(-Math.PI / 2)
			.endAngle(scale(value))
			.cornerRadius(3);

		g.append('path')
			.attr('d', valueArc as any)
			.attr('fill', getColor(value));

		// Tick marks
		const ticks = [0, 25, 50, 75, 100];
		ticks.forEach((tick) => {
			const angle = scale(tick) - Math.PI / 2;
			const outerR = radius + 4;
			const innerR = radius - 2;
			g.append('line')
				.attr('x1', Math.cos(angle) * innerR)
				.attr('y1', Math.sin(angle) * innerR)
				.attr('x2', Math.cos(angle) * outerR)
				.attr('y2', Math.sin(angle) * outerR)
				.attr('stroke', 'rgba(255,255,255,0.3)')
				.attr('stroke-width', 1);
		});

		// Center percentage text
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.6em')
			.attr('fill', getColor(value))
			.attr('font-size', '22px')
			.attr('font-weight', '700')
			.attr('font-family', 'inherit')
			.text(`${value}%`);

		// "YES" label
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '0.8em')
			.attr('fill', 'rgba(255,255,255,0.5)')
			.attr('font-size', '8px')
			.attr('font-weight', '500')
			.attr('text-transform', 'uppercase')
			.attr('letter-spacing', '0.1em')
			.text(t($language, 'polymarket.yes'));
	}

	$effect(() => {
		// Track value changes to re-render
		void value;
		void $language;
		renderGauge();
	});
</script>

<a href={url} target="_blank" rel="noopener noreferrer" class="gauge-container">
	<svg bind:this={svgEl} class="gauge-svg"></svg>
	<div class="gauge-label" title={label}>{label}</div>
	<div class="gauge-volume">{volume}</div>
</a>

<style>
	.gauge-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 0.5rem;
		text-decoration: none;
		color: inherit;
		border-radius: 4px;
		transition: background 0.15s ease;
		cursor: pointer;
	}

	.gauge-container:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.gauge-svg {
		width: 100%;
		max-width: 180px;
		height: auto;
	}

	.gauge-label {
		font-size: 0.6rem;
		color: var(--text-primary);
		text-align: center;
		line-height: 1.3;
		margin-top: 0.35rem;
		max-width: 100%;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.gauge-volume {
		font-size: 0.5rem;
		color: var(--text-muted);
		margin-top: 0.15rem;
	}
</style>
