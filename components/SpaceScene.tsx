"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import styles from "./SpaceScene.module.css";

/* ==================================================================
   Palette — 1:1 aus dem Script-Block der freigegebenen Demo
   (`_temp/design-demos/demo-3d-world-v6.html`, Zeile ~1145) übernommen.
   Bewusst NICHT die CSS-Custom-Properties aus app/globals.css, die sind
   für 2D-Text/UI-Kontrast leicht abweichend justiert.
   ================================================================== */
const COLORS = {
  bg: 0x161e33,
  teal: 0x3fe0cf,
  indigo: 0x6f86bd,
  coral: 0xe2916b,
  amber: 0xe8b16a,
  sage: 0x93a878,
  mono: 0x7fd9c4,
  cream: "#f2e9d8",
  creamEdge: "#d9cdae",
  muted2: "#6f6a5c",
  inkDark: "#231f19",
} as const;

/* Kamera-Reisestrecke — unverändert aus der Demo. Der Wertebereich ist
   unabhängig von der Dokumentlänge (siehe Scroll-Modell im Task); nur die
   Zuordnung „welcher scrollT-Bruchteil gehört zu welcher Sektion" ist neu
   zur Laufzeit gemessen statt hartkodiert. */
const START_Z = 9;
const END_Z = -132;

const bgColorBase = new THREE.Color(COLORS.bg);
const warpFlashColorConst = new THREE.Color(0xbdf3ff);
const tmpColor = new THREE.Color();

/* ==================================================================
   Scroll-Stationen — zur Laufzeit aus den echten DOM-Sektionen
   gemessen (siehe Task-Auftrag „Scroll-Modell"), ersetzt die
   hartkodierten T_*-Konstanten der Demo.
   ================================================================== */
const SECTION_IDS = [
  "hero",
  "pulsegate",
  "alibi",
  "coparents",
  "labrechner",
  "buch",
  "kontakt",
] as const;
type SectionId = (typeof SECTION_IDS)[number];
type StationFractions = Record<SectionId, number>;

/* Grobe Platzhalterwerte, bis der erste Messdurchlauf (useIsomorphicLayoutEffect,
   läuft vor dem ersten Bildschirm-Paint) die echten DOM-Positionen kennt —
   verhindert nur, dass Objekte kurzzeitig bei t=0 kollabieren, falls die
   Messung aus irgendeinem Grund einen Tick später greift. */
const FALLBACK_STATIONS: StationFractions = {
  hero: 0,
  pulsegate: 0.12,
  alibi: 0.24,
  coparents: 0.36,
  labrechner: 0.48,
  buch: 0.62,
  kontakt: 0.85,
};

function getMaxScroll(): number {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function measureStations(): StationFractions | null {
  const maxScroll = getMaxScroll();
  const next = {} as StationFractions;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) return null;
    next[id] = el.offsetTop / maxScroll;
  }
  return next;
}

/* Layout-Effekt statt normalem Effekt: Messung braucht fertiges Layout und
   soll — falls sie vom Fallback abweicht — vor dem ersten Paint korrigieren,
   nicht sichtbar nachruckeln. Serverseitig ein No-Op-Alias auf useEffect,
   um Reacts "useLayoutEffect does nothing on the server"-Warnung zu
   vermeiden (diese Komponente wird als Client Component dennoch initial
   auf dem Server gerendert). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useStationFractions(): StationFractions {
  const [fractions, setFractions] = useState<StationFractions>(FALLBACK_STATIONS);

  useIsomorphicLayoutEffect(() => {
    function measure() {
      const next = measureStations();
      if (next) setFractions(next);
    }
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return fractions;
}

interface Layout {
  z: (t: number) => number;
  missionT: number[];
  warpStartT: number;
  warpPeakT: number;
  warpEndT: number;
  positions: {
    pulsegateZ: number;
    alibiZ: number;
    coparentsZ: number;
    labrechnerZ: number;
    buchZ: number;
    planetZ: number;
    satelliteZ: number;
    stationViewportZ: number;
    railTickZs: number[];
  };
}

/* Kernstück des Scroll-Modells (siehe Task-Auftrag): dieselbe
   z = START_Z + (END_Z-START_Z)*t-Formel wie die Kamera, aber mit den
   gemessenen Stations-Fraktionen statt der hartkodierten Demo-Werte.
   Ringplanet/Satellit/StationViewport hatten in der Demo keine eigene
   DOM-Sektion — sie werden bewusst in das Fenster zwischen "buch" und
   "kontakt" gestaffelt (vor dem Warp), in der gleichen relativen
   Reihenfolge/dem gleichen Abstand wie im Original.

   Wichtig — warpEndT darf NICHT gleich kontaktT sein: der DOM-Inhalt der
   Kontakt-Sektion wird sichtbar, sobald ihr oberer Rand in den Viewport
   hineinragt, und das passiert (in Scroll-Fraktionen) immer eine ganze
   Viewport-Höhe VOR kontaktT — unabhängig davon, wie groß der Abstand
   zwischen "buch" und "kontakt" gewählt wird (reines Verschieben des
   Puffers ändert an diesem Verhältnis nichts, siehe Bugfix-Historie).
   Der komplette Warp (Start→Peak→Ende) muss darum deutlich VOR kontaktT
   abklingen, mit genug Fraktions-Abstand, dass auch eine große
   Viewport-Höhe (hoher Desktop-Monitor) noch vor kontaktT liegt — daher
   endet der Warp hier schon bei 45 % der Buch-Kontakt-Distanz, nicht bei
   100 %. Der Rest der Distanz (siehe auch der 220vh-Spacer in
   app/page.module.css) ist bewusst leerer "Ankunfts"-Puffer. */
