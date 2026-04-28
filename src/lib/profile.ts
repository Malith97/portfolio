import type { Language } from "@/lib/i18n";

export interface LocalizedText {
  eng: string;
  fi: string;
}

export function getLocalizedText(text: LocalizedText, language: Language): string {
  return language === "fi" ? text.fi : text.eng;
}

function parsePeriod(period: string): { start: number; end: number } {
  const normalized = period.toLowerCase();
  const yearMatches = normalized.match(/\d{4}/g) ?? [];
  const years = yearMatches.map((year) => Number(year));

  if (years.length === 0) {
    return { start: 0, end: 0 };
  }

  const start = years[0];
  let end = years.length > 1 ? years[1] : years[0];

  if (normalized.includes("now") || normalized.includes("present") || normalized.includes("current")) {
    end = 9999;
  }

  return { start, end };
}

export function sortExperienceByMostRecent<T extends { period: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const left = parsePeriod(a.period);
    const right = parsePeriod(b.period);

    if (right.end !== left.end) {
      return right.end - left.end;
    }

    if (right.start !== left.start) {
      return right.start - left.start;
    }

    return 0;
  });
}

export interface ExperienceItem {
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  kind: "work" | "education";
  summary: LocalizedText;
  impactBullets: LocalizedText[];
  tech: string[];
}

export interface CredentialItem {
  name: string;
  provider: string;
  issuer: string;
  icon?: string;
  status?: "active" | "expired";
}

export interface ToolCategory {
  label: LocalizedText;
  tools: string[];
}

export interface CredibilityStat {
  value: string;
  label: LocalizedText;
}

export const experienceTimeline: ExperienceItem[] = [
  {
    role: "Software Engineer",
    company: "SY Labs Sri Lanka",
    companyLogo: "/logos/sylabs.png",
    period: "2019–2021",
    kind: "work",
    summary: {
      eng: "Built backend and integration features while improving release quality and deployment consistency.",
      fi: "Rakensin backend- ja integraatio-ominaisuuksia sekä paransin julkaisujen laatua ja käyttöönottojen tasaisuutta."
    },
    impactBullets: [
      {
        eng: "Reduced release friction with repeatable runbooks and better handoffs.",
        fi: "Vähensin julkaisujen kitkaa toistettavilla runbookeilla ja selkeämmillä luovutuksilla."
      },
      {
        eng: "Created a practical base for moving deeper into DevOps work.",
        fi: "Loin käytännöllisen perustan syvemmälle DevOps-työlle."
      }
    ],
    tech: ["Java", "CI Pipelines", "Git", "Issue Tracking"]
  },
  {
    role: "High School",
    company: "Royal College Colombo",
    period: "2003–2016",
    kind: "education",
    summary: {
      eng: "Completed secondary education with a strong academic base in mathematics and science.",
      fi: "Suoritti toisen asteen koulutuksen vahvalla matematiikan ja luonnontieteiden perustalla."
    },
    impactBullets: [
      {
        eng: "Built the early foundation for engineering and analytical thinking.",
        fi: "Loi varhaisen perustan insinööri- ja analyyttiselle ajattelulle."
      }
    ],
    tech: ["Academic Foundation"]
  },
  {
    role: "BSc Computer Science",
    company: "General Sir John Kotelawala Defence University",
    period: "2021",
    kind: "education",
    summary: {
      eng: "Completed core software engineering, systems, and algorithm studies with project-based collaboration.",
      fi: "Suoritin ohjelmistotekniikan, järjestelmien ja algoritmien ydinkokonaisuudet projektipohjaisella yhteistyöllä."
    },
    impactBullets: [
      {
        eng: "Strengthened structured problem-solving and software design fundamentals.",
        fi: "Vahvisti systemaattista ongelmanratkaisua ja ohjelmistosuunnittelun perusteita."
      }
    ],
    tech: ["Computer Science Fundamentals", "Software Design", "Team Projects"]
  },
  {
    role: "DevOps Engineer",
    company: "Zebra Technologies Sri Lanka",
    companyLogo: "/logos/zebra-technologies.png",
    period: "2022–2023",
    kind: "work",
    summary: {
      eng: "Modernized CI/CD workflows and environment consistency to deliver faster with less risk.",
      fi: "Modernisoin CI/CD-työnkulkuja ja ympäristöjen yhtenäisyyttä, jotta toimitukset nopeutuivat pienemmällä riskillä."
    },
    impactBullets: [
      {
        eng: "Standardized release workflows across services and reduced release errors.",
        fi: "Standardoin palvelujen julkaisuprosesseja ja vähensin julkaisuvirheitä."
      },
      {
        eng: "Improved deployment confidence through stronger automation and rollback checks.",
        fi: "Paransin käyttöönottoluottamusta vahvemmalla automaatiolla ja rollback-tarkistuksilla."
      }
    ],
    tech: ["GitHub Actions", "Azure DevOps", "Docker", "Kubernetes"]
  },
  {
    role: "DevOps Engineer",
    company: "London Stock Exchange Group Finland",
    companyLogo: "/logos/london-stock-exchange.png",
    period: "2023–2025",
    kind: "work",
    summary: {
      eng: "Focused on platform reliability, infrastructure automation, and incident readiness in enterprise systems.",
      fi: "Keskityin alustaluotettavuuteen, infrastruktuuriautomaatioon ja incident-valmiuteen enterprise-järjestelmissä."
    },
    impactBullets: [
      {
        eng: "Delivered measurable gains in cost efficiency, uptime, and deployment throughput.",
        fi: "Toin mitattavia parannuksia kustannustehokkuuteen, käytettävyyteen ja julkaisujen läpimenoon."
      },
      {
        eng: "Reduced operational complexity through repeatable tooling and shared practices.",
        fi: "Vähensin operatiivista monimutkaisuutta toistettavilla työkaluilla ja yhteisillä käytännöillä."
      }
    ],
    tech: ["AWS", "Azure", "Terraform", "Kubernetes", "Monitoring Stack"]
  },
  {
    role: "Finnish Language Studies",
    company: "Arffman Oy",
    period: "2025–2026",
    kind: "education",
    summary: {
      eng: "Invested in Finnish communication skills to collaborate effectively across local and international teams.",
      fi: "Panostin suomen kielen viestintätaitoihin, jotta yhteistyö sujuu tehokkaasti paikallisissa ja kansainvälisissä tiimeissä."
    },
    impactBullets: [
      {
        eng: "Improved day-to-day collaboration in Finland-based environments.",
        fi: "Paransi päivittäistä yhteistyötä Suomessa toimivissa ympäristöissä."
      }
    ],
    tech: ["Finnish Language Training", "Communication Practice"]
  }
];

