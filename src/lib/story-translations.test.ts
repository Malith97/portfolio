import { en } from "@/locales/en";
import { fi } from "@/locales/fi";

function isNonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

describe("story translations integrity", () => {
  it("keeps EN and FI chapter navigation IDs aligned", () => {
    const enNavIds = en.storyPage.chapterNav.map((chapter) => chapter.id);
    const fiNavIds = fi.storyPage.chapterNav.map((chapter) => chapter.id);

    expect(fiNavIds).toEqual(enNavIds);
  });

  it("keeps EN and FI chapter IDs aligned", () => {
    const enChapterIds = en.storyPage.chapters.map((chapter) => chapter.id);
    const fiChapterIds = fi.storyPage.chapters.map((chapter) => chapter.id);

    expect(fiChapterIds).toEqual(enChapterIds);
  });

  it("has non-empty story chapter title and paragraphs in both languages", () => {
    for (const chapter of en.storyPage.chapters) {
      expect(isNonEmpty(chapter.title)).toBe(true);
      expect(chapter.paragraphs.length).toBeGreaterThan(0);
      chapter.paragraphs.forEach((paragraph) =>
        expect(isNonEmpty(paragraph)).toBe(true),
      );
    }

    for (const chapter of fi.storyPage.chapters) {
      expect(isNonEmpty(chapter.title)).toBe(true);
      expect(chapter.paragraphs.length).toBeGreaterThan(0);
      chapter.paragraphs.forEach((paragraph) =>
        expect(isNonEmpty(paragraph)).toBe(true),
      );
    }
  });

  it("provides captions and alt text whenever a story image is defined", () => {
    const combinedChapters = [
      ...en.storyPage.chapters,
      ...fi.storyPage.chapters,
    ];

    for (const chapter of combinedChapters) {
      const hasImageField = Boolean(chapter.imageAlt || chapter.imageCaption);
      if (!hasImageField) {
        continue;
      }

      expect(isNonEmpty(chapter.imageAlt)).toBe(true);
      expect(isNonEmpty(chapter.imageCaption)).toBe(true);
    }
  });
});
