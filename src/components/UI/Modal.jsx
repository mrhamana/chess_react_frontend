import React from 'react';
import { motion } from 'framer-motion';
import King from '../Pieces/King';
import Queen from '../Pieces/Queen';
import Rook from '../Pieces/Rook';
import Bishop from '../Pieces/Bishop';
import Knight from '../Pieces/Knight';

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
};

const modalStyle = {
    background: 'var(--surface)',
    borderRadius: '16px',
    padding: '1.5rem 2rem',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
};

const titleStyle = {
    color: 'var(--text)',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem',
};

const piecesRow = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
};

const pieceBtn = {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    transition: 'all 0.2s',
};

const PROMOTION_PIECES = [
    { type: 'q', Component: Queen, label: 'Queen' },
    { type: 'r', Component: Rook, label: 'Rook' },
    { type: 'b', Component: Bishop, label: 'Bishop' },
    { type: 'n', Component: Knight, label: 'Knight' },
];

/**
 * Modal for pawn promotion piece selection
 */
export default function PromotionModal({ onSelect, color }) {
    return (
        <motion.div
            style={overlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                style={modalStyle}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                <div style={titleStyle}>Choose promotion piece</div>
                <div style={piecesRow}>
                    {PROMOTION_PIECES.map(({ type, Component, label }) => (
                        <motion.button
                            key={type}
                            style={pieceBtn}
                            whileHover={{
                                scale: 1.1,
                                borderColor: 'var(--primary)',
                                background: 'rgba(102,126,234,0.15)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(type)}
                            aria-label={`Promote to ${label}`}
                        >
                            <Component color={color} className="piece-svg" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
