import { GAME_CONFIG } from '../../../config/gameConfig';
import type { MatchResult, PanelType } from '../types/game';

/**
 * マッチ結果からスコアを計算する。
 * フィーバー属性のマッチにはボーナス倍率を適用。
 */
export function calculateMatchScore(
  matches: MatchResult[],
  feverType: PanelType | null,
): number {
  let total = 0;

  for (const match of matches) {
    const base = GAME_CONFIG.score.match3;
    const isFever = feverType !== null && match.type === feverType;
    const multiplier = isFever ? GAME_CONFIG.score.feverMultiplier : 1;
    total += Math.floor(base * multiplier);
  }

  return total;
}
