"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  getDictionary,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  Language,
  normalizeLanguage
} from "@/lib/i18n";

interface SiteHeaderProps {
  initialLanguage: Language;
}

export function SiteHeader({ initialLanguage }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useMemo(() => getDictionary(language), [language]);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const storedLanguage = stored ? normalizeLanguage(stored) : initialLanguage;

    if (!stored) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, initialLanguage);
    }

    if (storedLanguage !== initialLanguage) {
      document.cookie = `${LANGUAGE_COOKIE_KEY}=${storedLanguage}; path=/; max-age=31536000; samesite=lax`;
      setLanguage(storedLanguage);
      router.refresh();
      return;
    }

    setLanguage(initialLanguage);
  }, [initialLanguage, router]);

  const navigation = [
    { href: "/", label: t.nav.home },
    { href: "/story", label: t.nav.story },
    { href: "/work-education", label: t.nav.workEducation },
    { href: "/case-studies", label: t.nav.caseStudies },
    { href: "/beyond-work", label: t.nav.beyondWork },
    { href: "/contact", label: t.nav.contact }
  ];

  const changeLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) {
      return;
    }

    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-text transition-colors hover:text-accent">
          Malith Ileperuma
        </Link>

        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:justify-end">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative pb-1 transition-colors ${
                        isActive ? "text-text" : "text-muted hover:text-text"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-[2px] left-0 h-[1px] w-full transition-transform ${
                          isActive
                            ? "bg-accent scale-x-100"
                            : "bg-border scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-label text-muted"
            aria-label={t.language.label}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a15 15 0 0 1 0 18" />
              <path d="M12 3a15 15 0 0 0 0 18" />
            </svg>
            <button
              type="button"
              className={`bg-transparent p-0 ${language === "eng" ? "text-text" : "transition-colors hover:text-text"}`}
              aria-pressed={language === "eng"}
              onClick={() => changeLanguage("eng")}
            >
              {t.language.eng}
            </button>
            <span>/</span>
            <button
              type="button"
              className={`bg-transparent p-0 ${language === "fi" ? "text-text" : "transition-colors hover:text-text"}`}
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

