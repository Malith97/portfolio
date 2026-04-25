import { PhotoGrid } from "@/components/photo-grid";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";

interface TimelineItem {
  title: string;
  place: string;
  period: string;
  kind: "Work" | "Education";
  story: string;
  responsibilities: string[];
  outcomes: string[];
  tools: string[];
  images: string[];
}

const timeline: TimelineItem[] = [
  {
    title: "Software Engineer",
    place: "SY Labs Sri Lanka",
    period: "2019–2021",
    kind: "Work",
    story:
      "Built product features while taking ownership of release quality and deployment reliability in fast-moving delivery cycles.",
    responsibilities: [
      "Implemented backend and integration features for enterprise products.",
      "Improved build stability and deployment handoffs with repeatable runbooks.",
      "Collaborated with QA and support teams on defect prevention and resolution."
    ],
    outcomes: [
      "Reduced release friction and improved deployment predictability.",
      "Created a foundation for later transition into DevOps-focused work."
    ],
    tools: ["Java", "CI Pipelines", "Git", "Issue Tracking"],
    images: ["/media/photo-10.webp", "/media/photo-11.webp", "/media/photo-12.webp"]
  },
  {
    title: "BSc Computer Science",
    place: "General Sir John Kotelawala Defence University",
    period: "2021",
    kind: "Education",
    story:
      "Built strong foundations in software engineering, systems thinking, and structured problem solving.",
    responsibilities: [
      "Completed software engineering, algorithms, and systems coursework.",
      "Delivered practical projects with collaborative planning and execution."
    ],
    outcomes: [
      "Established core engineering discipline and analytical thinking patterns."
    ],
    tools: ["Computer Science Fundamentals", "Software Design", "Team Projects"],
    images: ["/media/photo-13.webp", "/media/photo-14.webp", "/media/photo-15.webp"]
  },
  {
    title: "DevOps Engineer",
    place: "Zebra Technologies Sri Lanka",
    period: "2022–2023",
    kind: "Work",
    story:
      "Focused on CI/CD modernization and environment consistency to make releases safer and faster.",
    responsibilities: [
      "Standardized deployment workflows across multiple services.",
      "Automated quality gates and rollback checks in CI/CD pipelines.",
      "Improved delivery visibility through shared operational dashboards."
    ],
    outcomes: [
      "Increased deployment speed while reducing release errors.",
      "Improved confidence in production rollout decisions."
    ],
    tools: ["GitHub Actions", "Azure DevOps", "Docker", "Kubernetes"],
    images: ["/media/photo-7.webp", "/media/photo-8.webp", "/media/photo-9.webp", "/media/photo-16.webp"]
  },
  {
    title: "DevOps Engineer",
    place: "London Stock Exchange Group Finland",
    period: "2023–2025",
    kind: "Work",
    story:
      "Drove platform reliability and operational simplicity in a high-stakes enterprise environment.",
    responsibilities: [
      "Automated infrastructure and deployment workflows for critical services.",
      "Improved observability, incident readiness, and recovery routines.",
      "Partnered with development teams to reduce operational complexity."
    ],
    outcomes: [
      "Delivered measurable cost, uptime, and deployment improvements.",
      "Improved platform stability and team delivery throughput."
    ],
    tools: ["AWS", "Azure", "Terraform", "Kubernetes", "Monitoring Stack"],
    images: [
      "/media/photo-4.webp",
      "/media/photo-5.webp",
      "/media/photo-6.webp",
      "/media/photo-17.webp",
      "/media/photo-18.webp",
      "/media/photo-19.webp"
    ]
  },
  {
    title: "Finnish Language Studies",
    place: "Arffman Oy",
    period: "2025–2026",
    kind: "Education",
    story:
      "Investing in language and communication skills to collaborate more effectively in local and international teams.",
    responsibilities: [
      "Completed structured Finnish language modules focused on professional communication."
    ],
    outcomes: [
      "Improved cross-cultural communication and integration in Finland."
    ],
    tools: ["Finnish Language Training", "Communication Practice"],
    images: ["/media/photo-20.webp", "/media/photo-21.webp", "/media/photo-22.webp"]
  }
];

export const metadata = createMetadata({
  title: "Work & Education",
  description: "Experience timeline for Malith Ileperuma including roles and studies.",
  path: "/work-education"
});

export default function WorkEducationPage() {
  const language = getServerLanguage();
  const t = getDictionary(language);
  const isFinnish = language === "fi";

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.workEducationPage.label}
        title={t.workEducationPage.title}
        description={t.workEducationPage.description}
      />

      <section className="relative pl-9">
        <span className="absolute bottom-0 left-2 top-2 w-px bg-border" aria-hidden="true" />

        <div className="space-y-9">
          {timeline.map((item) => (
            <article
              key={`${item.title}-${item.period}`}
              className="surface-card relative overflow-hidden p-5 sm:p-6"
            >
              <span
                className="absolute -left-[1.65rem] top-7 h-3 w-3 rounded-full border border-accent/70 bg-background"
                aria-hidden="true"
              />

              <div className="grid gap-6 lg:grid-cols-[168px_1fr] lg:items-start">
                <aside className="space-y-2 pt-0.5">
                  <p className="font-mono text-xs uppercase tracking-label text-muted">{item.period}</p>
                  <p className="font-mono text-xs uppercase tracking-label text-accent">
                    {item.kind === "Work" ? (isFinnish ? "Työ" : "Work") : isFinnish ? "Koulutus" : "Education"}
                  </p>
                </aside>

                <div className="space-y-6 lg:min-h-[21rem]">
                  <header className="space-y-2 border-b border-border pb-4">
                    <h2 className="font-serif text-3xl leading-tight text-text">{item.title}</h2>
                    <p className="text-sm text-muted">{item.place}</p>
                    <p className="max-w-reading text-sm leading-relaxed text-text">{item.story}</p>
                  </header>

                  <div className="grid gap-5 md:grid-cols-2">
                    <section className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">
                        {t.workEducationPage.responsibilities}
                      </p>
                      <ul className="space-y-2 text-sm leading-relaxed text-text">
                        {item.responsibilities.map((responsibility) => (
                          <li key={responsibility}>• {responsibility}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-label text-muted">
                        {t.workEducationPage.outcomes}
                      </p>
                      <ul className="space-y-2 text-sm leading-relaxed text-text">
                        {item.outcomes.map((outcome) => (
                          <li key={outcome}>• {outcome}</li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <section className="space-y-3">
                    <p className="font-mono text-xs uppercase tracking-label text-muted">{t.workEducationPage.tools}</p>
                    <ul className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-md border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-label text-muted"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <PhotoGrid
                    images={item.images}
                    altBase={item.title}
                    aspectClass="aspect-[5/4]"
                    maxItems={6}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
