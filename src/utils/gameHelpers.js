import { PIECE_VALUES } from '../constants/pieceValues';

/**
 * Calculate material advantage for a side
 */
export function calculateMaterialAdvantage(capturedByWhite, capturedByBlack) {
  const whiteScore = capturedByWhite.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
  const blackScore = capturedByBlack.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
  return whiteScore - blackScore;
}

/**
 * Format time from seconds to MM:SS
 */
export function formatTime(seconds) {
  if (seconds === Infinity) return '∞';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Group move history into pairs for display
 */
export function groupMoves(moves) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
    });
  }
  return pairs;
}

/**
 * Get captured pieces from move history
 */
export function getCapturedPieces(moveHistory) {
  const captured = { w: [], b: [] };
  for (const move of moveHistory) {
    if (move.captured) {
      // Piece was captured by the moving side
      const capturedBySide = move.color; // 'w' captured a black piece, etc.
      captured[capturedBySide].push({
        type: move.captured,
        color: capturedBySide === 'w' ? 'b' : 'w',
      });
    }
  }
  return captured;
}

/**
 * Save game state to localStorage
 */
export function saveGameToStorage(gameState) {
  try {
    localStorage.setItem('chess_game_state', JSON.stringify(gameState));
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameFromStorage() {
  try {
    const saved = localStorage.getItem('chess_game_state');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Failed to load game state:', e);
    return null;
  }
}

/**
 * Clear saved game
 */
export function clearSavedGame() {
  localStorage.removeItem('chess_game_state');
}

/**
 * Get a human-readable game result
 */
export function getGameResultText(status, turn) {
  switch (status) {
    case 'checkmate':
      return `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
    case 'stalemate':
      return 'Stalemate! The game is a draw.';
    case 'draw':
      return 'Draw!';
    case 'resigned':
      return `${turn === 'w' ? 'White' : 'Black'} resigned. ${turn === 'w' ? 'Black' : 'White'} wins!`;
    default:
      return '';
  }
}
