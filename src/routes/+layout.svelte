<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { isLoading, t } from 'svelte-i18n';

	let { children } = $props();
</script>

{#if $isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-slate-400">Loading...</div>
	</div>
{:else}
	<svelte:head>
		<title>{$t('meta.title')}</title>
		<meta name="description" content={$t('meta.description')} />
	</svelte:head>

	<div class="min-h-screen flex flex-col">
		{@render children()}
	</div>
{/if}
