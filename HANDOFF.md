# Übergabe — Stand 12.08.2026

Einstiegspunkt für eine frische Session. Ziel: `werle.app` exakt so bauen,
wie es die freigegebene Demo zeigt, dann live schalten.

## In einem Satz

Die Design-Phase ist komplett abgeschlossen und vom Kunden freigegeben (sechs
Demo-Runden). Die echte Next.js-Umsetzung läuft — Projekt-Scaffold steht,
der DOM-/Styles-/Content-Port war beim Sessionwechsel noch nicht committet.

## Quelle der Wahrheit

**`_temp/design-demos/demo-3d-world-v6.html`** — nicht v1–v5, nicht dieses
Dokument. Jede Farbe, jeder Text, jede Interaktion daraus ist bindend. Das
ist eine über sechs Iterationen mit Patrick abgestimmte, freigegebene
Design-Demo (Kundenzitat: "trägt sich, gefällt mir gut"). Bei Zweifel: die
Demo-Datei im Browser öffnen und nachsehen, nicht raten.

Enthält: Weltraum-3D-Szene (Three.js, Kamerafahrt an Scroll gekoppelt,
Maus-Parallaxe), Boot-up-Intro + Ladefortschritt, Sound-Toggle (Web Audio,
synthetisiert, standardmäßig stumm), Hero mit kontrastkorrigiertem Glow,
Produktkarten (PulseGate/ALIBI/coParents, echte Bilder, Status-Badges,
E-Mail-Vormerkung bei ALIBI/coParents), Labrechner-Section, Buch-Section
(Cover+Backcover), Ringplanet+Satellit mit Klick-Easter-Eggs, Cursor-Trail,
vertikale Missions-Navigation, Warp-Übergang, Ankunfts-Sektion (Kontaktformular
als Bordterminal + Footer-Infos als Mission-Plaque), Rücksprung-Link,
bewegungsreduzierter Modus (`prefers-reduced-motion`), Mobil-Dreh-Hinweis.

Frühere Demo-Versionen (v1–v5) im selben Ordner sind Zwischenstände — nicht
verwenden, nur v6 zählt.

## Design-Dokumente (in dieser Reihenfolge lesen)

1. `docs/plans/2026-08-11-werle-app-website-design.md` — das Gesamtdesign:
   Content-Struktur, Stack-Entscheidung, alle Kundenentscheidungen mit Datum,
   inkl. der Revision "Labrechner bekommt doch eine volle Section".
2. `docs/plans/2026-08-12-nextjs-implementation.md` — der Task-für-Task-
   Implementierungsplan (9 Tasks). **Tasks 2–5 wurden in der Praxis zu EINEM
   Agent-Durchgang zusammengefasst** (zu eng gekoppelt für isolierte
   Einzel-Tasks — siehe Status unten), der Rest des Plans gilt wie geschrieben.

## Status beim Sessionwechsel (12.08.2026)

