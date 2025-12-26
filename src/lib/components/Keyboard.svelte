<script lang="ts">
	import type { LetterState } from '$lib/types/game';

	interface Props {
		usedLetters: Set<string>;
		correctLetters: Set<string>;
		disabled?: boolean;
		onGuess: (letter: string) => void;
	}

	let { usedLetters, correctLetters, disabled = false, onGuess }: Props = $props();

	const KEYBOARD_ROWS = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M']
	];

	const getLetterState = (letter: string): LetterState => {
		if (correctLetters.has(letter)) return 'correct';
		if (usedLetters.has(letter)) return 'incorrect';
		if (disabled) return 'disabled';
		return 'available';
	};

	const handleKeyPress = (letter: string) => {
		const state = getLetterState(letter);
		if (state === 'available') {
			onGuess(letter);
		}
	};

	// Handle physical keyboard
	const handleKeyDown = (event: KeyboardEvent) => {
		if (disabled) return;

		const key = event.key.toUpperCase();
		const isLetter = /^[A-ZÑ]$/.test(key);

		if (isLetter) {
			const state = getLetterState(key);
			if (state === 'available') {
				onGuess(key);
			}
		}
	};

	$effect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
			return () => window.removeEventListener('keydown', handleKeyDown);
		}
	});
</script>

<div class="keyboard flex flex-col items-center gap-2 md:gap-3">
	{#each KEYBOARD_ROWS as row, rowIndex}
		<div class="flex gap-1 md:gap-2">
			{#each row as letter}
				{@const state = getLetterState(letter)}
				<button
					type="button"
					class="keyboard-key
						{state === 'available' ? 'keyboard-key-available' : ''}
						{state === 'correct' ? 'keyboard-key-correct' : ''}
						{state === 'incorrect' ? 'keyboard-key-incorrect' : ''}
						{state === 'disabled' ? 'keyboard-key-disabled' : ''}"
					disabled={state !== 'available'}
					onclick={() => handleKeyPress(letter)}
				>
					{letter}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.keyboard-key {
		width: 2.5rem;
		height: 3rem;
		border-radius: 0.5rem;
		font-weight: bold;
		font-size: 1rem;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.keyboard-key {
			width: 3rem;
			height: 3.5rem;
			font-size: 1.25rem;
		}
	}

	.keyboard-key-available {
		background: rgb(71 85 105);
		color: white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.keyboard-key-available:hover {
		background: rgb(100 116 139);
		transform: scale(1.1);
	}

	.keyboard-key-available:active {
		transform: scale(0.95);
	}

	.keyboard-key-correct {
		background: rgb(34 197 94);
		color: white;
		cursor: default;
	}

	.keyboard-key-incorrect {
		background: rgb(239 68 68 / 0.5);
		color: rgb(148 163 184);
		cursor: default;
	}

	.keyboard-key-disabled {
		background: rgb(51 65 85 / 0.5);
		color: rgb(100 116 139);
		cursor: not-allowed;
	}
</style>
