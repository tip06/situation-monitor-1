<script lang="ts">
	import { MapPanel } from '$lib/components/panels';
	import { language, monitors } from '$lib/stores';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>{t($language, 'map.title')} | {t($language, 'app.title')}</title>
	<meta name="description" content={t($language, 'app.description')} />
</svelte:head>

<main class="map-page">
	<MapPanel monitors={$monitors.monitors} />
</main>

<style>
	.map-page {
		padding: 0.5rem;
	}
</style>
