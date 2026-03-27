import { describe, expect, it } from 'vitest';
import type { Board } from '../src/features/game/types/game';
import { findMatches } from '../src/features/game/logic/findMatches';
import { refillBoard } from '../src/features/game/logic/refillBoard';

describe('連鎖消去', () => {
  it('マッチ消去 → 補充後に再度マッチ判定が可能', () => {
    // 初回マッチ: row0 が water 3枚
    const board: Board = [
      ['water', 'water', 'water'],
      ['fire', 'empty', 'thunder'],
      ['thunder', 'fire', 'fire'],
    ];

    const matches = findMatches(board);
    expect(matches).toHaveLength(1);

    // 消去＋補充
    const allPos = matches.flatMap((m) => m.positions);
    const refilled = refillBoard(board, allPos);

    // 補充後: 空きマスが1つだけ
    let emptyCount = 0;
    let panelCount = 0;
    for (const row of refilled) {
      for (const cell of row) {
        if (cell === 'empty') emptyCount++;
        else panelCount++;
      }
    }
    expect(emptyCount).toBe(1);
    expect(panelCount).toBe(8);

    // 補充後の盤面でも findMatches が動作する
    const chainMatches = findMatches(refilled);
    // ランダム補充なので連鎖が発生するとは限らないが、関数が正常に動くことを確認
    expect(Array.isArray(chainMatches)).toBe(true);
  });

  it('refillBoard は常に 8パネル + 1空きを返す', () => {
    const board: Board = [
      ['fire', 'fire', 'fire'],
      ['fire', 'empty', 'water'],
      ['water', 'thunder', 'thunder'],
    ];

    const matches = findMatches(board);
    expect(matches.length).toBeGreaterThan(0);

    const allPos = matches.flatMap((m) => m.positions);
    const refilled = refillBoard(board, allPos);

    let emptyCount = 0;
    for (const row of refilled) {
      for (const cell of row) {
        if (cell === 'empty') emptyCount++;
      }
    }
    expect(emptyCount).toBe(1);
  });

  it('複数回の消去→補充サイクルが安定して動く', () => {
    let board: Board = [
      ['water', 'water', 'water'],
      ['fire', 'empty', 'thunder'],
      ['thunder', 'fire', 'fire'],
    ];

    // 最大5回繰り返し
    for (let i = 0; i < 5; i++) {
      const matches = findMatches(board);
      if (matches.length === 0) break;

      const allPos = matches.flatMap((m) => m.positions);
      board = refillBoard(board, allPos);

      // 不変条件: 必ず 8パネル + 1空き
      let emptyCount = 0;
      for (const row of board) {
        for (const cell of row) {
          if (cell === 'empty') emptyCount++;
        }
      }
      expect(emptyCount).toBe(1);
    }
  });
});
