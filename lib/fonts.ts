import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// Fraunces trägt den Serif-Kursiv-Akzent (z. B. "zum Anfassen" im Hero-Claim).
// Variable Font auf Google Fonts — next/font self-hostet sie, kein CDN-Request
// zur Laufzeit. weight:'variable' erlaubt das ungerade font-weight:440 aus der
// Demo (siehe globals.css `em, .serif`).
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const fontClassNames = `${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`;
