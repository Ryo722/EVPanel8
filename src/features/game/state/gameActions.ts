import type { Board, ClearCount, MatchResult, PanelType, Position } from '../types/game';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_TYPE'; panelType: PanelType }
  | { type: 'SLIDE_TILE'; position: Position }
  | { type: 'SLIDE_COMPLETE' }
  | { type: 'MARK_CLEARING'; matches: MatchResult[]; scoreGain: number; clearCountGain: ClearCount; timeBonus: number; gaugeDelta: number }
  | { type: 'APPLY_REFILL'; board: Board; appearingKeys: string[] }
  | { type: 'APPEAR_COMPLETE' }
  | { type: 'TICK' }
  | { type: 'UPDATE_FEVER'; feverType: PanelType }
  | { type: 'END_GAME' }
  | { type: 'RESTART' }
  | { type: 'SET_HIGH_SCORE'; score: number };
