// Game status constants
export const GAME_STATUS = {
  ACTIVE: 'active',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate',
  DRAW: 'draw',
  RESIGNED: 'resigned',
};

// Time control presets (in seconds)
export const TIME_CONTROLS = {
  bullet1: { initial: 60, increment: 0, label: 'Bullet 1+0' },
  bullet2: { initial: 120, increment: 1, label: 'Bullet 2+1' },
  blitz3: { initial: 180, increment: 0, label: 'Blitz 3+0' },
  blitz5: { initial: 300, increment: 0, label: 'Blitz 5+0' },
  rapid10: { initial: 600, increment: 0, label: 'Rapid 10+0' },
  rapid15: { initial: 900, increment: 10, label: 'Rapid 15+10' },
  classical30: { initial: 1800, increment: 0, label: 'Classical 30+0' },
  unlimited: { initial: Infinity, increment: 0, label: 'Unlimited' },
};

// Player sides
export const SIDES = {
  WHITE: 'w',
  BLACK: 'b',
};

// Action types for the game reducer
export const ACTION_TYPES = {
  MAKE_MOVE: 'MAKE_MOVE',
  SELECT_SQUARE: 'SELECT_SQUARE',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  NEW_GAME: 'NEW_GAME',
  UNDO_MOVE: 'UNDO_MOVE',
  RESIGN: 'RESIGN',
  UPDATE_TIMER: 'UPDATE_TIMER',
  SET_GAME_OVER: 'SET_GAME_OVER',
  TOGGLE_SETTING: 'TOGGLE_SETTING',
  SET_THEME: 'SET_THEME',
  PROMOTE_PAWN: 'PROMOTE_PAWN',
  FLIP_BOARD: 'FLIP_BOARD',
  SET_EVALUATION: 'SET_EVALUATION',
  // Multiplayer actions
  SET_MULTIPLAYER: 'SET_MULTIPLAYER',
  APPLY_SERVER_MOVE: 'APPLY_SERVER_MOVE',
  SET_GAME_OVER_RESULT: 'SET_GAME_OVER_RESULT',
  OPPONENT_DISCONNECTED: 'OPPONENT_DISCONNECTED',
};
