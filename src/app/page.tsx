import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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

interface RecentExperiencePreview {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  impacts: string[];
  stackPreview: string[];
}

const RECENT_EXPERIENCE_PREVIEW: RecentExperiencePreview[] = [
  {
    role: "DevOps Engineer",
    company: "London Stock Exchange Group",
    location: "Finland",
    period: "2023–2025",
    summary:
      "Operating and scaling regulated financial systems where downtime directly impacts trading operations.",
    impacts: [
      "Reduced cloud costs by 35% (~$75K/year) through governance across multi-account environments",
      "Led migration of regulated workloads to cloud with secure architecture",
      "Introduced Chaos Engineering, reducing downtime by 20%",
      "Reduced deployment and provisioning time by 40%",
      "Designed secure Kubernetes architecture (RBAC + segmentation)"
    ],
    stackPreview: [
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "ArgoCD",
      "Ansible",
      "Terraform",
      "AWS",
      "Azure",
      "Python",
      "Go",
      "Jira",
      "Confluence",
      "Prometheus",
      "Grafana",
      "Datadog",
      "PostgreSQL"
    ]
  },
  {
    role: "DevOps Engineer",
    company: "Zebra Technologies",
    location: "Sri Lanka",
    period: "2022–2023",
    summary:
      "Led DevOps transformation across SDK engineering teams, improving delivery speed, reliability, and cloud adoption at scale.",
    impacts: [
      "Built CI/CD pipelines from scratch, reducing deployment time by 50%",
      "Led cloud migration to Azure, improving scalability and security",
      "Improved engineering productivity by 30%",
      "Reduced QA effort by 40% through automation",
      "Reduced operational overhead by 40%"
    ],
    stackPreview: [
      "Jenkins",
      "Docker",
      "Kubernetes",
      "ArgoCD",
      "GitHub Actions",
      "Azure",
      "Python",
      "Shell",
      "Jira",
      "Prometheus",
      "Grafana",
      "MongoDB",
      "PostgreSQL",
      "Selenium"
    ]
  }
];

const METRIC_HIGHLIGHT_SPLIT_REGEX = /(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)/g;
const METRIC_HIGHLIGHT_MATCH_REGEX = /^(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)$/;