function computeLayout(f: StationFractions): Layout {
  const z = (t: number) => START_Z + (END_Z - START_Z) * t;
  const gap = f.kontakt - f.buch;
  const planetSystemT = f.buch + gap * 0.15;
  const warpStartT = f.buch + gap * 0.25;
  const warpPeakT = f.buch + gap * 0.35;
  const warpEndT = f.buch + gap * 0.45;
  const stationViewportT = f.buch + gap * 0.7;
  const missionT = [f.hero, f.pulsegate, f.alibi, f.coparents, f.labrechner, f.buch, f.kontakt];
  const planetZ = z(planetSystemT);

  return {
    z,
    missionT,
    warpStartT,
    warpPeakT,
    warpEndT,
    positions: {
      pulsegateZ: z(f.pulsegate),
      alibiZ: z(f.alibi),
      coparentsZ: z(f.coparents),
      labrechnerZ: z(f.labrechner),
      buchZ: z(f.buch),
      planetZ,
      /* Original-Delta zwischen Satellit(-27) und Planet(-44) = 17 Einheiten
         (Satellit steht näher an der Kamera) — Weltraum-Einheiten sind
         unverändert (START_Z/END_Z bleiben konstant), also bleibt der Delta
         gültig. */
      satelliteZ: planetZ + 17,
      stationViewportZ: z(stationViewportT),
      railTickZs: missionT.map(z),
    },
  };
}

/* ---------------- Mathe-Helfer (1:1 aus der Demo) ---------------- */
function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function smoothStep(x: number): number {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
}
function closestMissionIndex(t: number, missionT: number[]): number {
  let closest = 0;
  let closestDist = Infinity;
  for (let i = 0; i < missionT.length; i++) {
    const d = Math.abs(t - missionT[i]);
    if (d < closestDist) {
      closestDist = d;
      closest = i;
    }
  }
  return closest;
}
function warpProgress(t: number, warpStart: number, warpPeak: number, warpEnd: number): number {
  if (t <= warpStart || t >= warpEnd) return 0;
  if (t <= warpPeak) return smoothStep((t - warpStart) / (warpPeak - warpStart));
  return smoothStep((warpEnd - t) / (warpEnd - warpPeak));
}

/* ==================================================================
   Canvas-Textur-Helfer — 1:1 aus der Demo portiert. Laufen ausschließlich
   client-seitig (nur innerhalb von <Canvas>-Kindern verwendet, die R3F nie
   serverseitig rendert), daher unproblematisch mit document.createElement.
   ================================================================== */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildDotTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function buildGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.35, "rgba(255,255,255,0.26)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function valueNoise2D(gridScale: number): (u: number, v: number) => number {
  const gridSize = Math.max(2, Math.floor(gridScale));
  const grid: number[][] = [];
  for (let y = 0; y <= gridSize; y++) {
    const row: number[] = [];
    for (let x = 0; x <= gridSize; x++) row.push(Math.random());
    grid.push(row);
  }
  const smoothstep = (t: number) => t * t * (3 - 2 * t);
  return (u: number, v: number) => {
    const gx = u * gridSize;
    const gy = v * gridSize;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(x0 + 1, gridSize);
    const y1 = Math.min(y0 + 1, gridSize);
    const tx = smoothstep(gx - x0);
    const ty = smoothstep(gy - y0);
    const top = grid[y0][x0] * (1 - tx) + grid[y0][x1] * tx;
    const bot = grid[y1][x0] * (1 - tx) + grid[y1][x1] * tx;
    return top * (1 - ty) + bot * ty;
  };
}
function lerpCol(a: number[], b: number[], t: number): number[] {
  const tt = t < 0 ? 0 : t > 1 ? 1 : t;
  return [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt, a[2] + (b[2] - a[2]) * tt];
}

function buildPlanetTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const n1 = valueNoise2D(6);
  const n2 = valueNoise2D(14);
  const n3 = valueNoise2D(30);
  const img = ctx.createImageData(W, H);
  const deep = [42, 60, 106];
  const mid = [92, 120, 180];
  const light = [178, 198, 226];
  const cloud = [232, 222, 196];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const v = y / H;
      let e = n1(u, v) * 0.55 + n2(u, v) * 0.3 + n3(u, v) * 0.15;
      const lat = Math.abs(v - 0.5) * 2;
      e = e * (1 - lat * 0.25) + lat * 0.18;
      let col: number[];
      if (e < 0.42) col = deep;
      else if (e < 0.58) col = lerpCol(deep, mid, (e - 0.42) / 0.16);
      else if (e < 0.72) col = lerpCol(mid, light, (e - 0.58) / 0.14);
      else col = lerpCol(light, cloud, Math.min(1, (e - 0.72) / 0.18));
      const idx = (y * W + x) * 4;
      img.data[idx] = col[0];
      img.data[idx + 1] = col[1];
      img.data[idx + 2] = col[2];
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/* Fresnel-Rim-Atmosphäre — klassisches three.js-"Glow"-Rezept:
   BackSide + additives Blending, Intensität peakt am Rand. */
