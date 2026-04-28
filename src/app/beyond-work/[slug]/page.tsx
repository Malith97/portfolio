import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/photo-grid";
import { getAllBeyondWorkPosts, getBeyondWorkPostBySlug, type Post } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";

interface BeyondWorkPageProps {
  params: {
    slug: string;
  };
}

interface MetaItem {
  label: string;
  value: string;
}

function categoryType(category?: string): "run_ride" | "swim" | "visual" | "cooking" | "other" {
  const normalized = category?.toLowerCase() ?? "";

  if (normalized.includes("running") || normalized.includes("cycling")) return "run_ride";
  if (normalized.includes("swimming")) return "swim";
  if (normalized.includes("photography") || normalized.includes("videography")) return "visual";
  if (normalized.includes("cooking")) return "cooking";

  return "other";
}

function localizedCategory(category: string | undefined, t: ReturnType<typeof getDictionary>): string {
  const type = categoryType(category);

  if (type === "run_ride") {
    const normalized = category?.toLowerCase() ?? "";
    if (normalized.includes("running")) return t.beyondWorkPage.filters.running;
    return t.beyondWorkPage.filters.cycling;
  }
  if (type === "swim") return t.beyondWorkPage.filters.swimming;
  if (type === "visual") {
    const normalized = category?.toLowerCase() ?? "";
    if (normalized.includes("videography")) return t.beyondWorkPage.filters.videography;
    return t.beyondWorkPage.filters.photography;
  }
  if (type === "cooking") return t.beyondWorkPage.filters.cooking;
  return t.beyondWorkPage.filters.other;
}

