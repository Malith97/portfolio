import { DEFAULT_LANGUAGE, Language } from "@/lib/i18n";

export async function getServerLanguage(): Promise<Language> {
  return DEFAULT_LANGUAGE;
}
