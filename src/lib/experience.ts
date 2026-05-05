import type { Language } from "@/lib/i18n";
import type { ExperienceItem } from "@/lib/profile";

const COMPANY_LOGO_FALLBACK_MAP: Array<{ keyword: string; logo: string }> = [
  { keyword: "almosafer", logo: "/logos/almosafer.svg" },
  { keyword: "oracle", logo: "/logos/oracle.svg" },
  {
    keyword: "london stock exchange",
    logo: "/logos/london-stock-exchange.png",
  },
  { keyword: "zebra", logo: "/logos/zebra-technologies.png" },
  { keyword: "sy labs", logo: "/logos/sylabs.png" },
  { keyword: "sylabs", logo: "/logos/sylabs.png" },
];

export function resolveCompanyLogo(item: ExperienceItem): string | null {
  if (item.companyLogo) {
    return item.companyLogo;
  }

  const normalized = item.company.toLowerCase();
  const mapped = COMPANY_LOGO_FALLBACK_MAP.find((entry) =>
    normalized.includes(entry.keyword),
  );
  return mapped?.logo ?? null;
}

export function getCompanyInitials(company: string): string {
  const words = company
    .split(/[\s&/-]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "CO";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export function localizeWorkRole(role: string, language: Language): string {
  if (language !== "fi") {
    return role;
  }

  if (role === "DevOps Engineer") {
    return "DevOps-insinööri";
  }

  if (role === "Software Engineer") {
    return "Ohjelmistoinsinööri";
  }

  return role;
}

interface EducationRoleLabels {
  finnishLanguageStudies: string;
  bachelorOfScience: string;
  highSchool: string;
}

export function localizeEducationRole(
  role: string,
  language: Language,
  labels: EducationRoleLabels,
): string {
  if (language !== "fi") {
    return role;
  }

  if (role === "Finnish Language Studies (A1–B2)") {
    return `${labels.finnishLanguageStudies} (A1–B2)`;
  }

  if (role === "BSc (Hons) Computer Science") {
    return `${labels.bachelorOfScience} (Hons), Tietojenkäsittelytiede`;
  }

  if (role === "High School") {
    return labels.highSchool;
  }

  return role;
}
