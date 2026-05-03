import {
  getAllBeyondWorkPosts,
  getAllCaseStudies,
  getBeyondWorkPostBySlug,
  getCaseStudyBySlug,
} from "@/lib/content";

describe("content access", () => {
  it("returns only allowed case studies", async () => {
    const posts = await getAllCaseStudies("eng");
    const slugs = posts.map((post) => post.slug);

    expect(posts.length).toBeGreaterThan(0);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "cloud-cost-optimization",
        "kubernetes-rbac-okta",
      ]),
    );
  });

  it("returns localized Finnish metadata when requested", async () => {
    const post = await getCaseStudyBySlug("cloud-cost-optimization", "fi");

    expect(post).not.toBeNull();
    expect(post?.readingTime).toMatch(/min lukuaika/);
  });

  it("returns null for unknown or disallowed slugs", async () => {
    await expect(
      getCaseStudyBySlug("not-a-real-case-study", "eng"),
    ).resolves.toBeNull();
    await expect(
      getBeyondWorkPostBySlug("not-a-real-entry", "eng"),
    ).resolves.toBeNull();
  });

  it("keeps beyond-work posts sorted by most recent date", async () => {
    const posts = await getAllBeyondWorkPosts("eng");

    expect(posts.length).toBeGreaterThan(1);

    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });
});
