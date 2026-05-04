import { CaseStudiesPageContent } from "@/components/case-studies-page-content";
import { getAllCaseStudies } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Case Studies",
  description:
    "Practical DevOps case studies on cost, migration, delivery automation, and reliability.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const [postsEng, postsFi] = await Promise.all([
    getAllCaseStudies("eng"),
    getAllCaseStudies("fi"),
  ]);

  return (
    <CaseStudiesPageContent postsByLanguage={{ eng: postsEng, fi: postsFi }} />
  );
}
