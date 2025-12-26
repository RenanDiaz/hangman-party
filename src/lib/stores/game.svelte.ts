import PartySocket from 'partysocket';
import type {
	GameState,
	GameConfig,
	Player,
	ClientMessage,
	ServerMessage,
	RoundState,
	CompetitivePlayerState
} from '$lib/types/game';

// PartyKit host - update this after deployment
const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || 'localhost:1999';

// Session ID key for localStorage
const SESSION_ID_KEY = 'hangman_party_session_id';

// Generate a unique session ID
function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Get or create a persistent session ID
function getOrCreateSessionId(): string {
	if (typeof localStorage === 'undefined') {
		return generateSessionId();
	}
	let sessionId = localStorage.getItem(SESSION_ID_KEY);
	if (!sessionId) {
		sessionId = generateSessionId();
		localStorage.setItem(SESSION_ID_KEY, sessionId);
	}
	return sessionId;
}

class GameStore {
	// State
	state = $state<GameState | null>(null);
	socket = $state<PartySocket | null>(null);
	playerId = $state<string>('');
	sessionId = $state<string>('');
	isConnected = $state(false);
	isConnecting = $state(false);
	error = $state<string | null>(null);
	lastGuessResult = $state<{ letter: string; correct: boolean; playerId: string } | null>(null);

	// Derived state
	get currentPlayer(): Player | undefined {
		return this.state?.players.find(p => p.id === this.playerId);
	}

	get isHost(): boolean {
		return this.currentPlayer?.isHost ?? false;
	}

	get players(): Player[] {
		return this.state?.players ?? [];
	}

	get config(): GameConfig | undefined {
		return this.state?.config;
	}

	get round(): RoundState | undefined {
		return this.state?.round;
	}

	get competitiveStates(): CompetitivePlayerState[] | undefined {
		return this.state?.competitiveStates;
	}

	get myCompetitiveState(): CompetitivePlayerState | undefined {
		return this.competitiveStates?.find(s => s.playerId === this.playerId);
	}

	get isMyTurn(): boolean {
		if (!this.state || this.state.status !== 'playing') return false;
		if (this.state.config.mode === 'competitive') return true;
		if (this.state.config.mode === 'single') return true;
		if (!this.state.round) return false;
		const currentPlayer = this.state.players[this.state.round.currentPlayerIndex];
		return currentPlayer?.id === this.playerId;
	}

	get currentTurnPlayer(): Player | undefined {
		if (!this.state?.round) return undefined;
		return this.state.players[this.state.round.currentPlayerIndex];
	}

	get usedLetters(): Set<string> {
		if (this.state?.config.mode === 'competitive' && this.myCompetitiveState) {
			return new Set([
				...this.myCompetitiveState.revealedLetters,
				...this.myCompetitiveState.wrongLetters
			]);
		}
		if (this.round) {
			return new Set([...this.round.revealedLetters, ...this.round.wrongLetters]);
		}
		return new Set();
	}

	get correctLetters(): Set<string> {
		if (this.state?.config.mode === 'competitive' && this.myCompetitiveState) {
			return new Set(this.myCompetitiveState.revealedLetters);
		}
		return new Set(this.round?.revealedLetters ?? []);
	}

	get wrongLetters(): Set<string> {
		if (this.state?.config.mode === 'competitive' && this.myCompetitiveState) {
			return new Set(this.myCompetitiveState.wrongLetters);
		}
		return new Set(this.round?.wrongLetters ?? []);
	}

	get wrongGuessCount(): number {
		return this.wrongLetters.size;
	}

	get maxAttempts(): number {
		return this.state?.config.maxAttempts ?? 6;
	}

	get word(): string {
		if (this.state?.config.mode === 'competitive' && this.myCompetitiveState) {
			return this.myCompetitiveState.word;
		}
		return this.round?.word ?? '';
	}

	get roomCode(): string {
		return this.state?.roomCode ?? '';
	}

	// Connection methods
	connect(roomCode: string, playerName: string, avatar: string) {
		if (this.socket) {
			this.socket.close();
		}

		this.isConnecting = true;
		this.error = null;

		// Get or create a persistent session ID
		this.sessionId = getOrCreateSessionId();
		// Use sessionId as playerId for consistent identity across reconnections
		this.playerId = this.sessionId;

		this.socket = new PartySocket({
			host: PARTYKIT_HOST,
			room: roomCode.toLowerCase()
		});

		this.socket.addEventListener('open', () => {
			this.isConnected = true;
			this.isConnecting = false;
			this.send({ type: 'join', payload: { name: playerName, avatar, sessionId: this.sessionId } });
		});

		this.socket.addEventListener('message', (event) => {
			try {
				const message = JSON.parse(event.data) as ServerMessage;
				this.handleMessage(message);
			} catch (e) {
				console.error('Failed to parse message:', e);
			}
		});

		this.socket.addEventListener('close', () => {
			this.isConnected = false;
			this.isConnecting = false;
		});

		this.socket.addEventListener('error', () => {
			this.error = 'Connection error';
			this.isConnected = false;
			this.isConnecting = false;
		});
	}

