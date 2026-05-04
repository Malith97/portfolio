"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { FadeInOnView } from "@/components/motion/primitives";
import { getDictionary } from "@/lib/i18n";

const STORY_CHAPTER_IMAGES: Record<string, string> = {
  prologue: "/content/story/srilanka.webp",
  "chapter-01": "/content/story/old_computer.webp",
  "chapter-04": "/content/story/team.webp",
  "chapter-06": "/content/story/zebra.webp",
  "chapter-07": "/content/story/LSEG.webp",
  "chapter-08": "/content/story/tofinland.webp",
};

function StoryImage({
  src,
  alt,
  caption,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 760px",
}: {
  src: string;
  alt: string;
  caption: string;
  sizes?: string;
}) {
  return (
    <figure className="group space-y-2 pt-2">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,11,0.22),rgba(11,11,11,0))]" />
      </div>
      <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export function StoryPageContent() {
  const { language } = useLanguage();
  const content = useMemo(() => getDictionary(language).storyPage, [language]);
  const [activeChapterId, setActiveChapterId] = useState<string>(
    content.chapterNav[0]?.id ?? "prologue",
  );

  useEffect(() => {
    if (!content.chapterNav.length) {
      return;
    }

    const chapterIds = content.chapterNav.map((chapter) => chapter.id);
    const sections = chapterIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveChapterId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [content.chapterNav]);

  return (
    <article className="space-y-12">
      <header className="border-b border-border pb-10">
        <FadeInOnView className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {content.eyebrow}
          </p>
          <h1 className="max-w-[22ch] font-serif text-4xl leading-tight text-text sm:text-5xl">
            {content.title}
          </h1>
          <p className="max-w-[900px] text-base leading-8 text-muted sm:text-lg">
            {content.summary}
          </p>
        </FadeInOnView>
      </header>

      <section id="story-start" className="space-y-6">
        <p className="font-mono text-xs uppercase tracking-label text-muted">
          {content.timelineLabel}
        </p>

        <nav aria-label={content.timelineLabel} className="lg:hidden">
          <ul className="flex gap-2 overflow-x-auto pb-2">
            {content.chapterNav.map((chapter) => (
              <li key={chapter.id} className="shrink-0">
                <a
                  href={`#${chapter.id}`}
                  aria-current={
                    activeChapterId === chapter.id ? "location" : undefined
                  }
                  className={`inline-flex rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
                    activeChapterId === chapter.id
                      ? "border-accent/70 text-accent"
                      : "border-border text-muted hover:border-accent/60 hover:text-neutral-200"
                  }`}
                >
                  {chapter.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,760px)] lg:gap-12">
          <aside className="hidden lg:block">
            <nav aria-label={content.timelineLabel} className="sticky top-24">
              <ul className="space-y-2">
                {content.chapterNav.map((chapter) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      aria-current={
                        activeChapterId === chapter.id ? "location" : undefined
                      }
                      className={`block rounded-md border px-2.5 py-2 text-sm leading-relaxed transition-colors ${
                        activeChapterId === chapter.id
                          ? "border-accent/45 bg-accent/10 font-medium text-accent"
                          : "border-transparent text-muted hover:border-border hover:bg-surface/60 hover:text-neutral-200"
                      }`}
                    >
                      {chapter.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-12">
            {content.chapters.map((chapter, index) => {
              const chapterImageSrc = STORY_CHAPTER_IMAGES[chapter.id];

              return (
                <FadeInOnView
                  key={chapter.id}
                  delay={Math.min(index * 0.03, 0.2)}
                >
                  <section id={chapter.id} className="scroll-mt-24 space-y-4">
                    <p className="font-mono text-xs uppercase tracking-label text-accent">
                      {chapter.shortLabel}
                    </p>
                    <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">
                      {chapter.title}
                    </h2>
                    <div className="max-w-[760px] space-y-4 text-base leading-8 text-muted">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={`${chapter.id}-${paragraph.slice(0, 32)}`}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {chapterImageSrc &&
                    chapter.imageAlt &&
                    chapter.imageCaption ? (
                      <div className="pt-2">
                        <StoryImage
                          src={chapterImageSrc}
                          alt={chapter.imageAlt}
                          caption={chapter.imageCaption}
                        />
                      </div>
                    ) : null}
                  </section>
                </FadeInOnView>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
