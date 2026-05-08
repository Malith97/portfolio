import { CaseStudiesPageContent } from "@/components/case-studies-page-content";
import { getAllCaseStudies } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Case Studies | DevOps and Cloud Projects",
  description:
    "Real project case studies covering cloud cost optimization, platform migration, delivery automation, and reliability improvements.",
  path: "/case-studies",
  keywords: [
    "DevOps case studies",
    "Cloud cost optimization case study",
    "Kubernetes RBAC case study",
    "Platform migration",
    "Infrastructure automation results",
  ],
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
