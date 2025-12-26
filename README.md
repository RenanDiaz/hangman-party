# 🎮 Hangman Party

Real-time multiplayer Hangman game featuring single-player mode, team collaboration, and competitive racing. Built with Svelte, SvelteKit, and PartyKit.

## Features

### Game Modes

- **🎯 Single Player**: Play against the computer with words from a predefined list
- **👥 Team Mode**: All players collaborate to guess the same word with rotating turns
- **🏆 Competitive Mode**: Each player guesses their own word - first to complete wins!

### Configuration Options

- **Categories**: Animals, Countries, Movies, Food, Sports, Professions, Technology, Mix
- **Difficulty**: Easy (4-6 letters), Medium (7-10 letters), Hard (11+ letters)
- **Max Attempts**: 6, 8, or 10 tries
- **Rounds**: 1, 3, or 5 rounds per game
- **Turn Timer**: Optional 30, 45, or 60 second limit per turn

### Features

- 🔗 Shareable room codes/links for easy joining
- 🎨 Progressive hangman drawing with animations
- ⌨️ Interactive keyboard with letter states (available/correct/incorrect)
- 📊 Scoring system with speed and accuracy bonuses
- 🏆 Leaderboard between rounds
- 📱 Responsive design for mobile and desktop
- 🔄 Automatic reconnection on disconnect

## Tech Stack

- **Frontend**: Svelte 5 + SvelteKit + TypeScript
- **Real-time**: PartyKit for state synchronization
- **Styling**: TailwindCSS
- **Deployment**: Vercel (frontend) + PartyKit (WebSocket server)

## Project Structure

```
hangman-party/
├── src/
│   ├── lib/
│   │   ├── components/       # Svelte components
│   │   │   ├── HangmanFigure.svelte
│   │   │   ├── WordDisplay.svelte
│   │   │   ├── Keyboard.svelte
│   │   │   ├── PlayerList.svelte
│   │   │   ├── GameConfig.svelte
│   │   │   ├── Scoreboard.svelte
│   │   │   ├── TurnTimer.svelte
│   │   │   └── CompetitiveBoard.svelte
│   │   ├── stores/           # Svelte stores
│   │   │   └── game.svelte.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── game.ts
│   │   └── data/             # Word database
│   │       └── words.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte          # Home page
│   │   ├── single-player/
│   │   │   └── +page.svelte      # Single player mode
│   │   └── room/
│   │       └── [code]/
│   │           └── +page.svelte  # Multiplayer room
│   ├── app.css
│   ├── app.html
│   └── app.d.ts
├── party/
│   └── index.ts              # PartyKit server
├── partykit.json
├── package.json
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hangman-party.git
cd hangman-party

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Start PartyKit server (in one terminal)
npm run partykit:dev

# Start SvelteKit dev server (in another terminal)
npm run dev
```

The game will be available at `http://localhost:5173`

### Production Build

```bash
# Build the SvelteKit app
npm run build

# Preview the build
npm run preview
```

## Deployment

### PartyKit Deployment

```bash
# Deploy the PartyKit server
npm run partykit:deploy
```

After deployment, update `VITE_PARTYKIT_HOST` in your environment variables to point to your PartyKit server (e.g., `hangman-party.yourusername.partykit.dev`).

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the environment variable `VITE_PARTYKIT_HOST` to your PartyKit server URL
3. Deploy!

## Game Flow

1. **Lobby**: Players join the room using a shareable code/link
2. **Configuration**: Host configures game settings (mode, category, difficulty, etc.)
3. **Playing**:
   - Team mode: Players take turns guessing letters
   - Competitive mode: All players guess simultaneously on their own words
4. **Between Rounds**: Scoreboard display, host starts next round
5. **Finished**: Final results and option to play again

## Scoring System

- **Base Points**: Word length × 10
- **Accuracy Bonus**: (Max attempts - Wrong guesses) × 5
- **Speed Bonus**: Points for finishing under 60 seconds
- Team mode: Points divided equally among players

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ using Svelte + PartyKit
