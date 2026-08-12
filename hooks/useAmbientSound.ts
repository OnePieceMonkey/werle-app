"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ==================================================================
   Sound-System — aus dem SOUND-DESIGN-Skriptblock der freigegebenen
   Demo portiert (`_temp/design-demos/demo-3d-world-v6.html`, Zeilen
   1201–1336): ein einmaliger Rausch-Whoosh (Warp-Sync) und ein
   Dreiklang-Chime (Planet-/Satelliten-Easter-Egg). Live per Web Audio
   API synthetisiert, keine externen Audiodateien.

   Live-Feedback nach Deploy: der ursprünglich mitportierte Ambient-Hum
   (Dauerton im Hintergrund) wirkte hörbar als eintöniger Dauerdrone —
   bewusst ersatzlos gestrichen, Ton beschränkt sich jetzt auf die zwei
   Event-Sounds. Der Dateiname bleibt (er steht weiterhin für den
   gesamten Sound-Zustand der Seite, nicht nur den früheren Hum).

   Architektur-Entscheidung (unverändert): audioCtx/soundEnabled sind
   bewusst Modul-Scope-Variablen — ein echtes Singleton außerhalb von
   React, analog zu den IIFE-Scope-Variablen der Demo. Grund: der
   Toggle-Button (lebt bei der Marke in Hero.tsx) und die 3D-Szene
   (Warp-Whoosh, Planet-/Satelliten-Klick-Chime in SpaceScene.tsx via
   Experience.tsx) müssen denselben Sound-Zustand lesen/auslösen,
   obwohl sie an unterschiedlichen Stellen im Komponentenbaum sitzen
   (keine Eltern-Kind-Beziehung — Prop-Drilling geht strukturell
   nicht). useSyncExternalStore macht den Hook reaktiv für den Toggle,
   ohne dass playWhoosh/playChime selbst reaktiv sein müssen — die
   werden nur imperativ aus Event-/Frame-Callbacks aufgerufen, nie
   während eines Renders.
   ================================================================== */

let audioCtx: AudioContext | null = null;
let soundEnabled = false;
let whooshBuffer: AudioBuffer | null = null;

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): boolean {
  return soundEnabled;
}

/* Server-Snapshot ist immer "aus" — deckt sich mit der echten
   Autoplay-Policy (Audio kann vor einer User-Geste ohnehin nicht
   starten), verhindert also keinen Hydration-Fall, der real vorkäme. */
function getServerSnapshot(): boolean {
  return false;
}

function ensureAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

function buildNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Einmaliger Rausch-Whoosh, synchron zum Warp-Visual — reine Funktion,
 *  liest soundEnabled zur Aufrufzeit aus dem Modul-State. */
export function playWhoosh(): void {
  if (!soundEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  if (!whooshBuffer) whooshBuffer = buildNoiseBuffer(ctx, 1.3);
  const now = ctx.currentTime;
  const dur = 1.1;
  const src = ctx.createBufferSource();
  src.buffer = whooshBuffer;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.85;
  bp.frequency.setValueAtTime(180, now);
  bp.frequency.exponentialRampToValueAtTime(2800, now + dur * 0.5);
  bp.frequency.exponentialRampToValueAtTime(420, now + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.45, now + dur * 0.16);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  src.connect(bp).connect(g).connect(ctx.destination);
  src.start(now);
  src.stop(now + dur + 0.05);
}

/** Kurzes Dreiklang-Arpeggio — geteilt vom Satelliten-/Planeten-
 *  Easter-Egg-Klick. Ebenfalls reine Funktion, siehe playWhoosh. */
export function playChime(): void {
  if (!soundEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [880, 1318.5, 1760].forEach((freq, i) => {
    const start = now + i * 0.05;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.48);
    osc.connect(g).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.52);
  });
}

/* Reiner Zustands-Toggle: aktiviert/deaktiviert die beiden Event-Sounds
   und stellt sicher, dass der AudioContext (aus derselben User-Geste
   heraus, wie von Autoplay-Policies verlangt) bereits läuft, wenn
   später ein Whoosh/Chime ausgelöst wird — kein eigener Ton beim
   Toggle-Klick selbst. */
async function toggleSoundInternal(): Promise<void> {
  soundEnabled = !soundEnabled;
  notify();

  const ctx = ensureAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();
}

export interface UseAmbientSoundResult {
  soundEnabled: boolean;
  toggleSound: () => void;
  playWhoosh: () => void;
  playChime: () => void;
}

export function useAmbientSound(): UseAmbientSoundResult {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSound = useCallback(() => {
    void toggleSoundInternal();
  }, []);

  return { soundEnabled: enabled, toggleSound, playWhoosh, playChime };
}
