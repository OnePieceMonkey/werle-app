"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./BookSection.module.css";

interface Cover {
  key: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  back?: boolean;
}

const COVERS: Cover[] = [
  {
    key: "cover",
    src: "/images/buch-cover.jpg",
    alt: "Buchcover — Bechterew unter Kontrolle",
    caption: "Cover",
    width: 625,
    height: 1000,
  },
  {
    key: "backcover",
    src: "/images/buch-backcover.jpg",
    alt: "Buchrückseite mit Beschreibung, Zitat und Autoren-Biografie",
    caption: "Rückseite — anklicken zum Vergrößern",
    width: 625,
    height: 1000,
    back: true,
  },
];

export default function BookSection() {
  const [lightbox, setLightbox] = useState<Cover | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  return (
    <section id="buch" className={styles.stage}>
      <div
        className={styles.panel}
        aria-label="Bechterew unter Kontrolle — Buchcover und Rückseite"
      >
        <p className={`${styles.kicker} mono`}>Buch</p>
        <h2 className={styles.title}>
          Bechterew <em>unter Kontrolle</em>
        </h2>
        <p className={`${styles.tagline} serif`}>
          Mein Weg durch 20 Jahre Morbus Bechterew.
        </p>
        <div className={styles.covers}>
          {COVERS.map((cover) => (
            <figure
              key={cover.key}
              className={`${styles.plate} ${cover.back ? styles.back : ""}`}
              onClick={() => setLightbox(cover)}
            >
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
              />
              <figcaption className="mono">{cover.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className={`${styles.lightbox} ${styles.open}`}
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            aria-label="Schließen"
            onClick={(event) => {
              event.stopPropagation();
              setLightbox(null);
            }}
          >
            ✕
          </button>
          <Image
            className={styles.lightboxImg}
            src={lightbox.src}
            alt={lightbox.alt}
            width={lightbox.width}
            height={lightbox.height}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
