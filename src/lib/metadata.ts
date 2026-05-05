import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://malithileperuma.com";

export const siteDescription =
  "Minimal portfolio for Malith Ileperuma, a DevOps Engineer in Finland focused on reliable cloud systems and practical automation.";

interface MetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
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
  const title = input.title
    ? `${input.title} | Malith Ileperuma`
    : "Malith Ileperuma | DevOps Engineer";

  const description = input.description ?? siteDescription;
  const path = input.path ?? "/";
  const url = resolveCanonicalUrl(normalizedSiteUrl, path);
  const image = input.image ?? "/media/malith-portrait.jpg";
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@Malith97",
    },
  };
}
