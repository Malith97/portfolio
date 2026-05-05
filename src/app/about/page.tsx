import { AboutPageContent } from "@/components/about-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description:
    "About Malith Ileperuma, a DevOps Engineer specializing in cloud infrastructure, CI/CD automation, Kubernetes, Terraform, and reliability engineering.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
