<script lang="ts">
	import { t } from 'svelte-i18n';
	import type { CompetitivePlayerState, Player } from '$lib/types/game';
	import HangmanFigure from './HangmanFigure.svelte';
	import WordDisplay from './WordDisplay.svelte';

	interface Props {
		players: Player[];
		competitiveStates: CompetitivePlayerState[];
		currentPlayerId: string;
		maxAttempts: number;
	}

	let { players, competitiveStates, currentPlayerId, maxAttempts }: Props = $props();

	const getPlayerState = (playerId: string) => {
		return competitiveStates.find(s => s.playerId === playerId);
	};

	const getPlayer = (playerId: string) => {
		return players.find(p => p.id === playerId);
	};
</script>

<div class="competitive-board grid gap-4 {players.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}">
	{#each competitiveStates as state (state.playerId)}
		{@const player = getPlayer(state.playerId)}
		{@const isCurrentPlayer = state.playerId === currentPlayerId}

		<div
			class="player-game card transition-all
				{isCurrentPlayer ? 'ring-2 ring-blue-500' : ''}
				{state.hasWon ? 'bg-green-500/10 ring-2 ring-green-500' : ''}
				{state.hasLost ? 'bg-red-500/10 opacity-75' : ''}"
		>
			<!-- Player Header -->
			<div class="flex items-center gap-2 mb-4">
				<span class="text-2xl">{player?.avatar}</span>
				<span class="font-semibold text-white {isCurrentPlayer ? 'text-blue-400' : ''}">
					{player?.name}
					{#if isCurrentPlayer}
						<span class="text-xs">{$t('players.you')}</span>
					{/if}
				</span>

				{#if state.hasWon}
					<span class="ml-auto text-green-400">🏆 {$t('competitive.won')}</span>
				{:else if state.hasLost}
					<span class="ml-auto text-red-400">❌ {$t('competitive.lost')}</span>
				{/if}
			</div>

			<!-- Mini Hangman -->
			<div class="flex justify-center mb-4 scale-75 origin-top">
				<HangmanFigure
					wrongGuesses={state.wrongLetters.length}
					maxAttempts={maxAttempts}
					animate={false}
				/>
			</div>

			<!-- Word Display (hidden for other players during game) -->
			{#if isCurrentPlayer || state.hasWon || state.hasLost}
				<div class="scale-75 origin-top">
					<WordDisplay
						word={state.word}
						revealedLetters={new Set(state.revealedLetters)}
						showWord={state.hasLost}
						isWon={state.hasWon}
						isLost={state.hasLost}
					/>
				</div>
			{:else}
				<div class="text-center text-slate-500 py-4">
					<div class="text-sm">{$t('competitive.hiddenWord')}</div>
					<div class="text-lg tracking-widest">
						{'?'.repeat(Math.min(state.word.replace(/\s/g, '').length, 8))}
						{#if state.word.replace(/\s/g, '').length > 8}...{/if}
					</div>
				</div>
			{/if}

			<!-- Progress -->
			<div class="mt-4 text-center text-sm text-slate-400">
				{state.revealedLetters.length} {$t('competitive.letters')} | {state.wrongLetters.length}/{maxAttempts} {$t('competitive.errors')}
			</div>
		</div>
	{/each}
</div>
