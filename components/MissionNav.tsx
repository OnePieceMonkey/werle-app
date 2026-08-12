"use client";

import { useEffect, useMemo, useState } from "react";
import { content, type Locale } from "@/lib/content";
import styles from "./MissionNav.module.css";

/* Reine ID-Reihenfolge — bewusst getrennt von den (übersetzbaren) Labels
   in lib/content.ts. Diese IDs sind identisch mit SECTION_IDS in
   SpaceScene.tsx und dürfen NIE übersetzt werden, siehe Task-Auftrag:
   die 3D-Kamera misst document.getElementById(id).offsetTop für genau
   diese Strings. */
const SECTION_IDS = [
  "hero",
  "pulsegate",
  "alibi",
  "coparents",
  "labrechner",
  "buch",
  "kontakt",
] as const;

interface MissionNavProps {
  locale?: Locale;
}

/**
 * Vertikale Missions-Navigation: ein Punkt pro Sektion, aktive Sektion via
 * IntersectionObserver bestimmt, Klick springt smooth dorthin. In der
 * Demo lief die "aktive Sektion" am Scroll-Fortschritt der 3D-Kamera
 * entlang — hier (ohne 3D-Szene, siehe SpaceScene-Platzhalter) an den
 * tatsächlichen Sektions-Elementen im normalen Dokumentenfluss.
 */
export default function MissionNav({ locale = "de" }: MissionNavProps) {
  const [active, setActive] = useState<string>("hero");
  const nav = content[locale].nav;
  const SECTIONS = useMemo(
    () => SECTION_IDS.map((id) => ({ id, label: nav[id] })),
    [nav],
  );

  useEffect(() => {
    // Beobachtet die stabilen IDs direkt (nicht das übersetzte SECTIONS-
    // Array) — die Sichtbarkeits-Logik hängt nie von den Labels ab, das
    // hält die Dependency-Liste bei [] wie im Original.
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className={styles.nav} aria-label={nav.ariaLabel}>
      <div className={styles.line} aria-hidden="true" />
      {SECTIONS.map(({ id, label }, index) => (
        <button
          key={id}
          type="button"
          className={`${styles.dotButton} ${active === id ? styles.active : ""}`}
          style={{ top: `${(index / (SECTIONS.length - 1)) * 100}%` }}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
          onClick={() => scrollToSection(id)}
        >
          <span className={styles.dotVisual} />
        </button>
      ))}
    </nav>
  );
}
