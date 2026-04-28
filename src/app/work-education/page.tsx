import Image from "next/image";

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
          description: "Työkokemus aikajanana ja koulutus erillisenä, selkeänä osiona.",
          workSection: "Työkokemus",
          educationSection: "Koulutus",
          work: "Työ",
          impact: "Keskeinen vaikutus",
          stack: "Tekninen pino"
        }
      : {
          title: "Work & Education",
          description: "Work experience in timeline format and education in a separate compact section.",
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

        <div className="relative space-y-5">
          <span className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />

          {workExperience.map((item, index) => {
            const companyLogo = resolveCompanyLogo(item);

            return (
              <div key={`${item.role}-${item.period}`} className="relative">
                <span
                  className="absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-accent/80 bg-background shadow-[0_0_0_1px_rgba(242,199,91,0.12)] md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                />

                <article
                  className={`surface-card surface-card-interactive relative ml-10 flex min-h-[360px] flex-col p-5 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:ml-0 md:w-[calc(50%-1.75rem)] ${
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
                        <h2 className="font-serif text-2xl leading-tight text-text">{item.role}</h2>
                        <p className="text-sm text-muted">{item.company}</p>
                      </div>
                    </div>

                    <p className="font-mono text-[11px] uppercase tracking-label text-accent">{copy.work}</p>
                    <p className="pt-1 text-sm leading-relaxed text-muted">
                      {getLocalizedText(item.summary, language)}
                    </p>
                  </header>

                  <div className="flex flex-1 flex-col justify-between gap-4 pt-4">
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.impact}</p>
                      <ul className="space-y-2 text-sm leading-relaxed text-muted">
                        {item.impactBullets.map((bullet) => (
                          <li key={bullet.eng}>• {getLocalizedText(bullet, language)}</li>
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

        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {educationItems.map((item) => (
            <article key={`${item.role}-${item.period}`} className="surface-card flex h-full min-h-[250px] flex-col space-y-4 p-5">
              <header className="space-y-1 border-b border-border pb-4">
                <p className="font-mono text-xs uppercase tracking-label text-muted">{item.period}</p>
                <h2 className="font-serif text-2xl leading-tight text-text">{item.role}</h2>
                <p className="text-sm text-muted">{item.company}</p>
                <p className="pt-1 text-sm leading-relaxed text-muted">{getLocalizedText(item.summary, language)}</p>
              </header>

              <div className="mt-auto space-y-2">
                <p className="font-mono text-xs uppercase tracking-label text-muted">{copy.stack}</p>
                <ul className="flex flex-wrap gap-2">
                  {item.tech.map((tool) => (
                    <TechBadge key={tool} tool={tool} />
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