- ✅ **Task 1 — Next.js-Scaffold**: committet (`chore: Next.js-Projekt-Scaffold
  mit R3F, GSAP, Resend`). App Router, TypeScript, kein Tailwind. Dependencies
  installiert: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`,
  `resend`. `npm run build` lief zuletzt fehlerfrei.
- ✅ **Tasks 2–5, DOM-Teil (DOM-Struktur, Styles, Content-Sektionen, noch OHNE
  3D-Szene)**: fertig UND committet (`9df810c`), nach diesem Übergabe-Dokument
  abgeschlossen. `npm run build`, `npm run lint`, TypeScript alle sauber.
  Komponenten: `Hero`, `ProductCard`, `LabrechnerSection`, `BookSection`,
  `ArrivalSection`, `MissionNav`, `SpaceScene` (Platzhalter) unter
  `components/`, Bilder in `public/images/`.
  - **Bewusste Abweichung von der Demo, die die nächste Session kennen muss:**
    Die Sektionen liegen im normalen Dokumentenfluss (`min-height:100vh` pro
    Sektion, `IntersectionObserver` für die aktive Sektion in `MissionNav`)
    statt als `position:fixed`-Overlays, die die (noch fehlende) Scroll-Kamera
    per Opacity einblendet. Das ist ok, muss aber beim Einbau der 3D-Szene
    (nächster Punkt) mitgedacht werden — die Szene muss sich an dieses
    bestehende Scroll-Modell andocken, nicht das DOM-Layout nochmal umbauen.
  - `SpaceScene.tsx` ist bewusst nur ein leerer Platzhalter — die eigentliche
    3D-Szene ist der nächste, größte Einzel-Task (siehe unten).
  - Impressum-Link ist noch `href="#"` (Seite existiert erst mit Task 8).
- ⬜ **3D-Szene** (ursprünglich Task 3, größter verbleibender Einzel-Task):
  Three.js-Logik aus der v6-Demo in `SpaceScene.tsx` als React-Three-Fiber-
  Komponente portieren — Sterne, Nebel, Hero-Glow, alle Produkt-Panel-Objekte,
  Ringplanet+Satellit (inkl. Realismus-Shader und Klick-Easter-Eggs), Warp,
  scroll-gekoppelte Kamerafahrt, Maus-Parallaxe, `prefers-reduced-motion`-
  Fallback — **angedockt an das bestehende IntersectionObserver-/
  Dokumentenfluss-Scroll-Modell aus dem vorigen Punkt**, nicht als Neubau des
  Layouts. 1:1-Verhalten zur Demo ist Pflicht, kein Neuentwurf.
- ⬜ **Boot-up/Sound/Cursor-Trail** (Task 5): mit der 3D-Szene zusammen bauen
  (Boot-up blendet visuell in die Szene über, eng gekoppelt).
- ⬜ **Task 6 — Kontaktformular-API**: `app/api/contact/route.ts` +
  Resend-Anbindung. Code-Vorlage steht im Implementierungsplan.
- ⬜ **Task 7 — E-Mail-Vormerkung-API**: `app/api/notify/route.ts`, gleiches
  Muster wie Task 6, für ALIBI + coParents (nicht PulseGate).
- ⬜ **Task 8 — Favicon/OG-Image/Impressum/Datenschutz**: Favicon-SVG existiert
  schon fertig gestaltet in der v6-Demo (`<link rel="icon">`, Ringplanet-Motiv)
  — von dort übernehmen, nicht neu entwerfen. **Impressum bleibt Platzhalter,
  bis Patrick seine ladungsfähige Anschrift liefert — siehe Blocker unten.**
- ⬜ **Task 9 — Deploy**: GitHub-Repo anlegen + pushen, Vercel-Projekt,
  Domain-Verbindung.

## Der eine echte Blocker

**werle.app kann erst mit echter Domain live gehen, wenn Patrick die
ladungsfähige Anschrift fürs Impressum liefert** — exakt dieselbe Blockade
wie bei `Games/alibi/store/site/impressum.html` (dort bereits dokumentiertes
Muster). Bis dahin: nur auf die automatische Vercel-Preview-URL deployen,
**nicht** die echte Domain verbinden. Nicht selbst erfinden, nicht mit
Platzhalterdaten live schalten.

## Zugriffe — was funktioniert, was nicht, wo der Umweg ist

- **GitHub**: `gh` CLI authentifiziert als `OnePieceMonkey`, volle `repo`-Scope.
  Repo für dieses Projekt existiert noch nicht (`gh repo create
  OnePieceMonkey/werle-app --public --source=. --push`).
- **Vercel**: MCP-Tools vorhanden (`mcp__claude_ai_Vercel__*`), kein globales
  `vercel`-CLI installiert. MCP reicht für Deploy + Domain-Config.
- **Resend**: MCP-Tools vorhanden (`mcp__resend-remote__*`), API-Key bereits
  validiert. **Entscheidung**: Absender-Adresse für beide Formular-Backends
  wiederverwendet die bereits verifizierte Domain `mail.labrechner.de` statt
  eine neue `@werle.app`-Sendedomain zu verifizieren (spart einen
  DNS-Zusatzschritt für reine Selbstbenachrichtigungs-Mails an Patrick).
- **Cloudflare**: Plugin (`cloudflare@cloudflare`) wurde in der Vorgänger-
  Session installiert, war dort aber **nicht aktiv** (Tool-Liste friert beim
  Sessionstart ein, Plugin kam mitten in der Session dazu). **In einer neuen
  Session zuerst prüfen, ob Cloudflare-MCP-Tools jetzt verfügbar sind** (z. B.
  per `ToolSearch` nach "cloudflare dns zone") — könnte jetzt funktionieren,
  da eine neue Session von Anfang an mit dem Plugin startet. Falls nicht:
  Fallback ist der `chrome-cdp`-Skill mit Patricks angemeldeter Chrome-Session,
  um die Cloudflare-DNS-Einträge direkt im Dashboard zu setzen (funktioniert
  nachweislich, wurde in dieser Session für andere DNS-Arbeiten schon genutzt).
  DNS-Zone `werle.app` ist bereits aktiv, Nameserver bereits umgestellt
  (Registrar: Squarespace Domains) — für die Vercel-Verbindung fehlt nur noch
  der Root-Domain-Eintrag, den Vercel nach dem Anlegen der Custom Domain zeigt.
- **Node/npm**: `node` 25.9, `npm` 11, `pnpm` 10 verfügbar. Kein globales
  `vercel`-CLI, kein `wrangler`.

## Wichtige technische Stolpersteine dieser Session

- **Next.js 16.3.0 ist installiert — nicht die Version aus dem Trainings-
  wissen.** Das Projekt selbst warnt davor (`AGENTS.md`/`CLAUDE.md`): "This
  version has breaking changes". Vor dem Schreiben von App-Router-/Metadata-/
  Route-Handler-Code die echten Docs unter `node_modules/next/dist/docs/`
  gegenprüfen, nicht aus der Erinnerung schreiben.
- **`_temp/` ist gitignored** (Demo-Iterationen, nicht Teil der Site) — beim
  Anlegen neuer Next.js-Dateien darauf achten, nicht versehentlich `_temp/`
  als Arbeitsverzeichnis für echten Code zu verwenden.
- **Branch-Strategie**: bisher direkt auf `main` gearbeitet (bewusste
  Entscheidung — frisches Solo-Projekt, noch kein Deploy, kein geteilter
  Zustand zum Schützen). Falls das nicht mehr passt (z. B. nach dem ersten
  Live-Deploy), an dieser Stelle umstellen.

## Produktions-Entscheidungen, die NICHT in dieser ersten Version stecken

Bewusst zurückgestellt (siehe Design-Doc, Abschnitt "Produktionsentscheidungen"):
englische Sprachversion, eigenes Social-Share-Bild (OG-Image — Favicon-Motiv
lässt sich als Ausgangspunkt nehmen, ist aber eine eigene 1200×630-Datei),
datenschutzfreundliche Besucherzahlen (Vercel Analytics, ein Dashboard-Schalter
nach dem ersten Deploy), eigene 404-Seite im selben Look. Alle vier sind für
später vorgemerkt, nicht Teil des aktuellen Umsetzungs-Ziels.

## Womit gearbeitet wird

```
npm run dev              # lokal, http://localhost:3000
npm run build             # Produktions-Build, muss vor jedem Commit grün sein
npx playwright screenshot # wie in den Demo-Runden zur visuellen Verifikation
git log --oneline         # Fortschritt seit dieser Übergabe nachvollziehen
```

Bilder-Quellen (falls in `public/images/` etwas fehlt oder neu geholt werden
muss): `_temp/design-demos/assets-v2/` und `assets-v3/` — dort liegen die
bereits web-optimierten Screenshots/Artworks, die in der Demo verwendet wurden.
