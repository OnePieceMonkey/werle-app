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
        "Ein Antippen legt den Anchor-Winkel fest, der Puls expandiert kreisförmig — die Kollision entscheidet sich am Winkel gegen die Gates. Antizipatives Timing statt direktem Treffen, über 200 Level.",
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
        "A tap sets the anchor angle, the pulse expands in a ring — the collision against the gates comes down to that angle. Anticipatory timing instead of a direct hit, across 200+ levels.",
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
