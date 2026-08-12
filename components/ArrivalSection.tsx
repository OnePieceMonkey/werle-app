"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import styles from "./ArrivalSection.module.css";

export default function ArrivalSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    };

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request fehlgeschlagen (${res.status})`);
      }

      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("[Kontaktformular] Versand fehlgeschlagen:", error);
      setStatus("error");
    }
  }

  return (
    <section id="kontakt" className={styles.stage}>
      <FadeInSection>
        <div className={styles.consolePanel}>
          <p className={`${styles.kicker} mono`}>Ankunft · Kontrollpult</p>
          <h2>Kontakt aufnehmen</h2>
          <p className={styles.sub}>
            Frage, Idee oder Zusammenarbeit — eine Nachricht genügt, ich
            melde mich zurück.
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
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sende…" : "Nachricht senden"}
              </button>
              <span
                className={`${styles.formStatus} ${
                  status === "error" ? styles.error : ""
                } ${status === "sent" || status === "error" ? styles.show : ""}`}
                aria-live="polite"
              >
                {status === "sent" && "Danke, melde mich!"}
                {status === "error" &&
                  "Senden hat nicht geklappt — bitte gleich nochmal versuchen."}
              </span>
            </div>
          </form>
        </div>
      </FadeInSection>

      <FadeInSection>
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
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </FadeInSection>

      <div className={styles.back}>
        <a href="#top">
          <span aria-hidden="true">↑</span> Zurück zur Startrampe
        </a>
      </div>
    </section>
  );
}
