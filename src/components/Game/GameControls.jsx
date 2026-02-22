import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import useChessGame from '../../hooks/useChessGame';
import { BOARD_THEMES } from '../../constants/boardConfig';
import SocketContext from '../../context/SocketContext';
import { useChess } from '../../context/ChessContext';

const controlsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
    background: 'var(--surface)',
    borderRadius: '12px',
    padding: '0.75rem',
};

const rowStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
};

const resignBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.65rem 1.2rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    fontFamily: 'inherit',
    color: '#fff',
    background: 'linear-gradient(135deg, #ff5252, #d32f2f)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(255, 82, 82, 0.35)',
    letterSpacing: '0.02em',
    transition: 'all 0.2s',
};

const resignBtnDisabled = {
    ...resignBtnStyle,
    opacity: 0.35,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    boxShadow: 'none',
};

/* Confirm overlay styles */
const confirmOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
};

const confirmCard = {
    background: 'var(--surface, #16213e)',
    borderRadius: '18px',
    padding: '2rem 2.5rem',
    textAlign: 'center',
    boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    maxWidth: '360px',
    width: '90vw',
};

const sectionHeader = {
    color: 'var(--text)',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginTop: '0.4rem',
};

const themeBtn = {
    padding: '0.35rem 0.65rem',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text)',
};

const themeBtnActive = {
    ...themeBtn,
    borderColor: 'var(--primary)',
    background: 'rgba(102, 126, 234, 0.15)',
};

const toggleRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.3rem 0',
};

const toggleLabel = {
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
};

export default function GameControls() {
    const {
        settings,
        isGameOver,
        newGame,
        resign,
        setTheme,
        toggleSetting,
        getPGN,
    } = useChessGame();

    const { isMultiplayer } = useChess();
    const socketCtx = useContext(SocketContext);

    const [copied, setCopied] = useState(false);
    const [showResignConfirm, setShowResignConfirm] = useState(false);

    const handleResignClick = () => {
        setShowResignConfirm(true);
    };

    const confirmResign = () => {
        setShowResignConfirm(false);
        if (isMultiplayer && socketCtx?.emitResign) {
            socketCtx.emitResign();
        }
        resign();
    };

    const cancelResign = () => {
        setShowResignConfirm(false);
    };

    const handleCopyPGN = async () => {
        try {
            await navigator.clipboard.writeText(getPGN());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const ta = document.createElement('textarea');
            ta.value = getPGN();
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div style={controlsStyle}>
            {/* Game actions */}
            <div style={rowStyle}>
                {!isMultiplayer && (
                    <Button onClick={newGame} variant="primary" size="sm">
                        ⟳ New Game
                    </Button>
                )}
            </div>

            {/* Resign button — prominent standalone */}
            <motion.button
                style={isGameOver ? resignBtnDisabled : resignBtnStyle}
                onClick={handleResignClick}
                disabled={isGameOver}
                whileHover={!isGameOver ? { scale: 1.03, boxShadow: '0 6px 24px rgba(255, 82, 82, 0.5)' } : {}}
                whileTap={!isGameOver ? { scale: 0.96 } : {}}
            >
                <span style={{ fontSize: '1.1rem' }}>⚑</span> Resign
            </motion.button>

            {/* Resign confirmation modal */}
            <AnimatePresence>
                {showResignConfirm && (
                    <motion.div
                        style={confirmOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.target === e.currentTarget && cancelResign()}
                    >
                        <motion.div
                            style={confirmCard}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>⚑</div>
                            <h3 style={{ color: 'var(--text, #e0e0e0)', fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                                Resign this game?
                            </h3>
                            <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                This will count as a loss. Are you sure?
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                <Button onClick={cancelResign} variant="secondary" size="md">
                                    Cancel
                                </Button>
                                <Button onClick={confirmResign} variant="danger" size="md"
                                    style={{ background: 'linear-gradient(135deg, #ff5252, #d32f2f)', color: '#fff', border: 'none', boxShadow: '0 4px 15px rgba(255,82,82,0.35)' }}>
                                    Yes, Resign
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Copy PGN */}
            <div style={rowStyle}>
                <Button onClick={handleCopyPGN} variant="ghost" size="sm">
                    {copied ? '✓ Copied!' : '📋 Copy PGN'}
                </Button>
            </div>

            {/* Theme Selection */}
            <div style={sectionHeader}>Board Theme</div>
            <div style={rowStyle}>
                {Object.keys(BOARD_THEMES).map((themeName) => (
                    <button
                        key={themeName}
                        style={settings.theme === themeName ? themeBtnActive : themeBtn}
                        onClick={() => setTheme(themeName)}
                    >
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                ))}
            </div>

            {/* Toggles */}
            <div style={toggleRow}>
                <span style={toggleLabel}>Show legal moves</span>
                <Toggle
                    isOn={settings.showLegalMoves}
                    onToggle={() => toggleSetting('showLegalMoves')}
                />
            </div>
            <div style={toggleRow}>
                <span style={toggleLabel}>Sound effects</span>
                <Toggle
                    isOn={settings.soundEnabled}
                    onToggle={() => toggleSetting('soundEnabled')}
                />
            </div>

            {/* Keyboard shortcuts hint */}
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.6 }}>
                Shortcuts: <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px' }}>F</kbd> Flip board
            </div>
        </div>
    );
}

/** Simple toggle switch */
function Toggle({ isOn, onToggle }) {
    return (
        <div
            onClick={onToggle}
            style={{
                width: '40px',
                height: '22px',
                background: isOn ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                borderRadius: '11px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
            }}
            role="switch"
            aria-checked={isOn}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onToggle(); }}
        >
            <motion.div
                style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '2px',
                }}
                animate={{ left: isOn ? '20px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </div>
    );
}
