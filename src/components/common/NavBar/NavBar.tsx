import styles from './NavBar.module.css';

type Props = {
  onHome?: () => void;
  onHowToPlay?: () => void;
};

export function NavBar({ onHome, onHowToPlay }: Props) {
  return (
    <nav className={styles.nav}>
      {onHome && (
        <button className={styles.button} onClick={onHome}>
          <span className={styles.icon}>🏠</span>
          <span className={styles.label}>ホーム</span>
        </button>
      )}
      {onHowToPlay && (
        <button className={styles.button} onClick={onHowToPlay}>
          <span className={styles.icon}>📖</span>
          <span className={styles.label}>遊び方</span>
        </button>
      )}
    </nav>
  );
}
