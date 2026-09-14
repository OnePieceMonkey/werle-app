import FadeInSection from "@/components/FadeInSection";
import { content, type Locale } from "@/lib/content";
import styles from "./LabrechnerSection.module.css";

interface LabrechnerSectionProps {
  locale?: Locale;
}

export default function LabrechnerSection({ locale = "de" }: LabrechnerSectionProps) {
  const t = content[locale].labrechner;

  return (
    <section id="labrechner" className={styles.stage}>
      <FadeInSection>
        <div className={styles.panel} aria-label={t.ariaLabel}>
          <p className={`${styles.kicker} mono`}>
            <span className={styles.dot} aria-hidden="true" />
            {t.kicker}
          </p>
          <div className={styles.titles}>
            <h2>{t.title}</h2>
            <span className={`${styles.sub} mono`}>{t.sub}</span>
          </div>
          <p className={styles.body}>
            {t.bodyPre}
            <strong>BEL-II</strong>
            {t.bodyMid}
            <strong>BEB&apos;97</strong>
            {t.bodyPost}
          </p>
          <div className={`${styles.stats} mono`}>
            <div className={styles.stat}>
              <span className={styles.num}>{t.stats.locValue}</span>
              <span className={styles.lbl}>{t.stats.locLabel}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.num}>{t.stats.testsValue}</span>
              <span className={styles.lbl}>{t.stats.testsLabel}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.num}>{t.stats.findingsValue}</span>
              <span className={styles.lbl}>
                {t.stats.findingsLabelLine1}
                <br />
                {t.stats.findingsLabelLine2}
              </span>
            </div>
          </div>
          <p className={styles.outlook}>
            {t.outlookPre}
            <em>{t.outlookEmphasis}</em>
            {t.outlookPost}
          </p>
          <a
            className={styles.cta}
            href="https://check.labrechner.de"
            target="_blank"
            rel="noopener"
          >
            {t.ctaLabel}{" "}
            <span aria-hidden="true" className={styles.arrow}>
              ↗
            </span>
          </a>
        </div>
      </FadeInSection>
    </section>
  );
}
