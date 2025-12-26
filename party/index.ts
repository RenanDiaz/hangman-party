import type * as Party from 'partykit/server';

// Types (duplicated to avoid import issues in PartyKit)
type GameMode = 'single' | 'team' | 'competitive';
type Category = 'animales' | 'paises' | 'peliculas' | 'comida' | 'deportes' | 'profesiones' | 'tecnologia' | 'mix';
type Difficulty = 'facil' | 'medio' | 'dificil';
type GameStatus = 'lobby' | 'configuring' | 'playing' | 'between_rounds' | 'finished';

interface Player {
	id: string;
	name: string;
	avatar: string;
	score: number;
	isHost: boolean;
	isConnected: boolean;
}

interface GameConfig {
	mode: GameMode;
	category: Category;
	difficulty: Difficulty;
	maxAttempts: 6 | 8 | 10;
	rounds: 1 | 3 | 5;
	turnTimeLimit: number | null;
}

interface RoundState {
	roundNumber: number;
	word: string;
	category: Category;
	revealedLetters: string[];
	wrongLetters: string[];
	currentPlayerIndex: number;
	startTime: number;
	turnStartTime: number | null;
}

interface CompetitivePlayerState {
	playerId: string;
	word: string;
	revealedLetters: string[];
	wrongLetters: string[];
	hasWon: boolean;
	hasLost: boolean;
	finishTime: number | null;
}

interface GameState {
	roomCode: string;
	status: GameStatus;
	config: GameConfig;
	players: Player[];
	hostId: string;
	round?: RoundState;
	competitiveStates?: CompetitivePlayerState[];
	scores: Record<string, number>;
	currentRound: number;
	roundWinners: string[];
}

// Word database (simplified for PartyKit server)
const WORDS: Record<Exclude<Category, 'mix'>, string[]> = {
	animales: [
		'gato', 'perro', 'leon', 'oso', 'pato', 'tigre', 'zorro', 'cebra', 'koala', 'mono',
		'elefante', 'jirafa', 'cocodrilo', 'delfin', 'ballena', 'tiburon', 'tortuga', 'conejo',
		'caballo', 'serpiente', 'rinoceronte', 'hipopotamo', 'ornitorrinco', 'chimpance'
	],
	paises: [
		'peru', 'cuba', 'chile', 'china', 'india', 'japon', 'mexico', 'brasil', 'espana', 'francia',
		'alemania', 'italia', 'portugal', 'colombia', 'argentina', 'venezuela', 'ecuador', 'bolivia',
		'canada', 'australia'
	],
	peliculas: [
		'coco', 'cars', 'brave', 'shrek', 'rocky', 'alien', 'logan', 'titanic', 'avatar', 'frozen',
		'moana', 'encanto', 'gladiator', 'inception', 'joker', 'matrix', 'venom', 'batman', 'aladdin',
		'hercules', 'interestelar', 'terminator'
	],
	comida: [
		'pizza', 'taco', 'sopa', 'pan', 'arroz', 'pasta', 'pollo', 'carne', 'queso', 'huevo',
		'hamburguesa', 'ensalada', 'burrito', 'enchilada', 'paella', 'ceviche', 'empanada', 'nachos',
		'guacamole', 'lasagna', 'tiramisu'
	],
	deportes: [
		'futbol', 'tenis', 'golf', 'boxeo', 'surf', 'rugby', 'judo', 'yoga', 'natacion', 'atletismo',
		'ciclismo', 'gimnasia', 'karate', 'taekwondo', 'balonmano', 'snowboard', 'patinaje',
		'baloncesto', 'automovilismo'
	],
	profesiones: [
		'chef', 'piloto', 'actor', 'juez', 'medico', 'abogado', 'maestro', 'ingeniero', 'arquitecto',
		'enfermero', 'bombero', 'policia', 'carpintero', 'electricista', 'programador', 'veterinario',
		'psicologo', 'cirujano'
	],
	tecnologia: [
		'app', 'web', 'wifi', 'mouse', 'laptop', 'tablet', 'drone', 'robot', 'chip', 'software',
		'hardware', 'internet', 'servidor', 'algoritmo', 'programa', 'navegador', 'antivirus',
		'blockchain', 'computadora', 'programacion'
	]
};

