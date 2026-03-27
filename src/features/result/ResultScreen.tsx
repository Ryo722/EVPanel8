import { GAME_CONFIG } from '../../config/gameConfig';
import type { EvolutionResult } from '../game/types/game';
import styles from './ResultScreen.module.css';

type Props = {
  score: number;
  highScore: number;
  evolutionResult: EvolutionResult | null;
  onRestart: () => void;
};

export function ResultScreen({ score, highScore, evolutionResult, onRestart }: Props) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>RESULT</h2>

        {evolutionResult && (
          <div
            className={`${styles.evolution} ${evolutionResult.success ? styles.evoSuccess : styles.evoFail}`}
          >
            {evolutionResult.success ? (
              <>
                <span className={styles.evoMainEmoji}>
                  {GAME_CONFIG.evolutionEmoji[evolutionResult.selectedType]}
                </span>
                <span className={styles.evoTierBadge}>
                  {evolutionResult.tierEmoji} {evolutionResult.tierName}
                </span>
                <span
                  className={styles.evoName}
                  style={{ color: GAME_CONFIG.panelColors[evolutionResult.selectedType] }}
                >
                  {GAME_CONFIG.evolutionNames[evolutionResult.selectedType]}
                </span>
                <span className={styles.evoBonus}>
                  +{evolutionResult.bonusScore.toLocaleString()}
                </span>
                <span className={styles.evoGauge}>
                  ゲージ: {evolutionResult.gauge.toFixed(1)}
                </span>
              </>
            ) : (
              <>
                <span className={styles.evoMainEmoji}>😢</span>
                <span className={styles.evoTierBadge}>進化失敗</span>
                <span className={styles.evoGauge}>
                  ゲージ: {evolutionResult.gauge.toFixed(1)}
                  {' '}(あと {(GAME_CONFIG.evolution.tiers[GAME_CONFIG.evolution.tiers.length - 1].threshold - evolutionResult.gauge).toFixed(1)} で進化)
                </span>
              </>
            )}
          </div>
        )}

        <div className={styles.scoreSection}>
          <span className={styles.scoreLabel}>FINAL SCORE</span>
          <span className={styles.scoreValue}>{score.toLocaleString()}</span>
          {isNewHighScore && (
            <span className={styles.newRecord}>🏆 NEW RECORD!</span>
          )}
        </div>

        {evolutionResult && (
          <div className={styles.clearSummary}>
            {GAME_CONFIG.panelTypes.map((type) => (
              <div key={type} className={styles.clearRow}>
                <span className={styles.clearIcon}>
                  {GAME_CONFIG.panelEmoji[type]}
                </span>
                <span className={styles.clearLabel}>
                  {GAME_CONFIG.panelLabels[type]}
                </span>
                <span className={styles.clearBar}>
                  <span
                    className={styles.clearFill}
                    style={{
                      width: `${Math.min(100, (evolutionResult.clearCount[type] / Math.max(1, ...Object.values(evolutionResult.clearCount))) * 100)}%`,
                      background: GAME_CONFIG.panelColors[type],
                    }}
                  />
                </span>
                <span className={styles.clearValue}>
                  {evolutionResult.clearCount[type]}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.highScore}>
          BEST: {highScore.toLocaleString()}
        </div>

        <button className={styles.restartButton} onClick={onRestart}>
          もう一度遊ぶ
        </button>
      </div>
    </div>
  );
}
