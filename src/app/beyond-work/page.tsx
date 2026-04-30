import Link from "next/link";

import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";

const filters = [
  { key: "all" },
  { key: "running" },
  { key: "cycling" },
  { key: "photography" },
  { key: "cooking" },
  { key: "achievements" },
  { key: "other" }
] as const;

type FilterKey = (typeof filters)[number]["key"];

interface BeyondWorkPageProps {
  searchParams?: {
    category?: string | string[];
  };
}

function normalizeFilter(input?: string | string[]): FilterKey {
  const value = Array.isArray(input) ? input[0] : input;
  const normalized = value?.toLowerCase();
  return filters.some((filter) => filter.key === normalized) ? (normalized as FilterKey) : "all";
}

function toFilterKey(category?: string): Exclude<FilterKey, "all"> {
  const normalized = category?.toLowerCase() ?? "";

  if (normalized.includes("running")) return "running";
  if (normalized.includes("cycling")) return "cycling";
  if (normalized.includes("photography")) return "photography";
  if (normalized.includes("cooking")) return "cooking";
  if (normalized.includes("achievements")) return "achievements";

  return "other";
}

function isCookingCategory(category?: string): boolean {
  const normalized = category?.toLowerCase() ?? "";
  return normalized.includes("cooking");
}

function buildMetadataLine(
  post: Awaited<ReturnType<typeof getAllBeyondWorkPosts>>[number],
  t: ReturnType<typeof getDictionary>
): string {
  if (post.cardMeta) {
    return post.cardMeta.toUpperCase();
  }

  if (isCookingCategory(post.category)) {
    const parts: string[] = [t.common.kitchenNotes.toUpperCase()];
    if (post.dishType) parts.push(post.dishType.toUpperCase());
    if (post.cuisine) parts.push(post.cuisine.toUpperCase());
    if (post.timeSpent) parts.push(post.timeSpent.toUpperCase());
    return parts.join(" · ");
  }

  const category = t.beyondWorkPage.filters[toFilterKey(post.category)].toUpperCase();
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

export default async function BeyondWorkPage({ searchParams }: BeyondWorkPageProps) {
  const language = getServerLanguage();
  const t = getDictionary(language);

  const selectedFilter = normalizeFilter(searchParams?.category);
  const posts = await getAllBeyondWorkPosts();

  const filteredPosts =
    selectedFilter === "all"
      ? posts
      : posts.filter((post) => toFilterKey(post.category) === selectedFilter);
  const hasFilteredPosts = filteredPosts.length > 0;
  const isFinnish = language === "fi";

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.beyondWorkPage.label}
        title={t.beyondWorkPage.title}
        description={t.beyondWorkPage.description}
      />

      <nav aria-label="Beyond work categories" className="-mt-4 border-b border-border pb-5">
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const href = filter.key === "all" ? "/beyond-work" : `/beyond-work?category=${filter.key}`;
            const isActive = selectedFilter === filter.key;

            return (
              <li key={filter.key}>
                <Link
                  href={href}
                  className={`inline-flex rounded-md border px-3 py-1.5 text-xs uppercase tracking-label transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-accent hover:text-accent"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t.beyondWorkPage.filters[filter.key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {hasFilteredPosts ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="surface-card overflow-hidden">
              <Link href={`/beyond-work/${post.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden border-b border-border">
                  <SafeImage
                    src={post.image}
                    alt={`${getLocalizedPostTitle(post.slug, post.title, language)} cover image`}
                    width={1200}
                    height={760}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                  />
                </div>

                <div className="space-y-3 p-4">
                  <p className="font-mono text-xs uppercase tracking-label text-muted">{formatDate(post.date)}</p>
                  <h2 className="font-serif text-2xl leading-tight text-text transition-colors hover:text-accent">
                    {getLocalizedPostTitle(post.slug, post.title, language)}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {getLocalizedPostSummary(post.slug, post.summary, language)}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-label text-accent">
                    {buildMetadataLine(post, t)}
                  </p>
                  {isCookingCategory(post.category) ? (
                    <div className="space-y-2 border-t border-border pt-3">
                      {post.timeSpent ? (
                        <p className="text-sm text-muted">
                          <span className="font-mono text-xs uppercase tracking-label text-text">
                            {t.beyondWorkDetail.timeSpent}:
                          </span>{" "}
                          {post.timeSpent}
                        </p>
                      ) : null}
                      {post.whatITried ? (
                        <p className="text-sm text-muted">
                          <span className="font-mono text-xs uppercase tracking-label text-text">
                            {t.beyondWorkDetail.whatITried}:
                          </span>{" "}
                          {post.whatITried}
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
      ) : (
        <section className="surface-card p-6">
          <h2 className="font-serif text-2xl text-text">{isFinnish ? "Ei tuloksia tällä suodattimella" : "No entries for this filter yet"}</h2>
          <p className="pt-2 text-sm text-muted">
            {isFinnish
              ? "Kokeile toista kategoriaa tai palaa näyttämään kaikki merkinnät."
              : "Try another category or reset the view to show all entries."}
          </p>
          <Link href="/beyond-work" className="quiet-link mt-4 inline-block text-sm text-accent">
            {isFinnish ? "Näytä kaikki merkinnät" : "Show all entries"}
          </Link>
        </section>
      )}
    </div>
  );
}
