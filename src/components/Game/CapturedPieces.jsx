import React from 'react';
import { PIECE_UNICODE, PIECE_VALUES } from '../../constants/pieceValues';

const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    minHeight: '20px',
    flexWrap: 'wrap',
};

const pieceStyle = {
    fontSize: '0.85rem',
    lineHeight: 1,
    opacity: 0.8,
};

const advantageStyle = {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--primary)',
    marginLeft: '4px',
};

// Sort order for display
const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'];

/**
 * Displays captured pieces for one side with material advantage.
 * `pieces` = pieces captured BY this side (i.e., opponent's pieces)
 * `opponentPieces` = pieces captured by the opponent (i.e., this side's pieces)
 */
export default function CapturedPieces({ pieces, color, opponentPieces }) {
    // Sort pieces by value (descending)
    const sorted = [...pieces].sort(
        (a, b) =>
            PIECE_ORDER.indexOf(a.type) - PIECE_ORDER.indexOf(b.type)
    );

    // Calculate material difference
    const myCaptures = pieces.reduce((s, p) => s + (PIECE_VALUES[p.type] || 0), 0);
    const opCaptures = opponentPieces.reduce((s, p) => s + (PIECE_VALUES[p.type] || 0), 0);
    const advantage = myCaptures - opCaptures;

    return (
        <div style={wrapperStyle}>
            {sorted.map((p, i) => {
                const key = `${p.color}${p.type}`;
                return (
                    <span key={i} style={pieceStyle}>
                        {PIECE_UNICODE[key] || '?'}
                    </span>
                );
            })}
            {advantage > 0 && <span style={advantageStyle}>+{advantage}</span>}
        </div>
    );
}
