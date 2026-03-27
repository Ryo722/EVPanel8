import { GAME_CONFIG } from '../../../config/gameConfig';
import type { Board, CellState, PanelType, Position } from '../types/game';

/**
 * ランダムな属性を返す
 */
function randomPanelType(): PanelType {
  const types = GAME_CONFIG.panelTypes;
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 8枚のパネル配列を生成する。
 * 各属性が最低2枚は含まれるように保証する（3枚揃えの可能性を担保）。
 */
export function generatePanels(): PanelType[] {
  const types = GAME_CONFIG.panelTypes;
  // 各属性2枚ずつ = 6枚、残り2枚はランダム
  const panels: PanelType[] = [];
  for (const t of types) {
    panels.push(t, t);
  }
  for (let i = 0; i < GAME_CONFIG.panelCount - types.length * 2; i++) {
    panels.push(randomPanelType());
  }
  // シャッフル (Fisher-Yates)
  for (let i = panels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [panels[i], panels[j]] = [panels[j], panels[i]];
  }
  return panels;
}

/**
 * 初期盤面を生成する。
 * 3×3 = 9セル、8枚パネル + 1空きマス。
 */
export function generateBoard(): Board {
  const { rows, cols } = GAME_CONFIG.grid;
  const panels = generatePanels();
  const emptyIndex = Math.floor(Math.random() * (rows * cols));

  const board: Board = [];
  let panelIdx = 0;

  for (let r = 0; r < rows; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < cols; c++) {
      const flatIndex = r * cols + c;
      if (flatIndex === emptyIndex) {
        row.push('empty');
      } else {
        row.push(panels[panelIdx]);
        panelIdx++;
      }
    }
    board.push(row);
  }

  return board;
}

/**
 * 盤面から空きマスの座標を返す
 */
export function findEmpty(board: Board): Position | null {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 'empty') {
        return { row: r, col: c };
      }
    }
  }
  return null;
}
