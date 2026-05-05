import { ContactPageContent } from "@/components/contact-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Recruiter-friendly contact details for DevOps, platform engineering, and cloud reliability roles.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
