import { formatDate } from "@/lib/format";

describe("formatDate", () => {
  it("formats dates for English locale", () => {
    const formatted = formatDate("2025-06-15", "eng");
    expect(formatted).toContain("2025");
    expect(formatted.toLowerCase()).toContain("june");
  });

  it("formats dates for Finnish locale", () => {
    const formatted = formatDate("2025-06-15", "fi");
    expect(formatted).toContain("2025");
    expect(formatted.startsWith("15.")).toBe(true);
  });
});
