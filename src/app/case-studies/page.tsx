import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/format";
import { getAllCaseStudies } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Case Studies",
  description: "Practical DevOps case studies on cost, migration, delivery automation, and reliability.",
  path: "/case-studies"
});

export default async function CaseStudiesPage() {
  const posts = await getAllCaseStudies();
  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);
  const mainFeatured = featuredPosts[0];
  const secondaryFeatured = featuredPosts.slice(1, 3);

  return (
    <div className="space-y-14">
      <SectionHeading
        label="Case Studies"
        title="Selected delivery and reliability work"
        description="Outcome-focused snapshots of cloud optimization, migration, automation, and platform resilience."
      />

      {mainFeatured ? (
        <section className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-label text-muted">Featured</p>

          <article className="surface-card overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
                <Image
                  src={mainFeatured.image}
                  alt={mainFeatured.title}
                  width={1400}
                  height={920}
                  className="hover-lift image-frame h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-label text-muted">
                  {formatDate(mainFeatured.date)} · {mainFeatured.readingTime}
                </p>
                <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">
                  <Link href={`/case-studies/${mainFeatured.slug}`} className="transition-colors hover:text-accent">
                    {mainFeatured.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-muted">{mainFeatured.summary}</p>
                <p className="font-mono text-xs uppercase tracking-label text-accent">
                  Result: {mainFeatured.impact ?? "Operational improvements"}
                </p>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {mainFeatured.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-label text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          {secondaryFeatured.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {secondaryFeatured.map((post) => (
                <article key={post.slug} className="surface-card overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden border-b border-border">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1200}
                      height={760}
                      className="hover-lift image-frame h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-serif text-2xl leading-tight text-text">
                      <Link href={`/case-studies/${post.slug}`} className="transition-colors hover:text-accent">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">{post.summary}</p>
                    <p className="font-mono text-xs uppercase tracking-label text-accent">
                      {post.impact ?? "Operational improvements"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-6">
        <p className="font-mono text-xs uppercase tracking-label text-muted">All case studies</p>

        <div className="grid gap-4 md:grid-cols-2">
          {regularPosts.map((post) => (
            <article key={post.slug} className="surface-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden border-b border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={760}
                  className="hover-lift image-frame h-full w-full object-cover"
                />
              </div>

              <div className="space-y-3 p-4">
                <p className="font-mono text-xs uppercase tracking-label text-muted">
                  {formatDate(post.date)} · {post.readingTime}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-text">
                  <Link href={`/case-studies/${post.slug}`} className="transition-colors hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">{post.summary}</p>
                <p className="font-mono text-xs uppercase tracking-label text-accent">
                  Result: {post.impact ?? "Operational improvements"}
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

