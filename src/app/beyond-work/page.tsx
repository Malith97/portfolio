import Link from "next/link";

import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

const filters = [
  { key: "all" },
  { key: "running" },
  { key: "cycling" },
  { key: "cooking" },
  { key: "achievements" },
  { key: "other" }
] as const;

type FilterKey = (typeof filters)[number]["key"];

function toFilterKey(categoryId?: string, category?: string): Exclude<FilterKey, "all"> {
  const normalizedId = categoryId?.toLowerCase() ?? "";
  if (normalizedId === "running") return "running";
  if (normalizedId === "cycling") return "cycling";
  if (normalizedId === "cooking") return "cooking";
  if (normalizedId === "achievements") return "achievements";
  if (normalizedId === "other") return "other";

  const normalized = category?.toLowerCase() ?? "";

  if (normalized.includes("running")) return "running";
  if (normalized.includes("cycling")) return "cycling";
  if (normalized.includes("cooking")) return "cooking";
  if (normalized.includes("achievements")) return "achievements";

  return "other";
}

function buildMetadataLine(
  post: Awaited<ReturnType<typeof getAllBeyondWorkPosts>>[number],
  t: ReturnType<typeof getDictionary>
): string {
  if (post.cardMeta) {
    return post.cardMeta.toUpperCase();
  }

  if (toFilterKey(post.categoryId, post.category) === "cooking") {
    const parts: string[] = [t.common.kitchenNotes.toUpperCase()];
    if (post.dishType) parts.push(post.dishType.toUpperCase());
    if (post.cuisine) parts.push(post.cuisine.toUpperCase());
    if (post.timeSpent) parts.push(post.timeSpent.toUpperCase());
    return parts.join(" · ");
  }

  const category = t.beyondWorkPage.filters[toFilterKey(post.categoryId, post.category)].toUpperCase();
  const parts: string[] = [category];

  if (post.distance) parts.push(post.distance.toUpperCase());
  if (post.duration) parts.push(post.duration.toUpperCase());
  if (post.weather) parts.push(post.weather.toUpperCase());

  if (!post.distance && !post.duration && !post.weather) {
    if (post.location) parts.push(post.location.toUpperCase());
    if (post.photoCount) parts.push(post.photoCount.toUpperCase());
  }

  return parts.join(" · ");
}

export const metadata = createMetadata({
  title: "Beyond Work",
  description: "Journal-style activity stories on running, cycling, photography, cooking, achievements, and notes.",
  path: "/beyond-work"
});

export default async function BeyondWorkPage() {
  const language = await getServerLanguage();
  const t = getDictionary(language);

  const selectedFilter: FilterKey = "all";
  const posts = await getAllBeyondWorkPosts(language);
  const filteredPosts = posts;
  const paginatedPosts = filteredPosts;
  const hasFilteredPosts = filteredPosts.length > 0;

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.beyondWorkPage.label}
        title={t.beyondWorkPage.title}
        description={t.beyondWorkPage.description}
      />

      <nav aria-label={t.beyondWorkPage.categoriesAriaLabel} className="-mt-4 border-b border-border pb-5">
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.key;

            return (
              <li key={filter.key}>
                <span
                  className={`inline-flex rounded-md border px-3 py-1.5 text-xs uppercase tracking-label ${
                    isActive ? "border-accent text-accent" : "border-border text-muted"
                  }`}
                >
                  {t.beyondWorkPage.filters[filter.key]}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>

      {hasFilteredPosts ? (
        <div id="beyond-work-grid" className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <article key={post.slug} className="surface-card overflow-hidden">
                <Link href={`/beyond-work/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden border-b border-border">
                    <SafeImage
                      src={post.image}
                      alt={post.title}
                      width={1200}
                      height={760}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="font-mono text-xs uppercase tracking-label text-muted">{formatDate(post.date, language)}</p>
                    <h2 className="font-serif text-2xl leading-tight text-text transition-colors hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {post.summary}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-label text-accent">
                      {buildMetadataLine(post, t)}
                    </p>
                    {toFilterKey(post.categoryId, post.category) === "cooking" ? (
                      <div className="space-y-2 border-t border-border pt-3">
                        {post.timeSpent ? (
                          <p className="text-sm text-muted">
                            <span className="font-mono text-xs uppercase tracking-label text-text">
                              {t.beyondWorkDetail.timeSpent}:
                            </span>{" "}
                            {post.timeSpent}
                          </p>
                        ) : null}
                        {post.whatILearned ? (
                          <p className="text-sm text-muted">
                            <span className="font-mono text-xs uppercase tracking-label text-text">
                              {t.beyondWorkDetail.whatILearned}:
                            </span>{" "}
                            {post.whatILearned}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </Link>
              </article>
            ))}
          </div>

        </div>
      ) : (
        <section className="surface-card p-6">
          <h2 className="font-serif text-2xl text-text">{t.beyondWorkPage.emptyStateTitle}</h2>
          <p className="pt-2 text-sm text-muted">
            {t.beyondWorkPage.emptyStateDescription}
          </p>
          <Link href="/beyond-work" className="quiet-link mt-4 inline-block text-sm text-accent">
            {t.beyondWorkPage.emptyStateCta}
          </Link>
        </section>
      )}
    </div>
  );
}
