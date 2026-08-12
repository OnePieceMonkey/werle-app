import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Datenschutz — Werle Technologies",
  description:
    "Datenschutzerklärung zu werle.app: welche Daten das Kontaktformular, die Produkt-Vormerkung und das Hosting verarbeiten.",
};

export default function DatenschutzPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={`${styles.kicker} mono`}>Rechtliches</p>
        <h1 className={styles.title}>Datenschutzerklärung</h1>
        <p className={styles.stand}>Stand: 12. August 2026</p>

        <div className={styles.summary}>
          <p>
            <strong>Kurzfassung:</strong> werle.app erhebt keine
            personenbezogenen Daten allein durchs Ansehen der Seite, setzt
            keine Cookies und bindet kein Tracking oder Analyse-Werkzeug
            ein. Persönliche Daten entstehen nur, wenn Sie sie aktiv
            eingeben — über das Kontaktformular oder die
            E-Mail-Vormerkung. Beide werden ausschließlich zur Bearbeitung
            Ihrer Anfrage verwendet und an keinen Dritten zu Werbezwecken
            weitergegeben.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Verantwortlicher</h2>
          <p>
            Werle Technologies, Patrick Werle
            <br />
            Kalksteinstraße 6, 32429 Minden, Deutschland
            <br />
            E-Mail:{" "}
            <a href="mailto:werle.business@gmail.com">
              werle.business@gmail.com
            </a>
            <br />
            Vollständige Anbieterkennzeichnung:{" "}
            <Link href="/impressum">Impressum</Link>
          </p>
          <p>
            Ein Datenschutzbeauftragter ist gesetzlich nicht vorgeschrieben
            (§ 38 BDSG) — wir beschäftigen nicht dauerhaft mindestens
            zwanzig Personen mit der automatisierten Verarbeitung
            personenbezogener Daten.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Hosting bei Vercel
          </h2>
          <p>
            Diese Website wird bei Vercel Inc., 440 N Barranca Avenue
            #4133, Covina, CA 91723, USA, gehostet und ausschließlich
            verschlüsselt per HTTPS ausgeliefert. Beim Aufruf jeder Seite
            verarbeitet Vercel automatisch technische Zugriffsdaten
            (Server-Logs) — IP-Adresse, Datum und Uhrzeit des Zugriffs,
            aufgerufene URL, Browsertyp und Referrer. Das ist technisch
            notwendig, um die Website auszuliefern und Störungen oder
            Missbrauch zu erkennen. Rechtsgrundlage ist Art. 6 Abs. 1
            lit. f DSGVO — unser berechtigtes Interesse an einem sicheren,
            funktionsfähigen Betrieb.
          </p>
          <p>
            Dabei kann eine Verarbeitung in den USA stattfinden. Vercel
            gibt an, am EU-US Data Privacy Framework teilzunehmen und
            stellt darüber hinaus einen Auftragsverarbeitungsvertrag auf
            Basis der EU-Standardvertragsklauseln (Art. 46 DSGVO) bereit.
            Details:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener"
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Kontaktformular</h2>
          <p>
            Wenn Sie das Kontaktformular nutzen, übermitteln wir Name,
            E-Mail-Adresse und Ihre Nachricht per E-Mail an{" "}
            <strong>werle.business@gmail.com</strong>. Der Versand läuft
            technisch über den E-Mail-Dienstleister Resend (Plus Five Five,
            Inc., USA). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO,
            soweit Ihre Anfrage auf eine vertragliche oder vorvertragliche
            Klärung zielt, andernfalls Art. 6 Abs. 1 lit. f DSGVO — unser
            berechtigtes Interesse, eingehende Anfragen beantworten zu
            können.
          </p>
          <p>
            Resend verarbeitet die Daten dabei in den USA. Die Übermittlung
            stützt sich auf die EU-Standardvertragsklauseln gemäß Resends
            Auftragsverarbeitungsvertrag (
            <a
              href="https://resend.com/legal/dpa"
              target="_blank"
              rel="noopener"
            >
              resend.com/legal/dpa
            </a>
            ). Resends Datenschutzerklärung:{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener"
            >
              resend.com/legal/privacy-policy
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            E-Mail-Vormerkung für ALIBI und coParents
          </h2>
          <p>
            Wenn Sie sich für ALIBI oder coParents vormerken lassen,
            übermitteln wir Ihre E-Mail-Adresse und das gewählte Produkt
            über denselben Weg (Resend) an{" "}
            <strong>werle.business@gmail.com</strong>, um Sie bei
            Verfügbarkeit zu benachrichtigen. Rechtsgrundlage ist Ihre
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie durch das
            Absenden des Formulars erteilen und die Sie jederzeit formlos
            per E-Mail widerrufen können (Art. 7 Abs. 3 DSGVO) — der
            Widerruf berührt nicht die Rechtmäßigkeit der bis dahin
            erfolgten Verarbeitung.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Schriften (Google Fonts)
          </h2>
          <p>
            Diese Website verwendet die Schriften Fraunces, IBM Plex Sans
            und IBM Plex Mono aus dem Google-Fonts-Katalog. Die Schriften
            werden beim Build über <code>next/font</code> selbst gehostet
            und mit der Website ausgeliefert — es findet zur Laufzeit
            <strong> keine Verbindung</strong> zu Google-Servern statt.
            Ihre IP-Adresse wird beim Laden der Schriften nicht an Google
            übertragen.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Lokale Speicherung im Browser
          </h2>
          <p>
            Diese Website setzt keine Cookies. Zwei Flags im{" "}
            <code>sessionStorage</code> Ihres Browsers merken sich, ob die
            Boot-up-Animation in dieser Sitzung schon gezeigt wurde und ob
            Sie den Rotationshinweis geschlossen haben. Diese Werte bleiben
            ausschließlich lokal auf Ihrem Gerät, werden nie an uns oder
            Dritte übertragen und verschwinden automatisch mit dem
            Schließen des Browser-Tabs. Sie dienen ausschließlich der
            unmittelbar von Ihnen ausgelösten Anzeige-Steuerung und fallen
            damit unter die Ausnahme für technisch unbedingt erforderliche
            Vorgänge (§ 25 Abs. 2 Nr. 2 TTDSG) — eine Einwilligung ist
            dafür nicht nötig.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Kein Tracking, keine Analyse-Werkzeuge
          </h2>
          <p>
            Diese Website bindet aktuell keine Analyse- oder
            Werbe-Tools ein — kein Google Analytics, kein Pixel, kein
            Fingerprinting. Vercel Analytics ist im Projekt bewusst noch
            nicht aktiviert. Sollte sich das künftig ändern, passen wir
            diese Erklärung vorher an. Weil keine solchen Technologien im
            Einsatz sind, ist derzeit kein Cookie-Banner erforderlich.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Empfänger im Überblick
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Empfänger</th>
                  <th>Daten</th>
                  <th>Wann</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vercel (USA)</td>
                  <td>IP-Adresse, Server-Logs</td>
                  <td>bei jedem Seitenaufruf</td>
                </tr>
                <tr>
                  <td>Resend (USA)</td>
                  <td>Name, E-Mail, Nachricht bzw. Produktwahl</td>
                  <td>nur bei Formularversand</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Speicherdauer</h2>
          <p>
            E-Mails aus dem Kontaktformular und der Produkt-Vormerkung
            bewahren wir so lange auf, wie es für die Bearbeitung Ihrer
            Anfrage nötig ist. Eine automatisierte Löschfrist ist dafür
            aktuell nicht eingerichtet; auf Wunsch löschen wir Ihre Daten
            jederzeit manuell — siehe „Ihre Rechte&#8220; unten. Server-Logs bei
            Vercel unterliegen dessen eigener, technisch bedingter
            Aufbewahrungsdauer.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>Ihre Rechte</h2>
          <p>
            Ihnen stehen die Rechte aus Art. 15–21 DSGVO zu: Auskunft
            (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
            Einschränkung der Verarbeitung (Art. 18),
            Datenübertragbarkeit (Art. 20) und Widerspruch gegen die
            Verarbeitung (Art. 21). Eine erteilte Einwilligung können Sie
            jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7
            Abs. 3 DSGVO). Wenden Sie sich dazu formlos an{" "}
            <a href="mailto:werle.business@gmail.com">
              werle.business@gmail.com
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <p>
            Sie haben das Recht, sich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO) —
            etwa bei der für unseren Sitz zuständigen Landesbeauftragten
            für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
            (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf, oder bei der
            Aufsichtsbehörde an Ihrem Wohnort.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} mono`}>
            Änderungen dieser Erklärung
          </h2>
          <p>
            Ändert sich die Datenverarbeitung auf dieser Website,
            veröffentlichen wir die angepasste Fassung an dieser Stelle mit
            aktualisiertem Datum oben.
          </p>
        </section>

        <nav className={styles.footerNav} aria-label="Rechtliche Seiten">
          <Link href="/#top">← Zurück zur Startseite</Link>
          <Link href="/impressum">Impressum</Link>
        </nav>
      </div>
    </main>
  );
}
