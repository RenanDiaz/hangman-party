<script lang="ts">
	import { locale } from 'svelte-i18n';

	const languages = [
		{ code: 'es', label: '🇪🇸 ES', name: 'Español' },
		{ code: 'en', label: '🇺🇸 EN', name: 'English' }
	];

	const switchLanguage = (lang: string) => {
		locale.set(lang);
	};
</script>

<div class="language-switcher flex gap-1 bg-slate-800/50 rounded-lg p-1">
	{#each languages as lang}
		<button
			type="button"
			class="px-2 py-1 rounded text-sm font-medium transition-all
				{$locale === lang.code
					? 'bg-blue-500 text-white'
					: 'text-slate-400 hover:text-white hover:bg-slate-700'}"
			onclick={() => switchLanguage(lang.code)}
			title={lang.name}
		>
			{lang.label}
		</button>
	{/each}
</div>
