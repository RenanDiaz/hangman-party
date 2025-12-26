// Game mode types
export type GameMode = 'single' | 'team' | 'competitive';

// Word categories
export type Category =
	| 'animales'
	| 'paises'
	| 'peliculas'
	| 'comida'
	| 'deportes'
	| 'profesiones'
	| 'tecnologia'
	| 'mix';

// Difficulty levels based on word length
export type Difficulty = 'facil' | 'medio' | 'dificil';

// Letter states for keyboard
export type LetterState = 'available' | 'correct' | 'incorrect' | 'disabled';

// Game states
export type GameStatus = 'lobby' | 'configuring' | 'playing' | 'between_rounds' | 'finished';

// Player interface
export interface Player {
	id: string;
	name: string;
	avatar: string;
	score: number;
	isHost: boolean;
	isConnected: boolean;
	// For competitive mode
	currentWord?: string;
	revealedLetters?: string[];
	wrongGuesses?: number;
	hasWon?: boolean;
	hasLost?: boolean;
	finishTime?: number;
}

// Game configuration
export interface GameConfig {
	mode: GameMode;
	category: Category;
	difficulty: Difficulty;
	maxAttempts: 6 | 8 | 10;
	rounds: 1 | 3 | 5;
	turnTimeLimit: number | null; // seconds, null = no limit
}

// Round state
export interface RoundState {
	roundNumber: number;
	word: string;
	category: Category;
	revealedLetters: string[];
	wrongLetters: string[];
	currentPlayerIndex: number;
	startTime: number;
	turnStartTime: number | null;
}

// Competitive player state (for competitive mode)
export interface CompetitivePlayerState {
	playerId: string;
	word: string;
	revealedLetters: string[];
	wrongLetters: string[];
	hasWon: boolean;
	hasLost: boolean;
	finishTime: number | null;
}

// Full game state
export interface GameState {
	roomCode: string;
	status: GameStatus;
	config: GameConfig;
	players: Player[];
	hostId: string;

	// Team mode state
	round?: RoundState;

	// Competitive mode state
	competitiveStates?: CompetitivePlayerState[];

	// Scoring
	scores: Record<string, number>;

	// Round tracking
	currentRound: number;
	roundWinners: string[];
}

// Message types for PartyKit
export type ClientMessage =
	| { type: 'join'; payload: { name: string; avatar: string; sessionId: string } }
	| { type: 'leave' }
	| { type: 'update_config'; payload: Partial<GameConfig> }
	| { type: 'start_game' }
	| { type: 'guess_letter'; payload: { letter: string } }
	| { type: 'next_round' }
	| { type: 'restart_game' }
	| { type: 'kick_player'; payload: { playerId: string } };

export type ServerMessage =
	| { type: 'state_update'; payload: GameState }
	| { type: 'player_joined'; payload: Player }
	| { type: 'player_left'; payload: { playerId: string } }
	| { type: 'letter_guessed'; payload: { playerId: string; letter: string; correct: boolean } }
	| { type: 'round_ended'; payload: { winner: string | null; word: string } }
	| { type: 'game_ended'; payload: { winner: string; scores: Record<string, number> } }
	| { type: 'turn_timeout'; payload: { playerId: string } }
	| { type: 'error'; payload: { message: string } };

// Difficulty ranges
export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
	facil: { min: 4, max: 6 },
	medio: { min: 7, max: 10 },
	dificil: { min: 11, max: 20 }
};

// Score calculation
export interface ScoreCalculation {
	basePoints: number;
	speedBonus: number;
	accuracyBonus: number;
	penaltyPoints: number;
	total: number;
}

// Avatar options
export const AVATARS = [
	'😀', '😎', '🤓', '🥳', '😈', '👻', '🤖', '👽',
	'🦊', '🐱', '🐶', '🦁', '🐼', '🦄', '🐲', '🦋'
];

// Default game config
export const DEFAULT_CONFIG: GameConfig = {
	mode: 'team',
	category: 'mix',
	difficulty: 'medio',
	maxAttempts: 6,
	rounds: 3,
	turnTimeLimit: null
};
