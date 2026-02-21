import { FILES, RANKS } from '../constants/boardConfig';

/**
 * Convert board indices (row, col) to algebraic notation (e.g., "e4")
 */
export function toAlgebraic(row, col) {
  return FILES[col] + RANKS[row];
}

/**
 * Convert algebraic notation to board indices
 */
export function fromAlgebraic(square) {
  const col = FILES.indexOf(square[0]);
  const row = RANKS.indexOf(square[1]);
  return { row, col };
}

/**
 * Check if a square is light or dark
 */
export function isLightSquare(row, col) {
  return (row + col) % 2 === 0;
}

/**
 * Get all squares on the board as an array of {row, col, square}
 */
export function getAllSquares() {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      squares.push({ row, col, square: toAlgebraic(row, col) });
    }
  }
  return squares;
}

/**
 * Parse a FEN string to get the board array
 */
export function fenToBoard(fen) {
  const board = [];
  const rows = fen.split(' ')[0].split('/');
  for (const row of rows) {
    const boardRow = [];
    for (const char of row) {
      if (isNaN(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        boardRow.push({ type: char.toLowerCase(), color });
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push(null);
        }
      }
    }
    board.push(boardRow);
  }
  return board;
}
