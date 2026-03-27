import { describe, expect, it } from 'vitest';
import type { Board } from '../src/features/game/types/game';
import { findMatches } from '../src/features/game/logic/findMatches';

describe('findMatches', () => {
  it('横3枚一致を検出する', () => {
    const board: Board = [
      ['water', 'water', 'water'],
      ['fire', 'empty', 'thunder'],
      ['thunder', 'fire', 'fire'],
    ];
    const matches = findMatches(board);
    expect(matches).toHaveLength(1);
    expect(matches[0].type).toBe('water');
    expect(matches[0].positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it('縦3枚一致を検出する', () => {
    const board: Board = [
      ['fire', 'water', 'thunder'],
      ['fire', 'empty', 'water'],
      ['fire', 'thunder', 'water'],
    ];
    const matches = findMatches(board);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const fireMatch = matches.find((m) => m.type === 'fire');
    expect(fireMatch).toBeDefined();
    expect(fireMatch!.positions).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ]);
  });

  it('一致がない場合は空配列', () => {
    const board: Board = [
      ['water', 'fire', 'thunder'],
      ['fire', 'empty', 'water'],
      ['thunder', 'water', 'fire'],
    ];
    const matches = findMatches(board);
    expect(matches).toHaveLength(0);
  });

  it('縦横同時一致を検出する', () => {
    const board: Board = [
      ['fire', 'fire', 'fire'],
      ['empty', 'water', 'thunder'],
      ['fire', 'thunder', 'water'],
    ];
    // 横: row0 全部 fire
    const matches = findMatches(board);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('空きマスを含む行は一致しない', () => {
    const board: Board = [
      ['water', 'empty', 'water'],
      ['fire', 'thunder', 'fire'],
      ['thunder', 'fire', 'thunder'],
    ];
    const matches = findMatches(board);
    expect(matches).toHaveLength(0);
  });
});
