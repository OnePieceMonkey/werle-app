/* Kauf-Links für „Bechterew unter Kontrolle". Leerer String = Shop-Link
   noch nicht bekannt → der Button wird nicht gerendert (nie ein toter Link).
   URLs hier eintragen, sobald sie vorliegen. */
export const BOOK_LINKS = {
  kindle: "",
  appleBooks: "",
  tolino: "",
} as const;

export type BookShop = keyof typeof BOOK_LINKS;

export const BOOK_SHOP_LABELS: Record<BookShop, string> = {
  kindle: "Kindle",
  appleBooks: "Apple Books",
  tolino: "Tolino",
};

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
