"use client";

import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import type { PostMeta } from "@/lib/content";
import { getDictionary, type Language } from "@/lib/i18n";
import { BeyondWorkListing } from "@/app/beyond-work/beyond-work-listing";

interface BeyondWorkPageContentProps {
  postsByLanguage: Record<Language, PostMeta[]>;
}

export function BeyondWorkPageContent({
  postsByLanguage,
}: BeyondWorkPageContentProps) {
  const { language } = useLanguage();
  const t = getDictionary(language);
  const posts = postsByLanguage[language] ?? [];

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.beyondWorkPage.label}
        title={t.beyondWorkPage.title}
        description={t.beyondWorkPage.description}
      />

      <BeyondWorkListing
        language={language}
        posts={posts}
        labels={{
          categoriesAriaLabel: t.beyondWorkPage.categoriesAriaLabel,
          emptyStateTitle: t.beyondWorkPage.emptyStateTitle,
          emptyStateDescription: t.beyondWorkPage.emptyStateDescription,
          emptyStateCta: t.beyondWorkPage.emptyStateCta,
          kitchenNotes: t.common.kitchenNotes,
          timeSpent: t.beyondWorkDetail.timeSpent,
          whatILearned: t.beyondWorkDetail.whatILearned,
          filters: t.beyondWorkPage.filters,
        }}
      />
    </div>
  );
}
