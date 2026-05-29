"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { SafeImage } from "@/components/safe-image";
import type { Language } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/content";
import { getPaginationState, paginateItems } from "@/lib/pagination";

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
  pagination: string;
  previous: string;
  next: string;
  page: string;
  filters: Record<FilterKey, string>;
}

interface BeyondWorkListingProps {
  language: Language;
  posts: PostMeta[];
  labels: BeyondWorkListingLabels;
}

export function BeyondWorkListing({
  language,
  posts,
  labels,
}: BeyondWorkListingProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(
    () => filterBeyondWorkPosts(posts, selectedFilter),
    [posts, selectedFilter],
  );
  const pagination = useMemo(
    () => getPaginationState(filteredPosts.length, currentPage, 9),
    [currentPage, filteredPosts.length],
  );
  const paginatedPosts = useMemo(
    () => paginateItems(filteredPosts, pagination.currentPage, 9),
    [filteredPosts, pagination.currentPage],
  );

  const hasFilteredPosts = filteredPosts.length > 0;
  const shouldShowPagination = filteredPosts.length > 9;

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
                  onClick={() => {
                    setSelectedFilter(filter.key);
                    setCurrentPage(1);
                  }}
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

          {shouldShowPagination ? (
            <PaginationControls
              currentPage={pagination.currentPage}
              pageCount={pagination.pageCount}
              pages={pagination.pages}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              labels={{
                pagination: labels.pagination,
                previous: labels.previous,
                next: labels.next,
                page: labels.page,
              }}
              onPageChange={setCurrentPage}
            />
          ) : null}
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
