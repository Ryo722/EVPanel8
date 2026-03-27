import { describe, expect, it } from 'vitest';
import { calculateFeverTimeBonus, generateFeverType, hasFeverMatch } from '../src/features/game/logic/fever';
import type { MatchResult } from '../src/features/game/types/game';

describe('generateFeverType', () => {
  it('有効なパネル属性を返す', () => {
    const type = generateFeverType(null);
    expect(['water', 'fire', 'thunder']).toContain(type);
  });

  it('前回と異なる属性を返す', () => {
    for (let i = 0; i < 30; i++) {
      const type = generateFeverType('water');
      expect(type).not.toBe('water');
    }
  });
});

describe('calculateFeverTimeBonus', () => {
  it('フィーバー属性の3枚一致で +5秒', () => {
    const matches: MatchResult[] = [
      { type: 'water', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    expect(calculateFeverTimeBonus(matches, 'water')).toBe(5);
  });

  it('フィーバー属性でないマッチは 0秒', () => {
    const matches: MatchResult[] = [
      { type: 'fire', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    expect(calculateFeverTimeBonus(matches, 'water')).toBe(0);
  });

  it('feverType が null なら 0秒', () => {
    const matches: MatchResult[] = [
      { type: 'water', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    expect(calculateFeverTimeBonus(matches, null)).toBe(0);
  });
});

describe('hasFeverMatch', () => {
  it('フィーバー属性が含まれていたら true', () => {
    const matches: MatchResult[] = [
      { type: 'thunder', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    expect(hasFeverMatch(matches, 'thunder')).toBe(true);
  });

  it('含まれていなければ false', () => {
    const matches: MatchResult[] = [
      { type: 'fire', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    expect(hasFeverMatch(matches, 'water')).toBe(false);
  });
});
