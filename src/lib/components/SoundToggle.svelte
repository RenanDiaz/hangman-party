<script lang="ts">
	import { soundManager } from '$lib/stores/sound.svelte';

	const handleToggle = () => {
		soundManager.toggle();
		// Play a test sound when enabling
		if (soundManager.enabled) {
			soundManager.play('keyPress');
		}
	};
</script>

<button
	type="button"
	class="sound-toggle px-2 py-1 rounded-lg text-sm font-medium transition-all bg-slate-800/50
		{soundManager.enabled
			? 'text-white hover:bg-slate-700'
			: 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}"
	onclick={handleToggle}
	title={soundManager.enabled ? 'Mute sounds' : 'Enable sounds'}
>
	{soundManager.enabled ? '🔊' : '🔇'}
</button>

<style>
	.sound-toggle {
		min-width: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
