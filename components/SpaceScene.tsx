import styles from "./SpaceScene.module.css";

// TODO: Three.js/R3F-Szene, siehe Folge-Task. In diesem Durchgang nur ein
// Platzhalter — rendert lediglich den dunklen Hintergrund-Grundton, an
// dessen Stelle die 3D-Szene (Sterne, Nebel, Ringplanet + Satellit, Warp-
// Effekt, scroll-gebundene Kamerafahrt, Maus-Parallaxe) treten wird.
// Bewusst als eigene Komponente an der finalen Layout-Position (siehe
// app/page.tsx) ausgelagert, damit der Folge-Durchgang nur diese Datei
// füllt statt die Seitenstruktur umzubauen.
export default function SpaceScene() {
  return <div className={styles.scene} aria-hidden="true" />;
}
