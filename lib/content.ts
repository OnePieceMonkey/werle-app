/* ==================================================================
   Zentrale Content-Quelle für die zweisprachige Seite (DE Standard
   unter `/`, EN unter `/en`, siehe app/en/). Jede textführende
   Sektions-Komponente bekommt eine `locale`-Prop (Default "de") und
   zieht ihre Strings von hier — kein Text lebt doppelt im JSX.

   `content.de` ist die Referenzkopie der Strings, die in app/page.tsx
   nach wie vor inline stehen (bewusst NICHT von dort aus referenziert,
   um das Risiko einer Regression auf der bestehenden deutschen Seite
   auf null zu halten — siehe Task-Auftrag "ohne Änderung an
   app/page.tsx"). Für alle Komponenten, die app/page.tsx NICHT direkt
   mit Text füttert (Hero, MissionNav, BootupIntro, RotateHint,
   BookSection, ArrivalSection, ProductCard-interne
   Strings), ist `content[locale]` dagegen die tatsächliche Quelle in
   beiden Sprachen — dort per Default-Parameter `locale: Locale = "de""
   automatisch aktiv, ohne dass app/page.tsx sich ändern muss.

   Neue Texte ergänzen: gleiche Struktur in `de` UND `en` nachziehen,
   TypeScript schlägt bei fehlenden Feldern durch `Content` fehl.
   ================================================================== */

export type Locale = "de" | "en";

interface ProductMediaAlt {
  main: string;
  secondary?: string;
  icon?: string;
}

interface ProductCopy {
  status: string;
  /** Literaler Produktname-Teil vor der Emphase, z. B. "Pulse Gate: " — bei
   *  coParents der komplette (unemphasierte) Titel. */
  titlePrefix: string;
  /** Kursiv gesetzter Titel-Teil (<em>) — undefined, wenn der Titel keine
   *  Emphase trägt (coParents). */
  titleEmphasis?: string;
  ariaLabel: string;
  description: string;
  ctaLabel: string;
  media: ProductMediaAlt;
  notifyLabel?: string;
  notifyAriaLabel?: string;
}

export interface HackathonCopy {
  /** Stabile Kennung, wird nie übersetzt (React-Key, Bild-Zuordnung). */
  id: string;
  status: string;
  title: string;
  description: string;
  imageAlt: string;
  links: readonly { label: string; href: string }[];
}

export interface WorkTierCopy {
  id: string;
  tag: string;
  title: string;
  audience: string;
  /** Konditionen in einer Zeile (Preis, Umfang, Verfügbarkeit). */
  terms: string;
  points: readonly string[];
  proof: string;
  cta: string;
  /** Hervorgehobene Stufe. */
  isMain?: boolean;
}

