import { GAME_CONFIG } from '../../../config/gameConfig';
import type { ClearCount, EvolutionResult, MatchResult, PanelType } from '../types/game';

/**
 * マッチ結果から進化ゲージの変動量を計算する。
 * - 選択属性を消す → +gaugePerMatch × 枚数
 * - 他属性を消す → +gaugePenalty × 枚数
 */
export function calculateGaugeDelta(
  matches: MatchResult[],
  selectedType: PanelType,
): number {
  let delta = 0;

  for (const match of matches) {
    const count = match.positions.length;
    if (match.type === selectedType) {
      delta += GAME_CONFIG.evolution.gaugePerMatch * count;
    } else {
      delta += GAME_CONFIG.evolution.gaugePenalty * count;
    }
  }

  return delta;
}

/**
 * ゲーム終了時の進化判定。
 * ゲージ値に基づいて段階を決定する。
 */
export function judgeEvolution(
  selectedType: PanelType,
  clearCount: ClearCount,
  gauge: number,
): EvolutionResult {
  const { tiers, failBonus } = GAME_CONFIG.evolution;

  // tiers は threshold 降順で定義されている想定
  for (const tier of tiers) {
    if (gauge >= tier.threshold) {
      return {
        success: true,
        tierName: tier.name,
        tierEmoji: tier.emoji,
        selectedType,
        clearCount,
        gauge,
        bonusScore: tier.bonus,
      };
    }
  }

  return {
    success: false,
    tierName: '失敗',
    tierEmoji: '',
    selectedType,
    clearCount,
    gauge,
    bonusScore: failBonus,
  };
}

/**
 * 現在のゲージから次の段階までの進捗率を返す (0〜1)。
 * UIのゲージバー表示用。
 */
export function getGaugeProgress(gauge: number): {
  progress: number;
  currentTierName: string;
  nextTierName: string | null;
  nextThreshold: number;
} {
  const { tiers } = GAME_CONFIG.evolution;

  // tiers は降順。逆順にして昇順にする
  const sorted = [...tiers].reverse();

  // まだ最低段階にも達していない場合
  if (gauge < sorted[0].threshold) {
    return {
      progress: Math.max(0, gauge / sorted[0].threshold),
      currentTierName: '未進化',
      nextTierName: sorted[0].name,
      nextThreshold: sorted[0].threshold,
    };
  }

  // どの段階にいるか
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (gauge >= sorted[i].threshold) {
      const next = i < sorted.length - 1 ? sorted[i + 1] : null;
      if (next) {
        const range = next.threshold - sorted[i].threshold;
        const inRange = gauge - sorted[i].threshold;
        return {
          progress: Math.min(1, inRange / range),
          currentTierName: sorted[i].name,
          nextTierName: next.name,
          nextThreshold: next.threshold,
        };
      }
      // 最高段階到達
      return {
        progress: 1,
        currentTierName: sorted[i].name,
        nextTierName: null,
        nextThreshold: sorted[i].threshold,
      };
    }
  }

  return { progress: 0, currentTierName: '未進化', nextTierName: sorted[0].name, nextThreshold: sorted[0].threshold };
}
