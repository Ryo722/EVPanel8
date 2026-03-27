import { describe, expect, it } from 'vitest';
import { calculateGaugeDelta, getGaugeProgress, judgeEvolution } from '../src/features/game/logic/evolution';
import type { MatchResult } from '../src/features/game/types/game';

describe('judgeEvolution (3段階)', () => {
  it('ゲージ15以上で完全進化（+15,000点）', () => {
    const result = judgeEvolution('water', { water: 20, fire: 5, thunder: 3 }, 16);
    expect(result.success).toBe(true);
    expect(result.tierName).toBe('完全進化');
    expect(result.bonusScore).toBe(15000);
  });

  it('ゲージ10〜14で進化（+10,000点）', () => {
    const result = judgeEvolution('fire', { water: 5, fire: 15, thunder: 3 }, 12);
    expect(result.success).toBe(true);
    expect(result.tierName).toBe('進化');
    expect(result.bonusScore).toBe(10000);
  });

  it('ゲージ5〜9で半進化（+5,000点）', () => {
    const result = judgeEvolution('thunder', { water: 3, fire: 3, thunder: 8 }, 7);
    expect(result.success).toBe(true);
    expect(result.tierName).toBe('半進化');
    expect(result.bonusScore).toBe(5000);
  });

  it('ゲージ5未満で進化失敗', () => {
    const result = judgeEvolution('water', { water: 3, fire: 5, thunder: 3 }, 3);
    expect(result.success).toBe(false);
    expect(result.bonusScore).toBe(0);
  });

  it('ゲージ0で進化失敗', () => {
    const result = judgeEvolution('fire', { water: 0, fire: 0, thunder: 0 }, 0);
    expect(result.success).toBe(false);
    expect(result.bonusScore).toBe(0);
  });

  it('ゲージちょうど閾値で進化成功', () => {
    const result = judgeEvolution('water', { water: 10, fire: 3, thunder: 3 }, 5);
    expect(result.success).toBe(true);
    expect(result.tierName).toBe('半進化');
  });
});

describe('calculateGaugeDelta', () => {
  it('選択属性を消すとゲージが増える', () => {
    const matches: MatchResult[] = [
      { type: 'water', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    const delta = calculateGaugeDelta(matches, 'water');
    expect(delta).toBe(3); // 3枚 × +1
  });

  it('他属性を消すとゲージが減る', () => {
    const matches: MatchResult[] = [
      { type: 'fire', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];
    const delta = calculateGaugeDelta(matches, 'water');
    expect(delta).toBeCloseTo(-1.2); // 3枚 × -0.4
  });

  it('選択属性と他属性が混在する場合', () => {
    const matches: MatchResult[] = [
      { type: 'water', positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
      { type: 'fire', positions: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
    ];
    const delta = calculateGaugeDelta(matches, 'water');
    expect(delta).toBeCloseTo(1.8); // 3 × +1 + 3 × -0.4 = 1.8
  });
});

describe('getGaugeProgress', () => {
  it('ゲージ0で未進化', () => {
    const info = getGaugeProgress(0);
    expect(info.currentTierName).toBe('未進化');
    expect(info.progress).toBe(0);
  });

  it('最高段階到達でprogress=1', () => {
    const info = getGaugeProgress(20);
    expect(info.currentTierName).toBe('完全進化');
    expect(info.progress).toBe(1);
    expect(info.nextTierName).toBeNull();
  });

  it('中間段階で次の段階を示す', () => {
    const info = getGaugeProgress(7);
    expect(info.currentTierName).toBe('半進化');
    expect(info.nextTierName).toBe('進化');
  });
});
