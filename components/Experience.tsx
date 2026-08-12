"use client";

import { useState } from "react";
import SpaceScene from "@/components/SpaceScene";
import BootupIntro from "@/components/BootupIntro";
import CursorTrail from "@/components/CursorTrail";
import RotateHint from "@/components/RotateHint";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import type { Locale } from "@/lib/content";

interface ExperienceProps {
  locale?: Locale;
}

/* ==================================================================
   Erlebnis-Chrome, das die 3D-Szene umhüllt — Boot-up-Intro, Sound-
   System-Anschluss (Warp-Whoosh + Easter-Egg-Chime), Sternstaub-
   Cursor-Trail und Mobil-Querformat-Hinweis. Eigene Client-Component,
   damit app/page.tsx eine Server Component bleiben kann.
   ================================================================== */
export default function Experience({ locale = "de" }: ExperienceProps) {
  const [sceneReady, setSceneReady] = useState(false);
  const { playWhoosh, playChime } = useAmbientSound();

  return (
    <>
      <SpaceScene
        onReady={() => setSceneReady(true)}
        onWarpTrigger={playWhoosh}
        onEasterEggClick={playChime}
      />
      <BootupIntro sceneReady={sceneReady} locale={locale} />
      <CursorTrail />
      <RotateHint locale={locale} />
    </>
  );
}
