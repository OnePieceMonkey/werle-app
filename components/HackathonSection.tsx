import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";
import { content, type Locale } from "@/lib/content";
import styles from "./HackathonSection.module.css";

/* Bild je Projekt, getrennt von den übersetzbaren Texten in lib/content.ts.
   Neues Projekt = Eintrag in content.hackathons.projects (beide Sprachen)
   plus ein Bild hier. */
const IMAGES: Record<string, { src: string; width: number; height: number }> = {
  recourse: { src: "/images/recourse-console.webp", width: 1200, height: 750 },
  vermerk: { src: "/images/vermerk-nachweis.webp", width: 1200, height: 750 },
};

interface HackathonSectionProps {
  locale?: Locale;
}

export default function HackathonSection({ locale = "de" }: HackathonSectionProps) {
  const t = content[locale].hackathons;

  return (
    <section id="hackathons" className={styles.stage}>
      <FadeInSection>
        <div className={styles.panel} aria-label={t.ariaLabel}>
          <h2 className={styles.title}>
            {t.titlePre}
            <em>{t.titleEmphasis}</em>.
          </h2>
          <p className={`${styles.tagline} serif`}>{t.tagline}</p>
          <ul className={styles.grid}>
            {t.projects.map((project) => {
              const image = IMAGES[project.id];
              return (
                <li key={project.id} className={styles.card}>
                  {image && (
                    <div className={styles.shot}>
                      <Image
                        src={image.src}
                        alt={project.imageAlt}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 760px) 92vw, 520px"
                      />
                    </div>
                  )}
                  <div className={styles.body}>
                    <span className={styles.tag}>{project.status}</span>
                    <h3>{project.title}</h3>
                    <p className={styles.hook}>{project.description}</p>
                    <div className={styles.links}>
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          className={styles.link}
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                        >
                          {link.label}
                          <span className={styles.arrow} aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </FadeInSection>
    </section>
  );
}
