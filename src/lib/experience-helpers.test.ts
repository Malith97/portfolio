import {
  getCompanyInitials,
  localizeEducationRole,
  localizeWorkRole,
  resolveCompanyLogo,
} from "@/lib/experience";
import type { ExperienceItem } from "@/lib/profile";

const makeItem = (overrides: Partial<ExperienceItem>): ExperienceItem => ({
  role: "DevOps Engineer",
  company: "Example Company",
  period: "2024-2025",
  kind: "work",
  summary: { eng: "Summary", fi: "Yhteenveto" },
  impactBullets: [{ eng: "Impact", fi: "Vaikutus" }],
  tech: ["Docker"],
  ...overrides,
});

describe("experience helpers", () => {
  it("prefers explicit company logo", () => {
    const item = makeItem({ companyLogo: "/logos/custom.svg" });
    expect(resolveCompanyLogo(item)).toBe("/logos/custom.svg");
  });

  it("falls back to known company logo mapping", () => {
    const item = makeItem({ company: "Oracle Corporation" });
    expect(resolveCompanyLogo(item)).toBe("/logos/oracle.svg");
  });

  it("returns null when no logo mapping is found", () => {
    const item = makeItem({ company: "Unknown Inc" });
    expect(resolveCompanyLogo(item)).toBeNull();
  });

  it("builds initials safely", () => {
    expect(getCompanyInitials("London Stock Exchange Group")).toBe("LS");
    expect(getCompanyInitials("Oracle")).toBe("OR");
    expect(getCompanyInitials("   ")).toBe("CO");
  });

  it("localizes known work role labels to Finnish", () => {
    expect(localizeWorkRole("DevOps Engineer", "fi")).toBe("DevOps-insinööri");
    expect(localizeWorkRole("Software Engineer", "fi")).toBe(
      "Ohjelmistoinsinööri",
    );
    expect(localizeWorkRole("Platform Engineer", "fi")).toBe(
      "Platform Engineer",
    );
    expect(localizeWorkRole("DevOps Engineer", "eng")).toBe("DevOps Engineer");
  });

  it("localizes known education role labels to Finnish", () => {
    const labels = {
      finnishLanguageStudies: "Suomen kielen opinnot",
      bachelorOfScience: "Bachelor of Science",
      highSchool: "Lukio",
    };

    expect(
      localizeEducationRole("Finnish Language Studies (A1–B2)", "fi", labels),
    ).toBe("Suomen kielen opinnot (A1–B2)");
    expect(
      localizeEducationRole("BSc (Hons) Computer Science", "fi", labels),
    ).toBe("Bachelor of Science (Hons), Tietojenkäsittelytiede");
    expect(localizeEducationRole("High School", "fi", labels)).toBe("Lukio");
    expect(localizeEducationRole("Other", "fi", labels)).toBe("Other");
    expect(localizeEducationRole("High School", "eng", labels)).toBe(
      "High School",
    );
  });
});
