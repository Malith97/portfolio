import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/photo-grid";
import { getAllBeyondWorkPosts, getBeyondWorkPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

interface BeyondWorkPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllBeyondWorkPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BeyondWorkPageProps): Promise<Metadata> {
  const post = await getBeyondWorkPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Journal Entry Not Found"
    };
  }

  return {
    title: `${post.title} | Malith Ileperuma`,
    description: post.summary
  };
}

export default async function BeyondWorkDetailPage({ params }: BeyondWorkPageProps) {
  const post = await getBeyondWorkPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-12">
      <Link href="/beyond-work" className="quiet-link text-sm text-muted">
        Back to beyond work
      </Link>

      <header className="max-w-reading space-y-4 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-label text-muted">
          {post.category ?? "Journal"} · {post.location ?? "Finland"} · {formatDate(post.date)} · {post.readingTime}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-text sm:text-6xl">{post.title}</h1>
        <p className="text-base leading-relaxed text-muted">{post.summary}</p>
      </header>

      <PhotoGrid
        images={post.images}
        altBase={post.title}
        aspectClass="aspect-[4/3]"
        priorityFirst
      />
    </article>
  );
}
