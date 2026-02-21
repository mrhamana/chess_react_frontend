import { useCallback } from 'react';
import { useChess } from '../context/ChessContext';

/**
 * Hook for managing piece movement (selection, moving, promotion)
 */
export default function usePieceMovement() {
  const {
    selectedSquare,
    legalMoves,
    pendingPromotion,
    gameStatus,
    currentTurn,
    selectSquare,
    clearSelection,
    makeMove,
    needsPromotion,
    requestPromotion,
    getGame,
  } = useChess();

  const isGameOver = gameStatus !== 'active' && gameStatus !== 'check';

  /**
   * Handle a square click
   */
  const handleSquareClick = useCallback(
    (square) => {
      if (isGameOver) return;

      const game = getGame();

      // If we have a selected square, try to move
      if (selectedSquare) {
        const isLegal = legalMoves.some((m) => m.to === square);

        if (isLegal) {
          // Check if it needs promotion
          if (needsPromotion(selectedSquare, square)) {
            requestPromotion(selectedSquare, square);
            return;
          }
          makeMove(selectedSquare, square);
          return;
        }

        // If clicking on own piece, select that instead
        const piece = game.get(square);
        if (piece && piece.color === currentTurn) {
          selectSquare(square);
          return;
        }

        // Otherwise clear selection
        clearSelection();
        return;
      }

      // No selection yet - select if it's our piece
      const piece = game.get(square);
      if (piece && piece.color === currentTurn) {
        selectSquare(square);
      }
    },
    [
      selectedSquare,
      legalMoves,
      isGameOver,
      currentTurn,
      selectSquare,
      clearSelection,
      makeMove,
      needsPromotion,
      requestPromotion,
      getGame,
    ]
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (from, to) => {
      if (isGameOver) return false;

      if (needsPromotion(from, to)) {
        requestPromotion(from, to);
        return true;
      }

      const move = makeMove(from, to);
      return !!move;
    },
    [isGameOver, makeMove, needsPromotion, requestPromotion]
  );

  /**
   * Handle promotion piece selection
   */
  const handlePromotion = useCallback(
    (piece) => {
      if (!pendingPromotion) return;
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
    },
    [pendingPromotion, makeMove]
  );

  /**
   * Get legal move target squares for highlighting
   */
  const legalMoveSquares = legalMoves.map((m) => m.to);

  return {
    selectedSquare,
    legalMoveSquares,
    pendingPromotion,
    handleSquareClick,
    handleDrop,
    handlePromotion,
  };
}
