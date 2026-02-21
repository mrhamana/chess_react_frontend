import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
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

    const handleResign = () => {
        if (isMultiplayer && socketCtx?.emitResign) {
            socketCtx.emitResign();
        }
        resign();
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
                <Button onClick={handleResign} variant="danger" size="sm" disabled={isGameOver}>
                    ⚐ Resign
                </Button>
            </div>

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
