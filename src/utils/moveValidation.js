/**
 * Move validation utilities - wrapping chess.js validation
 * with additional helper functions
 */

/**
 * Check if a square is a valid target for the selected piece
 */
export function isValidTarget(legalMoves, targetSquare) {
  return legalMoves.some((move) => move.to === targetSquare);
}

/**
 * Get the move object for a specific from-to combination
 */
export function getMoveObject(legalMoves, from, to) {
  return legalMoves.find((move) => move.from === from && move.to === to);
}

/**
 * Check if a move is a capture
 */
export function isCapture(move) {
  return move && move.captured;
}

/**
 * Check if a move is castling
 */
export function isCastling(move) {
  return move && (move.flags.includes('k') || move.flags.includes('q'));
}

/**
 * Check if a move is en passant
 */
export function isEnPassant(move) {
  return move && move.flags.includes('e');
}

/**
 * Check if a move is pawn promotion
 */
export function isPromotion(move) {
  return move && move.flags.includes('p');
}
