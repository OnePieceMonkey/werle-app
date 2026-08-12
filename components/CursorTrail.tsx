"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorTrail.module.css";

/* ==================================================================
   Sternstaub-Cursor-Trail — 1:1 aus der Demo portiert
   (`_temp/design-demos/demo-3d-world-v6.html`, Script-Zeilen
   2497–2547): fester Pool aus 26 recycelten Divs (kein unbegrenztes
   DOM-Wachstum), 9px-Mindestabstand zum letzten Spawn-Punkt, drei
   Akzentfarben zufällig, 700ms Fade-Out per CSS-Animation-Retrigger.

   Bewusst wie im Original imperativ statt React-state-getrieben — bei
   jedem mousemove ein Re-Render auszulösen wäre unnötig teuer; das
   deckt sich mit dem "Refs statt State im useFrame-Loop"-Pattern aus
   SpaceScene.tsx (siehe dortiger Kommentarblock).

   Nur aktiv wenn pointer:fine UND NICHT reduced-motion — beides wird
   einmalig beim Mount geprüft, nicht reaktiv nachgeführt (exakt wie
   die Demo's `window.__reducedMotion`-Flag), sonst bleibt die
   Komponente komplett inaktiv: kein Pool, kein Listener.
   ================================================================== */

const POOL_SIZE = 26;
const MIN_DIST = 9;
const COLORS = ["#3fe0cf", "#e8b16a", "#8be9fd"];

export default function CursorTrail() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    const pool: HTMLDivElement[] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement("div");
      el.className = styles.particle;
      layer.appendChild(el);
      pool.push(el);
    }

    let idx = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;

    function spawn(x: number, y: number) {
      const el = pool[idx];
      idx = (idx + 1) % POOL_SIZE;
      el.classList.remove(styles.anim);
      void el.offsetWidth; /* Reflow erzwingen, damit die Animation auch
                               mitten in einem laufenden Zyklus neu startet */
      const size = 3 + Math.random() * 3;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.classList.add(styles.anim);
    }

    function handleMouseMove(e: MouseEvent) {
      if (lastX !== null && lastY !== null) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
      }
      lastX = e.clientX;
      lastY = e.clientY;
      spawn(e.clientX, e.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      pool.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className={styles.layer}
      aria-hidden="true"
      data-testid="cursor-trail-layer"
    />
  );
}
