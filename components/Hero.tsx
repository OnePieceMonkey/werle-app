import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.brand}>
        <span className={styles.dot} aria-hidden="true" />
        <span>Werle Technologies</span>
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>Minden · Remote</p>
        <h1 className={styles.headline}>Werle Technologies</h1>
        <p className={styles.tag}>
          Zwei Spiele, eine App und ein Buch — <em>zum Anfassen</em>, nicht
          nur zum Ansehen.
        </p>
      </div>

      <div className={styles.hint}>
        Scroll, um zu erkunden
        <div className={styles.chevron} aria-hidden="true">
          ↓
        </div>
      </div>
    </section>
  );
}
