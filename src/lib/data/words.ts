import type { Category, Difficulty } from '$lib/types/game';
import { DIFFICULTY_RANGES } from '$lib/types/game';

// Word database organized by category
export const WORDS: Record<Exclude<Category, 'mix'>, string[]> = {
	animales: [
		// Easy (4-6 letters)
		'gato', 'perro', 'leon', 'oso', 'pato', 'rata', 'lobo', 'puma', 'tigre', 'zorro',
		'buho', 'cebra', 'koala', 'llama', 'mono', 'sapo', 'vaca', 'cabra', 'cerdo', 'pulpo',
		// Medium (7-10 letters)
		'elefante', 'jirafa', 'cocodrilo', 'delfin', 'ballena', 'tiburon', 'tortuga', 'conejo',
		'caballo', 'serpiente', 'canguro', 'gorila', 'leopardo', 'pantera', 'mapache', 'ardilla',
		'murcielago', 'camaleon', 'flamenco', 'pingüino',
		// Hard (11+ letters)
		'rinoceronte', 'hipopotamo', 'ornitorrinco', 'chimpance', 'escarabajo', 'saltamontes',
		'mantarraya', 'puercoespin', 'armadillo', 'cachalote'
	],
	paises: [
		// Easy (4-6 letters)
		'peru', 'cuba', 'chile', 'china', 'india', 'japon', 'corea', 'qatar', 'nepal', 'kenya',
		'mali', 'iran', 'iraq', 'fiji', 'togo', 'benin', 'sudan', 'siria', 'libia', 'ghana',
		// Medium (7-10 letters)
		'mexico', 'brasil', 'espana', 'francia', 'alemania', 'italia', 'portugal', 'colombia',
		'argentina', 'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay', 'canada', 'jamaica',
		'marruecos', 'egipto', 'turquia', 'tailandia',
		// Hard (11+ letters)
		'estados unidos', 'reino unido', 'sudafrica', 'australia', 'nueva zelanda', 'arabia saudita',
		'emiratos arabes', 'costarica', 'guatemala', 'honduras', 'nicaragua', 'el salvador',
		'republica dominicana', 'puerto rico', 'filipinas'
	],
	peliculas: [
		// Easy (4-6 letters)
		'coco', 'cars', 'up', 'brave', 'shrek', 'rocky', 'alien', 'ted', 'her', 'jaws',
		'logan', 'drive', 'speed', 'ghost', 'click', 'antz', 'troy', 'dumbo', 'bambi', 'luca',
		// Medium (7-10 letters)
		'titanic', 'avatar', 'frozen', 'moana', 'encanto', 'ratatouille', 'gladiator', 'inception',
		'joker', 'matrix', 'parasite', 'soul', 'venom', 'spider-man', 'batman', 'superman',
		'aladdin', 'hercules', 'mulan', 'pocahontas',
		// Hard (11+ letters)
		'interestelar', 'forrest gump', 'pulp fiction', 'el padrino', 'el resplandor',
		'jurassic park', 'terminator', 'regreso al futuro', 'star wars', 'indiana jones',
		'harry potter', 'el señor de los anillos', 'piratas del caribe', 'mision imposible'
	],
	comida: [
		// Easy (4-6 letters)
		'pizza', 'taco', 'sopa', 'pan', 'arroz', 'pasta', 'pollo', 'carne', 'queso', 'huevo',
		'fresa', 'mango', 'uva', 'pera', 'melon', 'limon', 'naranja', 'manzana', 'banana', 'kiwi',
		// Medium (7-10 letters)
		'hamburguesa', 'ensalada', 'espagueti', 'burrito', 'enchilada', 'paella', 'ceviche',
		'empanada', 'arepa', 'tamal', 'nachos', 'quesadilla', 'guacamole', 'chilaquiles',
		'pozole', 'carnitas', 'barbacoa', 'chorizo', 'jamon', 'salmon',
		// Hard (11+ letters)
		'fettuccine', 'canelones', 'lasagna', 'carbonara', 'boloñesa', 'ratatouille',
		'croissant', 'cheesecake', 'tiramisú', 'panna cotta', 'creme brulee'
	],
	deportes: [
		// Easy (4-6 letters)
		'futbol', 'tenis', 'golf', 'boxeo', 'surf', 'rugby', 'polo', 'judo', 'sumo', 'yoga',
		'ski', 'vela', 'remo', 'salto', 'lucha', 'esgrima', 'hockey', 'beisbol', 'voley', 'basket',
		// Medium (7-10 letters)
		'natacion', 'atletismo', 'ciclismo', 'gimnasia', 'karate', 'taekwondo', 'balonmano',
		'waterpolo', 'triathlon', 'snowboard', 'patinaje', 'escalada', 'parkour', 'crossfit',
		'halterofilia', 'badminton', 'squash', 'cricket', 'lacrosse', 'softball',
		// Hard (11+ letters)
		'baloncesto', 'automovilismo', 'motociclismo', 'paracaidismo', 'alpinismo',
		'windsurf', 'paddleboarding', 'clavadismo', 'pentatlon', 'decatlon'
	],
	profesiones: [
		// Easy (4-6 letters)
		'chef', 'piloto', 'actor', 'juez', 'monje', 'guia', 'chofer', 'modelo', 'pintor', 'musico',
		// Medium (7-10 letters)
		'medico', 'abogado', 'maestro', 'ingeniero', 'arquitecto', 'enfermero', 'bombero',
		'policia', 'soldado', 'carpintero', 'electricista', 'mecanico', 'plomero', 'cocinero',
		'panadero', 'carnicero', 'pescador', 'granjero', 'jardinero', 'sastre',
		// Hard (11+ letters)
		'programador', 'contador', 'veterinario', 'psicologo', 'psiquiatra', 'cirujano',
		'cardiologo', 'neurologo', 'radiologo', 'anestesiologo', 'farmaceutico', 'biologo',
		'quimico', 'fisico', 'matematico', 'economista', 'periodista', 'fotografo'
	],
	tecnologia: [
		// Easy (4-6 letters)
		'app', 'web', 'wifi', 'usb', 'ram', 'cpu', 'gpu', 'ssd', 'led', 'lcd',
		'mouse', 'teclado', 'laptop', 'tablet', 'drone', 'robot', 'chip', 'pixel', 'byte', 'bits',
		// Medium (7-10 letters)
		'software', 'hardware', 'internet', 'servidor', 'database', 'algoritmo', 'programa',
		'navegador', 'buscador', 'antivirus', 'firewall', 'router', 'modem', 'bluetooth',
		'streaming', 'podcast', 'videojuego', 'consola', 'monitor', 'impresora',
		// Hard (11+ letters)
		'inteligencia artificial', 'machine learning', 'blockchain', 'criptomoneda',
		'realidad virtual', 'realidad aumentada', 'ciberseguridad', 'procesador',
		'computadora', 'programacion', 'desarrollador', 'framework', 'microchip'
	]
};

