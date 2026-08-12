"use client";

import { useAmbientSound } from "@/hooks/useAmbientSound";
import { content, type Locale } from "@/lib/content";
import styles from "./Hero.module.css";

interface HeroProps {
  locale?: Locale;
}

export default function Hero({ locale = "de" }: HeroProps) {
  const { soundEnabled, toggleSound } = useAmbientSound();
  const t = content[locale].hero;
  const langSwitch = content[locale].languageSwitch;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.brand}>
        <span className={styles.dot} aria-hidden="true" />
        <span>{t.headline}</span>
        {/* v5-Äquivalent: dezenter Ton-Toggle neben der Marke, siehe
            hooks/useAmbientSound.ts für den geteilten Sound-Zustand. */}
        <button
          type="button"
          className={`${styles.soundToggle}${soundEnabled ? ` ${styles.on}` : ""}`}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? t.soundOn : t.soundOff}
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
        {/* Sprachumschalter — einfacher Link statt next/link, siehe
            Architektur-Entscheidung im Task-Auftrag: keine client-seitige
            Transition zwischen zwei eigenständigen SpaceScene-Bäumen, ein
            harter Seitenwechsel ist hier robuster. pointer-events:auto
            durchbricht wie beim Sound-Toggle das pointer-events:none von
            .hero (via .brand vererbt). */}
        <a
          className={styles.langSwitch}
          href={langSwitch.href}
          aria-label={langSwitch.ariaLabel}
          data-testid="language-switch"
        >
          {langSwitch.label}
        </a>
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>{t.kicker}</p>
        <h1 className={styles.headline}>{t.headline}</h1>
        <p className={styles.tag}>
          {t.tagPrefix}
          <em>{t.tagEmphasis}</em>
          {t.tagSuffix}
        </p>
      </div>

      <div className={styles.hint}>
        {t.scrollHint}
        <div className={styles.chevron} aria-hidden="true">
          ↓
        </div>
      </div>
    </section>
  );
}