function buildMetaItems(post: Post, t: ReturnType<typeof getDictionary>): MetaItem[] {
  const type = categoryType(post.category);
  const items: MetaItem[] = [];

  if (post.category) items.push({ label: t.beyondWorkDetail.category, value: localizedCategory(post.category, t) });
  items.push({ label: t.beyondWorkDetail.date, value: formatDate(post.date) });
  if (post.location) items.push({ label: t.beyondWorkDetail.location, value: post.location });

  if (type === "run_ride") {
    if (post.route) items.push({ label: t.beyondWorkDetail.route, value: post.route });
    if (post.distance) items.push({ label: t.beyondWorkDetail.distance, value: post.distance });
    if (post.duration) items.push({ label: t.beyondWorkDetail.duration, value: post.duration });
    if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
    if (post.difficulty) items.push({ label: t.beyondWorkDetail.difficulty, value: post.difficulty });
    if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.gear, value: post.gear.join(", ") });
  } else if (type === "visual") {
    if (post.theme) items.push({ label: t.beyondWorkDetail.theme, value: post.theme });
    if (post.photoCount) items.push({ label: t.beyondWorkDetail.photos, value: post.photoCount });
    if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.cameraGear, value: post.gear.join(", ") });
    if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
  } else if (type === "swim") {
    if (post.distance) items.push({ label: t.beyondWorkDetail.distance, value: post.distance });
    if (post.duration) items.push({ label: t.beyondWorkDetail.duration, value: post.duration });
    if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
    if (post.route) items.push({ label: t.beyondWorkDetail.session, value: post.route });
    if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.gear, value: post.gear.join(", ") });
    if (post.notes) items.push({ label: t.beyondWorkDetail.notes, value: post.notes });
  } else if (type === "cooking") {
    if (post.dishType) items.push({ label: t.beyondWorkDetail.dishType, value: post.dishType });
    if (post.cuisine) items.push({ label: t.beyondWorkDetail.cuisine, value: post.cuisine });
    if (post.timeSpent) items.push({ label: t.beyondWorkDetail.timeSpent, value: post.timeSpent });
    if (post.cookingTime) items.push({ label: t.beyondWorkDetail.cookingTime, value: post.cookingTime });
    if (post.difficulty) items.push({ label: t.beyondWorkDetail.difficulty, value: post.difficulty });
    if (post.whatITried) items.push({ label: t.beyondWorkDetail.whatITried, value: post.whatITried });
    if (post.whatILearned) items.push({ label: t.beyondWorkDetail.whatILearned, value: post.whatILearned });
  } else {
    if (post.route) items.push({ label: t.beyondWorkDetail.route, value: post.route });
    if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
    if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.gear, value: post.gear.join(", ") });
  }

  return items;
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
  const language = getServerLanguage();
  const t = getDictionary(language);

  const post = await getBeyondWorkPostBySlug(params.slug);
  const posts = await getAllBeyondWorkPosts();

  if (!post) {
    notFound();
  }

  const currentIndex = posts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const metaItems = buildMetaItems(post, t);
  const highlights = post.highlights.length > 0 ? post.highlights : post.tags;
  const type = categoryType(post.category);
  const kitchenLabel = type === "cooking" ? `${t.common.kitchenNotes} · ` : "";
  const localizedTitle = getLocalizedPostTitle(post.slug, post.title, language);
  const localizedSummary = getLocalizedPostSummary(post.slug, post.summary, language);
  const localizedCategoryLabel = post.category ? localizedCategory(post.category, t) : t.common.journal;
  const showEnglishBody = language !== "fi";

  return (
    <article className="space-y-12">
      <Link href="/beyond-work" className="quiet-link text-sm text-muted">
        {t.common.backToBeyondWork}
      </Link>

      <div className="space-y-8">
        <div className="aspect-[16/9] overflow-hidden rounded-md border border-border">
          <Image
            src={post.image}
            alt={localizedTitle}
            width={1600}
            height={900}
            className="hover-lift image-frame h-full w-full object-cover"
            priority
          />
        </div>

        <header className="space-y-4 border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {kitchenLabel}
            {localizedCategoryLabel} · {formatDate(post.date)}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-text sm:text-6xl">{localizedTitle}</h1>
          <p className="max-w-reading text-base leading-relaxed text-muted">{localizedSummary}</p>
        </header>
      </div>

      <section className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.fieldMetadata}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metaItems.map((item) => (
            <article key={`${item.label}-${item.value}`} className="surface-card p-4">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{item.label}</p>
              <p className="pt-1 text-sm leading-relaxed text-text">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      {type === "run_ride" && post.routeImage ? (
        <section className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.routeScreenshot}</p>
          <div className="aspect-[16/7] overflow-hidden rounded-md border border-border">
            <Image
              src={post.routeImage}
              alt={`${localizedTitle} ${t.common.routeScreenshot.toLowerCase()}`}
              width={1600}
              height={720}
              className="image-frame h-full w-full object-cover"
            />
          </div>
        </section>
      ) : null}

      {type === "cooking" ? (
        <section className="space-y-10">
          {post.personalNote ? (
            <div className="max-w-reading space-y-2">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.personalNote}</p>
              <p className="text-base leading-relaxed text-text">{post.personalNote}</p>
            </div>
          ) : null}

          {post.ingredients.length > 0 ? (
            <div className="max-w-reading space-y-3">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.ingredients}</p>
              <ul className="grid gap-2">
                {post.ingredients.map((ingredient) => (
                  <li key={ingredient} className="rounded-md border border-border px-3 py-2 text-sm text-text">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {post.steps.length > 0 ? (
            <div className="max-w-reading space-y-3">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.steps}</p>
              <ol className="space-y-2 text-sm leading-relaxed text-text">
                {post.steps.map((step, index) => (
                  <li key={`${step}-${index}`} className="rounded-md border border-border px-3 py-2">
                    <span className="font-mono text-xs uppercase tracking-label text-muted">{index + 1}.</span>{" "}
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}

      {highlights.length > 0 ? (
        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.highlights}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="rounded-md border border-border px-3 py-2 text-sm text-text">
                {highlight}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.story}</p>
        {showEnglishBody ? (
          <div className="content-prose max-w-reading" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        ) : (
          <p className="max-w-reading text-sm leading-relaxed text-muted">
            Tämän päiväkirjamerkinnän pitkä teksti on toistaiseksi saatavilla englanniksi.
          </p>
        )}
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.gallery}</p>
        <PhotoGrid images={post.photos} altBase={localizedTitle} aspectClass="aspect-[4/3]" />
      </section>

      {type === "cooking" && post.notesForNextTime.length > 0 ? (
        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {t.beyondWorkDetail.notesForNextTime}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {post.notesForNextTime.map((note) => (
              <li key={note} className="rounded-md border border-border px-3 py-2 text-sm text-text">
                {note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="grid gap-3 border-t border-border pt-8 sm:grid-cols-2" aria-label="Journal navigation">
        {previousPost ? (
          <Link href={`/beyond-work/${previousPost.slug}`} className="surface-card p-4">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.previous}</p>
            <p className="pt-1 font-serif text-xl text-text">
              {getLocalizedPostTitle(previousPost.slug, previousPost.title, language)}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link href={`/beyond-work/${nextPost.slug}`} className="surface-card p-4 sm:text-right">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.next}</p>
            <p className="pt-1 font-serif text-xl text-text">
              {getLocalizedPostTitle(nextPost.slug, nextPost.title, language)}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
