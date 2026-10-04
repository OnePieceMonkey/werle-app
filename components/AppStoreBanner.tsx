"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { content, type Locale } from "@/lib/content";
import { APP_STORE_URLS, PRODUCT_SITES } from "@/lib/links";
import styles from "./AppStoreBanner.module.css";

/* IDs der Sektionen, in denen der Banner erscheint — identisch mit den IDs
   in app/page.tsx (dürfen nie übersetzt werden, siehe MissionNav.tsx). */
const APPS = [
  { id: "pulsegate", name: "Pulse Gate: Echo Shift" },
  { id: "alibi", name: "Das Verhör" },
  { id: "jellycut", name: "JellyCut" },
] as const;
type AppId = (typeof APPS)[number]["id"];

const STORE_URL: Record<AppId, string> = {
  pulsegate: APP_STORE_URLS.pulsegate,
  alibi: APP_STORE_URLS.alibi,
  jellycut: APP_STORE_URLS.jellycut,
};

const DISMISS_KEY = "werle-app-banner-dismissed";

const subscribeNever = () => () => {};
const readIsIphone = () => /iPhone|iPod/.test(navigator.userAgent);
function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false; // Speicher gesperrt — Banner bleibt einfach sichtbar.
  }
}

/**
 * Fester Banner am unteren Rand, nur auf dem iPhone. Zeigt den App-Store-Link
 * der App, deren Sektion gerade im Bild ist, und wechselt beim Scrollen.
 * Ist die App noch nicht im Store (leere URL), führt der Banner auf die
 * Produktseite — nie ein toter Link. Kein Tracking, ✕ merkt sich die
 * Entscheidung nur für diese Sitzung.
 */
export default function AppStoreBanner({ locale = "de" }: { locale?: Locale }) {
  const t = content[locale].appBanner;
  // Server und erster Client-Render liefern false (kein Hydration-Mismatch),
  // danach der echte Wert.
  const isIphone = useSyncExternalStore(subscribeNever, readIsIphone, () => false);
  const wasDismissed = useSyncExternalStore(subscribeNever, readDismissed, () => false);
  const [closed, setClosed] = useState(false);
  const dismissed = wasDismissed || closed;
  const [active, setActive] = useState<AppId | null>(null);
  // Höhe, die der Querformat-Hinweis (RotateHint, ebenfalls unten fixiert)
  // gerade belegt — der Banner sitzt darüber statt ihn zu verdecken.
  const [hintOffset, setHintOffset] = useState(0);

  useEffect(() => {
    if (!isIphone || dismissed) return;
    const ratios = new Map<AppId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id as AppId, entry.intersectionRatio);
        }
        let best: AppId | null = null;
        let bestRatio = 0.3; // darunter zählt keine Sektion als „im Bild"
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] },
    );
    for (const { id } of APPS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isIphone, dismissed]);

  useEffect(() => {
    if (!isIphone) return;
    function measure() {
      const btn = document.querySelector('[data-testid="rotate-hint-dismiss"]');
      const box = btn?.parentElement?.getBoundingClientRect();
      setHintOffset(box ? Math.max(0, window.innerHeight - box.top - 4) : 0);
    }
    measure();
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isIphone]);

  if (!isIphone || dismissed || !active) return null;

  const app = APPS.find((a) => a.id === active)!;
  const storeUrl = STORE_URL[active];
  const href = storeUrl || PRODUCT_SITES[active];

  function dismiss() {
    setClosed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* siehe oben */
    }
  }

  return (
    <aside
      className={`${styles.banner} ${styles[active]}`}
      aria-label={t.ariaLabel}
      data-testid="app-store-banner"
      style={hintOffset ? ({ "--hint-offset": `${hintOffset}px` } as React.CSSProperties) : undefined}
    >
      <button
        type="button"
        className={styles.close}
        aria-label={t.close}
        onClick={dismiss}
      >
        ✕
      </button>
      <div className={styles.text}>
        <span className={styles.name}>{app.name}</span>
        <span className={`${styles.sub} mono`}>
          {storeUrl ? t.store : t.soon}
        </span>
      </div>
      <a className={styles.action} href={href} target="_blank" rel="noopener">
        {storeUrl ? t.open : t.see}
      </a>
    </aside>
  );
}
