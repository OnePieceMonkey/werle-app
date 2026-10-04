/* Kauf-Links für „Bechterew unter Kontrolle". Leerer String = Link
   unbekannt → der Button wird nicht gerendert (nie ein toter Link).
   Reihenfolge der Schlüssel = Reihenfolge der Buttons. */
export type BookShop = "kindle" | "paperback" | "appleBooks" | "tolino";

export const BOOK_LINKS: Record<BookShop, string> = {
  kindle: "https://www.amazon.de/dp/B0HD7BH5NP",
  paperback: "https://www.amazon.de/dp/B0HD9JV1H8",
  appleBooks: "https://books.apple.com/de/book/bechterew-unter-kontrolle/id6798196600",
  tolino: "https://www.thalia.de/shop/home/artikeldetails/A1081269619",
};

export const BOOK_SHOP_LABELS: Record<BookShop, { de: string; en: string }> = {
  kindle: { de: "Kindle", en: "Kindle" },
  paperback: { de: "Taschenbuch", en: "Paperback" },
  appleBooks: { de: "Apple Books", en: "Apple Books" },
  tolino: { de: "Tolino (Thalia)", en: "Tolino (Thalia)" },
};

/* Eigene Buchseite (Subdomain, GitHub Pages) — verlinkt aus der Buch-Sektion. */
export const BOOK_SITE = "https://bechterew-buch.werle.app";

/* App-Store-Seiten, übernommen aus den Subdomain-Repos (pulsegate.werle.app,
   verhoer.werle.app) und per Abruf als die jeweiligen Apps bestätigt. */
export const APP_STORE_URLS = {
  pulsegate: "https://apps.apple.com/app/id6788528869",
  alibi: "https://apps.apple.com/de/app/id6797754222",
  // JellyCut: leer, bis die App im Store ist. Dann hier die URL eintragen
  // (country-neutral: https://apps.apple.com/app/id<APPLE_ID>) — Banner und
  // JSON-LD ziehen sie automatisch. Bis dahin führt der Banner auf die
  // Produktseite jellycut.werle.app.
  jellycut: "",
} as const;

export const PRODUCT_SITES = {
  pulsegate: "https://pulsegate.werle.app",
  alibi: "https://verhoer.werle.app",
  jellycut: "https://jellycut.werle.app",
} as const;

// coParents: Website ist live, die App noch nicht im Store.
export const COPARENTS_SITE = "https://co.parents.software/";
