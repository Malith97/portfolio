import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/photo-grid";
import { CloudCostOptimizationEditorial } from "@/components/case-studies/cloud-cost-optimization-editorial";
import { KubernetesRbacOktaEditorial } from "@/components/case-studies/kubernetes-rbac-okta-editorial";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { DEFAULT_LANGUAGE, getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllCaseStudies(DEFAULT_LANGUAGE);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const post = await getCaseStudyBySlug(slug, language);

  if (!post) {
    return createMetadata({
      title: t.caseStudyDetail.notFoundTitle,
      path: `/case-studies/${slug}`
    });
  }

  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/case-studies/${post.slug}`,
    image: post.coverImage || post.image
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const fallbackOutcome = t.caseStudyDetail.fallbackOutcome;

  const post = await getCaseStudyBySlug(slug, language);
  const showTopGallery = post?.slug !== "cloud-cost-optimization";

  if (!post) {
    notFound();
  }

  const localizedTitle = post.title;
  const localizedSummary = post.summary;

  if (language === "eng" && post.slug === "cloud-cost-optimization") {
    return (
      <article>
        <CloudCostOptimizationEditorial />
      </article>
    );
  }

  if (language === "eng" && post.slug === "kubernetes-rbac-okta") {
    return (
      <article>
        <KubernetesRbacOktaEditorial />
      </article>
    );
  }

  return (
    <article className="space-y-10">
      <Link href="/case-studies" className="quiet-link text-sm text-muted">
        {t.common.backToCaseStudies}
      </Link>

      <header className="grid gap-8 border-b border-border pb-8 md:grid-cols-[1fr_240px] md:items-end">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {t.common.caseStudy} · {formatDate(post.date, language)} · {post.readingTime}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-text sm:text-6xl">
            {localizedTitle}
          </h1>
          <p className="max-w-reading text-base leading-relaxed text-muted">
            {localizedSummary}
          </p>

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

        <aside className="space-y-2 border-t border-border pt-4 md:border-t-0 md:border-l md:pl-5">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.caseStudyDetail.outcome}</p>
          <p className="font-serif text-3xl leading-tight text-accent">{post.impact ?? fallbackOutcome}</p>
        </aside>
      </header>

      {showTopGallery ? (
        <PhotoGrid
          images={post.images}
          altBase={localizedTitle}
          aspectClass="aspect-[4/3]"
          priorityFirst
        />
      ) : null}

      <section className="space-y-4 border-t border-border pt-6 overflow-visible">
        <div className="content-prose max-w-reading" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </section>
    </article>
  );
}
