<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';
	import { singlePlayerStore } from '$lib/stores/game.svelte';
	import { getRandomWord } from '$lib/data/words';
	import type { Category, Difficulty } from '$lib/types/game';
	import HangmanFigure from '$lib/components/HangmanFigure.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	// Game configuration
	let category = $state<Category>('mix');
	let difficulty = $state<Difficulty>('medio');
	let maxAttempts = $state<6 | 8 | 10>(6);

	// Game state from store
	const store = singlePlayerStore;

	const startNewGame = () => {
		const wordData = getRandomWord(category, difficulty);
		store.startGame(wordData.word, wordData.category, maxAttempts);
	};

	const handleGuess = (letter: string) => {
		store.guessLetter(letter);
	};

	const handlePlayAgain = () => {
		store.reset();
		startNewGame();
	};

	const handleBackToMenu = () => {
		store.fullReset();
		goto('/');
	};

	// Start first game
	$effect(() => {
		if (store.gameStatus === 'idle') {
			startNewGame();
		}
	});

	const categoryKeys = ['animales', 'paises', 'peliculas', 'comida', 'deportes', 'profesiones', 'tecnologia', 'mix'];
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

	const difficultyKeys = ['facil', 'medio', 'dificil'];
	const difficultyIcons: Record<string, string> = {
		facil: '😊',
		medio: '🤔',
		dificil: '😰'
	};
</script>

