/**
 * Chess Position Evaluation Engine
 * Evaluates positions using material, positional bonuses, center control,
 * king safety, pawn structure, and piece mobility.
 *
 * Positive = white advantage, Negative = black advantage
 */

const PIECE_BASE_VALUES = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 0,
};

// Piece-square tables (from white's perspective, index 0 = a8)
// Values encourage good piece placement
const PST = {
  p: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
  ],
  // Endgame king table — encourages king activity
  k_end: [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50,
  ],
};

/** Mirror index for black (flip vertically) */
function mirrorIndex(i) {
  const row = Math.floor(i / 8);
  const col = i % 8;
  return (7 - row) * 8 + col;
}

/** Check if game is in endgame phase */
function isEndgame(board) {
  let queens = 0;
  let minorMajor = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      if (p.type === 'q') queens++;
      if (p.type === 'r' || p.type === 'b' || p.type === 'n') minorMajor++;
    }
  }
  return queens === 0 || (queens <= 2 && minorMajor <= 4);
}

/**
 * Calculate material + piece-square table score
 */
function evaluateMaterial(board) {
  let score = 0;
  const endgame = isEndgame(board);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const idx = r * 8 + c;
      const baseVal = PIECE_BASE_VALUES[piece.type];
      let pstTable = PST[piece.type];

      // Use endgame king table
      if (piece.type === 'k' && endgame) {
        pstTable = PST.k_end;
      }

      if (piece.color === 'w') {
        score += baseVal + pstTable[idx];
      } else {
        score -= baseVal + pstTable[mirrorIndex(idx)];
      }
    }
  }
  return score;
}

/** Center control bonus (d4, d5, e4, e5) */
function evaluateCenterControl(game) {
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  const extendedCenter = ['c3', 'c4', 'c5', 'c6', 'd3', 'd6', 'e3', 'e6', 'f3', 'f4', 'f5', 'f6'];
  let score = 0;

  for (const sq of centerSquares) {
    const piece = game.get(sq);
    if (piece) {
      const bonus = piece.type === 'p' ? 15 : 10;
      score += piece.color === 'w' ? bonus : -bonus;
    }
  }

  for (const sq of extendedCenter) {
    const piece = game.get(sq);
    if (piece) {
      score += piece.color === 'w' ? 3 : -3;
    }
  }

  return score;
}

/** Mobility — count available legal moves */
function evaluateMobility(game) {
  // Current side's moves
  const currentMoves = game.moves().length;
  const turn = game.turn();

  // We approximate opponent's mobility as similar (avoiding toggling turns)
  // Simple: give bonus for current side having more options
  const mobilityBonus = currentMoves * 2;
  return turn === 'w' ? mobilityBonus : -mobilityBonus;
}

/** Pawn structure evaluation */
function evaluatePawnStructure(board) {
  let score = 0;
  const whitePawnFiles = [];
  const blackPawnFiles = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.type !== 'p') continue;
      if (piece.color === 'w') {
        whitePawnFiles.push(c);
        // Passed pawn bonus (no opposing pawns ahead on same or adjacent files)
        let passed = true;
        for (let rr = r - 1; rr >= 0; rr--) {
          for (let cc = Math.max(0, c - 1); cc <= Math.min(7, c + 1); cc++) {
            const bp = board[rr][cc];
            if (bp && bp.type === 'p' && bp.color === 'b') passed = false;
          }
        }
        if (passed) score += 20 + (7 - r) * 10; // More bonus closer to promotion
      } else {
        blackPawnFiles.push(c);
        let passed = true;
        for (let rr = r + 1; rr < 8; rr++) {
          for (let cc = Math.max(0, c - 1); cc <= Math.min(7, c + 1); cc++) {
            const wp = board[rr][cc];
            if (wp && wp.type === 'p' && wp.color === 'w') passed = false;
          }
        }
        if (passed) score -= 20 + r * 10;
      }
    }
  }

  // Doubled pawns penalty
  const wFileCounts = {};
  const bFileCounts = {};
  whitePawnFiles.forEach(f => { wFileCounts[f] = (wFileCounts[f] || 0) + 1; });
  blackPawnFiles.forEach(f => { bFileCounts[f] = (bFileCounts[f] || 0) + 1; });

  for (const f in wFileCounts) {
    if (wFileCounts[f] > 1) score -= 15 * (wFileCounts[f] - 1);
  }
  for (const f in bFileCounts) {
    if (bFileCounts[f] > 1) score += 15 * (bFileCounts[f] - 1);
  }

  // Isolated pawns penalty
  for (const f of whitePawnFiles) {
    const hasNeighbor = whitePawnFiles.some(ff => Math.abs(ff - f) === 1);
    if (!hasNeighbor) score -= 10;
  }
  for (const f of blackPawnFiles) {
    const hasNeighbor = blackPawnFiles.some(ff => Math.abs(ff - f) === 1);
    if (!hasNeighbor) score += 10;
  }

  return score;
}

/** Bishop pair bonus */
function evaluateBishopPair(board) {
  let wBishops = 0, bBishops = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      if (p.type === 'b') {
        if (p.color === 'w') wBishops++;
        else bBishops++;
      }
    }
  }
  let score = 0;
  if (wBishops >= 2) score += 30;
  if (bBishops >= 2) score -= 30;
  return score;
}

