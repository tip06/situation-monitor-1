<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Header, TabBar } from '$lib/components/layout';
	import { AlertStack } from '$lib/components/common';
	import { AddDataModal, SettingsModal } from '$lib/components/modals';
	import { language, settings } from '$lib/stores';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let settingsOpen = $state(false);
	let addDataOpen = $state(false);
	const navigationOrientation = $derived($settings.navigationLayout);

	$effect(() => {
		document.documentElement.lang = $language === 'pt-BR' ? 'pt-BR' : 'en';
	});

	onMount(() => {
		settings.initThemeFromSystem();
	});
</script>

<div class="app-shell">
	<Header
		onSettingsClick={() => (settingsOpen = true)}
		onAddDataClick={() => (addDataOpen = true)}
	/>

	<div class="content-shell" class:sidebar={navigationOrientation === 'sidebar'}>
		<TabBar orientation={navigationOrientation} />
		<div class="route-shell">
			{@render children()}
		</div>
	</div>

	<AlertStack />
	<SettingsModal open={settingsOpen} onClose={() => (settingsOpen = false)} />
	<AddDataModal open={addDataOpen} onClose={() => (addDataOpen = false)} />
</div>

<style>
	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--text-primary);
	}

	.content-shell {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.content-shell.sidebar {
		flex-direction: row;
		align-items: stretch;
	}

	.route-shell {
		flex: 1;
		min-width: 0;
	}

	@media (max-width: 640px) {
		.content-shell.sidebar {
			flex-direction: column;
		}
	}
</style>
