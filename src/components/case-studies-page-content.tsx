"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getDictionary, type Language } from "@/lib/i18n";

interface CaseStudiesPageContentProps {
  postsByLanguage: Record<Language, PostMeta[]>;
}

export function CaseStudiesPageContent({
  postsByLanguage,
}: CaseStudiesPageContentProps) {
  const { language } = useLanguage();
  const t = getDictionary(language);
  const fallbackOutcome = t.caseStudiesPage.fallbackOutcome;
  const posts = postsByLanguage[language] ?? [];

  return (
    <div className="space-y-10 sm:space-y-14">
      <SectionHeading
        label={t.caseStudiesPage.label}
        title={t.caseStudiesPage.title}
        description={t.caseStudiesPage.description}
      />

      <section className="space-y-6">
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="surface-card surface-card-interactive flex h-full min-h-[360px] flex-col overflow-hidden hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:min-h-[420px]"
            >
              <Link
                href={`/case-studies/${post.slug}`}
                className="block cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-border">
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={760}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                    className="hover-lift image-frame h-full w-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <p className="font-mono text-xs uppercase tracking-label text-muted">
                  {formatDate(post.date, language)} · {post.readingTime}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-text">
                  <Link
                    href={`/case-studies/${post.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {post.summary}
                </p>
                <p className="font-mono text-xs uppercase tracking-label text-accent">
                  {t.common.result}: {post.impact ?? fallbackOutcome}
                </p>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-label text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
