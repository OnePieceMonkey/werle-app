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
   LabrechnerSection, BookSection, ArrivalSection, ProductCard-interne
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
    coparents: string;
    labrechner: string;
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
    coparents: ProductCopy;
  };
  labrechner: {
    ariaLabel: string;
    kicker: string;
    title: string;
    sub: string;
    bodyPre: string;
    bodyMid: string;
    bodyPost: string;
    stats: {
      locValue: string;
      locLabel: string;
      testsValue: string;
      testsLabel: string;
      findingsValue: string;
      findingsLabelLine1: string;
      findingsLabelLine2: string;
    };
    outlookPre: string;
    outlookEmphasis: string;
    outlookPost: string;
    ctaLabel: string;
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
    title: "Werle Technologies",
    description:
      "Zwei Spiele, eine App und ein Buch — zum Anfassen, nicht nur zum Ansehen.",
  },
  languageSwitch: {
    label: "EN",
    ariaLabel: "Auf Englisch wechseln",
    href: "/en",
  },
  hero: {
    kicker: "Minden · Remote",
    headline: "Werle Technologies",
    tagPrefix: "Zwei Spiele, eine App und ein Buch — ",
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
    alibi: "Zu: ALIBI",
    coparents: "Zu: coParents",
    labrechner: "Zu: Labrechner",
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
      status: "Im App-Store-Review",
      titlePrefix: "Pulse Gate: ",
      titleEmphasis: "Echo Shift",
      ariaLabel: "Pulse Gate: Echo Shift — pulsegate.werle.app",
      description:
        "Ein Antippen legt den Anchor-Winkel fest, der Puls expandiert kreisförmig — die Kollision entscheidet sich am Winkel gegen die Gates. Antizipatives Timing statt direktem Treffen, über 200 Level.",
      ctaLabel: "pulsegate.werle.app",
      media: {
        main: "Pulse Gate: Echo Shift — Hauptmenü, dunkles Theme mit Cyan-Akzent",
        secondary: "Pulse Gate Gameplay — die Puls-Ring-Mechanik gegen ein Gate",
      },
    },
    alibi: {
      status: "In Entwicklung",
      titlePrefix: "ALIBI — ",
      titleEmphasis: "Das Verhör",
      ariaLabel: "ALIBI — Das Verhör — verhoer.werle.app",
      description:
        "Ein Fall pro Tag, weltweit derselbe. Drei Verdächtige, vierzehn Fragen Budget — die Anklage braucht den Täter und den einen Widerspruch, der ihn überführt.",
      ctaLabel: "verhoer.werle.app",
      media: {
        main: "ALIBI Fall-Illustration — Tuschezeichnung mit blauer Aquarellwäsche auf cremefarbenem Papier",
        secondary: "Verdächtigen-Porträt im ALIBI-Illustrationsstil",
      },
      notifyLabel: "Bescheid sagen, wenn's da ist",
      notifyAriaLabel: "Benachrichtigung, wenn ALIBI verfügbar ist",
    },
    coparents: {
      status: "In Entwicklung",
      titlePrefix: "coParents",
      ariaLabel: "coParents — in Entwicklung, noch kein Store-Eintrag",
      description:
        "Wechselkalender mit farbcodierten Tagen, Ausgaben-Splitting, Übergabe-Koordination und Chat — für Eltern, die gemeinsam ein Kind großziehen, auch getrennt.",
      ctaLabel: "Noch kein Store-Eintrag",
      media: {
        main: "coParents — Wechselkalender mit farbcodierten Tagen und Übergabe-Countdown",
        secondary: "coParents — Übersichts-Screen",
        icon: "coParents App-Icon — zwei überlappende Kreise",
      },
      notifyLabel: "Bescheid sagen, wenn's da ist",
      notifyAriaLabel: "Benachrichtigung, wenn coParents verfügbar ist",
    },
  },
  labrechner: {
    ariaLabel: "Labrechner — DentalBilling Engine",
    kicker: "Eigenständiges Venture · Werle Technologies",
    title: "Labrechner",
    sub: "DentalBilling Engine — die Infrastruktur-Ebene darunter",
    bodyPre: "Die deutschen Abrechnungsregelwerke für Zahntechnik — ",
    bodyMid: " und ",
    bodyPost:
      " — vollständig in Code abgebildet, GoBD-konform und nachvollziehbar bis zur einzelnen Regel. Labrechner ist die Kundenmarke, DentalBilling Engine die B2B-Infrastruktur-Ebene darunter: ein eigenständiges Venture unter Werle Technologies, das unabhängig läuft.",
    stats: {
      locValue: "68.000+",
      locLabel: "Lines of Code",
      testsValue: "510+",
      testsLabel: "Automatisierte Tests",
      findingsValue: "0",
      findingsLabelLine1: "Offene High/Critical Findings",
      findingsLabelLine2: "Pentest, Stand 03/2026",
    },
    outlookPre: "Das Muster dahinter — ",
    outlookEmphasis:
      "komplexe regulierte Fachlogik in auditierbare Software übersetzen",
    outlookPost: " — trägt über die Zahnmedizin hinaus.",
    ctaLabel: "check.labrechner.de",
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
    title: "Werle Technologies",
    description:
      "Two games, an app and a book — made to actually use, not just look at.",
  },
  languageSwitch: {
    label: "DE",
    ariaLabel: "Switch to German",
    href: "/",
  },
  hero: {
    kicker: "Minden · Remote",
    headline: "Werle Technologies",
    tagPrefix: "Two games, an app and a book — ",
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
    alibi: "Go to: ALIBI",
    coparents: "Go to: coParents",
    labrechner: "Go to: Labrechner",
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
      status: "In App Store review",
      titlePrefix: "Pulse Gate: ",
      titleEmphasis: "Echo Shift",
      ariaLabel: "Pulse Gate: Echo Shift — pulsegate.werle.app",
      description:
        "A tap sets the anchor angle, the pulse expands in a ring — the collision against the gates comes down to that angle. Anticipatory timing instead of a direct hit, across 200+ levels.",
      ctaLabel: "pulsegate.werle.app",
      media: {
        main: "Pulse Gate: Echo Shift — main menu, dark theme with cyan accent",
        secondary: "Pulse Gate gameplay — the pulse-ring mechanic against a gate",
      },
    },
    alibi: {
      status: "In development",
      titlePrefix: "ALIBI — ",
      titleEmphasis: "The Interrogation",
      ariaLabel: "ALIBI — The Interrogation — verhoer.werle.app",
      description:
        "One case a day, the same one worldwide. Three suspects, a budget of fourteen questions — the prosecution needs the culprit and the one contradiction that convicts them.",
      ctaLabel: "verhoer.werle.app",
      media: {
        main: "ALIBI case illustration — ink drawing with a blue watercolor wash on cream paper",
        secondary: "Suspect portrait in the ALIBI illustration style",
      },
      notifyLabel: "Let me know when it's ready",
      notifyAriaLabel: "Get notified when ALIBI is available",
    },
    coparents: {
      status: "In development",
      titlePrefix: "coParents",
      ariaLabel: "coParents — in development, no store listing yet",
      description:
        "Custody calendar with color-coded days, expense splitting, handover coordination and chat — for parents raising a child together, even apart.",
      ctaLabel: "No store listing yet",
      media: {
        main: "coParents — custody calendar with color-coded days and handover countdown",
        secondary: "coParents — overview screen",
        icon: "coParents app icon — two overlapping circles",
      },
      notifyLabel: "Let me know when it's ready",
      notifyAriaLabel: "Get notified when coParents is available",
    },
  },
  labrechner: {
    ariaLabel: "Labrechner — DentalBilling Engine",
    kicker: "Independent venture · Werle Technologies",
    title: "Labrechner",
    sub: "DentalBilling Engine — the infrastructure layer underneath",
    bodyPre: "Germany's billing rule sets for dental technology — ",
    bodyMid: " and ",
    bodyPost:
      " — fully modeled in code, GoBD-compliant (audit-proof under German digital bookkeeping rules), and traceable down to the individual rule. Labrechner is the customer-facing brand; DentalBilling Engine is the B2B infrastructure layer underneath it: an independent venture under Werle Technologies, run on its own.",
    stats: {
      locValue: "68,000+",
      locLabel: "Lines of Code",
      testsValue: "510+",
      testsLabel: "Automated Tests",
      findingsValue: "0",
      findingsLabelLine1: "Open High/Critical Findings",
      findingsLabelLine2: "Penetration test, as of 03/2026",
    },
    outlookPre: "The underlying pattern — ",
    outlookEmphasis:
      "translating complex, regulated domain logic into auditable software",
    outlookPost: " — extends well beyond dentistry.",
    ctaLabel: "check.labrechner.de",
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
