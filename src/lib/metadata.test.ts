import { createMetadata } from "@/lib/metadata";

describe("createMetadata", () => {
  function getOpenGraphType(metadata: ReturnType<typeof createMetadata>) {
    if (!metadata.openGraph || !("type" in metadata.openGraph)) {
      return undefined;
    }

    return metadata.openGraph.type;
  }

  it("creates canonical metadata defaults", () => {
    const metadata = createMetadata();

    expect(metadata.title).toBe(
      "Malith Ileperuma | DevOps Engineer, Platform and Cloud Reliability",
    );
    expect(metadata.alternates?.canonical).toBe("https://malithileperuma.com");
    expect(metadata.openGraph?.images).toBeDefined();
    expect(getOpenGraphType(metadata)).toBe("website");
  });

  it("supports page specific metadata", () => {
    const metadata = createMetadata({
      title: "Case Studies",
      description: "Practical work",
      path: "/case-studies",
      image: "/media/malith-portrait.webp",
    });

    expect(metadata.title).toBe("Case Studies | Malith Ileperuma");
    expect(metadata.description).toBe("Practical work");
    expect(metadata.alternates?.canonical).toBe(
      "https://malithileperuma.com/case-studies",
    );
  });

  it("supports full title and open graph type overrides", () => {
    const metadata = createMetadata({
      fullTitle: "Malith Ileperuma | Custom Title",
      openGraphType: "article",
    });

    expect(metadata.title).toBe("Malith Ileperuma | Custom Title");
    expect(getOpenGraphType(metadata)).toBe("article");
  });
});
