import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getEvalBarPercent, formatEvaluation, scoreToPawns } from '../../utils/evaluation';
import './EvaluationBar.css';

/**
 * Vertical evaluation bar — white section grows/shrinks based on evaluation.
 * The bar reads top-to-bottom: white section on top, black on bottom.
 */
export default function EvaluationBar({ evaluation, visible = true }) {
    const whitePercent = useMemo(
        () => getEvalBarPercent(evaluation?.score ?? 0),
        [evaluation?.score]
    );

    const displayText = useMemo(
        () => formatEvaluation(evaluation),
        [evaluation]
    );

    const isWhiteAdvantage = (evaluation?.score ?? 0) >= 0;
    const pawns = scoreToPawns(evaluation?.score ?? 0);
    const isMate = evaluation?.mateIn !== null && evaluation?.mateIn !== undefined;

    if (!visible) return null;

    return (
        <div className="eval-bar" role="meter" aria-label="Position evaluation" aria-valuenow={pawns}>
            {/* White section (top) */}
            <motion.div
                className="eval-bar-white"
                initial={false}
                animate={{ height: `${whitePercent}%` }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Black section fills rest */}
            <div className="eval-bar-black" />

            {/* Center line */}
            <div className="eval-bar-center-line" />

            {/* Score label */}
            <motion.div
                className={`eval-bar-label ${isWhiteAdvantage ? 'eval-label-bottom' : 'eval-label-top'}`}
                key={displayText}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
            >
                <span className={`eval-score ${isMate ? 'eval-score-mate' : ''}`}>
                    {displayText}
                </span>
            </motion.div>

            {/* Glow effect on big eval swings */}
            {Math.abs(pawns) > 3 && (
                <motion.div
                    className={`eval-bar-glow ${isWhiteAdvantage ? 'glow-white' : 'glow-black'}`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </div>
    );
}
