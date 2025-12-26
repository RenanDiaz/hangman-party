// Sound Manager using Web Audio API for synthetic sounds
// No external audio files needed - generates sounds programmatically

type SoundType = 'correct' | 'wrong' | 'win' | 'lose' | 'turnChange' | 'tick' | 'keyPress' | 'gameStart';

// Sound settings store key
const SOUND_SETTINGS_KEY = 'hangman_party_sound_settings';

interface SoundSettings {
	enabled: boolean;
	volume: number; // 0-1
}

function getDefaultSettings(): SoundSettings {
	return { enabled: true, volume: 0.5 };
}

function loadSettings(): SoundSettings {
	if (typeof localStorage === 'undefined') {
		return getDefaultSettings();
	}
	try {
		const saved = localStorage.getItem(SOUND_SETTINGS_KEY);
		if (saved) {
			return JSON.parse(saved);
		}
	} catch {
		// Ignore parse errors
	}
	return getDefaultSettings();
}

function saveSettings(settings: SoundSettings) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
	} catch {
		// Ignore storage errors
	}
}

class SoundManager {
	private audioContext: AudioContext | null = null;
	enabled = $state(true);
	volume = $state(0.5);

	constructor() {
		const settings = loadSettings();
		this.enabled = settings.enabled;
		this.volume = settings.volume;
	}

	private getContext(): AudioContext | null {
		if (typeof window === 'undefined') return null;

		if (!this.audioContext) {
			try {
				this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
			} catch {
				console.warn('Web Audio API not supported');
				return null;
			}
		}

		// Resume context if suspended (required for autoplay policies)
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		return this.audioContext;
	}

	toggle() {
		this.enabled = !this.enabled;
		saveSettings({ enabled: this.enabled, volume: this.volume });
	}

	setVolume(value: number) {
		this.volume = Math.max(0, Math.min(1, value));
		saveSettings({ enabled: this.enabled, volume: this.volume });
	}

	play(type: SoundType) {
		if (!this.enabled) return;

		const ctx = this.getContext();
		if (!ctx) return;

		const masterGain = ctx.createGain();
		masterGain.gain.value = this.volume;
		masterGain.connect(ctx.destination);

		switch (type) {
			case 'correct':
				this.playCorrect(ctx, masterGain);
				break;
			case 'wrong':
				this.playWrong(ctx, masterGain);
				break;
			case 'win':
				this.playWin(ctx, masterGain);
				break;
			case 'lose':
				this.playLose(ctx, masterGain);
				break;
			case 'turnChange':
				this.playTurnChange(ctx, masterGain);
				break;
			case 'tick':
				this.playTick(ctx, masterGain);
				break;
			case 'keyPress':
				this.playKeyPress(ctx, masterGain);
				break;
			case 'gameStart':
				this.playGameStart(ctx, masterGain);
				break;
		}
	}

	// Pleasant ascending chime for correct guess
	private playCorrect(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		// Two-note ascending chime
		[523.25, 659.25].forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'sine';
			osc.frequency.value = freq;

			gain.gain.setValueAtTime(0, now + i * 0.1);
			gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

			osc.connect(gain);
			gain.connect(output);

			osc.start(now + i * 0.1);
			osc.stop(now + i * 0.1 + 0.3);
		});
	}

	// Descending buzz for wrong guess
	private playWrong(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sawtooth';
		osc.frequency.setValueAtTime(200, now);
		osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

		gain.gain.setValueAtTime(0.15, now);
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

		osc.connect(gain);
		gain.connect(output);

		osc.start(now);
		osc.stop(now + 0.25);
	}

	// Victory fanfare
	private playWin(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		// Triumphant ascending arpeggio
		const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

		notes.forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'triangle';
			osc.frequency.value = freq;

			const startTime = now + i * 0.12;
			gain.gain.setValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
			gain.gain.setValueAtTime(0.25, startTime + 0.15);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

			osc.connect(gain);
			gain.connect(output);

			osc.start(startTime);
			osc.stop(startTime + 0.5);
		});

		// Final chord
		const chordNotes = [523.25, 659.25, 783.99];
		chordNotes.forEach((freq) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'sine';
			osc.frequency.value = freq;

			const startTime = now + 0.5;
			gain.gain.setValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

			osc.connect(gain);
			gain.connect(output);

			osc.start(startTime);
			osc.stop(startTime + 0.8);
		});
	}

	// Sad descending sound for loss
	private playLose(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		// Descending minor notes
		const notes = [392, 349.23, 329.63, 293.66]; // G4, F4, E4, D4

		notes.forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'sine';
			osc.frequency.value = freq;

			const startTime = now + i * 0.2;
			gain.gain.setValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

			osc.connect(gain);
			gain.connect(output);

			osc.start(startTime);
			osc.stop(startTime + 0.4);
		});
	}

	// Chime for turn change
	private playTurnChange(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(880, now);
		osc.frequency.setValueAtTime(1108.73, now + 0.1);

		gain.gain.setValueAtTime(0.2, now);
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

		osc.connect(gain);
		gain.connect(output);

		osc.start(now);
		osc.stop(now + 0.3);
	}

	// Warning tick for timer
	private playTick(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'square';
		osc.frequency.value = 1000;

		gain.gain.setValueAtTime(0.1, now);
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

		osc.connect(gain);
		gain.connect(output);

		osc.start(now);
		osc.stop(now + 0.05);
	}

	// Soft click for key press
	private playKeyPress(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.value = 600;

		gain.gain.setValueAtTime(0.08, now);
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

		osc.connect(gain);
		gain.connect(output);

		osc.start(now);
		osc.stop(now + 0.04);
	}

	// Game start sound
	private playGameStart(ctx: AudioContext, output: GainNode) {
		const now = ctx.currentTime;

		// Quick ascending notes
		const notes = [440, 554.37, 659.25]; // A4, C#5, E5

		notes.forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'triangle';
			osc.frequency.value = freq;

			const startTime = now + i * 0.08;
			gain.gain.setValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
			gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

			osc.connect(gain);
			gain.connect(output);

			osc.start(startTime);
			osc.stop(startTime + 0.2);
		});
	}
}

// Export singleton instance
export const soundManager = new SoundManager();
