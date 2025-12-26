<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { gameStore } from '$lib/stores/game.svelte';
	import { AVATARS } from '$lib/types/game';
	import HangmanFigure from '$lib/components/HangmanFigure.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import GameConfig from '$lib/components/GameConfig.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';
	import TurnTimer from '$lib/components/TurnTimer.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	const store = gameStore;

	// Join state
	let playerName = $state('');
	let selectedAvatar = $state(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
	let hasJoined = $state(false);

	// Get room code from URL
	let roomCode = $derived(page.params.code);

	const handleJoin = () => {
		if (playerName.trim().length < 2) return;
		store.connect(roomCode, playerName.trim(), selectedAvatar);
		hasJoined = true;
	};

	const handleLeave = () => {
		store.disconnect();
		goto('/');
	};

	const handleGuess = (letter: string) => {
		store.guessLetter(letter);
	};

	const copyRoomLink = async () => {
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
			alert($t('room.linkCopied'));
		} catch {
			prompt('Copy this link:', url);
		}
	};

	// Cleanup on unmount
	onMount(() => {
		return () => {
			if (store.isConnected) {
				store.disconnect();
			}
		};
	});

	const categoryIcons: Record<string, string> = {
		animales: '🐾',
		paises: '🌍',
		peliculas: '🎬',
		comida: '🍕',
		deportes: '⚽',
		profesiones: '👨‍⚕️',
		tecnologia: '💻',
		mix: '🎲'
	};
</script>

