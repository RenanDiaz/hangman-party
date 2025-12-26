<script lang="ts">
	import { goto } from '$app/navigation';
	import { t, locale } from 'svelte-i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SoundToggle from '$lib/components/SoundToggle.svelte';

	let roomCode = $state('');
	let showJoinInput = $state(false);

	const generateRoomCode = () => {
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let code = '';
		for (let i = 0; i < 6; i++) {
			code += chars[Math.floor(Math.random() * chars.length)];
		}
		return code;
	};

	const handleCreateRoom = () => {
		const code = generateRoomCode();
		goto(`/room/${code}`);
	};

	const handleJoinRoom = () => {
		if (roomCode.trim().length >= 4) {
			goto(`/room/${roomCode.trim().toUpperCase()}`);
		}
	};

	const handleSinglePlayer = () => {
		goto('/single-player');
	};

	const categoryIcons = ['🐾', '🌍', '🎬', '🍕', '⚽', '👨‍⚕️', '💻', '🎲'];
	const categoryKeys = ['animales', 'paises', 'peliculas', 'comida', 'deportes', 'profesiones', 'tecnologia', 'mix'];
</script>

<main class="flex-1 flex flex-col items-center justify-center p-4">
	<!-- Language Switcher & Sound Toggle -->
	<div class="fixed safe-top right-4 z-50 flex gap-2">
		<SoundToggle />
		<LanguageSwitcher />
	</div>

	<div class="text-center mb-12">
		<img
			src="/logo.png"
			alt="Hangman Party"
			class="w-64 md:w-80 lg:w-96 mx-auto mb-6 drop-shadow-2xl"
		/>
		<p class="text-xl text-slate-300">
			{$t('home.subtitle')}
		</p>
	</div>

	<div class="w-full max-w-md space-y-4">
		<!-- Single Player -->
		<button
			type="button"
			class="btn btn-secondary w-full text-lg py-4 flex items-center justify-center gap-3"
			onclick={handleSinglePlayer}
		>
			<span class="text-2xl">🎯</span>
			<span>{$t('home.singlePlayer')}</span>
		</button>

		<!-- Create Room -->
		<button
			type="button"
			class="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
			onclick={handleCreateRoom}
		>
			<span class="text-2xl">✨</span>
			<span>{$t('home.createRoom')}</span>
		</button>

		<!-- Join Room -->
		{#if !showJoinInput}
			<button
				type="button"
				class="btn btn-secondary w-full text-lg py-4 flex items-center justify-center gap-3"
				onclick={() => showJoinInput = true}
			>
				<span class="text-2xl">🔗</span>
				<span>{$t('home.joinRoom')}</span>
			</button>
		{:else}
			<div class="card">
				<div class="flex gap-3">
					<input
						type="text"
						class="input flex-1 uppercase"
						placeholder={$t('home.roomCodePlaceholder')}
						bind:value={roomCode}
						maxlength="8"
						onkeydown={(e) => e.key === 'Enter' && handleJoinRoom()}
					/>
					<button
						type="button"
						class="btn btn-primary"
						onclick={handleJoinRoom}
						disabled={roomCode.trim().length < 4}
					>
						{$t('home.join')}
					</button>
				</div>
				<button
					type="button"
					class="text-sm text-slate-400 mt-3 hover:text-white transition-colors"
					onclick={() => showJoinInput = false}
				>
					{$t('home.cancel')}
				</button>
			</div>
		{/if}
	</div>

	<!-- Features -->
	<div class="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
		<div class="card text-center">
			<div class="text-4xl mb-3">👥</div>
			<h3 class="font-bold text-lg text-white mb-2">{$t('home.teamMode')}</h3>
			<p class="text-slate-400 text-sm">{$t('home.teamModeDesc')}</p>
		</div>

		<div class="card text-center">
			<div class="text-4xl mb-3">🏆</div>
			<h3 class="font-bold text-lg text-white mb-2">{$t('home.competitiveMode')}</h3>
			<p class="text-slate-400 text-sm">{$t('home.competitiveModeDesc')}</p>
		</div>

		<div class="card text-center">
			<div class="text-4xl mb-3">📊</div>
			<h3 class="font-bold text-lg text-white mb-2">{$t('home.scoring')}</h3>
			<p class="text-slate-400 text-sm">{$t('home.scoringDesc')}</p>
		</div>
	</div>

	<!-- Categories Preview -->
	<div class="mt-12 text-center">
		<p class="text-slate-400 mb-4">{$t('home.categoriesAvailable', { values: { count: 8 } })}</p>
		<div class="flex flex-wrap justify-center gap-3">
			{#each categoryKeys as category, i}
				<span class="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
					{categoryIcons[i]} {$t(`categories.${category}`)}
				</span>
			{/each}
		</div>
	</div>
</main>

<footer class="p-4 text-center text-slate-500 text-sm">
	<p>{$t('home.madeWith')}</p>
</footer>
