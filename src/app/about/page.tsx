import { AboutPageContent } from "@/components/about-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn more about Malith Ileperuma and his background in DevOps, cloud infrastructure, and reliable software delivery.",
  path: "/about",
  keywords: [
    "About Malith Ileperuma",
    "DevOps background",
    "Cloud infrastructure engineer",
    "Platform reliability",
  ],
});

export default function AboutPage() {
  return <AboutPageContent />;
}
