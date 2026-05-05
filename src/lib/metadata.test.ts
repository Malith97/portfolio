import { createMetadata } from "@/lib/metadata";

describe("createMetadata", () => {
  it("creates canonical metadata defaults", () => {
    const metadata = createMetadata();

    expect(metadata.title).toBe("Malith Ileperuma | DevOps Engineer");
    expect(metadata.alternates?.canonical).toBe("https://malithileperuma.com");
    expect(metadata.openGraph?.images).toBeDefined();
  });

  it("supports page specific metadata", () => {
    const metadata = createMetadata({
      title: "Case Studies",
      description: "Practical work",
      path: "/case-studies",
      image: "/media/malith-portrait.jpg",
    });

    expect(metadata.title).toBe("Case Studies | Malith Ileperuma");
    expect(metadata.description).toBe("Practical work");
    expect(metadata.alternates?.canonical).toBe(
      "https://malithileperuma.com/case-studies",
    );
  });
});
