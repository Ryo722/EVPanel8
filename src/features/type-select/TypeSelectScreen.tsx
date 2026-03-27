import { GAME_CONFIG } from '../../config/gameConfig';
import type { PanelType } from '../game/types/game';
import styles from './TypeSelectScreen.module.css';

type Props = {
  onSelect: (type: PanelType) => void;
};

export function TypeSelectScreen({ onSelect }: Props) {
  const types = GAME_CONFIG.panelTypes;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>属性を選択</h2>
      <p className={styles.description}>
        選んだ属性を多く消すと<strong>進化ボーナス +10,000点</strong>!
      </p>
      <div className={styles.cards}>
        {types.map((type) => (
          <button
            key={type}
            className={styles.card}
            onClick={() => onSelect(type)}
          >
            <div
              className={styles.cardGlow}
              style={{ background: GAME_CONFIG.panelColors[type] }}
            />
            <span className={styles.emoji}>{GAME_CONFIG.panelEmoji[type]}</span>
            <span className={styles.typeName}>{GAME_CONFIG.panelLabels[type]}</span>
            <div className={styles.evoInfo}>
              <span className={styles.arrow}>→</span>
              <span className={styles.evoEmoji}>{GAME_CONFIG.evolutionEmoji[type]}</span>
              <span className={styles.evoName}>{GAME_CONFIG.evolutionNames[type]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
