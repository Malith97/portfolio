import { cookies } from "next/headers";

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE_KEY, Language, normalizeLanguage } from "@/lib/i18n";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  return cookieValue ? normalizeLanguage(cookieValue) : DEFAULT_LANGUAGE;
}
