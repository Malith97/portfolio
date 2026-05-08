import type { Language } from "@/lib/i18n";

export function formatDate(dateString: string, language: Language): string {
  const locale = language === "fi" ? "fi-FI" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}
