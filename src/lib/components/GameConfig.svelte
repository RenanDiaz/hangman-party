<script lang="ts">
	import type { GameConfig, GameMode, Category, Difficulty } from '$lib/types/game';
	import { CATEGORY_NAMES, DIFFICULTY_NAMES } from '$lib/data/words';

	interface Props {
		config: GameConfig;
		isHost: boolean;
		playerCount: number;
		onConfigChange: (config: Partial<GameConfig>) => void;
		onStartGame: () => void;
	}

	let { config, isHost, playerCount, onConfigChange, onStartGame }: Props = $props();

	const MODES: { value: GameMode; label: string; description: string; minPlayers: number }[] = [
		{ value: 'single', label: '🎮 Un Jugador', description: 'Juega solo contra la computadora', minPlayers: 1 },
		{ value: 'team', label: '👥 Equipo', description: 'Todos colaboran para adivinar la palabra', minPlayers: 2 },
		{ value: 'competitive', label: '🏆 Competitivo', description: 'Cada jugador adivina su propia palabra', minPlayers: 2 }
	];

	const CATEGORIES = Object.entries(CATEGORY_NAMES) as [Category, string][];
	const DIFFICULTIES = Object.entries(DIFFICULTY_NAMES) as [Difficulty, string][];

	const canStart = $derived(() => {
		const mode = MODES.find(m => m.value === config.mode);
		return playerCount >= (mode?.minPlayers ?? 1);
	});

	const handleModeChange = (mode: GameMode) => {
		onConfigChange({ mode });
	};
</script>

<div class="game-config space-y-6">
	<!-- Game Mode -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Modo de Juego</h3>
		<div class="grid gap-3">
			{#each MODES as mode}
				<button
					type="button"
					class="mode-card p-4 rounded-xl text-left transition-all
						{config.mode === mode.value
							? 'bg-blue-500/20 border-2 border-blue-500'
							: 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'}
						{!isHost ? 'cursor-default' : ''}"
					onclick={() => isHost && handleModeChange(mode.value)}
					disabled={!isHost}
				>
					<div class="flex items-center justify-between">
						<div>
							<div class="font-semibold text-white">{mode.label}</div>
							<div class="text-sm text-slate-400">{mode.description}</div>
						</div>
						{#if config.mode === mode.value}
							<div class="text-blue-400 text-xl">✓</div>
						{/if}
					</div>
					{#if playerCount < mode.minPlayers}
						<div class="text-xs text-amber-400 mt-2">
							Necesitas {mode.minPlayers} jugador{mode.minPlayers > 1 ? 'es' : ''} mínimo
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Category -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Categoría</h3>
		<select
			class="select"
			value={config.category}
			onchange={(e) => isHost && onConfigChange({ category: e.currentTarget.value as Category })}
			disabled={!isHost}
		>
			{#each CATEGORIES as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>

	<!-- Difficulty -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Dificultad</h3>
		<select
			class="select"
			value={config.difficulty}
			onchange={(e) => isHost && onConfigChange({ difficulty: e.currentTarget.value as Difficulty })}
			disabled={!isHost}
		>
			{#each DIFFICULTIES as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>

	<!-- Max Attempts -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Intentos Máximos</h3>
		<div class="flex gap-3">
			{#each [6, 8, 10] as attempts}
				<button
					type="button"
					class="flex-1 py-3 rounded-xl font-semibold transition-all
						{config.maxAttempts === attempts
							? 'bg-blue-500 text-white'
							: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
						{!isHost ? 'cursor-default' : ''}"
					onclick={() => isHost && onConfigChange({ maxAttempts: attempts as 6 | 8 | 10 })}
					disabled={!isHost}
				>
					{attempts}
				</button>
			{/each}
		</div>
	</div>

	<!-- Rounds -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Rondas</h3>
		<div class="flex gap-3">
			{#each [1, 3, 5] as rounds}
				<button
					type="button"
					class="flex-1 py-3 rounded-xl font-semibold transition-all
						{config.rounds === rounds
							? 'bg-blue-500 text-white'
							: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
						{!isHost ? 'cursor-default' : ''}"
					onclick={() => isHost && onConfigChange({ rounds: rounds as 1 | 3 | 5 })}
					disabled={!isHost}
				>
					{rounds}
				</button>
			{/each}
		</div>
	</div>

	<!-- Turn Time Limit -->
	<div class="config-section">
		<h3 class="text-lg font-semibold text-white mb-3">Tiempo por Turno</h3>
		<div class="flex gap-3 flex-wrap">
			{#each [null, 30, 45, 60] as time}
				<button
					type="button"
					class="flex-1 min-w-[80px] py-3 rounded-xl font-semibold transition-all
						{config.turnTimeLimit === time
							? 'bg-blue-500 text-white'
							: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
						{!isHost ? 'cursor-default' : ''}"
					onclick={() => isHost && onConfigChange({ turnTimeLimit: time })}
					disabled={!isHost}
				>
					{time === null ? '∞' : `${time}s`}
				</button>
			{/each}
		</div>
	</div>

	<!-- Start Button -->
	{#if isHost}
		<button
			type="button"
			class="btn btn-success w-full text-lg py-4"
			onclick={onStartGame}
			disabled={!canStart()}
		>
			{#if canStart()}
				🚀 Iniciar Partida
			{:else}
				Esperando más jugadores...
			{/if}
		</button>
	{:else}
		<div class="text-center text-slate-400 py-4">
			Esperando a que el host inicie la partida...
		</div>
	{/if}
</div>
