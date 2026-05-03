import type { ReactNode } from "react";

import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { TechBadge } from "@/components/tech-badge";
import {
  getCompanyInitials,
  localizeEducationRole,
  localizeWorkRole,
  resolveCompanyLogo,
} from "@/lib/experience";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";
import {
  experienceTimeline,
  getLocalizedText,
  sortExperienceByMostRecent,
} from "@/lib/profile";

const METRIC_HIGHLIGHT_SPLIT_REGEX =
  /(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)/g;
const METRIC_HIGHLIGHT_MATCH_REGEX =
  /^(~?\$\d+(?:[.,]\d+)?(?:K|M|B)?(?:\/[a-zA-Z]+)?|\d+(?:[.,]\d+)?%)$/;

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
  description:
    "Work experience timeline and education highlights for Malith Ileperuma.",
  path: "/work-education",
});

export default async function WorkEducationPage() {
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const workExperience = sortExperienceByMostRecent(
    experienceTimeline.filter((item) => item.kind === "work"),
  );
  const educationItems = sortExperienceByMostRecent(
    experienceTimeline.filter((item) => item.kind === "education"),
  );

  return (
    <div className="space-y-16">
      <SectionHeading
        label={t.workEducationPage.label}
        title={t.workEducationPage.title}
        description={t.workEducationPage.description}
      />

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {t.workEducationPage.workSection}
          </p>
        </div>

        <div className="relative space-y-4">
          <span
            className="absolute bottom-0 left-4 top-0 w-px bg-border/90 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          {workExperience.map((item, index) => {
            const companyLogo = resolveCompanyLogo(item);
            const isSyLabs = item.company.toLowerCase().includes("sy labs");
            const impactBullets = [
              ...item.impactBullets,
              ...(item.additionalImpactBullets ?? []),
            ];

            return (
              <div key={`${item.role}-${item.period}`} className="relative">
                <span
                  className="status-dot-yellow absolute left-4 top-8 flex-none -translate-x-1/2 md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <span className="status-dot-yellow-pulse" />
                </span>

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
                          <SafeImage
                            src={companyLogo}
                            alt={`${item.company} logo`}
                            width={64}
                            height={64}
                            sizes="64px"
                            className={`h-full w-full ${isSyLabs ? "object-contain p-1.5" : "object-cover object-center"}`}
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="inline-flex h-full w-full items-center justify-center font-mono text-xs font-semibold uppercase text-accent/90"
                          >
                            {getCompanyInitials(item.company)}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
                          <div className="min-w-0">
                            <h2 className="font-serif text-2xl leading-tight text-text">
                              {localizeWorkRole(item.role, language)}
                            </h2>
                            <p className="text-sm text-muted">{item.company}</p>
                          </div>
                          <p className="font-mono text-[11px] uppercase tracking-label text-muted md:pt-1 md:text-right">
                            {item.period}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="font-mono text-[11px] uppercase tracking-label text-accent">
                      {t.workEducationPage.workTag}
                    </p>
                    <p className="pt-1 text-sm leading-relaxed text-text">
                      {getLocalizedText(item.summary, language)}
                    </p>
                  </header>

                  <div className="flex flex-1 flex-col justify-between gap-4 pt-4">
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">
                        {t.workEducationPage.impactLabel}
                      </p>
                      <ul className="space-y-2 text-sm leading-relaxed text-text">
                        {impactBullets.map((bullet) => (
                          <li key={bullet.eng}>
                            •{" "}
                            {renderImpactText(
                              getLocalizedText(bullet, language),
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">
                        {t.workEducationPage.stackLabel}
                      </p>
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
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {t.workEducationPage.educationSection}
          </p>
        </div>

        <div className="space-y-3">
          {educationItems.map((item) => (
            <article
              key={`${item.role}-${item.period}`}
              className="relative border-l border-border pl-4 py-1"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[4px] top-[10px] h-2 w-2 rounded-full bg-accent/70 shadow-[0_0_8px_rgba(242,199,91,0.35)]"
              />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h2 className="font-serif text-lg leading-tight text-text">
                  {localizeEducationRole(
                    item.role,
                    language,
                    t.workEducationPage.roleLabels,
                  )}
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted sm:pt-1">
                  {item.period}
                </p>
              </div>
              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {item.company}
                </a>
              ) : (
                <p className="text-sm text-muted">{item.company}</p>
              )}
              <p className="text-sm leading-relaxed text-muted">
                {getLocalizedText(item.summary, language)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
