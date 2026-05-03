import {
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  Language,
  normalizeLanguage,
} from "@/lib/i18n";

export const LANGUAGE_CHANGE_EVENT = "portfolio-language-change";

function readCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.trim().split("=");
    if (rawName !== name) {
      continue;
    }

    const value = rest.join("=");
    return value ? decodeURIComponent(value) : "";
  }

  return null;
}

export function getPreferredLanguage(fallback: Language): Language {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage) {
    return normalizeLanguage(storedLanguage);
  }

  const cookieLanguage = readCookieValue(LANGUAGE_COOKIE_KEY);
  if (cookieLanguage) {
    return normalizeLanguage(cookieLanguage);
  }

  return fallback;
}

export function persistLanguagePreference(language: Language): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function notifyLanguageChange(language: Language): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<{ language: Language }>(LANGUAGE_CHANGE_EVENT, {
      detail: { language },
    }),
  );
}
