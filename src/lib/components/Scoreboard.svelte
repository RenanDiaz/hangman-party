<script lang="ts">
	import type { Player } from '$lib/types/game';

	interface Props {
		players: Player[];
		currentPlayerId?: string;
		showRank?: boolean;
	}

	let { players, currentPlayerId = '', showRank = true }: Props = $props();

	let sortedPlayers = $derived(
		[...players].sort((a, b) => b.score - a.score)
	);

	const getRankEmoji = (rank: number) => {
		switch (rank) {
			case 1: return '🥇';
			case 2: return '🥈';
			case 3: return '🥉';
			default: return `#${rank}`;
		}
	};
</script>

<div class="scoreboard">
	<h3 class="text-xl font-bold text-white mb-4 text-center">🏆 Tabla de Posiciones</h3>

	<div class="space-y-2">
		{#each sortedPlayers as player, index (player.id)}
			<div
				class="flex items-center gap-3 p-3 rounded-xl transition-all
					{player.id === currentPlayerId ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-700/50'}
					{index === 0 ? 'ring-2 ring-amber-500/30' : ''}"
			>
				{#if showRank}
					<div class="rank text-xl min-w-[40px] text-center">
						{getRankEmoji(index + 1)}
					</div>
				{/if}

				<div class="avatar text-2xl">{player.avatar}</div>

				<div class="flex-1 min-w-0">
					<span class="font-semibold truncate {player.id === currentPlayerId ? 'text-blue-400' : 'text-white'}">
						{player.name}
						{#if player.id === currentPlayerId}
							<span class="text-xs text-blue-400">(tú)</span>
						{/if}
					</span>
				</div>

				<div class="score text-right">
					<div class="text-xl font-bold text-white">{player.score}</div>
					<div class="text-xs text-slate-400">pts</div>
				</div>
			</div>
		{/each}
	</div>
</div>
