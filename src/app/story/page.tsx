import { StoryPageContent } from "@/components/story-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Story | From Sri Lanka to Finland",
  description:
    "Personal journey from Sri Lanka to Finland, with lessons from software engineering, DevOps, and cloud platform work.",
  path: "/story",
});

export default function StoryPage() {
  return <StoryPageContent />;
}
