import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { groupMoves } from '../../utils/gameHelpers';

const listStyle = {
    background: 'var(--surface)',
    borderRadius: '12px',
    padding: '0.75rem',
    flex: 1,
    overflowY: 'auto',
    maxHeight: '280px',
    minHeight: '120px',
};

const headerStyle = {
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '30px 1fr 1fr',
    gap: '0.25rem',
    padding: '0.2rem 0.3rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Courier New', monospace",
};

const moveNumStyle = {
    color: 'var(--text-secondary)',
    opacity: 0.6,
    fontSize: '0.8rem',
};

const moveStyle = {
    color: 'var(--text)',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '4px',
    transition: 'background 0.15s',
};

const emptyStyle = {
    color: 'var(--text-secondary)',
    textAlign: 'center',
    padding: '2rem 0',
    fontSize: '0.85rem',
    opacity: 0.5,
};

export default function MoveHistory({ moves }) {
    const scrollRef = useRef(null);
    const groupedMoves = groupMoves(moves);

    // Auto-scroll to bottom when new moves added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves.length]);

    return (
        <div style={listStyle} ref={scrollRef}>
            <div style={headerStyle}>Move History</div>
            {groupedMoves.length === 0 ? (
                <div style={emptyStyle}>No moves yet</div>
            ) : (
                groupedMoves.map((pair, idx) => (
                    <motion.div
                        key={idx}
                        style={{
                            ...rowStyle,
                            background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <span style={moveNumStyle}>{pair.number}.</span>
                        <span
                            style={moveStyle}
                            onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                        >
                            {pair.white}
                        </span>
                        <span
                            style={moveStyle}
                            onMouseEnter={(e) => {
                                if (pair.black) e.target.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                        >
                            {pair.black || ''}
                        </span>
                    </motion.div>
                ))
            )}
        </div>
    );
}
