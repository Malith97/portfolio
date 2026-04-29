import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
  caption
}: {
  src: string;
  alt: string;
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
          loading="lazy"
          sizes="(max-width: 768px) calc(100vw - 3rem), 720px"
          className="block h-auto w-full object-contain"
        />
      </div>
      <figcaption className="mt-2 mx-auto w-full max-w-[720px] text-sm leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}

export function KubernetesRbacOktaEditorial() {
  return (
    <div className="mx-auto w-full max-w-[720px] space-y-14 sm:space-y-16">
      <header className="mx-auto w-full max-w-[720px] space-y-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-muted">CASE STUDY</p>
        <h1 className="font-serif text-4xl leading-tight text-text sm:text-6xl">Supercharge Kubernetes RBAC with Okta</h1>
        <p className="text-base leading-7 text-muted">
          Improving Kubernetes access control with identity-driven RBAC, Okta integration, and safer multi-team cluster access.
        </p>
        <p className="font-mono text-xs tracking-label text-muted">
          Kubernetes · RBAC · Okta · Security · Identity Access
        </p>
      </header>

      <Section title="Introduction">
        <p>
          Kubernetes is a powerful platform for orchestrating applications at scale, but managing secure access to cluster
          resources becomes increasingly complex as teams grow.
        </p>
        <p>
          To address this, I implemented an identity-first RBAC approach by integrating Kubernetes with Okta. This made access
          control easier to manage, more auditable, and safer across engineering teams.
        </p>
        <Callout
          title="Identity Before Permissions"
          body="Access policy becomes more reliable when identity governance is centralized first, then mapped to Kubernetes roles."
        />
        <ArticleImage
          src="/case-studies/kubernetes-rbac-okta/img1.webp"
          alt="Kubernetes access control with centralized identity"
          caption="Centralized identity made role assignment and access lifecycle management easier across teams."
        />
      </Section>

      <Section title="The Challenge of Traditional Kubernetes Access Management">
        <p>
          In many Kubernetes environments, access control relies on static credentials and manually maintained role bindings.
          Over time, this creates security and operational overhead.
        </p>
        <p>Core issues we faced:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Static kubeconfig credentials are difficult to rotate and easy to misuse.</li>
          <li>No centralized identity source means user lifecycle events are inconsistently enforced.</li>
          <li>Manual role updates are error-prone and slow in fast-moving teams.</li>
          <li>Poor auditability makes it difficult to answer who has access to what and why.</li>
        </ul>
        <p>
          Without centralized identity and policy alignment, cluster access can drift from least-privilege standards.
        </p>
      </Section>

      <Section title="How to Integrate Kubernetes RBAC with Okta">
        <p>
          The implementation combined Kubernetes RBAC primitives with Okta groups and OIDC authentication.
        </p>

        <h3 className="pt-1 font-serif text-2xl leading-tight text-text">1. Create Okta Groups by Access Scope</h3>
        <p>I created group structures in Okta to map directly to Kubernetes access patterns, for example:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>`k8s-admins`</li>
          <li>`k8s-developers`</li>
          <li>`k8s-readonly`</li>
        </ul>
        <p>
          This allowed access ownership to stay with identity governance while Kubernetes consumed group claims.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">2. Define Kubernetes Roles and RoleBindings</h3>
        <p>
          For each access scope, I defined Kubernetes `Role` / `ClusterRole` objects and mapped them with `RoleBinding` /
          `ClusterRoleBinding`.
        </p>
        <p>Typical workflow:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml`}</code>
        </pre>
        <p>
          The role definition scoped actions to required resources only, and the binding linked those permissions to the matching
          Okta group.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">
          3. Configure OIDC Authentication in Kubernetes and kubectl
        </h3>
        <p>
          I configured Kubernetes authentication to trust Okta as the OIDC identity provider and used OIDC-based login for client
          access.
        </p>
        <p>Representative client setup pattern:</p>
        <pre className="overflow-x-auto rounded-md border border-border bg-[#121212] p-4 text-sm leading-6 text-text">
          <code>{`kubectl config set-credentials okta-user \\
  --exec-api-version=client.authentication.k8s.io/v1beta1 \\
  --exec-command=kubectl \\
  --exec-arg=oidc-login \\
  --exec-arg=get-token \\
  --exec-arg=--oidc-issuer-url=https://<okta-domain>/oauth2/default \\
  --exec-arg=--oidc-client-id=<client-id> \\
  --exec-arg=--oidc-extra-scope=groups`}</code>
        </pre>
        <p>
          This ensured authenticated sessions produced identity tokens that included group claims used by RBAC bindings.
        </p>

        <h3 className="font-serif text-2xl leading-tight text-text">4. Validate Access with Group-Based Tests</h3>
        <p>I validated the setup by testing access behavior across user personas:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Admin users with elevated permissions</li>
          <li>Developer users with namespace-scoped privileges</li>
          <li>Read-only users with view-only access</li>
        </ul>
        <p>This confirmed policy boundaries worked as expected.</p>
        <Callout
          title="Mapping Must Be Deterministic"
          body="RBAC reliability depends on consistent group naming, claim mapping, and binding validation across environments."
        />
        <ArticleImage
          src="/case-studies/kubernetes-rbac-okta/img2.webp"
          alt="Role mapping and secure team access flow"
          caption="Group-to-role mapping improved access clarity and reduced manual policy drift."
        />
      </Section>

      <Section title="Benefits of Using Okta for Kubernetes RBAC">
        <p>The integration delivered practical security and operational improvements:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Centralized access management through one identity platform</li>
          <li>Stronger security via OIDC and group-based authorization</li>
          <li>Scalability for onboarding/offboarding across many teams</li>
          <li>Improved compliance with clearer audit trails</li>
          <li>Consistent access policy enforcement across clusters</li>
          <li>Lower operational overhead for access administration</li>
          <li>Faster incident response when revoking or updating access</li>
        </ul>
      </Section>

      <Section title="Technical Issues and How to Fix Them">
        <p>During implementation, several issues surfaced and were resolved:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>OIDC misconfiguration</strong>: Incorrect issuer URLs, client settings, or claim mappings were corrected by
            aligning Kubernetes OIDC settings with Okta app configuration and verifying token claims.
          </li>
          <li>
            <strong>Role binding mismatches</strong>: Okta group names and RBAC subjects were standardized with consistent naming
            conventions and recurring binding validation.
          </li>
          <li>
            <strong>Token/session failures</strong>: Session handling and client auth tooling checks were improved to reduce
            expiry-related issues.
          </li>
          <li>
            <strong>Permission debugging complexity</strong>: Deterministic policy tests and clearer role boundary documentation
            improved troubleshooting.
          </li>
        </ul>
        <Callout
          title="Auditability Is a Security Feature"
          body="Centralized identity and explicit role bindings made access decisions easier to trace during reviews and incidents."
        />
      </Section>

      <Section title="Benefits and Drawbacks">
        <p>A realistic implementation view includes trade-offs.</p>
        <h3 className="pt-1 font-serif text-2xl leading-tight text-text">Benefits</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>Security posture improves through identity-backed least privilege</li>
          <li>Access lifecycle management becomes faster and cleaner</li>
          <li>Governance and audits are significantly easier</li>
        </ul>
        <h3 className="font-serif text-2xl leading-tight text-text">Drawbacks</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>Initial setup complexity is non-trivial</li>
          <li>Teams need OIDC/RBAC operational familiarity</li>
          <li>Identity availability and integration health become critical dependencies</li>
        </ul>
      </Section>

      <Section title="Conclusion">
        <p>
          Integrating Kubernetes RBAC with Okta is a high-leverage upgrade for organizations managing multi-team clusters.
        </p>
        <p>
          By combining centralized identity, group-based authorization, and policy-driven RBAC, teams gain better security,
          stronger governance, and more maintainable access operations.
        </p>
        <p>
          For organizations scaling Kubernetes adoption, this pattern creates a safer and more operationally sustainable access
          model.
        </p>
      </Section>

      <footer className="mx-auto w-full max-w-[720px] border-t border-border pt-6">
        <p className="font-mono text-[11px] tracking-label text-muted">Originally published on Medium</p>
        <a
          href="https://medium.com/@mileperuma/supercharge-kubernetes-rbac-with-okta-1e0462a04abe"
          target="_blank"
          rel="noreferrer"
          className="quiet-link mt-2 inline-block text-sm text-accent"
        >
          https://medium.com/@mileperuma/supercharge-kubernetes-rbac-with-okta-1e0462a04abe
        </a>
        <div className="pt-4">
          <Link href="/case-studies" className="quiet-link text-sm text-muted">
            Back to case studies
          </Link>
        </div>
      </footer>
    </div>
  );
}
