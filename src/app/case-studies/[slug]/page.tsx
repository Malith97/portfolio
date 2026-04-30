import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/photo-grid";
import { CloudCostOptimizationEditorial } from "@/components/case-studies/cloud-cost-optimization-editorial";
import { KubernetesRbacOktaEditorial } from "@/components/case-studies/kubernetes-rbac-okta-editorial";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllCaseStudies();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const post = await getCaseStudyBySlug(params.slug);

  if (!post) {
    return createMetadata({
      title: "Case Study Not Found",
      path: `/case-studies/${params.slug}`
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
  const language = getServerLanguage();
  const t = getDictionary(language);
  const fallbackOutcome = language === "fi" ? "Operatiiviset parannukset" : "Operational gains";

  const post = await getCaseStudyBySlug(params.slug);
  const showTopGallery = post?.slug !== "cloud-cost-optimization";

  if (!post) {
    notFound();
  }

  const localizedTitle = getLocalizedPostTitle(post.slug, post.title, language);
  const localizedSummary = getLocalizedPostSummary(post.slug, post.summary, language);

  if (post.slug === "cloud-cost-optimization") {
    return (
      <article>
        <CloudCostOptimizationEditorial />
      </article>
    );
  }

  if (post.slug === "kubernetes-rbac-okta") {
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
            {t.common.caseStudy} · {formatDate(post.date)} · {post.readingTime}
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
