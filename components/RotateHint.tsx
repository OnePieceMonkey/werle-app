"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content, type Locale } from "@/lib/content";
import styles from "./RotateHint.module.css";

/* ==================================================================
   Mobil-Querformat-Hinweis — 1:1 aus der Demo portiert
   (`_temp/design-demos/demo-3d-world-v6.html`, HTML-Zeilen 867–883,
   Script-Zeilen 2453–2488): dismissible Banner unten, erscheint nur
   bei schmalem Portrait-Viewport, sessionStorage-Flag verhindert
   erneutes Anzeigen nach Dismiss, reagiert auf resize/orientationchange.
   ================================================================== */

const STORAGE_KEY = "werle-rotate-hint-dismissed";

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function isNarrowPortrait(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(max-width: 760px) and (orientation: portrait)").matches
  );
}

interface RotateHintProps {
  locale?: Locale;
}

export default function RotateHint({ locale = "de" }: RotateHintProps) {
  const t = content[locale].rotateHint;
  const [visible, setVisible] = useState(false);
  const lastRef = useRef(false);

  /* setVisible nur bei tatsächlicher Änderung (nicht bei jedem
     resize/orientationchange-Tick unconditional) — vermeidet
     redundante Re-Renders und hält den setState-Aufruf im Effekt an
     einen echten Zustandswechsel gebunden statt an eine bedingungslose
     Zuweisung (react-hooks/set-state-in-effect). */
  useEffect(() => {
    function updateVisibility() {
      const next = !wasDismissed() && isNarrowPortrait();
      if (next !== lastRef.current) {
        lastRef.current = next;
        setVisible(next);
      }
    }
    updateVisibility();
    window.addEventListener("resize", updateVisibility);
    window.addEventListener("orientationchange", updateVisibility);
    return () => {
      window.removeEventListener("resize", updateVisibility);
      window.removeEventListener("orientationchange", updateVisibility);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* privacy mode / storage blocked — Banner erscheint beim nächsten Laden erneut */
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={styles.rotateHint}
      role="status"
      aria-live="polite"
      data-testid="rotate-hint"
    >
      <div className={styles.inner}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <rect
              x="13"
              y="6"
              width="16"
              height="26"
              rx="3.2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="21" cy="28.4" r="1.3" fill="currentColor" />
            <path
              d="M30 15.5a10 10 0 0 1 3.6 9.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M33.6 25.1 L35.4 20.4 M33.6 25.1 L28.9 23.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className={styles.text}>
          {t.textPre}
          <em>{t.textEmphasis}</em>
          {t.textPost}
        </p>
        <button
          type="button"
          className={styles.dismiss}
          onClick={handleDismiss}
          data-testid="rotate-hint-dismiss"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
