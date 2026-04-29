import Image from "next/image";
import type { ReactNode } from "react";

import { SectionHeading } from "@/components/section-heading";
import { TechBadge } from "@/components/tech-badge";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";
import { type ExperienceItem, experienceTimeline, getLocalizedText, sortExperienceByMostRecent } from "@/lib/profile";

const COMPANY_LOGO_FALLBACK_MAP: Array<{ keyword: string; logo: string }> = [
  { keyword: "almosafer", logo: "/logos/almosafer.svg" },
  { keyword: "oracle", logo: "/logos/oracle.svg" },
  { keyword: "london stock exchange", logo: "/logos/london-stock-exchange.png" },
  { keyword: "zebra", logo: "/logos/zebra-technologies.png" },
  { keyword: "sy labs", logo: "/logos/sylabs.png" },
  { keyword: "sylabs", logo: "/logos/sylabs.png" }
];

const METRIC_HIGHLIGHT_SPLIT_REGEX = /(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)/g;
const METRIC_HIGHLIGHT_MATCH_REGEX = /^(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)$/;

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

function renderImpactText(text: string): ReactNode {
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

export const metadata = createMetadata({
  title: "Work & Education",
  description: "Work experience timeline and education highlights for Malith Ileperuma.",
  path: "/work-education"
});

export default function WorkEducationPage() {
  const language = getServerLanguage();
  const workExperience = sortExperienceByMostRecent(experienceTimeline.filter((item) => item.kind === "work"));
  const educationItems = sortExperienceByMostRecent(experienceTimeline.filter((item) => item.kind === "education"));

  const copy =
    language === "fi"
      ? {
          title: "Työ ja koulutus",
          description: "Rakennan ja operoin resilienttejä pilvijärjestelmiä korkean skaalan, liiketoimintakriittisiin ympäristöihin.",
          workSection: "Työkokemus",
          educationSection: "Koulutus",
          work: "Työ",
          impact: "Keskeinen vaikutus",
          stack: "Tekninen pino"
        }
      : {
          title: "Work & Education",
          description: "Building and operating resilient cloud systems for high-scale, business-critical environments.",
          workSection: "Work Experience",
          educationSection: "Education",
          work: "Work",
          impact: "Key impact",
          stack: "Tech stack"
        };

  return (
    <div className="space-y-16">
      <SectionHeading
        label={copy.title}
        title={copy.title}
        description={copy.description}
      />

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.workSection}</p>
        </div>

        <div className="relative space-y-4">
          <span
            className="absolute bottom-0 left-4 top-0 w-[1.5px] bg-border/90 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          {workExperience.map((item, index) => {
            const companyLogo = resolveCompanyLogo(item);
            const isSyLabs = item.company.toLowerCase().includes("sy labs");
            const impactBullets = [...item.impactBullets, ...(item.additionalImpactBullets ?? [])];

            return (
              <div key={`${item.role}-${item.period}`} className="relative">
                <span
                  className="absolute left-4 top-8 h-4 w-4 -translate-x-1/2 rounded-full border border-accent/90 bg-background shadow-[0_0_0_1px_rgba(242,199,91,0.2),0_0_10px_rgba(242,199,91,0.18)] md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                />

                <article
                  className={`surface-card surface-card-interactive relative ml-9 flex min-h-[360px] flex-col p-5 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:ml-0 md:w-[calc(50%-1.5rem)] ${
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <header className="space-y-3 border-b border-border pb-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border shadow-[inset_0_0_0_1px_rgba(242,199,91,0.06)] sm:h-16 sm:w-16 ${
                          isSyLabs ? "bg-[#f5f5f0]" : "bg-[#101010]"
                        }`}
                      >
                        {companyLogo ? (
                          <Image
                            src={companyLogo}
                            alt={`${item.company} logo`}
                            width={64}
                            height={64}
                            className={`h-full w-full ${isSyLabs ? "object-contain p-1.5" : "object-cover object-center"}`}
                          />
                        ) : (
                          <span aria-hidden="true" className="inline-flex h-full w-full items-center justify-center font-mono text-xs font-semibold uppercase text-accent/90">
                            {getCompanyInitials(item.company)}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
                          <div className="min-w-0">
                            <h2 className="font-serif text-2xl leading-tight text-text">{item.role}</h2>
                            <p className="text-sm text-muted">{item.company}</p>
                          </div>
                          <p className="font-mono text-[11px] uppercase tracking-label text-muted md:pt-1 md:text-right">
                            {item.period}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="font-mono text-[11px] uppercase tracking-label text-accent">{copy.work}</p>
                    <p className="pt-1 text-sm leading-relaxed text-text">
                      {getLocalizedText(item.summary, language)}
                    </p>
                  </header>

                  <div className="flex flex-1 flex-col justify-between gap-4 pt-4">
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.impact}</p>
                      <ul className="space-y-2 text-sm leading-relaxed text-text">
                        {impactBullets.map((bullet) => (
                          <li key={bullet.eng}>• {renderImpactText(getLocalizedText(bullet, language))}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.stack}</p>
                      <ul className="flex flex-wrap gap-2">
                        {item.tech.map((tool) => (
                          <TechBadge key={tool} tool={tool} />
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-10">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.educationSection}</p>
        </div>

        <div className="space-y-3">
          {educationItems.map((item) => (
            <article key={`${item.role}-${item.period}`} className="relative border-l border-border pl-4 py-1">
              <span
                aria-hidden="true"
                className="absolute -left-[4px] top-[10px] h-2 w-2 rounded-full bg-accent/70 shadow-[0_0_8px_rgba(242,199,91,0.35)]"
              />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h2 className="font-serif text-lg leading-tight text-text">{item.role}</h2>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted sm:pt-1">{item.period}</p>
              </div>
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
              <p className="text-sm leading-relaxed text-muted">{getLocalizedText(item.summary, language)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
