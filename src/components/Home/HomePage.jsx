import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// Starting position pieces for the decorative board
const STARTING_POSITION = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

// Unicode piece map
const PIECE_MAP = {
    wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
    bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <div className="home-center">
                {/* Title */}
                <motion.h1
                    className="home-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Saug Chess
                </motion.h1>

                {/* Decorative board */}
                <motion.div
                    className="home-board-wrapper"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="home-board">
                        {STARTING_POSITION.map((row, r) =>
                            row.map((piece, c) => {
                                const isLight = (r + c) % 2 === 0;
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`home-square ${isLight ? 'home-square-light' : 'home-square-dark'}`}
                                    >
                                        {piece && (
                                            <span className={`home-piece ${piece[0] === 'w' ? 'home-piece-white' : 'home-piece-black'}`}>
                                                {PIECE_MAP[piece]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Play button below the board */}
                <motion.button
                    className="home-play-btn"
                    onClick={() => navigate('/play')}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <span className="home-play-icon">▶</span>
                    Play
                </motion.button>
            </div>
        </div>
    );
}
