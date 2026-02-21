import { useCallback, useContext } from 'react';
import { useChess } from '../context/ChessContext';
import SocketContext from '../context/SocketContext';

/**
 * Hook for managing piece movement (selection, moving, promotion)
 * Supports both local and multiplayer modes.
 */
export default function usePieceMovement() {
  const {
    selectedSquare,
    legalMoves,
    pendingPromotion,
    gameStatus,
    currentTurn,
    isMultiplayer,
    myColor,
    selectSquare,
    clearSelection,
    makeMove,
    needsPromotion,
    requestPromotion,
    getGame,
  } = useChess();

  // Safe socket access — returns null if no SocketProvider is mounted
  const socketCtx = useContext(SocketContext);
  const emitMove = isMultiplayer ? socketCtx?.emitMove : null;

  const isGameOver = gameStatus !== 'active' && gameStatus !== 'check';

  /**
   * In multiplayer, player can only interact on their own turn
   */
  const isMyTurn = !isMultiplayer || currentTurn === myColor;

  /**
   * Perform a move — local in single-player, via socket in multiplayer.
   */
  const doMove = useCallback(
    (from, to, promotion) => {
      if (isMultiplayer && emitMove) {
        // Send to server; the board updates when server confirms via game:move
        const moveObj = { from, to };
        if (promotion) moveObj.promotion = promotion;
        emitMove(moveObj);
        clearSelection();
        return true;
      }
      // Local play — apply immediately
      return makeMove(from, to, promotion);
    },
    [isMultiplayer, emitMove, makeMove, clearSelection],
  );

  /**
   * Handle a square click
   */
  const handleSquareClick = useCallback(
    (square) => {
      if (isGameOver) return;
      if (!isMyTurn) return;          // can't interact when not your turn in multiplayer

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
          doMove(selectedSquare, square);
          return;
        }

        // If clicking on own piece, select that instead
        const piece = game.get(square);
        if (piece && piece.color === currentTurn) {
          // In multiplayer, only select pieces of my color
          if (isMultiplayer && piece.color !== myColor) return;
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
        if (isMultiplayer && piece.color !== myColor) return;
        selectSquare(square);
      }
    },
    [
      selectedSquare,
      legalMoves,
      isGameOver,
      isMyTurn,
      currentTurn,
      isMultiplayer,
      myColor,
      selectSquare,
      clearSelection,
      doMove,
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
      if (!isMyTurn) return false;

      if (needsPromotion(from, to)) {
        requestPromotion(from, to);
        return true;
      }

      const move = doMove(from, to);
      return !!move;
    },
    [isGameOver, isMyTurn, doMove, needsPromotion, requestPromotion]
  );

  /**
   * Handle promotion piece selection
   */
  const handlePromotion = useCallback(
    (piece) => {
      if (!pendingPromotion) return;
      doMove(pendingPromotion.from, pendingPromotion.to, piece);
    },
    [pendingPromotion, doMove]
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
