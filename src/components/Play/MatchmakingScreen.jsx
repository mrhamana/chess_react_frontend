import React from 'react';
import { motion } from 'framer-motion';
import './MatchmakingScreen.css';

/**
 * Displayed while waiting for an opponent.
 * States: connecting → searching → matched (brief flash before game starts).
 */
export default function MatchmakingScreen({
    connected,
    playerName,
    matchState,
    queuePosition,
    gameInfo,
    onCancel,
}) {
    // ── Still connecting to server ──
    if (!connected) {
        return (
            <div className="matchmaking-screen">
                <motion.div
                    className="matchmaking-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="connecting-text">
                        <span className="spinner-small" />
                        Connecting to server…
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Match found! Show brief VS screen ──
    if (matchState === 'matched' && gameInfo) {
        const myIcon = gameInfo.myColor === 'white' ? '♔' : '♚';
        const opIcon = gameInfo.myColor === 'white' ? '♚' : '♔';

        return (
            <div className="matchmaking-screen">
                <motion.div
                    className="match-found-card"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <div className="match-found-title">Match Found!</div>

                    <div className="match-found-players">
                        <div className="match-player">
                            <div className="match-player-icon">{myIcon}</div>
                            <div className="match-player-name">{playerName}</div>
                            <div className="match-player-color">{gameInfo.myColor}</div>
                        </div>

                        <div className="match-vs">VS</div>

                        <div className="match-player">
                            <div className="match-player-icon">{opIcon}</div>
                            <div className="match-player-name">{gameInfo.opponentName}</div>
                            <div className="match-player-color">
                                {gameInfo.myColor === 'white' ? 'black' : 'white'}
                            </div>
                        </div>
                    </div>

                    <div className="match-starting-text">
                        Starting game
                        <span className="matchmaking-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Searching for opponent ──
    return (
        <div className="matchmaking-screen">
            <motion.div
                className="matchmaking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Animated spinner */}
                <div className="matchmaking-spinner">
                    <div className="spinner-ring" />
                    <div className="spinner-ring" />
                    <div className="spinner-ring" />
                    <div className="spinner-icon">♟</div>
                </div>

                {/* Player name badge */}
                {playerName && (
                    <div className="matchmaking-player-name">
                        Playing as {playerName}
                    </div>
                )}

                <h2 className="matchmaking-title">
                    Finding opponent
                    <span className="matchmaking-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </h2>

                <p className="matchmaking-subtitle">
                    {queuePosition != null && queuePosition > 0
                        ? `Queue position: ${queuePosition}`
                        : 'Waiting for another player to join'}
                </p>

                <motion.button
                    className="matchmaking-cancel-btn"
                    onClick={onCancel}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                >
                    Cancel
                </motion.button>
            </motion.div>
        </div>
    );
}
