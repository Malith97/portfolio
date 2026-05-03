import { getDictionary, normalizeLanguage } from "@/lib/i18n";

describe("i18n utilities", () => {
  it("normalizes unknown language values to English", () => {
    expect(normalizeLanguage(undefined)).toBe("eng");
    expect(normalizeLanguage(null)).toBe("eng");
    expect(normalizeLanguage("en")).toBe("eng");
  });

  it("preserves Finnish language selection", () => {
    expect(normalizeLanguage("fi")).toBe("fi");
  });

  it("returns dictionary values for both supported languages", () => {
    expect(getDictionary("eng").nav.home).toBe("Home");
    expect(getDictionary("fi").nav.home).toBe("Etusivu");
  });
});
