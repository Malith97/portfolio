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

const CHAPTER_YEARS: Record<string, { eng: string; fi: string }> = {
  prologue: { eng: "Origin", fi: "Alku" },
  "chapter-01": { eng: "2006", fi: "2006" },
  "chapter-02": { eng: "Early years", fi: "Alkuvuodet" },
  "chapter-03": { eng: "University", fi: "Yliopisto" },
  "chapter-04": { eng: "2019-2021", fi: "2019-2021" },
  "chapter-05": { eng: "2021", fi: "2021" },
  "chapter-06": { eng: "2022-2023", fi: "2022-2023" },
  "chapter-07": { eng: "2023-2025", fi: "2023-2025" },
  "chapter-08": { eng: "2025", fi: "2025" },
  "chapter-09": { eng: "Now", fi: "Nyt" },
  epilogue: { eng: "Next", fi: "Seuraava" },
};

const CHAPTER_TAKEAWAYS: Record<string, { eng: string; fi: string }> = {
  prologue: {
    eng: "Trust is the through-line.",
    fi: "Luottamus kulkee koko tarinan läpi.",
  },
  "chapter-01": {
    eng: "Curiosity became systems thinking.",
    fi: "Uteliaisuudesta tuli systeemiajattelua.",
  },
  "chapter-02": {
    eng: "Learning came from taking things apart.",
    fi: "Oppiminen alkoi purkamisesta ja uudelleen rakentamisesta.",
  },
  "chapter-03": {
    eng: "Failure changed how I expose risk.",
    fi: "Epäonnistuminen muutti tapaani tuoda riskit näkyviin.",
  },
  "chapter-04": {
    eng: "Software became customer responsibility.",
    fi: "Ohjelmistosta tuli vastuuta käyttäjiä kohtaan.",
  },
  "chapter-05": {
    eng: "DevOps became developer empathy in practice.",
    fi: "DevOpsista tuli käytännön empatiaa kehittäjiä kohtaan.",
  },
  "chapter-06": {
    eng: "Automation made releases visible and repeatable.",
    fi: "Automaatio teki julkaisuista näkyviä ja toistettavia.",
  },
  "chapter-07": {
    eng: "Financial systems sharpened my judgment.",
    fi: "Finanssijärjestelmät terävöittivät harkintaani.",
  },
  "chapter-08": {
    eng: "Finland made progress quieter and deeper.",
    fi: "Suomi teki edistymisestä hiljaisempaa ja syvempää.",
  },
  "chapter-09": {
    eng: "I build calm, operable platforms.",
    fi: "Rakennan rauhallisia ja ylläpidettäviä alustoja.",
  },
  epilogue: {
    eng: "Bring me the messy reliability problem.",
    fi: "Tuo minulle sotkuinen luotettavuusongelma.",
  },
};

const CHAPTER_PULL_QUOTES: Record<string, { eng: string; fi: string }> = {
  prologue: {
    eng: "Trust is earned when people can hand you a hard problem and know you will bring back the truth.",
    fi: "Luottamus syntyy, kun vaikean ongelman voi antaa sinulle ja tietää, että tuot takaisin totuuden.",
  },
  "chapter-03": {
    eng: "Delivery alone was not the standard I wanted.",
    fi: "Pelkkä toimitus ei ollut se taso, johon halusin tyytyä.",
  },
  "chapter-06": {
    eng: "Release day became less dramatic.",
    fi: "Julkaisupäivästä tuli vähemmän dramaattinen.",
  },
  "chapter-07": {
    eng: "A deployment needed a rollback path. Access needed boundaries. Cost needed ownership.",
    fi: "Julkaisu tarvitsi paluupolun. Pääsy tarvitsi rajat. Kustannukset tarvitsivat omistajan.",
  },
  "chapter-09": {
    eng: "Make the path easy to use, hard to misuse, and clear when it fails.",
    fi: "Tee polusta helppo käyttää, vaikea käyttää väärin ja selkeä silloin kun se epäonnistuu.",
  },
  epilogue: {
    eng: "Look closely, understand the system, and leave it more trustworthy than I found it.",
    fi: "Katso tarkasti, ymmärrä järjestelmä ja jätä se luotettavammaksi kuin löysit sen.",
  },
};

