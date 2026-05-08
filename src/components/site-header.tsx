"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/components/language-provider";
import { getDictionary, type Language, normalizeLanguage } from "@/lib/i18n";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useMemo(() => getDictionary(language), [language]);
  const mobileMenuId = "mobile-primary-navigation";

  const navigation = [
    { href: "/", label: t.nav.home },
    { href: "/story", label: t.nav.story },
    { href: "/work-education", label: t.nav.experience },
    { href: "/case-studies", label: t.nav.caseStudies },
    { href: "/beyond-work", label: t.nav.beyondWork },
    { href: "/contact", label: t.nav.contact },
  ];

  const changeLanguage = (nextLanguage: Language) => {
    const normalizedNext = normalizeLanguage(nextLanguage);
    if (normalizedNext === language) {
      return;
    }

    setLanguage(normalizedNext);
    startTransition(() => {
      router.refresh();
    });
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    const handleHashChange = () => {
      closeMobileMenu();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [closeMobileMenu]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarCompensation =
      window.innerWidth - document.documentElement.clientWidth;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarCompensation > 0) {
      document.body.style.paddingRight = `${scrollbarCompensation}px`;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      <header className="relative z-40 border-b border-border/90 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:px-8 min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
          <div className="flex items-center justify-between min-[769px]:block">
            <Link
              href="/"
              data-testid="nav-home"
              className="inline-flex items-center gap-2.5 text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={closeMobileMenu}
            >
              <span className="inline-flex h-8 w-8 overflow-hidden rounded-full border border-border bg-surface shadow-[inset_0_0_0_1px_rgba(242,199,91,0.08)]">
                <Image
                  src="/media/malith-avatar.png"
                  alt={
                    language === "fi"
                      ? "Malith Ileperuman profiilikuva"
                      : "Profile photo of Malith Ileperuma"
                  }
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-serif text-2xl leading-none">Malith</span>
            </Link>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-surface p-2 text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[769px]:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={
                language === "fi"
                  ? isMobileMenuOpen
                    ? "Sulje valikko"
                    : "Avaa valikko"
                  : isMobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
              }
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              <span className="sr-only">
                {language === "fi" ? "Valikko" : "Menu"}
              </span>
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="hidden flex-wrap items-center gap-4 min-[769px]:flex min-[769px]:justify-end">
            <nav aria-label={t.common.primaryNavigation}>
              <ul className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 text-sm">
                {navigation.map((item) => {
                  const isActive = isActiveLink(item.href);

                  return (
                    <li key={item.href}>
                      <motion.div
                        whileHover={
                          prefersReducedMotion ? undefined : { y: -1 }
                        }
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.98 }
                        }
                        transition={{ duration: 0.16, ease: "easeOut" }}
                      >
                        <Link
                          href={item.href}
                          data-testid={`nav-link-${item.href.replace(/\//g, "-").replace(/^-/, "") || "home"}`}
                          prefetch={false}
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
                              opacity: isActive ? 1 : 0.85,
                            }}
                            whileHover={
                              prefersReducedMotion
                                ? undefined
                                : { scaleX: 1, opacity: 1 }
                            }
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
              data-testid="language-toggle"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] uppercase tracking-label text-muted"
              aria-label={t.language.label}
            >
              <button
                type="button"
                data-testid="lang-eng"
                className={`rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                  language === "eng"
                    ? "bg-accent/15 text-accent"
                    : "hover:text-text"
                }`}
                aria-pressed={language === "eng"}
                onClick={() => changeLanguage("eng")}
              >
                {t.language.eng}
              </button>
              <span aria-hidden="true">↔</span>
              <button
                type="button"
                data-testid="lang-fi"
                className={`rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                  language === "fi"
                    ? "bg-accent/15 text-accent"
                    : "hover:text-text"
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
      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] pointer-events-auto min-[769px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.16, ease: "easeOut" }
            }
            onClick={closeMobileMenu}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            <motion.div
              id={mobileMenuId}
              data-testid="mobile-menu"
              className="absolute inset-x-4 top-4 z-10 rounded-2xl border border-border bg-[#111111] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.5)]"
              role="dialog"
              aria-modal="true"
              aria-label={t.common.primaryNavigation}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -10, scale: 0.99 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.99 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.18, ease: "easeOut" }
              }
              onClick={(event) => event.stopPropagation()}
            >
              <nav aria-label={t.common.primaryNavigation}>
                <ul className="grid gap-2">
                  {navigation.map((item) => {
                    const isActive = isActiveLink(item.href);

                    return (
                      <li key={`mobile-${item.href}`}>
                        <Link
                          href={item.href}
                          data-testid={`mobile-nav-link-${item.href.replace(/\//g, "-").replace(/^-/, "") || "home"}`}
                          prefetch={false}
                          onClick={closeMobileMenu}
                          className={`inline-flex min-h-11 w-full items-center rounded-md px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] ${
                            isActive
                              ? "bg-accent/14 text-accent shadow-[0_0_0_1px_rgba(242,199,91,0.36),0_0_18px_rgba(242,199,91,0.2)]"
                              : "text-text hover:bg-accent/6 hover:text-accent"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div
                data-testid="mobile-language-toggle"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] uppercase tracking-label text-muted"
                aria-label={t.language.label}
              >
                <button
                  type="button"
                  data-testid="mobile-lang-eng"
                  className={`min-h-8 rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                    language === "eng"
                      ? "bg-accent/15 text-accent"
                      : "hover:text-text"
                  }`}
                  aria-pressed={language === "eng"}
                  onClick={() => {
                    changeLanguage("eng");
                    closeMobileMenu();
                  }}
                >
                  {t.language.eng}
                </button>
                <span aria-hidden="true">↔</span>
                <button
                  type="button"
                  data-testid="mobile-lang-fi"
                  className={`min-h-8 rounded-full px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                    language === "fi"
                      ? "bg-accent/15 text-accent"
                      : "hover:text-text"
                  }`}
                  aria-pressed={language === "fi"}
                  onClick={() => {
                    changeLanguage("fi");
                    closeMobileMenu();
                  }}
                >
                  {t.language.fi}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
