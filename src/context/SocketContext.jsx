import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const SocketContext = createContext(null);

/**
 * Connection + matchmaking + game-meta state managed in one provider.
 * Wraps the entire /play route so socket stays alive while playing.
 */
export function SocketProvider({ children }) {
    const socketRef = useRef(null);

    // Connection
    const [connected, setConnected] = useState(false);

    // Player identity (assigned by server on connect)
    const [playerInfo, setPlayerInfo] = useState(null); // { playerId, displayName }

    // Matchmaking state: 'idle' | 'searching' | 'matched'
    const [matchState, setMatchState] = useState('idle');
    const [queuePosition, setQueuePosition] = useState(null);

    // Game meta (populated when a match is found)
    const [gameInfo, setGameInfo] = useState(null);
    // Shape: { gameId, myColor, opponentName, players }

    // Incoming game events forwarded to subscribers
    const gameListenersRef = useRef({});

    // ── Connect on mount, disconnect on unmount ──
    useEffect(() => {
        const socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[socket] connected', socket.id);
            setConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('[socket] disconnected');
            setConnected(false);
        });

        // Server assigns identity
        socket.on('player:created', (data) => {
            console.log('[socket] player:created', data);
            setPlayerInfo(data);
        });

        // Matchmaking flow
        socket.on('matchmaking:searching', (data) => {
            setMatchState('searching');
            setQueuePosition(data.queuePosition);
        });

        socket.on('matchmaking:waiting', (data) => {
            setMatchState('searching');
            setQueuePosition(data.queuePosition);
        });

        socket.on('matchmaking:found', (data) => {
            console.log('[socket] matchmaking:found', data);
            setGameInfo({
                gameId: data.gameId,
                myColor: data.yourColor,       // 'white' | 'black'
                opponentName: data.opponent,
                timeControl: data.timeControl,
            });
            setMatchState('matched');
        });

        socket.on('matchmaking:cancelled', () => {
            setMatchState('idle');
            setQueuePosition(null);
        });

        // In-game events – these are forwarded to whoever subscribes (ChessContext)
        socket.on('game:started', (data) => {
            console.log('[socket] game:started', data);
            setGameInfo((prev) => ({
                ...prev,
                players: data.players,
                initialFEN: data.initialFEN,
            }));
            gameListenersRef.current.onGameStarted?.(data);
        });

        socket.on('game:move', (data) => {
            gameListenersRef.current.onGameMove?.(data);
        });

        socket.on('game:check', (data) => {
            gameListenersRef.current.onGameCheck?.(data);
        });

        socket.on('game:over', (data) => {
            console.log('[socket] game:over', data);
            gameListenersRef.current.onGameOver?.(data);
        });

        socket.on('game:legalMoves', (data) => {
            gameListenersRef.current.onLegalMoves?.(data);
        });

        socket.on('player:disconnected', (data) => {
            gameListenersRef.current.onOpponentDisconnected?.(data);
        });

        socket.on('error', (data) => {
            console.error('[socket] server error:', data);
            gameListenersRef.current.onError?.(data);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    // ── Actions ──

    const joinQueue = useCallback(() => {
        socketRef.current?.emit('matchmaking:join');
    }, []);

    const cancelSearch = useCallback(() => {
        socketRef.current?.emit('matchmaking:cancel');
        setMatchState('idle');
        setQueuePosition(null);
    }, []);

    const emitMove = useCallback((move) => {
        if (!gameInfo?.gameId) return;
        socketRef.current?.emit('game:move', {
            gameId: gameInfo.gameId,
            move,  // { from, to, promotion? }
        });
    }, [gameInfo?.gameId]);

    const emitResign = useCallback(() => {
        if (!gameInfo?.gameId) return;
        socketRef.current?.emit('game:resign', {
            gameId: gameInfo.gameId,
        });
    }, [gameInfo?.gameId]);

    const requestLegalMoves = useCallback((square) => {
        if (!gameInfo?.gameId) return;
        socketRef.current?.emit('game:getLegalMoves', {
            gameId: gameInfo.gameId,
            square,
        });
    }, [gameInfo?.gameId]);

    /** Subscribe game-event listeners (call once from ChessContext). */
    const registerGameListeners = useCallback((listeners) => {
        gameListenersRef.current = listeners;
        return () => { gameListenersRef.current = {}; };
    }, []);

    /** Reset state for a new search (e.g. after game ends, play again). */
    const resetMatchmaking = useCallback(() => {
        setMatchState('idle');
        setQueuePosition(null);
        setGameInfo(null);
    }, []);

    const value = {
        connected,
        playerInfo,
        matchState,
        queuePosition,
        gameInfo,
        joinQueue,
        cancelSearch,
        emitMove,
        emitResign,
        requestLegalMoves,
        registerGameListeners,
        resetMatchmaking,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
    return ctx;
}

export default SocketContext;
