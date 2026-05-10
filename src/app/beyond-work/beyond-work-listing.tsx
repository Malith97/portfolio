"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SafeImage } from "@/components/safe-image";
import type { Language } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/content";

import {
  type FilterKey,
  filterBeyondWorkPosts,
  filters,
  toFilterKey,
} from "./filtering";

interface BeyondWorkListingLabels {
  categoriesAriaLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateCta: string;
  kitchenNotes: string;
  timeSpent: string;
  whatILearned: string;
  filters: Record<FilterKey, string>;
}

interface BeyondWorkListingProps {
  language: Language;
  posts: PostMeta[];
  labels: BeyondWorkListingLabels;
}

function buildMetadataLine(
  post: PostMeta,
  labels: BeyondWorkListingLabels,
): string {
  if (post.cardMeta) {
    return post.cardMeta.toUpperCase();
  }

  if (toFilterKey(post.categoryId, post.category) === "cooking") {
    const isSpecialLunch = post.slug === "sri-lankan-rice-and-curry-special-lunch";
    const parts: string[] = isSpecialLunch
      ? []
      : [labels.kitchenNotes.toUpperCase()];
    if (post.dishType) parts.push(post.dishType.toUpperCase());
    if (post.cuisine) parts.push(post.cuisine.toUpperCase());
    if (post.timeSpent) parts.push(post.timeSpent.toUpperCase());
    return parts.join(" · ");
  }

  const category =
    labels.filters[toFilterKey(post.categoryId, post.category)].toUpperCase();
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

export function BeyondWorkListing({
  language,
  posts,
  labels,
}: BeyondWorkListingProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");

  const filteredPosts = useMemo(
    () => filterBeyondWorkPosts(posts, selectedFilter),
    [posts, selectedFilter],
  );

  const hasFilteredPosts = filteredPosts.length > 0;

  return (
    <>
      <nav
        aria-label={labels.categoriesAriaLabel}
        className="-mt-2 border-b border-border pb-4 sm:-mt-4 sm:pb-5"
      >
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.key;

            return (
              <li key={filter.key}>
                <button
                  type="button"
                  onClick={() => setSelectedFilter(filter.key)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-xs uppercase tracking-label transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-accent/45 hover:text-text"
                  }`}
                >
                  {labels.filters[filter.key]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {hasFilteredPosts ? (
        <div id="beyond-work-grid" className="space-y-6 sm:space-y-8">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
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

                  <div className="space-y-3 p-4 sm:p-5">
                    <p className="font-mono text-xs uppercase tracking-label text-muted">
                      {formatDate(post.date, language)}
                    </p>
                    <h2 className="font-serif text-2xl leading-tight text-text transition-colors hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {post.summary}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-label text-accent">
                      {buildMetadataLine(post, labels)}
                    </p>
                    {toFilterKey(post.categoryId, post.category) ===
                    "cooking" ? (
                      <div className="space-y-2 border-t border-border pt-3">
                        {post.timeSpent ? (
                          <p className="text-sm text-muted">
                            <span className="font-mono text-xs uppercase tracking-label text-text">
                              {labels.timeSpent}:
                            </span>{" "}
                            {post.timeSpent}
                          </p>
                        ) : null}
                        {post.whatILearned &&
                        post.slug !==
                          "sri-lankan-rice-and-curry-special-lunch" ? (
                          <p className="text-sm text-muted">
                            <span className="font-mono text-xs uppercase tracking-label text-text">
                              {labels.whatILearned}:
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
        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-text">
            {labels.emptyStateTitle}
          </h2>
          <p className="pt-2 text-sm text-muted">
            {labels.emptyStateDescription}
          </p>
          <Link
            href="/beyond-work"
            className="quiet-link mt-4 inline-block text-sm text-accent"
          >
            {labels.emptyStateCta}
          </Link>
        </section>
      )}
    </>
  );
}
