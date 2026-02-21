import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { ChessProvider } from '../../context/ChessContext';
import MatchmakingScreen from './MatchmakingScreen';
import GameContainer from '../Game/GameContainer';

/**
 * Orchestrates the full online play flow:
 *   1. Connect to server (automatic via SocketProvider)
 *   2. Join matchmaking queue
 *   3. Show searching / match-found UI
 *   4. Transition to GameContainer when game starts
 */
export default function PlayPage() {
    const navigate = useNavigate();
    const {
        connected,
        playerInfo,
        matchState,
        queuePosition,
        gameInfo,
        joinQueue,
        cancelSearch,
        resetMatchmaking,
    } = useSocket();

    // 'searching' | 'matched' | 'playing'
    const [phase, setPhase] = useState('searching');
    const hasJoinedRef = useRef(false);

    // Auto-join queue once we're connected and have player info
    useEffect(() => {
        if (connected && playerInfo && !hasJoinedRef.current) {
            hasJoinedRef.current = true;
            joinQueue();
        }
    }, [connected, playerInfo, joinQueue]);

    // Transition from matched → playing after a brief delay (show VS screen)
    useEffect(() => {
        if (matchState === 'matched' && phase !== 'playing') {
            setPhase('matched');
            const timer = setTimeout(() => setPhase('playing'), 1800);
            return () => clearTimeout(timer);
        }
    }, [matchState, phase]);

    // Handle cancel
    const handleCancel = useCallback(() => {
        cancelSearch();
        navigate('/');
    }, [cancelSearch, navigate]);

    // When game ends user can return to lobby
    const handlePlayAgain = useCallback(() => {
        hasJoinedRef.current = false;
        resetMatchmaking();
        setPhase('searching');
        // Will re-trigger join in the useEffect above
    }, [resetMatchmaking]);

    // ── Render ──

    if (phase === 'playing' && gameInfo) {
        return (
            <ChessProvider>
                <GameContainer
                    multiplayer
                    onPlayAgain={handlePlayAgain}
                    onHome={() => navigate('/')}
                />
            </ChessProvider>
        );
    }

    // Connecting / searching / match-found screens
    return (
        <MatchmakingScreen
            connected={connected}
            playerName={playerInfo?.displayName}
            matchState={phase === 'matched' ? 'matched' : matchState}
            queuePosition={queuePosition}
            gameInfo={gameInfo}
            onCancel={handleCancel}
        />
    );
}
