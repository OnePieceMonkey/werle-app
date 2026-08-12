"use client";

import { useState, type FormEvent } from "react";
import styles from "./ArrivalSection.module.css";

export default function ArrivalSection() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    };

    // TODO: echte Next.js API-Route siehe Task 6/7 (Kontaktformular +
    // E-Mail-Vormerkung, Resend-Backend). Bislang nur UI-Placeholder wie
    // in der freigegebenen Demo — console.log + kurze Bestätigung, kein
    // echter Versand.
    console.log(
      "[Kontaktformular — Placeholder, kein echter Versand]",
      payload,
    );

    setStatus("sent");
    form.reset();
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <section id="kontakt" className={styles.stage}>
      <div className={styles.consolePanel}>
        <p className={`${styles.kicker} mono`}>Ankunft · Kontrollpult</p>
        <h2>Kontakt aufnehmen</h2>
        <p className={styles.sub}>
          Frage, Idee oder Zusammenarbeit — eine Nachricht genügt, ich melde
          mich zurück.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="cf-name">Name</label>
            <input
              type="text"
              id="cf-name"
              name="name"
              placeholder="Wie heißt du?"
              required
              autoComplete="name"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="cf-email">E-Mail</label>
            <input
              type="email"
              id="cf-email"
              name="email"
              placeholder="du@beispiel.de"
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="cf-message">Nachricht</label>
            <textarea id="cf-message" name="message" placeholder="Worum geht's?" required />
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>
              Nachricht senden
            </button>
            <span
              className={`${styles.formStatus} ${status === "sent" ? styles.show : ""}`}
              aria-live="polite"
            >
              {status === "sent" ? "Danke, melde mich!" : ""}
            </span>
          </div>
        </form>
      </div>

      <div className={styles.plaque}>
        <span className={`${styles.rivet} ${styles.tl}`} aria-hidden="true" />
        <span className={`${styles.rivet} ${styles.tr}`} aria-hidden="true" />
        <span className={`${styles.rivet} ${styles.bl}`} aria-hidden="true" />
        <span className={`${styles.rivet} ${styles.br}`} aria-hidden="true" />
        <p className={`${styles.plaqueLabel} mono`}>Betreiber</p>
        <p className={styles.plaqueBio}>
          Patrick Werle — Software zwischen Fachdomäne und Code.
        </p>
        <p className={`${styles.plaqueMeta} mono`}>Minden · Remote</p>
        <div className={styles.plaqueLinks}>
          <a
            href="https://www.linkedin.com/in/patrick-werle-dental"
            target="_blank"
            rel="noopener"
          >
            LinkedIn ↗
          </a>
          {/* Impressum-Seite ist eigene, spätere Aufgabe (Ladungsfähige
              Anschrift fehlt noch) — Platzhalter-Ziel wie in der Demo. */}
          <a href="#">Impressum</a>
        </div>
      </div>

      <div className={styles.back}>
        <a href="#top">
          <span aria-hidden="true">↑</span> Zurück zur Startrampe
        </a>
      </div>
    </section>
  );
}
