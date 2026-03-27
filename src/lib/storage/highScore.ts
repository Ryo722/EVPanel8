const STORAGE_KEY = 'evpanel8_highscore';

export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // localStorage が使えない場合は無視
  }
}
