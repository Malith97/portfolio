import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { BeyondWorkListing } from "@/app/beyond-work/beyond-work-listing";

export const metadata = createMetadata({
  title: "Beyond Work",
  description: "Journal-style activity stories on running, cycling, photography, cooking, achievements, and notes.",
  path: "/beyond-work"
});

export default async function BeyondWorkPage() {
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const posts = await getAllBeyondWorkPosts(language);

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
