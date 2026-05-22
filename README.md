# 🎮 PIXELVAULT — Arcade Gaming Platform

> **35 handcrafted browser games. No downloads, no installs — just pure play.**

A neon glassmorphism arcade built with **React 18 + Tailwind CSS + Vite**.  
Every game runs entirely in the browser with zero backend.


---

## ✨ Features

- 🎮 **35 playable games** across 6 categories
- 🔍 **Live search + category filter** across all games
- 🌈 **Neon / glassmorphism UI** — per-game accent colors & glow
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- ⚡ **Zero dependencies** beyond React + Tailwind
- 🧱 **Scalable architecture** — adding game #36 is 3 steps

---

## 🎯 Game List

| # | Game | Category | Difficulty |
|---|------|----------|-----------|
| 1 | ✊ Rock Paper Scissors | Classic | Easy |
| 2 | 🔢 Guess the Number | Puzzle | Medium |
| 3 | 🎲 Dice Roll | Luck | Easy |
| 4 | ⬜ Tic Tac Toe | Strategy | Easy |
| 5 | 🃏 Memory Match | Puzzle | Hard |
| 6 | 🐍 Snake | Arcade | Medium |
| 7 | 🔨 Whack-a-Mole | Arcade | Medium |
| 8 | 🔤 Word Jumble | Puzzle | Medium |
| 9 | 🎨 Color Match | Puzzle | Hard |
| 10 | 💣 Minesweeper | Strategy | Hard |
| 11 | ⌨️ Typing Speed | Arcade | Medium |
| 12 | ➗ Math Blitz | Puzzle | Medium |
| 13 | 🔵 Simon Says | Classic | Hard |
| 14 | 🪢 Hangman | Classic | Medium |
| 15 | 🪙 Coin Flip Streak | Luck | Easy |
| 16 | 🧱 Breakout | Arcade | Medium |
| 17 | 🃏 Higher or Lower | Luck | Easy |
| 18 | ⚡ Reaction Time | Arcade | Medium |
| 19 | 🔵 Count Master | Puzzle | Medium |
| 20 | 🔐 Password Guesser | Puzzle | Hard |
| 21 | 🔗 Word Chain | Classic | Medium |
| 22 | 🚀 Space Battle | Arcade | Hard |
| 23 | 🧠 Trivia Blitz | Puzzle | Medium |
| 24 | 🎯 Speed Click | Arcade | Easy |
| 25 | 🔢 Sequence Push | Classic | Hard |
| 26 | 🏓 Pong | Arcade | Medium |
| 27 | 🔡 Anagram Hunt | Puzzle | Medium |
| 28 | 💻 Binary Flip | Puzzle | Hard |
| 29 | 🖼️ Grid Paint | Puzzle | Easy |
| 30 | 🂡 Blackjack | Luck | Medium |
| 31 | 🧩 Slide Puzzle | Puzzle | Hard |
| 32 | 🌈 Color Sequence | Classic | Medium |
| 33 | 🏎️ Type Racer | Arcade | Hard |
| 34 | 🧺 Catch & Drop | Arcade | Medium |
| 35 | 🔍 Odd One Out | Puzzle | Easy |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/pixelvault.git
cd pixelvault

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → opens at http://localhost:3000

# 4. Build for production
npm run build
```

---

## 📁 Project Structure

```
pixelvault/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite build config
├── tailwind.config.js          # Tailwind theme + content paths
├── postcss.config.js           # PostCSS (autoprefixer)
├── package.json
│
└── src/
    ├── main.jsx                # React DOM entry
    ├── App.jsx                 # Root: routing + game modal
    ├── gameRegistry.js         # ← All game metadata lives here
    │
    ├── styles/
    │   └── index.css           # Tailwind directives + global styles
    │
    ├── components/             # Shared UI primitives
    │   ├── GameShell.jsx       # Modal wrapper every game uses
    │   ├── GameCard.jsx        # Card shown on browse pages
    │   ├── Navbar.jsx          # Top navigation bar
    │   ├── SearchBar.jsx       # Search input
    │   ├── BgFx.jsx            # Ambient neon background
    │   └── StatCard.jsx        # Stat tiles on homepage
    │
    ├── pages/                  # Top-level route views
    │   ├── HomePage.jsx        # Hero + featured games
    │   ├── GamesPage.jsx       # Full library with search/filter
    │   ├── CategoriesPage.jsx  # Games grouped by category
    │   └── LeaderboardPage.jsx # Score leaderboard
    │
    └── games/                  # One file per game engine
        ├── index.js            # ← Barrel: ID → Component map
        ├── RockPaperScissors.jsx
        ├── GuessNumber.jsx
        ├── DiceRoll.jsx
        ├── TicTacToe.jsx
        ├── MemoryMatch.jsx
        ├── Snake.jsx
        ├── WhackAMole.jsx
        ├── WordJumble.jsx
        ├── ColorMatch.jsx
        ├── Minesweeper.jsx
        ├── TypingSpeed.jsx
        ├── MathBlitz.jsx
        ├── Simon.jsx
        ├── Hangman.jsx
        ├── CoinFlip.jsx
        ├── Breakout.jsx
        ├── HigherLower.jsx
        ├── ReactionTime.jsx
        ├── CountMaster.jsx
        ├── PasswordGuesser.jsx
        ├── WordChain.jsx
        ├── SpaceBattle.jsx
        ├── TriviaBlitz.jsx
        ├── SpeedClick.jsx
        ├── SequencePush.jsx
        ├── Pong.jsx
        ├── AnagramHunt.jsx
        ├── BinaryFlip.jsx
        ├── GridPaint.jsx
        ├── Blackjack.jsx
        ├── SlidePuzzle.jsx
        ├── ColorSequence.jsx
        ├── TypeRacer.jsx
        ├── CatchDrop.jsx
        └── OddOneOut.jsx
```

---

## ➕ How to Add a New Game (3 steps)

### Step 1 — Add metadata to `src/gameRegistry.js`

```js
{
  id: "mygame",
  title: "My Awesome Game",
  description: "Short punchy description.",
  category: "Arcade",          // Classic | Puzzle | Luck | Strategy | Arcade
  icon: "🎯",
  color: "#ff6b6b",
  glow: "rgba(255,107,107,0.4)",
  difficulty: "Medium",        // Easy | Medium | Hard
  players: "1P",               // 1P | 2P
  tags: ["arcade", "reflex"],
},
```

### Step 2 — Create `src/games/MyGame.jsx`

```jsx
import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function MyGame({ onClose }) {
  return (
    <GameShell title="My Awesome Game" icon="🎯" color="#ff6b6b" onClose={onClose}>
      {/* your game UI here */}
    </GameShell>
  );
}
```

### Step 3 — Register it in `src/games/index.js`

```js
import MyGame from "./MyGame.jsx";

const GAME_COMPONENTS = {
  // ... existing games ...
  mygame: MyGame,
};
```

**Done.** The card automatically appears on the homepage, browse page, and category page.

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool + dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Vanilla Canvas API | — | Canvas-based games (Snake, Breakout, Pong…) |

---

## 🎨 Design System

All neon colors are defined per-game in `gameRegistry.js`.  
The `GameShell` component automatically applies glow, border, and gradient from each game's `color` field.  
Background FX (radial gradients + grid lines) live in `BgFx.jsx`.

---

## 📄 License

MIT — free to use, modify, and deploy.

---

<div align="center">
  Made with ❤️ and way too many emojis
</div>
