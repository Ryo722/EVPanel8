import styles from './HowToPlayScreen.module.css';

type Props = {
  onBack: () => void;
};

export function HowToPlayScreen({ onBack }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>遊び方</h2>

        <Section title="基本ルール">
          <p>
            3×3 の盤面に 💧🔥⚡ の3種類のパネルが8枚並んでいます。
            空きマスを使ってパネルをスライドし、
            <strong>同じ種類を縦か横に3枚揃える</strong>と消えてスコア獲得!
          </p>
        </Section>

        <Section title="操作方法">
          <div className={styles.controls}>
            <ControlItem label="PC" desc="空きマスに隣接するパネルをクリック" />
            <ControlItem label="スマホ" desc="空きマスに隣接するパネルをタップ" />
          </div>
          <p className={styles.note}>
            斜めや離れたパネルは動かせません。空きマスの上下左右だけ移動できます。
          </p>
        </Section>

        <Section title="ゲームの流れ">
          <ol className={styles.flow}>
            <li><span className={styles.step}>1</span>属性を選択（💧水 / 🔥炎 / ⚡雷）</li>
            <li><span className={styles.step}>2</span>制限時間 <strong>3分</strong> でパネルを消していく</li>
            <li><span className={styles.step}>3</span>時間切れでゲーム終了、結果発表</li>
          </ol>
        </Section>

        <Section title="スコア">
          <table className={styles.table}>
            <tbody>
              <tr><td>3枚マッチ</td><td className={styles.value}>1,000点</td></tr>
              <tr><td>フィーバー属性マッチ</td><td className={styles.value}>1,500点</td></tr>
              <tr><td>連鎖ボーナス</td><td className={styles.value}>×1.5倍ずつ加算</td></tr>
            </tbody>
          </table>
          <p className={styles.note}>
            消去後に新しいパネルが出現し、再び3枚揃うと自動で連鎖が発生します。
          </p>
        </Section>

        <Section title="フィーバー">
          <p>
            15秒ごとに<strong>フィーバー属性</strong>がランダムで切り替わります。
            フィーバー属性のパネルは金色に光ります。
          </p>
          <table className={styles.table}>
            <tbody>
              <tr><td>フィーバー属性を3枚揃え</td><td className={styles.value}>+5秒</td></tr>
            </tbody>
          </table>
          <p className={styles.note}>
            選んだ属性とフィーバー属性が違うときが<strong>ジレンマ</strong>のポイント!
            時間を取るか、進化を取るか — 状況に応じて判断しましょう。
          </p>
        </Section>

        <Section title="進化ゲージ">
          <p>
            ゲーム開始時に選んだ属性のパネルを消すとゲージが上昇し、
            他の属性を消すとゲージが少し下がります。
          </p>
          <table className={styles.table}>
            <tbody>
              <tr><td>選択属性を消去</td><td className={styles.value}>+1.0 / 枚</td></tr>
              <tr><td>他属性を消去</td><td className={styles.value}>-0.3 / 枚</td></tr>
            </tbody>
          </table>
          <p className={styles.subHeading}>終了時の進化段階</p>
          <table className={styles.table}>
            <tbody>
              <tr><td>✨ 完全進化</td><td className={styles.value}>ゲージ 15 以上 → +15,000点</td></tr>
              <tr><td>🌟 進化</td><td className={styles.value}>ゲージ 10 以上 → +10,000点</td></tr>
              <tr><td>💫 半進化</td><td className={styles.value}>ゲージ 5 以上 → +5,000点</td></tr>
              <tr><td>失敗</td><td className={styles.value}>ゲージ 5 未満 → ボーナスなし</td></tr>
            </tbody>
          </table>
        </Section>

        <Section title="ハイスコア攻略のコツ">
          <ul className={styles.tips}>
            <li>フィーバー属性と選択属性が一致しているときは積極的に消す</li>
            <li>連鎖が起きやすい配置を意識してパネルを動かす</li>
            <li>残り時間が少ないときはフィーバー属性で時間を稼ぐ</li>
            <li>完全進化のボーナスが最大なので、選択属性を優先的に消す</li>
          </ul>
        </Section>

        <button className={styles.backButton} onClick={onBack}>
          戻る
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function ControlItem({ label, desc }: { label: string; desc: string }) {
  return (
    <div className={styles.controlItem}>
      <span className={styles.controlLabel}>{label}</span>
      <span className={styles.controlDesc}>{desc}</span>
    </div>
  );
}
