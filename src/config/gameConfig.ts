export const GAME_CONFIG = {
  /** 盤面設定 */
  grid: {
    rows: 3,
    cols: 3,
  },

  /** パネル属性一覧 */
  panelTypes: ['water', 'fire', 'thunder'] as const,

  /** パネル枚数（空きマスを除く） */
  panelCount: 8,

  /** 時間設定（秒） */
  time: {
    initial: 180,
    warningThreshold: 30,
  },

  /** フィーバー設定 */
  fever: {
    /** 切替間隔（秒） */
    interval: 15,
    /** フィーバー属性マッチ時のボーナス（秒） */
    matchBonus: 3,
    /** フィーバー属性3枚一致ボーナス（秒）— matchBonus に加算 */
    fullMatchBonus: 5,
  },

  /** スコア設定 */
  score: {
    match3: 1000,
    /** フィーバー属性マッチ時のスコア倍率 */
    feverMultiplier: 1.5,
    /** 消去数ボーナス閾値 */
    clearBonus: [
      { threshold: 50, bonus: 5000 },
      { threshold: 30, bonus: 3000 },
    ],
  },

  /** 進化ゲージ設定 */
  evolution: {
    /** 選択属性を消すごとにゲージ +1 */
    gaugePerMatch: 1,
    /** 他属性を消すごとにゲージ -0.4 */
    gaugePenalty: -0.4,
    /** 段階閾値とボーナス */
    tiers: [
      { name: '完全進化', threshold: 15, bonus: 15000, emoji: '✨' },
      { name: '進化', threshold: 10, bonus: 10000, emoji: '🌟' },
      { name: '半進化', threshold: 5, bonus: 5000, emoji: '💫' },
    ],
    /** 失敗時 */
    failBonus: 0,
  },

  /** パネル表示色 */
  panelColors: {
    water: '#3B82F6',
    fire: '#EF4444',
    thunder: '#EAB308',
    empty: 'transparent',
  },

  /** パネル表示絵文字 */
  panelEmoji: {
    water: '💧',
    fire: '🔥',
    thunder: '⚡',
  },

  /** パネル表示ラベル（テキスト） */
  panelLabels: {
    water: '水',
    fire: '炎',
    thunder: '雷',
  },

  /** 進化先の名称（オリジナル） */
  evolutionNames: {
    water: 'アクアフォーム',
    fire: 'フレイムフォーム',
    thunder: 'ボルトフォーム',
  },

  /** 進化先の絵文字 */
  evolutionEmoji: {
    water: '🌊',
    fire: '☀️',
    thunder: '🌩️',
  },

  /** 連鎖設定 */
  chain: {
    maxDepth: 10,
    scoreMultiplier: 1.5,
  },

  /** アニメーション時間（ms） */
  animation: {
    slideDuration: 150,
    clearDuration: 300,
    appearDuration: 250,
  },
} as const;
