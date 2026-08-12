import styles from "./LabrechnerSection.module.css";

export default function LabrechnerSection() {
  return (
    <section id="labrechner" className={styles.stage}>
      <div
        className={styles.panel}
        aria-label="Labrechner — DentalBilling Engine"
      >
        <p className={`${styles.kicker} mono`}>
          <span className={styles.dot} aria-hidden="true" />
          Eigenständiges Venture · Werle Technologies
        </p>
        <div className={styles.titles}>
          <h2>Labrechner</h2>
          <span className={`${styles.sub} mono`}>
            DentalBilling Engine — die Infrastruktur-Ebene darunter
          </span>
        </div>
        <p className={styles.body}>
          Die deutschen Abrechnungsregelwerke für Zahntechnik —{" "}
          <strong>BEL-II</strong> und <strong>BEB&apos;97</strong> —
          vollständig in Code abgebildet, GoBD-konform und nachvollziehbar
          bis zur einzelnen Regel. Labrechner ist die Kundenmarke,
          DentalBilling Engine die B2B-Infrastruktur-Ebene darunter: ein
          eigenständiges Venture unter Werle Technologies, das unabhängig
          läuft.
        </p>
        <div className={`${styles.stats} mono`}>
          <div className={styles.stat}>
            <span className={styles.num}>68.000+</span>
            <span className={styles.lbl}>Lines of Code</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.num}>510+</span>
            <span className={styles.lbl}>Automatisierte Tests</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.num}>0</span>
            <span className={styles.lbl}>
              Offene High/Critical Findings
              <br />
              Pentest, Stand 03/2026
            </span>
          </div>
        </div>
        <p className={styles.outlook}>
          Das Muster dahinter — <em>komplexe regulierte Fachlogik in
          auditierbare Software übersetzen</em> — trägt über die
          Zahnmedizin hinaus.
        </p>
        <a
          className={styles.cta}
          href="https://check.labrechner.de"
          target="_blank"
          rel="noopener"
        >
          check.labrechner.de{" "}
          <span aria-hidden="true" className={styles.arrow}>
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
