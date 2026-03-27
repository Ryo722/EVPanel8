import { useCallback, useEffect, useReducer, useRef } from 'react';
import { GAME_CONFIG } from '../../../config/gameConfig';
import { loadHighScore, saveHighScore } from '../../../lib/storage/highScore';
import { calculateGaugeDelta } from '../logic/evolution';
import { calculateFeverTimeBonus } from '../logic/fever';
import { generateFeverType } from '../logic/fever';
import { findMatches } from '../logic/findMatches';
import { refillBoard } from '../logic/refillBoard';
import { calculateMatchScore } from '../logic/score';
import type { ClearCount, GameState, PanelType, Position } from '../types/game';
import { gameReducer } from '../state/gameReducer';
import { createInitialState } from '../state/initialState';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const initial = createInitialState();
    return { ...initial, highScore: loadHighScore() };
  });

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feverRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingMatchCheckRef = useRef(false);

  const clearAnimTimeout = useCallback(() => {
    if (animTimeoutRef.current) {
      clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = null;
    }
  }, []);

  // ── マッチ判定 ──
  const processMatches = useCallback(() => {
    const s = stateRef.current;
    if (!s.selectedType) return;

    const matches = findMatches(s.board);

    if (matches.length === 0) {
      dispatch({ type: 'APPEAR_COMPLETE' });
      return;
    }

    const chainMultiplier = s.chainDepth === 0
      ? 1
      : Math.pow(GAME_CONFIG.chain.scoreMultiplier, s.chainDepth);

    const scoreGain = Math.floor(
      calculateMatchScore(matches, s.feverType) * chainMultiplier,
    );

    const clearCountGain: ClearCount = { water: 0, fire: 0, thunder: 0 };
    for (const match of matches) {
      clearCountGain[match.type] += match.positions.length;
    }

    // フィーバータイムボーナス（初回マッチ時のみ）
    const timeBonus = s.chainDepth === 0
      ? calculateFeverTimeBonus(matches, s.feverType)
      : 0;

    // 進化ゲージ変動
    const gaugeDelta = calculateGaugeDelta(matches, s.selectedType);

    dispatch({ type: 'MARK_CLEARING', matches, scoreGain, clearCountGain, timeBonus, gaugeDelta });
  }, []);

  // ── 消去 → 補充 ──
  const applyClearAndRefill = useCallback(() => {
    const s = stateRef.current;
    const anims = s.cellAnimations;

    const clearingPositions: Position[] = [];
    for (let r = 0; r < anims.length; r++) {
      for (let c = 0; c < anims[r].length; c++) {
        if (anims[r][c] === 'clearing') {
          clearingPositions.push({ row: r, col: c });
        }
      }
    }

    const refilledBoard = refillBoard(s.board, clearingPositions);

    const appearingKeys: string[] = [];
    for (const pos of clearingPositions) {
      if (refilledBoard[pos.row][pos.col] !== 'empty') {
        appearingKeys.push(`${pos.row},${pos.col}`);
      }
    }

    dispatch({ type: 'APPLY_REFILL', board: refilledBoard, appearingKeys });
  }, []);

  // ── ハイスコア保存 ──
  useEffect(() => {
    if (state.phase === 'result') {
      saveHighScore(state.highScore);
    }
  }, [state.phase, state.highScore]);

  // ── タイマーとフィーバー管理 ──
  useEffect(() => {
    if (state.phase === 'playing') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);

      // フィーバー開始
      dispatch({
        type: 'UPDATE_FEVER',
        feverType: generateFeverType(null),
      });
      feverRef.current = setInterval(() => {
        dispatch({
          type: 'UPDATE_FEVER',
          feverType: generateFeverType(stateRef.current.feverType),
        });
      }, GAME_CONFIG.fever.interval * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (feverRef.current) clearInterval(feverRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // ── pending マッチ判定 ──
  useEffect(() => {
    if (state.phase !== 'playing') return;
    if (!pendingMatchCheckRef.current) return;
    if (state.animationPhase !== 'idle') return;

    pendingMatchCheckRef.current = false;
    processMatches();
  }, [state.animationPhase, state.phase, processMatches]);

  // ── アニメーションフェーズ遷移 ──
  useEffect(() => {
    if (state.phase !== 'playing') return;

    clearAnimTimeout();

    if (state.animationPhase === 'sliding') {
      animTimeoutRef.current = setTimeout(() => {
        pendingMatchCheckRef.current = true;
        dispatch({ type: 'SLIDE_COMPLETE' });
      }, GAME_CONFIG.animation.slideDuration);
    }

    if (state.animationPhase === 'clearing') {
      animTimeoutRef.current = setTimeout(() => {
        applyClearAndRefill();
      }, GAME_CONFIG.animation.clearDuration);
    }

    if (state.animationPhase === 'appearing') {
      animTimeoutRef.current = setTimeout(() => {
        pendingMatchCheckRef.current = true;
        dispatch({ type: 'APPEAR_COMPLETE' });
      }, GAME_CONFIG.animation.appearDuration);
    }

    return clearAnimTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.animationPhase]);

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const selectType = useCallback((t: PanelType) => dispatch({ type: 'SELECT_TYPE', panelType: t }), []);
  const slideTile = useCallback((p: Position) => dispatch({ type: 'SLIDE_TILE', position: p }), []);
  const restart = useCallback(() => {
    clearAnimTimeout();
    pendingMatchCheckRef.current = false;
    dispatch({ type: 'RESTART' });
  }, [clearAnimTimeout]);

  return { state, startGame, selectType, slideTile, restart };
}