function renderMetricText(text: string): ReactNode {
  return text.split(METRIC_HIGHLIGHT_SPLIT_REGEX).map((part, index) => {
    if (part.length === 0) {
      return null;
    }

    if (METRIC_HIGHLIGHT_MATCH_REGEX.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-accent">
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function toConciseSummary(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  const [firstSentence] = normalized.split(/(?<=[.!?])\s+/);
  const concise = firstSentence && firstSentence.length > 0 ? firstSentence : normalized;

  if (concise.length <= 150) {
    return concise;
  }

  return `${concise.slice(0, 147).trimEnd()}…`;
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
          experienceLabel: "Recent Experience",
          experienceTitle: "Trusted with business-critical cloud systems",
          experienceDescription:
            "Designing and operating systems where reliability is not optional.",
          impactLabel: "Impact",
          stackPreviewLabel: "Stack preview",
          viewFullExperience: "Explore full experience →",
          selectedWorkDescription: "Vain vahvimmat, tulospohjaiset toimitukset.",
          beyondWorkDescription:
            "Tavoitteellinen tekeminen työn ulkopuolella: juoksu, pyöräily ja keittiöprojektit, jotka tukevat jatkuvuutta ja luovuutta.",
          fallbackOutcome: "Operatiiviset parannukset",
          viewCaseStudy: "View case study →",
          viewEntry: "Read entry →"
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
          experienceLabel: "Recent Experience",
          experienceTitle: "Trusted with business-critical cloud systems",
          experienceDescription:
            "Designing and operating systems where reliability is not optional.",
          impactLabel: "Impact",
          stackPreviewLabel: "Stack preview",
          viewFullExperience: "Explore full experience →",
          selectedWorkDescription: "Only the strongest outcome-focused deliveries.",
          beyondWorkDescription:
            "Personal consistency outside work: running, cycling, and cooking sessions that reinforce discipline and creativity.",
          fallbackOutcome: "Operational improvements",
          viewCaseStudy: "View case study →",
          viewEntry: "Read entry →"
        };

  return (
    <div className="space-y-20">
      <section className="relative isolate grid gap-8 overflow-hidden border-b border-border pb-12 md:overflow-visible lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <HeroAmbientBackground />

        <HeroStagger className="relative z-10 max-w-3xl space-y-6">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.label}</p>

          <HeroTitleReveal className="max-w-[16ch] font-serif text-4xl leading-[1.06] text-text sm:max-w-[18ch] sm:text-5xl lg:max-w-[20ch] lg:text-6xl">
            {t.home.heroTitle}
          </HeroTitleReveal>

          <HeroStaggerItem delay={0.56}>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{t.home.heroSummary}</p>
          </HeroStaggerItem>

          <p
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1 font-mono text-xs text-text shadow-[0_0_14px_rgba(0,0,0,0.35)]"
            aria-label="Current location: Finland"
          >
            <span className="status-dot" aria-hidden="true">
              <span className="status-dot-pulse" />
            </span>
            Currently in Finland 🇫🇮
          </p>

          <p className="font-mono text-xs uppercase tracking-label text-accent">{t.home.heroMeta}</p>

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

        <div className="relative z-10 mx-auto w-full max-w-[396px] translate-y-2 sm:max-w-[408px] sm:translate-y-3 md:max-w-[420px] md:translate-y-4 lg:mx-0 lg:max-w-[430px] lg:translate-y-5 lg:justify-self-end">
          <div className="relative overflow-visible">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,158,92,0.34)_0%,rgba(255,158,92,0.18)_38%,rgba(255,158,92,0.08)_56%,rgba(11,11,11,0)_78%)] blur-3xl"
            />
            <figure className="relative w-full rounded-2xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.95rem]">
                <Image
                  src={HERO_PORTRAIT_SRC}
                  alt="Portrait of Malith Ileperuma"
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 54vw, 430px"
                  className="origin-top scale-[1.03] object-cover object-[50%_22%] sm:scale-[1.04] sm:object-[50%_21%] md:scale-[1.05] md:object-[50%_20%] lg:scale-[1.07] lg:object-[50%_18%] drop-shadow-[0_18px_28px_rgba(0,0,0,0.38)]"
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
                    {item.companyUrl ? (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-muted transition-colors hover:text-accent"
                      >
                        {item.company}
                      </a>
                    ) : (
                      <p className="text-sm text-muted">{item.company}</p>
                    )}
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.experienceLabel}</p>
            <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{copy.experienceTitle}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">{copy.experienceDescription}</p>
          </div>
          <Link
            href="/work-education"
            className="inline-flex items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b0b0b] transition-colors hover:bg-[#f1cc74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {copy.viewFullExperience}
          </Link>
        </div>

        <StaggerInView className="grid gap-4 md:grid-cols-2">
          {RECENT_EXPERIENCE_PREVIEW.map((item, index) => {
            const normalizedCompany = item.company.toLowerCase();
            const matchingExperience = workExperience.find((workItem) =>
              workItem.company.toLowerCase().includes(normalizedCompany)
            );
            const companyLogo = matchingExperience ? resolveCompanyLogo(matchingExperience) : null;

            return (
              <StaggerItem key={`${item.company}-${item.period}`} delay={index * 0.05} className="h-full">
                <HoverLift className="h-full" glow>
                  <article className="surface-card surface-card-interactive flex h-full min-h-[330px] flex-col p-5">
                    <header className="space-y-3 border-b border-border pb-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-[#101010] shadow-[inset_0_0_0_1px_rgba(242,199,91,0.06)] sm:h-16 sm:w-16">
                          {companyLogo ? (
                            <Image
                              src={companyLogo}
                              alt={`${item.company} logo`}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <span aria-hidden="true" className="inline-flex h-full w-full items-center justify-center font-mono text-xs font-semibold uppercase text-accent/90">
                              {getCompanyInitials(item.company)}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0">
                              <h3 className="font-serif text-2xl leading-tight text-text">{item.role}</h3>
                              <p className="text-sm text-muted">
                                {item.company} · {item.location}
                              </p>
                            </div>
                            <p className="font-mono text-[11px] uppercase tracking-label text-muted sm:pt-1 sm:text-right">
                              {item.period}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="pt-1 text-sm leading-relaxed text-muted">{item.summary}</p>
                    </header>

                    <div className="mt-1 space-y-3 border-t border-border/70 pt-4">
                      <div className="space-y-2">
                        <p className="font-mono text-xs font-semibold uppercase tracking-label text-text">{copy.impactLabel}</p>
                        <ul className="space-y-1.5 text-sm leading-relaxed text-muted">
                          {item.impacts.map((impactText) => (
                            <li key={`${item.company}-${impactText}`} className="flex items-start gap-2 text-text">
                              <span className="pt-0.5 text-accent" aria-hidden="true">
                                •
                              </span>
                              <span>{renderMetricText(impactText)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.stackPreviewLabel}</p>
                        <ul className="flex flex-wrap gap-2">
                          {item.stackPreview.map((tool) => (
                            <TechBadge key={`${item.company}-${tool}`} tool={tool} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerInView>
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
                    {toConciseSummary(getLocalizedPostSummary(post.slug, post.summary, language))}
                  </p>
                  <p className="pt-4 font-mono text-xs uppercase tracking-label text-accent">
                    {t.common.result}: {post.impact ?? copy.fallbackOutcome}
                  </p>
                  <Link
                    href={`/case-studies/${post.slug}`}
                    className="mt-auto pt-5 text-sm font-medium text-accent transition-colors hover:text-[#f1cc74]"
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
                    className="mt-auto pt-5 text-sm font-medium text-accent transition-colors hover:text-[#f1cc74]"
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
