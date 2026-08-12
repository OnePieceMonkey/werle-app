"use client";

import { useEffect, useState } from "react";
import styles from "./MissionNav.module.css";

const SECTIONS = [
  { id: "hero", label: "Zu: Start" },
  { id: "pulsegate", label: "Zu: Pulse Gate" },
  { id: "alibi", label: "Zu: ALIBI" },
  { id: "coparents", label: "Zu: coParents" },
  { id: "labrechner", label: "Zu: Labrechner" },
  { id: "buch", label: "Zu: Buch" },
  { id: "kontakt", label: "Zu: Kontakt / Ankunft" },
] as const;

/**
 * Vertikale Missions-Navigation: ein Punkt pro Sektion, aktive Sektion via
 * IntersectionObserver bestimmt, Klick springt smooth dorthin. In der
 * Demo lief die "aktive Sektion" am Scroll-Fortschritt der 3D-Kamera
 * entlang — hier (ohne 3D-Szene, siehe SpaceScene-Platzhalter) an den
 * tatsächlichen Sektions-Elementen im normalen Dokumentenfluss.
 */
export default function MissionNav() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
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
    <nav className={styles.nav} aria-label="Abschnitts-Navigation">
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
