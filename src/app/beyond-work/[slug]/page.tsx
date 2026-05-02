import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BeyondWorkMap } from "@/components/BeyondWorkMap";
import { PhotoGrid } from "@/components/photo-grid";
import { SafeImage } from "@/components/safe-image";
import { getAllBeyondWorkPosts, getBeyondWorkPostBySlug, type Post } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";
import { DEFAULT_LANGUAGE, getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

interface BeyondWorkPageProps {
  params: {
    slug: string;
  };
}

interface MetaItem {
  label: string;
  value: string;
}

function categoryType(categoryId?: string, category?: string): "run_ride" | "visual" | "cooking" | "achievements" | "other" {
  const normalizedId = categoryId?.toLowerCase() ?? "";
  if (normalizedId === "running" || normalizedId === "cycling") return "run_ride";
  if (normalizedId === "cooking") return "cooking";
  if (normalizedId === "achievements") return "achievements";
  if (normalizedId === "other") return "other";

  const normalized = category?.toLowerCase() ?? "";

  if (normalized.includes("running") || normalized.includes("cycling")) return "run_ride";
  if (normalized.includes("photography")) return "visual";
  if (normalized.includes("cooking")) return "cooking";
  if (normalized.includes("achievements")) return "achievements";

  return "other";
}

function localizedCategory(categoryId: string | undefined, category: string | undefined, t: ReturnType<typeof getDictionary>): string {
  const type = categoryType(categoryId, category);
  const normalizedId = categoryId?.toLowerCase() ?? "";

  if (type === "run_ride") {
    if (normalizedId === "running") return t.beyondWorkPage.filters.running;
    if (normalizedId === "cycling") return t.beyondWorkPage.filters.cycling;
    const normalized = category?.toLowerCase() ?? "";
    if (normalized.includes("running")) return t.beyondWorkPage.filters.running;
    return t.beyondWorkPage.filters.cycling;
  }
  if (type === "visual") {
    return t.beyondWorkPage.filters.other;
  }
  if (type === "cooking") return t.beyondWorkPage.filters.cooking;
  if (type === "achievements") return t.beyondWorkPage.filters.achievements;
  return t.beyondWorkPage.filters.other;
}

function buildMetaItems(post: Post, t: ReturnType<typeof getDictionary>, language: "eng" | "fi"): MetaItem[] {
  const type = categoryType(post.categoryId, post.category);
  const items: MetaItem[] = [];

  if (post.category || post.categoryId) {
    items.push({ label: t.beyondWorkDetail.category, value: localizedCategory(post.categoryId, post.category, t) });
  }
  items.push({ label: t.beyondWorkDetail.date, value: formatDate(post.date, language) });
  if (post.location) items.push({ label: t.beyondWorkDetail.location, value: post.location });

  if (type === "run_ride") {
    if (post.route) items.push({ label: t.beyondWorkDetail.route, value: post.route });
    if (post.distance) items.push({ label: t.beyondWorkDetail.distance, value: post.distance });
    if (post.slug !== "cycling-to-hailuoto") {
      if (post.duration) items.push({ label: t.beyondWorkDetail.duration, value: post.duration });
      if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
      if (post.difficulty) items.push({ label: t.beyondWorkDetail.difficulty, value: post.difficulty });
      if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.gear, value: post.gear.join(", ") });
    }
  } else if (type === "visual") {
    if (post.theme) items.push({ label: t.beyondWorkDetail.theme, value: post.theme });
    if (post.photoCount) items.push({ label: t.beyondWorkDetail.photos, value: post.photoCount });
    if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.cameraGear, value: post.gear.join(", ") });
    if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
  } else if (type === "cooking") {
    if (post.dishType) items.push({ label: t.beyondWorkDetail.dishType, value: post.dishType });
    if (post.cuisine) items.push({ label: t.beyondWorkDetail.cuisine, value: post.cuisine });
    if (post.timeSpent) items.push({ label: t.beyondWorkDetail.timeSpent, value: post.timeSpent });
    if (post.cookingTime) items.push({ label: t.beyondWorkDetail.cookingTime, value: post.cookingTime });
    if (post.difficulty) items.push({ label: t.beyondWorkDetail.difficulty, value: post.difficulty });
    if (post.whatITried) items.push({ label: t.beyondWorkDetail.whatITried, value: post.whatITried });
    if (post.whatILearned) items.push({ label: t.beyondWorkDetail.whatILearned, value: post.whatILearned });
    if (post.sharedWith) items.push({ label: t.beyondWorkDetail.sharedWith, value: post.sharedWith });
  } else if (type === "achievements") {
    if (post.event) items.push({ label: t.beyondWorkDetail.event, value: post.event });
    if (post.duration) items.push({ label: t.beyondWorkDetail.duration, value: post.duration });
    if (post.result) items.push({ label: t.beyondWorkDetail.result, value: post.result });
    if (post.team) items.push({ label: t.beyondWorkDetail.team, value: post.team });
  } else {
    if (post.occasion) {
      items.push({ label: t.beyondWorkDetail.occasion, value: post.occasion });
      if (post.temperature) items.push({ label: t.beyondWorkDetail.temperature, value: post.temperature });
      if (post.distanceWalked) items.push({ label: t.beyondWorkDetail.distanceWalked, value: post.distanceWalked });
    } else {
      if (post.route) items.push({ label: t.beyondWorkDetail.route, value: post.route });
      if (post.weather) items.push({ label: t.beyondWorkDetail.weather, value: post.weather });
      if (post.gear.length > 0) items.push({ label: t.beyondWorkDetail.gear, value: post.gear.join(", ") });
    }
  }

  return items;
}

