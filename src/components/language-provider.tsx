"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Language, normalizeLanguage } from "@/lib/i18n";
import {
  getPreferredLanguage,
  LANGUAGE_CHANGE_EVENT,
  notifyLanguageChange,
  persistLanguagePreference,
} from "@/lib/i18n-client";

interface LanguageContextValue {
  language: Language;
  setLanguage: (nextLanguage: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  initialLanguage: Language;
  children: ReactNode;
}

export function LanguageProvider({
  initialLanguage,
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    const normalized = normalizeLanguage(nextLanguage);

    setLanguageState((current) => {
      if (current === normalized) {
        return current;
      }

      return normalized;
    });

    persistLanguagePreference(normalized);
    notifyLanguageChange(normalized);
  }, []);

  useEffect(() => {
    const preferred = getPreferredLanguage(initialLanguage);
    setLanguageState(preferred);
    persistLanguagePreference(preferred);

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;
      if (!nextLanguage) {
        return;
      }

      setLanguageState(normalizeLanguage(nextLanguage));
    };

    const handleStorage = () => {
      setLanguageState(getPreferredLanguage(initialLanguage));
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
  }, [initialLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
