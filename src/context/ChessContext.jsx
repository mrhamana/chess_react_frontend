import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ACTION_TYPES, GAME_STATUS } from '../constants/gameRules';
import { getGameStatus } from '../utils/chessLogic';
import { getCapturedPieces } from '../utils/gameHelpers';

const ChessContext = createContext(null);

// Initial state
function createInitialState() {
    const game = new Chess();
    return {
        fen: game.fen(),
        board: game.board(),
        currentTurn: 'w',
        moveHistory: [],
        moveHistorySAN: [],
        capturedPieces: { w: [], b: [] },
        selectedSquare: null,
        legalMoves: [],
        gameStatus: GAME_STATUS.ACTIVE,
        lastMove: null,
        pendingPromotion: null,
        boardOrientation: 'white',
        evaluation: null,
        evaluationHistory: [],
        settings: {
            theme: 'classic',
            soundEnabled: true,
            showLegalMoves: true,
            showEvaluationBar: true,
        },
    };
}

// Reducer
function chessReducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.SELECT_SQUARE: {
            const { square, game } = action.payload;
            const piece = game.get(square);

            // If clicking on own piece, select it
            if (piece && piece.color === game.turn()) {
                const moves = game.moves({ square, verbose: true });
                return {
                    ...state,
                    selectedSquare: square,
                    legalMoves: moves,
                };
            }

            return state;
        }

        case ACTION_TYPES.CLEAR_SELECTION:
            return {
                ...state,
                selectedSquare: null,
                legalMoves: [],
            };

        case ACTION_TYPES.MAKE_MOVE: {
            const { game, move } = action.payload;
            const history = game.history({ verbose: true });
            const historySAN = game.history();
            const captured = getCapturedPieces(history);
            const status = getGameStatus(game);

            return {
                ...state,
                fen: game.fen(),
                board: game.board(),
                currentTurn: game.turn(),
                moveHistory: history,
                moveHistorySAN: historySAN,
                capturedPieces: captured,
                selectedSquare: null,
                legalMoves: [],
                gameStatus: status,
                lastMove: { from: move.from, to: move.to },
                pendingPromotion: null,
            };
        }

        case ACTION_TYPES.PROMOTE_PAWN: {
            return {
                ...state,
                pendingPromotion: action.payload,
            };
        }

        case ACTION_TYPES.NEW_GAME: {
            return createInitialState();
        }

        case ACTION_TYPES.UNDO_MOVE: {
            const { game } = action.payload;
            const history = game.history({ verbose: true });
            const historySAN = game.history();
            const captured = getCapturedPieces(history);
            const status = getGameStatus(game);
            const lastVerbose = history[history.length - 1];

            return {
                ...state,
                fen: game.fen(),
                board: game.board(),
                currentTurn: game.turn(),
                moveHistory: history,
                moveHistorySAN: historySAN,
                capturedPieces: captured,
                selectedSquare: null,
                legalMoves: [],
                gameStatus: status,
                lastMove: lastVerbose ? { from: lastVerbose.from, to: lastVerbose.to } : null,
            };
        }

        case ACTION_TYPES.RESIGN: {
            return {
                ...state,
                gameStatus: GAME_STATUS.RESIGNED,
                selectedSquare: null,
                legalMoves: [],
            };
        }

        case ACTION_TYPES.SET_THEME: {
            return {
                ...state,
                settings: { ...state.settings, theme: action.payload },
            };
        }

        case ACTION_TYPES.TOGGLE_SETTING: {
            const key = action.payload;
            return {
                ...state,
                settings: { ...state.settings, [key]: !state.settings[key] },
            };
        }

        case ACTION_TYPES.FLIP_BOARD: {
            return {
                ...state,
                boardOrientation: state.boardOrientation === 'white' ? 'black' : 'white',
            };
        }

        case ACTION_TYPES.SET_EVALUATION: {
            const { evaluation } = action.payload;
            return {
                ...state,
                evaluation,
                evaluationHistory: [
                    ...state.evaluationHistory,
                    { move: state.moveHistorySAN.length, eval: evaluation, fen: state.fen },
                ],
            };
        }

        default:
            return state;
    }
}

// Provider
export function ChessProvider({ children }) {
    const [state, dispatch] = useReducer(chessReducer, null, createInitialState);
    const gameRef = useRef(new Chess());

    // Sync game ref with state
    useEffect(() => {
        if (gameRef.current.fen() !== state.fen) {
            gameRef.current.load(state.fen);
        }
    }, [state.fen]);

    const selectSquare = useCallback((square) => {
        dispatch({
            type: ACTION_TYPES.SELECT_SQUARE,
            payload: { square, game: gameRef.current },
        });
    }, []);

    const clearSelection = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_SELECTION });
    }, []);

    const makeMove = useCallback((from, to, promotion = 'q') => {
        try {
            const move = gameRef.current.move({ from, to, promotion });
            if (move) {
                dispatch({
                    type: ACTION_TYPES.MAKE_MOVE,
                    payload: { game: gameRef.current, move },
                });
                return move;
            }
        } catch {
            return null;
        }
        return null;
    }, []);

    const requestPromotion = useCallback((from, to) => {
        dispatch({
            type: ACTION_TYPES.PROMOTE_PAWN,
            payload: { from, to },
        });
    }, []);

    const needsPromotion = useCallback((from, to) => {
        const piece = gameRef.current.get(from);
        if (!piece || piece.type !== 'p') return false;
        const toRank = to[1];
        return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
    }, []);

    const newGame = useCallback(() => {
        gameRef.current = new Chess();
        dispatch({ type: ACTION_TYPES.NEW_GAME });
    }, []);

    const undoMove = useCallback(() => {
        const undone = gameRef.current.undo();
        if (undone) {
            dispatch({
                type: ACTION_TYPES.UNDO_MOVE,
                payload: { game: gameRef.current },
            });
        }
        return undone;
    }, []);

    const resign = useCallback(() => {
        dispatch({ type: ACTION_TYPES.RESIGN });
    }, []);

    const setTheme = useCallback((theme) => {
        dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme });
    }, []);

    const toggleSetting = useCallback((key) => {
        dispatch({ type: ACTION_TYPES.TOGGLE_SETTING, payload: key });
    }, []);

    const getGame = useCallback(() => gameRef.current, []);

    const flipBoard = useCallback(() => {
        dispatch({ type: ACTION_TYPES.FLIP_BOARD });
    }, []);

    const setEvaluation = useCallback((evaluation) => {
        dispatch({ type: ACTION_TYPES.SET_EVALUATION, payload: { evaluation } });
    }, []);

    const value = {
        ...state,
        selectSquare,
        clearSelection,
        makeMove,
        requestPromotion,
        needsPromotion,
        newGame,
        undoMove,
        resign,
        setTheme,
        toggleSetting,
        getGame,
        flipBoard,
        setEvaluation,
    };

    return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
}

export function useChess() {
    const context = useContext(ChessContext);
    if (!context) {
        throw new Error('useChess must be used within a ChessProvider');
    }
    return context;
}

export default ChessContext;
