/** パネルの属性 */
export type PanelType = 'water' | 'fire' | 'thunder';

/** セルの状態: パネルが置かれているか空きマスか */
export type CellState = PanelType | 'empty';

/** 盤面上の座標 */
export type Position = {
  row: number;
  col: number;
};

/** 盤面: 2次元配列 */
export type Board = CellState[][];

/** マッチ結果 */
export type MatchResult = {
  positions: Position[];
  type: PanelType;
};

/** 属性別消去数 */
export type ClearCount = Record<PanelType, number>;

/** 進化段階 */
export type EvolutionTier = {
  name: string;
  threshold: number;
  bonus: number;
  emoji: string;
};

/** 進化判定結果 */
export type EvolutionResult = {
  success: boolean;
  tierName: string;
  tierEmoji: string;
  selectedType: PanelType;
  clearCount: ClearCount;
  gauge: number;
  bonusScore: number;
};

/** ゲームフェーズ */
export type GamePhase =
  | 'title'
  | 'type-select'
  | 'playing'
  | 'result';

/** セルごとのアニメーション状態 */
export type CellAnimation = 'none' | 'sliding' | 'clearing' | 'appearing';

/** アニメーションフェーズ */
export type AnimationPhase = 'idle' | 'sliding' | 'clearing' | 'appearing';

/** スライドの移動情報 */
export type SlideInfo = {
  from: Position;
  to: Position;
};

/** ゲーム全体の状態 */
export type GameState = {
  phase: GamePhase;
  board: Board;
  selectedType: PanelType | null;
  score: number;
  clearCount: ClearCount;
  timeRemaining: number;
  /** 現在のフィーバー属性 */
  feverType: PanelType | null;
  /** 進化ゲージ（リアルタイム） */
  evolutionGauge: number;
  moveCount: number;
  chainCount: number;
  evolutionResult: EvolutionResult | null;
  highScore: number;
  /** アニメーション関連 */
  animationPhase: AnimationPhase;
  cellAnimations: CellAnimation[][];
  slideInfo: SlideInfo | null;
  chainDepth: number;
  animationLocked: boolean;
};
