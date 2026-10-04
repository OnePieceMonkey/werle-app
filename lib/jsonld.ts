import type { Locale } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

const ORG_ID = `${SITE_URL}/#organization`;

// Nur belegte Felder. Keine Bewertungen, keine ISBN/Preise (stehen nirgends
// im Repo). App-Schemas (MobileApplication) folgen, sobald die App-Store-URLs
// vorliegen.
export function homeJsonLd(locale: Locale) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Werle Technologies",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: ["https://www.linkedin.com/company/werle-technologies/"],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Werle Technologies",
    url: SITE_URL,
    inLanguage: locale === "de" ? "de-DE" : "en-US",
    publisher: { "@id": ORG_ID },
  };
  const book = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Bechterew unter Kontrolle",
    author: { "@type": "Person", name: "Patrick Werle" },
    image: `${SITE_URL}/images/buch-cover.jpg`,
    inLanguage: "de",
  };
  return [org, website, book];
}
