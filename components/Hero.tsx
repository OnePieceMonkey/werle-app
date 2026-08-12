"use client";

import { useAmbientSound } from "@/hooks/useAmbientSound";
import styles from "./Hero.module.css";

export default function Hero() {
  const { soundEnabled, toggleSound } = useAmbientSound();

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.brand}>
        <span className={styles.dot} aria-hidden="true" />
        <span>Werle Technologies</span>
        {/* v5-Äquivalent: dezenter Ton-Toggle neben der Marke, siehe
            hooks/useAmbientSound.ts für den geteilten Sound-Zustand. */}
        <button
          type="button"
          className={`${styles.soundToggle}${soundEnabled ? ` ${styles.on}` : ""}`}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? "Ton stumm schalten" : "Ton aktivieren"}
          onClick={toggleSound}
          data-testid="sound-toggle"
        >
          <svg
            className={styles.iconOff}
            viewBox="0 0 24 24"
            width="13"
            height="13"
            aria-hidden="true"
            style={soundEnabled ? { display: "none" } : undefined}
          >
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <line
              x1="16"
              y1="9"
              x2="21"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="9"
              x2="16"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className={styles.iconOn}
            viewBox="0 0 24 24"
            width="13"
            height="13"
            aria-hidden="true"
            style={!soundEnabled ? { display: "none" } : undefined}
          >
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M19 6.2a8.5 8.5 0 0 1 0 11.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
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