<main class="flex-1 flex flex-col p-4">
	<!-- Language Switcher -->
	<div class="fixed safe-top right-4 z-50">
		<LanguageSwitcher />
	</div>

	{#if !hasJoined}
		<!-- Join Form -->
		<div class="flex-1 flex items-center justify-center">
			<div class="card max-w-md w-full">
				<h1 class="text-2xl font-bold text-white text-center mb-6">
					{$t('room.joinRoom')}
				</h1>

				<div class="text-center mb-6">
					<span class="text-sm text-slate-400">{$t('room.roomCode')}</span>
					<div class="text-3xl font-mono font-bold text-blue-400">{roomCode}</div>
				</div>

				<div class="space-y-4">
					<div>
						<label for="playerName" class="block text-sm text-slate-400 mb-1">{$t('room.yourName')}</label>
						<input
							id="playerName"
							type="text"
							class="input"
							placeholder={$t('room.enterName')}
							bind:value={playerName}
							maxlength="20"
							onkeydown={(e) => e.key === 'Enter' && handleJoin()}
						/>
					</div>

					<div>
						<label class="block text-sm text-slate-400 mb-2">{$t('room.chooseAvatar')}</label>
						<div class="grid grid-cols-8 gap-2">
							{#each AVATARS as avatar}
								<button
									type="button"
									class="text-2xl p-2 rounded-lg transition-all
										{selectedAvatar === avatar
											? 'bg-blue-500 ring-2 ring-blue-400'
											: 'bg-slate-700 hover:bg-slate-600'}"
									onclick={() => selectedAvatar = avatar}
								>
									{avatar}
								</button>
							{/each}
						</div>
					</div>

					<button
						type="button"
						class="btn btn-primary w-full"
						onclick={handleJoin}
						disabled={playerName.trim().length < 2}
					>
						🎮 {$t('room.joinButton')}
					</button>

					<button
						type="button"
						class="text-sm text-slate-400 w-full text-center hover:text-white transition-colors"
						onclick={() => goto('/')}
					>
						← {$t('room.backToMenu')}
					</button>
				</div>
			</div>
		</div>
	{:else if store.isConnecting}
		<!-- Connecting -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<div class="text-4xl animate-bounce mb-4">🔌</div>
				<p class="text-slate-400">{$t('room.connecting')}</p>
			</div>
		</div>
	{:else if store.error && !store.isConnected}
		<!-- Connection Error -->
		<div class="flex-1 flex items-center justify-center">
			<div class="card max-w-md text-center">
				<div class="text-4xl mb-4">❌</div>
				<h2 class="text-xl font-bold text-red-400 mb-2">{$t('room.connectionError')}</h2>
				<p class="text-slate-400 mb-4">{store.error}</p>
				<button
					type="button"
					class="btn btn-primary"
					onclick={() => { hasJoined = false; }}
				>
					{$t('room.retry')}
				</button>
			</div>
		</div>
	{:else if store.state}
		<!-- Game Room -->
		<header class="flex items-center justify-between mb-4">
			<button
				type="button"
				class="btn btn-secondary text-sm"
				onclick={handleLeave}
			>
				← {$t('room.exit')}
			</button>

			<div class="text-center">
				<div class="flex items-center gap-2 justify-center">
					<span class="text-sm text-slate-400">{$t('room.room')}</span>
					<span class="font-mono font-bold text-blue-400">{roomCode}</span>
					<button
						type="button"
						class="text-slate-400 hover:text-white transition-colors"
						onclick={copyRoomLink}
						title={$t('room.copyLink')}
					>
						📋
					</button>
				</div>
			</div>

			<div class="text-right text-sm">
				<div class="text-white">{store.currentPlayer?.name}</div>
				<div class="text-slate-400">
					{store.state.config.mode === 'team' ? `👥 ${$t('room.team')}` : `🏆 ${$t('room.competitive')}`}
				</div>
			</div>
		</header>

		<!-- Error Toast -->
		{#if store.error}
			<div class="fixed safe-top left-1/2 transform -translate-x-1/2 z-50">
				<div class="bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce-in">
					{store.error}
				</div>
			</div>
		{/if}

		{#if store.state.status === 'lobby' || store.state.status === 'configuring'}
			<!-- Lobby / Configuration -->
			<div class="flex-1 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
				<!-- Left: Players -->
				<div class="card">
					<h2 class="text-xl font-bold text-white mb-4">
						{$t('room.playersCount', { values: { count: store.players.length } })}
					</h2>
					<PlayerList
						players={store.players}
						currentPlayerId={store.playerId}
						isHost={store.isHost}
						onKick={(id) => store.kickPlayer(id)}
					/>

					<div class="mt-4 pt-4 border-t border-slate-700">
						<button
							type="button"
							class="btn btn-secondary w-full text-sm"
							onclick={copyRoomLink}
						>
							📋 {$t('room.copyInviteLink')}
						</button>
					</div>
				</div>

				<!-- Right: Configuration -->
				<div class="card">
					<h2 class="text-xl font-bold text-white mb-4">⚙️ {$t('game.settings')}</h2>
					<GameConfig
						config={store.state.config}
						isHost={store.isHost}
						playerCount={store.players.length}
						onConfigChange={(c) => store.updateConfig(c)}
						onStartGame={() => store.startGame()}
					/>
				</div>
			</div>
		{:else if store.state.status === 'playing'}
			<!-- Playing -->
			<div class="flex-1 flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
				<!-- Game Area -->
				<div class="flex-1 flex flex-col items-center justify-center">
					<!-- Round info -->
					<div class="text-center mb-4">
						<span class="text-sm text-slate-400">
							{$t('room.roundOf', { values: { current: store.state.currentRound, total: store.state.config.rounds } })}
						</span>
						{#if store.round?.category}
							<span class="text-sm text-slate-400 ml-2">
								| {categoryIcons[store.round.category]} {$t(`categories.${store.round.category}`)}
							</span>
						{/if}
					</div>

					<!-- Turn Timer -->
					{#if store.state.config.turnTimeLimit && store.round?.turnStartTime && store.state.config.mode === 'team'}
						<div class="w-full max-w-md mb-4">
							<TurnTimer
								startTime={store.round.turnStartTime}
								duration={store.state.config.turnTimeLimit}
							/>
						</div>
					{/if}

					<!-- Turn indicator for team mode -->
					{#if store.state.config.mode === 'team'}
						<div class="text-center mb-4">
							{#if store.isMyTurn}
								<span class="text-lg font-bold text-green-400 animate-pulse">
									🎯 {$t('room.yourTurn')}
								</span>
							{:else}
								<span class="text-slate-400">
									{$t('room.turnOf')} <span class="text-white font-semibold">{store.currentTurnPlayer?.name}</span>
								</span>
							{/if}
						</div>
					{/if}

					<!-- Hangman -->
					<div class="mb-6">
						<HangmanFigure
							wrongGuesses={store.wrongGuessCount}
							maxAttempts={store.maxAttempts}
						/>
					</div>

					<!-- Word -->
					<div class="mb-8">
						<WordDisplay
							word={store.word}
							revealedLetters={store.correctLetters}
						/>
					</div>

					<!-- Keyboard -->
					<Keyboard
						usedLetters={store.usedLetters}
						correctLetters={store.correctLetters}
						disabled={!store.isMyTurn}
						onGuess={handleGuess}
					/>

					{#if !store.isMyTurn && store.state.config.mode === 'team'}
						<p class="text-slate-400 mt-4 text-sm">
							{$t('room.waitYourTurn')}
						</p>
					{/if}
				</div>

				<!-- Sidebar: Players -->
				<div class="lg:w-72 card h-fit">
					<h3 class="font-bold text-white mb-3">{$t('room.players')}</h3>
					<PlayerList
						players={store.players}
						currentPlayerId={store.playerId}
						currentTurnPlayerId={store.state.config.mode === 'team' ? store.currentTurnPlayer?.id : undefined}
						showScores={true}
					/>
				</div>
			</div>
		{:else if store.state.status === 'between_rounds'}
			<!-- Between Rounds -->
			<div class="flex-1 flex items-center justify-center">
				<div class="card max-w-lg w-full text-center">
					<h2 class="text-2xl font-bold text-white mb-4">
						🎉 {$t('room.roundFinished', { values: { round: store.state.currentRound } })}
					</h2>

					<div class="mb-6">
						<Scoreboard
							players={store.players}
							currentPlayerId={store.playerId}
						/>
					</div>

					<p class="text-slate-400 mb-4">
						{$t('room.nextRound', { values: { current: store.state.currentRound + 1, total: store.state.config.rounds } })}
					</p>

					{#if store.isHost}
						<button
							type="button"
							class="btn btn-primary"
							onclick={() => store.nextRound()}
						>
							▶️ {$t('room.nextRoundButton')}
						</button>
					{:else}
						<p class="text-slate-400">
							{$t('room.waitingForHost')}
						</p>
					{/if}
				</div>
			</div>
		{:else if store.state.status === 'finished'}
			<!-- Game Finished -->
			<div class="flex-1 flex items-center justify-center">
				<div class="card max-w-lg w-full text-center">
					<div class="text-6xl mb-4">🏆</div>
					<h2 class="text-3xl font-bold text-white mb-2">{$t('room.gameFinished')}</h2>

					<div class="mb-6">
						<Scoreboard
							players={store.players}
							currentPlayerId={store.playerId}
						/>
					</div>

					{#if store.isHost}
						<div class="flex gap-4 justify-center">
							<button
								type="button"
								class="btn btn-primary"
								onclick={() => store.restartGame()}
							>
								🔄 {$t('game.playAgain')}
							</button>
							<button
								type="button"
								class="btn btn-secondary"
								onclick={handleLeave}
							>
								🏠 {$t('room.exit')}
							</button>
						</div>
					{:else}
						<p class="text-slate-400 mb-4">
							{$t('room.waitingHost')}
						</p>
						<button
							type="button"
							class="btn btn-secondary"
							onclick={handleLeave}
						>
							🏠 {$t('room.exit')}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<!-- No state yet -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-slate-400">{$t('room.loadingRoom')}</div>
		</div>
	{/if}
</main>
