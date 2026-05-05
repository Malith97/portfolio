import { en } from "@/locales/en";
import { fi } from "@/locales/fi";
import type { Dictionary } from "@/locales/types";

export type Language = "eng" | "fi";

export const DEFAULT_LANGUAGE: Language = "eng";
export const LANGUAGE_COOKIE_KEY = "portfolio-lang";
export const LANGUAGE_STORAGE_KEY = "portfolio-lang";

const dictionaries: Record<Language, Dictionary> = {
  eng: en,
  fi
};

export function normalizeLanguage(value: string | null | undefined): Language {
  return value === "fi" ? "fi" : "eng";
}

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language];
}