const SCAN_POINTS = {
  eng: [
    "DevOps and cloud reliability",
    "Zebra delivery automation",
    "LSEG financial systems",
    "Finland, Oulu",
  ],
  fi: [
    "DevOps ja pilviluotettavuus",
    "Zebran toimitusautomaatio",
    "LSEG:n finanssijärjestelmät",
    "Suomi, Oulu",
  ],
};

function StoryImage({
  src,
  alt,
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 760px",
}: {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
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
          priority={priority}
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
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
  const localeKey = language === "fi" ? "fi" : "eng";
  const [activeChapterId, setActiveChapterId] = useState<string>(
    content.chapterNav[0]?.id ?? "prologue",
  );
  const [readingProgress, setReadingProgress] = useState(0);
  const activeChapterIndex = content.chapterNav.findIndex(
    (chapter) => chapter.id === activeChapterId,
  );
  const activeChapter =
    content.chapterNav[Math.max(activeChapterIndex, 0)] ?? content.chapterNav[0];
  const scanPoints = SCAN_POINTS[localeKey];
  const chapterCountSummary =
    language === "fi"
      ? `${content.chapters.length} lukua ensimmäisestä koneesta nykyiseen insinöörifilosofiaan.`
      : `${content.chapters.length} chapters from first machine to current engineering philosophy.`;
  const readingStatus =
    language === "fi"
      ? `Luet ${activeChapterIndex + 1} / ${content.chapterNav.length}`
      : `Reading ${activeChapterIndex + 1} / ${content.chapterNav.length}`;
  const chapterShortLabels = new Map(
    content.chapters.map((chapter) => [chapter.id, chapter.shortLabel]),
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

  useEffect(() => {
    const updateReadingProgress = () => {
      const storyElement = document.getElementById("story-start");

      if (!storyElement) {
        setReadingProgress(0);
        return;
      }

      const rect = storyElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const readableDistance = Math.max(
        storyElement.offsetHeight - viewportHeight,
        1,
      );
      const progress = Math.min(
        Math.max((Math.abs(rect.top) / readableDistance) * 100, 0),
        100,
      );

      setReadingProgress(progress);
    };

    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", updateReadingProgress);
    };
  }, []);

  return (
    <article className="relative space-y-10 sm:space-y-12">
      <div
        className="sticky top-0 z-20 h-1 bg-background/80"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent transition-[width] duration-150 motion-reduce:transition-none"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <header className="border-b border-border pb-8 sm:pb-10">
        <FadeInOnView className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {content.eyebrow}
          </p>
          <h1 className="max-w-[22ch] font-serif text-4xl leading-tight text-text sm:text-5xl">
            {content.title}
          </h1>
          <p className="max-w-[900px] text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {content.summary}
          </p>
          <ul
            aria-label="Story highlights"
            className="flex flex-wrap gap-2 pt-1"
          >
            {scanPoints.map((point) => (
              <li
                key={point}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-label text-muted"
              >
                {point}
              </li>
            ))}
          </ul>
        </FadeInOnView>
      </header>

      <section id="story-start" className="space-y-6">
        <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-label text-muted">
              {content.timelineLabel}
            </p>
            <p className="text-sm leading-6 text-muted">
              {chapterCountSummary}
            </p>
          </div>
          {activeChapter ? (
            <p
              className="font-mono text-xs uppercase tracking-label text-accent"
              aria-live="polite"
            >
              {readingStatus}
            </p>
          ) : null}
        </div>

        <nav aria-label={content.timelineLabel} className="lg:hidden">
          <ul className="flex snap-x gap-2 overflow-x-auto pb-2">
            {content.chapterNav.map((chapter) => (
              <li key={chapter.id} className="shrink-0 snap-start">
                <a
                  href={`#${chapter.id}`}
                  aria-current={
                    activeChapterId === chapter.id ? "location" : undefined
                  }
                  aria-label={chapter.label}
                  className={`inline-flex min-h-11 max-w-[220px] items-center rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors focus-visible:outline-accent ${
                    activeChapterId === chapter.id
                      ? "border-accent/70 text-accent"
                      : "border-border text-muted hover:border-accent/60 hover:text-neutral-200"
                  }`}
                >
                  <span aria-hidden="true">
                    {chapterShortLabels.get(chapter.id) ?? chapter.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,760px)] lg:gap-12">
          <aside className="hidden lg:block">
            <nav aria-label={content.timelineLabel} className="sticky top-24">
              <ol className="relative space-y-2 border-l border-border pl-4">
                {content.chapterNav.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      aria-current={
                        activeChapterId === chapter.id ? "location" : undefined
                      }
                      className={`group relative block rounded-md border px-3 py-2.5 text-sm leading-relaxed transition-colors focus-visible:outline-accent ${
                        activeChapterId === chapter.id
                          ? "border-accent/45 bg-accent/10 font-medium text-accent"
                          : "border-transparent text-muted hover:border-border hover:bg-surface/60 hover:text-neutral-200"
                      }`}
                    >
                      <span
                        className={`absolute -left-[1.44rem] top-4 h-2 w-2 rounded-full border ${
                          activeChapterId === chapter.id
                            ? "border-accent bg-accent"
                            : "border-border bg-background group-hover:border-accent/70"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="block font-mono text-[10px] uppercase tracking-label text-neutral-500">
                        {CHAPTER_YEARS[chapter.id]?.[localeKey] ??
                          `Part ${index + 1}`}
                      </span>
                      <span className="block">{chapter.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="space-y-12 sm:space-y-16">
            {content.chapters.map((chapter, index) => {
              const chapterImageSrc = STORY_CHAPTER_IMAGES[chapter.id];
              const chapterYear = CHAPTER_YEARS[chapter.id]?.[localeKey];
              const takeaway = CHAPTER_TAKEAWAYS[chapter.id]?.[localeKey];
              const pullQuote = CHAPTER_PULL_QUOTES[chapter.id]?.[localeKey];
              const isFirstChapter = index === 0;

              return (
                <FadeInOnView
                  key={chapter.id}
                  delay={Math.min(index * 0.03, 0.2)}
                >
                  <section
                    id={chapter.id}
                    aria-labelledby={`${chapter.id}-title`}
                    className="scroll-mt-24 border-t border-border/80 pt-8 first:border-t-0 first:pt-0"
                  >
                    <div className="grid gap-5 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <div className="space-y-2">
                        <p className="font-mono text-xs uppercase tracking-label text-accent">
                          {chapter.shortLabel}
                        </p>
                        {chapterYear ? (
                          <p className="font-mono text-[11px] uppercase tracking-label text-neutral-500">
                            <time>{chapterYear}</time>
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-5">
                        <header className="space-y-3">
                          <h2
                            id={`${chapter.id}-title`}
                            className="font-serif text-3xl leading-tight text-text sm:text-4xl"
                          >
                            {chapter.title}
                          </h2>
                          {takeaway ? (
                            <p className="max-w-[680px] border-l-2 border-accent/70 pl-4 text-sm leading-6 text-neutral-300">
                              {takeaway}
                            </p>
                          ) : null}
                        </header>

                        {pullQuote ? (
                          <blockquote className="max-w-[720px] rounded-lg border border-border bg-surface/45 px-4 py-4 font-serif text-xl leading-8 text-text sm:px-5 sm:text-2xl sm:leading-9">
                            {pullQuote}
                          </blockquote>
                        ) : null}

                        <div className="max-w-[760px] space-y-4 text-base leading-7 text-muted sm:text-[1.03rem] sm:leading-8">
                          {chapter.paragraphs.map((paragraph) => (
                            <p key={`${chapter.id}-${paragraph.slice(0, 32)}`}>
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {chapterImageSrc &&
                        chapter.imageAlt &&
                        chapter.imageCaption ? (
                          <div className="pt-3">
                            <StoryImage
                              src={chapterImageSrc}
                              alt={chapter.imageAlt}
                              caption={chapter.imageCaption}
                              priority={isFirstChapter}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
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
