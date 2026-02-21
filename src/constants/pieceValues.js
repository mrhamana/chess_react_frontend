// Point values for each piece type
export const PIECE_VALUES = {
  p: 1,   // Pawn
  n: 3,   // Knight
  b: 3,   // Bishop
  r: 5,   // Rook
  q: 9,   // Queen
  k: 0,   // King (infinite value, but 0 for scoring)
};

// Display names for pieces
export const PIECE_NAMES = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

// Unicode chess piece characters
export const PIECE_UNICODE = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};