<main class="flex-1 flex flex-col p-4">
	<!-- Language Switcher -->
	<div class="fixed top-4 right-4 z-50">
		<LanguageSwitcher />
	</div>

	<!-- Header -->
	<header class="flex items-center justify-between mb-6">
		<button
			type="button"
			class="btn btn-secondary text-sm"
			onclick={handleBackToMenu}
		>
			← {$t('game.menu')}
		</button>

		<div class="text-center">
			<h1 class="text-2xl font-bold text-white">🎮 {$t('game.singlePlayerTitle')}</h1>
			<p class="text-sm text-slate-400">
				{categoryIcons[store.category as Category] || categoryIcons[category]} {$t(`categories.${store.category || category}`)}
			</p>
		</div>

		<div class="text-right">
			<div class="text-lg font-bold text-white">{store.score}</div>
			<div class="text-xs text-slate-400">{$t('game.points')}</div>
		</div>
	</header>

	{#if store.gameStatus === 'idle'}
		<!-- Loading / Starting -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-slate-400">{$t('game.loading')}</div>
		</div>
	{:else}
		<!-- Game Area -->
		<div class="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
			<!-- Hangman Figure -->
			<div class="mb-8">
				<HangmanFigure
					wrongGuesses={store.wrongGuessCount}
					maxAttempts={store.maxAttempts}
				/>
			</div>

			<!-- Word Display -->
			<div class="mb-8">
				<WordDisplay
					word={store.word}
					revealedLetters={store.correctLetters}
					showWord={store.gameStatus === 'lost'}
					isWon={store.gameStatus === 'won'}
					isLost={store.gameStatus === 'lost'}
				/>
			</div>

			<!-- Game Status Messages -->
			{#if store.gameStatus === 'won'}
				<div class="text-center mb-8 animate-bounce-in">
					<div class="text-4xl mb-2">🎉</div>
					<h2 class="text-2xl font-bold text-green-400">{$t('game.youWon')}</h2>
					<p class="text-slate-400">
						{$t('game.roundsWon', { values: { won: store.roundsWon, played: store.roundsPlayed } })}
					</p>
				</div>
			{:else if store.gameStatus === 'lost'}
				<div class="text-center mb-8 animate-shake">
					<div class="text-4xl mb-2">😵</div>
					<h2 class="text-2xl font-bold text-red-400">{$t('game.youLost')}</h2>
					<p class="text-slate-400">{$t('game.wordWas')} <span class="text-white font-bold">{store.word}</span></p>
				</div>
			{/if}

			<!-- Keyboard or Actions -->
			{#if store.gameStatus === 'playing'}
				<Keyboard
					usedLetters={store.usedLetters}
					correctLetters={store.correctLetters}
					onGuess={handleGuess}
				/>
			{:else}
				<div class="flex gap-4">
					<button
						type="button"
						class="btn btn-primary"
						onclick={handlePlayAgain}
					>
						🔄 {$t('game.playAgain')}
					</button>
					<button
						type="button"
						class="btn btn-secondary"
						onclick={handleBackToMenu}
					>
						🏠 {$t('game.mainMenu')}
					</button>
				</div>
			{/if}
		</div>

		<!-- Stats Bar -->
		<div class="mt-6 flex justify-center gap-6 text-sm text-slate-400">
			<div>
				{$t('game.victories')} <span class="text-white font-bold">{store.roundsWon}</span>
			</div>
			<div>
				{$t('game.games')} <span class="text-white font-bold">{store.roundsPlayed}</span>
			</div>
			<div>
				{$t('game.points')} <span class="text-white font-bold">{store.score}</span>
			</div>
		</div>
	{/if}
</main>

<!-- Settings Panel (collapsible) - positioned to avoid keyboard overlap -->
<div class="settings-panel">
	<details class="settings-details">
		<summary class="settings-summary">
			<span class="settings-icon">⚙️</span>
			<span class="settings-label">{$t('game.settings')}</span>
		</summary>

		<div class="settings-content">
			<div>
				<label class="block text-sm text-slate-400 mb-1">{$t('game.category')}</label>
				<select class="select text-sm" bind:value={category}>
					{#each categoryKeys as cat}
						<option value={cat}>{categoryIcons[cat]} {$t(`categories.${cat}`)}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-sm text-slate-400 mb-1">{$t('game.difficulty')}</label>
				<select class="select text-sm" bind:value={difficulty}>
					{#each difficultyKeys as diff}
						<option value={diff}>{difficultyIcons[diff]} {$t(`difficulties.${diff}`)}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-sm text-slate-400 mb-1">{$t('game.attempts')}</label>
				<div class="flex gap-2">
					{#each [6, 8, 10] as attempts}
						<button
							type="button"
							class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all
								{maxAttempts === attempts ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}"
							onclick={() => maxAttempts = attempts as 6 | 8 | 10}
						>
							{attempts}
						</button>
					{/each}
				</div>
			</div>

			<button
				type="button"
				class="btn btn-primary w-full text-sm"
				onclick={handlePlayAgain}
			>
				{$t('game.applyRestart')}
			</button>
		</div>
	</details>
</div>

<style>
	.settings-panel {
		position: fixed;
		bottom: 0.5rem;
		left: 0.5rem;
		z-index: 40;
	}

	.settings-details {
		background: rgba(30, 41, 59, 0.95);
		backdrop-filter: blur(8px);
		border-radius: 0.75rem;
		border: 1px solid rgba(71, 85, 105, 0.5);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
		max-width: 280px;
	}

	.settings-summary {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
		list-style: none;
	}

	.settings-summary::-webkit-details-marker {
		display: none;
	}

	.settings-icon {
		font-size: 1rem;
	}

	.settings-label {
		display: none;
	}

	.settings-content {
		padding: 0.75rem;
		padding-top: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Show label when expanded or on larger screens */
	.settings-details[open] .settings-label {
		display: inline;
	}

	@media (min-width: 640px) {
		.settings-panel {
			bottom: 1rem;
			left: auto;
			right: 1rem;
		}

		.settings-label {
			display: inline;
		}

		.settings-summary {
			padding: 0.75rem 1rem;
		}

		.settings-content {
			padding: 1rem;
			padding-top: 0.5rem;
			gap: 1rem;
		}

		.settings-details {
			max-width: 320px;
		}
	}
</style>
