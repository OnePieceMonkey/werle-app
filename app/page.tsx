import SpaceScene from "@/components/SpaceScene";
import MissionNav from "@/components/MissionNav";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import LabrechnerSection from "@/components/LabrechnerSection";
import BookSection from "@/components/BookSection";
import ArrivalSection from "@/components/ArrivalSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* Platzhalter für die 3D-Szene, siehe components/SpaceScene.tsx */}
      <SpaceScene />
      <MissionNav />

      <main id="top" className={styles.main}>
        <Hero />

        <section id="pulsegate" className={styles.stageLeft}>
          <ProductCard
            variant="pulsegate"
            status="Im App-Store-Review"
            accent="teal"
            title={
              <>
                Pulse Gate: <em>Echo Shift</em>
              </>
            }
            ariaLabel="Pulse Gate: Echo Shift — pulsegate.werle.app"
            description="Ein Antippen legt den Anchor-Winkel fest, der Puls expandiert kreisförmig — die Kollision entscheidet sich am Winkel gegen die Gates. Antizipatives Timing statt direktem Treffen, über 200 Level."
            href="https://pulsegate.werle.app"
            ctaLabel="pulsegate.werle.app"
            media={{
              main: {
                src: "/images/pulsegate-menu.jpg",
                alt: "Pulse Gate: Echo Shift — Hauptmenü, dunkles Theme mit Cyan-Akzent",
                width: 368,
                height: 800,
              },
              secondary: {
                src: "/images/pulsegate-gameplay.jpg",
                alt: "Pulse Gate Gameplay — die Puls-Ring-Mechanik gegen ein Gate",
                width: 368,
                height: 800,
              },
            }}
          />
        </section>

        <section id="alibi" className={styles.stageRight}>
          <ProductCard
            variant="alibi"
            status="In Entwicklung"
            accent="indigo"
            title={
              <>
                ALIBI — <em>Das Verhör</em>
              </>
            }
            ariaLabel="ALIBI — Das Verhör — verhoer.werle.app"
            description="Ein Fall pro Tag, weltweit derselbe. Drei Verdächtige, vierzehn Fragen Budget — die Anklage braucht den Täter und den einen Widerspruch, der ihn überführt."
            href="https://verhoer.werle.app"
            ctaLabel="verhoer.werle.app"
            media={{
              main: {
                src: "/images/alibi-scene.jpg",
                alt: "ALIBI Fall-Illustration — Tuschezeichnung mit blauer Aquarellwäsche auf cremefarbenem Papier",
                width: 896,
                height: 1200,
              },
              secondary: {
                src: "/images/alibi-portrait.webp",
                alt: "Verdächtigen-Porträt im ALIBI-Illustrationsstil",
                width: 860,
                height: 1080,
              },
            }}
            notify={{
              product: "alibi",
              label: "Bescheid sagen, wenn's da ist",
              ariaLabel: "Benachrichtigung, wenn ALIBI verfügbar ist",
            }}
          />
        </section>

        <section id="coparents" className={styles.stageLeft}>
          <ProductCard
            variant="coparents"
            status="In Entwicklung"
            accent="coral"
            title="coParents"
            ariaLabel="coParents — in Entwicklung, noch kein Store-Eintrag"
            description="Wechselkalender mit farbcodierten Tagen, Ausgaben-Splitting, Übergabe-Koordination und Chat — für Eltern, die gemeinsam ein Kind großziehen, auch getrennt."
            ctaLabel="Noch kein Store-Eintrag"
            media={{
              main: {
                src: "/images/coparents-kalender.png",
                alt: "coParents — Wechselkalender mit farbcodierten Tagen und Übergabe-Countdown",
                width: 1320,
                height: 2868,
              },
              secondary: {
                src: "/images/coparents-uebersicht.png",
                alt: "coParents — Übersichts-Screen",
                width: 1320,
                height: 2868,
              },
              icon: {
                src: "/images/coparents-icon.png",
                alt: "coParents App-Icon — zwei überlappende Kreise",
                width: 1024,
                height: 1024,
              },
            }}
            notify={{
              product: "coparents",
              label: "Bescheid sagen, wenn's da ist",
              ariaLabel: "Benachrichtigung, wenn coParents verfügbar ist",
            }}
          />
        </section>

        <LabrechnerSection />
        <BookSection />
        <ArrivalSection />
      </main>
    </>
  );
}
