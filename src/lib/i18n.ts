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
    story: string;
    workEducation: string;
    caseStudies: string;
    beyondWork: string;
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
      story: "Story",
      workEducation: "Work & Education",
      caseStudies: "Case Studies",
      beyondWork: "Beyond Work",
      contact: "Contact"
    },
    language: {
      label: "Language toggle",
      eng: "ENG",
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
      journal: "Journal"
    },
    footer: {
      builtWithCare: "Built with care in Next.js, TypeScript, and restrained Tailwind."
    },
    home: {
      label: "Home",
      heroTitle: "I'm Malith Ileperuma, a DevOps Engineer based in Finland.",
      heroSummary:
        "I build reliable cloud systems, automate delivery pipelines, and help teams reduce operational complexity.",
      heroMeta: "Senior DevOps / Platform Engineer · Finland · Available for EU and remote roles",
      ctaViewWork: "View Work",
      ctaDownloadResume: "Download Resume",
      impactLabel: "Impact",
      impactTitle: "Measurable platform outcomes",
      impactDescription:
        "Focused on delivery speed, reliability, and cloud efficiency in enterprise engineering environments.",
      certsLabel: "Certifications",
      certsTitle: "Professional credentials",
      certified: "Certified",
      selectedWorkLabel: "Case Studies",
      selectedWorkTitle: "Selected work",
      photoNotesLabel: "Beyond Work",
      photoNotesTitle: "Photo Notes",
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
      description: "A field journal of activity stories, routes, and visual notes.",
      filters: {
        all: "All",
        running: "Running",
        cycling: "Cycling",
        swimming: "Swimming",
        photography: "Photography",
        videography: "Videography",
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
      notes: "Notes"
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
      story: "Tarina",
      workEducation: "Työ ja koulutus",
      caseStudies: "Tapaustutkimukset",
      beyondWork: "Työn ulkopuolella",
      contact: "Yhteystiedot"
    },
    language: {
      label: "Kielivalinta",
      eng: "ENG",
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
      journal: "Päiväkirja"
    },
    footer: {
      builtWithCare: "Rakennettu huolellisesti Next.js:llä, TypeScriptillä ja hillityllä Tailwindilla."
    },
    home: {
      label: "Etusivu",
      heroTitle: "Olen Malith Ileperuma, DevOps-insinööri Suomessa.",
      heroSummary:
        "Rakennan luotettavia pilvijärjestelmiä, automatisoin toimitusputkia ja vähennän tiimien operatiivista monimutkaisuutta.",
      heroMeta: "Senior DevOps / Platform Engineer · Suomi · Avoin EU- ja etärooleille",
      ctaViewWork: "Näytä työ",
      ctaDownloadResume: "Lataa CV",
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
      photoNotesTitle: "Kuvamuistiinpanot",
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
      description: "Kenttäpäiväkirja aktiviteeteista, reiteistä ja visuaalisista muistiinpanoista.",
      filters: {
        all: "Kaikki",
        running: "Juoksu",
        cycling: "Pyöräily",
        swimming: "Uinti",
        photography: "Valokuvaus",
        videography: "Videokuvaus",
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
      notes: "Muistiinpanot"
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