export interface Content {
  meta: {
    title: string;
    description: string;
  };
  languageSwitch: {
    /** Sichtbares Label des Ziel-Locale, z. B. auf der DE-Seite "EN". */
    label: string;
    ariaLabel: string;
    href: string;
  };
  hero: {
    kicker: string;
    headline: string;
    tagPrefix: string;
    tagEmphasis: string;
    tagSuffix: string;
    scrollHint: string;
    /** aria-label, wenn Ton gerade AN ist (Aktion: stummschalten). */
    soundOn: string;
    /** aria-label, wenn Ton gerade AUS ist (Aktion: aktivieren). */
    soundOff: string;
  };
  nav: {
    ariaLabel: string;
    hero: string;
    pulsegate: string;
    alibi: string;
    jellycut: string;
    coparents: string;
    hackathons: string;
    "ueber-mich": string;
    arbeiten: string;
    buch: string;
    kontakt: string;
  };
  bootup: {
    loadingLabel: string;
    lines: readonly [string, string, string];
  };
  rotateHint: {
    textPre: string;
    textEmphasis: string;
    textPost: string;
    dismiss: string;
  };
  productCard: {
    emailPlaceholder: string;
    goLabel: string;
    sendingLabel: string;
    notifySuccess: string;
    notifyError: string;
  };
  products: {
    pulsegate: ProductCopy;
    alibi: ProductCopy;
    jellycut: ProductCopy;
    coparents: ProductCopy;
  };
  appBanner: {
    ariaLabel: string;
    /** Button, wenn die App schon im Store ist. */
    open: string;
    /** Zeile unter dem Namen, wenn die App noch nicht im Store ist. */
    soon: string;
    /** Button, wenn die App noch nicht im Store ist (führt zur Produktseite). */
    see: string;
    close: string;
    /** Zeile unter dem Namen, wenn die App im Store ist. */
    store: string;
  };
  hackathons: {
    ariaLabel: string;
    titlePre: string;
    titleEmphasis: string;
    tagline: string;
    projects: readonly HackathonCopy[];
  };
  about: {
    ariaLabel: string;
    kicker: string;
    titlePre: string;
    titleEmphasis: string;
    titlePost: string;
    lead: string;
    portraitAlt: string;
    /** Hinweis unter dem ziehbaren Porträt, verschwindet nach dem ersten Griff. */
    hint: string;
    facts: readonly { label: string; text: string }[];
    chips: readonly string[];
  };
  work: {
    ariaLabel: string;
    kicker: string;
    titlePre: string;
    titleEmphasis: string;
    lead: string;
    proofLabel: string;
    tiers: readonly WorkTierCopy[];
  };
  book: {
    ariaLabel: string;
    kicker: string;
    titlePre: string;
    titleEmphasis: string;
    tagline: string;
    coverAlt: string;
    coverCaption: string;
    backCoverAlt: string;
    backCoverCaption: string;
    lightboxClose: string;
    buyLabel: string;
    moreLabel: string;
  };
  arrival: {
    kicker: string;
    heading: string;
    sub: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitIdle: string;
      submitSending: string;
      success: string;
      error: string;
    };
    plaque: {
      label: string;
      bio: string;
      meta: string;
      linkedinLabel: string;
      imprintLabel: string;
      privacyLabel: string;
    };
    back: string;
  };
}