	disconnect() {
		if (this.socket) {
			this.send({ type: 'leave' });
			this.socket.close();
			this.socket = null;
		}
		this.state = null;
		this.isConnected = false;
		// Note: We don't clear playerId or sessionId to allow reconnection with the same identity
	}

	send(message: ClientMessage) {
		if (this.socket && this.isConnected) {
			this.socket.send(JSON.stringify(message));
		}
	}

	handleMessage(message: ServerMessage) {
		switch (message.type) {
			case 'state_update':
				this.state = message.payload;
				break;
			case 'player_joined':
				// Handled by state_update
				break;
			case 'player_left':
				// Handled by state_update
				break;
			case 'letter_guessed':
				this.lastGuessResult = message.payload;
				setTimeout(() => {
					this.lastGuessResult = null;
				}, 1000);
				break;
			case 'round_ended':
				// Handled by state_update
				break;
			case 'game_ended':
				// Handled by state_update
				break;
			case 'turn_timeout':
				// Could add visual feedback here
				break;
			case 'error':
				this.error = message.payload.message;
				setTimeout(() => {
					this.error = null;
				}, 3000);
				break;
		}
	}

	// Game actions
	updateConfig(config: Partial<GameConfig>) {
		this.send({ type: 'update_config', payload: config });
	}

	startGame() {
		this.send({ type: 'start_game' });
	}

	guessLetter(letter: string) {
		this.send({ type: 'guess_letter', payload: { letter } });
	}

	nextRound() {
		this.send({ type: 'next_round' });
	}

	restartGame() {
		this.send({ type: 'restart_game' });
	}

	kickPlayer(playerId: string) {
		this.send({ type: 'kick_player', payload: { playerId } });
	}
}

// Single player store
class SinglePlayerStore {
	word = $state('');
	category = $state<string>('');
	revealedLetters = $state<string[]>([]);
	wrongLetters = $state<string[]>([]);
	maxAttempts = $state(6);
	score = $state(0);
	roundsPlayed = $state(0);
	roundsWon = $state(0);
	startTime = $state(0);
	gameStatus = $state<'idle' | 'playing' | 'won' | 'lost'>('idle');

	get usedLetters(): Set<string> {
		return new Set([...this.revealedLetters, ...this.wrongLetters]);
	}

	get correctLetters(): Set<string> {
		return new Set(this.revealedLetters);
	}

	get wrongGuessCount(): number {
		return this.wrongLetters.length;
	}

	startGame(word: string, category: string, maxAttempts: number) {
		this.word = word;
		this.category = category;
		this.maxAttempts = maxAttempts;
		this.revealedLetters = [];
		this.wrongLetters = [];
		this.startTime = Date.now();
		this.gameStatus = 'playing';
	}

	guessLetter(letter: string): boolean {
		if (this.gameStatus !== 'playing') return false;

		const normalizedLetter = letter.toUpperCase();
		if (this.usedLetters.has(normalizedLetter)) return false;

		const normalizedWord = this.word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		const isCorrect = normalizedWord.includes(normalizedLetter);

		if (isCorrect) {
			this.revealedLetters = [...this.revealedLetters, normalizedLetter];

			// Check win
			const allRevealed = [...normalizedWord].every(
				char => char === ' ' || this.revealedLetters.includes(char)
			);
			if (allRevealed) {
				this.gameStatus = 'won';
				this.roundsWon++;
				this.roundsPlayed++;
				this.calculateScore();
			}
		} else {
			this.wrongLetters = [...this.wrongLetters, normalizedLetter];

			// Check lose
			if (this.wrongLetters.length >= this.maxAttempts) {
				this.gameStatus = 'lost';
				this.roundsPlayed++;
			}
		}

		return isCorrect;
	}

	calculateScore() {
		const timeMs = Date.now() - this.startTime;
		const wordLength = this.word.replace(/\s/g, '').length;
		const basePoints = wordLength * 10;
		const accuracyBonus = Math.max(0, (this.maxAttempts - this.wrongLetters.length) * 5);
		const speedBonus = Math.max(0, Math.floor((60000 - timeMs) / 1000));

		this.score += basePoints + accuracyBonus + speedBonus;
	}

	reset() {
		this.word = '';
		this.category = '';
		this.revealedLetters = [];
		this.wrongLetters = [];
		this.gameStatus = 'idle';
	}

	fullReset() {
		this.reset();
		this.score = 0;
		this.roundsPlayed = 0;
		this.roundsWon = 0;
	}
}

// Export singleton instances
export const gameStore = new GameStore();
export const singlePlayerStore = new SinglePlayerStore();
