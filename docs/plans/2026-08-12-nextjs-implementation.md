# werle.app Next.js Implementation Plan

> **Für Claude:** Subagent-driven execution in dieser Session — ein Agent pro
> Task, Review + Commit zwischen den Tasks, TodoWrite verfolgt den Fortschritt.

**Goal:** Die über sechs Demo-Runden (`_temp/design-demos/demo-3d-world-v6.html`)
freigegebene Weltraum-Landingpage als echte Next.js-App bauen, auf Vercel
deployen und unter werle.app live schalten.

**Architektur:** Next.js 14 App Router, TypeScript. Kein Tailwind — das Design
ist bespoke (aus der Demo portiert), ein Utility-Framework würde nur
Reinterpretations-Risiko einbauen. React Three Fiber für die 3D-Szene (Wrapper
um dieselbe Three.js-Logik aus der Demo), GSAP + ScrollTrigger für die
Scroll-Choreografie, Web Audio API pur (kein Package nötig) fürs Sound-Design.
Zwei kleine API-Routen (Kontakt, E-Mail-Vormerkung) über Resend.

**Tech-Stack:** Next.js 14, TypeScript, React Three Fiber + drei, gsap,
resend (npm), Vercel (Hosting), Cloudflare (DNS, bereits eingerichtet).

**Quelle der Wahrheit fürs Design:** `_temp/design-demos/demo-3d-world-v6.html`
— jede Sektion, jede Farbe, jeder Text wird von dort 1:1 übernommen, nicht neu
interpretiert. Bei Unklarheit gewinnt die Demo-Datei, nicht dieses Dokument.

---

### Task 1: Next.js-Projekt-Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`,
  `app/page.tsx`, `app/globals.css`

**Schritte:**
1. `npx create-next-app@latest . --typescript --app --no-tailwind --eslint --src-dir=false --import-alias "@/*"` im Repo-Root (Achtung: Verzeichnis ist nicht leer, `docs/` und `_temp/` existieren schon — `--yes` bzw. interaktive Bestätigung für "non-empty directory" nötig, `_temp/` danach in `.gitignore`).
2. Dependencies ergänzen: `npm install three @react-three/fiber @react-three/drei gsap resend`
3. `npm install -D @types/three`
4. Leeren `app/page.tsx` committen, um den Scaffold zu verifizieren (`npm run dev`, Startseite lädt lokal).

**Verifikation:** `npm run build` läuft fehlerfrei durch.

**Commit:** `chore: Next.js-Projekt-Scaffold`

---

### Task 2: Globale Styles + Palette + Fonts

**Files:**
- Create: `app/globals.css` (Farbvariablen, Grundschrift, Reset — 1:1 aus
  Demo `<style>`-Block Zeilen ~1–110 der v6-Datei portiert)

**Schritte:**
1. CSS-Custom-Properties (Palette: bg, teal, amber, coral, indigo etc.) aus der Demo in `:root` übernehmen.
2. Body-Grundstil, Font-Stack (Demo nutzt System-Sans + eine Serif-Kursiv-Akzentschrift für "zum Anfassen" — Font-Herkunft in der Demo prüfen und identisch referenzieren, kein Ersatz).

**Verifikation:** Seite lädt mit korrektem dunklen Hintergrund + Palette, per Playwright-Screenshot gegen die Demo vergleichen.

**Commit:** `feat: globale Styles und Farbpalette`

---

### Task 3: 3D-Szene als Client-Component (größter Task — per Agent-Dispatch)

**Files:**
- Create: `components/SpaceScene.tsx`, `components/SpaceScene.module.css` (falls nötig)

**Auftrag an den Ausführungs-Agent (wörtlich mitgeben):** Portiere die komplette Three.js-Szene aus `_temp/design-demos/demo-3d-world-v6.html` (Sterne, Nebel, Hero-Glow inkl. Kontrast-Fix, alle Produkt-Panel-Objekte, Ringplanet + Satellit inkl. Realismus-Shader und Easter-Egg-Klick-Reaktion, Warp-Effekt, scroll-gebundene Kamerafahrt, Maus-Parallaxe, `prefers-reduced-motion`-Fallback) 1:1 in eine React-Three-Fiber-Client-Component (`'use client'`). Verhalten und Optik müssen exakt der Demo entsprechen — das ist keine Neuinterpretation, sondern ein Technologie-Wechsel (Vanilla-Three.js-Imperativ → R3F-Deklarativ) bei identischem Ergebnis. Scroll-Kopplung über `useScroll`/`useFrame` oder externe Scroll-Progress-Prop, je nachdem was sauberer an die umgebenden DOM-Sektionen (Task 4+) andockt. Nach dem Bauen: Playwright-Screenshot ohne Scroll gegen `demo-3d-world-v6.png` (falls vorhanden) bzw. gegen einen frischen Demo-Screenshot vergleichen — muss optisch übereinstimmen.