const CATEGORIES = Object.keys(WORDS) as Exclude<Category, 'mix'>[];

const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
	facil: { min: 4, max: 6 },
	medio: { min: 7, max: 10 },
	dificil: { min: 11, max: 20 }
};

function getRandomWord(category: Category, difficulty: Difficulty): { word: string; category: Exclude<Category, 'mix'> } {
	const range = DIFFICULTY_RANGES[difficulty];
	let selectedCategory: Exclude<Category, 'mix'>;

	if (category === 'mix') {
		selectedCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
	} else {
		selectedCategory = category;
	}

	let wordPool = WORDS[selectedCategory].filter(word => {
		const cleanWord = word.replace(/\s/g, '');
		return cleanWord.length >= range.min && cleanWord.length <= range.max;
	});

	if (wordPool.length === 0) {
		wordPool = WORDS[selectedCategory];
	}

	const word = wordPool[Math.floor(Math.random() * wordPool.length)];
	return { word: word.toUpperCase(), category: selectedCategory };
}

function getUniqueWords(category: Category, difficulty: Difficulty, count: number): Array<{ word: string; category: Exclude<Category, 'mix'> }> {
	const range = DIFFICULTY_RANGES[difficulty];
	const usedWords = new Set<string>();
	const results: Array<{ word: string; category: Exclude<Category, 'mix'> }> = [];

	let allWords: Array<{ word: string; category: Exclude<Category, 'mix'> }> = [];

	if (category === 'mix') {
		for (const cat of CATEGORIES) {
			const words = WORDS[cat]
				.filter(word => {
					const cleanWord = word.replace(/\s/g, '');
					return cleanWord.length >= range.min && cleanWord.length <= range.max;
				})
				.map(word => ({ word: word.toUpperCase(), category: cat }));
			allWords.push(...words);
		}
	} else {
		allWords = WORDS[category]
			.filter(word => {
				const cleanWord = word.replace(/\s/g, '');
				return cleanWord.length >= range.min && cleanWord.length <= range.max;
			})
			.map(word => ({ word: word.toUpperCase(), category }));
	}

	allWords.sort(() => Math.random() - 0.5);

	for (const wordData of allWords) {
		if (results.length >= count) break;
		if (!usedWords.has(wordData.word)) {
			usedWords.add(wordData.word);
			results.push(wordData);
		}
	}

	while (results.length < count && allWords.length > 0) {
		const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
		results.push(randomWord);
	}

	return results;
}

function calculateScore(
	won: boolean,
	wrongGuesses: number,
	maxAttempts: number,
	timeMs: number,
	wordLength: number
): number {
	if (!won) return 0;

	const basePoints = wordLength * 10;
	const accuracyBonus = Math.max(0, (maxAttempts - wrongGuesses) * 5);
	const speedBonus = Math.max(0, Math.floor((60000 - timeMs) / 1000)); // Bonus for finishing under 60 seconds

	return basePoints + accuracyBonus + speedBonus;
}