// Get all categories except 'mix'
export const CATEGORIES = Object.keys(WORDS) as Exclude<Category, 'mix'>[];

// Get random word from category with difficulty filter
export function getRandomWord(category: Category, difficulty: Difficulty): { word: string; category: Exclude<Category, 'mix'> } {
	const range = DIFFICULTY_RANGES[difficulty];
	let selectedCategory: Exclude<Category, 'mix'>;
	let wordPool: string[];

	if (category === 'mix') {
		// Pick random category
		selectedCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
	} else {
		selectedCategory = category;
	}

	wordPool = WORDS[selectedCategory].filter(word => {
		const cleanWord = word.replace(/\s/g, '');
		return cleanWord.length >= range.min && cleanWord.length <= range.max;
	});

	// If no words match difficulty, use all words from category
	if (wordPool.length === 0) {
		wordPool = WORDS[selectedCategory];
	}

	const word = wordPool[Math.floor(Math.random() * wordPool.length)];
	return { word: word.toUpperCase(), category: selectedCategory };
}

// Get words for competitive mode (unique word per player)
export function getUniqueWords(category: Category, difficulty: Difficulty, count: number): Array<{ word: string; category: Exclude<Category, 'mix'> }> {
	const range = DIFFICULTY_RANGES[difficulty];
	const usedWords = new Set<string>();
	const results: Array<{ word: string; category: Exclude<Category, 'mix'> }> = [];

	// Build pool of all matching words
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

	// Shuffle array
	allWords.sort(() => Math.random() - 0.5);

	// Pick unique words
	for (const wordData of allWords) {
		if (results.length >= count) break;
		if (!usedWords.has(wordData.word)) {
			usedWords.add(wordData.word);
			results.push(wordData);
		}
	}

	// If not enough unique words, repeat some
	while (results.length < count && allWords.length > 0) {
		const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
		results.push(randomWord);
	}

	return results;
}

// Category display names
export const CATEGORY_NAMES: Record<Category, string> = {
	animales: '🐾 Animales',
	paises: '🌍 Países',
	peliculas: '🎬 Películas',
	comida: '🍕 Comida',
	deportes: '⚽ Deportes',
	profesiones: '👨‍⚕️ Profesiones',
	tecnologia: '💻 Tecnología',
	mix: '🎲 Mix'
};

// Difficulty display names
export const DIFFICULTY_NAMES: Record<Difficulty, string> = {
	facil: '😊 Fácil (4-6 letras)',
	medio: '🤔 Medio (7-10 letras)',
	dificil: '😰 Difícil (11+ letras)'
};
