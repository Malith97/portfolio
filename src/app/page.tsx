import Image from "next/image";
import Link from "next/link";

import {
  FadeInOnView,
  HeroAmbientBackground,
  HeroCtaRow,
  HeroStagger,
  HeroStaggerItem,
  HeroTitleReveal,
  HoverLift,
  StaggerInView,
  StaggerItem
} from "@/components/motion/primitives";
import { TechBadge, TechIcon } from "@/components/tech-badge";
import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";
import {
  type ExperienceItem,
  certifications,
  experienceTimeline,
  getLocalizedText,
  professionalSummary,
  selectedBeyondWorkSlugs,
  selectedCaseStudySlugs,
  sortExperienceByMostRecent,
  toolCategories
} from "@/lib/profile";

function selectItemsBySlug<T extends { slug: string }>(items: T[], slugs: readonly string[], limit: number): T[] {
  const selected: T[] = slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is T => Boolean(item));

  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const selectedSlugs = new Set(selected.map((item) => item.slug));
  const fallback = items.filter((item) => !selectedSlugs.has(item.slug)).slice(0, limit - selected.length);
  return [...selected, ...fallback];
}

function localizeBeyondCategory(
  category: string | undefined,
  language: "eng" | "fi",
  t: ReturnType<typeof getDictionary>
): string {
  if (!category) {
    return t.common.journal;
  }

  if (language === "eng") {
    return category;
  }

  const normalized = category.toLowerCase();
  if (normalized.includes("running")) return t.beyondWorkPage.filters.running;
  if (normalized.includes("cycling")) return t.beyondWorkPage.filters.cycling;
  if (normalized.includes("swimming")) return t.beyondWorkPage.filters.swimming;
  if (normalized.includes("photography")) return t.beyondWorkPage.filters.photography;
  if (normalized.includes("videography")) return t.beyondWorkPage.filters.videography;
  if (normalized.includes("cooking")) return t.beyondWorkPage.filters.cooking;

  return t.beyondWorkPage.filters.other;
}

const HERO_PORTRAIT_SRC = "/media/malith-portrait.png";

const COMPANY_LOGO_FALLBACK_MAP: Array<{ keyword: string; logo: string }> = [
  { keyword: "almosafer", logo: "/logos/almosafer.svg" },
  { keyword: "oracle", logo: "/logos/oracle.svg" },
  { keyword: "london stock exchange", logo: "/logos/london-stock-exchange.png" },
  { keyword: "zebra", logo: "/logos/zebra-technologies.png" },
  { keyword: "sy labs", logo: "/logos/sylabs.png" },
  { keyword: "sylabs", logo: "/logos/sylabs.png" }
];

function resolveCompanyLogo(item: ExperienceItem): string | null {
  if (item.companyLogo) {
    return item.companyLogo;
  }

  const normalized = item.company.toLowerCase();
  const mapped = COMPANY_LOGO_FALLBACK_MAP.find((entry) => normalized.includes(entry.keyword));
  return mapped?.logo ?? null;
}

