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
 * マッチしたパネルを消去し、新しいパネルで補充する。
 * 消去後、盤面は再び「8枚パネル + 1空きマス」になる。
 *
 * ロジック:
 * 1. マッチした座標をすべて 'empty' にする
 * 2. 空きマスが複数できるので、1つを残して他にパネルを補充
 * 3. 新しい空きマスはランダムに1つ選ぶ
 */
export function refillBoard(
  board: Board,
  matchedPositions: Position[],
): Board {
  const newBoard = board.map((row) => [...row]);

  // マッチした座標を空にする
  for (const pos of matchedPositions) {
    newBoard[pos.row][pos.col] = 'empty';
  }

  // 空きマスをすべて収集
  const emptyPositions: Position[] = [];
  for (let r = 0; r < newBoard.length; r++) {
    for (let c = 0; c < newBoard[r].length; c++) {
      if (newBoard[r][c] === 'empty') {
        emptyPositions.push({ row: r, col: c });
      }
    }
  }

  // 空きマス1つだけ残して、残りにパネルを補充
  if (emptyPositions.length <= 1) return newBoard;

  // ランダムに1つを空きマスとして残す
  const keepEmptyIdx = Math.floor(Math.random() * emptyPositions.length);

  for (let i = 0; i < emptyPositions.length; i++) {
    if (i === keepEmptyIdx) continue;
    const pos = emptyPositions[i];
    newBoard[pos.row][pos.col] = randomPanelType() as CellState;
  }

  return newBoard;
}