/** King safety — penalty for exposed king */
function evaluateKingSafety(board) {
  let score = 0;

  // Find kings
  let wKing = null, bKing = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k') {
        if (p.color === 'w') wKing = { r, c };
        else bKing = { r, c };
      }
    }
  }

  // Pawn shield bonus
  function pawnShield(king, color, board) {
    let shield = 0;
    const dir = color === 'w' ? -1 : 1;
    for (let dc = -1; dc <= 1; dc++) {
      const r = king.r + dir;
      const c = king.c + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const p = board[r][c];
        if (p && p.type === 'p' && p.color === color) shield += 15;
      }
    }
    return shield;
  }

  if (wKing) score += pawnShield(wKing, 'w', board);
  if (bKing) score -= pawnShield(bKing, 'b', board);

  return score;
}

/**
 * Main evaluation function.
 * @param {import('chess.js').Chess} game - Chess.js game instance
 * @returns {{ score: number, material: number, positional: number, center: number, mobility: number, pawnStructure: number, kingSafety: number, assessment: string }}
 */
export function evaluatePosition(game) {
  // Checkmate / stalemate
  if (game.isCheckmate()) {
    const winner = game.turn() === 'w' ? -1 : 1;
    return {
      score: winner * 9999,
      material: 0,
      positional: 0,
      center: 0,
      mobility: 0,
      pawnStructure: 0,
      kingSafety: 0,
      assessment: winner > 0 ? 'White checkmate' : 'Black checkmate',
      mateIn: 0,
    };
  }

  if (game.isStalemate() || game.isDraw()) {
    return {
      score: 0,
      material: 0,
      positional: 0,
      center: 0,
      mobility: 0,
      pawnStructure: 0,
      kingSafety: 0,
      assessment: 'Draw',
      mateIn: null,
    };
  }

  const board = game.board();

  const material = evaluateMaterial(board);
  const center = evaluateCenterControl(game);
  const mobility = evaluateMobility(game);
  const pawnStructure = evaluatePawnStructure(board);
  const kingSafety = evaluateKingSafety(board);
  const bishopPair = evaluateBishopPair(board);

  // Weighted combination — material is dominant
  const positional = center + kingSafety + bishopPair;
  const score = material + positional + mobility * 0.5 + pawnStructure * 0.8;

  return {
    score,
    material,
    positional,
    center,
    mobility,
    pawnStructure,
    kingSafety,
    assessment: getAssessment(score),
    mateIn: null,
  };
}

/**
 * Convert centipawn score to pawn units for display (e.g. +2.5)
 */
export function scoreToPawns(centipawnScore) {
  return centipawnScore / 100;
}

/**
 * Get text assessment label
 */
export function getAssessment(centipawnScore) {
  const pawns = Math.abs(centipawnScore / 100);
  const side = centipawnScore > 0 ? 'White' : 'Black';

  if (Math.abs(centipawnScore) >= 9000) return `${side} checkmate`;
  if (pawns < 0.2) return 'Equal';
  if (pawns < 1.0) return `Slight ${side.toLowerCase()} advantage`;
  if (pawns < 3.0) return `${side} advantage`;
  if (pawns < 5.0) return `${side} winning`;
  return `${side} decisive advantage`;
}

/**
 * Format evaluation score for display
 */
export function formatEvaluation(evalResult) {
  if (!evalResult) return '0.0';
  if (evalResult.mateIn !== null && evalResult.mateIn !== undefined) {
    if (evalResult.mateIn === 0) return 'M0';
    return `M${Math.abs(evalResult.mateIn)}`;
  }
  const pawns = scoreToPawns(evalResult.score);
  const abs = Math.abs(pawns).toFixed(1);
  if (pawns > 0.05) return `+${abs}`;
  if (pawns < -0.05) return `-${abs}`;
  return '0.0';
}

/**
 * Get the evaluation bar percentage for white section height
 * Returns 0-100 (percentage of white from top)
 */
export function getEvalBarPercent(centipawnScore) {
  if (centipawnScore >= 9000) return 100;
  if (centipawnScore <= -9000) return 0;

  // Sigmoid-like mapping: ±5 pawns maps to ~5%/95%
  const pawns = centipawnScore / 100;
  const percent = 50 + 50 * (2 / (1 + Math.exp(-0.5 * pawns)) - 1);
  return Math.max(2, Math.min(98, percent));
}

/**
 * Get material counts for both sides
 */
export function getMaterialCounts(board) {
  const counts = { w: {}, b: {} };
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.type === 'k') continue;
      counts[p.color][p.type] = (counts[p.color][p.type] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Get key insights about the position
 */
export function getPositionInsights(evalResult) {
  const insights = [];
  if (!evalResult) return insights;

  const { material, center, mobility, pawnStructure, kingSafety } = evalResult;
  const matPawns = material / 100;

  if (Math.abs(matPawns) > 1) {
    insights.push(matPawns > 0 ? 'White has material advantage' : 'Black has material advantage');
  }
  if (Math.abs(center) > 15) {
    insights.push(center > 0 ? 'White controls the center' : 'Black controls the center');
  }
  if (Math.abs(mobility) > 10) {
    insights.push(mobility > 0 ? 'White has more mobility' : 'Black has more mobility');
  }
  if (Math.abs(pawnStructure) > 20) {
    insights.push(pawnStructure > 0 ? 'White has better pawn structure' : 'Black has better pawn structure');
  }
  if (Math.abs(kingSafety) > 20) {
    insights.push(kingSafety > 0 ? 'White king is safer' : 'Black king is safer');
  }

  if (insights.length === 0) insights.push('Position is balanced');
  return insights;
}
