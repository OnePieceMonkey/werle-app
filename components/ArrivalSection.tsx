"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import { content, type Locale } from "@/lib/content";
import styles from "./ArrivalSection.module.css";

interface ArrivalSectionProps {
  locale?: Locale;
}

export default function ArrivalSection({ locale = "de" }: ArrivalSectionProps) {
  const t = content[locale].arrival;
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
          <p className={`${styles.kicker} mono`}>{t.kicker}</p>
          <h2>{t.heading}</h2>
          <p className={styles.sub}>{t.sub}</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="cf-name">{t.form.nameLabel}</label>
              <input
                type="text"
                id="cf-name"
                name="name"
                placeholder={t.form.namePlaceholder}
                required
                autoComplete="name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="cf-email">{t.form.emailLabel}</label>
              <input
                type="email"
                id="cf-email"
                name="email"
                placeholder={t.form.emailPlaceholder}
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="cf-message">{t.form.messageLabel}</label>
              <textarea
                id="cf-message"
                name="message"
                placeholder={t.form.messagePlaceholder}
                required
              />
            </div>
            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "sending"}
              >
                {status === "sending" ? t.form.submitSending : t.form.submitIdle}
              </button>
              <span
                className={`${styles.formStatus} ${
                  status === "error" ? styles.error : ""
                } ${status === "sent" || status === "error" ? styles.show : ""}`}
                aria-live="polite"
              >
                {status === "sent" && t.form.success}
                {status === "error" && t.form.error}
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
          <p className={`${styles.plaqueLabel} mono`}>{t.plaque.label}</p>
          <p className={styles.plaqueBio}>{t.plaque.bio}</p>
          <p className={`${styles.plaqueMeta} mono`}>{t.plaque.meta}</p>
          <div className={styles.plaqueLinks}>
            <a
              href="https://www.linkedin.com/in/patrick-werle-dental"
              target="_blank"
              rel="noopener"
            >
              {t.plaque.linkedinLabel}
            </a>
            {/* Zeigt auf beiden Sprachversionen auf dieselben deutschen
                Rechtsseiten (kein separates EN-Impressum/-Datenschutz,
                bewusster Scope-Cut) — nur das Link-Label ist übersetzt. */}
            <Link href="/impressum">{t.plaque.imprintLabel}</Link>
            <Link href="/datenschutz">{t.plaque.privacyLabel}</Link>
          </div>
        </div>
      </FadeInSection>

      <div className={styles.back}>
        <a href="#top">
          <span aria-hidden="true">↑</span> {t.back}
        </a>
      </div>
    </section>
  );
}
