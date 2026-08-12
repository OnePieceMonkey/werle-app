"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ==================================================================
   Ambient-Sound-System — 1:1 aus dem SOUND-DESIGN-Skriptblock der
   freigegebenen Demo portiert (`_temp/design-demos/demo-3d-world-v6.html`,
   Zeilen 1201–1336): Ambient-Hum (drei leicht verstimmte Oszillatoren
   durch ein LFO-moduliertes Lowpass-Filter), ein einmaliger Rausch-
   Whoosh (Warp-Sync) und ein Dreiklang-Chime (Planet-/Satelliten-
   Easter-Egg). Alles live per Web Audio API synthetisiert, keine
   externen Audiodateien.

   Architektur-Entscheidung (siehe Task-Auftrag): audioCtx/ambientHum/
   soundEnabled sind bewusst Modul-Scope-Variablen — ein echtes
   Singleton außerhalb von React, analog zu den IIFE-Scope-Variablen
   der Demo. Grund: der Toggle-Button (lebt bei der Marke in Hero.tsx)
   und die 3D-Szene (Warp-Whoosh, Planet-/Satelliten-Klick-Chime in
   SpaceScene.tsx via Experience.tsx) müssen denselben Sound-Zustand
   lesen/auslösen, obwohl sie an unterschiedlichen Stellen im
   Komponentenbaum sitzen (keine Eltern-Kind-Beziehung — Prop-Drilling
   geht strukturell nicht). useSyncExternalStore macht den Hook
   reaktiv für den Toggle, ohne dass playWhoosh/playChime selbst
   reaktiv sein müssen — die werden nur imperativ aus Event-/Frame-
   Callbacks aufgerufen, nie während eines Renders.
   ================================================================== */

interface AmbientHum {
  masterGain: GainNode;
  filter: BiquadFilterNode;
  oscillators: OscillatorNode[];
}

let audioCtx: AudioContext | null = null;
let ambientHum: AmbientHum | null = null;
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

function buildAmbientHum(ctx: AudioContext): AmbientHum {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 320;
  filter.Q.value = 0.6;
  filter.connect(masterGain);

  const partials: { type: OscillatorType; freq: number; detune: number; gain: number }[] = [
    { type: "sine", freq: 55, detune: 0, gain: 0.5 },
    { type: "sine", freq: 82.5, detune: -6, gain: 0.26 },
    { type: "triangle", freq: 110, detune: 5, gain: 0.15 },
  ];
  const oscillators = partials.map((p) => {
    const osc = ctx.createOscillator();
    osc.type = p.type;
    osc.frequency.value = p.freq;
    osc.detune.value = p.detune;
    const g = ctx.createGain();
    g.gain.value = p.gain;
    osc.connect(g).connect(filter);
    osc.start();
    return osc;
  });

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.045;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 85;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();
  oscillators.push(lfo);

  return { masterGain, filter, oscillators };
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

/* `ctx.currentTime` steht bei einem noch `suspended` Context auf einem
   eingefrorenen/unzuverlässigen Wert — jede Zeitplanung, die davor gelesen
   wird, kann beim tatsächlichen Losaufen des Contexts bereits in der
   Vergangenheit liegen (Browser klemmen das dann meist hart auf "sofort",
   statt die geplante Fade-Dauer einzuhalten). `resume()` muss daher
   abgeschlossen sein, bevor `now` gelesen und die Rampe geplant wird. */
async function toggleSoundInternal(): Promise<void> {
  soundEnabled = !soundEnabled;
  notify();

  const ctx = ensureAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();
  if (!ambientHum) ambientHum = buildAmbientHum(ctx);

  const now = ctx.currentTime;
  ambientHum.masterGain.gain.cancelScheduledValues(now);
  ambientHum.masterGain.gain.setValueAtTime(ambientHum.masterGain.gain.value, now);
  ambientHum.masterGain.gain.linearRampToValueAtTime(
    soundEnabled ? 0.055 : 0.0,
    now + (soundEnabled ? 1.4 : 0.5),
  );
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
