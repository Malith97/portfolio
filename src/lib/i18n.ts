export type Language = "eng" | "fi";

export const DEFAULT_LANGUAGE: Language = "eng";
export const LANGUAGE_COOKIE_KEY = "portfolio-lang";
export const LANGUAGE_STORAGE_KEY = "portfolio-lang";

export function normalizeLanguage(value: string | null | undefined): Language {
  return value === "fi" ? "fi" : "eng";
}

interface Dictionary {
  nav: {
    home: string;
    experience: string;
    story: string;
    workEducation: string;
    caseStudies: string;
    beyondWork: string;
    certifications: string;
    contact: string;
  };
  language: {
    label: string;
    eng: string;
    fi: string;
  };
  common: {
    viewAll: string;
    viewJournal: string;
    result: string;
    routeSnapshot: string;
    routeScreenshot: string;
    previous: string;
    next: string;
    backToBeyondWork: string;
    backToCaseStudies: string;
    gallery: string;
    story: string;
    availability: string;
    caseStudy: string;
    journal: string;
    kitchenNotes: string;
  };
  footer: {
    builtWithCare: string;
  };
  home: {
    label: string;
    heroTitle: string;
    heroSummary: string;
    heroMeta: string;
    ctaViewWork: string;
    ctaDownloadResume: string;
    impactLabel: string;
    impactTitle: string;
    impactDescription: string;
    certsLabel: string;
    certsTitle: string;
    certified: string;
    selectedWorkLabel: string;
    selectedWorkTitle: string;
    photoNotesLabel: string;
    photoNotesTitle: string;
    metrics: {
      yearsExperience: string;
      cloudCostReduction: string;
      annualCloudSavings: string;
      fasterDeployments: string;
      downtimeReduction: string;
    };
  };
  storyPage: {
    label: string;
    title: string;
    description: string;
  };
  workEducationPage: {
    label: string;
    title: string;
    description: string;
    responsibilities: string;
    outcomes: string;
    tools: string;
  };
  caseStudiesPage: {
    label: string;
    title: string;
    description: string;
    allLabel: string;
  };
  beyondWorkPage: {
    label: string;
    title: string;
    description: string;
    filters: {
      all: string;
      running: string;
      cycling: string;
      swimming: string;
      photography: string;
      videography: string;
      cooking: string;
      other: string;
    };
  };
  beyondWorkDetail: {
    fieldMetadata: string;
    highlights: string;
    category: string;
    date: string;
    location: string;
    route: string;
    distance: string;
    duration: string;
    weather: string;
    difficulty: string;
    gear: string;
    theme: string;
    photos: string;
    cameraGear: string;
    session: string;
    notes: string;
    dishType: string;
    cuisine: string;
    timeSpent: string;
    cookingTime: string;
    whatITried: string;
    whatILearned: string;
    personalNote: string;
    ingredients: string;
    steps: string;
    notesForNextTime: string;
  };
  caseStudyDetail: {
    outcome: string;
    previewNote: string;
  };
  contactPage: {
    label: string;
    title: string;
    description: string;
    introTitle: string;
    introBody: string;
    availability: string;
    availabilityValue: string;
    emailCta: string;
    resumeCta: string;
  };
}

