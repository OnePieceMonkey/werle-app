# werle.app — Hauptdomain-Website — Design

Status: freigegeben (11.08.2026), Richtung + Vertiefung durch fünf Demo-Runden
bestätigt (12.08.2026: "trägt sich, gefällt mir gut"). Nächster Schritt: die
sechs Atmosphäre-Features (siehe unten) fertigstellen, danach echter
Next.js-Implementierungsplan.

## Zweck

Landingpage für `werle.app` — das Dach über Patrick Werles Unternehmung „Werle
Technologies". Kein Karriere-/CV-Auftritt, sondern eine Produkt-Vitrine: was
gebaut wurde, steht im Zentrum, Patrick als Macher bleibt im Hintergrund.

**Revidiert (12.08.2026):** Labrechner/DentalBilling Engine bekommt entgegen
der ursprünglichen Entscheidung doch eine **vollwertige Section wie die Apps**,
nicht nur eine Zeile — mit Fakten (68.000+ LOC, 510+ Tests, Pentest bestanden)
und einem kurzen Ausblick-Satz zum übertragbaren Muster. Bewusst weiterhin
NICHT erwähnt: Verkaufspreis, Asset-Deal-Status, Käufersuche — das bleibt
Buyer-Datenraum-Terrain, nicht öffentliche Website. Tonal/visuell abgesetzt von
den Spiele-Karten (eigene "Infrastruktur"-Optik statt Space-Ästhetik).

## Content-Struktur (eine scrollende Seite, als Weltraum-Reise inszeniert)

1. **Boot-up-Intro** — kurze Terminal-Sequenz (1–1,5 s, einmal pro Session,
   überspringbar) vor dem eigentlichen Hero.
2. **Hero** — Werle Technologies als Absender, kurzer Claim. Textzone bewusst
   auf ruhiger, dunkler Fläche (Kontrast-Learnings siehe unten), helles
   Glow-Element deutlich versetzt (oben links), nicht direkt hinter dem Text.
3. **Produkt-Grid** — je eine Karte pro Produkt, Status ehrlich sichtbar
   (Live / Im App-Store-Review / In Entwicklung), mit echtem Bildmaterial aus
   den jeweiligen Projekten (Screenshots/Artwork, keine Platzhalter):
   - **PulseGate: Echo Shift** — Im App-Store-Review (Shipaton-Track,
     RevenueCat). Karte zeigt echtes Menü-Screenshot + verstärkten
     Puls-Ring-Effekt, verlinkt auf `pulsegate.werle.app`.
   - **ALIBI — Das Verhör** — In Entwicklung. Karte als angepinnte
     Case-Board-Komposition (echtes Fall-Artwork + Porträt), verlinkt auf
     `verhoer.werle.app`, sobald das Repo/die Domain live ist.
   - **coParents** (mit Timo, korrekte Schreibweise: kleines c) — In
     Entwicklung. Karte zeigt echten Kalender-Screenshot + App-Icon, bewusst
     OHNE Link ("Noch kein Store-Eintrag") bis ein Store-Eintrag existiert.
   Kein separates „mehr erfahren" auf werle.app selbst — die Subdomains/Stores
   übernehmen diese Rolle ohnehin (App-Store-Pflichtauftritt).
4. **Labrechner-Section** — vollwertig wie die Apps, siehe Revision oben.
   Link auf `check.labrechner.de`.
5. **Buch-Sektion, tonal abgesetzt** — „Bechterew unter Kontrolle" (Amazon KDP,
   Apple Books, Tolino — alle drei E-Book-Kanäle seit 10.08.2026 live; Print
   via KDP steht noch aus). Zeigt echtes Cover UND echte, lesbare Backcover-
   Rückseite (Zitat, Beschreibung, Bullets, Autoren-Bio) — Gesundheitsthema,
   anderes Register als die Spiele, eigene visuell abgegrenzte Sektion.
6. **Warp-Übergang** — Hyperraum-Sprung-Effekt als Übergang zur letzten Sektion.
7. **Ankunft: Kontakt + Footer als Szene** — kein klassischer Footer-Balken.
   Landet an einer warm beleuchteten "Station": Kontaktformular wirkt wie ein
   Bordterminal, die bisherigen Footer-Infos (Bio, Standort, LinkedIn,
   Impressum) erscheinen als angeheftete "Mission-Plaque". LinkedIn-Link:
   `linkedin.com/in/patrick-werle-dental`. Keine Zertifikate, keine CV-Tiefe —
   die gehören zu LinkedIn selbst, nicht auf diese Seite.

### Sechs Atmosphäre-Features (Kundenwunsch 12.08.2026, alle bestätigt)

- **Sound-Design** — leiser Ambient-Loop + Warp-Whoosh, per Web Audio API
  synthetisiert (keine externen Dateien), standardmäßig stumm mit sichtbarem
  Toggle.
- **Boot-up-Intro** — siehe Struktur-Punkt 1.
- **Easter Egg** — Klick auf Satellit/Planet löst eine kleine Überraschung aus
  (Reaktion + Sound), unbeworben, zum Entdecken.
- **Sternstaub-Cursor-Trail** — feine Partikelspur der Maus, Desktop-only.
- **Vertikale Missions-Navigation** — klickbare Fortschrittspunkte am
  Bildschirmrand, ein Punkt pro Sektion, aktiver Punkt hervorgehoben,
  Direktsprung per Klick.
- **Rücksprung zum Start** — dezenter Link am Seitenende zurück zum Anfang.

### Mobile: Hinweis statt Kompromiss

