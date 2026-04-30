"use client";

import Image from "next/image";
import { useState } from "react";

interface TechBadgeProps {
  tool: string;
}

interface DeviconRule {
  keywords: string[];
  iconPath: string;
}

interface TechIconProps {
  tool: string;
  className?: string;
}

const DEVICON_BASE_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const DEVICON_RULES: DeviconRule[] = [
  { keywords: ["amazon web services", "aws"], iconPath: "amazonwebservices/amazonwebservices-original.svg" },
  { keywords: ["cloudwatch", "eks", "iam"], iconPath: "amazonwebservices/amazonwebservices-original.svg" },
  { keywords: ["oracle cloud", "oracle"], iconPath: "oracle/oracle-original.svg" },
  { keywords: ["azure devops"], iconPath: "azuredevops/azuredevops-original.svg" },
  { keywords: ["azure"], iconPath: "azure/azure-original.svg" },
  { keywords: ["argocd", "argo cd"], iconPath: "argocd/argocd-original.svg" },
  { keywords: ["gitlab ci", "gitlab"], iconPath: "gitlab/gitlab-original.svg" },
  { keywords: ["github actions"], iconPath: "githubactions/githubactions-original.svg" },
  { keywords: ["jenkins"], iconPath: "jenkins/jenkins-original.svg" },
  { keywords: ["docker"], iconPath: "docker/docker-original.svg" },
  { keywords: ["kubernetes"], iconPath: "kubernetes/kubernetes-original.svg" },
  { keywords: ["helm"], iconPath: "helm/helm-original.svg" },
  { keywords: ["terraform"], iconPath: "terraform/terraform-original.svg" },
  { keywords: ["ansible"], iconPath: "ansible/ansible-original.svg" },
  { keywords: ["selenium"], iconPath: "selenium/selenium-original.svg" },
  { keywords: ["prometheus"], iconPath: "prometheus/prometheus-original.svg" },
  { keywords: ["grafana"], iconPath: "grafana/grafana-original.svg" },
  { keywords: ["datadog"], iconPath: "datadog/datadog-original.svg" },
  { keywords: ["react"], iconPath: "react/react-original.svg" },
  { keywords: ["node.js", "nodejs"], iconPath: "nodedotjs/nodedotjs-original.svg" },
  { keywords: ["postgresql", "postgres"], iconPath: "postgresql/postgresql-original.svg" },
  { keywords: ["powershell", "pwsh"], iconPath: "powershell/powershell-original.svg" },
  { keywords: ["bash"], iconPath: "bash/bash-original.svg" },
  { keywords: ["python"], iconPath: "python/python-original.svg" },
  { keywords: ["go"], iconPath: "go/go-original.svg" },
  { keywords: ["rust"], iconPath: "rust/rust-original.svg" },
  { keywords: ["linux"], iconPath: "linux/linux-original.svg" },
  { keywords: ["nginx"], iconPath: "nginx/nginx-original.svg" },
  { keywords: ["java"], iconPath: "java/java-original.svg" },
  { keywords: ["gitops", "git"], iconPath: "git/git-original.svg" }
];

function resolveDeviconPath(tool: string): string | null {
  const normalized = tool.trim().toLowerCase();
  const match = DEVICON_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.iconPath ?? null;
}

function fallbackGlyph(tool: string): string {
  const words = tool
    .split(/[\s/-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "•";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export function TechIcon({ tool, className = "h-4 w-4" }: TechIconProps) {
  const iconPath = resolveDeviconPath(tool);
  const [iconLoadFailed, setIconLoadFailed] = useState(false);

  if (iconPath && !iconLoadFailed) {
    return (
      <Image
        src={`${DEVICON_BASE_URL}/${iconPath}`}
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
        sizes="16px"
        className={`${className} object-contain`}
        loading="lazy"
        onError={() => setIconLoadFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-background font-mono text-[8px] font-semibold uppercase text-accent/90"
    >
      {fallbackGlyph(tool)}
    </span>
  );
}

export function TechBadge({ tool }: TechBadgeProps) {
  return (
    <li className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1">
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center" role="img" aria-label={`${tool} icon`}>
        <TechIcon tool={tool} />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-label text-muted">{tool}</span>
    </li>
  );
}
