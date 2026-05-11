import { WorkEducationPageContent } from "@/components/work-education-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Experience | Work and Education",
  description:
    "Experience timeline and education background across DevOps, cloud automation, platform engineering, and software delivery.",
  path: "/experience",
  keywords: [
    "DevOps experience",
    "Platform engineering experience",
    "Cloud automation experience",
    "Work and education timeline",
  ],
});

export default function ExperiencePage() {
  return <WorkEducationPageContent />;
}
