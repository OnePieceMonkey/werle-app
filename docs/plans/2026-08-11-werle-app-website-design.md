# werle.app — Hauptdomain-Website — Design

Status: freigegeben (11.08.2026). Nächster Schritt: huashu-design Direction-Advisory
für die visuelle Richtung, danach Implementierungsplan.

## Zweck

Landingpage für `werle.app` — das Dach über Patrick Werles Unternehmung „Werle
Technologies". Kein Karriere-/CV-Auftritt, sondern eine Produkt-Vitrine: was
gebaut wurde, steht im Zentrum, Patrick als Macher bleibt im Hintergrund.

Nicht Teil dieser Seite: Labrechner/DentalBilling Engine bekommt bewusst keine
eigene Sektion — es läuft als unabhängig verkäuflicher Asset-Deal unter einer
eigenen Domain. Auf werle.app taucht es nur als dezente Zeile unter „weitere
Ventures" mit Link auf `check.labrechner.de` auf, keine Case-Study-Tiefe.

## Content-Struktur (eine scrollende Seite)

1. **Hero** — Werle Technologies als Absender, kurzer Claim (kein Fließtext-CV).
2. **Produkt-Grid** — je eine Karte pro Produkt, Status ehrlich sichtbar
   (Live / Im App-Store-Review / In Entwicklung):
   - **PulseGate: Echo Shift** — Im App-Store-Review (Shipaton-Track, RevenueCat).
     Karte verlinkt auf `pulsegate.werle.app` (Support/Privacy/Store-Link liegen
     dort ohnehin für den App-Store-Pflichtauftritt).
   - **ALIBI — Das Verhör** — In Entwicklung. Karte verlinkt auf
     `verhoer.werle.app`, sobald das Repo/die Domain live ist.
   - **CoParents** (mit Timo) — In Entwicklung, kommt in einigen Wochen. Karte
     ohne Ziel-Link, nur Status-Badge, bis es einen Store-Eintrag gibt.
   Kein separates „mehr erfahren" auf werle.app selbst — die Subdomains/Stores
   sind ohnehin Pflicht fürs App-Store-Listing und übernehmen diese Rolle.
3. **Buch-Sektion, tonal abgesetzt** — „Bechterew unter Kontrolle" (Amazon KDP +
   Apple Books). Gesundheitsthema, anderes Register als die Spiele — eigene,
   visuell abgegrenzte Sektion, keine vierte Karte in der Produktreihe.
4. **Weitere Ventures** — eine dezente Zeile, Link auf `check.labrechner.de`.
5. **Footer** — kurze Bio-Zeile („Ein-Personen-Studio aus Minden, digitale
   Ideen") + LinkedIn-Link (`linkedin.com/in/patrick-werle-dental`) +
   Impressum-Pflichtlink. Keine Zertifikate, keine CV-Tiefe — die gehören zu
   LinkedIn selbst, nicht auf diese Seite.

## Stack

- **Next.js auf Vercel** — apex-Domain-fähig ohne Cloudflare-CNAME-Flattening-
  Umweg, Patrick betreibt Vercel bereits anderswo (Labrechner-Stack, MCP-Zugriff
  vorhanden).
- **GSAP + ScrollTrigger** für die choreografierten Scroll-Effekte (schwimmende
  Hintergründe, Reveal-Sequenzen) — das präziseste Werkzeug für komplexe
  scroll-gebundene Sequenzen.
- **React Three Fiber** (deklarativer Three.js-Wrapper) für 3D-Elemente.
- **Framer Motion** für leichtere UI-Mikrointeraktionen (Card-Hover,
  Eintritts-Animationen), ergonomischer als GSAP für einfache Fälle.
- **Mobile-Fallback:** 3D-Szene unterhalb einer Viewport-/GPU-Schwelle
  vereinfachen oder abschalten. 2D-Scroll-Effekte skalieren ohne Fallback.

## Visuelle Identität

Bewusst **kein** Rückgriff auf das bestehende „Patrick - Design System"
(BenAI-inspiriert, cream/schwarze Borders, „minimal motion", keine Gradients/
Texturen/Blur) — das ist für einen anderen Zweck gebaut und widerspricht dem
hier gewünschten, stark animierten, bewegungsreichen Auftritt direkt. werle.app
bekommt eine eigene, unabhängige Identität.

Nächster Schritt: `huashu-design` Direction-Advisory — 2–3 echte visuelle
Demo-Richtungen parallel generieren statt Textbeschreibung. Eine Richtung
testweise mit den ALIBI-Illustrationen (Tusche-Kreuzschraffur + Blauwäsche auf
cremefarbenem Papier, aus der heutigen Session) als Bildmaterial, weil dieser
Stil bereits eine erkennbare, hochwertige Handschrift hat.

## Projekt-Ort

Neues, eigenständiges Repo: `~/Projekte/werle-app/` (git-initialisiert
11.08.2026), Deploy über Vercel.

## Offene Punkte für später

- ALIBI-Karte kann erst live verlinken, sobald `alibi-support` existiert
  (blockiert auf Patricks ladungsfähige Anschrift fürs Impressum, siehe
  `Games/alibi/DOMAIN-SETUP.md`).
- CoParents-Karte braucht Ziel-Link, sobald ein Store-Eintrag existiert.
- werle.app selbst braucht eigenes Impressum/Datenschutz (Root-Domain,
  eigene Pflichtseiten, unabhängig von den Subdomains).
