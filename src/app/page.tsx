import { HomePageContent } from "@/components/home-page-content";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

const HERO_PORTRAIT_SRC = "/media/malith-portrait.png";

export const metadata = createMetadata({
  description:
    "Official portfolio of Malith Ileperuma, DevOps Engineer focused on cloud infrastructure, CI/CD, Kubernetes, Terraform, automation, and reliability engineering.",
  path: "/",
  image: HERO_PORTRAIT_SRC,
});

export default async function HomePage() {
  const [caseStudiesEng, caseStudiesFi, beyondWorkEng, beyondWorkFi] =
    await Promise.all([
      getAllCaseStudies("eng"),
      getAllCaseStudies("fi"),
      getAllBeyondWorkPosts("eng"),
      getAllBeyondWorkPosts("fi"),
    ]);

  return (
    <HomePageContent
      caseStudiesByLanguage={{ eng: caseStudiesEng, fi: caseStudiesFi }}
      beyondWorkByLanguage={{ eng: beyondWorkEng, fi: beyondWorkFi }}
    />
  );
}
