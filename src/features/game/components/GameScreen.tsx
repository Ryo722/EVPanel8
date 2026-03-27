import { GAME_CONFIG } from '../../../config/gameConfig';
import { getGaugeProgress } from '../logic/evolution';
import type {
  Board,
  CellAnimation,
  ClearCount,
  GameState,
  PanelType,
  Position,
  SlideInfo,
} from '../types/game';
import styles from './GameScreen.module.css';

type Props = {
  state: GameState;
  onSlide: (position: Position) => void;
};

export function GameScreen({ state, onSlide }: Props) {
  const { board, score, timeRemaining, clearCount, selectedType, moveCount, feverType, evolutionGauge } = state;
  const isWarning = timeRemaining <= GAME_CONFIG.time.warningThreshold;

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        <Header
          score={score}
          timeRemaining={timeRemaining}
          isWarning={isWarning}
          selectedType={selectedType}
          moveCount={moveCount}
        />
        <FeverIndicator feverType={feverType} selectedType={selectedType} />
        <ClearCountDisplay clearCount={clearCount} selectedType={selectedType} />
        <EvolutionGauge gauge={evolutionGauge} selectedType={selectedType} />
        <BoardView
          board={board}
          feverType={feverType}
          cellAnimations={state.cellAnimations}
          slideInfo={state.slideInfo}
          animationLocked={state.animationLocked}
          onSlide={onSlide}
        />
      </div>
    </div>
  );
}

function Header({
  score,
  timeRemaining,
  isWarning,
  selectedType,
  moveCount,
}: {
  score: number;
  timeRemaining: number;
  isWarning: boolean;
  selectedType: PanelType | null;
  moveCount: number;
}) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const progress = timeRemaining / GAME_CONFIG.time.initial;

  return (
    <div className={styles.header}>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>SCORE</span>
        <span className={styles.scoreValue}>{score.toLocaleString()}</span>
      </div>
      <div className={styles.timerBlock}>
        <div className={`${styles.timerText} ${isWarning ? styles.timerWarning : ''}`}>
          {timeStr}
        </div>
        <div className={styles.timerBar}>
          <div
            className={`${styles.timerFill} ${isWarning ? styles.timerFillWarning : ''}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className={styles.infoBlock}>
        {selectedType && (
          <span className={styles.selectedBadge}>
            {GAME_CONFIG.panelEmoji[selectedType]}
          </span>
        )}
        <span className={styles.moves}>{moveCount}手</span>
      </div>
    </div>
  );
}

function FeverIndicator({
  feverType,
  selectedType,
}: {
  feverType: PanelType | null;
  selectedType: PanelType | null;
}) {
  if (!feverType) return null;

  const isConflict = selectedType !== null && feverType !== selectedType;

  return (
    <div className={styles.feverBanner}>
      <span className={styles.feverLabel}>FEVER</span>
      <span className={styles.feverEmoji}>{GAME_CONFIG.panelEmoji[feverType]}</span>
      <span className={styles.feverText} style={{ color: GAME_CONFIG.panelColors[feverType] }}>
        {GAME_CONFIG.panelLabels[feverType]}を消すと時間+!
      </span>
      {isConflict && (
        <span className={styles.feverConflict}>⚡ ジレンマ</span>
      )}
    </div>
  );
}

function ClearCountDisplay({
  clearCount,
  selectedType,
}: {
  clearCount: ClearCount;
  selectedType: PanelType | null;
}) {
  return (
    <div className={styles.clearCount}>
      {GAME_CONFIG.panelTypes.map((type) => (
        <div
          key={type}
          className={`${styles.clearChip} ${type === selectedType ? styles.clearChipSelected : ''}`}
        >
          <span className={styles.clearEmoji}>{GAME_CONFIG.panelEmoji[type]}</span>
          <span className={styles.clearNum}>{clearCount[type]}</span>
        </div>
      ))}
    </div>
  );
}

function EvolutionGauge({
  gauge,
  selectedType,
}: {
  gauge: number;
  selectedType: PanelType | null;
}) {
  const info = getGaugeProgress(gauge);
  const color = selectedType ? GAME_CONFIG.panelColors[selectedType] : '#6366f1';

  // 全体のゲージ: 最高段階の閾値を100%とする
  const maxThreshold = GAME_CONFIG.evolution.tiers[0].threshold;
  const overallProgress = Math.min(1, gauge / maxThreshold);

  return (
    <div className={styles.gaugeWrap}>
      <div className={styles.gaugeHeader}>
        <span className={styles.gaugeLabel}>進化ゲージ</span>
        <span className={styles.gaugeTier}>
          {info.currentTierName}
          {info.nextTierName && (
            <span className={styles.gaugeNext}> → {info.nextTierName}</span>
          )}
        </span>
      </div>
      <div className={styles.gaugeBar}>
        <div
          className={styles.gaugeFill}
          style={{ width: `${overallProgress * 100}%`, background: color }}
        />
        {/* 閾値マーカー */}
        {[...GAME_CONFIG.evolution.tiers].reverse().map((tier) => (
          <div
            key={tier.threshold}
            className={styles.gaugeMarker}
            style={{ left: `${(tier.threshold / maxThreshold) * 100}%` }}
            title={tier.name}
          />
        ))}
      </div>
      <div className={styles.gaugeValue}>{gauge.toFixed(1)}</div>
    </div>
  );
}

function BoardView({
  board,
  feverType,
  cellAnimations,
  slideInfo,
  animationLocked,
  onSlide,
}: {
  board: Board;
  feverType: PanelType | null;
  cellAnimations: CellAnimation[][];
  slideInfo: SlideInfo | null;
  animationLocked: boolean;
  onSlide: (position: Position) => void;
}) {
  return (
    <div className={styles.boardWrap}>
      <div className={styles.board}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isEmpty = cell === 'empty';
            const anim = cellAnimations[r]?.[c] ?? 'none';
            const isFeverCell = !isEmpty && feverType !== null && cell === feverType;

            let slideStyle: React.CSSProperties | undefined;
            if (anim === 'sliding' && slideInfo) {
              const dr = slideInfo.from.row - slideInfo.to.row;
              const dc = slideInfo.from.col - slideInfo.to.col;
              slideStyle = {
                '--slide-from-x': `${dc * 100}%`,
                '--slide-from-y': `${dr * 100}%`,
                animationDuration: `${GAME_CONFIG.animation.slideDuration}ms`,
              } as React.CSSProperties;
            }

            const animClass =
              anim === 'sliding'
                ? styles.cellSliding
                : anim === 'clearing'
                  ? styles.cellClearing
                  : anim === 'appearing'
                    ? styles.cellAppearing
                    : '';

            return (
              <button
                key={`${r}-${c}`}
                className={`${styles.cell} ${isEmpty ? styles.cellEmpty : ''} ${isFeverCell ? styles.cellFever : ''} ${animClass}`}
                style={{
                  ...(!isEmpty
                    ? { '--panel-color': GAME_CONFIG.panelColors[cell] } as React.CSSProperties
                    : {}),
                  ...slideStyle,
                }}
                onClick={() => !animationLocked && onSlide({ row: r, col: c })}
                disabled={isEmpty || animationLocked}
                aria-label={isEmpty ? '空きマス' : GAME_CONFIG.panelLabels[cell]}
              >
                {!isEmpty && (
                  <span className={styles.cellEmoji}>
                    {GAME_CONFIG.panelEmoji[cell]}
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