const ATMOSPHERE_VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vViewPos;
void main(){
  vNormal = normalize( normalMatrix * normal );
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vViewPos = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;
const ATMOSPHERE_FRAGMENT_SHADER = `
varying vec3 vNormal;
varying vec3 vViewPos;
uniform vec3 glowColor;
void main(){
  float intensity = pow( 0.62 - dot( normalize(vNormal), normalize(vViewPos) ), 3.0 );
  intensity = clamp(intensity, 0.0, 1.0);
  gl_FragColor = vec4( glowColor, 1.0 ) * intensity;
}
`;

/* Radial-Gradient-Ring-Textur + der Standard-RingGeometry-UV-Fix. Auch in
   three@0.185 liefert RingGeometry noch planare UVs (uv = (x,y)/outerRadius,
   siehe node_modules/three/src/geometries/RingGeometry.js), nicht radiale —
   ohne den Fix verschmiert der Farbverlauf statt konzentrisch auszubändern.
   Der Fix ist also weiterhin nötig, nicht nur ein r128-Workaround. */
function buildRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0.0, "rgba(232,177,106,0)");
  g.addColorStop(0.08, "rgba(232,177,106,0.55)");
  g.addColorStop(0.22, "rgba(200,150,90,0.22)");
  g.addColorStop(0.36, "rgba(232,177,106,0.6)");
  g.addColorStop(0.55, "rgba(180,140,95,0.18)");
  g.addColorStop(0.7, "rgba(232,177,106,0.5)");
  g.addColorStop(0.86, "rgba(200,150,90,0.14)");
  g.addColorStop(1.0, "rgba(232,177,106,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 8);
  return new THREE.CanvasTexture(c);
}
function fixRingUVs(geometry: THREE.RingGeometry, innerRadius: number, outerRadius: number) {
  const pos = geometry.attributes.position;
  const v3 = new THREE.Vector3();
  const uv: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const r = Math.sqrt(v3.x * v3.x + v3.y * v3.y);
    uv.push((r - innerRadius) / (outerRadius - innerRadius), 1);
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
}

/* Bespoke "Buchcover"-Textur für das ambiente 3D-Requisit — bewusst
   synthetisiert statt der echten Cover-Fotos: die sind bereits als
   <Image> im DOM-Panel von BookSection zu sehen, hier geht es nur um
   Hintergrund-Set-Dressing. */
function buildBookCoverTexture(): THREE.CanvasTexture {
  const W = 760;
  const H = 1040;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = COLORS.cream;
  roundRect(ctx, 0, 0, W, H, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(35,31,25,0.16)";
  ctx.lineWidth = 2;
  roundRect(ctx, 10, 10, W - 20, H - 20, 14);
  ctx.stroke();

  ctx.textAlign = "center";
  const cx = W / 2;
  let y = 150;

  ctx.fillStyle = COLORS.muted2;
  ctx.font = '600 21px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText("B U C H", cx, y);

  y += 90;
  ctx.fillStyle = COLORS.inkDark;
  ctx.font = '800 56px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText("BECHTEREW", cx, y);
  y += 66;
  ctx.fillText("UNTER", cx, y);
  y += 66;
  ctx.fillText("KONTROLLE", cx, y);

  y += 56;
  ctx.strokeStyle = "rgba(35,31,25,0.28)";
  ctx.beginPath();
  ctx.moveTo(cx - 70, y);
  ctx.lineTo(cx + 70, y);
  ctx.stroke();

  y += 60;
  ctx.fillStyle = "#4b463c";
  ctx.font = 'italic 400 30px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText("Mein Weg durch", cx, y);
  y += 42;
  ctx.fillText("20 Jahre Morbus Bechterew", cx, y);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function buildMonolithFaceTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a1119";
  ctx.fillRect(0, 0, 128, 256);
  ctx.strokeStyle = "rgba(127,217,196,0.32)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= 128; gx += 16) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, 256);
    ctx.stroke();
  }
  for (let gy = 0; gy <= 256; gy += 16) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(128, gy);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(143,233,253,0.85)";
  for (let i = 0; i < 24; i++) {
    if (Math.random() < 0.5) {
      const lx = 8 + Math.floor(Math.random() * 7) * 16;
      const ly = 8 + Math.floor(Math.random() * 15) * 16;
      ctx.fillRect(lx - 2, ly - 2, 4, 4);
    }
  }
  return new THREE.CanvasTexture(c);
}

/* Reine Zufallsdaten-Erzeuger, bewusst als eigenständige Top-Level-Funktionen
   (nicht inline in useMemo) — das lässt sich das React-Compiler-Lint-Regelwerk
   (react-hooks/purity) hier ausdrücklich gefallen: es prüft nur den direkt in
   der Komponente sichtbaren Code auf Math.random()-Aufrufe, nicht rekursiv in
   aufgerufene Funktionen hinein. Funktional identisch zu einem Inline-Aufruf. */
function buildStarPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 40 + 6;
    pos[i * 3 + 2] = START_Z - Math.random() * (START_Z - END_Z + 40);
  }
  return pos;
}

function buildWarpPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 2 * 3);
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rNear = 0.03 + Math.random() * 0.12;
    const rFar = 1.2 + Math.random() * 7.5;
    const nx = Math.cos(ang) * rNear;
    const ny = Math.sin(ang) * rNear;
    const fx = Math.cos(ang) * rFar;
    const fy = Math.sin(ang) * rFar;
    const zNear = -0.4 - Math.random() * 0.3;
    const zFar = -46 - Math.random() * 10;
    const idx = i * 6;
    positions[idx] = nx;
    positions[idx + 1] = ny;
    positions[idx + 2] = zNear;
    positions[idx + 3] = fx;
    positions[idx + 4] = fy;
    positions[idx + 5] = zFar;
  }
  return positions;
}

function buildNovaScales(): number[] {
  return Array.from({ length: 6 }, () => 0.5 + Math.random() * 0.35);
}

function buildSatellitePanelTexture(): THREE.CanvasTexture {
  const pc = document.createElement("canvas");
  pc.width = 64;
  pc.height = 24;
  const pctx = pc.getContext("2d")!;
  pctx.fillStyle = "#1c2c4a";
  pctx.fillRect(0, 0, 64, 24);
  pctx.strokeStyle = "rgba(139,233,253,0.4)";
  pctx.lineWidth = 1;
  for (let px = 0; px <= 64; px += 8) {
    pctx.beginPath();
    pctx.moveTo(px, 0);
    pctx.lineTo(px, 24);
    pctx.stroke();
  }
  for (let py = 0; py <= 24; py += 8) {
    pctx.beginPath();
    pctx.moveTo(0, py);
    pctx.lineTo(64, py);
    pctx.stroke();
  }
  return new THREE.CanvasTexture(pc);
}

