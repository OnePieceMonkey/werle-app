import Experience from "@/components/Experience";
import MissionNav from "@/components/MissionNav";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import LabrechnerSection from "@/components/LabrechnerSection";
import BookSection from "@/components/BookSection";
import ArrivalSection from "@/components/ArrivalSection";
import FadeInSection from "@/components/FadeInSection";
import { content } from "@/lib/content";
import styles from "../page.module.css";

// English parallel page to app/page.tsx — identical section order, IDs
// and structure (the 3D scene in components/SpaceScene.tsx measures
// document.getElementById(id).offsetTop for exactly these ID strings, see
// SECTION_IDS there; NEVER translate them). Only the visible copy differs,
// sourced from lib/content.ts (content.en.*) instead of being hardcoded
// inline like the German page — see components/*.tsx for the locale-prop
// pattern used by the section components themselves.
const p = content.en.products;

export default function HomeEn() {
  return (
    <>
      {/* 3D-Szene + Erlebnis-Chrome (Boot-up, Sound, Cursor-Trail,
          Rotate-Hint), siehe components/Experience.tsx */}
      <Experience locale="en" />
      <MissionNav locale="en" />

      <main id="top" className={styles.main}>
        <Hero locale="en" />

        <section id="pulsegate" className={styles.stageLeft}>
          <FadeInSection>
            <ProductCard
              locale="en"
              variant="pulsegate"
              status={p.pulsegate.status}
              accent="teal"
              title={
                <>
                  {p.pulsegate.titlePrefix}
                  <em>{p.pulsegate.titleEmphasis}</em>
                </>
              }
              ariaLabel={p.pulsegate.ariaLabel}
              description={p.pulsegate.description}
              href="https://pulsegate.werle.app"
              ctaLabel={p.pulsegate.ctaLabel}
              media={{
                main: {
                  src: "/images/pulsegate-menu.jpg",
                  alt: p.pulsegate.media.main,
                  width: 368,
                  height: 800,
                },
                secondary: {
                  src: "/images/pulsegate-gameplay.jpg",
                  alt: p.pulsegate.media.secondary!,
                  width: 368,
                  height: 800,
                },
              }}
            />
          </FadeInSection>
        </section>

        <section id="alibi" className={styles.stageRight}>
          <FadeInSection>
            <ProductCard
              locale="en"
              variant="alibi"
              status={p.alibi.status}
              accent="indigo"
              title={
                <>
                  {p.alibi.titlePrefix}
                  <em>{p.alibi.titleEmphasis}</em>
                </>
              }
              ariaLabel={p.alibi.ariaLabel}
              description={p.alibi.description}
              href="https://verhoer.werle.app"
              ctaLabel={p.alibi.ctaLabel}
              media={{
                main: {
                  src: "/images/alibi-scene.jpg",
                  alt: p.alibi.media.main,
                  width: 896,
                  height: 1200,
                },
                secondary: {
                  src: "/images/alibi-portrait.webp",
                  alt: p.alibi.media.secondary!,
                  width: 860,
                  height: 1080,
                },
              }}
              notify={{
                product: "alibi",
                label: p.alibi.notifyLabel!,
                ariaLabel: p.alibi.notifyAriaLabel!,
              }}
            />
          </FadeInSection>
        </section>

        <section id="coparents" className={styles.stageLeft}>
          <FadeInSection>
            <ProductCard
              locale="en"
              variant="coparents"
              status={p.coparents.status}
              accent="coral"
              title={p.coparents.titlePrefix}
              ariaLabel={p.coparents.ariaLabel}
              description={p.coparents.description}
              ctaLabel={p.coparents.ctaLabel}
              media={{
                main: {
                  src: "/images/coparents-kalender.png",
                  alt: p.coparents.media.main,
                  width: 1320,
                  height: 2868,
                },
                secondary: {
                  src: "/images/coparents-uebersicht.png",
                  alt: p.coparents.media.secondary!,
                  width: 1320,
                  height: 2868,
                },
                icon: {
                  src: "/images/coparents-icon.png",
                  alt: p.coparents.media.icon!,
                  width: 1024,
                  height: 1024,
                },
              }}
              notify={{
                product: "coparents",
                label: p.coparents.notifyLabel!,
                ariaLabel: p.coparents.notifyAriaLabel!,
              }}
            />
          </FadeInSection>
        </section>

        <LabrechnerSection locale="en" />
        <BookSection locale="en" />
        {/* Reine Scroll-Distanz, kein Inhalt — siehe Kommentar in
            app/page.tsx (identisch übernommen, gleicher Warp-Puffer). */}
        <div className={styles.warpSpacer} aria-hidden="true" />
        <ArrivalSection locale="en" />
      </main>
    </>
  );
}
