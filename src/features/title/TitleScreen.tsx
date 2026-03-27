import styles from './TitleScreen.module.css';

type Props = {
  highScore: number;
  onStart: () => void;
  onHowToPlay: () => void;
};

export function TitleScreen({ highScore, onStart, onHowToPlay }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <span className={styles.logoEmoji}>💧🔥⚡</span>
          <h1 className={styles.title}>EVPanel8</h1>
        </div>
        <p className={styles.subtitle}>スライドパズル × マッチ3</p>

        {highScore > 0 && (
          <div className={styles.highScoreCard}>
            <span className={styles.highScoreLabel}>BEST</span>
            <span className={styles.highScoreValue}>{highScore.toLocaleString()}</span>
          </div>
        )}

        <button className={styles.startButton} onClick={onStart}>
          <span>START</span>
        </button>

        <button className={styles.howToPlayButton} onClick={onHowToPlay}>
          遊び方
        </button>

        <p className={styles.hint}>3つ揃えて、進化させよう</p>
      </div>
    </div>
  );
}
