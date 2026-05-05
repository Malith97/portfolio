import { StoryPageContent } from "@/components/story-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "My Story | DevOps Engineer Journey from Sri Lanka to Finland",
  description:
    "Personal story of a DevOps and cloud engineer from Sri Lanka to Finland, shaped by curiosity, freelancing, CI/CD automation, cloud platforms, and reliability engineering.",
  path: "/story",
});

export default function StoryPage() {
  return <StoryPageContent />;
}
