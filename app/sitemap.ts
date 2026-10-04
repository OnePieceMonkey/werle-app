import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Kein lastModified: Es lässt sich nicht sauber aus dem Repo ableiten
// (Build-Zeit wäre bei jedem Deploy "neu" und damit falsch).
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    "de-DE": SITE_URL,
    "en-US": `${SITE_URL}/en`,
    "x-default": SITE_URL,
  };
  return [
    { url: SITE_URL, alternates: { languages } },
    { url: `${SITE_URL}/en`, alternates: { languages } },
    { url: `${SITE_URL}/impressum` },
    { url: `${SITE_URL}/datenschutz` },
  ];
}
