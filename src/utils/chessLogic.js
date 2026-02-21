import { Chess } from 'chess.js';

/**
 * Create a new chess game instance
 */
export function createGame(fen) {
  return fen ? new Chess(fen) : new Chess();
}

/**
 * Get all legal moves for the current position
 */
export function getLegalMoves(game) {
  return game.moves({ verbose: true });
}

/**
 * Get legal moves for a specific square
 */
export function getLegalMovesForSquare(game, square) {
  return game.moves({ square, verbose: true });
}

/**
 * Make a move and return the result
 */
export function makeMove(game, from, to, promotion = 'q') {
  try {
    const move = game.move({ from, to, promotion });
    return move;
  } catch {
    return null;
  }
}

/**
 * Check if a move needs pawn promotion
 */
export function needsPromotion(game, from, to) {
  const piece = game.get(from);
  if (!piece || piece.type !== 'p') return false;
  const toRank = to[1];
  return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
}

/**
 * Get game status
 */
export function getGameStatus(game) {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isStalemate()) return 'stalemate';
  if (game.isDraw()) return 'draw';
  if (game.isCheck()) return 'check';
  return 'active';
}

/**
 * Get the board state as a 2D array
 */
export function getBoardState(game) {
  return game.board();
}

/**
 * Undo the last move
 */
export function undoMove(game) {
  return game.undo();
}

/**
 * Get move history in verbose format
 */
export function getMoveHistory(game) {
  return game.history({ verbose: true });
}

/**
 * Get move history as SAN strings
 */
export function getMoveHistorySAN(game) {
  return game.history();
}

/**
 * Get FEN string
 */
export function getFEN(game) {
  return game.fen();
}

/**
 * Get PGN string
 */
export function getPGN(game) {
  return game.pgn();
}
