import { HomePageContent } from "@/components/home-page-content";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";
import {
  createMetadata,
  homepageDescription,
  homepageTitle,
} from "@/lib/metadata";

const HERO_PORTRAIT_SRC = "/media/malith-portrait.png";

export const metadata = createMetadata({
  fullTitle: homepageTitle,
  description: homepageDescription,
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
