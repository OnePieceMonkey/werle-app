"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./FadeInSection.module.css";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sanfter Fade-in+Slide-up beim ersten Erscheinen im Viewport — macht den
 * Übergang zwischen den Sektionen weniger abrupt (Live-Feedback: "wirkt
 * immer so direkt aufeinanderfolgend"). Feuert nur einmal pro Sektion
 * (kein erneutes Ein-/Ausblenden beim Hoch-/Runterscrollen), respektiert
 * prefers-reduced-motion automatisch über den globalen Transition-Kill in
 * app/globals.css.
 */
export default function FadeInSection({ children, className }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.fadeIn} ${visible ? styles.visible : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