**Verifikation:** Screenshot-Vergleich Demo vs. Next.js-Version für Hero, ein Produkt-Panel, Warp-Peak. Konsole fehlerfrei.

**Commit:** `feat: 3D-Weltraumszene als React-Three-Fiber-Komponente`

---

### Task 4: DOM-Sektionen (Hero-Text, Produktkarten, Labrechner, Buch, Ankunft)

**Files:**
- Create: `components/sections/Hero.tsx`, `ProductCard.tsx`, `LabrechnerSection.tsx`, `BookSection.tsx`, `ArrivalSection.tsx`, `MissionNav.tsx`
- Copy Assets: PulseGate-/coParents-Screenshots, ALIBI-Artwork, Buch-Cover+Backcover aus `_temp/design-demos/assets-v2/` + `assets-v3/` nach `public/images/`, optimiert (WebP wo möglich, `next/image`)

**Auftrag an den Ausführungs-Agent:** Alle DOM-Sektionen aus der v6-Demo als React-Komponenten portieren — Texte, Status-Badges, Links (`pulsegate.werle.app`, `verhoer.werle.app`, `check.labrechner.de`), Bilder 1:1 übernehmen (Bilder aus dem Demo-Assets-Ordner nach `public/images/` kopieren, `next/image` für Optimierung nutzen). Missions-Navigation (7 Punkte, aktive Sektion hervorgehoben, Klick scrollt) als eigene Komponente, per `IntersectionObserver` oder Scroll-Position die aktive Sektion bestimmen.

**Verifikation:** Alle Sektionen scrollbar erreichbar, Screenshot-Stichprobe pro Sektion gegen Demo.

**Commit:** `feat: DOM-Sektionen (Produktkarten, Labrechner, Buch, Ankunft)`

---

### Task 5: Boot-up-Intro + Ladefortschritt + Sound-Toggle + Cursor-Trail

**Files:**
- Create: `components/BootupIntro.tsx`, `hooks/useAmbientSound.ts`, `components/CursorTrail.tsx`

**Auftrag an den Ausführungs-Agent:** Boot-up-Terminal-Sequenz + vorgeschalteter Ladefortschritt (wartet auf 3D-Szene + Bild-Assets), Web-Audio-Sound-Hook (Ambient-Loop + Warp-Whoosh + Easter-Egg-Chime, synthetisiert wie in der Demo, standardmäßig stumm mit Toggle), Cursor-Trail (Desktop-only, `(pointer: fine)`) — alle 1:1 aus v6 portiert. `sessionStorage`-Flag fürs Boot-up wie in der Demo.

**Verifikation:** Boot-up erscheint einmal pro Session, Sound-Toggle wechselt Icon + startet AudioContext erst nach Klick, Cursor-Trail erzeugt Partikel bei Mausbewegung (Playwright `mouse.move`-Test).

**Commit:** `feat: Boot-up-Intro, Sound-System, Cursor-Trail`

---

### Task 6: Kontaktformular — API-Route + echter Test

**Files:**
- Create: `app/api/contact/route.ts`, `app/api/contact/route.test.ts` (oder `.spec.ts`, je nach gewähltem Test-Runner — `npm install -D vitest` falls kein Runner vorhanden)
- Modify: `components/sections/ArrivalSection.tsx` (Submit-Handler von Placeholder auf echten `fetch('/api/contact')` umstellen)

**Schritt 1 — Test schreiben (schlägt fehl, da Route noch nicht existiert):**

```typescript
// app/api/contact/route.test.ts
import { POST } from './route'

test('sendet gültige Kontakt-Anfrage per Resend', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'Hallo' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
})

test('lehnt fehlende Felder ab', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name: '', email: '', message: '' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})
```

**Schritt 2 — Route implementieren:**

```typescript
// app/api/contact/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return Response.json({ error: 'Pflichtfeld fehlt' }, { status: 400 })
  }
  await resend.emails.send({
    from: 'Werle Technologies <kontakt@mail.labrechner.de>', // wiederverwendete, bereits verifizierte Resend-Domain — siehe Design-Doc "Formulare — Backend"
    to: 'werle.business@gmail.com',
    replyTo: email,
    subject: `Kontaktanfrage von ${name}`,
    text: message,
  })
  return Response.json({ ok: true })
}
```

**Schritt 3 — Env-Variable:** `RESEND_API_KEY` in `.env.local` (lokal) + als Vercel-Projekt-Env-Variable (Task 9) setzen. **Niemals committen** — `.env.local` steht in `.gitignore` (Next.js-Scaffold-Default, verifizieren).

