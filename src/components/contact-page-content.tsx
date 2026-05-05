"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { SocialLinkIcon } from "@/components/social-link-icon";
import { getDictionary } from "@/lib/i18n";

interface SocialLink {
  id: "linkedin" | "github" | "medium" | "stackoverflow";
  href: string;
  icon: "linkedin" | "github" | "medium" | "stackoverflow";
}

const socialLinks: SocialLink[] = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/malith-ileperuma-8a6a97167",
    icon: "linkedin",
  },
  { id: "github", href: "https://github.com/Malith97", icon: "github" },
  { id: "medium", href: "https://medium.com/@mileperuma", icon: "medium" },
  {
    id: "stackoverflow",
    href: "https://stackoverflow.com/users/10895727/malith-ileperuma",
    icon: "stackoverflow",
  },
];

export function ContactPageContent() {
  const { language } = useLanguage();
  const t = getDictionary(language);

  const socialLabels = {
    linkedin: "LinkedIn",
    github: "GitHub",
    medium: "Medium",
    stackoverflow: "Stack Overflow",
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <header className="mb-12 space-y-4 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-label text-muted">
          {t.contactPage.label}
        </p>
        <h1 className="max-w-4xl font-serif text-4xl leading-tight text-text sm:text-5xl">
          {t.contactPage.title}
        </h1>
        <p className="max-w-reading text-base leading-relaxed text-text">
          {t.contactPage.hook}
        </p>
        <p className="max-w-reading text-base leading-relaxed text-muted">
          {t.contactPage.description}
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <article className="surface-card space-y-6 p-6 sm:p-7">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl leading-tight text-text">
              {t.contactPage.startConversation}
            </h2>
            <p className="max-w-reading text-sm leading-relaxed text-muted">
              {t.contactPage.intro}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-y border-border py-4">
            <Link
              href="mailto:mileperuma@gmail.com"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b0b0b] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
              aria-label={t.contactPage.emailCta}
            >
              {t.contactPage.emailCta}
            </Link>
            <Link
              href="/resume/Malith-Ileperuma-Resume.pdf"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
              aria-label={t.contactPage.resumeCta}
            >
              {t.contactPage.resumeCta}
            </Link>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">
              {t.contactPage.responseTime}
            </p>
            <p className="text-sm text-muted">
              <a
                href="https://www.linkedin.com/in/malith-ileperuma-8a6a97167"
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-link text-accent"
              >
                {t.contactPage.quickIntro}
              </a>
            </p>
          </div>

          <dl className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div className="rounded-md border border-border px-3 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-label text-muted">
                {t.contactPage.locationLabel}
              </dt>
              <dd className="pt-1 text-sm text-text">
                {t.contactPage.locationValue}
              </dd>
            </div>
            <div className="rounded-md border border-border px-3 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-label text-muted">
                {t.contactPage.availabilityLabel}
              </dt>
              <dd className="pt-1 text-sm text-text">
                {t.contactPage.availabilityValue}
              </dd>
            </div>
            <div className="rounded-md border border-border px-3 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-label text-muted">
                {t.contactPage.preferenceLabel}
              </dt>
              <dd className="pt-1 text-sm text-text">
                {t.contactPage.preferenceValue}
              </dd>
            </div>
          </dl>
        </article>

        <div className="space-y-6">
          <article className="surface-card space-y-4 p-5 sm:p-6">
            <h3 className="font-serif text-2xl text-text">
              {t.contactPage.openToTitle}
            </h3>
            <ul className="grid gap-2 text-sm leading-relaxed text-text">
              {t.contactPage.openToItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card space-y-4 p-5 sm:p-6">
            <h3 className="font-serif text-2xl text-text">
              {t.contactPage.profilesTitle}
            </h3>
            <ul className="grid gap-2">
              {socialLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                    aria-label={`${socialLabels[item.id]} · ${t.common.openProfileInNewTab}`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                      <SocialLinkIcon platform={item.icon} />
                    </span>
                    <span>{socialLabels[item.id]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
