import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://malithileperuma.dev";

export const siteDescription =
  "Minimal portfolio for Malith Ileperuma, a DevOps Engineer in Finland focused on reliable cloud systems and practical automation.";

interface MetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export function createMetadata(input: MetadataInput = {}): Metadata {
  const title = input.title
    ? `${input.title} | Malith Ileperuma`
    : "Malith Ileperuma | DevOps Engineer";

  const description = input.description ?? siteDescription;
  const path = input.path ?? "/";
  const url = `${siteUrl}${path}`;
  const image = input.image ?? "/media/malith-portrait.jpg";
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
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
    },
  };
}