**Verifikation:** `npm test` grün, manueller Testlauf gegen den echten Resend-Key (wie in `Games/alibi/DOMAIN-SETUP.md` bereits vorgeführt) verifiziert Zustellung.

**Commit:** `feat: Kontaktformular-API mit Resend-Backend`

---

### Task 7: E-Mail-Vormerkung (ALIBI/coParents) — API-Route + echter Test

**Files:**
- Create: `app/api/notify/route.ts`, `app/api/notify/route.test.ts`
- Modify: `components/sections/ProductCard.tsx` (Submit-Handler für ALIBI/coParents)

Gleiches Muster wie Task 6, Payload `{ email, product: 'alibi' | 'coparents' }`, Betreff `Vormerkung: ${product}`. Kein PulseGate-Formular (hat bereits Store-Link).

**Verifikation:** wie Task 6.

**Commit:** `feat: E-Mail-Vormerkung-API für ALIBI und coParents`

---

### Task 8: Favicon, OG-Image, Impressum/Datenschutz, Metadata

**Files:**
- Create: `app/favicon.ico` (aus dem inline-SVG der Demo als PNG/ICO exportiert), `app/opengraph-image.png` (1200×630), `app/impressum/page.tsx`, `app/datenschutz/page.tsx`
- Modify: `app/layout.tsx` (Metadata-Export: title, description, openGraph)

**Wichtig — Impressum bleibt Platzhalter:** Die ladungsfähige Anschrift fehlt
(dieselbe Blockade wie bei `Games/alibi/store/site/impressum.html`). Seite mit
klar markierten Platzhalterfeldern bauen, NICHT mit erfundenen Daten füllen.
**Vor dem Live-Schalten der Domain (Task 9) muss diese Seite fertig sein** —
bis dahin Deploy nur auf die Vercel-Preview-URL, nicht auf werle.app selbst.

**Verifikation:** `/impressum` und `/datenschutz` erreichbar, OG-Image via
`next/og` oder statische Datei rendert korrekt (lokal per curl/Browser-Check).

**Commit:** `feat: Impressum, Datenschutz, Favicon, OG-Image`

---

### Task 9: Deploy — GitHub, Vercel, Domain

**Schritte:**
1. `gh repo create OnePieceMonkey/werle-app --public --source=. --push`
2. Vercel-Projekt anlegen und mit dem Repo verknüpfen (MCP `mcp__claude_ai_Vercel__deploy_to_vercel` oder Vercel-Dashboard-Import), `RESEND_API_KEY` als Env-Variable setzen.
3. Deploy verifizieren auf der automatisch vergebenen `*.vercel.app`-Preview-URL — **erst hier volle QA** (Desktop + Mobile-Viewport, alle sechs Atmosphäre-Features, beide Formulare live gegen Resend testen).
4. **Erst wenn Impressum/Datenschutz vollständig sind** (Task 8, hängt an Patricks Adresse): `werle.app` als Custom Domain in Vercel eintragen → Vercel zeigt den nötigen DNS-Zielwert (i. d. R. `A 76.76.21.21` oder CNAME-Flattening-Ziel) → in Cloudflare (Zone `werle.app`, bereits aktiv) den Root-Eintrag setzen. Cloudflare-MCP ist in dieser Session nicht aktiv (Reload seit Installation steht aus) — entweder per `chrome-cdp`-Skill (angemeldeter Chrome) direkt im Cloudflare-Dashboard eintragen, oder Patrick bekommt den exakten Eintrag zum manuellen Setzen.
5. Domain-Verifikation abwarten (SSL-Zertifikat-Ausstellung durch Vercel), Live-Check.

**Verifikation:** `https://werle.app` liefert die Seite mit gültigem Zertifikat.

**Commit:** kein Code-Commit — Deploy-Schritt, Ergebnis im Gespräch festhalten.

---

## Offene Annahmen, die beim Ausführen gelten

- **EN-Version:** bewusst NICHT Teil dieses Plans (Design-Doc: "Produktionsentscheidung, später"). Diese Seite wird komplett auf Deutsch gebaut.
- **Resend-Absenderadresse:** wiederverwendet `mail.labrechner.de` (bereits verifiziert) statt eine neue `@werle.app`-Sendedomain zu verifizieren — spart einen weiteren Cloudflare-DNS-Schritt für eine reine Selbstbenachrichtigung, die nur Patrick sieht. Bei Bedarf später umstellbar.
- **Testing-Framework:** `vitest` (schnell, Next.js-kompatibel) — falls Patrick etwas anderes bevorzugt, in Task 1 anpassen.
