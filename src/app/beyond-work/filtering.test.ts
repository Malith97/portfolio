import { filterBeyondWorkPosts, toFilterKey } from "@/app/beyond-work/filtering";

const samplePosts = [
  { slug: "run-1", categoryId: "running", category: "Running" },
  { slug: "ride-1", categoryId: "cycling", category: "Cycling" },
  { slug: "cook-1", categoryId: "cooking", category: "Cooking" },
  { slug: "award-1", categoryId: "achievements", category: "Achievements" },
  { slug: "misc-1", categoryId: "other", category: "Other" },
  { slug: "fallback-1", categoryId: undefined, category: "Neighborhood walk" },
];

describe("beyond-work filtering", () => {
  it("maps category ids and fallback text to filter keys", () => {
    expect(toFilterKey("running", "Running")).toBe("running");
    expect(toFilterKey(undefined, "Running trail")).toBe("running");
    expect(toFilterKey(undefined, "Cycling route")).toBe("cycling");
    expect(toFilterKey(undefined, "Achievement unlocked")).toBe("achievements");
    expect(toFilterKey(undefined, "Anything else")).toBe("other");
  });

  it("returns all posts when filter is all", () => {
    expect(filterBeyondWorkPosts(samplePosts, "all")).toHaveLength(samplePosts.length);
  });

  it("filters posts by each category key", () => {
    expect(filterBeyondWorkPosts(samplePosts, "running").map((item) => item.slug)).toEqual(["run-1"]);
    expect(filterBeyondWorkPosts(samplePosts, "cycling").map((item) => item.slug)).toEqual(["ride-1"]);
    expect(filterBeyondWorkPosts(samplePosts, "cooking").map((item) => item.slug)).toEqual(["cook-1"]);
    expect(filterBeyondWorkPosts(samplePosts, "achievements").map((item) => item.slug)).toEqual(["award-1"]);
    expect(filterBeyondWorkPosts(samplePosts, "other").map((item) => item.slug)).toEqual([
      "misc-1",
      "fallback-1",
    ]);
  });
});
