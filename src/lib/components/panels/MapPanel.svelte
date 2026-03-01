<script lang="ts">
	import { onMount } from 'svelte';
	import { Panel } from '$lib/components/common';
	import {
		HOTSPOTS,
		AI_DATACENTERS,
		PIPELINES,
		PIPELINE_COLORS,
		CONFLICT_ZONES,
		CHOKEPOINTS,
		SUBMARINE_CABLES,
		CABLE_LANDINGS,
		NUCLEAR_SITES,
		MILITARY_BASES,
		SANCTIONED_COUNTRY_IDS,
		THREAT_COLORS,
		WEATHER_CODES,
		type MilitaryBase
	} from '$lib/config/map';
	import { CACHE_TTLS } from '$lib/config/api';
	import { mapLayers, type MapLayersState } from '$lib/stores/mapLayers';
	import { language } from '$lib/stores';
	import { t, type MessageKey } from '$lib/i18n';
	import { fetchOutagesSnapshot, type InternetOutage } from '$lib/api';
	import type { CustomMonitor } from '$lib/types';

	interface Props {
		monitors?: CustomMonitor[];
		loading?: boolean;
		error?: string | null;
	}

	let { monitors = [], loading = false, error = null }: Props = $props();

	// Layer panel state
	let layerPanelOpen = $state(false);

	let mapContainer: HTMLDivElement;
	// D3 objects - initialized in initMap, null before initialization
	// Using 'any' for D3 objects as they're dynamically imported and have complex generic types
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let d3Module: typeof import('d3') | null = null;
	let svg: any = null;
	let mapGroup: any = null;
	let projection: any = null;
	let path: any = null;
	/* eslint-enable @typescript-eslint/no-explicit-any */

	const WIDTH = 800;
	const HEIGHT = 400;
	const DEFAULT_ROTATION: [number, number, number] = [-16, -18, 0];
	const DEFAULT_GLOBE_SCALE = 239.5;
	const MIN_GLOBE_SCALE = 120;
	const MAX_GLOBE_SCALE = 420;
	const ZOOM_STEP = 1.18;
	const MAX_LAT_ROTATION = 55;
	const OUTAGE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

	let globeRotation: [number, number, number] = [...DEFAULT_ROTATION];
	let globeScale = DEFAULT_GLOBE_SCALE;
	let worldFeatures: GeoJSON.FeatureCollection | null = null;
	const countryNameById = new Map<string, string>();
	let internetOutages = $state<InternetOutage[]>([]);
	let outagesLoading = $state(false);
	let outagesError = $state<string | null>(null);
	let outagesGeneratedAt = $state<number | null>(null);
	let visibleOutageCount = $state(0);
	let visibleSevereOutageCount = $state(0);
	let visibleAiDataCenterCount = $state(0);
	let visiblePipelineCount = $state(0);
	let visibleMilitaryBaseCount = $state(0);

	// Tooltip state
	let tooltipContent = $state<{
		title: string;
		color: string;
		lines: string[];
	} | null>(null);
	let tooltipPosition = $state({ left: 0, top: 0 });
	let tooltipVisible = $state(false);

	// Data cache for tooltips with TTL support
	interface CacheEntry<T> {
		data: T;
		timestamp: number;
	}
	const dataCache: Record<string, CacheEntry<unknown>> = {};

	function getCachedData<T>(key: string): T | null {
		const entry = dataCache[key] as CacheEntry<T> | undefined;
		if (!entry) return null;
		// Check if cache entry has expired
		if (Date.now() - entry.timestamp > CACHE_TTLS.weather) {
			delete dataCache[key];
			return null;
		}
		return entry.data;
	}

	function setCachedData<T>(key: string, data: T): void {
		dataCache[key] = { data, timestamp: Date.now() };
	}

	// Get local time at longitude
	function getLocalTime(lon: number): string {
		const now = new Date();
		const utcHours = now.getUTCHours();
		const utcMinutes = now.getUTCMinutes();
		const offsetHours = Math.round(lon / 15);
		let localHours = (utcHours + offsetHours + 24) % 24;
		const ampm = localHours >= 12 ? 'PM' : 'AM';
		localHours = localHours % 12 || 12;
		return `${localHours}:${utcMinutes.toString().padStart(2, '0')} ${ampm}`;
	}

	// Weather result type
	interface WeatherResult {
		temp: number | null;
		wind: number | null;
		condition: string;
	}

	// Fetch weather from Open-Meteo with TTL-based caching
	async function getWeather(lat: number, lon: number): Promise<WeatherResult | null> {
		const key = `weather_${lat}_${lon}`;
		const cached = getCachedData<WeatherResult>(key);
		if (cached) return cached;

		try {
			const res = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`
			);
			const data = await res.json();
			const temp = data.current?.temperature_2m;
			const tempF = temp ? Math.round((temp * 9) / 5 + 32) : null;
			const wind = data.current?.wind_speed_10m;
			const code = data.current?.weather_code;
			const result: WeatherResult = {
				temp: tempF,
				wind: wind ? Math.round(wind) : null,
				condition: WEATHER_CODES[code] || '—'
			};
			setCachedData(key, result);
			return result;
		} catch {
			return null;
		}
	}

	function isPointVisible(lon: number, lat: number): boolean {
		if (!projection || !d3Module) return false;
		const rotate = projection.rotate() as [number, number, number];
		const center: [number, number] = [-rotate[0], -rotate[1]];
		return d3Module.geoDistance([lon, lat], center) <= Math.PI / 2;
	}

	function projectPoint(lon: number, lat: number): [number, number] | null {
		if (!projection || !isPointVisible(lon, lat)) return null;
		const projected = projection([lon, lat]) as [number, number] | null;
		if (!projected) return null;
		const [x, y] = projected;
		if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
		return [x, y];
	}

	type MilitaryBasePoint = MilitaryBase;
	interface MilitaryBaseScreenPoint {
		base: MilitaryBasePoint;
		x: number;
		y: number;
	}

	interface MilitaryBaseCluster {
		bases: MilitaryBasePoint[];
		x: number;
		y: number;
	}

	function getMilitaryBaseClusterRadius(scale: number): number {
		// Mirror World Monitor's progressive disclosure:
		// zoomed in => individual points, zoomed out => cluster markers.
		if (scale >= 290) return 0;
		if (scale >= 245) return 14;
		if (scale >= 200) return 24;
		return 40;
	}

	function clusterMilitaryBases(
		points: MilitaryBaseScreenPoint[],
		pixelRadius: number
	): MilitaryBaseCluster[] {
		if (pixelRadius <= 0) {
			return points.map((point) => ({ bases: [point.base], x: point.x, y: point.y }));
		}

		const clusters: MilitaryBaseCluster[] = [];
		const assigned = new Set<number>();

		for (let i = 0; i < points.length; i += 1) {
			if (assigned.has(i)) continue;
			const seed = points[i];
			if (!seed) continue;

			const memberPoints: MilitaryBaseScreenPoint[] = [seed];
			assigned.add(i);

			for (let j = i + 1; j < points.length; j += 1) {
				if (assigned.has(j)) continue;
				const candidate = points[j];
				if (!candidate) continue;
				const dx = seed.x - candidate.x;
				const dy = seed.y - candidate.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance <= pixelRadius) {
					memberPoints.push(candidate);
					assigned.add(j);
				}
			}

			const centerX = memberPoints.reduce((sum, point) => sum + point.x, 0) / memberPoints.length;
			const centerY = memberPoints.reduce((sum, point) => sum + point.y, 0) / memberPoints.length;

			clusters.push({
				bases: memberPoints.map((point) => point.base),
				x: centerX,
				y: centerY
			});
		}

		return clusters;
	}

	function clampGlobeScale(nextScale: number): number {
		return Math.max(MIN_GLOBE_SCALE, Math.min(MAX_GLOBE_SCALE, nextScale));
	}

	function getOutageSeverityColor(severity: InternetOutage['severity']): string {
		if (severity === 'total') return '#ff4b3e';
		if (severity === 'major') return '#ff9a2f';
		return '#ffd166';
	}

	function toTitleCase(value: string): string {
		return value
			.toLowerCase()
			.split(' ')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	function humanizeToken(value: string): string {
		if (!value) return '';
		return toTitleCase(value.replace(/_/g, ' '));
	}

	function formatOutageTimestamp(timestamp: number): string {
		if (!timestamp) return 'Unknown';
		try {
			return new Date(timestamp).toLocaleString();
		} catch {
			return 'Unknown';
		}
	}

	function formatCount(value: number): string {
		return Number.isFinite(value) ? value.toLocaleString() : 'n/a';
	}

	function buildOutageTooltipLines(outage: InternetOutage): string[] {
		const lines: string[] = [];
		if (outage.outageType) lines.push(`Type: ${humanizeToken(outage.outageType)}`);
		if (outage.cause) lines.push(`Cause: ${humanizeToken(outage.cause)}`);
		if (outage.detectedAt) lines.push(`Detected: ${formatOutageTimestamp(outage.detectedAt)}`);
		if (outage.endedAt) lines.push(`Recovered: ${formatOutageTimestamp(outage.endedAt)}`);
		if (outage.description) {
			const summary = outage.description.trim();
			lines.push(summary.length > 120 ? `${summary.slice(0, 117)}...` : summary);
		}
		return lines;
	}

	// Show tooltip using state (safe rendering)
	function showTooltip(
		event: MouseEvent,
		title: string,
		color: string,
		lines: string[] = []
	): void {
		if (!mapContainer) return;
		const rect = mapContainer.getBoundingClientRect();
		tooltipContent = { title, color, lines };
		tooltipPosition = {
			left: event.clientX - rect.left + 15,
			top: event.clientY - rect.top - 10
		};
		tooltipVisible = true;
	}

	// Move tooltip
	function moveTooltip(event: MouseEvent): void {
		if (!mapContainer) return;
		const rect = mapContainer.getBoundingClientRect();
		tooltipPosition = {
			left: event.clientX - rect.left + 15,
			top: event.clientY - rect.top - 10
		};
	}

	// Hide tooltip
	function hideTooltip(): void {
		tooltipVisible = false;
		tooltipContent = null;
	}

	// Build enhanced tooltip with weather
	async function showEnhancedTooltip(
		event: MouseEvent,
		_name: string,
		lat: number,
		lon: number,
		desc: string,
		color: string
	): Promise<void> {
		const localTime = getLocalTime(lon);
		const lines = [`🕐 Local: ${localTime}`];
		showTooltip(event, desc, color, lines);

		// Fetch weather asynchronously
		const weather = await getWeather(lat, lon);
		if (weather && tooltipVisible) {
			tooltipContent = {
				title: desc,
				color,
				lines: [
					`🕐 Local: ${localTime}`,
					`${weather.condition} ${weather.temp}°F, ${weather.wind}mph`
				]
			};
		}
	}

	function setupGlobeInteractions(): void {
		if (!d3Module || !svg || !projection) return;
		const dragBehavior = d3Module
			.drag<SVGSVGElement, unknown>()
			.on('drag', (event) => {
				if (!projection) return;
				const nextLon = globeRotation[0] + event.dx * 0.42;
				const nextLat = Math.max(
					-MAX_LAT_ROTATION,
					Math.min(MAX_LAT_ROTATION, globeRotation[1] - event.dy * 0.42)
				);
				globeRotation = [nextLon, nextLat, 0];
				projection.rotate(globeRotation);
				renderMap();
			});
		svg.call(dragBehavior as any);
	}

	function renderMap(): void {
		if (!mapGroup || !path || !worldFeatures || !d3Module) return;

		mapGroup.selectAll('*').remove();
		let nextVisibleOutageCount = 0;
		let nextVisibleSevereOutageCount = 0;
		let nextVisibleAiDataCenterCount = 0;
		let nextVisiblePipelineCount = 0;
		let nextVisibleMilitaryBaseCount = 0;

		mapGroup
			.append('path')
			.datum({ type: 'Sphere' } as any)
			.attr('class', 'globe-sphere')
			.attr('d', path as unknown as string);

		const graticule = d3Module.geoGraticule().step([20, 20]);
		mapGroup
			.append('path')
			.datum(graticule())
			.attr('class', 'globe-graticule')
			.attr('d', path as unknown as string);

		mapGroup
			.selectAll('path.country')
			.data(worldFeatures.features)
			.enter()
			.append('path')
			.attr('class', 'country')
			.attr('d', path as unknown as string)
			.attr('fill', (d: GeoJSON.Feature) =>
				SANCTIONED_COUNTRY_IDS.includes(+(d.id || 0)) ? '#311922' : '#103549'
			)
			.attr('stroke', (d: GeoJSON.Feature) =>
				SANCTIONED_COUNTRY_IDS.includes(+(d.id || 0)) ? '#9d3158' : '#3f6e88'
			)
			.attr('stroke-width', 0.55)
			.on('mouseenter', (event: MouseEvent, d: GeoJSON.Feature) => {
				const featureId = String(d.id ?? '').trim();
				const numericFeatureId = Number(featureId);
				const featureProps = d.properties as Record<string, unknown> | undefined;
				const propName = typeof featureProps?.name === 'string' ? featureProps.name : undefined;
				const countryName =
					countryNameById.get(featureId) ||
					(Number.isFinite(numericFeatureId)
						? countryNameById.get(String(numericFeatureId))
						: undefined) ||
					propName ||
					'Unknown';
				showTooltip(event, countryName, '#9ecbe6');
			})
			.on('mousemove', moveTooltip)
			.on('mouseleave', hideTooltip);

		mapGroup
			.append('path')
			.datum({ type: 'Sphere' } as any)
			.attr('class', 'globe-atmosphere')
			.attr('d', path as unknown as string);

		// Draw conflict zones - in a group for toggling
		const conflictZonesGroup = mapGroup.append('g').attr('class', 'layer-conflict-zones');
		CONFLICT_ZONES.forEach((zone) => {
			conflictZonesGroup
				.append('path')
				.datum({ type: 'Polygon', coordinates: [zone.coords] } as GeoJSON.Polygon)
				.attr('d', path as unknown as string)
				.attr('fill', zone.color)
				.attr('fill-opacity', 0.18)
				.attr('stroke', zone.color)
				.attr('stroke-width', 0.7)
				.attr('stroke-opacity', 0.5);
		});

		// Draw chokepoints - in a group for toggling
		const chokepointsGroup = mapGroup.append('g').attr('class', 'layer-chokepoints');
		CHOKEPOINTS.forEach((cp) => {
			const projected = projectPoint(cp.lon, cp.lat);
			if (!projected) return;
			const [x, y] = projected;
			chokepointsGroup
				.append('rect')
				.attr('x', x - 4)
				.attr('y', y - 4)
				.attr('width', 8)
				.attr('height', 8)
				.attr('fill', '#00aaff')
				.attr('opacity', 0.8)
				.attr('transform', `rotate(45,${x},${y})`);
			chokepointsGroup
				.append('text')
				.attr('x', x + 8)
				.attr('y', y + 3)
				.attr('fill', '#00aaff')
				.attr('font-size', '7px')
				.attr('font-family', 'monospace')
				.text(cp.name);
			chokepointsGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 10)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) => showTooltip(event, `⬥ ${cp.desc}`, '#00aaff'))
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw submarine cables - in a group for toggling
		const submarineCablesGroup = mapGroup.append('g').attr('class', 'layer-submarine-cables');
		SUBMARINE_CABLES.forEach((cable) => {
			if (!Array.isArray(cable.points) || cable.points.length < 2) return;
			if (!cable.points.some(([lon, lat]) => isPointVisible(lon, lat))) return;

			const ownersPreview =
				cable.owners.length > 110 ? `${cable.owners.slice(0, 107)}...` : cable.owners;
			const cableGeometry = {
				type: 'LineString',
				coordinates: cable.points
			} as GeoJSON.LineString;

			submarineCablesGroup
				.append('path')
				.datum(cableGeometry)
				.attr('d', path as unknown as string)
				.attr('fill', 'none')
				.attr('stroke', '#4bb6ff')
				.attr('stroke-width', 0.85)
				.attr('stroke-opacity', 0.38);
			submarineCablesGroup
				.append('path')
				.datum(cableGeometry)
				.attr('d', path as unknown as string)
				.attr('fill', 'none')
				.attr('stroke', 'transparent')
				.attr('stroke-width', 5.5)
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showTooltip(event, cable.name, '#6dc7ff', [
						`Length: ${cable.length}`,
						`RFS: ${cable.rfs}`,
						`Owners: ${ownersPreview}`
					])
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw AI data centers - in a group for toggling
		const aiDataCentersGroup = mapGroup.append('g').attr('class', 'layer-ai-data-centers');
		AI_DATACENTERS.forEach((dc) => {
			const projected = projectPoint(dc.lon, dc.lat);
			if (!projected) return;
			nextVisibleAiDataCenterCount += 1;
			const [x, y] = projected;
			const isPlanned = dc.status === 'planned';
			const color = isPlanned ? '#7f67ff' : '#944bff';
			const ownerPreview = dc.owner.length > 100 ? `${dc.owner.slice(0, 97)}...` : dc.owner;

			aiDataCentersGroup
				.append('rect')
				.attr('x', x - 4.2)
				.attr('y', y - 4.2)
				.attr('width', 8.4)
				.attr('height', 8.4)
				.attr('fill', color)
				.attr('fill-opacity', isPlanned ? 0.26 : 0.52)
				.attr('stroke', '#d8c8ff')
				.attr('stroke-opacity', 0.68)
				.attr('stroke-width', 0.5);
			aiDataCentersGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 10)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showTooltip(event, dc.name, color, [
						`Status: ${isPlanned ? 'Planned' : 'Existing'}`,
						`Owner: ${ownerPreview}`,
						`Chips: ${formatCount(dc.chipCount)}`,
						...(typeof dc.powerMW === 'number' && Number.isFinite(dc.powerMW)
							? [`Power: ${dc.powerMW.toLocaleString()} MW`]
							: [])
					])
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw pipelines - in a group for toggling
		const pipelinesGroup = mapGroup.append('g').attr('class', 'layer-pipelines');
		PIPELINES.forEach((pipeline) => {
			if (!Array.isArray(pipeline.points) || pipeline.points.length < 2) return;
			if (!pipeline.points.some(([lon, lat]) => isPointVisible(lon, lat))) return;
			nextVisiblePipelineCount += 1;

			const pipelineColor = PIPELINE_COLORS[pipeline.type] || '#ff9a2f';
			const lineGeometry = {
				type: 'LineString',
				coordinates: pipeline.points
			} as GeoJSON.LineString;
			const tooltipLines = [
				`Type: ${humanizeToken(pipeline.type)}`,
				`Status: ${humanizeToken(pipeline.status)}`,
				...(pipeline.capacity ? [`Capacity: ${pipeline.capacity}`] : []),
				...(pipeline.length ? [`Length: ${pipeline.length}`] : []),
				...(pipeline.operator ? [`Operator: ${pipeline.operator}`] : []),
				...(pipeline.countries?.length ? [`Countries: ${pipeline.countries.join(', ')}`] : [])
			];

			pipelinesGroup
				.append('path')
				.datum(lineGeometry)
				.attr('d', path as unknown as string)
				.attr('fill', 'none')
				.attr('stroke', pipelineColor)
				.attr('stroke-width', 1.25)
				.attr('stroke-linecap', 'round')
				.attr('stroke-linejoin', 'round')
				.attr('stroke-dasharray', pipeline.status === 'construction' ? '4,2' : null)
				.attr('stroke-opacity', 0.48);
			pipelinesGroup
				.append('path')
				.datum(lineGeometry)
				.attr('d', path as unknown as string)
				.attr('fill', 'none')
				.attr('stroke', 'transparent')
				.attr('stroke-width', 6)
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showTooltip(event, pipeline.name, pipelineColor, tooltipLines)
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw cable landings - in a group for toggling
		const cableLandingsGroup = mapGroup.append('g').attr('class', 'layer-cable-landings');
		CABLE_LANDINGS.forEach((cl) => {
			const projected = projectPoint(cl.lon, cl.lat);
			if (!projected) return;
			const [x, y] = projected;
			cableLandingsGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 3)
				.attr('fill', 'none')
				.attr('stroke', '#aa44ff')
				.attr('stroke-width', 1.5);
			cableLandingsGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 10)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) => showTooltip(event, `◎ ${cl.desc}`, '#aa44ff'))
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw nuclear sites - in a group for toggling
		const nuclearSitesGroup = mapGroup.append('g').attr('class', 'layer-nuclear-sites');
		NUCLEAR_SITES.forEach((ns) => {
			const projected = projectPoint(ns.lon, ns.lat);
			if (!projected) return;
			const [x, y] = projected;
			nuclearSitesGroup.append('circle').attr('cx', x).attr('cy', y).attr('r', 2).attr('fill', '#ffff00');
			nuclearSitesGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 5)
				.attr('fill', 'none')
				.attr('stroke', '#ffff00')
				.attr('stroke-width', 1)
				.attr('stroke-dasharray', '3,3');
			nuclearSitesGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 10)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) => showTooltip(event, `☢ ${ns.desc}`, '#ffff00'))
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw military bases - in a group for toggling
		const militaryBasesGroup = mapGroup.append('g').attr('class', 'layer-military-bases');
		const visibleMilitaryBases: MilitaryBaseScreenPoint[] = [];
		MILITARY_BASES.forEach((base) => {
			const projected = projectPoint(base.lon, base.lat);
			if (!projected) return;
			visibleMilitaryBases.push({ base, x: projected[0], y: projected[1] });
		});
		nextVisibleMilitaryBaseCount = visibleMilitaryBases.length;

		const militaryClusterRadius = getMilitaryBaseClusterRadius(globeScale);
		const militaryClusters = clusterMilitaryBases(visibleMilitaryBases, militaryClusterRadius);

		militaryClusters.forEach((cluster) => {
			if (cluster.bases.length <= 1) {
				const base = cluster.bases[0];
				if (!base) return;
				const x = cluster.x;
				const y = cluster.y;
				const starPath = `M${x},${y - 5} L${x + 1.5},${y - 1.5} L${x + 5},${y - 1.5} L${x + 2.5},${y + 1} L${x + 3.5},${y + 5} L${x},${y + 2.5} L${x - 3.5},${y + 5} L${x - 2.5},${y + 1} L${x - 5},${y - 1.5} L${x - 1.5},${y - 1.5} Z`;
				militaryBasesGroup.append('path').attr('d', starPath).attr('fill', '#ff00ff').attr('opacity', 0.8);
				militaryBasesGroup
					.append('circle')
					.attr('cx', x)
					.attr('cy', y)
					.attr('r', 10)
					.attr('fill', 'transparent')
					.attr('class', 'hotspot-hit')
					.on('mouseenter', (event: MouseEvent) => showTooltip(event, `★ ${base.desc}`, '#ff00ff'))
					.on('mousemove', moveTooltip)
					.on('mouseleave', hideTooltip);
				return;
			}

			const clusterColor = '#ff4fc5';
			const r = Math.max(9, Math.min(17, 7 + Math.log2(cluster.bases.length + 1) * 3));
			const namesPreview = cluster.bases
				.slice(0, 4)
				.map((base) => base.name)
				.join(', ');
			const remaining = cluster.bases.length - 4;
			const lines = [
				`${cluster.bases.length} military bases`,
				...(namesPreview ? [namesPreview] : []),
				...(remaining > 0 ? [`+${remaining} more`] : [])
			];

			militaryBasesGroup
				.append('circle')
				.attr('cx', cluster.x)
				.attr('cy', cluster.y)
				.attr('r', r)
				.attr('fill', 'rgba(63, 16, 47, 0.85)')
				.attr('stroke', clusterColor)
				.attr('stroke-width', 1.1);
			militaryBasesGroup
				.append('text')
				.attr('x', cluster.x)
				.attr('y', cluster.y + 2.5)
				.attr('fill', '#ffd6f1')
				.attr('font-size', '8px')
				.attr('font-weight', 700)
				.attr('text-anchor', 'middle')
				.attr('font-family', 'monospace')
				.text(String(cluster.bases.length));
			militaryBasesGroup
				.append('circle')
				.attr('cx', cluster.x)
				.attr('cy', cluster.y)
				.attr('r', Math.max(12, r + 3))
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showTooltip(event, '★ Military Base Cluster', clusterColor, lines)
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw hotspots - in a group for toggling
		const hotspotsGroup = mapGroup.append('g').attr('class', 'layer-hotspots');
		HOTSPOTS.forEach((h) => {
			const projected = projectPoint(h.lon, h.lat);
			if (!projected) return;
			const [x, y] = projected;
			const color = THREAT_COLORS[h.level];
			hotspotsGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 6)
				.attr('fill', color)
				.attr('fill-opacity', 0.3)
				.attr('class', 'pulse');
			hotspotsGroup.append('circle').attr('cx', x).attr('cy', y).attr('r', 3).attr('fill', color);
			hotspotsGroup
				.append('text')
				.attr('x', x + 8)
				.attr('y', y + 3)
				.attr('fill', color)
				.attr('font-size', '8px')
				.attr('font-family', 'monospace')
				.text(h.name);
			hotspotsGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 12)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showEnhancedTooltip(event, h.name, h.lat, h.lon, h.desc, color)
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw internet outages - in a group for toggling
		const outagesGroup = mapGroup.append('g').attr('class', 'layer-outages');
		internetOutages.forEach((outage) => {
			const projected = projectPoint(outage.lon, outage.lat);
			if (!projected) return;
			nextVisibleOutageCount += 1;
			if (outage.severity === 'major' || outage.severity === 'total') {
				nextVisibleSevereOutageCount += 1;
			}

			const [x, y] = projected;
			const color = getOutageSeverityColor(outage.severity);
			const tooltipTitle = outage.country || 'Internet outage';
			const tooltipLines = buildOutageTooltipLines(outage);

			outagesGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 7)
				.attr('fill', color)
				.attr('fill-opacity', 0.24)
				.attr('class', 'pulse outage-pulse');
			outagesGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 3.4)
				.attr('fill', color)
				.attr('stroke', '#0f2029')
				.attr('stroke-width', 1.1);
			outagesGroup
				.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', 11)
				.attr('fill', 'transparent')
				.attr('class', 'hotspot-hit')
				.on('mouseenter', (event: MouseEvent) =>
					showTooltip(event, tooltipTitle, color, tooltipLines)
				)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});

		// Draw custom monitors with locations
		drawMonitors();
		visibleOutageCount = nextVisibleOutageCount;
		visibleSevereOutageCount = nextVisibleSevereOutageCount;
		visibleAiDataCenterCount = nextVisibleAiDataCenterCount;
		visiblePipelineCount = nextVisiblePipelineCount;
		visibleMilitaryBaseCount = nextVisibleMilitaryBaseCount;

		// Apply current layer visibility
		updateLayerVisibility($mapLayers);
	}

	// Initialize map
	async function initMap(): Promise<void> {
		const d3 = await import('d3');
		d3Module = d3;
		const topojson = await import('topojson-client');

		const svgEl = mapContainer.querySelector('svg');
		if (!svgEl) return;

		svg = d3.select(svgEl);
		svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
		svg.selectAll('*').remove();

		const defs = svg.append('defs');
		const oceanGradient = defs.append('radialGradient').attr('id', 'globe-ocean-gradient');
		oceanGradient.append('stop').attr('offset', '0%').attr('stop-color', '#0f2d42');
		oceanGradient.append('stop').attr('offset', '72%').attr('stop-color', '#091a28');
		oceanGradient.append('stop').attr('offset', '100%').attr('stop-color', '#050f18');

		mapGroup = svg.append('g').attr('id', 'mapGroup');
		globeScale = DEFAULT_GLOBE_SCALE;
		globeRotation = [...DEFAULT_ROTATION];

		projection = d3
			.geoOrthographic()
			.scale(globeScale)
			.translate([WIDTH / 2, HEIGHT / 2 + 8])
			.rotate(globeRotation)
			.clipAngle(90)
			.precision(0.3);

		path = d3.geoPath().projection(projection);

		try {
			const worldResponse = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
			const world = await worldResponse.json();
			worldFeatures = topojson.feature(
				world,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				world.objects.countries as any
			) as unknown as GeoJSON.FeatureCollection;
			countryNameById.clear();

			const countryNameUrls = [
				'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.tsv',
				'https://cdn.jsdelivr.net/npm/world-atlas@2/country-names.tsv'
			];
			for (const url of countryNameUrls) {
				try {
					const namesResponse = await fetch(url);
					if (!namesResponse.ok) continue;
					const countryNames = d3.tsvParse(await namesResponse.text());
					for (const row of countryNames) {
						const idCandidate = (
							row.id ??
							row.iso_n3 ??
							row.iso3 ??
							row.country_id ??
							row.numeric
						)?.trim();
						const nameCandidate = (row.name ?? row.country ?? row.label)?.trim();
						if (!idCandidate || !nameCandidate) continue;
						countryNameById.set(idCandidate, nameCandidate);
						const numericId = Number(idCandidate);
						if (Number.isFinite(numericId)) {
							countryNameById.set(String(numericId), nameCandidate);
						}
					}
					if (countryNameById.size > 0) break;
				} catch {
					// Ignore name source failures and keep trying fallback sources.
				}
			}

			setupGlobeInteractions();
			renderMap();
		} catch (err) {
			console.error('Failed to load map data:', err);
		}
	}

	// Update layer visibility based on store state
	function updateLayerVisibility(layers: MapLayersState): void {
		if (!mapGroup) return;

		mapGroup.select('.layer-hotspots').style('display', layers.hotspots ? null : 'none');
		mapGroup.select('.layer-outages').style('display', layers.outages ? null : 'none');
		mapGroup.select('.layer-ai-data-centers').style('display', layers.aiDataCenters ? null : 'none');
		mapGroup.select('.layer-pipelines').style('display', layers.pipelines ? null : 'none');
		mapGroup
			.select('.layer-submarine-cables')
			.style('display', layers.submarineCables ? null : 'none');
		mapGroup.select('.layer-conflict-zones').style('display', layers.conflictZones ? null : 'none');
		mapGroup.select('.layer-chokepoints').style('display', layers.chokepoints ? null : 'none');
		mapGroup.select('.layer-cable-landings').style('display', layers.cableLandings ? null : 'none');
		mapGroup.select('.layer-nuclear-sites').style('display', layers.nuclearSites ? null : 'none');
		mapGroup.select('.layer-military-bases').style('display', layers.militaryBases ? null : 'none');
		mapGroup.select('.layer-monitors').style('display', layers.monitors ? null : 'none');
		mapGroup.select('.layer-custom-markers').style('display', layers.customMarkers ? null : 'none');
	}

	// Draw custom monitor locations and custom markers
	function drawMonitors(): void {
		if (!mapGroup || !projection) return;

		// Remove existing monitor and custom marker groups
		mapGroup.selectAll('.layer-monitors').remove();
		mapGroup.selectAll('.layer-custom-markers').remove();

		// Create groups for monitors and custom markers
		const monitorsGroup = mapGroup.append('g').attr('class', 'layer-monitors');
		const customMarkersGroup = mapGroup.append('g').attr('class', 'layer-custom-markers');

		monitors
			.filter((m) => m.enabled && m.location)
			.forEach((m) => {
				if (!m.location) return;
				const projected = projectPoint(m.location.lon, m.location.lat);
				if (!projected) return;
				const [x, y] = projected;
				const color = m.color || '#00ffff';
				const markerType = m.markerType || 'monitor';
				const targetGroup = markerType === 'monitor' ? monitorsGroup : customMarkersGroup;

				// Draw based on marker type
				if (markerType === 'monitor') {
					// Standard monitor marker
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 5)
						.attr('fill', color)
						.attr('fill-opacity', 0.6)
						.attr('stroke', color)
						.attr('stroke-width', 2);
					targetGroup
						.append('text')
						.attr('x', x + 8)
						.attr('y', y + 3)
						.attr('fill', color)
						.attr('font-size', '8px')
						.attr('font-family', 'monospace')
						.text(m.name);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 10)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `📡 ${m.name}`, color, [m.location?.name || '', m.keywords.join(', ')])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				} else if (markerType === 'hotspot') {
					// Custom hotspot marker with pulsing effect
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 6)
						.attr('fill', color)
						.attr('fill-opacity', 0.3)
						.attr('class', 'pulse');
					targetGroup.append('circle').attr('cx', x).attr('cy', y).attr('r', 3).attr('fill', color);
					targetGroup
						.append('text')
						.attr('x', x + 8)
						.attr('y', y + 3)
						.attr('fill', color)
						.attr('font-size', '8px')
						.attr('font-family', 'monospace')
						.text(m.name);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 12)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `● ${m.name}`, color, [m.description || ''])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				} else if (markerType === 'chokepoint') {
					// Rotated diamond
					targetGroup
						.append('rect')
						.attr('x', x - 4)
						.attr('y', y - 4)
						.attr('width', 8)
						.attr('height', 8)
						.attr('fill', color)
						.attr('opacity', 0.8)
						.attr('transform', `rotate(45,${x},${y})`);
					targetGroup
						.append('text')
						.attr('x', x + 8)
						.attr('y', y + 3)
						.attr('fill', color)
						.attr('font-size', '7px')
						.attr('font-family', 'monospace')
						.text(m.name);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 10)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `⬥ ${m.name}`, color, [m.description || ''])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				} else if (markerType === 'cable') {
					// Circle with stroke
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 3)
						.attr('fill', 'none')
						.attr('stroke', color)
						.attr('stroke-width', 1.5);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 10)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `◎ ${m.name}`, color, [m.description || ''])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				} else if (markerType === 'nuclear') {
					// Circle with dashed ring
					targetGroup.append('circle').attr('cx', x).attr('cy', y).attr('r', 2).attr('fill', color);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 5)
						.attr('fill', 'none')
						.attr('stroke', color)
						.attr('stroke-width', 1)
						.attr('stroke-dasharray', '3,3');
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 10)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `☢ ${m.name}`, color, [m.description || ''])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				} else if (markerType === 'military') {
					// 5-pointed star
					const starPath = `M${x},${y - 5} L${x + 1.5},${y - 1.5} L${x + 5},${y - 1.5} L${x + 2.5},${y + 1} L${x + 3.5},${y + 5} L${x},${y + 2.5} L${x - 3.5},${y + 5} L${x - 2.5},${y + 1} L${x - 5},${y - 1.5} L${x - 1.5},${y - 1.5} Z`;
					targetGroup.append('path').attr('d', starPath).attr('fill', color).attr('opacity', 0.8);
					targetGroup
						.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', 10)
						.attr('fill', 'transparent')
						.attr('class', 'hotspot-hit')
						.on('mouseenter', (event: MouseEvent) =>
							showTooltip(event, `★ ${m.name}`, color, [m.description || ''])
						)
						.on('mousemove', moveTooltip)
						.on('mouseleave', hideTooltip);
				}
			});

		// Apply current layer visibility to new groups
		updateLayerVisibility($mapLayers);
	}

	// Zoom controls
	function zoomIn(): void {
		if (!projection) return;
		globeScale = clampGlobeScale(globeScale * ZOOM_STEP);
		projection.scale(globeScale);
		renderMap();
	}

	function zoomOut(): void {
		if (!projection) return;
		globeScale = clampGlobeScale(globeScale / ZOOM_STEP);
		projection.scale(globeScale);
		renderMap();
	}

	function resetZoom(): void {
		if (!projection) return;
		globeScale = DEFAULT_GLOBE_SCALE;
		globeRotation = [...DEFAULT_ROTATION];
		projection.scale(globeScale);
		projection.rotate(globeRotation);
		renderMap();
	}

	async function loadOutages(): Promise<void> {
		outagesLoading = true;
		outagesError = null;
		try {
			const snapshot = await fetchOutagesSnapshot();
			internetOutages = Array.isArray(snapshot?.outages) ? snapshot.outages : [];
			outagesGeneratedAt =
				typeof snapshot?.generatedAt === 'number' ? snapshot.generatedAt : Date.now();
		} catch (err) {
			outagesError = err instanceof Error ? err.message : 'Failed to load outages';
		} finally {
			outagesLoading = false;
		}
	}

	// Reactively update monitors when they change
	$effect(() => {
		// Track monitors changes
		const _monitorsRef = monitors;
		if (_monitorsRef && mapGroup && projection) {
			drawMonitors();
		}
	});

	$effect(() => {
		const _outageRef = internetOutages;
		if (_outageRef && mapGroup && projection) {
			renderMap();
		}
	});

	// Reactively update layer visibility when mapLayers store changes
	$effect(() => {
		const layers = $mapLayers;
		if (mapGroup) {
			updateLayerVisibility(layers);
		}
	});

	// Layer toggle configuration
	const layerConfig: {
		key: keyof MapLayersState;
		labelKey: MessageKey;
		icon: string;
		color: string;
	}[] = [
		{ key: 'hotspots', labelKey: 'map.layer.hotspots', icon: '●', color: '#ff4444' },
		{ key: 'outages', labelKey: 'map.layer.outages', icon: '◉', color: '#ff9a2f' },
		{ key: 'aiDataCenters', labelKey: 'map.layer.aiDataCenters', icon: '■', color: '#944bff' },
		{ key: 'pipelines', labelKey: 'map.layer.pipelines', icon: '═', color: '#ff6b35' },
		{
			key: 'submarineCables',
			labelKey: 'map.layer.submarineCables',
			icon: '≈',
			color: '#4bb6ff'
		},
		{ key: 'conflictZones', labelKey: 'map.layer.conflictZones', icon: '▢', color: '#ff6666' },
		{ key: 'chokepoints', labelKey: 'map.layer.chokepoints', icon: '◆', color: '#00aaff' },
		{ key: 'cableLandings', labelKey: 'map.layer.cableLandings', icon: '◎', color: '#aa44ff' },
		{ key: 'nuclearSites', labelKey: 'map.layer.nuclearSites', icon: '☢', color: '#ffff00' },
		{ key: 'militaryBases', labelKey: 'map.layer.militaryBases', icon: '★', color: '#ff00ff' },
		{ key: 'monitors', labelKey: 'map.layer.monitors', icon: '📡', color: '#00ffff' },
		{ key: 'customMarkers', labelKey: 'map.layer.customMarkers', icon: '📍', color: '#00ff88' }
	];

	const layerKeys = layerConfig.map((layer) => layer.key);
	const visibleLayerCount = $derived(layerKeys.filter((key) => $mapLayers[key]).length);
	const hiddenLayerCount = $derived(layerKeys.length - visibleLayerCount);
	const activeMonitorCount = $derived(
		monitors.filter((monitor) => monitor.enabled && monitor.location).length
	);
	const severeHotspotCount = HOTSPOTS.filter(
		(hotspot) => hotspot.level === 'critical' || hotspot.level === 'high'
	).length;

	type LayerPresetId = 'all' | 'risk' | 'infrastructure' | 'operations';
	interface LayerPreset {
		id: LayerPresetId;
		label: string;
		state: MapLayersState;
	}

	const layerPresets: LayerPreset[] = [
		{
			id: 'all',
			label: 'ALL',
			state: {
				hotspots: true,
				outages: true,
				aiDataCenters: true,
				pipelines: true,
				submarineCables: true,
				conflictZones: true,
				chokepoints: true,
				cableLandings: true,
				nuclearSites: true,
				militaryBases: true,
				monitors: true,
				customMarkers: true
			}
		},
		{
			id: 'risk',
			label: 'RISK',
			state: {
				hotspots: true,
				outages: true,
				aiDataCenters: false,
				pipelines: true,
				submarineCables: true,
				conflictZones: true,
				chokepoints: true,
				cableLandings: false,
				nuclearSites: true,
				militaryBases: true,
				monitors: false,
				customMarkers: false
			}
		},
		{
			id: 'infrastructure',
			label: 'INFRA',
			state: {
				hotspots: false,
				outages: true,
				aiDataCenters: true,
				pipelines: true,
				submarineCables: true,
				conflictZones: false,
				chokepoints: true,
				cableLandings: true,
				nuclearSites: true,
				militaryBases: false,
				monitors: true,
				customMarkers: true
			}
		},
		{
			id: 'operations',
			label: 'OPS',
			state: {
				hotspots: true,
				outages: true,
				aiDataCenters: false,
				pipelines: true,
				submarineCables: true,
				conflictZones: false,
				chokepoints: true,
				cableLandings: false,
				nuclearSites: false,
				militaryBases: true,
				monitors: true,
				customMarkers: true
			}
		}
	];

	function applyLayerState(state: MapLayersState): void {
		for (const key of layerKeys) {
			mapLayers.setLayer(key, state[key]);
		}
	}

	function applyLayerPreset(presetId: LayerPresetId): void {
		const preset = layerPresets.find((item) => item.id === presetId);
		if (!preset) return;
		applyLayerState(preset.state);
	}

	const activeLayerPreset = $derived.by(() => {
		for (const preset of layerPresets) {
			if (layerKeys.every((key) => $mapLayers[key] === preset.state[key])) {
				return preset.id;
			}
		}
		return 'custom';
	});

	onMount(() => {
		initMap();
		void loadOutages();
		const outageInterval = window.setInterval(() => {
			void loadOutages();
		}, OUTAGE_REFRESH_INTERVAL_MS);
		return () => {
			window.clearInterval(outageInterval);
		};
	});
</script>

<Panel id="map" title={t($language, 'map.title')} {loading} {error}>
	<div class="map-container" bind:this={mapContainer}>
		<svg class="map-svg"></svg>
		{#if tooltipVisible && tooltipContent}
			<div
				class="map-tooltip"
				style="left: {tooltipPosition.left}px; top: {tooltipPosition.top}px;"
			>
				<strong style="color: {tooltipContent.color}">{tooltipContent.title}</strong>
				{#each tooltipContent.lines as line}
					<br /><span class="tooltip-line">{line}</span>
				{/each}
			</div>
		{/if}

		<div class="map-command-deck" class:open={layerPanelOpen}>
			<div class="deck-head">
				<button
					class="deck-toggle-btn"
					onclick={() => (layerPanelOpen = !layerPanelOpen)}
					title={t($language, 'map.toggleLayers')}
				>
					<span class="deck-live-dot"></span>
					<span class="deck-text">
						<span class="deck-title">{t($language, 'map.layers')}</span>
						<span class="deck-subtitle">Signal Matrix</span>
					</span>
					<span class="deck-count">{visibleLayerCount}/{layerKeys.length}</span>
				</button>
				<div class="deck-presets" role="group" aria-label="Map layer presets">
					{#each layerPresets as preset}
						<button
							class="preset-btn"
							class:active={activeLayerPreset === preset.id}
							onclick={() => applyLayerPreset(preset.id)}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
			{#if layerPanelOpen}
				<div class="deck-body">
					<div class="deck-stats">
						<div class="stat-card">
							<span>Visible</span>
							<strong>{visibleLayerCount}</strong>
						</div>
						<div class="stat-card">
							<span>Hidden</span>
							<strong>{hiddenLayerCount}</strong>
						</div>
						<div class="stat-card">
							<span>Monitors</span>
							<strong>{$mapLayers.monitors ? activeMonitorCount : 0}</strong>
						</div>
					</div>
					<div class="layer-matrix">
						{#each layerConfig as layer}
							<button
								type="button"
								class="layer-chip"
								class:active={$mapLayers[layer.key]}
								onclick={() => mapLayers.toggleLayer(layer.key)}
								aria-pressed={$mapLayers[layer.key]}
							>
								<span class="layer-chip-icon" style="color: {layer.color}">{layer.icon}</span>
								<span class="layer-chip-label">{t($language, layer.labelKey)}</span>
								<span class="layer-chip-state">{$mapLayers[layer.key] ? 'ON' : 'OFF'}</span>
							</button>
						{/each}
					</div>
					<div class="deck-actions">
						<button class="deck-action-btn" onclick={() => mapLayers.showAll()}>
							{t($language, 'map.showAll')}
						</button>
						<button class="deck-action-btn" onclick={() => mapLayers.hideAll()}>
							{t($language, 'map.hideAll')}
						</button>
					</div>
				</div>
			{/if}
		</div>

		<div class="zoom-controls">
			<button class="zoom-btn" onclick={zoomIn} title={t($language, 'map.zoomIn')}>+</button>
			<button class="zoom-btn" onclick={zoomOut} title={t($language, 'map.zoomOut')}>−</button>
			<button class="zoom-btn" onclick={resetZoom} title={t($language, 'map.reset')}>⟲</button>
		</div>
		<div class="map-hud">
			<div class="hud-row">
				<span>Threat Nodes</span>
				<strong>{$mapLayers.hotspots ? HOTSPOTS.length : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Internet Outages</span>
				<strong>
					{$mapLayers.outages ? (outagesLoading ? '…' : visibleOutageCount) : 0}
				</strong>
			</div>
			<div class="hud-row">
				<span>Severe Outages</span>
				<strong>{$mapLayers.outages ? visibleSevereOutageCount : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Critical Nodes</span>
				<strong>{$mapLayers.hotspots ? severeHotspotCount : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Conflict Zones</span>
				<strong>{$mapLayers.conflictZones ? CONFLICT_ZONES.length : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Military Bases</span>
				<strong>
					{$mapLayers.militaryBases
						? `${visibleMilitaryBaseCount}/${MILITARY_BASES.length}`
						: 0}
				</strong>
			</div>
			<div class="hud-row">
				<span>AI Data Centers</span>
				<strong>{$mapLayers.aiDataCenters ? visibleAiDataCenterCount : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Pipelines</span>
				<strong>{$mapLayers.pipelines ? visiblePipelineCount : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Submarine Cables</span>
				<strong>{$mapLayers.submarineCables ? SUBMARINE_CABLES.length : 0}</strong>
			</div>
			<div class="hud-row">
				<span>Cable Landings</span>
				<strong>{$mapLayers.cableLandings ? CABLE_LANDINGS.length : 0}</strong>
			</div>
			{#if outagesError}
				<div class="hud-row hud-row-error">
					<span>Outages API</span>
					<strong>Offline</strong>
				</div>
			{:else if outagesGeneratedAt}
				<div class="hud-row">
					<span>Outages Updated</span>
					<strong>{new Date(outagesGeneratedAt).toLocaleTimeString()}</strong>
				</div>
			{/if}
			<div class="hud-legend">
				<div class="legend-item">
					<span class="legend-dot high"></span> {t($language, 'legend.high')}
				</div>
				<div class="legend-item">
					<span class="legend-dot elevated"></span> {t($language, 'legend.elevated')}
				</div>
				<div class="legend-item">
					<span class="legend-dot low"></span> {t($language, 'legend.low')}
				</div>
			</div>
		</div>
	</div>
</Panel>

<style>
	.map-container {
		position: relative;
		width: 100%;
		aspect-ratio: 2 / 1;
		background:
			radial-gradient(circle at 18% 18%, rgba(24, 180, 155, 0.18), transparent 45%),
			radial-gradient(circle at 82% 12%, rgba(255, 126, 24, 0.18), transparent 42%),
			linear-gradient(130deg, #060c11 5%, #08151d 48%, #0a1016 100%);
		border: 1px solid rgba(69, 101, 124, 0.45);
		border-radius: 8px;
		overflow: hidden;
		isolation: isolate;
	}

	.map-container::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(
				90deg,
				transparent 0,
				transparent 33px,
				rgba(128, 205, 255, 0.03) 34px
			),
			repeating-linear-gradient(
				0deg,
				transparent 0,
				transparent 33px,
				rgba(128, 205, 255, 0.028) 34px
			);
		opacity: 0.6;
		pointer-events: none;
		z-index: 1;
	}

	.map-container::after {
		content: '';
		position: absolute;
		left: -25%;
		right: -25%;
		top: -20%;
		height: 130%;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(82, 205, 244, 0.04) 45%,
			transparent 100%
		);
		animation: sweep 7s linear infinite;
		pointer-events: none;
		z-index: 2;
	}

	.map-svg {
		position: relative;
		z-index: 3;
		width: 100%;
		height: 100%;
	}

	:global(.globe-sphere) {
		fill: url(#globe-ocean-gradient);
		stroke: rgba(108, 160, 192, 0.8);
		stroke-width: 1;
	}

	:global(.globe-graticule) {
		fill: none;
		stroke: rgba(123, 183, 220, 0.2);
		stroke-width: 0.45;
	}

	:global(.globe-atmosphere) {
		fill: none;
		stroke: rgba(180, 223, 255, 0.28);
		stroke-width: 1.3;
		filter: drop-shadow(0 0 10px rgba(95, 204, 255, 0.2));
	}

	.map-tooltip {
		position: absolute;
		background: rgba(5, 11, 17, 0.96);
		border: 1px solid rgba(96, 131, 156, 0.45);
		border-radius: 8px;
		padding: 0.55rem;
		font-size: 0.65rem;
		color: #d5eaf7;
		max-width: 250px;
		pointer-events: none;
		z-index: 100;
		box-shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(8px);
	}

	.tooltip-line {
		opacity: 0.82;
	}

	.map-command-deck {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 15;
		width: min(420px, calc(100% - 1.5rem));
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.deck-head {
		display: flex;
		gap: 0.45rem;
		align-items: stretch;
	}

	.deck-toggle-btn {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.65rem;
		flex: 1;
		background: rgba(6, 13, 20, 0.88);
		border: 1px solid rgba(97, 136, 165, 0.5);
		border-radius: 10px;
		color: #c6d9e7;
		font-size: 0.63rem;
		font-family: 'IBM Plex Mono', 'SFMono-Regular', Menlo, Monaco, monospace;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition: all 0.18s ease;
		text-transform: uppercase;
	}

	.deck-toggle-btn:hover {
		border-color: rgba(129, 194, 232, 0.78);
		box-shadow: 0 0 0 1px rgba(129, 194, 232, 0.2) inset;
	}

	.deck-live-dot {
		width: 0.48rem;
		height: 0.48rem;
		border-radius: 50%;
		background: #52fda9;
		box-shadow:
			0 0 0 3px rgba(82, 253, 169, 0.18),
			0 0 12px rgba(82, 253, 169, 0.8);
		animation: ping 2.2s ease infinite;
		flex-shrink: 0;
	}

	.deck-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
		min-width: 0;
	}

	.deck-title {
		font-size: 0.62rem;
		line-height: 1;
		font-weight: 600;
		color: #d8ecff;
	}

	.deck-subtitle {
		font-size: 0.51rem;
		color: rgba(172, 203, 227, 0.72);
		line-height: 1;
	}

	.deck-count {
		margin-left: auto;
		font-size: 0.64rem;
		padding: 0.18rem 0.44rem;
		border-radius: 999px;
		border: 1px solid rgba(115, 176, 212, 0.5);
		background: rgba(17, 44, 64, 0.65);
		font-weight: 600;
		color: #afe5ff;
	}

	.deck-presets {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.3rem;
		width: 8.8rem;
	}

	.preset-btn {
		border: 1px solid rgba(110, 143, 163, 0.4);
		background: rgba(4, 11, 17, 0.76);
		color: #9ec2db;
		font-size: 0.53rem;
		padding: 0.38rem 0.35rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
		font-family: 'IBM Plex Mono', 'SFMono-Regular', Menlo, Monaco, monospace;
		letter-spacing: 0.04em;
	}

	.preset-btn:hover {
		color: #e4f5ff;
		border-color: rgba(145, 190, 215, 0.68);
	}

	.preset-btn.active {
		background: linear-gradient(135deg, rgba(28, 152, 193, 0.32), rgba(255, 142, 53, 0.3));
		color: #fff4dd;
		border-color: rgba(245, 165, 94, 0.86);
		box-shadow: 0 8px 18px rgba(255, 128, 38, 0.2);
	}

	.deck-body {
		background: rgba(4, 10, 16, 0.82);
		border: 1px solid rgba(88, 123, 147, 0.52);
		border-radius: 12px;
		padding: 0.55rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		backdrop-filter: blur(10px);
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.42);
	}

	.deck-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.35rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.35rem 0.42rem;
		border-radius: 8px;
		background: rgba(12, 28, 40, 0.68);
		border: 1px solid rgba(84, 118, 144, 0.45);
		color: #9ec0d6;
	}

	.stat-card span {
		font-size: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-card strong {
		font-size: 0.8rem;
		font-weight: 700;
		color: #e6f5ff;
	}

	.layer-matrix {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.35rem;
	}

	.layer-chip {
		border: 1px solid rgba(82, 109, 132, 0.5);
		background: rgba(8, 19, 29, 0.72);
		border-radius: 10px;
		padding: 0.42rem 0.45rem;
		display: flex;
		align-items: center;
		gap: 0.38rem;
		cursor: pointer;
		transition: all 0.16s ease;
		color: #b7d1e3;
		text-align: left;
	}

	.layer-chip:hover {
		border-color: rgba(138, 183, 210, 0.78);
		transform: translateY(-1px);
	}

	.layer-chip.active {
		background: linear-gradient(135deg, rgba(38, 153, 199, 0.32), rgba(33, 69, 88, 0.86));
		border-color: rgba(127, 214, 255, 0.9);
		box-shadow: 0 8px 16px rgba(55, 179, 235, 0.22);
	}

	.layer-chip-icon {
		width: 1.1rem;
		font-size: 0.76rem;
		text-align: center;
		flex-shrink: 0;
	}

	.layer-chip-label {
		flex: 1;
		font-size: 0.55rem;
		letter-spacing: 0.01em;
	}

	.layer-chip-state {
		font-size: 0.5rem;
		padding: 0.1rem 0.28rem;
		border-radius: 999px;
		border: 1px solid rgba(116, 159, 188, 0.42);
		color: #84b5d7;
	}

	.layer-chip.active .layer-chip-state {
		color: #ffd3a8;
		border-color: rgba(255, 191, 131, 0.45);
		background: rgba(255, 133, 35, 0.16);
	}

	.deck-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.35rem;
		margin-top: 0.1rem;
	}

	.deck-action-btn {
		padding: 0.38rem 0.35rem;
		border-radius: 8px;
		font-size: 0.54rem;
		letter-spacing: 0.03em;
		border: 1px solid rgba(108, 148, 175, 0.5);
		background: rgba(9, 23, 34, 0.64);
		color: #b8d4e7;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.deck-action-btn:hover {
		border-color: rgba(156, 201, 228, 0.9);
		color: #ffffff;
	}

	.zoom-controls {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		z-index: 12;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}

	.zoom-btn {
		width: 2.35rem;
		height: 2.35rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(7, 16, 24, 0.86);
		border: 1px solid rgba(108, 145, 171, 0.55);
		border-radius: 9px;
		color: #c7dff0;
		font-size: 0.92rem;
		cursor: pointer;
		transition: all 0.15s ease;
		backdrop-filter: blur(6px);
	}

	.zoom-btn:hover {
		color: #ffffff;
		border-color: rgba(167, 207, 230, 0.9);
		background: rgba(15, 36, 52, 0.9);
	}

	.map-hud {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 12;
		width: min(200px, calc(100% - 1.5rem));
		padding: 0.5rem;
		border-radius: 10px;
		border: 1px solid rgba(91, 127, 153, 0.55);
		background: rgba(4, 10, 16, 0.78);
		backdrop-filter: blur(8px);
		display: flex;
		flex-direction: column;
		gap: 0.26rem;
	}

	.hud-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.54rem;
		color: #9ec0d7;
	}

	.hud-row strong {
		color: #f3f7ff;
		font-size: 0.66rem;
	}

	.hud-row.hud-row-error strong {
		color: #ff8974;
	}

	.hud-legend {
		margin-top: 0.2rem;
		padding-top: 0.35rem;
		border-top: 1px solid rgba(91, 127, 153, 0.35);
		display: flex;
		flex-direction: column;
		gap: 0.22rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.52rem;
		color: #92b5cd;
	}

	.legend-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.legend-dot.high {
		background: #ff4444;
	}

	.legend-dot.elevated {
		background: #ffcc00;
	}

	.legend-dot.low {
		background: #00ff88;
	}

	/* Pulse animation for hotspots */
	:global(.pulse) {
		animation: pulse 2s ease-in-out infinite;
	}

	:global(.outage-pulse) {
		animation-duration: 1.4s;
	}

	@keyframes pulse {
		0%,
		100% {
			r: 6;
			opacity: 0.3;
		}
		50% {
			r: 10;
			opacity: 0.1;
		}
	}

	:global(.hotspot-hit) {
		cursor: pointer;
	}

	@keyframes sweep {
		0% {
			transform: translateY(-40%);
		}
		100% {
			transform: translateY(40%);
		}
	}

	@keyframes ping {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.55;
		}
	}

	@media (max-width: 768px) {
		.map-command-deck {
			top: 0.5rem;
			left: 0.5rem;
			width: calc(100% - 1rem);
		}

		.deck-head {
			flex-direction: column;
		}

		.deck-presets {
			width: 100%;
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.deck-stats,
		.layer-matrix,
		.deck-actions {
			grid-template-columns: 1fr;
		}

		.map-hud {
			top: auto;
			bottom: 0.5rem;
			left: 0.5rem;
			right: auto;
			width: min(180px, calc(100% - 5.5rem));
		}

		.zoom-controls {
			right: 0.5rem;
			bottom: 0.5rem;
		}

		.zoom-btn {
			width: 2.1rem;
			height: 2.1rem;
		}
	}
</style>
