import {
  certifications,
  credibilityStats,
  experienceTimeline,
  getLocalizedText,
  professionalSummary,
  selectedBeyondWorkSlugs,
  selectedCaseStudySlugs,
  sortExperienceByMostRecent,
  toolCategories,
} from "@/lib/profile";

describe("profile data integrity", () => {
  it("contains core profile sections", () => {
    expect(experienceTimeline.length).toBeGreaterThan(0);
    expect(professionalSummary.length).toBeGreaterThan(0);
    expect(certifications.length).toBeGreaterThan(0);
    expect(credibilityStats.length).toBeGreaterThan(0);
    expect(toolCategories.length).toBeGreaterThan(0);
  });

  it("keeps required experience fields populated", () => {
    for (const item of experienceTimeline) {
      expect(item.role.trim().length).toBeGreaterThan(0);
      expect(item.company.trim().length).toBeGreaterThan(0);
      expect(item.period.trim().length).toBeGreaterThan(0);
      expect(item.tech.length).toBeGreaterThan(0);
      expect(item.summary.eng.trim().length).toBeGreaterThan(0);
      expect(item.summary.fi.trim().length).toBeGreaterThan(0);

      const companyUrl = item.companyUrl;
      if (typeof companyUrl === "string") {
        expect(() => new URL(companyUrl)).not.toThrow();
      }
    }
  });

  it("uses consistent selected content slugs", () => {
    expect(selectedCaseStudySlugs.length).toBeGreaterThan(0);
    expect(selectedBeyondWorkSlugs.length).toBeGreaterThan(0);

    for (const slug of [
      ...selectedCaseStudySlugs,
      ...selectedBeyondWorkSlugs,
    ]) {
      expect(slug.trim().length).toBeGreaterThan(0);
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("profile helpers", () => {
  it("returns localized text for both supported languages", () => {
    const sample = { eng: "Hello", fi: "Hei" };

    expect(getLocalizedText(sample, "eng")).toBe("Hello");
    expect(getLocalizedText(sample, "fi")).toBe("Hei");
  });

  it("sorts most recent periods first", () => {
    const items = [
      { period: "2018-2020", id: "older" },
      { period: "2023-Now", id: "current" },
      { period: "2021-2022", id: "middle" },
    ];

    const sorted = sortExperienceByMostRecent(items);
    expect(sorted.map((item) => item.id)).toEqual([
      "current",
      "middle",
      "older",
    ]);
  });
});
