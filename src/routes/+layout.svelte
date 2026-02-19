<script lang="ts">
	import '../app.css';
	import { language } from '$lib/stores';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	$effect(() => {
		document.documentElement.lang = $language === 'pt-BR' ? 'pt-BR' : 'en';
	});
</script>

<div class="min-h-screen bg-bg text-text-primary">
	{@render children()}
</div>
