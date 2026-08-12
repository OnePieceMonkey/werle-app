import type { Metadata } from "next";
import SetHtmlLang from "@/components/SetHtmlLang";
import { content } from "@/lib/content";

// Segment-Layout für die englische Parallel-Seite — kein eigenes <html>/
// <body> (die gehören exklusiv dem Root-Layout, app/layout.tsx), nur
// eigene Metadata + der Client-Effekt, der document.documentElement.lang
// nach dem Mount auf "en" setzt (siehe components/SetHtmlLang.tsx für die
// Begründung). metadataBase erbt vom Root-Layout (https://werle.app),
// relative Pfade hier reichen also aus.

const { title, description } = content.en.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/en",
    languages: {
      "de-DE": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title,
    description,
    url: "/en",
    type: "website",
    locale: "en_US",
  },
};

export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <SetHtmlLang lang="en" />
      {children}
    </>
  );
}
