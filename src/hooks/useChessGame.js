import { useCallback } from 'react';
import { useChess } from '../context/ChessContext';

/**
 * Hook for managing chess game actions
 */
export default function useChessGame() {
  const {
    board,
    currentTurn,
    moveHistory,
    moveHistorySAN,
    capturedPieces,
    gameStatus,
    lastMove,
    settings,
    boardOrientation,
    evaluation,
    evaluationHistory,
    newGame,
    undoMove,
    resign,
    setTheme,
    toggleSetting,
    getGame,
    flipBoard,
    setEvaluation,
  } = useChess();

  const getPGN = useCallback(() => {
    return getGame().pgn();
  }, [getGame]);

  const getFEN = useCallback(() => {
    return getGame().fen();
  }, [getGame]);

  const isGameOver = gameStatus !== 'active' && gameStatus !== 'check';

  return {
    board,
    currentTurn,
    moveHistory,
    moveHistorySAN,
    capturedPieces,
    gameStatus,
    lastMove,
    settings,
    isGameOver,
    boardOrientation,
    evaluation,
    evaluationHistory,
    newGame,
    undoMove,
    resign,
    setTheme,
    toggleSetting,
    getPGN,
    getFEN,
    getGame,
    flipBoard,
    setEvaluation,
  };
}