export async function generateStaticParams() {
  const posts = await getAllBeyondWorkPosts(DEFAULT_LANGUAGE);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BeyondWorkPageProps): Promise<Metadata> {
  const language = getServerLanguage();
  const t = getDictionary(language);
  const post = await getBeyondWorkPostBySlug(params.slug, language);

  if (!post) {
    return createMetadata({
      title: t.notFoundPage.label,
      path: `/beyond-work/${params.slug}`
    });
  }

  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/beyond-work/${post.slug}`,
    image: post.coverImage || post.image
  });
}

export default async function BeyondWorkDetailPage({ params }: BeyondWorkPageProps) {
  const language = getServerLanguage();
  const t = getDictionary(language);

  const post = await getBeyondWorkPostBySlug(params.slug, language);
  const posts = await getAllBeyondWorkPosts(language);

  if (!post) {
    notFound();
  }

  const currentIndex = posts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const metaItems = buildMetaItems(post, t, language);
  const highlights = post.highlights.length > 0 ? post.highlights : post.tags;
  const type = categoryType(post.categoryId, post.category);
  const kitchenLabel = type === "cooking" ? `${t.common.kitchenNotes} · ` : "";
  const localizedTitle = post.title;
  const localizedSummary = post.summary;
  const localizedCategoryLabel = post.category || post.categoryId
    ? localizedCategory(post.categoryId, post.category, t)
    : t.common.journal;
  const isCyclingToHailuoto = post.slug === "cycling-to-hailuoto";
  const isLumoLightFestival = post.slug === "lumo-light-festival-oulu";
  const isWeekendCookieBake = post.slug === "weekend-cookie-bake";
  const isSailorsHomeMuseum = post.slug === "sailors-home-museum-oulu";
  const shouldShowRouteSnapshot = type === "run_ride" && !isCyclingToHailuoto && !isLumoLightFestival;
  const shouldShowHighlights =
    highlights.length > 0 &&
    !isCyclingToHailuoto &&
    !isLumoLightFestival &&
    !isWeekendCookieBake &&
    !isSailorsHomeMuseum;
  const shouldShowStorySection = true;
  const galleryImages =
    (isCyclingToHailuoto || isLumoLightFestival) && post.coverImage
      ? post.photos.filter((image) => image !== post.coverImage)
      : post.photos;
  const storyLabel =
    post.slug === "cycling-to-kiiminki-from-oulu"
      ? t.beyondWorkDetail.rideStory
      : post.slug === "running-to-vartto"
        ? t.beyondWorkDetail.runStory
        : t.common.story;
  const ingredientGroups =
    post.slug === "coffee-cake-weekend-bake"
      ? [
          {
            label: t.beyondWorkDetail.ingredientGroups.base,
            items: [
              t.beyondWorkDetail.ingredientGroups.flour,
              t.beyondWorkDetail.ingredientGroups.bakingPowder,
              t.beyondWorkDetail.ingredientGroups.salt,
              t.beyondWorkDetail.ingredientGroups.eggs,
              t.beyondWorkDetail.ingredientGroups.milk,
              t.beyondWorkDetail.ingredientGroups.butter
            ]
          },
          {
            label: t.beyondWorkDetail.ingredientGroups.flavor,
            items: [
              t.beyondWorkDetail.ingredientGroups.coffee,
              t.beyondWorkDetail.ingredientGroups.brownSugar,
              t.beyondWorkDetail.ingredientGroups.vanilla
            ]
          },
          {
            label: t.beyondWorkDetail.ingredientGroups.finish,
            items: [
              t.beyondWorkDetail.ingredientGroups.heavyCream,
              t.beyondWorkDetail.ingredientGroups.roastedCashews
            ]
          }
        ]
      : [];

  return (
    <article className="space-y-12">
      <Link href="/beyond-work" className="quiet-link text-sm text-muted">
        {t.common.backToBeyondWork}
      </Link>

      <div className="space-y-8">
        <div className="aspect-[16/9] overflow-hidden rounded-md border border-border">
          <SafeImage
            src={post.image}
            alt={localizedTitle}
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="hover-lift image-frame h-full w-full object-cover"
            priority
          />
        </div>

        <header className="space-y-4 border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {kitchenLabel}
            {localizedCategoryLabel} · {formatDate(post.date, language)}
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

      {shouldShowRouteSnapshot ? (
        <BeyondWorkMap
          categoryId={post.categoryId}
          category={post.category}
          map={post.map}
          postTitle={localizedTitle}
          sectionLabel={t.common.routeSnapshot}
          className="space-y-4"
          view="detail"
        />
      ) : null}

      {type === "cooking" ? (
        <section className="space-y-6">
          {post.personalNote ? (
            <div className="max-w-reading space-y-2">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.personalNote}</p>
              <p className="text-base leading-relaxed text-text">{post.personalNote}</p>
            </div>
          ) : null}

          {post.ingredients.length > 0 ? (
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{t.beyondWorkDetail.ingredientsUsed}</p>
              {ingredientGroups.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {ingredientGroups.map((group) => (
                    <div key={group.label} className="space-y-2 rounded-md border border-border p-3">
                      <p className="font-mono text-[11px] uppercase tracking-label text-muted">{group.label}</p>
                      <ul className="flex flex-wrap gap-2">
                        {group.items.map((ingredient) => (
                          <li key={`${group.label}-${ingredient}`} className="rounded-md border border-border px-2.5 py-1 text-sm text-text">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {post.ingredients.map((ingredient) => (
                    <li key={ingredient} className="rounded-md border border-border px-2.5 py-1 text-sm text-text">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              )}
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

      {shouldShowHighlights ? (
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

      {shouldShowStorySection ? (
        <section className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{storyLabel}</p>
          <div
            className={isWeekendCookieBake ? "content-prose max-w-none" : "content-prose max-w-reading"}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </section>
      ) : null}

      <section className="space-y-4 border-t border-border pt-8">
        <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.gallery}</p>
        <PhotoGrid
          images={galleryImages}
          altBase={localizedTitle}
          aspectClass="aspect-[4/3]"
          labels={{
            openImage: t.common.openImage,
            closeImageViewer: t.common.closeImageViewer,
            previousImage: t.common.previousImage,
            nextImage: t.common.nextImage,
            imageViewer: t.common.imageViewer
          }}
          enableLightbox={
            post.slug === "cycling-to-kiiminki-from-oulu" ||
            post.slug === "cycling-to-hailuoto" ||
            post.slug === "running-to-vartto" ||
            post.slug === "oyster-hack4health-best-pitch-award" ||
            post.slug === "juhannus-oul" ||
            post.slug === "lumo-light-festival-oulu" ||
            post.slug === "coffee-cake-weekend-bake" ||
            post.slug === "frozen-sea-walk-nallikari" ||
            post.slug === "northern-lights-oulu"
          }
        />
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

      <nav className="grid gap-3 border-t border-border pt-8 sm:grid-cols-2" aria-label={t.beyondWorkDetail.journalNavigation}>
        {previousPost ? (
          <Link href={`/beyond-work/${previousPost.slug}`} className="surface-card block p-4">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.previous}</p>
            <p className="pt-1 font-serif text-xl text-text">
              {previousPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link href={`/beyond-work/${nextPost.slug}`} className="surface-card block p-4 sm:text-right">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.common.next}</p>
            <p className="pt-1 font-serif text-xl text-text">
              {nextPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
