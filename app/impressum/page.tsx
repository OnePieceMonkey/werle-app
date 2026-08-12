import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Impressum — Werle Technologies",
  description:
    "Anbieterkennzeichnung gemäß § 5 DDG für werle.app: Kontakt, Umsatzsteuer-ID und rechtliche Hinweise.",
};

export default function ImpressumPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={`${styles.kicker} mono`}>Rechtliches</p>
        <h1 className={styles.title}>Impressum</h1>
        <p className={styles.intro}>Anbieterkennzeichnung für werle.app.</p>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Angaben gemäß § 5 DDG
          </h2>
          <p>
            Werle Technologies
            <br />
            Patrick Werle
            <br />
            Kalksteinstraße 6
            <br />
            32429 Minden
            <br />
            Deutschland
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:werle.business@gmail.com">
              werle.business@gmail.com
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Umsatzsteuer</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a
            Umsatzsteuergesetz:
            <br />
            <strong>DE463711023</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Verantwortlich für den Inhalt
          </h2>
          <p>Patrick Werle, Werle Technologies, Anschrift wie oben.</p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            EU-Streitschlichtung
          </h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben unter „Kontakt&#8220;.
            Wir sind nicht bereit und nicht verpflichtet, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Haftung für Inhalte
          </h2>
          <p>
            Als Diensteanbieter sind wir für eigene Inhalte auf dieser
            Website nach den allgemeinen Gesetzen verantwortlich. Wir sind
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die
            auf eine rechtswidrige Tätigkeit hinweisen. Eine Haftung ist erst
            ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
            möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen
            entfernen wir die betroffenen Inhalte umgehend.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Haftung für Links
          </h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Für diese fremden
            Inhalte können wir daher keine Gewähr übernehmen; verantwortlich
            ist stets der jeweilige Anbieter der verlinkten Seite. Zum
            Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.
            Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche
            Links umgehend.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Urheberrecht</h2>
          <p>
            Die auf dieser Website veröffentlichten Inhalte — Texte,
            Grafiken und Bildmaterial der vorgestellten Projekte — unterliegen
            dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung,
            Verbreitung und jede Art der Verwertung außerhalb der Grenzen
            des Urheberrechts bedürfen der schriftlichen Zustimmung des
            jeweiligen Rechteinhabers.
          </p>
        </section>

        <nav className={styles.footerNav} aria-label="Rechtliche Seiten">
          <Link href="/#top">← Zurück zur Startseite</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </nav>
      </div>
    </main>
  );
}
