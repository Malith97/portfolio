import { ContactPageContent } from "@/components/contact-page-content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact | DevOps and Cloud Opportunities",
  description:
    "Get in touch for DevOps, cloud automation, and platform engineering opportunities, consulting, or collaboration.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
