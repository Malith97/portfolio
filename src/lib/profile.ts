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
  companyUrl?: string;
  companyLogo?: string;
  period: string;
  kind: "work" | "education";
  summary: LocalizedText;
  impactBullets: LocalizedText[];
  additionalImpactBullets?: LocalizedText[];
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
    role: "DevOps Engineer",
    company: "London Stock Exchange Group Finland",
    companyLogo: "/logos/london-stock-exchange.png",
    period: "2023–2025",
    kind: "work",
    summary: {
      eng: "Owned cloud infrastructure, reliability, and delivery systems for regulated financial platforms across trading and surveillance domains, operating in high-availability environments where system failure directly impacts business operations.",
      fi: "Owned cloud infrastructure, reliability, and delivery systems for regulated financial platforms across trading and surveillance domains, operating in high-availability environments where system failure directly impacts business operations."
    },
    impactBullets: [
      {
        eng: "Reduced cloud costs by 35% (~$75K/year) by introducing governance models and usage controls across multi-account environments.",
        fi: "Reduced cloud costs by 35% (~$75K/year) by introducing governance models and usage controls across multi-account environments."
      },
      {
        eng: "Led migration of regulated workloads from on-prem to cloud, redesigning architecture for isolation, security, and scalability.",
        fi: "Led migration of regulated workloads from on-prem to cloud, redesigning architecture for isolation, security, and scalability."
      },
      {
        eng: "Introduced Chaos Engineering practices to simulate failures and improve resilience, reducing downtime by 20%.",
        fi: "Introduced Chaos Engineering practices to simulate failures and improve resilience, reducing downtime by 20%."
      },
      {
        eng: "Owned end-to-end delivery systems (infrastructure + CI/CD), reducing deployment time by 40% and errors by 35%.",
        fi: "Owned end-to-end delivery systems (infrastructure + CI/CD), reducing deployment time by 40% and errors by 35%."
      },
      {
        eng: "Defined and enforced Kubernetes RBAC and network segmentation for secure multi-team environments.",
        fi: "Defined and enforced Kubernetes RBAC and network segmentation for secure multi-team environments."
      }
    ],
    additionalImpactBullets: [
      {
        eng: "Led incident response, root cause analysis, and reliability improvements across production systems.",
        fi: "Led incident response, root cause analysis, and reliability improvements across production systems."
      },
      {
        eng: "Introduced AI-assisted DevOps automation with governance controls to prevent sensitive data exposure.",
        fi: "Introduced AI-assisted DevOps automation with governance controls to prevent sensitive data exposure."
      }
    ],
    tech: [
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "ArgoCD",
      "Ansible",
      "Terraform",
      "AWS",
      "Azure",
      "Python",
      "Go",
      "Jira",
      "Confluence",
      "Prometheus",
      "Grafana",
      "Datadog",
      "PostgreSQL"
    ]
  },
  {
    role: "DevOps Engineer",
    company: "Zebra Technologies Sri Lanka",
    companyLogo: "/logos/zebra-technologies.png",
    period: "2022–2023",
    kind: "work",
    summary: {
      eng: "Led DevOps transformation for SDK engineering teams, driving cloud migration, delivery standardization, and automation strategy.",
      fi: "Led DevOps transformation for SDK engineering teams, driving cloud migration, delivery standardization, and automation strategy."
    },
    impactBullets: [
      {
        eng: "Built CI/CD pipelines from scratch, reducing deployment time by 50% and improving delivery reliability.",
        fi: "Built CI/CD pipelines from scratch, reducing deployment time by 50% and improving delivery reliability."
      },
      {
        eng: "Led cloud migration to Azure, improving scalability, security, and infrastructure efficiency.",
        fi: "Led cloud migration to Azure, improving scalability, security, and infrastructure efficiency."
      },
      {
        eng: "Increased engineering productivity by 30% through workflow standardization.",
        fi: "Increased engineering productivity by 30% through workflow standardization."
      },
      {
        eng: "Automated testing, reducing QA effort by 40% and accelerating feedback cycles.",
        fi: "Automated testing, reducing QA effort by 40% and accelerating feedback cycles."
      },
      {
        eng: "Reduced operational overhead by 40% via reusable infrastructure and scripting.",
        fi: "Reduced operational overhead by 40% via reusable infrastructure and scripting."
      }
    ],
    additionalImpactBullets: [
      {
        eng: "Improved cross-team delivery (Dev, QA, BA), accelerating release cycles by 15%.",
        fi: "Improved cross-team delivery (Dev, QA, BA), accelerating release cycles by 15%."
      },
      {
        eng: "Reduced issue resolution time by 20% and incident frequency by 25% through improved monitoring and logging.",
        fi: "Reduced issue resolution time by 20% and incident frequency by 25% through improved monitoring and logging."
      }
    ],
    tech: [
      "Jenkins",
      "Docker",
      "Kubernetes",
      "ArgoCD",
      "GitHub Actions",
      "Azure",
      "Python",
      "Shell",
      "Jira",
      "Prometheus",
      "Grafana",
      "MongoDB",
      "PostgreSQL",
      "Selenium"
    ]
  },
  {
    role: "Software Engineer",
    company: "SY Labs Sri Lanka",
    companyLogo: "/logos/sylabs.png",
    period: "2019–2021",
    kind: "work",
    summary: {
      eng: "Built and scaled a production-grade rental platform, combining full-stack engineering with DevOps practices.",
      fi: "Built and scaled a production-grade rental platform, combining full-stack engineering with DevOps practices."
    },
    impactBullets: [
      {
        eng: "Delivered a real-time rental platform with tracking and user management.",
        fi: "Delivered a real-time rental platform with tracking and user management."
      },
      {
        eng: "Built scalable applications using React, Node.js, PostgreSQL.",
        fi: "Built scalable applications using React, Node.js, PostgreSQL."
      },
      {
        eng: "Implemented secure authentication and RBAC systems.",
        fi: "Implemented secure authentication and RBAC systems."
      },
      {
        eng: "Reduced deployment time by 40% via CI/CD automation.",
        fi: "Reduced deployment time by 40% via CI/CD automation."
      },
      {
        eng: "Optimized database performance and system efficiency.",
        fi: "Optimized database performance and system efficiency."
      }
    ],
    additionalImpactBullets: [
      {
        eng: "Applied clean architecture and design principles for scalability.",
        fi: "Applied clean architecture and design principles for scalability."
      }
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Docker", "Jenkins", "AWS", "OAuth2", "JWT"]
  },
  {
    role: "Finnish Language Studies (A1–B2)",
    company: "Arffman Oy",
    companyUrl: "https://www.arffman.fi",
    period: "2025–2026",
    kind: "education",
    summary: {
      eng: "Structured Finnish integration and language studies focused on professional and day-to-day communication.",
      fi: "Structured Finnish integration and language studies focused on professional and day-to-day communication."
    },
    impactBullets: [
      {
        eng: "Developed practical communication capability from A1 to B2 level for workplace integration.",
        fi: "Developed practical communication capability from A1 to B2 level for workplace integration."
      }
    ],
    tech: ["Finnish Language Training"]
  },
  {
    role: "BSc (Hons) Computer Science",
    company: "General Sir John Kotelawala Defence University",
    period: "2018–2021",
    kind: "education",
    summary: {
      eng: "Completed undergraduate studies in software engineering, systems, and applied computing with project-based delivery.",
      fi: "Completed undergraduate studies in software engineering, systems, and applied computing with project-based delivery."
    },
    impactBullets: [
      {
        eng: "Built a strong base in engineering fundamentals, problem solving, and software design.",
        fi: "Built a strong base in engineering fundamentals, problem solving, and software design."
      }
    ],
    tech: ["Computer Science", "Software Engineering", "Project Collaboration"]
  },
  {
    role: "High School",
    company: "Royal College Colombo",
    companyUrl: "https://royalcollege.lk",
    period: "2003–2016",
    kind: "education",
    summary: {
      eng: "Major: Physical Sciences (Mathematics, Chemistry, Physics).",
      fi: "Major: Physical Sciences (Mathematics, Chemistry, Physics)."
    },
    impactBullets: [
      {
        eng: "Built strong analytical and quantitative foundations for later engineering work.",
        fi: "Built strong analytical and quantitative foundations for later engineering work."
      }
    ],
    tech: ["Physical Sciences", "Mathematics", "Chemistry", "Physics"]
  }
];

