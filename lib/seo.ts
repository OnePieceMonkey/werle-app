import type { Metadata } from "next";
import { content, type Locale } from "@/lib/content";

// Vercel leitet werle.app per 308 auf www.werle.app um — Canonical, Sitemap und
// JSON-LD müssen auf die Adresse zeigen, die tatsächlich antwortet.
export const SITE_URL = "https://www.werle.app";

const HOME_PATH: Record<Locale, string> = { de: "/", en: "/en" };

// Dieselbe Alternates-Liste auf / und /en: jede Sprachversion verweist auf
// beide Varianten plus x-default (= deutsche Startseite).
const HOME_LANGUAGES = {
  "de-DE": HOME_PATH.de,
  "en-US": HOME_PATH.en,
  "x-default": HOME_PATH.de,
};

export function homeMetadata(locale: Locale): Metadata {
  const { title, description } = content[locale].meta;
  const path = HOME_PATH[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: path, languages: HOME_LANGUAGES },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Seiten ohne Sprachvariante (Impressum, Datenschutz): eigener Canonical,
// kein hreflang. Das Page-Metadata ersetzt `alternates` und `openGraph` des
// Layouts komplett, deshalb stehen hier alle drei Felder.
export function legalMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "de_DE" },
    twitter: { card: "summary_large_image", title, description },
  };
}
