import type { Board, Position } from '../types/game';
import { findEmpty } from './generateBoard';

/**
 * 2つの座標が隣接しているか判定
 */
export function isAdjacent(a: Position, b: Position): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

/**
 * 指定座標のパネルを空きマスにスライドする。
 * 移動可能ならば新しい盤面を返し、不可ならば null を返す。
 */
export function slideTile(board: Board, target: Position): Board | null {
  const empty = findEmpty(board);
  if (!empty) return null;

  if (!isAdjacent(target, empty)) return null;

  if (board[target.row][target.col] === 'empty') return null;

  // ディープコピーして入れ替え
  const newBoard = board.map((row) => [...row]);
  newBoard[empty.row][empty.col] = newBoard[target.row][target.col];
  newBoard[target.row][target.col] = 'empty';

  return newBoard;
}
