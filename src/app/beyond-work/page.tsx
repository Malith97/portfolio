import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

const filters = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "cycling", label: "Cycling" },
  { key: "swimming", label: "Swimming" },
  { key: "photography", label: "Photography" },
  { key: "videography", label: "Videography" },
  { key: "other", label: "Other" }
] as const;

type FilterKey = (typeof filters)[number]["key"];

interface BeyondWorkPageProps {
  searchParams?: {
    category?: string | string[];
  };
}

function normalizeFilter(input?: string | string[]): FilterKey {
  const value = Array.isArray(input) ? input[0] : input;
  const normalized = value?.toLowerCase();
  return filters.some((filter) => filter.key === normalized) ? (normalized as FilterKey) : "all";
}

function toFilterKey(category?: string): Exclude<FilterKey, "all"> {
  const normalized = category?.toLowerCase() ?? "";

  if (normalized.includes("running")) return "running";
  if (normalized.includes("cycling")) return "cycling";
  if (normalized.includes("swimming")) return "swimming";
  if (normalized.includes("photography")) return "photography";
  if (normalized.includes("videography")) return "videography";

  return "other";
}

export const metadata = createMetadata({
  title: "Beyond Work",
  description: "A personal journal of running, cycling, swimming, photography, videography, and journeys.",
  path: "/beyond-work"
});

export default async function BeyondWorkPage({ searchParams }: BeyondWorkPageProps) {
  const selectedFilter = normalizeFilter(searchParams?.category);
  const posts = await getAllBeyondWorkPosts();

  const filteredPosts =
    selectedFilter === "all"
      ? posts
      : posts.filter((post) => toFilterKey(post.category) === selectedFilter);

  return (
    <div className="space-y-14">
      <SectionHeading
        label="Beyond Work"
        title="Image-focused journal"
        description="A personal log of training, routes, and visual notes outside engineering work."
      />

      <nav aria-label="Beyond work categories" className="-mt-4 border-b border-border pb-5">
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const href = filter.key === "all" ? "/beyond-work" : `/beyond-work?category=${filter.key}`;
            const isActive = selectedFilter === filter.key;

            return (
              <li key={filter.key}>
                <Link
                  href={href}
                  className={`inline-flex rounded-md border px-3 py-1.5 text-xs uppercase tracking-label transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {filter.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-7">
        {filteredPosts.map((post) => {
          const extraImages = post.images.slice(1, 5);

          return (
            <article key={post.slug} className="surface-card overflow-hidden p-4 sm:p-5">
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-label text-muted">
                    {post.category ?? "Journal"} · {post.location ?? "Finland"}
                  </p>
                  <h2 className="font-serif text-3xl leading-tight text-text">
                    <Link href={`/beyond-work/${post.slug}`} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-label text-muted">
                    {formatDate(post.date)} · {post.readingTime}
                  </p>
                  <p className="max-w-reading text-sm leading-relaxed text-muted">{post.summary}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2 aspect-[16/10] overflow-hidden rounded-md border border-border">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1400}
                      height={880}
                      className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                    />
                  </div>

                  {extraImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="aspect-[4/3] overflow-hidden rounded-md border border-border">
                      <Image
                        src={image}
                        alt={`${post.title} supporting photo ${index + 1}`}
                        width={900}
                        height={680}
                        className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