const de: Content = {
  meta: {
    title: "Werle Technologies — Apps, Spiele und ein Buch aus Minden",
    description:
      "Pulse Gate: Echo Shift, Das Verhör und JellyCut im App Store. Dazu coParents in Entwicklung und das Buch „Bechterew unter Kontrolle“. Patrick Werle.",
  },
  languageSwitch: {
    label: "EN",
    ariaLabel: "Auf Englisch wechseln",
    href: "/en",
  },
  hero: {
    kicker: "Minden · Remote",
    headline: "Werle Technologies",
    tagPrefix: "Drei Spiele, eine App und ein Buch — ",
    tagEmphasis: "zum Anfassen",
    tagSuffix: ", nicht nur zum Ansehen.",
    scrollHint: "Scroll, um zu erkunden",
    soundOn: "Ton stumm schalten",
    soundOff: "Ton aktivieren",
  },
  nav: {
    ariaLabel: "Abschnitts-Navigation",
    hero: "Zu: Start",
    pulsegate: "Zu: Pulse Gate",
    alibi: "Zu: Das Verhör",
    jellycut: "Zu: JellyCut",
    coparents: "Zu: coParents",
    hackathons: "Zu: Referenz- und Hackathon-Projekte",
    "ueber-mich": "Zu: Über mich",
    arbeiten: "Zu: Mit mir arbeiten",
    buch: "Zu: Buch",
    kontakt: "Zu: Kontakt / Ankunft",
  },
  bootup: {
    loadingLabel: "> Assets werden geladen…",
    lines: [
      "> Sternenkarte wird geladen…",
      "> Kurs berechnet.",
      "> Verbindung stabil.",
    ],
  },
  rotateHint: {
    textPre: "Für das beste Erlebnis: Gerät ins ",
    textEmphasis: "Querformat",
    textPost: " drehen.",
    dismiss: "Trotzdem fortfahren",
  },
  productCard: {
    emailPlaceholder: "du@beispiel.de",
    goLabel: "Los",
    sendingLabel: "…",
    notifySuccess: "Danke, melde mich!",
    notifyError: "Hat nicht geklappt — nochmal versuchen.",
  },
  products: {
    pulsegate: {
      status: "Live im App Store",
      titlePrefix: "Pulse Gate: ",
      titleEmphasis: "Echo Shift",
      ariaLabel: "Pulse Gate: Echo Shift — pulsegate.werle.app",
      description:
        "Ein Antippen legt den Anchor-Winkel fest, der Puls expandiert kreisförmig — die Kollision entscheidet sich am Winkel gegen die Gates. Antizipatives Timing statt direktem Treffen, 200 Level.",
      ctaLabel: "pulsegate.werle.app",
      media: {
        main: "Pulse Gate: Echo Shift — Hauptmenü, dunkles Theme mit Cyan-Akzent",
        secondary: "Pulse Gate Gameplay — die Puls-Ring-Mechanik gegen ein Gate",
      },
    },
    alibi: {
      status: "Live im App Store",
      titlePrefix: "Das Verhör",
      ariaLabel: "Das Verhör — verhoer.werle.app",
      description:
        "Ein Fall pro Tag, weltweit derselbe. Drei Verdächtige, vierzehn Fragen Budget — die Anklage braucht den Täter und den einen Widerspruch, der ihn überführt.",
      ctaLabel: "verhoer.werle.app",
      media: {
        main: "Das Verhör — Fall-Illustration, Tuschezeichnung mit blauer Aquarellwäsche auf cremefarbenem Papier",
        secondary: "Verdächtigen-Porträt im Illustrationsstil von Das Verhör",
      },
    },
    jellycut: {
      status: "Live im App Store",
      titlePrefix: "JellyCut",
      ariaLabel: "JellyCut — jellycut.werle.app",
      description:
        "Sechs Früchte aus Wackelpudding, ein Stahlmesser. Greifen, ziehen, schneiden — jedes Stück wackelt für sich weiter. Drei Minuten gratis, dann ein kleiner Einmalkauf. Keine Werbung.",
      ctaLabel: "jellycut.werle.app",
      media: {
        main: "JellyCut — eine Melonenscheibe aus Wackelpudding auf einem hellen Teller",
        secondary: "JellyCut — die Melone in Stücke geschnitten",
      },
    },
    coparents: {
      status: "In Entwicklung",
      titlePrefix: "coParents",
      ariaLabel: "coParents — in Entwicklung — co.parents.software",
      description:
        "Wechselkalender mit farbcodierten Tagen, Ausgaben-Splitting, Übergabe-Koordination und Chat — für Eltern, die gemeinsam ein Kind großziehen, auch getrennt.",
      ctaLabel: "co.parents.software",
      media: {
        main: "coParents — Wechselkalender mit farbcodierten Tagen und Übergabe-Countdown",
        secondary: "coParents — Übersichts-Screen",
        icon: "coParents App-Icon — zwei überlappende Kreise",
      },
      notifyLabel: "Bescheid sagen, wenn's da ist",
      notifyAriaLabel: "Benachrichtigung, wenn coParents verfügbar ist",
    },
  },
  appBanner: {
    ariaLabel: "App Store",
    open: "Laden",
    soon: "Bald im App Store",
    see: "Ansehen",
    close: "Schließen",
    store: "Im App Store",
  },
  hackathons: {
    ariaLabel: "Referenz- und Hackathon-Projekte",
    titlePre: "Regeln in ",
    titleEmphasis: "Code",
    tagline: "Referenz- und Hackathon-Projekte mit einem Muster: feste Regeln entscheiden, jeder Schritt lässt sich prüfen.",
    projects: [
      {
        id: "recourse",
        status: "Eingereicht · PayPal AI Hackathon",
        title: "Recourse",
        description:
          "Käuferschutz für KI-Agenten. Der Agent zahlt über PayPal und prüft jede Lieferung, bevor das Sprachmodell sie zu sehen bekommt. Liefert ein Anbieter nur einen Teaser, tauscht er den Inhalt aus oder versteckt er Anweisungen an den Agenten, kommt das Geld als echte PayPal-Erstattung zurück. Das Modell urteilt, der Code entscheidet.",
        imageAlt: "Recourse-Konsole: ein gekaufter Blogpost mit versteckten Anweisungen an den Agenten, markiert als in Quarantäne und erstattet",
        links: [{ label: "Video", href: "https://www.youtube.com/watch?v=OES6Zh4mUBM" }, { label: "Code", href: "https://github.com/OnePieceMonkey/recourse" }, { label: "Live-Demo", href: "https://recourse-268830318991.europe-west1.run.app" }],
      },
      {
        id: "verdict",
        status: "Eingereicht · Nebius × NVIDIA AI Hackathon",
        title: "Verdict",
        description:
          "Aus einer PDF-Rechnung wird eine gültige XRechnung. Nemotron liest die Rechnung und belegt jedes Feld mit einem Zitat von der Seite. Beträge rechnet der Code, und der offizielle KoSIT-Validator entscheidet, ob die Rechnung rausgeht. Im verdeckten Test waren alle Summen in den 14 gültigen Rechnungen korrekt. Das Modell schreibt nie XML und rechnet nie.",
        imageAlt: "Verdict: eine geprüfte Rechnung mit Stempel „Verified“ vom KoSIT-Validator, daneben der Laufzettel mit jedem Prüfschritt",
        links: [{ label: "Video", href: "https://www.youtube.com/watch?v=70ZLlFSrppc" }, { label: "Code", href: "https://github.com/OnePieceMonkey/Verdict" }, { label: "Live-Demo", href: "https://verdict-678224659019.europe-west1.run.app" }],
      },
      {
        id: "vermerk",
        status: "Referenzprojekt · 2026",
        title: "Vermerk",
        description:
          "Nachweis für die KI-Kennzeichnung nach Art. 50 KI-VO. Feste Regeln entscheiden je Bild, ob und wie es gekennzeichnet werden muss. Vermerk setzt das EU-Icon und schreibt jede Entscheidung in eine Kette mit Zeitstempel, die jeder offline nachrechnen kann. 18 Regeln, 49 Prüffälle, über 370 Tests. Kein kommerzielles Angebot.",
        imageAlt: "Vermerk: erste Seite eines Nachweis-Berichts zur KI-Kennzeichnung, daneben der Befehl, mit dem sich die Kette offline prüfen lässt",
        links: [{ label: "Projektseite", href: "https://vermerk.werle.app/#projekt" }, { label: "So funktioniert es", href: "https://vermerk.werle.app/so-funktioniert-es" }, { label: "Beispiel-Nachweis", href: "https://vermerk.werle.app/beispiele/audit-beispiel.pdf" }],
      },
    ],
  },
  about: {
    ariaLabel: "Über mich",
    kicker: "Über mich",
    titlePre: "Ich übersetze zwischen ",
    titleEmphasis: "Fach",
    titlePost: " und Software.",
    lead: "Über 15 Jahre Zahntechnik mit digitalen Abläufen: CAD/CAM, Intraoralscan, 3D-Druck. Seit ein paar Jahren baue ich die Software dazu. Mein Muster: ein Regelwerk, das Menschen fehleranfällig von Hand anwenden, wird zu Code, den man prüfen kann.",
    portraitAlt: "Porträt von Patrick Werle",
    hint: "↖ zieh mal am Gesicht",
    facts: [
      { label: "Labrechner:", text: "BEL II und BEB '97 vollständig in Code, GoBD-konform, Pentest bestanden. 2026 übergeben." },
      { label: "Eigene Apps im App Store:", text: "Das Verhör, JellyCut, Pulse Gate. Dazu ein Sachbuch im Selbstverlag." },
      { label: "KI mit Leitplanke:", text: "Die KI schlägt vor, ein Regelwerk entscheidet. So gebaut in Verdict und Recourse." },
    ],
    chips: ["68k Zeilen Code", "510+ Tests", "Pentest bestanden", "Remote · Raum Minden"],
  },
  work: {
    ariaLabel: "Mit mir arbeiten",
    kicker: "Mit mir arbeiten",
    titlePre: "Drei Wege, ",
    titleEmphasis: "such dir einen aus",
    lead: "Ich verkaufe keine Werkzeuge, ich verkaufe Urteil: was sich zu bauen lohnt, wann die KI falsch liegt und wie man es sicher ausliefert.",
    proofLabel: "Beleg:",
    tiers: [
      {
        id: "projekt",
        tag: "Projekt",
        title: "Regelwerk → Software",
        audience: "Für Firmen mit einer Gebührenordnung, Norm oder Prüfliste",
        terms: "Festpreis nach Erstgespräch",
        points: ["Regelwerk in prüfbaren Code übersetzen", "Tests gegen echte Fälle, nicht gegen Annahmen", "Übergabe mit Doku, dein Team kann weiterbauen"],
        proof: "Labrechner, BEL II + BEB '97 in Code",
        cta: "Projekt anfragen",
      },
      {
        id: "teilzeit",
        tag: "Teilzeit",
        title: "Übersetzer im Team",
        audience: "Für Dental-, Medtech- und KI-Firmen",
        terms: "1–2 Tage pro Woche · Tagessatz auf Anfrage",
        points: ["Zwischen Fachabteilung und Entwicklung vermitteln", "KI-Ergebnisse prüfen, bevor sie zum Kunden gehen", "Monatlich kündbar"],
        proof: "Verdict und Recourse, KI mit Regelwerk-Prüfung",
        cta: "Gespräch vereinbaren",
        isMain: true,
      },
      {
        id: "festanstellung",
        tag: "Festanstellung",
        title: "Key Account / Trainer",
        audience: "Für Hersteller im Dentalmarkt",
        terms: "Remote · zeitnah verfügbar",
        points: ["15+ Jahre Laborpraxis, digitale Workflows", "Spricht Labor und spricht Software", "Remote, Reisen nach Absprache"],
        proof: "Lebenslauf als PDF",
        cta: "Lebenslauf anfordern",
      },
    ],
  },
  book: {
    ariaLabel: "Bechterew unter Kontrolle — Buchcover und Rückseite",
    kicker: "Buch",
    titlePre: "Bechterew ",
    titleEmphasis: "unter Kontrolle",
    tagline: "Mein Weg durch 20 Jahre Morbus Bechterew.",
    coverAlt: "Buchcover — Bechterew unter Kontrolle",
    coverCaption: "Cover",
    backCoverAlt: "Buchrückseite mit Beschreibung, Zitat und Autoren-Biografie",
    backCoverCaption: "Rückseite — anklicken zum Vergrößern",
    lightboxClose: "Schließen",
    buyLabel: "Erhältlich bei",
    moreLabel: "Mehr zum Buch: Aufbau, Rezepte, Autoren",
  },
  arrival: {
    kicker: "Ankunft · Kontrollpult",
    heading: "Kontakt aufnehmen",
    sub: "Frage, Idee oder Zusammenarbeit — eine Nachricht genügt, ich melde mich zurück.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Wie heißt du?",
      emailLabel: "E-Mail",
      emailPlaceholder: "du@beispiel.de",
      messageLabel: "Nachricht",
      messagePlaceholder: "Worum geht's?",
      submitIdle: "Nachricht senden",
      submitSending: "Sende…",
      success: "Danke, melde mich!",
      error: "Senden hat nicht geklappt — bitte gleich nochmal versuchen.",
    },
    plaque: {
      label: "Betreiber",
      bio: "Patrick Werle — Software zwischen Fachdomäne und Code.",
      meta: "Minden · Remote",
      linkedinLabel: "LinkedIn ↗",
      imprintLabel: "Impressum",
      privacyLabel: "Datenschutz",
    },
    back: "Zurück zur Startrampe",
  },
};