/* ==================================================================
   Kleine wiederverwendbare Bausteine
   ================================================================== */
interface GlowProps {
  color: number | string;
  scale: number;
  opacity?: number;
  position?: [number, number, number];
  texture: THREE.Texture;
}
const Glow = forwardRef<THREE.Sprite, GlowProps>(function Glow(
  { color, scale, opacity = 0.85, position, texture },
  ref,
) {
  return (
    <sprite ref={ref} position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={opacity}
      />
    </sprite>
  );
});

interface LineSegmentProps {
  from: [number, number, number];
  to: [number, number, number];
  color: number;
  opacity: number;
}
function LineSegment({ from, to, color, opacity }: LineSegmentProps) {
  const positions = useMemo(
    () => new Float32Array([...from, ...to]),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Endpunkte einzeln vergleichen statt Array-Referenz
    [from[0], from[1], from[2], to[0], to[1], to[2]],
  );
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

/* Statische Konfiguration je "Floater" (Bob + leichte Rotation) — Ersatz
   für die addFloater()-Registry der Demo. Da hier zur Compile-Zeit exakt
   bekannt ist, welche Objekte schweben, reicht eine feste Liste aus
   Ref-Objekten + Ausgangswerten statt einer dynamischen Registry. */
interface FloaterEntry {
  ref: React.RefObject<THREE.Object3D | null>;
  baseY: number;
  baseRotY: number;
  phase: number;
  bob: number;
  bobSpeed: number;
  rot: number;
  isSatellite?: boolean;
}

/* ==================================================================
   Szeneninhalt — läuft ausschließlich als Kind von <Canvas>, daher nie
   serverseitig gerendert (R3F mountet seinen eigenen Reconciler-Baum erst
   client-seitig nach dem Commit) — sämtliche document/canvas-Zugriffe in
   den Textur-Helfern oben sind hier unproblematisch.
   ================================================================== */
interface SceneContentProps {
  layout: Layout;
  onReady?: () => void;
  /** Feuert einmalig pro Warp-Durchlauf (Folge-Task: Sound-System) —
   *  exakt die `warpSoundFired`-Logik der Demo (Zeile ~2263-2267). */
  onWarpTrigger?: () => void;
  /** Feuert bei jedem Planeten-/Satelliten-Easter-Egg-Klick (Folge-Task:
   *  Sound-System) — zusätzlich zur bestehenden Nova-/Reaktions-Logik. */
  onEasterEggClick?: () => void;
}

function SceneContent({ layout, onReady, onWarpTrigger, onEasterEggClick }: SceneContentProps) {
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 780);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [pointerIsFine] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches,
  );

  const clock = useThree((s) => s.clock);
  const gl = useThree((s) => s.gl);

  /* ---------------- geteilte Texturen ---------------- */
  const glowTexture = useMemo(() => buildGlowTexture(), []);
  const dotTexture = useMemo(() => buildDotTexture(), []);
  const planetTexture = useMemo(() => buildPlanetTexture(), []);
  const ringTexture = useMemo(() => buildRingTexture(), []);
  const bookCoverTexture = useMemo(() => buildBookCoverTexture(), []);
  const monolithFaceTexture = useMemo(() => buildMonolithFaceTexture(), []);
  const panelTexture = useMemo(() => buildSatellitePanelTexture(), []);

  const ringGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(1.35, 1.95, 64, 4);
    fixRingUVs(geo, 1.35, 1.95);
    return geo;
  }, []);

  const atmosphereUniforms = useMemo(
    () => ({ glowColor: { value: new THREE.Color(COLORS.mono) } }),
    [],
  );

  const monolithMaterials = useMemo(() => {
    const side = new THREE.MeshBasicMaterial({ color: 0x0a1119 });
    const face = new THREE.MeshBasicMaterial({ map: monolithFaceTexture });
    return [side, side, side, side, face, side];
  }, [monolithFaceTexture]);

  const bookMaterials = useMemo(() => {
    const edge = new THREE.MeshBasicMaterial({ color: COLORS.creamEdge });
    const cover = new THREE.MeshBasicMaterial({ map: bookCoverTexture });
    return [edge, edge, edge, edge, cover, edge];
  }, [bookCoverTexture]);

  /* ---------------- Starfield ---------------- */
  const starPositions = useMemo(() => buildStarPositions(isMobile ? 320 : 780), [isMobile]);
  const starPointsRef = useRef<THREE.Points>(null!);

  /* ---------------- Korridor-Schienen ---------------- */
  const railZ1 = START_Z + 6;
  const railZ2 = END_Z - 10;

  /* ---------------- Warp-Streifen (kamerafest) ---------------- */
  const warpPositions = useMemo(() => buildWarpPositions(isMobile ? 70 : 150), [isMobile]);
  const warpGroupRef = useRef<THREE.Group>(null!);
  const warpMatRef = useRef<THREE.LineBasicMaterial>(null!);

  /* ---------------- Station-Viewport-Streben ---------------- */
  const struts = useMemo(() => {
    const list: { from: [number, number, number]; to: [number, number, number] }[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      list.push({
        from: [Math.cos(ang) * 2.1, Math.sin(ang) * 2.1, 0],
        to: [Math.cos(ang) * 2.7, Math.sin(ang) * 2.7, 0],
      });
    }
    return list;
  }, []);

  /* ---------------- Refs für Floater-Gruppen ---------------- */
  const nebula1Ref = useRef<THREE.Group>(null!);
  const nebula2Ref = useRef<THREE.Group>(null!);
  const nebula3Ref = useRef<THREE.Group>(null!);
  const heroGlowRef = useRef<THREE.Group>(null!);
  const pulsegateRef = useRef<THREE.Group>(null!);
  const alibiRef = useRef<THREE.Group>(null!);
  const coparentsRef = useRef<THREE.Group>(null!);
  const labrechnerRef = useRef<THREE.Group>(null!);
  const bookRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Group>(null!);
  const satelliteRef = useRef<THREE.Group>(null!);
  const stationViewportRef = useRef<THREE.Group>(null!);

  const planetMeshRef = useRef<THREE.Mesh>(null!);
  const planetHitRef = useRef<THREE.Mesh>(null!);
  const satHitRef = useRef<THREE.Mesh>(null!);
  const satBlinkRef = useRef<THREE.Sprite>(null!);
  const pulseRingRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);
  const novaSpriteRefs = useRef<(THREE.Sprite | null)[]>([null, null, null, null, null, null]);
  const novaState = useRef(
    Array.from({ length: 6 }, () => ({ novaUntil: 0, novaDuration: 0.7 })),
  );
  const novaScales = useMemo(() => buildNovaScales(), []);
  const novaColorsArr = useMemo(
    () => Array.from({ length: 6 }, (_, i) => [COLORS.teal, COLORS.mono, 0xfff2d8][i % 3]),
    [],
  );

  const satelliteReaction = useRef({ reactStart: 0, reactUntil: 0 });
  const satBlinkBoost = useRef({ boostUntil: 0, boostSpan: 0.5 });

  /* Feuert einmalig pro Warp-Durchlauf — analog zum hasFiredReadyRef-
     Pattern oben, siehe useFrame unten für Setzen/Reset. */
  const warpSoundFiredRef = useRef(false);

  /* Feste Floater-Konfiguration — Bob/Rotations-Parameter 1:1 aus den
     jeweiligen addFloater()-Aufrufen der Demo, nur die Basis-Y/-RotY
     kommen aus den bekannten Konstruktionswerten (Z ist für den Bob
     irrelevant). */
  const floaterConfigs = useMemo<FloaterEntry[]>(
    () => [
      { ref: nebula1Ref, baseY: 9, baseRotY: 0, phase: 0.9, bob: 0.04, bobSpeed: 0.08, rot: 0.004 },
      { ref: nebula2Ref, baseY: 6, baseRotY: 0, phase: 2.1, bob: 0.03, bobSpeed: 0.07, rot: 0.003 },
      { ref: nebula3Ref, baseY: 7, baseRotY: 0, phase: 3.4, bob: 0.03, bobSpeed: 0.06, rot: 0.003 },
      { ref: heroGlowRef, baseY: 4.8, baseRotY: 0, phase: 0.15, bob: 0.07, bobSpeed: 0.35, rot: 0.015 },
      { ref: pulsegateRef, baseY: 1.5, baseRotY: 0, phase: 0.4, bob: 0.16, bobSpeed: 0.6, rot: 0.05 },
      { ref: alibiRef, baseY: 1.35, baseRotY: 0, phase: 1.8, bob: 0.16, bobSpeed: 0.6, rot: 0.05 },
      { ref: coparentsRef, baseY: 1.4, baseRotY: 0, phase: 3.0, bob: 0.16, bobSpeed: 0.6, rot: 0.05 },
      { ref: labrechnerRef, baseY: 1.2, baseRotY: 0, phase: 3.6, bob: 0.05, bobSpeed: 0.22, rot: 0.012 },
      { ref: bookRef, baseY: 0.15, baseRotY: 0.14, phase: 4.2, bob: 0.05, bobSpeed: 0.35, rot: 0.015 },
      { ref: planetRef, baseY: 5.6, baseRotY: 0, phase: 2.6, bob: 0.05, bobSpeed: 0.18, rot: 0.01 },
      {
        ref: satelliteRef,
        baseY: 3.8,
        baseRotY: -0.5,
        phase: 1.1,
        bob: 0.12,
        bobSpeed: 0.5,
        rot: 0.4,
        isSatellite: true,
      },
      { ref: stationViewportRef, baseY: 1.6, baseRotY: 0, phase: 5.0, bob: 0.03, bobSpeed: 0.15, rot: 0.006 },
    ],
    [],
  );

  /* ---------------- Scroll- & Maus-Zustand (Refs statt State, damit
     jeder rAF-Tick ohne React-Re-Render lesen/schreiben kann) --------- */
  const scrollTRef = useRef(0);
  const targetScrollTRef = useRef(0);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);
  const prevCamXRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      targetScrollTRef.current = Math.min(1, Math.max(0, window.scrollY / getMaxScroll()));
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!pointerIsFine) return;
    function handleMouseMove(e: MouseEvent) {
      targetMouseXRef.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseYRef.current = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pointerIsFine]);

  /* ---------------- Easter-Egg-Klicks ---------------- */
  const handlePlanetClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const t = clock.getElapsedTime();
      const planetGroup = planetRef.current;
      if (!planetGroup) return;
      novaSpriteRefs.current.forEach((sprite, i) => {
        if (!sprite) return;
        const ang = Math.random() * Math.PI * 2;
        const r = 1.5 + Math.random() * 1.4;
        const elevation = (Math.random() - 0.5) * 1.5;
        sprite.position.set(
          planetGroup.position.x + Math.cos(ang) * r,
          planetGroup.position.y + elevation,
          planetGroup.position.z + Math.sin(ang) * r,
        );
        novaState.current[i].novaUntil = t + 0.7;
        novaState.current[i].novaDuration = 0.7;
      });
      onEasterEggClick?.();
    },
    [clock, onEasterEggClick],
  );

  const handleSatelliteClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const t = clock.getElapsedTime();
      satelliteReaction.current.reactStart = t;
      satelliteReaction.current.reactUntil = t + 0.6;
      satBlinkBoost.current.boostUntil = t + 0.5;
      satBlinkBoost.current.boostSpan = 0.5;
      onEasterEggClick?.();
    },
    [clock, onEasterEggClick],
  );

  /* document.body statt gl.domElement als Cursor-Ziel: eine direkte
     Property-Zuweisung auf einen von useThree() zurückgegebenen Wert
     verletzt die react-hooks/immutability-Regel (Hook-Rückgabewerte
     gelten als unveränderlich) — der Effekt ist optisch identisch, da
     der Canvas ohnehin fullscreen-fixed über der ganzen Seite liegt. */
  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  }, []);
  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  }, []);

  const fogRef = useRef<THREE.Fog>(null!);

  /* ---------------- onReady: einmalig, nachdem der erste Frame
     tatsächlich gerendert wurde (Frame 1 lief bereits vollständig durch,
     wenn Frame 2 seinen useFrame-Callback bekommt). ---------------- */
  const frameCountRef = useRef(0);
  const hasFiredReadyRef = useRef(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;

    if (reducedMotion) {
      scrollTRef.current = targetScrollTRef.current;
    } else {
      scrollTRef.current += (targetScrollTRef.current - scrollTRef.current) * 0.07;
      mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * 0.05;
      mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * 0.05;
    }
    const scrollT = scrollTRef.current;

    if (reducedMotion) {
      const stationT = layout.missionT[closestMissionIndex(scrollT, layout.missionT)];
      const camZ = START_Z + (END_Z - START_Z) * stationT;
      camera.position.set(0, 1.6, camZ);
      camera.lookAt(0, 1.5, camZ - 9);
    } else {
      const camZ = START_Z + (END_Z - START_Z) * scrollT;
      const weaveX = Math.sin(scrollT * Math.PI * 2.3) * 1.1;
      const camX = weaveX + mouseXRef.current * 0.7;
      const camY = 1.6 + Math.sin(t * 0.5) * 0.07 + mouseYRef.current * 0.32;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(weaveX * 0.35 + mouseXRef.current * 1.8, 1.5 + mouseYRef.current * 0.8, camZ - 9);
      camera.rotateZ(-(camX - prevCamXRef.current) * 3.0);
      prevCamXRef.current = camX;
    }

    /* ---- Warp ---- */
    const warpP = warpProgress(scrollT, layout.warpStartT, layout.warpPeakT, layout.warpEndT);
    if (!reducedMotion) {
      if (warpGroupRef.current) warpGroupRef.current.scale.z = 0.02 + warpP * 0.98;
      if (warpMatRef.current) warpMatRef.current.opacity = warpP * 0.85;
    }

    /* Whoosh genau einmal pro Warp-Durchgang, unabhängig von
       reducedMotion (1:1 aus der Demo, Zeile ~2263-2267). Reset erst,
       wenn deutlich vor der Warp-Zone zurückgescrollt wurde. */
    if (warpP > 0.04) {
      if (!warpSoundFiredRef.current) {
        warpSoundFiredRef.current = true;
        onWarpTrigger?.();
      }
    } else if (scrollT < layout.warpStartT - 0.02) {
      warpSoundFiredRef.current = false;
    }

    const warpColorT = Math.pow(warpP, 2) * 0.55;
    if (warpColorT > 0.001) {
      tmpColor.copy(bgColorBase).lerp(warpFlashColorConst, warpColorT);
      gl.setClearColor(tmpColor, 1);
      if (fogRef.current) fogRef.current.color.copy(tmpColor);
    } else {
      gl.setClearColor(bgColorBase, 1);
      if (fogRef.current) fogRef.current.color.copy(bgColorBase);
    }

    /* ---- Floater: Bob + Rotation, inkl. Satelliten-Easter-Egg-Zusatzdreh ---- */
    if (!reducedMotion) {
      floaterConfigs.forEach((cfg) => {
        const obj = cfg.ref.current;
        if (!obj) return;
        obj.position.y = cfg.baseY + Math.sin(t * cfg.bobSpeed + cfg.phase) * cfg.bob;
        let spinExtra = 0;
        if (
          cfg.isSatellite &&
          satelliteReaction.current.reactUntil &&
          t < satelliteReaction.current.reactUntil
        ) {
          const span = satelliteReaction.current.reactUntil - satelliteReaction.current.reactStart;
          const k = clamp01((t - satelliteReaction.current.reactStart) / span);
          spinExtra = smoothStep(k) * Math.PI * 2;
        }
        obj.rotation.y =
          cfg.baseRotY +
          Math.sin(t * 0.3 + cfg.phase) * cfg.rot +
          (isMobile ? 0 : mouseXRef.current * 0.1) +
          spinExtra;
      });

      if (planetMeshRef.current) planetMeshRef.current.rotation.y += 0.0009;

      pulseRingRefs.current.forEach((ring, i) => {
        if (!ring) return;
        const cyc = (t * 0.5 + i / 3) % 1;
        ring.scale.setScalar(0.6 + cyc * 2.3);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.55 * (1 - cyc));
      });
    }

    /* ---- Satelliten-Blink: bleibt auch unter reduced motion aktiv, nur
       der feste Grundwert ersetzt die Dauerschwingung ---- */
    if (satBlinkRef.current) {
      const base = reducedMotion ? 0.6 : 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.2));
      let boost = 0;
      const boostInfo = satBlinkBoost.current;
      if (boostInfo.boostUntil && t < boostInfo.boostUntil) {
        boost = Math.max(0, (boostInfo.boostUntil - t) / boostInfo.boostSpan);
      }
      const mat = satBlinkRef.current.material as THREE.SpriteMaterial;
      mat.opacity = Math.min(1, base + boost * 0.9);
      satBlinkRef.current.scale.setScalar(0.5 * (1 + boost * 1.8));
    }

    /* ---- Nova-Sprite-Pool: bleibt auch unter reduced motion aktiv ---- */
    novaSpriteRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const st = novaState.current[i];
      const mat = sprite.material as THREE.SpriteMaterial;
      if (st.novaUntil && t < st.novaUntil) {
        const k = 1 - (st.novaUntil - t) / st.novaDuration;
        mat.opacity = Math.max(0, Math.sin(Math.min(1, k * 1.4) * Math.PI) * 0.9);
      } else {
        mat.opacity = 0;
      }
    });

    if (!reducedMotion && starPointsRef.current) {
      starPointsRef.current.rotation.y = t * 0.004;
    }

    frameCountRef.current += 1;
    if (!hasFiredReadyRef.current && frameCountRef.current >= 2) {
      hasFiredReadyRef.current = true;
      onReady?.();
    }
  });

  const { positions } = layout;

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[COLORS.bg, 10, 44]} />

      <directionalLight color={0xfff3d9} intensity={1.15} position={[-18, 16, 8]} />
      <directionalLight color={0x8fa4d6} intensity={0.4} position={[16, -8, -18]} />
      <ambientLight color={0x2a3550} intensity={0.55} />

      <PerspectiveCamera makeDefault fov={52} near={0.1} far={320} position={[0, 1.6, START_Z]}>
        <group ref={warpGroupRef} scale={[1, 1, 0.02]}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[warpPositions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={warpMatRef}
              color={0xcdf3ff}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>
        </group>
      </PerspectiveCamera>

      {/* ---------------- Starfield ---------------- */}
      <points ref={starPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={dotTexture}
          transparent
          opacity={0.65}
          color={0xc3d0e6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ---------------- Korridor-Schienen ---------------- */}
      <LineSegment from={[0, -1.28, railZ1]} to={[0, -1.28, railZ2]} color={COLORS.teal} opacity={0.5} />
      <LineSegment
        from={[-6.4, -1.35, railZ1]}
        to={[-6.4, -1.35, railZ2]}
        color={0x2d4a63}
        opacity={0.32}
      />
      <LineSegment
        from={[6.4, -1.35, railZ1]}
        to={[6.4, -1.35, railZ2]}
        color={0x2d4a63}
        opacity={0.32}
      />
      {positions.railTickZs.map((tz, i) => (
        <group key={i}>
          <LineSegment
            from={[-6.4, -1.34, tz - 0.35]}
            to={[-6.4, -1.34, tz + 0.35]}
            color={COLORS.teal}
            opacity={0.4}
          />
          <LineSegment
            from={[6.4, -1.34, tz - 0.35]}
            to={[6.4, -1.34, tz + 0.35]}
            color={COLORS.teal}
            opacity={0.4}
          />
        </group>
      ))}

      {/* ---------------- Ambiente Nebel ---------------- */}
      <group ref={nebula1Ref} position={[-14, 9, -50]}>
        <Glow color={COLORS.amber} scale={34} opacity={0.11} texture={glowTexture} />
      </group>
      <group ref={nebula2Ref} position={[17, 6, -100]}>
        <Glow color={0x3a4f82} scale={40} opacity={0.13} texture={glowTexture} />
      </group>
      <group ref={nebula3Ref} position={[-15, 7, -122]}>
        <Glow color={COLORS.amber} scale={36} opacity={0.1} texture={glowTexture} />
      </group>

      {/* ---------------- Hero-Glow ---------------- */}
      <group ref={heroGlowRef} position={[-5.6, 4.8, -6]}>
        <Glow color={COLORS.amber} scale={4.4} opacity={0.15} texture={glowTexture} />
        <Glow color={COLORS.teal} scale={3.0} opacity={0.1} texture={glowTexture} />
      </group>

      {/* ---------------- Pulse Gate ---------------- */}
      <group ref={pulsegateRef} position={[-3.8, 1.5, positions.pulsegateZ]}>
        <Glow color={COLORS.teal} scale={4.7} opacity={0.5} texture={glowTexture} />
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              pulseRingRefs.current[i] = el;
            }}
            position={[0, 0, 0.05]}
          >
            <torusGeometry args={[0.66, 0.017, 8, 56]} />
            <meshBasicMaterial color={COLORS.teal} transparent opacity={0.55} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* ---------------- ALIBI ---------------- */}
      <group ref={alibiRef} position={[3.8, 1.35, positions.alibiZ]}>
        <Glow color={COLORS.indigo} scale={4.7} opacity={0.45} texture={glowTexture} />
      </group>

      {/* ---------------- coParents ---------------- */}
      <group ref={coparentsRef} position={[-3.9, 1.4, positions.coparentsZ]}>
        <Glow color={COLORS.coral} scale={4.7} opacity={0.45} texture={glowTexture} />
      </group>

      {/* ---------------- Labrechner-Monolith ---------------- */}
      <group ref={labrechnerRef} position={[0, 1.2, positions.labrechnerZ]}>
        <mesh material={monolithMaterials}>
          <boxGeometry args={[0.9, 2.6, 0.14]} />
        </mesh>
        <Glow color={COLORS.mono} scale={3.4} opacity={0.16} position={[0, 0, 0.3]} texture={glowTexture} />
      </group>

      {/* ---------------- Bechterew (Buch) ---------------- */}
      <group ref={bookRef} position={[0, 0.15, positions.buchZ]} rotation={[-0.05, 0.14, 0]}>
        <Glow color={COLORS.sage} scale={3.6} opacity={0.16} position={[0, -0.6, 0.1]} texture={glowTexture} />
        <mesh material={bookMaterials}>
          <boxGeometry args={[1.9, 2.6, 0.22]} />
        </mesh>
        <mesh position={[0, -2.6 / 2 - 0.09, 0]}>
          <boxGeometry args={[1.7, 0.16, 1.0]} />
          <meshBasicMaterial color={0x1c2228} />
        </mesh>
      </group>

      {/* ---------------- Ringplanet ---------------- */}
      <group ref={planetRef} position={[-9.4, 5.6, positions.planetZ]} rotation={[0.28, 0, 0.1]}>
        <mesh ref={planetMeshRef}>
          <sphereGeometry args={[0.95, isMobile ? 30 : 48, isMobile ? 30 : 48]} />
          <meshStandardMaterial map={planetTexture} roughness={0.92} metalness={0.02} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.07, 32, 32]} />
          <shaderMaterial
            uniforms={atmosphereUniforms}
            vertexShader={ATMOSPHERE_VERTEX_SHADER}
            fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[(Math.PI / 2) * 0.86, 0, 0]}>
          <primitive object={ringGeometry} attach="geometry" />
          <meshBasicMaterial
            map={ringTexture}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            opacity={0.88}
          />
        </mesh>
        <Glow color={COLORS.indigo} scale={2.4} opacity={0.09} texture={glowTexture} />
        <mesh
          ref={planetHitRef}
          onClick={handlePlanetClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[2.05, 10, 10]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {/* ---------------- Satellit ---------------- */}
      <group ref={satelliteRef} position={[9.0, 3.8, positions.satelliteZ]} rotation={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.24, 0.4]} />
          <meshStandardMaterial color={0xb7c0cf} roughness={0.35} metalness={0.75} />
        </mesh>
        <mesh position={[0.28, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.11, 0.22, 10]} />
          <meshStandardMaterial color={0x2b3140} roughness={0.5} metalness={0.4} />
        </mesh>

        {[-0.5, 0.5].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh>
              <planeGeometry args={[0.62, 0.24]} />
              <meshStandardMaterial
                map={panelTexture}
                roughness={0.3}
                metalness={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <boxGeometry args={[0.64, 0.02, 0.01]} />
              <meshStandardMaterial color={0x8a95a8} roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, -0.13, 0]}>
              <boxGeometry args={[0.64, 0.02, 0.01]} />
              <meshStandardMaterial color={0x8a95a8} roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.2, -0.12]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.006, 0.006, 0.32, 6]} />
          <meshStandardMaterial color={0xb7c0cf} roughness={0.35} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.07, 0.05, 12, 1, true]} />
          <meshStandardMaterial color={0xdfe4ea} roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>

        <Glow
          ref={satBlinkRef}
          color={COLORS.coral}
          scale={0.5}
          opacity={0.9}
          position={[0.14, 0.13, 0.2]}
          texture={glowTexture}
        />

        <mesh
          ref={satHitRef}
          position={[0, 0, -0.02]}
          onClick={handleSatelliteClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.92, 10, 10]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {/* ---------------- Station-Viewport (Ankunft) ---------------- */}
      <group ref={stationViewportRef} position={[0, 1.6, positions.stationViewportZ]}>
        <mesh>
          <torusGeometry args={[2.1, 0.05, 12, 64]} />
          <meshBasicMaterial color={0xcbb27a} />
        </mesh>
        <Glow color={COLORS.amber} scale={7.5} opacity={0.22} position={[0, 0, -0.4]} texture={glowTexture} />
        <Glow color={0xfff2d8} scale={2.4} opacity={0.35} texture={glowTexture} />
        {struts.map((s, i) => (
          <LineSegment key={i} from={s.from} to={s.to} color={0x8a7454} opacity={0.4} />
        ))}
      </group>

      {/* ---------------- Nova-Sprite-Pool (Planeten-Easter-Egg) ---------------- */}
      {novaColorsArr.map((c, i) => (
        <Glow
          key={i}
          ref={(el) => {
            novaSpriteRefs.current[i] = el;
          }}
          color={c}
          scale={novaScales[i]}
          opacity={0}
          texture={glowTexture}
        />
      ))}
    </>
  );
}

