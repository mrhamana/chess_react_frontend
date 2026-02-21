import React from 'react';
import { formatEvaluation, scoreToPawns, getAssessment } from '../../utils/evaluation';

/**
 * Numeric evaluation display — shows the score and assessment text.
 */
export default function EvaluationDisplay({ evaluation }) {
    if (!evaluation) return null;

    const displayText = formatEvaluation(evaluation);
    const pawns = scoreToPawns(evaluation.score);
    const assessment = evaluation.assessment || getAssessment(evaluation.score);
    const isWhiteWinning = evaluation.score > 20;
    const isBlackWinning = evaluation.score < -20;

    let colorClass = 'eval-display-equal';
    if (isWhiteWinning) colorClass = 'eval-display-white';
    if (isBlackWinning) colorClass = 'eval-display-black';

    return (
        <div className="eval-display">
            <span className={`eval-display-score ${colorClass}`}>{displayText}</span>
            <span className="eval-display-assessment">{assessment}</span>
        </div>
    );
}
