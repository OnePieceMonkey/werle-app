# Labrechner-Sektion — archiviert am 14.09.2026

Hier liegt die Sektion, die auf werle.app für Labrechner und
`check.labrechner.de` geworben hat. Sie ist aus der Seite entfernt, aber nicht
gelöscht.

## Warum sie weg ist

Das Projekt ist am 14.09.2026 vollständig an Karsten Tegtmeyer (dentsbay e.K.)
übergeben. Es gehört Patrick nicht mehr, der Betrieb ist beendet, und
`check.labrechner.de` führt ins Leere. Eine Werbefläche für ein fremdes,
abgeschaltetes Produkt gehört nicht auf die eigene Seite.

Hintergrund im Brain:
`PatrickOS/apps/assistant/decisions/2026-09-14-labrechner-uebergabe-an-dentsbay.md`

## Was hier liegt

| Datei | Inhalt |
| --- | --- |
| `LabrechnerSection.tsx` | die Sektion selbst |
| `LabrechnerSection.module.css` | ihr Styling |

Beide sind aus der Typprüfung ausgenommen (`tsconfig.json`, `exclude`), weil
sie auf Inhalte zugreifen, die es in `lib/content.ts` nicht mehr gibt.

## Was beim Entfernen sonst angepasst wurde

Die Sektion hing nicht nur im Seitenfluss, sondern auch in der 3D-Szene. Wer
sie je zurückholt, braucht diese fünf Stellen:

1. **`app/page.tsx` und `app/en/page.tsx`** — Import und `<LabrechnerSection />`
2. **`components/MissionNav.tsx`** — `"labrechner"` in `SECTION_IDS`
3. **`components/SpaceScene.tsx`** — `SECTION_IDS`, `FALLBACK_STATIONS`,
   das Feld `labrechnerZ`, das `missionT`-Array, `labrechnerRef`, der
   Bob-Eintrag und der Monolith-Block selbst
4. **`components/SpaceScene.tsx`** — dazu die Texturkette
   `buildMonolithFaceTexture` → `monolithFaceTexture` → `monolithMaterials`,
   die mit dem Monolithen verwaist ist und mit entfernt wurde
5. **`lib/content.ts`** — die Typdefinition, die deutschen und englischen
   Inhalte, und das Navigationslabel in beiden Sprachen

**Die Falle dabei:** `measureStations()` in `SpaceScene.tsx` gibt `null`
zurück, sobald auch nur eine ID aus `SECTION_IDS` nicht im DOM steht. Die ganze
Szene bliebe dann still auf den Platzhalterwerten stehen. Wer die Sektion
zurückholt oder eine neue ergänzt, muss die ID an beiden Stellen führen —
DOM und `SECTION_IDS` — sonst bricht die Kameraführung lautlos.

Die Platzhalterwerte in `FALLBACK_STATIONS` wurden beim Entfernen neu verteilt
(pulsegate 0.12 → 0.14, alibi 0.24 → 0.28, coparents 0.36 → 0.42,
buch 0.62 → 0.65), damit zwischen coparents und buch keine Lücke klafft. Sie
gelten ohnehin nur, bis die erste echte Messung greift.
