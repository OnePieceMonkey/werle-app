import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

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

const title = "Werle Technologies";
const description =
  "Zwei Spiele, eine App und ein Buch — zum Anfassen, nicht nur zum Ansehen.";

export const metadata: Metadata = {
  metadataBase: new URL("https://werle.app"),
  title,
  description,
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161e33",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
