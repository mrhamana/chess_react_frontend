import React, { memo, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import King from './King';
import Queen from './Queen';
import Rook from './Rook';
import Bishop from './Bishop';
import Knight from './Knight';
import Pawn from './Pawn';
import './Piece.css';

const PIECE_COMPONENTS = {
    k: King,
    q: Queen,
    r: Rook,
    b: Bishop,
    n: Knight,
    p: Pawn,
};

// Detect touch device once at module level
const IS_TOUCH_DEVICE =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/**
 * Renders a chess piece SVG with drag-and-drop and animation support.
 * On touch devices, disables HTML5 drag to allow click-to-move.
 */
const Piece = memo(function Piece({ type, color, square, isSelected }) {
    const [isDragging, setIsDragging] = useState(false);

    // All hooks must be called before any conditional return
    const handleDragStart = useCallback(
        (e) => {
            if (IS_TOUCH_DEVICE) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData('text/plain', square);
            e.dataTransfer.effectAllowed = 'move';
            setIsDragging(true);
        },
        [square]
    );

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const PieceIcon = PIECE_COMPONENTS[type];
    if (!PieceIcon) return null;

    return (
        <motion.div
            className={`piece-wrapper ${isSelected ? 'piece-selected' : ''} ${isDragging ? 'dragging' : ''}`}
            draggable={!IS_TOUCH_DEVICE}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.3,
            }}
            aria-label={`${color === 'w' ? 'White' : 'Black'} ${type}`}
        >
            <PieceIcon color={color} className="piece-svg" />
        </motion.div>
    );
});

export default Piece;
