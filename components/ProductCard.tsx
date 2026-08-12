"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";

export type ProductCardVariant = "pulsegate" | "alibi" | "coparents";
export type ProductCardAccent = "teal" | "indigo" | "coral";

interface ProductCardImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductCardMedia {
  main: ProductCardImage;
  /** PulseGate: Gameplay-Inset im Pulse-Ring. ALIBI: Porträt. coParents: zweiter Screenshot. */
  secondary?: ProductCardImage;
  /** Nur coParents: App-Icon-Badge. */
  icon?: ProductCardImage;
}

interface ProductCardNotify {
  /** Kennung fürs spätere Log/Payload (siehe TODO im Handler). */
  product: string;
  label: string;
  ariaLabel: string;
}

export interface ProductCardProps {
  variant: ProductCardVariant;
  status: string;
  accent: ProductCardAccent;
  title: ReactNode;
  /** Für die a11y-Bezeichnung des Karten-Links (title kann JSX mit <em> enthalten). */
  ariaLabel?: string;
  description: string;
  href?: string;
  ctaLabel: string;
  media: ProductCardMedia;
  notify?: ProductCardNotify;
}

const ACCENT_TAG_CLASS: Record<ProductCardAccent, string> = {
  teal: styles.tagTeal,
  indigo: styles.tagIndigo,
  coral: styles.tagCoral,
};

/**
 * E-Mail-Vormerkung für ALIBI/coParents ("Bescheid sagen, wenn's da ist").
 * Reiner UI-Placeholder wie in der freigegebenen Demo — Submit loggt nur
 * und zeigt eine kurze Bestätigung, kein echter Versand.
 */
function NotifyForm({
  variant,
  notify,
}: {
  variant: ProductCardVariant;
  notify: ProductCardNotify;
}) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const fieldId = `notify-${notify.product}-email`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");

    // TODO: echte Next.js API-Route siehe Task 6/7 (Kontaktformular +
    // E-Mail-Vormerkung, Resend-Backend). Bislang nur UI-Placeholder wie
    // in der freigegebenen Demo — console.log + kurze Bestätigung, kein
    // echter Versand.
    console.log("[E-Mail-Vormerkung — Placeholder, kein echter Versand]", {
      product: notify.product,
      email,
    });

    setStatus("sent");
    form.reset();
    setTimeout(() => setStatus("idle"), 4000);
  }

  const formClass =
    variant === "alibi" ? styles.notifyAlibi : styles.notifyCoparents;

  return (
    <form
      className={`${styles.notifyForm} ${formClass}`}
      aria-label={notify.ariaLabel}
      onSubmit={handleSubmit}
    >
      <label htmlFor={fieldId} className={styles.notifyLabel}>
        {notify.label}
      </label>
      <div className={styles.notifyRow}>
        <input
          type="email"
          id={fieldId}
          name="email"
          placeholder="du@beispiel.de"
          required
          autoComplete="email"
        />
        <button type="submit">Los</button>
      </div>
      <span
        className={`${styles.notifyStatus} ${status === "sent" ? styles.show : ""}`}
        aria-live="polite"
      >
        {status === "sent" ? "Danke, melde mich!" : ""}
      </span>
    </form>
  );
}

export default function ProductCard({
  variant,
  status,
  accent,
  title,
  ariaLabel,
  description,
  href,
  ctaLabel,
  media,
  notify,
}: ProductCardProps) {
  const tagClass = `${styles.tag} ${ACCENT_TAG_CLASS[accent]}`;

  let mediaBlock: ReactNode;
  if (variant === "alibi") {
    mediaBlock = (
      <div className={styles.boardMedia}>
        <span className={`${styles.pinDot} ${styles.pd1}`} aria-hidden="true" />
        <span className={`${styles.pinDot} ${styles.pd2}`} aria-hidden="true" />
        <div className={styles.pinMain}>
          <Image
            src={media.main.src}
            alt={media.main.alt}
            width={media.main.width}
            height={media.main.height}
          />
        </div>
        {media.secondary && (
          <div className={styles.pinPortrait}>
            <Image
              src={media.secondary.src}
              alt={media.secondary.alt}
              width={media.secondary.width}
              height={media.secondary.height}
            />
          </div>
        )}
      </div>
    );
  } else if (variant === "pulsegate") {
    mediaBlock = (
      <div className={styles.cardMedia}>
        <Image
          src={media.main.src}
          alt={media.main.alt}
          width={media.main.width}
          height={media.main.height}
        />
        {media.secondary && (
          <div className={styles.pulseInset}>
            <span className={`${styles.pulseRing} ${styles.r1}`} aria-hidden="true" />
            <span className={`${styles.pulseRing} ${styles.r2}`} aria-hidden="true" />
            <span className={`${styles.pulseRing} ${styles.r3}`} aria-hidden="true" />
            <Image
              src={media.secondary.src}
              alt={media.secondary.alt}
              width={media.secondary.width}
              height={media.secondary.height}
            />
          </div>
        )}
      </div>
    );
  } else {
    mediaBlock = (
      <div className={styles.cardMedia}>
        <Image
          src={media.main.src}
          alt={media.main.alt}
          width={media.main.width}
          height={media.main.height}
        />
        {media.icon && (
          <Image
            className={styles.insetIcon}
            src={media.icon.src}
            alt={media.icon.alt}
            width={media.icon.width}
            height={media.icon.height}
          />
        )}
        {media.secondary && (
          <Image
            className={styles.insetSecondary}
            src={media.secondary.src}
            alt={media.secondary.alt}
            width={media.secondary.width}
            height={media.secondary.height}
          />
        )}
      </div>
    );
  }

  const body = (
    <div className={styles.cardBody}>
      <span className={tagClass}>{status}</span>
      <h3>{title}</h3>
      <p className={styles.hook}>{description}</p>
      {href ? (
        <span className={styles.cta}>
          {ctaLabel}{" "}
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </span>
      ) : (
        <span className={`${styles.cta} ${styles.ctaMuted}`}>{ctaLabel}</span>
      )}
      {/* coParents: Vormerkung sitzt in der Karte selbst, da die Karte
          (ohne href) kein <a> ist — anders als bei ALIBI unten braucht es
          hier keinen separaten Wrapper. */}
      {variant === "coparents" && notify && (
        <NotifyForm variant={variant} notify={notify} />
      )}
    </div>
  );

  if (variant === "alibi") {
    // Eigener Wrapper: das <input>/<button> der Vormerkung darf laut
    // Spezifikation nicht in ein <a> verschachtelt werden (ungültiges
    // HTML, in der Praxis unzuverlässig klickbar) — siehe Demo-Kommentar
    // im Original-HTML. Karte und Notiz bleiben optisch als Einheit.
    return (
      <div className={styles.cardWrap}>
        <a
          className={`${styles.productCard} ${styles.cardAlibi}`}
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={ariaLabel}
        >
          {mediaBlock}
          {body}
        </a>
        {notify && <NotifyForm variant={variant} notify={notify} />}
      </div>
    );
  }

  if (href) {
    return (
      <a
        className={styles.productCard}
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={ariaLabel}
      >
        {mediaBlock}
        {body}
      </a>
    );
  }

  return (
    <div className={`${styles.productCard} ${styles.cardCoparents}`} aria-label={ariaLabel}>
      {mediaBlock}
      {body}
    </div>
  );
}
