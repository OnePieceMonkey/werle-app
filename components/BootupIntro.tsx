"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./BootupIntro.module.css";

/* ==================================================================
   Boot-up-Intro + Ladefortschritt — 1:1-Verhalten aus der freigegebenen
   Demo (`_temp/design-demos/demo-3d-world-v6.html`, HTML-Zeilen
   749–767, Script-Zeilen 768–865): deckt die Szene ab, zeigt zuerst
   einen Ladefortschritt, wechselt dann zur Terminal-Zeilen-Sequenz,
   löst sich nach der Sequenz oder bei Klick/Tap per Fade-out auf.

   Abweichung vom Original (bewusste Ermessensentscheidung, siehe
   Task-Auftrag): die Demo trackt echte <img>-Ladezustände der
   Produktkarten zusätzlich zum Scene-Ready-Event, mit dem 5000ms-
   Timeout nur als Fallback. Hier hängt der Fortschritt ausschließlich
   an `sceneReady` (durchgereicht von SpaceScene.onReady über
   Experience.tsx) + demselben 5000ms-Hard-Timeout — next/image lädt
   Bilder unterhalb des Folds lazy, ein exaktes Nachbauen der
   Bild-Promises wäre entweder fragil (Bilder starten evtl. nie vor dem
   Timeout) oder bräuchte Eingriffe in ProductCard.tsx außerhalb dieses
   Tasks. Der Ladebalken füllt sich stattdessen asymptotisch Richtung
   92% (rein optisch, keine echte Fortschrittsmessung) und springt bei
   sceneReady/Timeout auf 100% — auf schneller Verbindung/lokal kaum
   sichtbar, exakt wie im Original beabsichtigt.
   ================================================================== */

const STORAGE_KEY = "werle-bootup-shown";
const MAX_WAIT_MS = 5000;
const LINE_COUNT = 3;
const LINE_STAGGER_MS = 300;
const LINE_HOLD_MS = 260;
const FADE_MS = 460;

/* Serverseitig No-Op-Alias auf useEffect (gleiches Muster wie in
   SpaceScene.tsx) — läuft synchron vor dem ersten Paint, damit bei
   bereits gezeigtem Intro nie ein Frame lang die Szene unverdeckt
   aufblitzt. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type Stage = "loading" | "lines";

export interface BootupIntroProps {
  /** True, sobald SpaceScene ihren ersten Frame gerendert hat — Ersatz
   *  für das `werle:scene-ready`-Window-Event der Demo. */
  sceneReady: boolean;
}

export default function BootupIntro({ sceneReady }: BootupIntroProps) {
  const [shown, setShown] = useState(false);
  const [stage, setStage] = useState<Stage>("loading");
  const [pct, setPct] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const finishedRef = useRef(false);
  const readyRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    let already = false;
    try {
      already = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      already = false;
    }
    if (!already) setShown(true);
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* privacy mode / storage blocked — Intro spielt beim nächsten Laden erneut */
    }
    setFadeOut(true);
    window.setTimeout(() => setShown(false), FADE_MS);
  }, []);

  /* ---- Ladefortschritt: asymptotischer Fake-Ramp + Hard-Timeout ---- */
  useEffect(() => {
    if (!shown || stage !== "loading") return;

    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const target = 92 * (1 - Math.exp(-elapsed / 900));
      setPct((prev) => Math.max(prev, target));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const timeout = window.setTimeout(() => {
      if (readyRef.current) return;
      readyRef.current = true;
      setPct(100);
      window.setTimeout(() => setStage("lines"), 150);
    }, MAX_WAIT_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [shown, stage]);

  /* ---- Ladefortschritt: Abschluss sobald die Szene bereit ist ---- */
  useEffect(() => {
    if (!shown || stage !== "loading" || !sceneReady || readyRef.current) return;
    readyRef.current = true;
    setPct(100);
    const id = window.setTimeout(() => setStage("lines"), 150);
    return () => window.clearTimeout(id);
  }, [shown, stage, sceneReady]);

  /* ---- Terminal-Zeilen: automatisches Ende nach Sequenz + Caret-Hold ---- */
  useEffect(() => {
    if (!shown || stage !== "lines") return;
    const id = window.setTimeout(
      finish,
      100 + LINE_COUNT * LINE_STAGGER_MS + LINE_HOLD_MS,
    );
    return () => window.clearTimeout(id);
  }, [shown, stage, finish]);

  if (!shown) return null;

  return (
    <div
      className={cx(styles.bootup, fadeOut && styles.fadeOut)}
      aria-hidden={fadeOut ? "true" : "false"}
      onClick={finish}
      onTouchStart={finish}
      data-testid="bootup-intro"
    >
      {stage === "loading" && (
        <div className={styles.bootLoading} aria-hidden="true">
          <p className={styles.bootLoadingLabel}>&gt; Assets werden geladen…</p>
          <div className={styles.bootLoadingBar}>
            <div className={styles.bootLoadingBarFill} style={{ width: `${pct}%` }} />
          </div>
          <p className={styles.bootLoadingPct}>{Math.round(pct)}%</p>
        </div>
      )}
      {stage === "lines" && (
        <div className={styles.bootupLines} aria-hidden="true">
          <p className={cx(styles.bootupLine, styles.show)}>
            &gt; Sternenkarte wird geladen…
          </p>
          <p className={cx(styles.bootupLine, styles.show)}>&gt; Kurs berechnet.</p>
          <p className={cx(styles.bootupLine, styles.show)}>
            &gt; Verbindung stabil.
            <span className={`${styles.bootupCaret} bootup-caret`} />
          </p>
        </div>
      )}
    </div>
  );
}
