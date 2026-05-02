"use client";

import Image from "next/image";
import { useState } from "react";

export type SocialPlatform = "linkedin" | "github" | "medium" | "stackoverflow" | "youtube";

interface SocialLinkIconProps {
  platform: SocialPlatform;
  className?: string;
}

const DEVICON_BASE_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const DEVICON_ICON_PATHS: Record<SocialPlatform, string> = {
  linkedin: "linkedin/linkedin-original.svg",
  github: "github/github-original.svg",
  medium: "medium/medium-original.svg",
  stackoverflow: "stackoverflow/stackoverflow-original.svg",
  youtube: "youtube/youtube-original.svg"
};

function FallbackIcon({ platform, className }: { platform: SocialPlatform; className: string }) {
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7" />
        <path d="M8 7h.01" />
        <path d="M12 17v-4a2 2 0 1 1 4 0v4" />
      </svg>
    );
  }

  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M9 19c-4 1.2-4-2-6-2" />
        <path d="M15 22v-3.6a3.3 3.3 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-7a5.4 5.4 0 0 0-1.4-3.7 5 5 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13.2 13.2 0 0 0-7 0C5.4 1.1 4.2 1.5 4.2 1.5a5 5 0 0 0-.1 3.6A5.4 5.4 0 0 0 2.7 8.8c0 5.4 3.1 6.6 6.2 7a3.3 3.3 0 0 0-.9 2.6V22" />
      </svg>
    );
  }

  if (platform === "medium") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="8" cy="12" r="4" />
        <ellipse cx="16.5" cy="12" rx="2.5" ry="4" />
        <path d="M21 8v8" />
      </svg>
    );
  }

  if (platform === "stackoverflow") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M7 17h10" />
        <path d="M8 14h8" />
        <path d="M9 11h6" />
        <path d="m10 8 4 2" />
        <path d="m12 5 2 3" />
        <path d="M6 19h12v-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  );
}

export function SocialLinkIcon({ platform, className = "h-4 w-4" }: SocialLinkIconProps) {
  const [iconLoadFailed, setIconLoadFailed] = useState(false);
  const iconPath = DEVICON_ICON_PATHS[platform];

  if (!iconLoadFailed) {
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

  return <FallbackIcon platform={platform} className={className} />;
}
