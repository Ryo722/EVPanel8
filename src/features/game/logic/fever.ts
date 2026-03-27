import { GAME_CONFIG } from '../../../config/gameConfig';
import type { MatchResult, PanelType } from '../types/game';

/**
 * ランダムなフィーバー属性を生成する。前回と同じものを避ける。
 */
export function generateFeverType(previous: PanelType | null): PanelType {
  const types = GAME_CONFIG.panelTypes;
  const candidates = previous
    ? types.filter((t) => t !== previous)
    : [...types];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * マッチ結果からフィーバーによる時間ボーナスを計算する。
 * - フィーバー属性のマッチ1つにつき +matchBonus 秒
 * - フィーバー属性で3枚一致なら +fullMatchBonus 秒（matchBonusの代わり）
 */
export function calculateFeverTimeBonus(
  matches: MatchResult[],
  feverType: PanelType | null,
): number {
  if (!feverType) return 0;

  let bonus = 0;
  for (const match of matches) {
    if (match.type === feverType) {
      // 3枚一致（フルマッチ）ならfullMatchBonus、それ以外はmatchBonus
      if (match.positions.length >= 3) {
        bonus += GAME_CONFIG.fever.fullMatchBonus;
      } else {
        bonus += GAME_CONFIG.fever.matchBonus;
      }
    }
  }
  return bonus;
}

/**
 * マッチにフィーバー属性が含まれているか
 */
export function hasFeverMatch(
  matches: MatchResult[],
  feverType: PanelType | null,
): boolean {
  if (!feverType) return false;
  return matches.some((m) => m.type === feverType);
}
