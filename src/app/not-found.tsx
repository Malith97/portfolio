import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

export default function NotFound() {
  const language = getServerLanguage();
  const t = getDictionary(language);

  return (
    <div className="max-w-reading space-y-6">
      <p className="font-mono text-xs uppercase tracking-label text-muted">{t.notFoundPage.label}</p>
      <h1 className="font-serif text-4xl text-text">{t.notFoundPage.title}</h1>
      <p className="text-sm leading-relaxed text-muted">{t.notFoundPage.description}</p>
      <Link href="/" className="text-sm text-accent hover:underline">
        {t.notFoundPage.cta}
      </Link>
    </div>
  );
}
