import FadeInSection from "@/components/FadeInSection";
import { content, type Locale } from "@/lib/content";
import styles from "./WorkSection.module.css";

interface WorkSectionProps {
  locale?: Locale;
}

/* Farbe des Etiketts je Stufe; die Texte liegen in lib/content.ts. */
const TAG_CLASS: Record<string, string> = {
  projekt: styles.tagProjekt,
  teilzeit: styles.tagTeilzeit,
  festanstellung: styles.tagFest,
};

export default function WorkSection({ locale = "de" }: WorkSectionProps) {
  const t = content[locale].work;

  return (
    <section id="arbeiten" className={styles.stage} aria-label={t.ariaLabel}>
      <FadeInSection>
        <div className={styles.panel}>
          <p className={`${styles.kicker} mono`}>{t.kicker}</p>
          <h2 className={styles.title}>
            {t.titlePre}
            <em>{t.titleEmphasis}</em>.
          </h2>
          <p className={styles.lead}>{t.lead}</p>
          <ul className={styles.tiers}>
            {t.tiers.map((tier) => (
              <li key={tier.id} className={`${styles.tier} ${tier.isMain ? styles.main : ""}`}>
                <span className={`${styles.tag} ${TAG_CLASS[tier.id] ?? ""}`}>{tier.tag}</span>
                <h3>{tier.title}</h3>
                <p className={styles.audience}>{tier.audience}</p>
                <p className={`${styles.terms} mono`}>{tier.terms}</p>
                <ul className={styles.points}>
                  {tier.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className={styles.proof}>
                  {t.proofLabel} <b>{tier.proof}</b>
                </p>
                <a className={styles.cta} href="#kontakt">
                  {tier.cta}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </FadeInSection>
    </section>
  );
}