function normalizeWord(word: string): string {
	return word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default class HangmanParty implements Party.Server {
	state: GameState;
	turnTimer: ReturnType<typeof setTimeout> | null = null;
	// Map sessionId -> connectionId for sending messages to the right connection
	sessionToConnection: Map<string, string> = new Map();

	constructor(readonly room: Party.Room) {
		this.state = this.getInitialState();
	}

	getInitialState(): GameState {
		return {
			roomCode: this.room.id,
			status: 'lobby',
			config: {
				mode: 'team',
				category: 'mix',
				difficulty: 'medio',
				maxAttempts: 6,
				rounds: 3,
				turnTimeLimit: null
			},
			players: [],
			hostId: '',
			scores: {},
			currentRound: 0,
			roundWinners: []
		};
	}

	async onStart() {
		const stored = await this.room.storage.get<GameState>('state');
		if (stored) {
			this.state = stored;
		}
	}

	async saveState() {
		await this.room.storage.put('state', this.state);
	}

	broadcast(message: unknown) {
		this.room.broadcast(JSON.stringify(message));
	}

	sendTo(playerId: string, message: unknown) {
		// playerId is the sessionId, so we need to find the actual connection
		const connectionId = this.sessionToConnection.get(playerId) || playerId;
		const conn = [...this.room.getConnections()].find(c => c.id === connectionId);
		if (conn) {
			conn.send(JSON.stringify(message));
		}
	}

	// Helper to get sessionId from connection
	getSessionId(conn: Party.Connection): string | null {
		for (const [sid, cid] of this.sessionToConnection.entries()) {
			if (cid === conn.id) {
				return sid;
			}
		}
		return null;
	}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// Send current state to new connection
		conn.send(JSON.stringify({ type: 'state_update', payload: this.state }));
	}

	onClose(conn: Party.Connection) {
		// Find the sessionId for this connection
		let sessionId: string | null = null;
		for (const [sid, cid] of this.sessionToConnection.entries()) {
			if (cid === conn.id) {
				sessionId = sid;
				break;
			}
		}

		const player = sessionId ? this.state.players.find(p => p.id === sessionId) : null;
		if (player) {
			player.isConnected = false;
			// Remove the connection mapping (will be re-added on reconnect)
			if (sessionId) {
				this.sessionToConnection.delete(sessionId);
			}

			// If all players disconnected, reset game after a timeout
			const connectedPlayers = this.state.players.filter(p => p.isConnected);
			if (connectedPlayers.length === 0 && this.state.status !== 'lobby') {
				// Reset after 5 minutes
				setTimeout(() => {
					const stillConnected = this.state.players.filter(p => p.isConnected);
					if (stillConnected.length === 0) {
						this.state = this.getInitialState();
						this.saveState();
					}
				}, 5 * 60 * 1000);
			}

			// Note: We do NOT transfer host when player disconnects temporarily
			// The host will be restored when they reconnect
			// Only transfer if the player explicitly leaves (handleLeave)

			this.broadcast({ type: 'player_left', payload: { playerId: player.id } });
			this.broadcast({ type: 'state_update', payload: this.state });
			this.saveState();
		}
	}

	onMessage(message: string, sender: Party.Connection) {
		try {
			const msg = JSON.parse(message);
			this.handleMessage(msg, sender);
		} catch (e) {
			console.error('Failed to parse message:', e);
		}
	}

	handleMessage(msg: { type: string; payload?: unknown }, sender: Party.Connection) {
		switch (msg.type) {
			case 'join':
				this.handleJoin(msg.payload as { name: string; avatar: string }, sender);
				break;
			case 'leave':
				this.handleLeave(sender);
				break;
			case 'update_config':
				this.handleUpdateConfig(msg.payload as Partial<GameConfig>, sender);
				break;
			case 'start_game':
				this.handleStartGame(sender);
				break;
			case 'guess_letter':
				this.handleGuessLetter((msg.payload as { letter: string }).letter, sender);
				break;
			case 'next_round':
				this.handleNextRound(sender);
				break;
			case 'restart_game':
				this.handleRestartGame(sender);
				break;
			case 'kick_player':
				this.handleKickPlayer((msg.payload as { playerId: string }).playerId, sender);
				break;
		}
	}

	handleJoin(payload: { name: string; avatar: string; sessionId: string }, sender: Party.Connection) {
		const sessionId = payload.sessionId;

		// Update the session -> connection mapping
		this.sessionToConnection.set(sessionId, sender.id);

		// Check if player already exists (reconnection) using sessionId
		const existingPlayer = this.state.players.find(p => p.id === sessionId);
		if (existingPlayer) {
			// Reconnection - restore the player
			existingPlayer.isConnected = true;
			existingPlayer.name = payload.name;
			existingPlayer.avatar = payload.avatar;

			// If this player was the host and no one else is host, restore their host status
			if (this.state.hostId === sessionId) {
				existingPlayer.isHost = true;
				// Remove host from any other player who might have been temporarily assigned
				for (const p of this.state.players) {
					if (p.id !== sessionId && p.isHost) {
						p.isHost = false;
					}
				}
			}
		} else {
			// New player
			const isHost = this.state.players.length === 0;
			const newPlayer: Player = {
				id: sessionId,
				name: payload.name,
				avatar: payload.avatar,
				score: 0,
				isHost,
				isConnected: true
			};
			this.state.players.push(newPlayer);
			this.state.scores[sessionId] = 0;

			if (isHost) {
				this.state.hostId = sessionId;
			}

			this.broadcast({ type: 'player_joined', payload: newPlayer });
		}

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleLeave(sender: Party.Connection) {
		// Find the sessionId for this connection
		let sessionId: string | null = null;
		for (const [sid, cid] of this.sessionToConnection.entries()) {
			if (cid === sender.id) {
				sessionId = sid;
				break;
			}
		}

		if (!sessionId) return;

		const playerIndex = this.state.players.findIndex(p => p.id === sessionId);
		if (playerIndex !== -1) {
			const player = this.state.players[playerIndex];
			this.state.players.splice(playerIndex, 1);
			delete this.state.scores[sessionId];
			this.sessionToConnection.delete(sessionId);

			// Transfer host if needed
			if (player.isHost && this.state.players.length > 0) {
				this.state.players[0].isHost = true;
				this.state.hostId = this.state.players[0].id;
			}

			// Reset game if not enough players
			if (this.state.players.length < 2 && this.state.config.mode !== 'single') {
				this.state.status = 'lobby';
			}

			this.broadcast({ type: 'player_left', payload: { playerId: sessionId } });
			this.broadcast({ type: 'state_update', payload: this.state });
			this.saveState();
		}
	}

	handleUpdateConfig(config: Partial<GameConfig>, sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		const player = this.state.players.find(p => p.id === sessionId);
		if (!player?.isHost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Only host can update config' } });
			return;
		}

		if (this.state.status !== 'lobby' && this.state.status !== 'configuring') {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Cannot update config during game' } });
			return;
		}

		this.state.config = { ...this.state.config, ...config };
		this.state.status = 'configuring';
		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleStartGame(sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		const player = this.state.players.find(p => p.id === sessionId);
		if (!player?.isHost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Only host can start the game' } });
			return;
		}

		// Validate player count for multiplayer modes
		if (this.state.config.mode !== 'single' && this.state.players.length < 2) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Need at least 2 players for multiplayer' } });
			return;
		}

		// Reset scores
		for (const p of this.state.players) {
			this.state.scores[p.id] = 0;
			p.score = 0;
		}

		this.state.currentRound = 1;
		this.state.roundWinners = [];
		this.startRound();
	}

	startRound() {
		this.state.status = 'playing';

		if (this.state.config.mode === 'competitive') {
			// Each player gets their own word
			const words = getUniqueWords(
				this.state.config.category,
				this.state.config.difficulty,
				this.state.players.length
			);

			this.state.competitiveStates = this.state.players.map((player, index) => ({
				playerId: player.id,
				word: words[index].word,
				revealedLetters: [],
				wrongLetters: [],
				hasWon: false,
				hasLost: false,
				finishTime: null
			}));

			delete this.state.round;
		} else {
			// Team mode (and single player) - shared word
			const wordData = getRandomWord(this.state.config.category, this.state.config.difficulty);

			this.state.round = {
				roundNumber: this.state.currentRound,
				word: wordData.word,
				category: wordData.category,
				revealedLetters: [],
				wrongLetters: [],
				currentPlayerIndex: 0,
				startTime: Date.now(),
				turnStartTime: this.state.config.turnTimeLimit ? Date.now() : null
			};

			delete this.state.competitiveStates;

			// Start turn timer if configured
			this.startTurnTimer();
		}

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	startTurnTimer() {
		if (this.turnTimer) {
			clearTimeout(this.turnTimer);
			this.turnTimer = null;
		}

		if (this.state.config.turnTimeLimit && this.state.round) {
			this.state.round.turnStartTime = Date.now();
			this.turnTimer = setTimeout(() => {
				this.handleTurnTimeout();
			}, this.state.config.turnTimeLimit * 1000);
		}
	}

	handleTurnTimeout() {
		if (!this.state.round || this.state.status !== 'playing') return;

		const currentPlayer = this.state.players[this.state.round.currentPlayerIndex];
		if (currentPlayer) {
			this.broadcast({ type: 'turn_timeout', payload: { playerId: currentPlayer.id } });
		}

		// Move to next player
		this.state.round.currentPlayerIndex = (this.state.round.currentPlayerIndex + 1) % this.state.players.length;
		this.startTurnTimer();
		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleGuessLetter(letter: string, sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		if (this.state.status !== 'playing') {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Game is not in progress' } });
			return;
		}

		const normalizedLetter = letter.toUpperCase();

		if (this.state.config.mode === 'competitive') {
			this.handleCompetitiveGuess(normalizedLetter, sessionId);
		} else {
			this.handleTeamGuess(normalizedLetter, sessionId);
		}
	}

	handleTeamGuess(letter: string, sessionId: string) {
		if (!this.state.round) return;

		// In team mode, check if it's this player's turn
		if (this.state.config.mode === 'team') {
			const currentPlayer = this.state.players[this.state.round.currentPlayerIndex];
			if (currentPlayer?.id !== sessionId) {
				this.sendTo(sessionId, { type: 'error', payload: { message: 'Not your turn' } });
				return;
			}
		}

		// Check if letter already guessed
		if (this.state.round.revealedLetters.includes(letter) || this.state.round.wrongLetters.includes(letter)) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Letter already guessed' } });
			return;
		}

		const normalizedWord = normalizeWord(this.state.round.word);
		const isCorrect = normalizedWord.includes(letter);

		if (isCorrect) {
			this.state.round.revealedLetters.push(letter);
		} else {
			this.state.round.wrongLetters.push(letter);
		}

		this.broadcast({
			type: 'letter_guessed',
			payload: { playerId: sessionId, letter, correct: isCorrect }
		});

		// Check win/lose conditions
		const allLettersRevealed = [...normalizedWord].every(
			char => char === ' ' || this.state.round!.revealedLetters.includes(char)
		);

		if (allLettersRevealed) {
			// Round won!
			const timeMs = Date.now() - this.state.round.startTime;
			const score = calculateScore(
				true,
				this.state.round.wrongLetters.length,
				this.state.config.maxAttempts,
				timeMs,
				this.state.round.word.replace(/\s/g, '').length
			);

			// Add score to player who completed it (or all players in team mode)
			if (this.state.config.mode === 'team') {
				for (const p of this.state.players) {
					this.state.scores[p.id] += Math.floor(score / this.state.players.length);
					p.score = this.state.scores[p.id];
				}
			} else {
				this.state.scores[sessionId] += score;
				const player = this.state.players.find(p => p.id === sessionId);
				if (player) player.score = this.state.scores[sessionId];
			}

			this.state.roundWinners.push(sessionId);
			this.endRound(sessionId);
		} else if (this.state.round.wrongLetters.length >= this.state.config.maxAttempts) {
			// Round lost
			this.endRound(null);
		} else {
			// Move to next player in team mode
			if (this.state.config.mode === 'team') {
				this.state.round.currentPlayerIndex = (this.state.round.currentPlayerIndex + 1) % this.state.players.length;
				this.startTurnTimer();
			}
		}

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleCompetitiveGuess(letter: string, sessionId: string) {
		if (!this.state.competitiveStates) return;

		const playerState = this.state.competitiveStates.find(s => s.playerId === sessionId);
		if (!playerState) return;

		// Check if player already finished
		if (playerState.hasWon || playerState.hasLost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'You have already finished this round' } });
			return;
		}

		// Check if letter already guessed
		if (playerState.revealedLetters.includes(letter) || playerState.wrongLetters.includes(letter)) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Letter already guessed' } });
			return;
		}

		const normalizedWord = normalizeWord(playerState.word);
		const isCorrect = normalizedWord.includes(letter);

		if (isCorrect) {
			playerState.revealedLetters.push(letter);
		} else {
			playerState.wrongLetters.push(letter);
		}

		this.broadcast({
			type: 'letter_guessed',
			payload: { playerId: sessionId, letter, correct: isCorrect }
		});

		// Check win/lose for this player
		const allLettersRevealed = [...normalizedWord].every(
			char => char === ' ' || playerState.revealedLetters.includes(char)
		);

		if (allLettersRevealed) {
			playerState.hasWon = true;
			playerState.finishTime = Date.now();

			// Calculate and add score
			const score = calculateScore(
				true,
				playerState.wrongLetters.length,
				this.state.config.maxAttempts,
				playerState.finishTime - (this.state.round?.startTime || Date.now()),
				playerState.word.replace(/\s/g, '').length
			);
			this.state.scores[sessionId] += score;
			const player = this.state.players.find(p => p.id === sessionId);
			if (player) player.score = this.state.scores[sessionId];
		} else if (playerState.wrongLetters.length >= this.state.config.maxAttempts) {
			playerState.hasLost = true;
			playerState.finishTime = Date.now();
		}

		// Check if all players finished
		const allFinished = this.state.competitiveStates.every(s => s.hasWon || s.hasLost);
		if (allFinished) {
			// Find first winner (by finish time)
			const winners = this.state.competitiveStates
				.filter(s => s.hasWon)
				.sort((a, b) => (a.finishTime || 0) - (b.finishTime || 0));

			const winnerId = winners[0]?.playerId || null;
			if (winnerId) {
				this.state.roundWinners.push(winnerId);
			}
			this.endRound(winnerId);
		}

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	endRound(winnerId: string | null) {
		if (this.turnTimer) {
			clearTimeout(this.turnTimer);
			this.turnTimer = null;
		}

		const word = this.state.round?.word ||
			this.state.competitiveStates?.[0]?.word || '';

		this.broadcast({
			type: 'round_ended',
			payload: { winner: winnerId, word }
		});

		// Check if game is over
		if (this.state.currentRound >= this.state.config.rounds) {
			this.endGame();
		} else {
			this.state.status = 'between_rounds';
		}

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleNextRound(sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		const player = this.state.players.find(p => p.id === sessionId);
		if (!player?.isHost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Only host can start next round' } });
			return;
		}

		if (this.state.status !== 'between_rounds') {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Cannot start next round now' } });
			return;
		}

		this.state.currentRound++;
		this.startRound();
	}

	endGame() {
		this.state.status = 'finished';

		// Find overall winner
		let maxScore = -1;
		let winnerId = '';
		for (const [playerId, score] of Object.entries(this.state.scores)) {
			if (score > maxScore) {
				maxScore = score;
				winnerId = playerId;
			}
		}

		this.broadcast({
			type: 'game_ended',
			payload: { winner: winnerId, scores: this.state.scores }
		});
	}

	handleRestartGame(sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		const player = this.state.players.find(p => p.id === sessionId);
		if (!player?.isHost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Only host can restart the game' } });
			return;
		}

		// Reset scores
		for (const p of this.state.players) {
			this.state.scores[p.id] = 0;
			p.score = 0;
		}

		this.state.status = 'lobby';
		this.state.currentRound = 0;
		this.state.roundWinners = [];
		delete this.state.round;
		delete this.state.competitiveStates;

		this.broadcast({ type: 'state_update', payload: this.state });
		this.saveState();
	}

	handleKickPlayer(playerId: string, sender: Party.Connection) {
		const sessionId = this.getSessionId(sender);
		if (!sessionId) return;

		const player = this.state.players.find(p => p.id === sessionId);
		if (!player?.isHost) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Only host can kick players' } });
			return;
		}

		if (playerId === sessionId) {
			this.sendTo(sessionId, { type: 'error', payload: { message: 'Cannot kick yourself' } });
			return;
		}

		const playerIndex = this.state.players.findIndex(p => p.id === playerId);
		if (playerIndex !== -1) {
			this.state.players.splice(playerIndex, 1);
			delete this.state.scores[playerId];

			this.broadcast({ type: 'player_left', payload: { playerId } });
			this.broadcast({ type: 'state_update', payload: this.state });
			this.saveState();
		}
	}
}
