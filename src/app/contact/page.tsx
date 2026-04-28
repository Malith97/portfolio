import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";

interface ContactLink {
  id: "email" | "linkedin" | "medium" | "stackoverflow" | "youtube" | "dribbble";
  href: string;
  icon: "mail" | "linkedin" | "medium" | "stackoverflow" | "youtube" | "dribbble";
}

const links: ContactLink[] = [
  { id: "email", href: "mailto:malith.ileperuma@example.com", icon: "mail" },
  { id: "linkedin", href: "https://www.linkedin.com/in/malith-ileperuma", icon: "linkedin" },
  { id: "medium", href: "https://medium.com/@malithileperuma", icon: "medium" },
  { id: "stackoverflow", href: "https://stackoverflow.com/users/0000000/malith-ileperuma", icon: "stackoverflow" },
  { id: "youtube", href: "https://www.youtube.com/@malithileperuma", icon: "youtube" },
  { id: "dribbble", href: "https://dribbble.com/malithileperuma", icon: "dribbble" }
];

function LinkIcon({ kind }: { kind: ContactLink["icon"] }) {
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7" />
        <path d="M8 7h.01" />
        <path d="M12 17v-4a2 2 0 1 1 4 0v4" />
      </svg>
    );
  }

  if (kind === "medium") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8" cy="12" r="4" />
        <ellipse cx="16.5" cy="12" rx="2.5" ry="4" />
        <path d="M21 8v8" />
      </svg>
    );
  }

  if (kind === "stackoverflow") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 17h10" />
        <path d="M8 14h8" />
        <path d="M9 11h6" />
        <path d="m10 8 4 2" />
        <path d="m12 5 2 3" />
        <path d="M6 19h12v-4" />
      </svg>
    );
  }

  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M5 9h14" />
      <path d="M7 18c2-4 8-5 10-5" />
      <path d="M9 4c3 3 6 9 7 15" />
    </svg>
  );
}

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact details and social links for Malith Ileperuma.",
  path: "/contact"
});

export default function ContactPage() {
  const language = getServerLanguage();
  const t = getDictionary(language);
  const contactLabels =
    language === "fi"
      ? {
          email: "Sähköposti",
          linkedin: "LinkedIn",
          medium: "Medium",
          stackoverflow: "Stack Overflow",
          youtube: "YouTube",
          dribbble: "Dribbble"
        }
      : {
          email: "Email",
          linkedin: "LinkedIn",
          medium: "Medium",
          stackoverflow: "Stack Overflow",
          youtube: "YouTube",
          dribbble: "Dribbble"
        };

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.contactPage.label}
        title={t.contactPage.title}
        description={t.contactPage.description}
      />

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="surface-card space-y-7 p-5 sm:p-6">
          <div className="space-y-3">
            <p className="font-serif text-3xl leading-tight text-text">{t.contactPage.introTitle}</p>
            <p className="max-w-reading text-sm leading-relaxed text-muted">{t.contactPage.introBody}</p>
            <p className="font-mono text-xs uppercase tracking-label text-accent">
              {t.common.availability}: {t.contactPage.availabilityValue}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="mailto:malith.ileperuma@example.com"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
              aria-label="Send email to Malith Ileperuma"
            >
              {t.contactPage.emailCta}
            </Link>
            <Link
              href="/Malith-Ileperuma-Resume.txt"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
              aria-label="Download resume"
            >
              {t.contactPage.resumeCta}
            </Link>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {links.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-text transition-colors hover:text-accent"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={contactLabels[item.id]}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                    <LinkIcon kind={item.icon} />
                  </span>
                  <span className="quiet-link">{contactLabels[item.id]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <figure className="surface-card overflow-hidden p-3">
          <div className="aspect-[4/5] overflow-hidden rounded-md border border-border">
            <Image
              src="/media/photo-23.webp"
              alt="Malith working with notes and camera gear"
              width={1200}
              height={1500}
              className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
            />
          </div>
        </figure>
      </section>
    </div>
  );
}
