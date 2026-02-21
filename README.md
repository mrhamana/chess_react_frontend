# ♔ React Chess Game

A beautiful, fully-featured chess game built with React, featuring smooth animations, multiple board themes, and complete chess rules.

## Features

- **Complete Chess Rules**: All standard chess rules via chess.js — castling, en passant, pawn promotion, check/checkmate/stalemate detection, draw conditions
- **Beautiful UI**: Modern design with glass-morphism effects, gradient backgrounds, and floating particle animations
- **Smooth Animations**: Framer Motion-powered piece movements, captures, and UI transitions
- **Multiple Board Themes**: Classic, Wooden, Marble, and Neon
- **Drag & Drop + Click-to-Move**: Two input methods for piece movement
- **Move History**: Full algebraic notation with auto-scroll
- **Captured Pieces Display**: Shows captures with material advantage indicator
- **PGN Export**: Copy game notation to clipboard
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Accessible**: Full keyboard navigation support

## Tech Stack

- **React 18** with Vite
- **chess.js** for game logic
- **Framer Motion** for animations
- **React Router** for navigation
- **react-confetti** for checkmate celebration

## Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
frontend/src/
├── components/
│   ├── Board/        # Chessboard & squares
│   ├── Pieces/       # SVG chess piece components
│   ├── Game/         # Game container, controls, move history
│   ├── Home/         # Landing page with hero section
│   └── UI/           # Reusable UI components
├── hooks/            # Custom React hooks
├── context/          # Chess game context & reducer
├── utils/            # Chess logic, move validation, helpers
├── constants/        # Piece values, board config, game rules
└── styles/           # Global styles, theme, animations
```

## How to Play

1. Click **"Play Now"** on the homepage
2. **Click a piece** to select it, then click a highlighted square to move — or use **drag and drop**
3. Green dots show legal moves; rings show captures
4. Use **Undo** to take back moves, **New Game** to restart
5. Change board themes and toggle settings in the control panel
6. The game detects checkmate, stalemate, and draws automatically

## License

MIT
