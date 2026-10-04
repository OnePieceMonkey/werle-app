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
