<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { isLoading, t } from 'svelte-i18n';

	let { children } = $props();
</script>

<svelte:head>
	<title>{$t('meta.title')}</title>
	<meta name="description" content={$t('meta.description')} />
</svelte:head>

{#if $isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-slate-400">Loading...</div>
	</div>
{:else}
	<div class="min-h-screen flex flex-col">
		{@render children()}
	</div>
{/if}
