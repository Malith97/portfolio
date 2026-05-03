import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { getLocalizedPostSummary, getLocalizedPostTitle } from "@/lib/post-translations";

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <aside className="rounded-md border border-border p-4">
      <p className="font-mono text-[11px] uppercase tracking-label text-accent">{title}</p>
      <p className="pt-2 text-sm leading-7 text-text">{body}</p>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="mx-auto mb-5 w-full max-w-[720px] font-serif text-3xl leading-tight text-text">{title}</h2>
      <div className="space-y-5 text-[1rem] leading-7 text-text [&>*:not(figure)]:mx-auto [&>*:not(figure)]:w-full [&>*:not(figure)]:max-w-[720px]">
        {children}
      </div>
    </section>
  );
}

function ArticleImage({
  src,
  alt,
  priority,
  caption
}: {
  src: string;
  alt: string;
  priority?: boolean;
  caption: string;
}) {
  return (
    <figure className="!mt-8 !mb-2 mx-auto w-full max-w-[720px]">
      <div className="overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={720}
          height={480}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) calc(100vw - 3rem), 720px"
          className="block h-auto w-full object-contain"
        />
      </div>
      <figcaption className="mt-2 mx-auto w-full max-w-[720px] text-sm leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}

export async function CloudCostOptimizationEditorial() {
  const language = await getServerLanguage();
  const t = getDictionary(language);
  const title = getLocalizedPostTitle("cloud-cost-optimization", "Cloud Cost Optimization", language);
  const summary = getLocalizedPostSummary(
    "cloud-cost-optimization",
    "How I reduced cloud spend by 35% (~$75K/year) through visibility, governance, automation, and continuous monitoring.",
    language
  );

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-14 sm:space-y-16">
      <header className="mx-auto w-full max-w-[720px] space-y-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-muted">{t.common.caseStudy.toUpperCase()}</p>
        <h1 className="font-serif text-4xl leading-tight text-text sm:text-6xl">{title}</h1>
        <p className="text-base leading-7 text-muted">{summary}</p>
        <p className="font-mono text-xs tracking-label text-muted">
          FinOps · Cloud Governance · AWS · Kubernetes · Monitoring
        </p>
      </header>

      <Section title="The problem">
        <p>
          In this case study from my previous role, I share the full cloud cost optimization journey, from identifying spend
          drivers to implementing long-term controls.
        </p>
        <p>
          As cloud adoption increased, cloud bills increased with it. Without active management, costs were beginning to outpace
          predictable planning and operational discipline.
        </p>
        <p>
          The objective was not cost-cutting in isolation. The objective was to optimize cost while preserving performance,
          delivery speed, and scalability.
        </p>
        <ArticleImage
          src="/case-studies/cloud-cost-optimization/img1.webp"
          alt="Cloud cost optimization baseline visibility"
          priority
          caption="Initial baseline: cloud usage was expanding faster than shared cost visibility and governance."
        />
      </Section>

      <Section title="Why spend was increasing">
        <p>
          As our cloud environments expanded, associated costs expanded rapidly as well. Teams were provisioning resources quickly
          to support delivery, but centralized spend control was not keeping pace.
        </p>
        <p>
          In my department, roughly 50–60 professionals across engineering, QA, product, and business functions depended on
          cloud environments daily. Without unified governance, inefficiencies compounded.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Individual and distributed testing environments were provisioned freely, creating resource sprawl.</li>
          <li>Environments were often left running overnight and on weekends.</li>
          <li>Higher-spec machines were requested even when lower classes were sufficient.</li>
          <li>Unused environments were not consistently decommissioned.</li>
          <li>
            In Kubernetes, we saw over-provisioned pods and nodes, orphaned persistent volumes, and misconfigured autoscaling.
          </li>
        </ul>
        <p>
          These issues made cost forecasting difficult and placed increasing pressure on budget efficiency and operational
          governance.
        </p>
      </Section>

      <Section title="Finding the cost drivers">
        <p>
          To address escalating costs, I applied a structured approach combining data analysis, team collaboration, automation,
          and continuous governance.
        </p>
        <p>
          Monthly spend averaged around $20,000 and was projected to rise toward $24,000 without intervention. The initial target
          was to reduce spend by at least 30%.
        </p>
        <h3 className="pt-1 font-serif text-2xl leading-tight text-text">Data Collection and Analysis</h3>
        <p>
          We used AWS Cost Explorer, custom tagging policies, and Prometheus/Grafana dashboards to map high-spend resource groups
          and recurring inefficiencies.
        </p>
        <p>Key inefficiency categories included:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Idle databases</li>
          <li>Oversized or unused snapshots</li>
          <li>Outdated images and stale artifacts</li>
          <li>Off-hour runtime waste</li>
          <li>High network transfer patterns</li>
          <li>Over-provisioned instances and excessive node counts</li>
          <li>Orphaned persistent volumes</li>
          <li>Underused Spot opportunities</li>
        </ul>
        <Callout
          title="Visibility before optimization"
          body="Before reducing spend, we needed a reliable baseline showing exactly which workloads and behaviors were driving cloud cost drift."
        />
        <ArticleImage
          src="/case-studies/cloud-cost-optimization/img2.webp"
          alt="Cloud spend growth and visibility gaps"
          caption="As platform usage grew, unmanaged provisioning patterns drove avoidable spend."
        />
      </Section>

      <Section title="What we changed">
        <p>
          With hotspots identified, implementation focused on targeted automation, policy enforcement, and recurring operational
          review loops. The actions below were executed as one program, not isolated fixes.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">1. Idle Databases</h3>
        <p>
          Lambda workflows monitored database connection and CPU signals via CloudWatch. Development databases idle for sustained
          periods (for example, over 4 hours) were stopped automatically.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">2. Oversized and Unused Snapshots</h3>
        <p>
          Snapshot lifecycle tagging (`usage=no_use_30`, `usage=no_use_60`) drove review and removal. Items inactive long enough
          (for example, around 75 days) were deleted after report-based verification.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">3. Outdated Images</h3>
        <p>
          ECR lifecycle policies and image scanning removed deprecated container images. AMI hygiene was tightened with regular
          cleanup, patching, and benchmark alignment.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">4. Resource Uptime and Off-Hour Usage</h3>
        <p>
          CloudWatch schedules with Lambda reduced non-production runtime at night and on weekends. Controlled override paths
          allowed critical environments to stay active when needed.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">5. High Network Costs</h3>
        <p>
          We reduced unnecessary transfer costs by improving regional placement and limiting cross-region replication to critical
          traffic.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">6. Data Retention and Release Hygiene</h3>
        <p>
          S3 lifecycle rules automated transitions and deletion by age and access pattern. Unwanted logs and stale release
          artifacts were removed, with colder data moved to lower-cost storage tiers.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">7. Over-Provisioned Instances</h3>
        <p>
          Resource request patterns were normalized. Cases such as requesting 6 vCPUs where 4 were sufficient were corrected
          through provisioning guidance and review.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">8. Excessive Kubernetes Node Counts</h3>
        <p>
          Cluster Autoscaler thresholds and scale-down timing were tuned. Pod requests and limits were standardized to improve
          packing efficiency and reduce over-allocation.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">9. Orphaned Persistent Volumes</h3>
        <p>
          Scheduled checks flagged unattached EBS volumes for review and safe cleanup, reducing persistent storage waste.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">10. Spot Instances</h3>
        <p>
          Spot was adopted for short-lived build workloads (often 15 minutes to 1 hour), with on-demand fallback and diversified
          fleets to maintain reliability.
        </p>

        <Callout
          title="Governance prevents regression"
          body="One-time cleanup helps briefly. Policy guardrails, ownership rules, and recurring review cycles prevent cost drift from returning."
        />
      </Section>

      <Section title="Making savings sustainable">
        <p>
          Sustained cloud savings require continuous monitoring and governance. Without operational follow-through, initial gains
          erode and waste patterns return.
        </p>
        <p>
          Real-time dashboards and alerts helped detect anomalies early. Automated policy enforcement kept tagging, resource
          limits, and access controls consistent across teams and environments.
        </p>
        <p>Key sustainability practices:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Continuous monitoring with real-time dashboards and anomaly alerting</li>
          <li>Automated governance for tagging and resource usage rules</li>
          <li>Regular cost reviews with cross-functional stakeholders</li>
          <li>Training and culture-building around cost awareness</li>
          <li>Expanded lifecycle automation for recurring optimization tasks</li>
          <li>Agile adaptation of cost strategy as product and usage patterns evolve</li>
        </ul>
        <Callout
          title="Automation keeps savings sustainable"
          body="Savings persisted because lifecycle controls, policy checks, and anomaly detection stayed active beyond the initial optimization window."
        />
        <ArticleImage
          src="/case-studies/cloud-cost-optimization/img3.webp"
          alt="Cloud optimization outcomes and sustainability"
          caption="Improvements held because monitoring, governance, and automation were treated as ongoing operating routines."
        />
      </Section>

      <Section title="Outcome and lessons learned">
        <p>
          Cloud cost reduction is not a one-time activity. It requires an engineering culture that treats cost as an operational
          quality dimension alongside performance, reliability, and security.
        </p>
        <p>
          Through automation, monitoring, and governance, we achieved substantial spend reduction while protecting delivery and
          platform stability.
        </p>
        <p>
          In this portfolio case-study framing, the program delivered <strong>35%</strong> cloud cost reduction, equivalent to
          roughly <strong>$75K/year</strong>. In the original source operating window, monthly spend movement from ~$20K toward
          ~$12K was also documented during active optimization cycles.
        </p>
        <p>Key takeaways:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Cloud cost management is a shared responsibility across engineering and leadership.</li>
          <li>Visibility and transparency align technical decisions with business objectives.</li>
          <li>Governance must be ongoing to prevent regression.</li>
          <li>Automation makes optimization repeatable and sustainable at scale.</li>
        </ul>
      </Section>

      <footer className="mx-auto w-full max-w-[720px] border-t border-border pt-6">
        <p className="font-mono text-[11px] tracking-label text-muted">{t.common.originallyPublishedOnMedium}</p>
        <a
          href="https://medium.com/@mileperuma/optimizing-cloud-spend-with-precision-my-approach-to-cutting-cloud-costs-by-40-d9ba311bc252"
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link mt-2 inline-block text-sm text-accent"
        >
          {t.common.viewOriginalArticleOnMedium}
        </a>
        <div className="pt-4">
          <Link href="/case-studies" className="quiet-link text-sm text-muted">
            {t.common.backToCaseStudies}
          </Link>
        </div>
      </footer>
    </div>
  );
}
