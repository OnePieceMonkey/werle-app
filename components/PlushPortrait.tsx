"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./PlushPortrait.module.css";

interface PlushPortraitProps {
  src: string;
  alt: string;
  hint: string;
}

/* ==================================================================
   Ziehbares Porträt: das Foto liegt als WebGL-Gitter im Kreis. Greifen,
   ziehen, loslassen: jeder Gitterpunkt federt zu seiner Ruhelage zurück,
   die geringe Dämpfung erzeugt das Nachwackeln. Eigene Umsetzung (Idee
   von rameerez.com, Code nicht übernommen).
   Ohne WebGL oder mit prefers-reduced-motion bleibt das normale Bild.
   ================================================================== */

// Canvas reicht über den Kreis hinaus, damit ein gezogenes Gesicht ihn verlassen kann.
const PAD = 0.35;
const COLS = 28;
const ROWS = 28;
const N = (COLS + 1) * (ROWS + 1);
const SPRING = 210;
const DAMPING = 9;
const GRAB_SIGMA = 0.2;
const PULL_LIMIT = 0.32;

const VERTEX = `attribute vec2 p; attribute vec2 t; varying vec2 vt; uniform float pad;
  void main(){ vec2 q = (p + pad) / (1.0 + 2.0*pad); gl_Position = vec4(q.x*2.0-1.0, 1.0-q.y*2.0, 0, 1); vt = t; }`;
const FRAGMENT = `precision mediump float; varying vec2 vt; uniform sampler2D tex; uniform float size;
  void main(){
    float d = length(vt - 0.5) * size - size * 0.5;
    float a = clamp(0.5 - d, 0.0, 1.0);
    vec4 c = texture2D(tex, vt); gl_FragColor = vec4(c.rgb * a, a);
  }`;

