import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const metricValues = [
  { value: "6", key: "yearsExperience" },
  { value: "35%", key: "cloudCostReduction" },
  { value: "$75k", key: "annualCloudSavings" },
  { value: "40–50%", key: "fasterDeployments" },
  { value: "20%", key: "downtimeReduction" }
] as const;

const certifications = [
  { name: "AWS SAA-C03", provider: "Amazon Web Services", issuer: "AWS", icon: "cloud" },
  { name: "Azure AZ-104", provider: "Microsoft Azure", issuer: "Azure", icon: "layers" },
  { name: "Azure AZ-500", provider: "Microsoft Azure", issuer: "Azure", icon: "shield" },
  { name: "Sun Certified Java Developer", provider: "Oracle Java", issuer: "Oracle", icon: "code" }
] as const;

function CertificationIcon({ type }: { type: (typeof certifications)[number]["icon"] }) {
  if (type === "cloud") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 18a4 4 0 1 1 .8-7.9 5 5 0 0 1 9.8 1.5A3.5 3.5 0 1 1 17 18H7Z" />
      </svg>
    );
  }

  if (type === "layers") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m20 12-8 4-8-4" />
        <path d="m20 16-8 4-8-4" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 5 6v6c0 5 3.3 7.6 7 9 3.7-1.4 7-4 7-9V6l-7-3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18h6" />
      <path d="m10 14-3-2 3-2" />
      <path d="m14 14 3-2-3-2" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  );
}

export default async function HomePage() {
  const language = getServerLanguage();
  const t = getDictionary(language);

  const caseStudies = (await getAllCaseStudies()).slice(0, 3);
  const notes = (await getAllBeyondWorkPosts()).slice(0, 6);
  const metrics = metricValues.map((item) => ({
    value: item.value,
    label: t.home.metrics[item.key]
  }));

  return (
    <div className="space-y-24">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-reading space-y-7">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.label}</p>

          <h1 className="font-serif text-5xl leading-[1.03] text-text sm:text-6xl">{t.home.heroTitle}</h1>

          <p className="text-base leading-relaxed text-muted">{t.home.heroSummary}</p>

          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.heroMeta}</p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/case-studies"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              {t.home.ctaViewWork}
            </Link>
            <Link
              href="/Malith-Ileperuma-Resume.txt"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              {t.home.ctaDownloadResume}
            </Link>
          </div>
        </div>

        <figure className="w-full max-w-[30rem] justify-self-end space-y-3 border border-border p-3">
          <Image
            src="/media/photo-1.webp"
            alt="Portrait of Malith Ileperuma"
            width={1200}
            height={1500}
            className="hover-lift image-frame h-[26rem] w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0 sm:h-[32rem]"
            priority
          />
          <figcaption className="font-mono text-xs uppercase tracking-label text-muted">
            Helsinki, Finland
          </figcaption>
        </figure>
      </section>

      <section className="grid gap-10 border-y border-border py-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.impactLabel}</p>
          <h2 className="font-serif text-4xl leading-tight text-text sm:text-5xl">{t.home.impactTitle}</h2>
          <p className="max-w-reading text-sm leading-relaxed text-muted">
            {t.home.impactDescription}
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <article
              key={metric.label}
              className={index === 0 ? "sm:col-span-2 border-b border-border pb-4 lg:col-span-3" : ""}
            >
              <p className="font-serif text-4xl leading-none text-text sm:text-[2.8rem]">{metric.value}</p>
              <p className="pt-2 font-mono text-xs uppercase tracking-label text-muted">{metric.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2 border-b border-border pb-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.certsLabel}</p>
          <h2 className="font-serif text-4xl text-text sm:text-5xl">{t.home.certsTitle}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => (
            <article key={cert.name} className="surface-card space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-accent">
                  <CertificationIcon type={cert.icon} />
                </span>
                <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-muted">
                  {t.home.certified}
                </span>
              </div>
              <h3 className="font-serif text-xl leading-tight text-text">{cert.name}</h3>
              <p className="text-sm text-muted">{cert.provider}</p>
              <p className="font-mono text-[11px] uppercase tracking-label text-accent">{cert.issuer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.selectedWorkLabel}</p>
            <h2 className="font-serif text-4xl text-text sm:text-5xl">{t.home.selectedWorkTitle}</h2>
          </div>
          <Link href="/case-studies" className="quiet-link text-sm text-accent">
            {t.common.viewAll}
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {caseStudies.map((post) => (
            <article key={post.slug} className="surface-card overflow-hidden">
              {post.image ? (
                <div className="aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={800}
                    className="hover-lift image-frame h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="space-y-3 p-4">
                <p className="font-mono text-xs uppercase tracking-label text-muted">{formatDate(post.date)}</p>
                <h3 className="font-serif text-2xl leading-tight text-text">
                  <Link href={`/case-studies/${post.slug}`} className="transition-colors hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">{post.summary}</p>
                <p className="font-mono text-xs uppercase tracking-label text-accent">
                  {t.common.result}: {post.impact ?? "Operational improvements"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-y border-border py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">{t.home.photoNotesLabel}</p>
            <h2 className="font-serif text-4xl text-text sm:text-5xl">{t.home.photoNotesTitle}</h2>
          </div>
          <Link href="/beyond-work" className="quiet-link text-sm text-accent">
            {t.common.viewJournal}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <article key={note.slug} className="surface-card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden border-b border-border">
                <Image
                  src={note.image}
                  alt={note.title}
                  width={1200}
                  height={900}
                  className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                />
              </div>

              <div className="space-y-2 p-4">
                <p className="font-mono text-xs uppercase tracking-label text-muted">
                  {note.category} · {formatDate(note.date)}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-text">
                  <Link href={`/beyond-work/${note.slug}`} className="transition-colors hover:text-accent">
                    {note.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">{note.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