export const certifications: CredentialItem[] = [
  {
    name: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    provider: "Amazon Web Services",
    issuer: "AWS",
    icon: "/logos/certs/saa-c03.png",
    status: "active"
  },
  {
    name: "Microsoft Certified Azure Administrator Associate (AZ-104)",
    provider: "Microsoft Azure",
    issuer: "Azure",
    icon: "/logos/certs/az-104.png",
    status: "active"
  },
  {
    name: "Microsoft Certified Azure Security Engineer Associate (AZ-500)",
    provider: "Microsoft Azure",
    issuer: "Azure",
    icon: "/logos/certs/az-500.png",
    status: "active"
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    provider: "Cloud Native Computing Foundation",
    issuer: "Kubernetes",
    icon: "/logos/certs/cka.png",
    status: "active"
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
    tools: ["AWS", "Azure"]
  },
  {
    label: { eng: "CI/CD", fi: "CI/CD" },
    tools: ["GitHub Actions", "Azure DevOps", "GitLab CI", "Jenkins"]
  },
  {
    label: { eng: "Containers & Orchestration", fi: "Kontit & orkestrointi" },
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
    label: { eng: "Programming & Scripting", fi: "Ohjelmointi & skriptaus" },
    tools: ["Bash", "Python", "Go", "Rust"]
  },
  {
    label: { eng: "Security & Networking", fi: "Tietoturva & verkot" },
    tools: ["RBAC", "IAM", "Secrets Management", "Nginx"]
  },
  {
    label: { eng: "Databases", fi: "Tietokannat" },
    tools: ["PostgreSQL", "MongoDB"]
  }
];

export const selectedCaseStudySlugs = [
  "cloud-cost-optimization",
  "kubernetes-rbac-okta"
] as const;

export const selectedBeyondWorkSlugs = [
  "weekend-sri-lankan-curry",
  "homemade-pasta-night",
  "morning-run-by-the-river"
] as const;
