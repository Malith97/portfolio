import type { PostMeta } from "@/lib/content";

export const filters = [
  { key: "all" },
  { key: "running" },
  { key: "cycling" },
  { key: "cooking" },
  { key: "achievements" },
  { key: "other" },
] as const;

export type FilterKey = (typeof filters)[number]["key"];

export type BeyondWorkFilterablePost = Pick<
  PostMeta,
  "categoryId" | "category"
>;

export function toFilterKey(
  categoryId?: string,
  category?: string,
): Exclude<FilterKey, "all"> {
  const normalizedId = categoryId?.toLowerCase() ?? "";
  if (normalizedId === "running") return "running";
  if (normalizedId === "cycling") return "cycling";
  if (normalizedId === "cooking") return "cooking";
  if (normalizedId === "achievements") return "achievements";
  if (normalizedId === "other") return "other";

  const normalizedCategory = category?.toLowerCase() ?? "";

  if (normalizedCategory.includes("running")) return "running";
  if (normalizedCategory.includes("cycling")) return "cycling";
  if (normalizedCategory.includes("cooking")) return "cooking";
  if (normalizedCategory.includes("achievement")) return "achievements";

  return "other";
}

export function filterBeyondWorkPosts<T extends BeyondWorkFilterablePost>(
  posts: T[],
  selectedFilter: FilterKey,
): T[] {
  if (selectedFilter === "all") {
    return posts;
  }

  return posts.filter(
    (post) => toFilterKey(post.categoryId, post.category) === selectedFilter,
  );
}