Volle 3D-Szene + Scroll-Kamera + Maus-Parallaxe lässt sich auf Touch/Hochformat
nicht 1:1 garantieren. Statt einer heimlich degradierten Erfahrung: bei
schmalem Hochformat ein dezentes, nicht blockierendes Banner „Für das beste
Erlebnis: Gerät ins Querformat drehen" mit „Trotzdem fortfahren"-Option,
einmal pro Session.

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

**Stand 12.08.2026:** Die Direction-Advisory ist gelaufen und die Richtung
„Experimentelle 3D-Welt" (Three.js-Raumfahrt, im Geist von Bruno Simon) wurde
über sechs Demo-Runden (v1–v6, `_temp/design-demos/`) vertieft und vom Kunden
freigegeben. Die ALIBI-Illustrationen sind als echtes Bildmaterial verbaut
(Case-Board-Komposition). Nächster Schritt ist nicht mehr Richtungsfindung,
sondern der echte Next.js-Implementierungsplan (siehe `writing-plans`-Skill).

## Projekt-Ort

Neues, eigenständiges Repo: `~/Projekte/werle-app/` (git-initialisiert
11.08.2026), Deploy über Vercel.

## Formulare — Backend (Kontakt + E-Mail-Vormerkung)

Beide sind echte Formulare, kein mailto-Link (Kundenwunsch, 12.08.2026). In
den Demo-Runden bisher nur die UI-Ebene gebaut (Placeholder-Submit):

- **Kontaktformular** (Name/E-Mail/Nachricht, in der Ankunfts-Sektion).
- **E-Mail-Vormerkung** „Bescheid sagen, wenn's da ist" auf den Karten von
  ALIBI und coParents (nicht PulseGate — das hat schon ein echtes Linkziel).

Für die echte Umsetzung: Next.js API-Routen nehmen die Eingaben entgegen,
verschicken per Resend direkt an Patricks Posteingang — Resend ist bereits
eingerichtet und getestet (siehe `Games/alibi/DOMAIN-SETUP.md`,
Email-Routing-Test 11.08.2026), kein neuer Dienst nötig. Für die
Vormerkungs-Adressen reicht vorerst eine einfache Weiterleitungsmail pro
Eintrag (Betreff: welches Produkt) statt einer eigenen Kontakt-Datenbank —
Umfang bei Bedarf im Implementierungsplan hochskalieren, wenn die Liste
wächst.

## Produktionsentscheidungen (Kundenwünsche 12.08.2026, NICHT in der
## Wegwerf-Demo gebaut — echte Next.js-Implementierungsarbeit)

- **Englische Sprachversion.** Relevant wegen internationaler Sichtbarkeit
  (Buch-Käufer außerhalb DE, Karriere-/LinkedIn-Netzwerk). Kein Detail, das
  sich in eine Demo-HTML-Datei nebenbei einbauen lässt — vollständige
  Content-Übersetzung (Produkt-Hooks, Labrechner-Fakten, Buch-Beschreibung,
  Formulare, Mission-Plaque, Boot-up-/Warp-Texte) + Sprachumschalter DE/EN.
  Umfang und genaue Routing-Struktur (z. B. `/en`) sind Teil des
  Implementierungsplans, nicht dieses Design-Dokuments.
- **Eigenes Social-Share-Bild (Open-Graph-Image).** Ohne eigenes OG-Bild zeigt
  eine geteilte werle.app-URL (z. B. auf LinkedIn) nichts oder eine generische
  Vorschau. Ein statisches 1200×630-Bild im selben visuellen Look (Ausschnitt
  aus der Hero-Komposition, dunkler Weltraumgrund + „Werle Technologies") wird
  Teil der Next.js-Metadaten (`opengraph-image`). Lässt sich erst gegen eine
  echte URL testen (LinkedIn Post Inspector o. ä.) — deshalb erst nach dem
  ersten Deploy final verifizierbar, nicht vorher.
- **Datenschutzfreundliche Besucherzahlen.** Vercel Analytics (nativ,
  cookie-los, kein Consent-Banner nötig) statt Google Analytics — passt zu
  Patricks Privacy-first-Haltung (siehe `about-me.md`). Aktivierung ist ein
  Vercel-Dashboard-Schalter nach dem ersten Deploy, kein Code-Aufwand.
- **Eigene 404-Seite im selben Look.** Bewusst nicht als isolierte Demo-Datei
  vorgebaut — eine gute 404-Seite braucht dieselben Bausteine wie die
  Hauptseite (Sternenhintergrund, Header, Typografie), die erst mit dem
  echten Next.js-Build als wiederverwendbare Komponenten existieren.
  Richtwort-Vorschlag fürs Copy: „Kurs verloren" / „Dieser Ort existiert
  nicht auf der Sternenkarte" + Link zurück zur Startrampe (Anschluss an die
  bereits gebaute „Zurück zur Startrampe"-Formulierung der Ankunfts-Sektion).

## Offene Punkte für später

- ALIBI-Karte kann erst live verlinken, sobald `alibi-support` existiert
  (blockiert auf Patricks ladungsfähige Anschrift fürs Impressum, siehe
  `Games/alibi/DOMAIN-SETUP.md`).
- CoParents-Karte braucht Ziel-Link, sobald ein Store-Eintrag existiert.
- werle.app selbst braucht eigenes Impressum/Datenschutz (Root-Domain,
  eigene Pflichtseiten, unabhängig von den Subdomains).
- Subdomains (`pulsegate.werle.app`, `verhoer.werle.app`) brauchen langfristig
  eigene, vollständige Seiten (nicht nur die App-Store-Pflichtseiten) —
  Kundenhinweis 12.08.2026, noch nicht terminiert.
