import FadeInSection from "@/components/FadeInSection";
import PlushPortrait from "@/components/PlushPortrait";
import { content, type Locale } from "@/lib/content";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  locale?: Locale;
}

export default function AboutSection({ locale = "de" }: AboutSectionProps) {
  const t = content[locale].about;

  return (
    <section id="ueber-mich" className={styles.stage} aria-label={t.ariaLabel}>
      <FadeInSection>
        <div className={styles.panel}>
          <div className={styles.portrait}>
            <PlushPortrait src="/images/patrick-portrait.jpg" alt={t.portraitAlt} hint={t.hint} />
          </div>
          <div className={styles.text}>
            <p className={`${styles.kicker} mono`}>{t.kicker}</p>
            <h2 className={styles.title}>
              {t.titlePre}
              <em>{t.titleEmphasis}</em>
              {t.titlePost}
            </h2>
            <p className={styles.lead}>{t.lead}</p>
            <ul className={styles.facts}>
              {t.facts.map((fact) => (
                <li key={fact.label}>
                  <span>
                    <b>{fact.label}</b> {fact.text}
                  </span>
                </li>
              ))}
            </ul>
            <ul className={styles.chips}>
              {t.chips.map((chip) => (
                <li key={chip} className="mono">
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
