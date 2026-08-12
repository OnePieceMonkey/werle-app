"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";
import { content, type Locale } from "@/lib/content";
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

interface BookSectionProps {
  locale?: Locale;
}

export default function BookSection({ locale = "de" }: BookSectionProps) {
  const t = content[locale].book;
  const COVERS: Cover[] = useMemo(
    () => [
      {
        key: "cover",
        src: "/images/buch-cover.jpg",
        alt: t.coverAlt,
        caption: t.coverCaption,
        width: 625,
        height: 1000,
      },
      {
        key: "backcover",
        src: "/images/buch-backcover.jpg",
        alt: t.backCoverAlt,
        caption: t.backCoverCaption,
        width: 625,
        height: 1000,
        back: true,
      },
    ],
    [t],
  );
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
      <FadeInSection>
        <div className={styles.panel} aria-label={t.ariaLabel}>
          <p className={`${styles.kicker} mono`}>{t.kicker}</p>
          <h2 className={styles.title}>
            {t.titlePre}
            <em>{t.titleEmphasis}</em>
          </h2>
          <p className={`${styles.tagline} serif`}>{t.tagline}</p>
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
      </FadeInSection>

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
            aria-label={t.lightboxClose}
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
