"use client";

import { useEffect, useState } from "react";

import { Language, normalizeLanguage } from "@/lib/i18n";
import { getPreferredLanguage, LANGUAGE_CHANGE_EVENT } from "@/lib/i18n-client";

interface HomeHeroTitleTextProps {
  fallbackLanguage: Language;
  eng: string;
  fi: string;
}

export function HomeHeroTitleText({
  fallbackLanguage,
  eng,
  fi,
}: HomeHeroTitleTextProps) {
  const [language, setLanguage] = useState<Language>(fallbackLanguage);

  useEffect(() => {
    setLanguage(getPreferredLanguage(fallbackLanguage));

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;
      if (!nextLanguage) {
        return;
      }

      setLanguage(normalizeLanguage(nextLanguage));
    };

    const handleStorage = () => {
      setLanguage(getPreferredLanguage(fallbackLanguage));
    };

    window.addEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageChange as EventListener,
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        LANGUAGE_CHANGE_EVENT,
        handleLanguageChange as EventListener,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [fallbackLanguage]);

  return <>{language === "fi" ? fi : eng}</>;
}
