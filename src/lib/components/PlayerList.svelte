<script lang="ts">
	import type { Player } from '$lib/types/game';

	interface Props {
		players: Player[];
		currentPlayerId?: string;
		currentTurnPlayerId?: string;
		isHost?: boolean;
		showScores?: boolean;
		onKick?: (playerId: string) => void;
	}

	let {
		players,
		currentPlayerId = '',
		currentTurnPlayerId = '',
		isHost = false,
		showScores = false,
		onKick
	}: Props = $props();
</script>

<div class="player-list space-y-2">
	{#each players as player (player.id)}
		<div
			class="player-card flex items-center gap-3 p-3 rounded-xl transition-all duration-300
				{player.id === currentTurnPlayerId ? 'bg-blue-500/20 border border-blue-500/50 ring-2 ring-blue-500/30' : 'bg-slate-700/50'}
				{!player.isConnected ? 'opacity-50' : ''}"
		>
			<!-- Avatar -->
			<div
				class="avatar text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-slate-600
					{player.id === currentTurnPlayerId ? 'animate-pulse' : ''}"
			>
				{player.avatar}
			</div>

			<!-- Name & Status -->
			<div class="flex-1 min-w-0">
				<div class="flex items-center gap-2">
					<span class="font-semibold truncate {player.id === currentPlayerId ? 'text-blue-400' : 'text-white'}">
						{player.name}
						{#if player.id === currentPlayerId}
							<span class="text-xs text-blue-400">(tú)</span>
						{/if}
					</span>

					{#if player.isHost}
						<span class="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
							👑 Host
						</span>
					{/if}

					{#if player.id === currentTurnPlayerId}
						<span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full animate-pulse">
							🎯 Turno
						</span>
					{/if}
				</div>

				{#if !player.isConnected}
					<span class="text-xs text-slate-400">Desconectado</span>
				{/if}
			</div>

			<!-- Score -->
			{#if showScores}
				<div class="score text-right">
					<div class="text-lg font-bold text-white">{player.score}</div>
					<div class="text-xs text-slate-400">puntos</div>
				</div>
			{/if}

			<!-- Kick button (only for host, not self) -->
			{#if isHost && player.id !== currentPlayerId && onKick}
				<button
					type="button"
					class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
					onclick={() => onKick(player.id)}
					title="Expulsar jugador"
				>
					✕
				</button>
			{/if}
		</div>
	{/each}

	{#if players.length === 0}
		<div class="text-center text-slate-400 py-4">
			No hay jugadores todavía
		</div>
	{/if}
</div>
