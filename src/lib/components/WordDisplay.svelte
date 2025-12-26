<script lang="ts">
	interface Props {
		word: string;
		revealedLetters: Set<string>;
		showWord?: boolean;
		isWon?: boolean;
		isLost?: boolean;
	}

	let { word, revealedLetters, showWord = false, isWon = false, isLost = false }: Props = $props();

	// Normalize letter for comparison (remove accents)
	const normalizeChar = (char: string) => {
		return char.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	const getLetterState = (char: string, index: number) => {
		if (char === ' ') return 'space';
		const normalizedChar = normalizeChar(char);
		const isRevealed = revealedLetters.has(normalizedChar) || showWord;
		return isRevealed ? 'revealed' : 'hidden';
	};

	let letters = $derived(
		[...word].map((char, index) => ({
			char,
			normalizedChar: normalizeChar(char),
			state: getLetterState(char, index),
			index
		}))
	);
</script>

<div class="word-display flex flex-wrap justify-center gap-2 md:gap-3 px-4">
	{#each letters as letter, i (i)}
		{#if letter.state === 'space'}
			<div class="w-4 md:w-6"></div>
		{:else}
			<div
				class="letter-box w-10 h-14 md:w-14 md:h-20 flex items-center justify-center border-b-4 transition-all duration-300
					{letter.state === 'revealed' ? 'border-green-500' : 'border-slate-400'}
					{isWon ? 'border-green-400' : ''}
					{isLost && letter.state === 'hidden' ? 'border-red-500' : ''}"
			>
				{#if letter.state === 'revealed' || showWord}
					<span
						class="text-3xl md:text-4xl font-bold uppercase animate-reveal
							{isWon ? 'text-green-400' : ''}
							{isLost ? 'text-red-400' : 'text-white'}"
					>
						{letter.char}
					</span>
				{:else if isLost}
					<span class="text-3xl md:text-4xl font-bold uppercase text-red-400/50">
						{letter.char}
					</span>
				{:else}
					<span class="text-transparent">_</span>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<style>
	@keyframes reveal {
		0% {
			transform: rotateX(90deg);
			opacity: 0;
		}
		100% {
			transform: rotateX(0);
			opacity: 1;
		}
	}

	.animate-reveal {
		animation: reveal 0.3s ease-out;
	}
</style>
