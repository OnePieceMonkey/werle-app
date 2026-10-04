import type { ReactNode } from "react";
import { fontClassNames } from "@/lib/fonts";
import type { Locale } from "@/lib/content";
import "../app/globals.css";

/* <html> darf nur ein Root-Layout rendern. Damit `/en` serverseitig
   lang="en" ausliefert, gibt es zwei Root-Layouts (Route-Groups (de) und
   (en) in app/) — beide rendern diese Hülle. */
export default function RootHtml({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return (
    <html lang={lang} className={fontClassNames}>
      <body>{children}</body>
    </html>
  );
}
