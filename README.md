# Tongkrongan 100 🎲🐍

A browser-based Snakes and Ladders party game designed for 2–4 local players on a single device. Built incrementally with React, TypeScript, and Vite.

---

## 🎯 Architecture Overview

The codebase is organized into modular layers to keep state management, board calculation, and question content cleanly separated:

- **`src/types/`**: TypeScript interfaces for game models (`Player`, `GameState`, `QuestionCard`, etc.).
- **`src/data/`**: Static game data independent of UI (`questions.ts`, `boardConfig.ts` with snake/ladder positions).
- **`src/components/`**: Reusable UI presentation components:
  - `Board/`: 100-cell serpentine grid, SVG overlays for snakes and ladders, and player token positions.
  - `Dice/`: Interactive dice roll component and roll animations.
  - `Players/`: Turn banner, player avatars, and pass-and-play indicator.
  - `Cards/`: Pop-up modals for truth, dare, and trivia challenge cards.
  - `WinnerModal/`: Final showdown challenge when a player reaches cell 100.
- **`src/hooks/`**: Custom hooks (e.g. `useGameEngine.ts`) managing turn transitions, token movement, trap checking, and card drawing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd /path/to/SnL

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open your browser at the local URL indicated in the terminal (typically `http://localhost:5173`).

### Building for Production
```bash
npm run build
```

### Running Unit Tests
```bash
npm run test
```
*(Runs automated game logic and movement rule tests).*

### Type Checking & Linting
```bash
npm run build
npm run lint
```

---

## 📌 Implementation Progress

- [x] **Step 1:** Project scaffold (React + TS + Vite), responsive dark party theme, architecture design.
- [x] **Step 2:** Serpentine 100-cell board layout and local player setup (2–4 players with distinct token colors).
- [x] **Step 3:** Interactive dice roller, local pass-and-play turn rotation, and step-by-step token movement.
- [x] **Step 4:** Snakes & ladders placement (SVG overlay), slide/climb mechanics, and landing animations.
- [x] **Step 5:** Party question cards system (Truth, Dare, Trivia, Wild), random drawing, and modal popups.
- [x] **Step 6:** Final winner showdown challenge on tile 100, victory celebration, and rematch options.

