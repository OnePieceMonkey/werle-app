"use client";

import { useEffect } from "react";

/* ==================================================================
   Next.js kann das <html lang>-Attribut nur im Root-Layout setzen
   (app/layout.tsx, hier fest "de" für die deutsche Standardseite unter
   `/`) — verschachtelte Layouts rendern kein eigenes <html>-Tag mehr.
   Für `/en` bleibt als Standard-Workaround nur ein Client-Effekt, der
   das Attribut nach dem Mount umsetzt (siehe App-Router-i18n-Doku,
   node_modules/next/dist/docs/01-app/02-guides/internationalization.md
   — dort für die volle `app/[lang]/`-Routing-Variante gedacht, die wir
   hier bewusst NICHT nutzen, siehe Architektur-Entscheidung im
   Task-Auftrag). Restauriert den vorherigen Wert beim Unmount, falls
   künftig doch mal client-seitig zwischen `/` und `/en` navigiert wird
   (aktuell verlinkt der Sprachumschalter in Hero.tsx bewusst per hartem
   <a>-Link, kein next/link — siehe Kommentar dort).
   ================================================================== */
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [lang]);

  return null;
}
