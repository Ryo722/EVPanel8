import { describe, expect, it } from 'vitest';
import type { Board } from '../src/features/game/types/game';
import { isAdjacent, slideTile } from '../src/features/game/logic/slideTile';

describe('isAdjacent', () => {
  it('上下左右は隣接', () => {
    expect(isAdjacent({ row: 1, col: 1 }, { row: 0, col: 1 })).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, { row: 2, col: 1 })).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 0 })).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 2 })).toBe(true);
  });

  it('斜めは隣接しない', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false);
  });

  it('離れた位置は隣接しない', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false);
  });
});

describe('slideTile', () => {
  const board: Board = [
    ['water', 'fire', 'thunder'],
    ['fire', 'empty', 'water'],
    ['thunder', 'water', 'fire'],
  ];

  it('隣接パネルを空きマスに移動できる', () => {
    const result = slideTile(board, { row: 0, col: 1 });
    expect(result).not.toBeNull();
    expect(result![0][1]).toBe('empty');
    expect(result![1][1]).toBe('fire');
  });

  it('離れたパネルは移動できない', () => {
    const result = slideTile(board, { row: 0, col: 0 });
    expect(result).toBeNull();
  });

  it('空きマス自体をクリックしても移動しない', () => {
    const result = slideTile(board, { row: 1, col: 1 });
    expect(result).toBeNull();
  });

  it('元の盤面は変更されない（イミュータブル）', () => {
    const original = JSON.parse(JSON.stringify(board));
    slideTile(board, { row: 0, col: 1 });
    expect(board).toEqual(original);
  });
});
