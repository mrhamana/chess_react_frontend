// Board dimensions
export const BOARD_SIZE = 8;

// Square colors for different themes
export const BOARD_THEMES = {
  classic: {
    light: '#f0d9b5',
    dark: '#b58863',
    highlight: 'rgba(255, 235, 59, 0.5)',
    selected: 'rgba(102, 126, 234, 0.6)',
    legalMove: 'rgba(102, 126, 234, 0.3)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    check: 'radial-gradient(ellipse at center, rgba(255,0,0,0.6) 0%, rgba(255,82,82,0) 70%)',
  },
  wooden: {
    light: '#deb887',
    dark: '#8b6914',
    highlight: 'rgba(255, 235, 59, 0.5)',
    selected: 'rgba(102, 126, 234, 0.6)',
    legalMove: 'rgba(102, 126, 234, 0.3)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    check: 'radial-gradient(ellipse at center, rgba(255,0,0,0.6) 0%, rgba(255,82,82,0) 70%)',
  },
  marble: {
    light: '#e8e8e8',
    dark: '#7d8796',
    highlight: 'rgba(255, 235, 59, 0.5)',
    selected: 'rgba(102, 126, 234, 0.6)',
    legalMove: 'rgba(102, 126, 234, 0.3)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    check: 'radial-gradient(ellipse at center, rgba(255,0,0,0.6) 0%, rgba(255,82,82,0) 70%)',
  },
  neon: {
    light: '#2d2d3d',
    dark: '#1a1a2e',
    highlight: 'rgba(0, 255, 200, 0.3)',
    selected: 'rgba(0, 200, 255, 0.5)',
    legalMove: 'rgba(0, 255, 100, 0.2)',
    lastMove: 'rgba(0, 200, 255, 0.25)',
    check: 'radial-gradient(ellipse at center, rgba(255,0,80,0.6) 0%, rgba(255,0,80,0) 70%)',
  },
};

// Files and ranks labels
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Starting FEN
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
