<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		startTime: number;
		duration: number; // in seconds
	}

	let { startTime, duration }: Props = $props();

	let remaining = $state(duration);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	const updateTimer = () => {
		const elapsed = Math.floor((Date.now() - startTime) / 1000);
		remaining = Math.max(0, duration - elapsed);
	};

	$effect(() => {
		updateTimer();
		intervalId = setInterval(updateTimer, 100);

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});

	let percentage = $derived((remaining / duration) * 100);
	let isLow = $derived(remaining <= 10);
	let isCritical = $derived(remaining <= 5);
</script>

<div class="turn-timer">
	<div class="flex items-center gap-3">
		<div class="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
			<div
				class="h-full transition-all duration-100 rounded-full
					{isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-blue-500'}
					{isCritical ? 'animate-pulse' : ''}"
				style="width: {percentage}%"
			></div>
		</div>

		<div
			class="text-lg font-bold min-w-[50px] text-right
				{isCritical ? 'text-red-500 animate-pulse' : isLow ? 'text-amber-500' : 'text-white'}"
		>
			{remaining}s
		</div>
	</div>

	{#if isCritical}
		<div class="text-center text-red-400 text-sm mt-1 animate-pulse">
			¡Tiempo casi agotado!
		</div>
	{/if}
</div>
