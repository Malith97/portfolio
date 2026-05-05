import { WorkEducationPageContent } from "@/components/work-education-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Experience and Education",
  description:
    "Professional experience timeline and education highlights across DevOps, platform engineering, and software delivery.",
  path: "/work-education",
});

export default function WorkEducationPage() {
  return <WorkEducationPageContent />;
}
