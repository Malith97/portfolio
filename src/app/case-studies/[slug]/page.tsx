import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyDetailPageContent } from "@/components/case-study-detail-page-content";
import { CloudCostOptimizationEditorial } from "@/components/case-studies/cloud-cost-optimization-editorial";
import { KubernetesRbacOktaEditorial } from "@/components/case-studies/kubernetes-rbac-okta-editorial";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";
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
  const [postEng, postFi] = await Promise.all([
    getCaseStudyBySlug(slug, "eng"),
    getCaseStudyBySlug(slug, "fi"),
  ]);

  if (!postEng && !postFi) {
    notFound();
  }

  const englishEditorial =
    slug === "cloud-cost-optimization" ? (
      <CloudCostOptimizationEditorial />
    ) : slug === "kubernetes-rbac-okta" ? (
      <KubernetesRbacOktaEditorial />
    ) : undefined;

  return (
    <CaseStudyDetailPageContent
      slug={slug}
      postsByLanguage={{ eng: postEng, fi: postFi }}
      englishEditorial={englishEditorial}
    />
  );
}