function getCompanyInitials(company: string): string {
  const words = company
    .split(/[\s&/-]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "CO";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export default async function HomePage() {
  const language = getServerLanguage();
  const t = getDictionary(language);

  const caseStudies = await getAllCaseStudies();
  const beyondWorkPosts = await getAllBeyondWorkPosts();

  const selectedWork = selectItemsBySlug(caseStudies, selectedCaseStudySlugs, 3);
  const selectedBeyondWork = selectItemsBySlug(beyondWorkPosts, selectedBeyondWorkSlugs, 3);

  const workExperience = sortExperienceByMostRecent(experienceTimeline.filter((item) => item.kind === "work"));
  const educationItems = sortExperienceByMostRecent(experienceTimeline.filter((item) => item.kind === "education"));
  const homepageCertifications = certifications.slice(0, 5);

  const copy =
    language === "fi"
      ? {
          summaryLabel: "Yhteenveto",
          summaryTitle: "Ammatillinen yhteenveto",
          educationLabel: "Koulutus",
          certificationsLabel: "Sertifikaatit",
          certificationsDescription: "Ajantasainen näkymä ydinsertifikaateista.",
          pastCertificationLabel: "Vanhentunut",
          toolsLabel: "Työkalut ja teknologiat",
          toolsDescription: "Ryhmät nopeaan arviointiin rekrytoijille ja tiiminvetäjille.",
          experienceLabel: "Kokemus",
          experienceTitle: "Kokemus yhdellä silmäyksellä",
          experienceDescription: "Rooli, vaikutus ja tekninen pinopaino ilman ylimääräistä kohinaa.",
          keyImpact: "Keskeinen vaikutus",
          techStack: "Tekninen pino",
          selectedWorkDescription: "Vain vahvimmat, tulospohjaiset toimitukset.",
          beyondWorkDescription:
            "Tavoitteellinen tekeminen työn ulkopuolella: juoksu, pyöräily ja keittiöprojektit, jotka tukevat jatkuvuutta ja luovuutta.",
          fallbackOutcome: "Operatiiviset parannukset",
          viewCaseStudy: "Avaa tapaustutkimus",
          viewEntry: "Avaa merkintä"
        }
      : {
          summaryLabel: "Summary",
          summaryTitle: "Professional summary",
          educationLabel: "Education",
          certificationsLabel: "Certifications",
          certificationsDescription: "Compact view of core certifications.",
          pastCertificationLabel: "Expired",
          toolsLabel: "Tools & Technologies",
          toolsDescription: "Organized for quick recruiter and hiring-manager scanning.",
          experienceLabel: "Experience",
          experienceTitle: "Experience at a glance",
          experienceDescription: "Role, impact, and stack context without noise.",
          keyImpact: "Key impact",
          techStack: "Tech stack",
          selectedWorkDescription: "Only the strongest outcome-focused deliveries.",
          beyondWorkDescription:
            "Personal consistency outside work: running, cycling, and cooking sessions that reinforce discipline and creativity.",
          fallbackOutcome: "Operational improvements",
          viewCaseStudy: "Open case study",
          viewEntry: "Open entry"
        };

  return (
    <div className="space-y-20">
      <section className="relative isolate grid gap-8 overflow-hidden border-b border-border pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <HeroAmbientBackground />

        <HeroStagger className="relative z-10 max-w-3xl space-y-6">
          <HeroStaggerItem>
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.label}</p>
          </HeroStaggerItem>

          <HeroTitleReveal className="font-serif text-4xl leading-tight text-text sm:text-5xl lg:text-6xl">
            {t.home.heroTitle}
          </HeroTitleReveal>

          <HeroStaggerItem>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{t.home.heroSummary}</p>
          </HeroStaggerItem>

          <HeroStaggerItem>
            <p
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1 font-mono text-xs text-text shadow-[0_0_14px_rgba(0,0,0,0.35)]"
              aria-label="Current location: Finland"
            >
              <span className="status-dot" aria-hidden="true">
                <span className="status-dot-pulse" />
              </span>
              Currently in Finland 🇫🇮
            </p>
          </HeroStaggerItem>

          <HeroStaggerItem>
            <p className="font-mono text-xs uppercase tracking-label text-accent">{t.home.heroMeta}</p>
          </HeroStaggerItem>

          <HeroCtaRow className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/case-studies"
              className="inline-flex items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b0b0b] transition-colors hover:bg-[#f1cc74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.home.ctaViewWork}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.home.ctaDownloadResume}
            </Link>
          </HeroCtaRow>
        </HeroStagger>

        <div className="relative z-10 mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
          <div className="relative overflow-visible">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,158,92,0.34)_0%,rgba(255,158,92,0.18)_38%,rgba(255,158,92,0.08)_56%,rgba(11,11,11,0)_78%)] blur-3xl"
            />
            <figure className="relative rounded-2xl">
              <div className="relative aspect-[4/5] rounded-[0.95rem]">
                <Image
                  src={HERO_PORTRAIT_SRC}
                  alt="Portrait of Malith Ileperuma"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain object-center drop-shadow-[0_18px_28px_rgba(0,0,0,0.38)]"
                  priority
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <FadeInOnView className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.summaryLabel}</p>
          <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{copy.summaryTitle}</h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            {professionalSummary.map((paragraph) => (
              <p key={paragraph.eng}>{getLocalizedText(paragraph, language)}</p>
            ))}
          </div>
        </FadeInOnView>

        <div className="space-y-4">
          <FadeInOnView delay={0.05}>
            <article className="surface-card h-full space-y-4 p-5">
              <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.educationLabel}</p>
              <ul className="space-y-3">
                {educationItems.map((item) => (
                  <li key={`${item.role}-${item.period}`} className="border-l-2 border-border pl-3">
                    <p className="text-sm font-semibold text-text">{item.role}</p>
                    <p className="text-sm text-muted">{item.company}</p>
                    <p className="font-mono text-[11px] uppercase tracking-label text-muted">{item.period}</p>
                  </li>
                ))}
              </ul>
            </article>
          </FadeInOnView>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.toolsLabel}</p>
          <p className="text-sm text-muted">{copy.toolsDescription}</p>
        </div>

        <StaggerInView className="grid items-stretch gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {toolCategories.map((category, index) => (
            <StaggerItem key={category.label.eng} delay={index * 0.06} className="h-full">
              <HoverLift className="h-full" glow>
                <article className="surface-card surface-card-interactive flex h-full min-h-[220px] flex-col p-4">
                  <h3 className="font-serif text-xl text-text">{getLocalizedText(category.label, language)}</h3>
                  <ul className="mt-3 grid gap-2">
                    {category.tools.map((tool) => (
                      <li
                        key={`${category.label.eng}-${tool}`}
                        className="flex items-center gap-2 rounded-md border border-border/70 bg-background/45 px-2.5 py-1.5"
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center" role="img" aria-label={`${tool} icon`}>
                          <TechIcon tool={tool} className="h-4 w-4" />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-label text-muted">{tool}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerInView>
      </section>

      <section id="certifications" className="space-y-5 scroll-mt-24">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.certificationsLabel}</p>
          <p className="text-sm text-muted">{copy.certificationsDescription}</p>
        </div>

        <StaggerInView className="grid items-stretch gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {homepageCertifications.map((certification, index) => (
            <StaggerItem key={certification.name} delay={index * 0.05} className="h-full">
              <article className="surface-card surface-card-interactive flex h-full min-h-[122px] items-center p-3 sm:min-h-[130px] sm:p-4">
                <div className="flex w-full items-center gap-3.5">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border/75 bg-[#101010] shadow-[inset_0_0_0_1px_rgba(242,199,91,0.04)] sm:h-14 sm:w-14">
                    {certification.icon ? (
                      <Image
                        src={certification.icon}
                        alt={`${certification.name} badge`}
                        width={56}
                        height={56}
                        className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex h-10 w-10 items-center justify-center font-mono text-xs font-semibold uppercase text-accent/90 sm:h-12 sm:w-12"
                      >
                        {getCompanyInitials(certification.issuer)}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-snug text-text">{certification.name}</p>
                    <p className="text-xs leading-snug text-muted">{certification.provider}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-accent">
                        {certification.issuer}
                      </span>
                      {certification.status === "expired" ? (
                        <span className="font-mono text-[10px] uppercase tracking-label text-muted">
                          {copy.pastCertificationLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerInView>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.experienceLabel}</p>
          <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{copy.experienceTitle}</h2>
          <p className="text-sm text-muted">{copy.experienceDescription}</p>
        </div>

        <div className="relative space-y-5">
          <span className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />

          {workExperience.map((item, index) => {
            const companyLogo = resolveCompanyLogo(item);

            return (
              <FadeInOnView key={`${item.role}-${item.period}`} delay={index * 0.05} className="relative">
                <span
                  className="absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-accent/80 bg-background shadow-[0_0_0_1px_rgba(242,199,91,0.12)] md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                />
                <article
                  className={`surface-card surface-card-interactive relative ml-12 flex min-h-[360px] flex-col px-5 py-5 shadow-soft hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:ml-0 md:w-[calc(50%-1.75rem)] ${
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <header className="space-y-3 border-b border-border pb-4">
                    <p className="font-mono text-xs uppercase tracking-label text-muted">{item.period}</p>
                    <div className="flex items-start gap-3">
                      <span className="logo-tile mt-0.5 shrink-0">
                        {companyLogo ? (
                          <Image
                            src={companyLogo}
                            alt={`${item.company} logo`}
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px] object-contain"
                          />
                        ) : (
                          <span aria-hidden="true" className="font-mono text-[9px] font-semibold uppercase text-accent/90">
                            {getCompanyInitials(item.company)}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl leading-tight text-text">{item.role}</h3>
                        <p className="text-sm text-muted">{item.company}</p>
                      </div>
                    </div>
                    <p className="pt-2 text-sm leading-relaxed text-muted">
                      {getLocalizedText(item.summary, language)}
                    </p>
                  </header>

                  <div className="flex flex-1 flex-col justify-between gap-4 pt-4">
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.keyImpact}</p>
                      <ul className="space-y-2 text-sm leading-relaxed text-muted">
                        {item.impactBullets.map((bullet) => (
                          <li key={bullet.eng}>• {getLocalizedText(bullet, language)}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.techStack}</p>
                      <ul className="flex flex-wrap gap-2">
                        {item.tech.map((tech) => (
                          <TechBadge key={tech} tool={tech} />
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </FadeInOnView>
            );
          })}
        </div>
      </section>

      <section className="space-y-6 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.selectedWorkLabel}</p>
            <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{t.home.selectedWorkTitle}</h2>
            <p className="text-sm text-muted">{copy.selectedWorkDescription}</p>
          </div>
          <Link href="/case-studies" className="quiet-link text-sm text-accent">
            {t.common.viewAll}
          </Link>
        </div>

        <StaggerInView className="grid gap-4 md:grid-cols-3">
          {selectedWork.map((post, index) => (
            <StaggerItem key={post.slug} delay={index * 0.06} className="h-full">
              <HoverLift className="h-full" glow>
                <article className="surface-card surface-card-interactive flex h-full min-h-[320px] flex-col p-5">
                  <p className="font-mono text-xs uppercase tracking-label text-muted">{formatDate(post.date)}</p>
                  <h3 className="pt-2 font-serif text-2xl leading-tight text-text">
                    {getLocalizedPostTitle(post.slug, post.title, language)}
                  </h3>
                  <p className="pt-2 text-sm leading-relaxed text-muted">
                    {getLocalizedPostSummary(post.slug, post.summary, language)}
                  </p>
                  <p className="pt-4 font-mono text-xs uppercase tracking-label text-accent">
                    {t.common.result}: {post.impact ?? copy.fallbackOutcome}
                  </p>
                  <Link
                    href={`/case-studies/${post.slug}`}
                    className="mt-auto pt-5 text-sm text-text transition-colors hover:text-accent"
                  >
                    {copy.viewCaseStudy}
                  </Link>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerInView>
      </section>

      <section className="space-y-6 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.photoNotesLabel}</p>
            <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{t.home.photoNotesTitle}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">{copy.beyondWorkDescription}</p>
          </div>
          <Link href="/beyond-work" className="quiet-link text-sm text-accent">
            {t.common.viewJournal}
          </Link>
        </div>

        <StaggerInView className="grid gap-4 md:grid-cols-3">
          {selectedBeyondWork.map((post, index) => (
            <StaggerItem key={post.slug} delay={index * 0.06}>
              <HoverLift glow>
                <article className="surface-card flex h-full flex-col p-5">
                  <p className="font-mono text-xs uppercase tracking-label text-muted">
                    {localizeBeyondCategory(post.category, language, t).toUpperCase()} · {formatDate(post.date)}
                  </p>
                  <h3 className="pt-2 font-serif text-2xl leading-tight text-text">
                    {getLocalizedPostTitle(post.slug, post.title, language)}
                  </h3>
                  <p className="pt-2 text-sm leading-relaxed text-muted">
                    {getLocalizedPostSummary(post.slug, post.summary, language)}
                  </p>
                  <Link
                    href={`/beyond-work/${post.slug}`}
                    className="mt-auto pt-5 text-sm text-text transition-colors hover:text-accent"
                  >
                    {copy.viewEntry}
                  </Link>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerInView>
      </section>
    </div>
  );
}
