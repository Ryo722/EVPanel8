import { GAME_CONFIG } from '../../../config/gameConfig';
import type { Board, MatchResult, PanelType, Position } from '../types/game';

/**
 * 盤面を走査し、縦または横に3枚揃っている箇所をすべて返す。
 */
export function findMatches(board: Board): MatchResult[] {
  const { rows, cols } = GAME_CONFIG.grid;
  const results: MatchResult[] = [];
  const matchedSet = new Set<string>();

  const posKey = (p: Position) => `${p.row},${p.col}`;

  // 横方向チェック（3×3 なので各行で1パターンのみ）
  for (let r = 0; r < rows; r++) {
    if (cols >= 3) {
      const cells = [board[r][0], board[r][1], board[r][2]];
      if (
        cells[0] !== 'empty' &&
        cells[0] === cells[1] &&
        cells[1] === cells[2]
      ) {
        const positions: Position[] = [
          { row: r, col: 0 },
          { row: r, col: 1 },
          { row: r, col: 2 },
        ];
        // 重複チェック
        const key = positions.map(posKey).join('|');
        if (!matchedSet.has(key)) {
          matchedSet.add(key);
          results.push({ positions, type: cells[0] as PanelType });
        }
      }
    }
  }

  // 縦方向チェック（3×3 なので各列で1パターンのみ）
  for (let c = 0; c < cols; c++) {
    if (rows >= 3) {
      const cells = [board[0][c], board[1][c], board[2][c]];
      if (
        cells[0] !== 'empty' &&
        cells[0] === cells[1] &&
        cells[1] === cells[2]
      ) {
        const positions: Position[] = [
          { row: 0, col: c },
          { row: 1, col: c },
          { row: 2, col: c },
        ];
        const key = positions.map(posKey).join('|');
        if (!matchedSet.has(key)) {
          matchedSet.add(key);
          results.push({ positions, type: cells[0] as PanelType });
        }
      }
    }
  }

  return results;
}
