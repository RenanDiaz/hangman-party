<script lang="ts">
	import { goto } from '$app/navigation';
	import { singlePlayerStore } from '$lib/stores/game.svelte';
	import { getRandomWord, CATEGORY_NAMES, DIFFICULTY_NAMES } from '$lib/data/words';
	import type { Category, Difficulty } from '$lib/types/game';
	import HangmanFigure from '$lib/components/HangmanFigure.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';

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
</script>

<main class="flex-1 flex flex-col p-4">
	<!-- Header -->
	<header class="flex items-center justify-between mb-6">
		<button
			type="button"
			class="btn btn-secondary text-sm"
			onclick={handleBackToMenu}
		>
			← Menú
		</button>

		<div class="text-center">
			<h1 class="text-2xl font-bold text-white">🎮 Un Jugador</h1>
			<p class="text-sm text-slate-400">
				{CATEGORY_NAMES[store.category as Category] || CATEGORY_NAMES[category]}
			</p>
		</div>

		<div class="text-right">
			<div class="text-lg font-bold text-white">{store.score}</div>
			<div class="text-xs text-slate-400">puntos</div>
		</div>
	</header>

	{#if store.gameStatus === 'idle'}
		<!-- Loading / Starting -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-slate-400">Cargando...</div>
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
					<h2 class="text-2xl font-bold text-green-400">¡Ganaste!</h2>
					<p class="text-slate-400">
						Rondas ganadas: {store.roundsWon} / {store.roundsPlayed}
					</p>
				</div>
			{:else if store.gameStatus === 'lost'}
				<div class="text-center mb-8 animate-shake">
					<div class="text-4xl mb-2">😵</div>
					<h2 class="text-2xl font-bold text-red-400">¡Perdiste!</h2>
					<p class="text-slate-400">La palabra era: <span class="text-white font-bold">{store.word}</span></p>
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
						🔄 Jugar de nuevo
					</button>
					<button
						type="button"
						class="btn btn-secondary"
						onclick={handleBackToMenu}
					>
						🏠 Menú principal
					</button>
				</div>
			{/if}
		</div>

		<!-- Stats Bar -->
		<div class="mt-6 flex justify-center gap-6 text-sm text-slate-400">
			<div>
				Victorias: <span class="text-white font-bold">{store.roundsWon}</span>
			</div>
			<div>
				Partidas: <span class="text-white font-bold">{store.roundsPlayed}</span>
			</div>
			<div>
				Puntos: <span class="text-white font-bold">{store.score}</span>
			</div>
		</div>
	{/if}
</main>

<!-- Settings Panel (collapsible) -->
<div class="fixed bottom-4 right-4">
	<details class="card p-4 bg-slate-800/90 backdrop-blur max-w-xs">
		<summary class="cursor-pointer text-white font-semibold flex items-center gap-2">
			⚙️ Configuración
		</summary>

		<div class="mt-4 space-y-4">
			<div>
				<label class="block text-sm text-slate-400 mb-1">Categoría</label>
				<select class="select text-sm" bind:value={category}>
					{#each Object.entries(CATEGORY_NAMES) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-sm text-slate-400 mb-1">Dificultad</label>
				<select class="select text-sm" bind:value={difficulty}>
					{#each Object.entries(DIFFICULTY_NAMES) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-sm text-slate-400 mb-1">Intentos</label>
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
				Aplicar y reiniciar
			</button>
		</div>
	</details>
</div>