const en: Content = {
  meta: {
    title: "Werle Technologies — Apps, games and a book from Minden",
    description:
      "Pulse Gate: Echo Shift, Das Verhör and JellyCut on the App Store. Plus coParents in development and the book “Bechterew unter Kontrolle”. By Patrick Werle.",
  },
  languageSwitch: {
    label: "DE",
    ariaLabel: "Switch to German",
    href: "/",
  },
  hero: {
    kicker: "Minden · Remote",
    headline: "Werle Technologies",
    tagPrefix: "Three games, an app and a book — ",
    tagEmphasis: "made to actually use",
    tagSuffix: ", not just look at.",
    scrollHint: "Scroll to explore",
    soundOn: "Mute sound",
    soundOff: "Enable sound",
  },
  nav: {
    ariaLabel: "Section navigation",
    hero: "Go to: Start",
    pulsegate: "Go to: Pulse Gate",
    alibi: "Go to: Das Verhör",
    jellycut: "Go to: JellyCut",
    coparents: "Go to: coParents",
    hackathons: "Go to: Reference and hackathon projects",
    "ueber-mich": "Go to: About me",
    arbeiten: "Go to: Work with me",
    buch: "Go to: Book",
    kontakt: "Go to: Contact / Arrival",
  },
  bootup: {
    loadingLabel: "> Loading assets…",
    lines: [
      "> Loading star chart…",
      "> Course computed.",
      "> Connection stable.",
    ],
  },
  rotateHint: {
    textPre: "For the best experience: rotate your device to ",
    textEmphasis: "landscape",
    textPost: ".",
    dismiss: "Continue anyway",
  },
  productCard: {
    emailPlaceholder: "you@example.com",
    goLabel: "Go",
    sendingLabel: "…",
    notifySuccess: "Thanks — I'll let you know!",
    notifyError: "Didn't work — please try again.",
  },
  products: {
    pulsegate: {
      status: "Live on the App Store",
      titlePrefix: "Pulse Gate: ",
      titleEmphasis: "Echo Shift",
      ariaLabel: "Pulse Gate: Echo Shift — pulsegate.werle.app",
      description:
        "A tap sets the anchor angle, the pulse expands in a ring — the collision against the gates comes down to that angle. Anticipatory timing instead of a direct hit, across 200 levels.",
      ctaLabel: "pulsegate.werle.app",
      media: {
        main: "Pulse Gate: Echo Shift — main menu, dark theme with cyan accent",
        secondary: "Pulse Gate gameplay — the pulse-ring mechanic against a gate",
      },
    },
    alibi: {
      status: "Live on the App Store",
      titlePrefix: "Das Verhör",
      ariaLabel: "Das Verhör — verhoer.werle.app",
      description:
        "One case a day, the same one worldwide. Three suspects, a budget of fourteen questions — the prosecution needs the culprit and the one contradiction that convicts them. The game is in German.",
      ctaLabel: "verhoer.werle.app",
      media: {
        main: "Das Verhör case illustration — ink drawing with a blue watercolor wash on cream paper",
        secondary: "Suspect portrait in the illustration style of Das Verhör",
      },
    },
    jellycut: {
      status: "Live on the App Store",
      titlePrefix: "JellyCut",
      ariaLabel: "JellyCut — jellycut.werle.app",
      description:
        "Six jelly fruits, one steel knife. Grab, stretch, slice — every piece keeps wobbling on its own. Three minutes free, then one small purchase. No ads.",
      ctaLabel: "jellycut.werle.app",
      media: {
        main: "JellyCut — a wedge of jelly melon on a light plate",
        secondary: "JellyCut — the melon sliced into pieces",
      },
    },
    coparents: {
      status: "In development",
      titlePrefix: "coParents",
      ariaLabel: "coParents — in development — co.parents.software",
      description:
        "Custody calendar with color-coded days, expense splitting, handover coordination and chat — for parents raising a child together, even apart.",
      ctaLabel: "co.parents.software",
      media: {
        main: "coParents — custody calendar with color-coded days and handover countdown",
        secondary: "coParents — overview screen",
        icon: "coParents app icon — two overlapping circles",
      },
      notifyLabel: "Let me know when it's ready",
      notifyAriaLabel: "Get notified when coParents is available",
    },
  },
  appBanner: {
    ariaLabel: "App Store",
    open: "Get",
    soon: "Coming soon to the App Store",
    see: "View",
    close: "Close",
    store: "On the App Store",
  },
  hackathons: {
    ariaLabel: "Reference and hackathon projects",
    titlePre: "Rules into ",
    titleEmphasis: "code",
    tagline: "Reference and hackathon projects with one pattern: fixed rules decide, every step can be checked.",
    projects: [
      {
        id: "recourse",
        status: "Submitted · PayPal AI Hackathon",
        title: "Recourse",
        description:
          "Buyer protection for AI agents. The agent pays via PayPal and checks every delivery before the language model sees it. If a seller ships a teaser, swaps the content or hides instructions aimed at the agent, the money comes back as a real PayPal refund. The model judges, code decides.",
        imageAlt: "Recourse console: a purchased blog post with hidden instructions aimed at the agent, flagged as quarantined and refunded",
        links: [{ label: "Video", href: "https://www.youtube.com/watch?v=OES6Zh4mUBM" }, { label: "Code", href: "https://github.com/OnePieceMonkey/recourse" }, { label: "Live demo", href: "https://recourse-268830318991.europe-west1.run.app" }],
      },
      {
        id: "verdict",
        status: "Submitted · Nebius × NVIDIA AI Hackathon",
        title: "Verdict",
        description:
          "Turns a PDF invoice into a valid XRechnung. Nemotron reads the invoice and backs every field with a quote from the page. Code computes the amounts, and the official KoSIT validator decides whether the invoice goes out. In the held-out test, all totals were correct in the 14 valid invoices. The model never writes XML and never does arithmetic.",
        imageAlt: "Verdict: a checked invoice stamped “Verified” by the KoSIT validator, next to the routing slip with every check step",
        links: [{ label: "Video", href: "https://www.youtube.com/watch?v=70ZLlFSrppc" }, { label: "Code", href: "https://github.com/OnePieceMonkey/Verdict" }, { label: "Live demo", href: "https://verdict-678224659019.europe-west1.run.app" }],
      },
      {
        id: "vermerk",
        status: "Reference project · 2026",
        title: "Vermerk",
        description:
          "Proof for AI labelling under Art. 50 of the EU AI Act. Fixed rules decide per image whether and how it must be labelled. Vermerk applies the EU icon and writes every decision into a time-stamped chain that anyone can recompute offline. 18 rules, 49 test cases, more than 370 tests. Not a commercial offer.",
        imageAlt: "Vermerk: first page of an AI-labelling proof report, next to the command that checks the chain offline",
        links: [{ label: "Project page (German)", href: "https://vermerk.werle.app/#projekt" }, { label: "How it works", href: "https://vermerk.werle.app/so-funktioniert-es" }, { label: "Sample report", href: "https://vermerk.werle.app/beispiele/audit-beispiel.pdf" }],
      },
    ],
  },
  about: {
    ariaLabel: "About me",
    kicker: "About me",
    titlePre: "I translate between ",
    titleEmphasis: "domain",
    titlePost: " and software.",
    lead: "More than 15 years of dental technology with digital workflows: CAD/CAM, intraoral scanning, 3D printing. For a few years now I have been building the software for it. My pattern: a rulebook that people apply by hand, with errors, becomes code you can check.",
    portraitAlt: "Portrait of Patrick Werle",
    hint: "↖ go on, pull the face",
    facts: [
      { label: "Labrechner:", text: "Germany's dental fee schedules BEL II and BEB '97 fully in code, GoBD-compliant, passed a pentest. Handed over in 2026." },
      { label: "Own apps on the App Store:", text: "Das Verhör, JellyCut, Pulse Gate. Plus a self-published non-fiction book." },
      { label: "AI with guardrails:", text: "The AI proposes, a rulebook decides. Built that way in Verdict and Recourse." },
    ],
    chips: ["68k lines of code", "510+ tests", "Pentest passed", "Remote · near Minden, Germany"],
  },
  work: {
    ariaLabel: "Work with me",
    kicker: "Work with me",
    titlePre: "Three ways, ",
    titleEmphasis: "pick one",
    lead: "I don't sell tools, I sell judgment: what is worth building, when the AI is wrong and how to ship it safely.",
    proofLabel: "Proof:",
    tiers: [
      {
        id: "projekt",
        tag: "Project",
        title: "Rulebook → software",
        audience: "For companies with a fee schedule, standard or checklist",
        terms: "Fixed price after a first call",
        points: ["Turn the rulebook into code you can check", "Tests against real cases, not assumptions", "Handover with docs, your team can build on it"],
        proof: "Labrechner, BEL II + BEB '97 in code",
        cta: "Ask about a project",
      },
      {
        id: "teilzeit",
        tag: "Part-time",
        title: "Translator in your team",
        audience: "For dental, medtech and AI companies",
        terms: "1–2 days a week · day rate on request",
        points: ["Bridge the domain team and engineering", "Check AI output before it reaches customers", "Cancel monthly"],
        proof: "Verdict and Recourse, AI checked by a rulebook",
        cta: "Book a call",
        isMain: true,
      },
      {
        id: "festanstellung",
        tag: "Employment",
        title: "Key account / trainer",
        audience: "For manufacturers in the dental market",
        terms: "Remote · available soon",
        points: ["15+ years of lab practice, digital workflows", "Speaks lab and speaks software", "Remote, travel by arrangement"],
        proof: "CV as PDF",
        cta: "Request my CV",
      },
    ],
  },
  book: {
    ariaLabel: "Bechterew unter Kontrolle — book cover and back cover",
    kicker: "Book",
    titlePre: "Bechterew ",
    titleEmphasis: "unter Kontrolle",
    tagline:
      "My journey through 20 years of Bechterew's disease (ankylosing spondylitis).",
    coverAlt: "Book cover — Bechterew unter Kontrolle",
    coverCaption: "Cover",
    backCoverAlt: "Back cover with description, quote, and author bio",
    backCoverCaption: "Back cover — click to enlarge",
    lightboxClose: "Close",
    buyLabel: "Available at",
    moreLabel: "More about the book (in German)",
  },
  arrival: {
    kicker: "Arrival · Control Panel",
    heading: "Get in touch",
    sub: "Question, idea, or collaboration — one message is enough, I'll get back to you.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "What's your name?",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "What's this about?",
      submitIdle: "Send message",
      submitSending: "Sending…",
      success: "Thanks — I'll be in touch!",
      error: "Sending didn't work — please try again in a moment.",
    },
    plaque: {
      label: "Operator",
      bio: "Patrick Werle — software between domain expertise and code.",
      meta: "Minden · Remote",
      linkedinLabel: "LinkedIn ↗",
      imprintLabel: "Legal Notice",
      privacyLabel: "Privacy Policy",
    },
    back: "Back to the launch pad",
  },
};

export const content: Record<Locale, Content> = { de, en };