const dictionaries: Record<Language, Dictionary> = {
  eng: {
    nav: {
      home: "Home",
      experience: "Experience",
      story: "Story",
      workEducation: "Work & Education",
      caseStudies: "Case Studies",
      beyondWork: "Beyond Work",
      certifications: "Certifications",
      contact: "Contact"
    },
    language: {
      label: "Language toggle",
      eng: "EN",
      fi: "FI"
    },
    common: {
      viewAll: "View all",
      viewJournal: "View journal",
      result: "Result",
      routeSnapshot: "Route snapshot",
      routeScreenshot: "Route screenshot",
      previous: "Previous",
      next: "Next",
      backToBeyondWork: "Back to Beyond Work",
      backToCaseStudies: "Back to case studies",
      gallery: "Gallery",
      story: "Story",
      availability: "Availability",
      caseStudy: "Case Study",
      journal: "Journal",
      kitchenNotes: "Kitchen Notes"
    },
    footer: {
      builtWithCare: "Built with care in Next.js, TypeScript, and restrained Tailwind."
    },
    home: {
      label: "Home",
      heroTitle: "DevOps Engineer building resilient cloud systems.",
      heroSummary:
        "I design, automate, and operate delivery platforms for teams that need speed, reliability, and control.",
      heroMeta: "Open to EU, Finland, and remote DevOps opportunities",
      ctaViewWork: "View Work",
      ctaDownloadResume: "Contact Me",
      impactLabel: "Impact",
      impactTitle: "Measurable platform outcomes",
      impactDescription:
        "Focused on delivery speed, reliability, and cloud efficiency in enterprise engineering environments.",
      certsLabel: "Certifications",
      certsTitle: "Professional credentials",
      certified: "Certified",
      selectedWorkLabel: "Case Studies",
      selectedWorkTitle: "Selected Work",
      photoNotesLabel: "Beyond Work",
      photoNotesTitle: "Beyond Work",
      metrics: {
        yearsExperience: "Years experience",
        cloudCostReduction: "Cloud cost reduction",
        annualCloudSavings: "Annual cloud savings",
        fasterDeployments: "Faster deployments",
        downtimeReduction: "Downtime reduction"
      }
    },
    storyPage: {
      label: "Story",
      title: "From Sri Lanka to Finland, and from software to systems",
      description:
        "A personal path shaped by curiosity, discipline, and a long-term interest in making technology calmer and more reliable."
    },
    workEducationPage: {
      label: "Work & Education",
      title: "Experience Timeline",
      description:
        "Work and education milestones presented in chronological order with practical context.",
      responsibilities: "Key responsibilities",
      outcomes: "Key outcomes",
      tools: "Tools used"
    },
    caseStudiesPage: {
      label: "Case Studies",
      title: "Selected delivery and reliability work",
      description:
        "Outcome-focused snapshots of cloud optimization, migration, automation, and platform resilience.",
      allLabel: "All case studies"
    },
    beyondWorkPage: {
      label: "Beyond Work",
      title: "Image-focused journal",
      description: "A field journal of activity stories, routes, visual notes, and kitchen notes.",
      filters: {
        all: "All",
        running: "Running",
        cycling: "Cycling",
        swimming: "Swimming",
        photography: "Photography",
        videography: "Videography",
        cooking: "Cooking",
        other: "Other"
      }
    },
    beyondWorkDetail: {
      fieldMetadata: "Field metadata",
      highlights: "Highlights",
      category: "Category",
      date: "Date",
      location: "Location",
      route: "Route",
      distance: "Distance",
      duration: "Duration",
      weather: "Weather",
      difficulty: "Difficulty",
      gear: "Gear",
      theme: "Theme",
      photos: "Photos",
      cameraGear: "Camera / Gear",
      session: "Session",
      notes: "Notes",
      dishType: "Dish Type",
      cuisine: "Cuisine",
      timeSpent: "Time Spent",
      cookingTime: "Cooking Time",
      whatITried: "What I Tried",
      whatILearned: "What I Learned",
      personalNote: "Personal Note",
      ingredients: "Ingredients",
      steps: "Steps",
      notesForNextTime: "Notes for Next Time"
    },
    caseStudyDetail: {
      outcome: "Outcome",
      previewNote:
        "Full long-form write-up is being prepared. This preview focuses on outcome, scope, and core stack signals for faster review."
    },
    contactPage: {
      label: "Contact",
      title: "Simple ways to reach me",
      description:
        "Open to senior DevOps and platform engineering opportunities in the EU and remote environments.",
      introTitle: "Let's build reliable systems together.",
      introBody:
        "I'm currently available for conversations around platform engineering, cloud reliability, delivery automation, and DevOps leadership.",
      availability: "Availability",
      availabilityValue: "Open for interviews",
      emailCta: "Email Me",
      resumeCta: "Download Resume"
    }
  },
  fi: {
    nav: {
      home: "Etusivu",
      experience: "Kokemus",
      story: "Tarina",
      workEducation: "Työ ja koulutus",
      caseStudies: "Tapaustutkimukset",
      beyondWork: "Työn ulkopuolella",
      certifications: "Sertifikaatit",
      contact: "Yhteystiedot"
    },
    language: {
      label: "Kielivalinta",
      eng: "EN",
      fi: "FI"
    },
    common: {
      viewAll: "Näytä kaikki",
      viewJournal: "Näytä päiväkirja",
      result: "Tulos",
      routeSnapshot: "Reittinäkymä",
      routeScreenshot: "Reittikuva",
      previous: "Edellinen",
      next: "Seuraava",
      backToBeyondWork: "Takaisin Työn ulkopuolella -sivulle",
      backToCaseStudies: "Takaisin tapaustutkimuksiin",
      gallery: "Galleria",
      story: "Tarina",
      availability: "Saatavuus",
      caseStudy: "Tapaustutkimus",
      journal: "Päiväkirja",
      kitchenNotes: "Keittiömuistiinpanot"
    },
    footer: {
      builtWithCare: "Rakennettu huolellisesti Next.js:llä, TypeScriptillä ja hillityllä Tailwindilla."
    },
    home: {
      label: "Etusivu",
      heroTitle: "DevOps-insinööri, joka rakentaa resilienttejä pilvijärjestelmiä.",
      heroSummary:
        "Suunnittelen, automatisoin ja operoin toimitusalustoja tiimeille, jotka tarvitsevat nopeutta, luotettavuutta ja hallintaa.",
      heroMeta: "Avoin EU-, Suomi- ja etä-DevOps-mahdollisuuksille",
      ctaViewWork: "Näytä työ",
      ctaDownloadResume: "Ota yhteyttä",
      impactLabel: "Vaikutus",
      impactTitle: "Mitattavat alustatulokset",
      impactDescription:
        "Painopiste toimitusnopeudessa, luotettavuudessa ja pilvikustannusten tehokkuudessa enterprise-ympäristöissä.",
      certsLabel: "Sertifikaatit",
      certsTitle: "Ammatilliset sertifikaatit",
      certified: "Sertifioitu",
      selectedWorkLabel: "Tapaustutkimukset",
      selectedWorkTitle: "Valitut työt",
      photoNotesLabel: "Työn ulkopuolella",
      photoNotesTitle: "Työn ulkopuolella",
      metrics: {
        yearsExperience: "Vuotta kokemusta",
        cloudCostReduction: "Pilvikulujen vähennys",
        annualCloudSavings: "Vuotuiset pilvisäästöt",
        fasterDeployments: "Nopeammat julkaisut",
        downtimeReduction: "Vähemmän käyttökatkoja"
      }
    },
    storyPage: {
      label: "Tarina",
      title: "Sri Lankasta Suomeen, ohjelmistosta järjestelmiin",
      description:
        "Henkilökohtainen polku, jota ovat muokanneet uteliaisuus, kurinalaisuus ja halu tehdä teknologiasta rauhallisempaa ja luotettavampaa."
    },
    workEducationPage: {
      label: "Työ ja koulutus",
      title: "Kokemuksen aikajana",
      description:
        "Työ- ja koulutusvaiheet kronologisesti esitettynä käytännön kontekstilla.",
      responsibilities: "Keskeiset vastuut",
      outcomes: "Keskeiset tulokset",
      tools: "Käytetyt työkalut"
    },
    caseStudiesPage: {
      label: "Tapaustutkimukset",
      title: "Valittuja toimitus- ja luotettavuustöitä",
      description:
        "Tulospainotteiset katsaukset pilvioptimoinnista, migraatiosta, automaatiosta ja alustan luotettavuudesta.",
      allLabel: "Kaikki tapaustutkimukset"
    },
    beyondWorkPage: {
      label: "Työn ulkopuolella",
      title: "Kuvapainotteinen päiväkirja",
      description: "Kenttäpäiväkirja aktiviteeteista, reiteistä, visuaalisista ja keittiömuistiinpanoista.",
      filters: {
        all: "Kaikki",
        running: "Juoksu",
        cycling: "Pyöräily",
        swimming: "Uinti",
        photography: "Valokuvaus",
        videography: "Videokuvaus",
        cooking: "Ruoanlaitto",
        other: "Muu"
      }
    },
    beyondWorkDetail: {
      fieldMetadata: "Kenttämetadata",
      highlights: "Kohokohdat",
      category: "Kategoria",
      date: "Päivämäärä",
      location: "Sijainti",
      route: "Reitti",
      distance: "Matka",
      duration: "Kesto",
      weather: "Sää",
      difficulty: "Vaikeus",
      gear: "Varusteet",
      theme: "Teema",
      photos: "Kuvat",
      cameraGear: "Kamera / Varusteet",
      session: "Harjoitus",
      notes: "Muistiinpanot",
      dishType: "Ruoan tyyppi",
      cuisine: "Keittiö",
      timeSpent: "Käytetty aika",
      cookingTime: "Kypsennysaika",
      whatITried: "Mitä kokeilin",
      whatILearned: "Mitä opin",
      personalNote: "Henkilökohtainen muistiinpano",
      ingredients: "Ainekset",
      steps: "Vaiheet",
      notesForNextTime: "Muistiinpanot seuraavaa kertaa varten"
    },
    caseStudyDetail: {
      outcome: "Tulos",
      previewNote:
        "Täysi pitkä kirjoitus on valmisteilla. Tämä esikatselu keskittyy tuloksiin, laajuuteen ja ydinteknologiaan nopeaa arviointia varten."
    },
    contactPage: {
      label: "Yhteystiedot",
      title: "Yksinkertaiset tavat tavoittaa minut",
      description:
        "Avoin keskusteluille senior-tason DevOps- ja platform engineering -rooleista EU:ssa ja etätyössä.",
      introTitle: "Rakennetaan yhdessä luotettavia järjestelmiä.",
      introBody:
        "Olen tällä hetkellä avoin keskusteluille platform engineeringistä, pilviluotettavuudesta, toimitusautomaatiosta ja DevOps-johtamisesta.",
      availability: "Saatavuus",
      availabilityValue: "Avoin haastatteluille",
      emailCta: "Lähetä sähköpostia",
      resumeCta: "Lataa CV"
    }
  }
};

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language];
}