function startPlush(host: HTMLDivElement, photo: HTMLImageElement, onGrab: () => void): (() => void) | null {
  const canvas = document.createElement("canvas");
  canvas.className = styles.canvas;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const rest = new Float32Array(N * 2);
  const pos = new Float32Array(N * 2);
  const vel = new Float32Array(N * 2);
  const uv = new Float32Array(N * 2);
  const weight = new Float32Array(N);
  const pin = new Float32Array(N);
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const i = r * (COLS + 1) + c;
      const u = c / COLS;
      const v = r / ROWS;
      uv[i * 2] = rest[i * 2] = pos[i * 2] = u;
      uv[i * 2 + 1] = rest[i * 2 + 1] = pos[i * 2 + 1] = v;
      // Rand und Schultern bleiben stehen, das Gesicht bewegt sich am meisten.
      const edge = Math.max(0, Math.min(1, (0.5 - Math.hypot(u - 0.5, v - 0.5)) * 5));
      pin[i] = edge * (1 - Math.pow(v, 3) * 0.7);
    }
  }
  const indices: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = r * (COLS + 1) + c;
      const b = a + 1;
      const d = a + COLS + 1;
      indices.push(a, d, b, b, d, d + 1);
    }
  }

  const posBuf = gl.createBuffer();
  const uvBuf = gl.createBuffer();
  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
  const tLoc = gl.getAttribLocation(prog, "t");
  gl.enableVertexAttribArray(tLoc);
  gl.vertexAttribPointer(tLoc, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  const pLoc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(pLoc);
  gl.uniform1f(gl.getUniformLocation(prog, "pad"), PAD);
  gl.uniform1f(gl.getUniformLocation(prog, "size"), photo.naturalWidth);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  host.appendChild(canvas);

  const layout = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    Object.assign(canvas.style, {
      left: `${-w * PAD}px`,
      top: `${-h * PAD}px`,
      width: `${w * (1 + 2 * PAD)}px`,
      height: `${h * (1 + 2 * PAD)}px`,
    });
    canvas.width = Math.round(w * (1 + 2 * PAD) * dpr);
    canvas.height = Math.round(h * (1 + 2 * PAD) * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  layout();
  const resize = new ResizeObserver(layout);
  resize.observe(host);

  let grab: { x: number; y: number } | null = null;
  let pull: [number, number] = [0, 0];
  let look: [number, number] = [0, 0];
  const toImage = (ev: PointerEvent): [number, number] => {
    const b = host.getBoundingClientRect();
    return [(ev.clientX - b.left) / b.width, (ev.clientY - b.top) / b.height];
  };
  const onDown = (ev: PointerEvent) => {
    const [x, y] = toImage(ev);
    if (Math.hypot(x - 0.5, y - 0.5) > 0.55) return;
    grab = { x, y };
    pull = [0, 0];
    const s2 = 2 * GRAB_SIGMA * GRAB_SIGMA;
    for (let i = 0; i < N; i++) {
      const dx = rest[i * 2] - x;
      const dy = rest[i * 2 + 1] - y;
      weight[i] = Math.exp(-(dx * dx + dy * dy) / s2) * pin[i];
    }
    canvas.setPointerCapture(ev.pointerId);
    canvas.classList.add(styles.grabbing);
    onGrab();
  };
  const onMove = (ev: PointerEvent) => {
    const [x, y] = toImage(ev);
    look = [Math.max(-1, Math.min(1, (x - 0.5) * 2)), Math.max(-1, Math.min(1, (y - 0.4) * 2))];
    if (!grab) return;
    // Weiche Grenze: je weiter gezogen, desto zäher.
    const limit = (d: number) => PULL_LIMIT * Math.tanh(d / PULL_LIMIT);
    pull = [limit(x - grab.x), limit(y - grab.y)];
  };
  const onUp = () => {
    if (!grab) return;
    grab = null;
    pull = [0, 0];
    canvas.classList.remove(styles.grabbing);
  };
  const onLeave = () => {
    if (!grab) look = [0, 0];
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  let visible = true;
  const seen = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  seen.observe(host);

  let raf = 0;
  const t0 = performance.now();
  let last = t0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const breathe = Math.sin(((now - t0) / 1000) * 1.6) * 0.004;
    for (let i = 0; i < N; i++) {
      const rx = rest[i * 2];
      const ry = rest[i * 2 + 1];
      const up = 1 - ry;
      let tx = rx + (rx - 0.5) * breathe * up + look[0] * 0.012 * up * up * pin[i];
      let ty = ry - breathe * up * 0.6 + look[1] * 0.006 * up * up * pin[i];
      if (grab) {
        tx += pull[0] * weight[i];
        ty += pull[1] * weight[i];
      }
      const ax = SPRING * (tx - pos[i * 2]) - DAMPING * vel[i * 2];
      const ay = SPRING * (ty - pos[i * 2 + 1]) - DAMPING * vel[i * 2 + 1];
      vel[i * 2] += ax * dt;
      vel[i * 2 + 1] += ay * dt;
      pos[i * 2] += vel[i * 2] * dt;
      pos[i * 2 + 1] += vel[i * 2 + 1] * dt;
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    resize.disconnect();
    seen.disconnect();
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    canvas.removeEventListener("pointerleave", onLeave);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  };
}

export default function PlushPortrait({ src, alt, hint }: PlushPortraitProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let stop: (() => void) | null = null;
    let cancelled = false;
    // Erst laden, wenn das Porträt gleich ins Bild kommt.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const photo = new window.Image();
        photo.decoding = "async";
        photo.onload = () => {
          if (cancelled) return;
          stop = startPlush(host, photo, () => setIsTouched(true));
          if (stop) setIsLive(true);
        };
        photo.src = src;
      },
      { rootMargin: "300px" },
    );
    io.observe(host);
    return () => {
      cancelled = true;
      io.disconnect();
      stop?.();
    };
  }, [src]);

  return (
    <div ref={hostRef} className={`${styles.plush} ${isLive ? styles.live : ""}`}>
      <Image className={styles.photo} src={src} alt={alt} width={600} height={600} sizes="(max-width: 820px) 72vw, 380px" />
      {isLive && <p className={`${styles.hint} ${isTouched ? styles.gone : ""}`} aria-hidden="true">{hint}</p>}
    </div>
  );
}
