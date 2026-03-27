import { GAME_CONFIG } from '../../../config/gameConfig';
import type { CellAnimation, GameState } from '../types/game';

export function createEmptyAnimations(): CellAnimation[][] {
  const { rows, cols } = GAME_CONFIG.grid;
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'none' as CellAnimation),
  );
}

export function createInitialState(): GameState {
  return {
    phase: 'title',
    board: [],
    selectedType: null,
    score: 0,
    clearCount: { water: 0, fire: 0, thunder: 0 },
    timeRemaining: GAME_CONFIG.time.initial,
    feverType: null,
    evolutionGauge: 0,
    moveCount: 0,
    chainCount: 0,
    evolutionResult: null,
    highScore: 0,
    animationPhase: 'idle',
    cellAnimations: createEmptyAnimations(),
    slideInfo: null,
    chainDepth: 0,
    animationLocked: false,
  };
}
