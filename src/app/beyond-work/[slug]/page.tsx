import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BeyondWorkDetailPageContent } from "@/components/beyond-work-detail-page-content";
import { getAllBeyondWorkPosts, getBeyondWorkPostBySlug } from "@/lib/content";
import { DEFAULT_LANGUAGE, getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";

interface BeyondWorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBeyondWorkPosts(DEFAULT_LANGUAGE);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BeyondWorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const post = await getBeyondWorkPostBySlug(slug, language);

  if (!post) {
    return createMetadata({
      title: t.notFoundPage.label,
      path: `/beyond-work/${slug}`,
    });
  }

  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/beyond-work/${post.slug}`,
    image: post.coverImage || post.image,
    openGraphType: "article",
    keywords: post.tags,
  });
}

export default async function BeyondWorkDetailPage({
  params,
}: BeyondWorkPageProps) {
  const { slug } = await params;
  const [postEng, postFi, postsEng, postsFi] = await Promise.all([
    getBeyondWorkPostBySlug(slug, "eng"),
    getBeyondWorkPostBySlug(slug, "fi"),
    getAllBeyondWorkPosts("eng"),
    getAllBeyondWorkPosts("fi"),
  ]);

  if (!postEng && !postFi) {
    notFound();
  }

  return (
    <BeyondWorkDetailPageContent
      slug={slug}
      postsByLanguage={{ eng: postEng, fi: postFi }}
      listingByLanguage={{ eng: postsEng, fi: postsFi }}
    />
  );
}
