import { ImageResponse } from "next/og";

// Social-Share-Bild (og:image + twitter:image via file-based Metadata API,
// automatisch von Next.js erkannt — kein manueller Verweis in layout.tsx
// nötig). Motiv + Palette 1:1 aus der freigegebenen Design-Demo
// (`_temp/design-demos/demo-3d-world-v6.html`) bzw. `app/globals.css`
// übernommen: navy Bühne, das Ringplanet-Icon (siehe app/icon.svg) größer
// skaliert als dekoratives Element rechts, Headline + Claim aus Hero.tsx.
// Kein next/font hier möglich (next/og läuft außerhalb des normalen
// Font-Optimierungspfads) — bewusst System-Sans statt Font-Datei-Ladung,
// siehe Skill-Auftrag: "sauber gestaltet ist wichtiger als Font-Treue".

export const alt = "Werle Technologies";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const bg = "#161e33";
const ink = "#f1f4f7";
const muted = "#9aa7bc";
const teal = "#3fe0cf";
const amber = "#e8b16a";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Ringplanet-Motiv — gleiche Form/Reihenfolge wie app/icon.svg
            (Ellipse hinter dem Planeten, Planet-Kreis deckt die Mitte ab
            → Saturnring-Illusion), rechts angeschnitten ins Bild ragend. */}
        <div
          style={{
            position: "absolute",
            top: 75,
            right: -60,
            width: 480,
            height: 480,
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 215,
              width: 380,
              height: 110,
              borderRadius: "50%",
              border: `34px solid ${amber}`,
              transform: "rotate(-16deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 115,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: teal,
              display: "flex",
            }}
          />
        </div>

        {/* Textblock links */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 0 0 88px",
            maxWidth: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: amber,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                color: ink,
                letterSpacing: -1,
                display: "flex",
              }}
            >
              Werle Technologies
            </div>
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              color: muted,
              maxWidth: 620,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Zwei Spiele, eine App und ein Buch —{" "}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              color: muted,
              maxWidth: 620,
              display: "flex",
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            <span style={{ color: teal, display: "flex" }}>
              zum Anfassen
            </span>
            <span style={{ display: "flex" }}>, nicht nur zum Ansehen.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
