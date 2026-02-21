import React, { useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Square from './Square';
import Piece from '../Pieces/Piece';
import usePieceMovement from '../../hooks/usePieceMovement';
import useChessGame from '../../hooks/useChessGame';
import { BOARD_THEMES } from '../../constants/boardConfig';
import { toAlgebraic } from '../../utils/boardUtils';
import './Board.css';

/**
 * The main 8x8 chess board component with flip support
 */
export default function Board() {
    const { board, currentTurn, gameStatus, lastMove, settings, boardOrientation } = useChessGame();
    const { selectedSquare, legalMoveSquares, handleSquareClick, handleDrop } =
        usePieceMovement();

    const theme = BOARD_THEMES[settings.theme] || BOARD_THEMES.classic;
    const isFlipped = boardOrientation === 'black';

    const onDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const onDrop = useCallback(
        (e, row, col) => {
            e.preventDefault();
            const from = e.dataTransfer.getData('text/plain');
            const to = toAlgebraic(row, col);
            if (from && from !== to) {
                handleDrop(from, to);
            }
        },
        [handleDrop]
    );

    // Determine if king is in check and find its position
    const isInCheck = gameStatus === 'check' || gameStatus === 'checkmate';
    let checkSquare = null;
    if (isInCheck) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && piece.type === 'k' && piece.color === currentTurn) {
                    checkSquare = toAlgebraic(r, c);
                }
            }
        }
    }

    // Build ordered indices based on orientation
    const rowOrder = useMemo(
        () => isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7],
        [isFlipped]
    );
    const colOrder = useMemo(
        () => isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7],
        [isFlipped]
    );

    return (
        <div className="board-wrapper">
            <div
                className="board-grid"
                role="grid"
                aria-label="Chess board"
                data-orientation={boardOrientation}
            >
                <AnimatePresence>
                    {rowOrder.map((rowIdx) =>
                        colOrder.map((colIdx) => {
                            const piece = board[rowIdx][colIdx];
                            const square = toAlgebraic(rowIdx, colIdx);
                            const isSelected = selectedSquare === square;
                            const isLegalMove = legalMoveSquares.includes(square);
                            const isLastMoveSquare =
                                lastMove &&
                                (lastMove.from === square || lastMove.to === square);
                            const isCheck = checkSquare === square;

                            // Visual position in the grid for coordinate labels
                            const visualRow = isFlipped ? 7 - rowIdx : rowIdx;
                            const visualCol = isFlipped ? 7 - colIdx : colIdx;

                            return (
                                <Square
                                    key={square}
                                    row={rowIdx}
                                    col={colIdx}
                                    visualRow={visualRow}
                                    visualCol={visualCol}
                                    isFlipped={isFlipped}
                                    isSelected={isSelected}
                                    isLegalMove={isLegalMove && settings.showLegalMoves}
                                    isLastMove={isLastMoveSquare}
                                    isCheck={isCheck}
                                    hasPiece={!!piece}
                                    theme={theme}
                                    onClick={() => handleSquareClick(square)}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, rowIdx, colIdx)}
                                >
                                    {piece && (
                                        <Piece
                                            key={`${piece.color}${piece.type}-${square}`}
                                            type={piece.type}
                                            color={piece.color}
                                            square={square}
                                            isSelected={isSelected}
                                        />
                                    )}
                                </Square>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