export const certifications: CredentialItem[] = [
  {
    name: "AWS SAA-C03",
    provider: "Amazon Web Services",
    issuer: "AWS",
    icon: "/logos/certs/saa-c03.png",
    status: "active"
  },
  {
    name: "Azure AZ-104",
    provider: "Microsoft Azure",
    issuer: "Azure",
    icon: "/logos/certs/az-104.png",
    status: "active"
  },
  {
    name: "Azure AZ-500",
    provider: "Microsoft Azure",
    issuer: "Azure",
    icon: "/logos/certs/az-500.png",
    status: "active"
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    provider: "Cloud Native Computing Foundation",
    issuer: "CKA",
    icon: "/logos/certs/cka.png",
    status: "expired"
  }
];

export const professionalSummary: LocalizedText[] = [
  {
    eng: "Results-driven DevOps Engineer with 6 years of experience across software development, cloud automation, infrastructure as code, and CI/CD optimization. Experienced in AWS and Azure environments, cloud cost optimization, large-scale migrations, secure platform engineering, and building resilient systems for financial and enterprise teams. Strong hands-on background in Terraform, Ansible, Kubernetes, Helm, Jenkins, GitLab, Docker, Prometheus, Grafana, and Datadog. Known for leading cross-functional teams, mentoring engineers, improving deployment reliability, incident response, system reliability engineering, and delivering business value through automation and continuous improvement.",
    fi: "Results-driven DevOps Engineer with 6 years of experience across software development, cloud automation, infrastructure as code, and CI/CD optimization. Experienced in AWS and Azure environments, cloud cost optimization, large-scale migrations, secure platform engineering, and building resilient systems for financial and enterprise teams. Strong hands-on background in Terraform, Ansible, Kubernetes, Helm, Jenkins, GitLab, Docker, Prometheus, Grafana, and Datadog. Known for leading cross-functional teams, mentoring engineers, improving deployment reliability, incident response, system reliability engineering, and delivering business value through automation and continuous improvement."
  }
];

export const credibilityStats: CredibilityStat[] = [
  {
    value: "6+",
    label: {
      eng: "Years Experience",
      fi: "Vuotta kokemusta"
    }
  },
  {
    value: "2022–Now",
    label: {
      eng: "Cloud / DevOps Focus",
      fi: "Pilvi / DevOps-paino"
    }
  },
  {
    value: String(certifications.length),
    label: {
      eng: "Certifications",
      fi: "Sertifikaatit"
    }
  },
  {
    value: "Finland",
    label: {
      eng: "Location",
      fi: "Sijainti"
    }
  }
];

export const toolCategories: ToolCategory[] = [
  {
    label: { eng: "Cloud", fi: "Pilvi" },
    tools: ["AWS", "Azure", "Oracle Cloud"]
  },
  {
    label: { eng: "CI/CD", fi: "CI/CD" },
    tools: ["GitHub Actions", "Azure DevOps", "GitLab CI", "Jenkins"]
  },
  {
    label: { eng: "Containers", fi: "Kontit" },
    tools: ["Docker", "Kubernetes", "Helm", "EKS"]
  },
  {
    label: { eng: "IaC", fi: "IaC" },
    tools: ["Terraform", "Ansible", "GitOps"]
  },
  {
    label: { eng: "Monitoring", fi: "Valvonta" },
    tools: ["Prometheus", "Grafana", "Datadog", "CloudWatch"]
  },
  {
    label: { eng: "Scripting", fi: "Skriptaus" },
    tools: ["Bash", "Python", "Go", "Rust"]
  },
  {
    label: { eng: "Security", fi: "Tietoturva" },
    tools: ["RBAC", "IAM", "Secrets Management", "Vulnerability Scanning"]
  },
  {
    label: { eng: "OS / Networking", fi: "OS / Verkot" },
    tools: ["Linux", "Nginx", "DNS", "TCP/IP"]
  }
];

export const selectedCaseStudySlugs = [
  "cloud-cost-optimization-reducing-spend-by-35",
  "cicd-modernization-faster-and-safer-deployments",
  "chaos-engineering-for-better-reliability"
] as const;

export const selectedBeyondWorkSlugs = [
  "weekend-sri-lankan-curry",
  "homemade-pasta-night",
  "morning-run-by-the-river"
] as const;
