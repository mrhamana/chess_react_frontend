import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { isLightSquare } from '../../utils/boardUtils';
import { FILES, RANKS } from '../../constants/boardConfig';
import './Square.css';

/**
 * Individual square on the chess board.
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
const Square = memo(function Square({
    row,
    col,
    visualRow,
    visualCol,
    isFlipped,
    isSelected,
    isLegalMove,
    isLastMove,
    isCheck,
    hasPiece,
    theme,
    onClick,
    onDragOver,
    onDrop,
    children,
}) {
    const light = isLightSquare(row, col);
    // Show coords at visual edges of the grid
    const showFile = visualRow === 7; // visual bottom row
    const showRank = visualCol === 0; // visual left column

    const bgColor = isLastMove
        ? theme.lastMove
        : light
            ? theme.light
            : theme.dark;

    const squareStyle = {
        backgroundColor: bgColor,
        '--legal-move-color': theme.legalMove,
        '--last-move-color': theme.lastMove,
        '--dark-square': theme.dark,
        '--light-square': theme.light,
    };

    const classNames = [
        'square',
        isSelected && 'square-selected',
        isLastMove && 'square-last-move',
        isCheck && 'square-check',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classNames}
            style={squareStyle}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            data-square={`${FILES[col]}${RANKS[row]}`}
            role="button"
            tabIndex={0}
            aria-label={`Square ${FILES[col]}${RANKS[row]}${hasPiece ? ' with piece' : ''}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Legal move indicators */}
            {isLegalMove && !hasPiece && (
                <motion.div
                    className="legal-move-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                />
            )}
            {isLegalMove && hasPiece && (
                <motion.div
                    className="legal-move-capture"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                />
            )}

            {/* Coordinate labels */}
            {showFile && (
                <span
                    className={`square-label square-label-file ${light ? 'square-label-light' : 'square-label-dark'
                        }`}
                >
                    {FILES[col]}
                </span>
            )}
            {showRank && (
                <span
                    className={`square-label square-label-rank ${light ? 'square-label-light' : 'square-label-dark'
                        }`}
                >
                    {RANKS[row]}
                </span>
            )}

            {/* Piece */}
            {children}
        </div>
    );
});

export default Square;