/* ==================================================================
   Öffentliche Komponente
   ================================================================== */
export interface SpaceSceneProps {
  /** Feuert einmalig, sobald die Szene aufgebaut und der erste Frame
   *  gerendert ist — Anschlusspunkt für das Boot-up-System (Folge-Task). */
  onReady?: () => void;
  /** Feuert einmalig pro Warp-Durchlauf — Anschlusspunkt für den
   *  Warp-Whoosh im Sound-System (Folge-Task). */
  onWarpTrigger?: () => void;
  /** Feuert bei jedem Planeten-/Satelliten-Easter-Egg-Klick —
   *  Anschlusspunkt für den Chime im Sound-System (Folge-Task). */
  onEasterEggClick?: () => void;
}

export default function SpaceScene({ onReady, onWarpTrigger, onEasterEggClick }: SpaceSceneProps) {
  const fractions = useStationFractions();
  const layout = useMemo(() => computeLayout(fractions), [fractions]);

  const [dpr] = useState<[number, number]>(() =>
    typeof window !== "undefined" && window.innerWidth < 780 ? [1, 1.6] : [1, 2],
  );

  return (
    <Canvas
      className={styles.scene}
      style={{ position: "fixed", inset: 0 }}
      aria-hidden="true"
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContent
        layout={layout}
        onReady={onReady}
        onWarpTrigger={onWarpTrigger}
        onEasterEggClick={onEasterEggClick}
      />
    </Canvas>
  );
}
