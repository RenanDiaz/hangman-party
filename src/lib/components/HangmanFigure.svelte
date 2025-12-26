<script lang="ts">
	interface Props {
		wrongGuesses: number;
		maxAttempts: number;
		animate?: boolean;
	}

	let { wrongGuesses, maxAttempts, animate = true }: Props = $props();

	// Calculate which parts to show based on wrong guesses and max attempts
	// For 6 attempts: gallows(0), head(1), body(2), left arm(3), right arm(4), left leg(5), right leg(6)
	// For 8 attempts: gallows(0), head(1), body(2), left arm(3), right arm(4), left leg(5), right leg(6), face(7,8)
	// For 10 attempts: each part shows more gradually

	const getPartsToShow = () => {
		if (maxAttempts === 6) {
			return {
				gallows: true,
				head: wrongGuesses >= 1,
				body: wrongGuesses >= 2,
				leftArm: wrongGuesses >= 3,
				rightArm: wrongGuesses >= 4,
				leftLeg: wrongGuesses >= 5,
				rightLeg: wrongGuesses >= 6,
				face: wrongGuesses >= 6
			};
		} else if (maxAttempts === 8) {
			return {
				gallows: true,
				head: wrongGuesses >= 1,
				body: wrongGuesses >= 2,
				leftArm: wrongGuesses >= 3,
				rightArm: wrongGuesses >= 4,
				leftLeg: wrongGuesses >= 5,
				rightLeg: wrongGuesses >= 6,
				face: wrongGuesses >= 7,
				dead: wrongGuesses >= 8
			};
		} else {
			// 10 attempts - more gradual
			return {
				gallows: true,
				head: wrongGuesses >= 1,
				eyes: wrongGuesses >= 2,
				body: wrongGuesses >= 3,
				leftArm: wrongGuesses >= 4,
				rightArm: wrongGuesses >= 5,
				leftHand: wrongGuesses >= 6,
				rightHand: wrongGuesses >= 7,
				leftLeg: wrongGuesses >= 8,
				rightLeg: wrongGuesses >= 9,
				dead: wrongGuesses >= 10
			};
		}
	};

	let parts = $derived(getPartsToShow());
	let isLost = $derived(wrongGuesses >= maxAttempts);
</script>

<div class="hangman-figure w-full max-w-[200px] md:max-w-[280px] mx-auto">
	<svg viewBox="0 0 200 250" class="w-full h-auto">
		<!-- Gallows -->
		{#if parts.gallows}
			<!-- Base -->
			<line
				x1="20"
				y1="230"
				x2="100"
				y2="230"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				class="text-slate-400"
			/>
			<!-- Vertical pole -->
			<line
				x1="60"
				y1="230"
				x2="60"
				y2="20"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				class="text-slate-400"
			/>
			<!-- Horizontal beam -->
			<line
				x1="60"
				y1="20"
				x2="140"
				y2="20"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				class="text-slate-400"
			/>
			<!-- Rope -->
			<line
				x1="140"
				y1="20"
				x2="140"
				y2="50"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-amber-600"
			/>
		{/if}

		<!-- Head -->
		{#if parts.head}
			<circle
				cx="140"
				cy="70"
				r="20"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
				style="stroke-dasharray: 1000; stroke-dashoffset: 0;"
			/>

			<!-- Face -->
			{#if parts.face || parts.eyes}
				<!-- Eyes -->
				{#if isLost || parts.dead}
					<!-- X eyes when dead -->
					<line x1="132" y1="65" x2="138" y2="71" stroke="currentColor" stroke-width="2" class="text-red-500" />
					<line x1="138" y1="65" x2="132" y2="71" stroke="currentColor" stroke-width="2" class="text-red-500" />
					<line x1="142" y1="65" x2="148" y2="71" stroke="currentColor" stroke-width="2" class="text-red-500" />
					<line x1="148" y1="65" x2="142" y2="71" stroke="currentColor" stroke-width="2" class="text-red-500" />
				{:else}
					<!-- Normal eyes -->
					<circle cx="133" cy="67" r="2" fill="currentColor" class="text-slate-600" />
					<circle cx="147" cy="67" r="2" fill="currentColor" class="text-slate-600" />
				{/if}

				<!-- Mouth -->
				{#if isLost || parts.dead}
					<!-- Sad mouth -->
					<path
						d="M 130 80 Q 140 75 150 80"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="text-red-500"
					/>
				{:else if parts.face}
					<!-- Worried mouth -->
					<path
						d="M 133 78 Q 140 82 147 78"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="text-slate-500"
					/>
				{/if}
			{/if}
		{/if}

		<!-- Body -->
		{#if parts.body}
			<line
				x1="140"
				y1="90"
				x2="140"
				y2="150"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
			/>
		{/if}

		<!-- Left Arm -->
		{#if parts.leftArm}
			<line
				x1="140"
				y1="100"
				x2="110"
				y2="130"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
			/>
			{#if parts.leftHand}
				<circle cx="108" cy="132" r="4" fill="currentColor" class="text-slate-200" />
			{/if}
		{/if}

		<!-- Right Arm -->
		{#if parts.rightArm}
			<line
				x1="140"
				y1="100"
				x2="170"
				y2="130"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
			/>
			{#if parts.rightHand}
				<circle cx="172" cy="132" r="4" fill="currentColor" class="text-slate-200" />
			{/if}
		{/if}

		<!-- Left Leg -->
		{#if parts.leftLeg}
			<line
				x1="140"
				y1="150"
				x2="115"
				y2="200"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
			/>
		{/if}

		<!-- Right Leg -->
		{#if parts.rightLeg}
			<line
				x1="140"
				y1="150"
				x2="165"
				y2="200"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				class="text-slate-200 {animate ? 'animate-draw' : ''}"
			/>
		{/if}
	</svg>

	<!-- Attempts counter -->
	<div class="text-center mt-2">
		<span class="text-sm text-slate-400">
			Intentos: <span class="font-bold {wrongGuesses >= maxAttempts ? 'text-red-500' : 'text-white'}">{wrongGuesses}</span> / {maxAttempts}
		</span>
	</div>
</div>

<style>
	@keyframes draw {
		from {
			stroke-dashoffset: 1000;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	.animate-draw {
		animation: draw 0.5s ease-out forwards;
		stroke-dasharray: 1000;
	}
</style>
