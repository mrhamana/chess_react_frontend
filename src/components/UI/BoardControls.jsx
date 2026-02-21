import React from 'react';
import { motion } from 'framer-motion';
import './BoardControls.css';

/**
 * Board controls — flip button
 */
export default function BoardControls({ onFlip, isFlipped }) {
    return (
        <div className="board-controls">
            <motion.button
                className="board-ctrl-btn flip-btn"
                onClick={onFlip}
                aria-label="Flip board (F)"
                title="Flip board (F)"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
            >
                <span className={`flip-icon ${isFlipped ? 'flipped' : ''}`}>⟳</span>
                <span className="board-ctrl-label">Flip</span>
            </motion.button>
        </div>
    );
}
