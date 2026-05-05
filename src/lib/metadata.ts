import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://malithileperuma.com";

export const homepageTitle =
  "Malith Ileperuma | DevOps Engineer and Cloud Automation Specialist";

export const homepageDescription =
  "DevOps Engineer specializing in cloud automation, infrastructure as code, CI/CD pipelines, and scalable software delivery.";

export const homepageTitleFi =
  "Malith Ileperuma | DevOps Engineer ja pilviautomaation asiantuntija";

export const homepageDescriptionFi =
  "DevOps Engineer, joka rakentaa pilviautomaatiota, infrastruktuuria koodina, CI/CD-putkia ja skaalautuvia ohjelmistotoimituksia.";

export const siteDescription = homepageDescription;

interface MetadataInput {
  fullTitle?: string;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  openGraphType?: "website" | "article";
}

function normalizeSiteUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveCanonicalUrl(baseUrl: string, path: string): string {
  if (path === "/") {
    return baseUrl;
  }

  return `${baseUrl}${path}`;
}

export function createMetadata(input: MetadataInput = {}): Metadata {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const title =
    input.fullTitle ?? (input.title ? `${input.title} | Malith Ileperuma` : homepageTitle);

  const description = input.description ?? siteDescription;
  const path = input.path ?? "/";
  const url = resolveCanonicalUrl(normalizedSiteUrl, path);
  const image = input.image ?? "/media/malith-portrait.jpg";
  const openGraphType = input.openGraphType ?? "website";
  const imageUrl = image.startsWith("http")
    ? image
    : `${normalizedSiteUrl}${image}`;

  return {
    title,
    description,
    metadataBase: new URL(normalizedSiteUrl),
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/media/malith-avatar.png", type: "image/png" }],
      shortcut: [{ url: "/media/malith-avatar.png", type: "image/png" }],
      apple: [{ url: "/media/malith-avatar.png", type: "image/png" }],
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      siteName: "Malith Ileperuma",
      locale: "en_US",
      alternateLocale: ["fi_FI"],
      type: openGraphType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@Malith97",
      site: "@Malith97",
    },
  };
}
