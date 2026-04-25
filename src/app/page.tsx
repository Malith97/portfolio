import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";

const metrics = [
  { value: "6", label: "Years experience" },
  { value: "35%", label: "Cloud cost reduction" },
  { value: "$75k", label: "Annual cloud savings" },
  { value: "40–50%", label: "Faster deployments" },
  { value: "20%", label: "Downtime reduction" }
];

const certifications = [
  { name: "AWS SAA-C03", provider: "Amazon Web Services", icon: "cloud" },
  { name: "Azure AZ-104", provider: "Microsoft Azure", icon: "layers" },
  { name: "Azure AZ-500", provider: "Microsoft Azure", icon: "shield" },
  { name: "Sun Certified Java Developer", provider: "Oracle Java", icon: "code" }
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
  const caseStudies = (await getAllCaseStudies()).slice(0, 3);
  const notes = (await getAllBeyondWorkPosts()).slice(0, 5);
  const leadNote = notes[0];
  const supportingNotes = notes.slice(1, 5);

  return (
    <div className="space-y-24">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-reading space-y-7">
          <p className="font-mono text-xs uppercase tracking-label text-muted">Home</p>

          <h1 className="font-serif text-5xl leading-[1.03] text-text sm:text-6xl">
            I&apos;m Malith Ileperuma, a DevOps Engineer based in Finland.
          </h1>

          <p className="text-base leading-relaxed text-muted">
            I build reliable cloud systems, automate delivery pipelines, and help teams reduce operational
            complexity.
          </p>

          <p className="font-mono text-xs uppercase tracking-label text-muted">
            Senior DevOps / Platform Engineer · Finland · Available for EU and remote roles
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/case-studies"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              View Work
            </Link>
            <Link
              href="/Malith-Ileperuma-Resume.txt"
              className="inline-flex border border-border px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              Download Resume
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
          <p className="font-mono text-xs uppercase tracking-label text-muted">Impact</p>
          <h2 className="font-serif text-4xl leading-tight text-text sm:text-5xl">
            Measurable platform outcomes
          </h2>
          <p className="max-w-reading text-sm leading-relaxed text-muted">
            Focused on delivery speed, reliability, and cloud efficiency in enterprise engineering environments.
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
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">Case Studies</p>
            <h2 className="font-serif text-4xl text-text sm:text-5xl">Selected work</h2>
          </div>
          <Link href="/case-studies" className="quiet-link text-sm text-accent">
            View all
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
                  Result: {post.impact ?? "Operational improvements"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-y border-border py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-label text-muted">Beyond Work</p>
            <h2 className="font-serif text-4xl text-text sm:text-5xl">Photo Notes</h2>
          </div>
          <Link href="/beyond-work" className="quiet-link text-sm text-accent">
            View journal
          </Link>
        </div>

        {leadNote ? (
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="surface-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden border-b border-border">
                <Image
                  src={leadNote.image}
                  alt={leadNote.title}
                  width={1400}
                  height={900}
                  className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                />
              </div>

              <div className="space-y-2 p-4">
                <p className="font-mono text-xs uppercase tracking-label text-muted">
                  {leadNote.category} · {formatDate(leadNote.date)}
                </p>
                <h3 className="font-serif text-3xl leading-tight text-text">
                  <Link href={`/beyond-work/${leadNote.slug}`} className="transition-colors hover:text-accent">
                    {leadNote.title}
                  </Link>
                </h3>
                <p className="max-w-reading text-sm leading-relaxed text-muted">{leadNote.summary}</p>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {supportingNotes.map((note) => (
                <article key={note.slug} className="surface-card overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden border-b border-border">
                    <Image
                      src={note.image}
                      alt={note.title}
                      width={1200}
                      height={760}
                      className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                    />
                  </div>

                  <div className="space-y-2 p-3">
                    <p className="font-mono text-xs uppercase tracking-label text-muted">
                      {note.category} · {formatDate(note.date)}
                    </p>
                    <h4 className="font-serif text-xl leading-tight text-text">
                      <Link href={`/beyond-work/${note.slug}`} className="transition-colors hover:text-accent">
                        {note.title}
                      </Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-8">
        <div className="space-y-2 border-b border-border pb-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted">Certifications</p>
          <h2 className="font-serif text-4xl text-text sm:text-5xl">Professional credentials</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => (
            <article key={cert.name} className="surface-card space-y-3 p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-accent">
                <CertificationIcon type={cert.icon} />
              </span>
              <h3 className="font-serif text-xl leading-tight text-text">{cert.name}</h3>
              <p className="text-sm text-muted">{cert.provider}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

