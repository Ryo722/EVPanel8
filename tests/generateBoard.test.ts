import { describe, expect, it } from 'vitest';
import {
  findEmpty,
  generateBoard,
  generatePanels,
} from '../src/features/game/logic/generateBoard';

describe('generatePanels', () => {
  it('8枚のパネルを生成する', () => {
    const panels = generatePanels();
    expect(panels).toHaveLength(8);
  });

  it('各属性が最低2枚含まれる', () => {
    for (let i = 0; i < 20; i++) {
      const panels = generatePanels();
      const counts = { water: 0, fire: 0, thunder: 0 };
      for (const p of panels) counts[p]++;
      expect(counts.water).toBeGreaterThanOrEqual(2);
      expect(counts.fire).toBeGreaterThanOrEqual(2);
      expect(counts.thunder).toBeGreaterThanOrEqual(2);
    }
  });

  it('water, fire, thunder のみが含まれる', () => {
    const panels = generatePanels();
    for (const p of panels) {
      expect(['water', 'fire', 'thunder']).toContain(p);
    }
  });
});

describe('generateBoard', () => {
  it('3×3 の盤面を生成する', () => {
    const board = generateBoard();
    expect(board).toHaveLength(3);
    for (const row of board) {
      expect(row).toHaveLength(3);
    }
  });

  it('空きマスが1つだけ存在する', () => {
    for (let i = 0; i < 20; i++) {
      const board = generateBoard();
      let emptyCount = 0;
      for (const row of board) {
        for (const cell of row) {
          if (cell === 'empty') emptyCount++;
        }
      }
      expect(emptyCount).toBe(1);
    }
  });

  it('パネルが8枚存在する', () => {
    const board = generateBoard();
    let panelCount = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell !== 'empty') panelCount++;
      }
    }
    expect(panelCount).toBe(8);
  });
});

describe('findEmpty', () => {
  it('空きマスの座標を返す', () => {
    const board = generateBoard();
    const empty = findEmpty(board);
    expect(empty).not.toBeNull();
    expect(board[empty!.row][empty!.col]).toBe('empty');
  });
});
