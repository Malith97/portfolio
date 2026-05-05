import { WorkEducationPageContent } from "@/components/work-education-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Work & Education",
  description:
    "Work experience timeline and education highlights for Malith Ileperuma.",
  path: "/work-education",
});

export default function WorkEducationPage() {
  return <WorkEducationPageContent />;
}
