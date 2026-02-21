import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    formatEvaluation,
    scoreToPawns,
    getPositionInsights,
    getMaterialCounts,
} from '../../utils/evaluation';
import { PIECE_UNICODE } from '../../constants/pieceValues';
import './PositionAnalysis.css';

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'];

/**
 * Hover tooltip / panel showing detailed position breakdown.
 */
export default function PositionAnalysis({ evaluation, board, isOpen, onToggle }) {
    const insights = useMemo(() => getPositionInsights(evaluation), [evaluation]);
    const materialCounts = useMemo(() => (board ? getMaterialCounts(board) : null), [board]);

    if (!evaluation) return null;

    const pawns = scoreToPawns(evaluation.score);
    const displayScore = formatEvaluation(evaluation);

    return (
        <div className="position-analysis-wrapper">
            <button
                className="position-analysis-toggle"
                onClick={onToggle}
                aria-label="Toggle position analysis"
                title="Position analysis"
            >
                <span className="analysis-icon">📊</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="position-analysis-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Score header */}
                        <div className="pa-header">
                            <span className="pa-score">{displayScore}</span>
                            <span className="pa-assessment">{evaluation.assessment}</span>
                        </div>

                        {/* Material counts */}
                        {materialCounts && (
                            <div className="pa-section">
                                <div className="pa-section-title">Material</div>
                                <div className="pa-material-row">
                                    <span className="pa-side-label">W</span>
                                    <div className="pa-pieces">
                                        {PIECE_ORDER.map((type) =>
                                            materialCounts.w[type]
                                                ? <span key={type} className="pa-piece-count">
                                                    {PIECE_UNICODE[`w${type}`]}{materialCounts.w[type] > 1 ? `×${materialCounts.w[type]}` : ''}
                                                </span>
                                                : null
                                        )}
                                    </div>
                                </div>
                                <div className="pa-material-row">
                                    <span className="pa-side-label">B</span>
                                    <div className="pa-pieces">
                                        {PIECE_ORDER.map((type) =>
                                            materialCounts.b[type]
                                                ? <span key={type} className="pa-piece-count">
                                                    {PIECE_UNICODE[`b${type}`]}{materialCounts.b[type] > 1 ? `×${materialCounts.b[type]}` : ''}
                                                </span>
                                                : null
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Breakdown */}
                        <div className="pa-section">
                            <div className="pa-section-title">Breakdown</div>
                            <div className="pa-breakdown">
                                <BreakdownRow label="Material" value={evaluation.material} />
                                <BreakdownRow label="Positional" value={evaluation.positional} />
                                <BreakdownRow label="Center" value={evaluation.center} />
                                <BreakdownRow label="Mobility" value={evaluation.mobility} />
                                <BreakdownRow label="Pawns" value={evaluation.pawnStructure} />
                                <BreakdownRow label="King Safety" value={evaluation.kingSafety} />
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="pa-section">
                            <div className="pa-section-title">Insights</div>
                            <ul className="pa-insights">
                                {insights.map((ins, i) => (
                                    <li key={i}>{ins}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function BreakdownRow({ label, value }) {
    const cp = value ?? 0;
    const pawns = (cp / 100).toFixed(2);
    const color = cp > 5 ? '#4caf50' : cp < -5 ? '#f44336' : 'var(--text-secondary)';
    return (
        <div className="pa-bd-row">
            <span className="pa-bd-label">{label}</span>
            <span className="pa-bd-value" style={{ color }}>
                {cp > 0 ? '+' : ''}{pawns}
            </span>
        </div>
    );
}
