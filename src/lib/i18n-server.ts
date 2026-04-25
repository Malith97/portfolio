import { cookies } from "next/headers";

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE_KEY, Language, normalizeLanguage } from "@/lib/i18n";

export function getServerLanguage(): Language {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  return cookieValue ? normalizeLanguage(cookieValue) : DEFAULT_LANGUAGE;
}

