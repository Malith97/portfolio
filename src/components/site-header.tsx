"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  getDictionary,
  Language,
  normalizeLanguage,
} from "@/lib/i18n";
import {
  getPreferredLanguage,
  notifyLanguageChange,
  persistLanguagePreference,
} from "@/lib/i18n-client";

interface SiteHeaderProps {
  initialLanguage: Language;
}

export function SiteHeader({ initialLanguage }: SiteHeaderProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useMemo(() => getDictionary(language), [language]);

  useEffect(() => {
    const preferredLanguage = getPreferredLanguage(initialLanguage);
    persistLanguagePreference(preferredLanguage);
    setLanguage(preferredLanguage);
  }, [initialLanguage]);

  const navigation = [
    { href: "/", label: t.nav.home },
    { href: "/work-education", label: t.nav.experience },
    { href: "/case-studies", label: t.nav.caseStudies },
    { href: "/beyond-work", label: t.nav.beyondWork },
    { href: "/contact", label: t.nav.contact }
  ];

  const changeLanguage = (nextLanguage: Language) => {
    const normalizedNext = normalizeLanguage(nextLanguage);
    if (normalizedNext === language) {
      return;
    }

    setLanguage(normalizedNext);
    persistLanguagePreference(normalizedNext);
    notifyLanguageChange(normalizedNext);
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="border-b border-border/90 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="inline-flex h-8 w-8 overflow-hidden rounded-full border border-border bg-surface shadow-[inset_0_0_0_1px_rgba(242,199,91,0.08)]">
            <Image
              src="/media/malith-avatar.png"
              alt={language === "fi" ? "Malithin profiilikuva" : "Malith avatar"}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-serif text-2xl leading-none">Malith</span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <nav aria-label={t.common.primaryNavigation}>
            <ul className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 text-sm">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href);

                return (
                  <li key={item.href}>
                    <motion.div
                      whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        className={`relative inline-flex items-center rounded-md px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          isActive
                            ? "bg-accent/14 text-accent shadow-[0_0_0_1px_rgba(242,199,91,0.36),0_0_18px_rgba(242,199,91,0.26)]"
                            : "text-muted hover:bg-accent/5 hover:text-accent"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full bg-accent"
                          initial={false}
                          animate={{
                            scaleX: isActive ? 1 : 0,
                            opacity: isActive ? 1 : 0.85
                          }}
                          whileHover={prefersReducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          style={{ transformOrigin: "left center" }}
                        />
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] uppercase tracking-label text-muted"
            aria-label={t.language.label}
          >
            <button
              type="button"
              className={`rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                language === "eng" ? "bg-accent/15 text-accent" : "hover:text-text"
              }`}
              aria-pressed={language === "eng"}
              onClick={() => changeLanguage("eng")}
            >
              {t.language.eng}
            </button>
            <span aria-hidden="true">↔</span>
            <button
              type="button"
              className={`rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                language === "fi" ? "bg-accent/15 text-accent" : "hover:text-text"
              }`}
              aria-pressed={language === "fi"}
              onClick={() => changeLanguage("fi")}
            >
              {t.language.fi}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
