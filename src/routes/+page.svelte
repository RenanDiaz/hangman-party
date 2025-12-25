<script lang="ts">
	import { goto } from '$app/navigation';

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
</script>

<main class="flex-1 flex flex-col items-center justify-center p-4">
	<div class="text-center mb-12">
		<h1 class="text-5xl md:text-7xl font-bold text-gradient glow mb-4">
			🎮 Hangman Party
		</h1>
		<p class="text-xl text-slate-300">
			Juego de Ahorcado Multijugador en Tiempo Real
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
			<span>Un Jugador</span>
		</button>

		<!-- Create Room -->
		<button
			type="button"
			class="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
			onclick={handleCreateRoom}
		>
			<span class="text-2xl">✨</span>
			<span>Crear Sala</span>
		</button>

		<!-- Join Room -->
		{#if !showJoinInput}
			<button
				type="button"
				class="btn btn-secondary w-full text-lg py-4 flex items-center justify-center gap-3"
				onclick={() => showJoinInput = true}
			>
				<span class="text-2xl">🔗</span>
				<span>Unirse a Sala</span>
			</button>
		{:else}
			<div class="card">
				<div class="flex gap-3">
					<input
						type="text"
						class="input flex-1 uppercase"
						placeholder="Código de sala"
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
						Unirse
					</button>
				</div>
				<button
					type="button"
					class="text-sm text-slate-400 mt-3 hover:text-white transition-colors"
					onclick={() => showJoinInput = false}
				>
					Cancelar
				</button>
			</div>
		{/if}
	</div>

	<!-- Features -->
	<div class="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
		<div class="card text-center">
			<div class="text-4xl mb-3">👥</div>
			<h3 class="font-bold text-lg text-white mb-2">Modo Equipo</h3>
			<p class="text-slate-400 text-sm">Colabora con tus amigos para adivinar la palabra</p>
		</div>

		<div class="card text-center">
			<div class="text-4xl mb-3">🏆</div>
			<h3 class="font-bold text-lg text-white mb-2">Modo Competitivo</h3>
			<p class="text-slate-400 text-sm">Cada jugador adivina su propia palabra. ¡Gana el más rápido!</p>
		</div>

		<div class="card text-center">
			<div class="text-4xl mb-3">📊</div>
			<h3 class="font-bold text-lg text-white mb-2">Puntuación</h3>
			<p class="text-slate-400 text-sm">Sistema de puntos con bonus por velocidad y precisión</p>
		</div>
	</div>

	<!-- Categories Preview -->
	<div class="mt-12 text-center">
		<p class="text-slate-400 mb-4">8 categorías disponibles</p>
		<div class="flex flex-wrap justify-center gap-3">
			{#each ['🐾 Animales', '🌍 Países', '🎬 Películas', '🍕 Comida', '⚽ Deportes', '👨‍⚕️ Profesiones', '💻 Tecnología', '🎲 Mix'] as category}
				<span class="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
					{category}
				</span>
			{/each}
		</div>
	</div>
</main>

<footer class="p-4 text-center text-slate-500 text-sm">
	<p>Hecho con ❤️ usando Svelte + PartyKit</p>
</footer>
