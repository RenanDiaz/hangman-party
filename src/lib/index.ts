// Re-export components
export { default as HangmanFigure } from './components/HangmanFigure.svelte';
export { default as WordDisplay } from './components/WordDisplay.svelte';
export { default as Keyboard } from './components/Keyboard.svelte';
export { default as PlayerList } from './components/PlayerList.svelte';
export { default as GameConfig } from './components/GameConfig.svelte';
export { default as Scoreboard } from './components/Scoreboard.svelte';
export { default as TurnTimer } from './components/TurnTimer.svelte';

// Re-export stores
export { gameStore, singlePlayerStore } from './stores/game.svelte';

// Re-export types
export * from './types/game';

// Re-export data
export * from './data/words';
