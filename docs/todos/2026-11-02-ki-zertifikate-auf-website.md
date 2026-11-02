# KI-Zertifikate auf werle.app zeigen

**Erstellt:** 2026-11-02 · **Status:** wartet auf Patrick (Zertifikate laufen gerade) · **Priorität:** mittel

Patrick macht gerade Zertifikate bei mehreren KI-Anbietern. Sobald sie da sind, kommen sie auf werle.app.

## Wohin

In die Sektion „Über mich" (`components/AboutSection.tsx`, Texte in `lib/content.ts` → `about`). Zwei Wege, beim Einbau entscheiden:

1. Eine Zeile mit Abzeichen unter den Kennzahlen (`chips`): Logo oder Kurzname plus Jahr, jeweils mit Link zum Nachweis.
2. Ein eigener Fakt in `about.facts` („Zertifiziert bei …"), wenn es nur 2–3 Stück sind.

Zusätzlich als Beleg in der Stufe „Teilzeit" unter „Mit mir arbeiten" (`work.tiers`, `proof`), falls ein Zertifikat genau dazu passt.

## Vorher sammeln (je Zertifikat)

- [ ] Anbieter und genauer Name des Zertifikats
- [ ] Datum, ggf. Ablaufdatum
- [ ] Öffentlicher Nachweis-Link (Credly, Accredible oder Seite des Anbieters)
- [ ] Erlaubnis zur Logo-Nutzung prüfen (Markenregeln des Anbieters); ohne Erlaubnis nur Text, kein Logo

## Regeln

- Nur Zertifikate zeigen, die abgeschlossen sind und einen prüfbaren Link haben.
- DE und EN in `lib/content.ts` gleich pflegen.
- Bilder als `.webp` nach `public/images/`, Alt-Text in beiden Sprachen.
