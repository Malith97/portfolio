import { StoryPageContent } from "@/components/story-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Story | About Malith Ileperuma",
  description:
    "Personal journey from Sri Lanka to Finland, with lessons from software engineering, DevOps, and cloud platform work.",
  path: "/story",
  keywords: [
    "Malith Ileperuma story",
    "DevOps journey",
    "Sri Lanka to Finland engineer",
    "Engineering career story",
  ],
});

export default function StoryPage() {
  return <StoryPageContent />;
}
