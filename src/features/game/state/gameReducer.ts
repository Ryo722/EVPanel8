import { GAME_CONFIG } from '../../../config/gameConfig';
import { judgeEvolution } from '../logic/evolution';
import { generateBoard, findEmpty } from '../logic/generateBoard';
import { slideTile } from '../logic/slideTile';
import type { CellAnimation, GameState, Position } from '../types/game';
import type { GameAction } from './gameActions';
import { createEmptyAnimations, createInitialState } from './initialState';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'type-select' };

    case 'SELECT_TYPE':
      return {
        ...state,
        phase: 'playing',
        selectedType: action.panelType,
        board: generateBoard(),
        score: 0,
        clearCount: { water: 0, fire: 0, thunder: 0 },
        timeRemaining: GAME_CONFIG.time.initial,
        feverType: null,
        evolutionGauge: 0,
        moveCount: 0,
        chainCount: 0,
        chainDepth: 0,
        evolutionResult: null,
        animationPhase: 'idle',
        cellAnimations: createEmptyAnimations(),
        slideInfo: null,
        animationLocked: false,
      };

    case 'SLIDE_TILE':
      return handleSlideStart(state, action.position);

    case 'SLIDE_COMPLETE':
      return {
        ...state,
        animationPhase: 'idle',
        slideInfo: null,
        cellAnimations: createEmptyAnimations(),
      };

    case 'MARK_CLEARING':
      return handleMarkClearing(state, action);

    case 'APPLY_REFILL':
      return handleApplyRefill(state, action);

    case 'APPEAR_COMPLETE':
      return {
        ...state,
        animationPhase: 'idle',
        cellAnimations: createEmptyAnimations(),
        animationLocked: false,
      };

    case 'TICK':
      if (state.timeRemaining <= 1) {
        return handleEndGame({ ...state, timeRemaining: 0 });
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };

    case 'UPDATE_FEVER':
      return { ...state, feverType: action.feverType };

    case 'END_GAME':
      return handleEndGame(state);

    case 'RESTART':
      return { ...createInitialState(), highScore: state.highScore };

    case 'SET_HIGH_SCORE':
      return { ...state, highScore: action.score };

    default:
      return state;
  }
}

function handleSlideStart(state: GameState, position: Position): GameState {
  if (state.phase !== 'playing') return state;
  if (state.animationLocked) return state;

  const empty = findEmpty(state.board);
  if (!empty) return state;

  const newBoard = slideTile(state.board, position);
  if (!newBoard) return state;

  const anims = createEmptyAnimations();
  anims[empty.row][empty.col] = 'sliding';

  return {
    ...state,
    board: newBoard,
    moveCount: state.moveCount + 1,
    animationPhase: 'sliding',
    slideInfo: { from: position, to: empty },
    cellAnimations: anims,
    animationLocked: true,
    chainDepth: 0,
  };
}

function handleMarkClearing(
  state: GameState,
  action: Extract<GameAction, { type: 'MARK_CLEARING' }>,
): GameState {
  const anims = createEmptyAnimations();
  for (const match of action.matches) {
    for (const pos of match.positions) {
      anims[pos.row][pos.col] = 'clearing' as CellAnimation;
    }
  }

  return {
    ...state,
    animationPhase: 'clearing',
    cellAnimations: anims,
    score: state.score + action.scoreGain,
    clearCount: {
      water: state.clearCount.water + action.clearCountGain.water,
      fire: state.clearCount.fire + action.clearCountGain.fire,
      thunder: state.clearCount.thunder + action.clearCountGain.thunder,
    },
    timeRemaining: state.timeRemaining + action.timeBonus,
    evolutionGauge: Math.max(0, state.evolutionGauge + action.gaugeDelta),
    chainCount: state.chainCount + 1,
  };
}

function handleApplyRefill(
  state: GameState,
  action: Extract<GameAction, { type: 'APPLY_REFILL' }>,
): GameState {
  const anims = createEmptyAnimations();
  for (const key of action.appearingKeys) {
    const [r, c] = key.split(',').map(Number);
    anims[r][c] = 'appearing' as CellAnimation;
  }

  return {
    ...state,
    board: action.board,
    animationPhase: 'appearing',
    cellAnimations: anims,
    chainDepth: state.chainDepth + 1,
  };
}

function handleEndGame(state: GameState): GameState {
  if (!state.selectedType) return state;

  const evolution = judgeEvolution(
    state.selectedType,
    state.clearCount,
    state.evolutionGauge,
  );

  // 消去数ボーナス
  const totalClears = state.clearCount.water + state.clearCount.fire + state.clearCount.thunder;
  let clearBonus = 0;
  for (const tier of GAME_CONFIG.score.clearBonus) {
    if (totalClears >= tier.threshold) {
      clearBonus = tier.bonus;
      break;
    }
  }

  const finalScore = state.score + evolution.bonusScore + clearBonus;
  const newHighScore = Math.max(finalScore, state.highScore);

  return {
    ...state,
    phase: 'result',
    score: finalScore,
    evolutionResult: evolution,
    highScore: newHighScore,
    animationPhase: 'idle',
    animationLocked: false,
  };
}
