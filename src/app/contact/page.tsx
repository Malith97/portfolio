import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";

interface ContactLink {
  label: string;
  href: string;
  value: string;
  icon: "mail" | "linkedin" | "medium" | "stackoverflow" | "youtube" | "dribbble" | "resume";
}

const links: ContactLink[] = [
  { label: "Email", href: "mailto:malith.ileperuma@example.com", value: "malith.ileperuma@example.com", icon: "mail" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/malith-ileperuma", value: "linkedin.com/in/malith-ileperuma", icon: "linkedin" },
  { label: "Medium", href: "https://medium.com/@malithileperuma", value: "medium.com/@malithileperuma", icon: "medium" },
  { label: "Stack Overflow", href: "https://stackoverflow.com/users/0000000/malith-ileperuma", value: "stackoverflow.com/users/0000000/malith-ileperuma", icon: "stackoverflow" },
  { label: "YouTube", href: "https://www.youtube.com/@malithileperuma", value: "youtube.com/@malithileperuma", icon: "youtube" },
  { label: "Dribbble", href: "https://dribbble.com/malithileperuma", value: "dribbble.com/malithileperuma", icon: "dribbble" },
  { label: "Resume", href: "/Malith-Ileperuma-Resume.txt", value: "Download resume", icon: "resume" }
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

  if (kind === "dribbble") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M5 9h14" />
        <path d="M7 18c2-4 8-5 10-5" />
        <path d="M9 4c3 3 6 9 7 15" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <rect x="4" y="18" width="16" height="3" rx="1" />
    </svg>
  );
}

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact details and social links for Malith Ileperuma.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <div className="space-y-14">
      <SectionHeading
        label="Contact"
        title="Simple ways to reach me"
        description="Best for collaboration requests, DevOps consulting conversations, and engineering discussions."
      />

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="surface-card overflow-hidden">
          <div className="divide-y divide-border">
            {links.map((item) => (
              <div key={item.label} className="grid gap-2 p-4 sm:grid-cols-[180px_1fr] sm:items-center sm:p-5">
                <p className="font-mono text-xs uppercase tracking-label text-muted">{item.label}</p>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-text transition-colors hover:text-accent"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                    <LinkIcon kind={item.icon} />
                  </span>
                  <span className="quiet-link">{item.value}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <figure className="surface-card overflow-hidden p-3">
          <div className="aspect-[4/5] overflow-hidden rounded-md border border-border">
            <Image
              src="/media/photo-23.webp"
              alt="Desk setup with notebook and camera"
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

