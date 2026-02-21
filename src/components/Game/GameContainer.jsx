import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import Board from '../Board/Board';
import MoveHistory from './MoveHistory';
import CapturedPieces from './CapturedPieces';
import GameControls from './GameControls';
import PromotionModal from '../UI/Modal';
import Button from '../UI/Button';
import BoardControls from '../UI/BoardControls';
import useChessGame from '../../hooks/useChessGame';
import usePieceMovement from '../../hooks/usePieceMovement';
import { getGameResultText } from '../../utils/gameHelpers';
import './GameContainer.css';

export default function GameContainer() {
    const {
        board,
        currentTurn,
        moveHistorySAN,
        capturedPieces,
        gameStatus,
        isGameOver,
        boardOrientation,
        settings,
        newGame,
        flipBoard,
        toggleSetting,
        getGame,
    } = useChessGame();

    const { pendingPromotion, handlePromotion } = usePieceMovement();
    const [showConfetti, setShowConfetti] = useState(false);

    const isFlipped = boardOrientation === 'black';

    // --- Keyboard shortcuts ---
    useEffect(() => {
        function handleKey(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                flipBoard();
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [flipBoard]);

    // --- Confetti on checkmate ---
    useEffect(() => {
        if (gameStatus === 'checkmate') {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [gameStatus]);

    const handleNewGame = useCallback(() => {
        newGame();
        setShowConfetti(false);
    }, [newGame]);

    // Player cards - swap order when board is flipped
    const topColor = isFlipped ? 'w' : 'b';
    const bottomColor = isFlipped ? 'b' : 'w';

    const topCard = (
        <div className={`player-card ${currentTurn === topColor ? 'active' : ''}`}>
            <div className={`player-avatar ${topColor === 'w' ? 'white' : 'black'}`}>
                {topColor === 'w' ? '\u2654' : '\u265A'}
            </div>
            <div className="player-info">
                <div className="player-name">{topColor === 'w' ? 'White' : 'Black'}</div>
                <CapturedPieces
                    pieces={capturedPieces[topColor]}
                    color={topColor}
                    opponentPieces={capturedPieces[bottomColor]}
                />
            </div>
        </div>
    );

    const bottomCard = (
        <div className={`player-card ${currentTurn === bottomColor ? 'active' : ''}`}>
            <div className={`player-avatar ${bottomColor === 'w' ? 'white' : 'black'}`}>
                {bottomColor === 'w' ? '\u2654' : '\u265A'}
            </div>
            <div className="player-info">
                <div className="player-name">{bottomColor === 'w' ? 'White' : 'Black'}</div>
                <CapturedPieces
                    pieces={capturedPieces[bottomColor]}
                    color={bottomColor}
                    opponentPieces={capturedPieces[topColor]}
                />
            </div>
        </div>
    );

    return (
        <div className="game-container">
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

            {/* Board column */}
            <div className="game-board-area">
                {/* Board controls row */}
                <div className="game-board-toolbar">
                    <BoardControls
                        onFlip={flipBoard}
                        isFlipped={isFlipped}
                    />
                </div>

                <div className="game-board-with-eval">
                    {/* Board section */}
                    <div className="game-board-section">
                        {topCard}
                        <Board />
                        {bottomCard}
                    </div>
                </div>
            </div>

            {/* Right: Info panel */}
            <div className="game-info-panel">
                <div className="turn-indicator">
                    {isGameOver ? (
                        <strong>{getGameResultText(gameStatus, currentTurn)}</strong>
                    ) : (
                        <>
                            <strong>{currentTurn === 'w' ? 'White' : 'Black'}</strong> to move
                            {gameStatus === 'check' && (
                                <span style={{ color: 'var(--check)', marginLeft: '8px' }}>Check!</span>
                            )}
                        </>
                    )}
                </div>

                <GameControls />
                <MoveHistory moves={moveHistorySAN} />
            </div>

            {/* Promotion Modal */}
            <AnimatePresence>
                {pendingPromotion && (
                    <PromotionModal onSelect={handlePromotion} color={currentTurn} />
                )}
            </AnimatePresence>

            {/* Game Over Overlay */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        className="game-status-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.target === e.currentTarget && handleNewGame()}
                    >
                        <motion.div
                            className="game-status-card"
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <h2>
                                {gameStatus === 'checkmate'
                                    ? '\u265B Checkmate!'
                                    : gameStatus === 'stalemate'
                                        ? '\u00BD Stalemate'
                                        : gameStatus === 'draw'
                                            ? '\u00BD Draw'
                                            : 'Game Over'}
                            </h2>
                            <p>{getGameResultText(gameStatus, currentTurn)}</p>
                            <div className="game-status-actions">
                                <Button onClick={handleNewGame} variant="primary">
                                    New Game
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
