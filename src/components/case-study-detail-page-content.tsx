"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { PhotoGrid } from "@/components/photo-grid";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getDictionary, type Language } from "@/lib/i18n";
import { siteUrl } from "@/lib/metadata";

interface CaseStudyDetailPageContentProps {
  slug: string;
  postsByLanguage: Record<Language, Post | null>;
  englishEditorial?: ReactNode;
}

function resolvePost(
  language: Language,
  postsByLanguage: Record<Language, Post | null>,
): Post | null {
  return postsByLanguage[language] ?? postsByLanguage.eng ?? postsByLanguage.fi;
}

export function CaseStudyDetailPageContent({
  slug,
  postsByLanguage,
  englishEditorial,
}: CaseStudyDetailPageContentProps) {
  const { language } = useLanguage();
  const t = getDictionary(language);
  const fallbackOutcome = t.caseStudyDetail.fallbackOutcome;
  const post = resolvePost(language, postsByLanguage);
  const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

  if (!post) {
    return null;
  }

  const canonicalUrl = `${normalizedSiteUrl}/case-studies/${post.slug}`;
  const imageUrl = `${normalizedSiteUrl}${post.coverImage || post.image}`;
  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(canonicalUrl);
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const shareLabel = language === "fi" ? "Jaa tämä työnäyte" : "Share this case study";
  const shareOnLinkedInLabel = language === "fi" ? "Jaa LinkedInissä" : "Share on LinkedIn";
  const shareOnXLabel = language === "fi" ? "Jaa X:ssä" : "Share on X";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: normalizedSiteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Studies",
        item: `${normalizedSiteUrl}/case-studies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: [imageUrl],
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Person",
      name: "Malith Ileperuma",
      url: normalizedSiteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Malith Ileperuma",
      url: normalizedSiteUrl,
    },
    keywords: post.tags,
    articleSection: "Case Studies",
    about: post.category ?? "DevOps and Cloud Engineering",
  };

  if (language === "eng" && englishEditorial) {
    return (
      <>
        <article>{englishEditorial}</article>
        <section className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{shareLabel}</p>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
          >
            {shareOnLinkedInLabel}
          </a>
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
          >
            {shareOnXLabel}
          </a>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
          }}
        />
      </>
    );
  }

  const showTopGallery = slug !== "cloud-cost-optimization";

  return (
    <>
      <article className="space-y-8 sm:space-y-10">
        <Link href="/case-studies" className="quiet-link inline-flex min-h-11 items-center text-sm text-muted">
          {t.common.backToCaseStudies}
        </Link>

        <header className="grid gap-6 border-b border-border pb-6 md:grid-cols-[1fr_240px] md:items-end md:gap-8 md:pb-8">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-label text-muted">
              {t.common.caseStudy} · {formatDate(post.date, language)} · {post.readingTime}
            </p>
            <h1 className="font-serif text-3xl leading-tight text-text sm:text-6xl">{post.title}</h1>
            <p className="max-w-reading text-base leading-relaxed text-muted">{post.summary}</p>

            <ul className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-label text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-2 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.caseStudyDetail.outcome}</p>
            <p className="font-serif text-3xl leading-tight text-accent">{post.impact ?? fallbackOutcome}</p>
          </aside>
        </header>

        {showTopGallery ? (
          <PhotoGrid images={post.images} altBase={post.title} aspectClass="aspect-[4/3]" priorityFirst />
        ) : null}

        <section className="space-y-4 overflow-visible border-t border-border pt-5 sm:pt-6">
          <div className="content-prose max-w-reading" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </section>

        <section className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{shareLabel}</p>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
          >
            {shareOnLinkedInLabel}
          </a>
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
          >
            {shareOnXLabel}
          </a>
        </section>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
        }}
      />
    </>
  );
}
