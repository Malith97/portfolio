import type { Metadata } from "next";

const baseUrl = "https://malithileperuma.dev";

export const siteDescription =
  "Minimal portfolio for Malith Ileperuma, a DevOps Engineer in Finland focused on reliable cloud systems and practical automation.";

interface MetadataInput {
  title?: string;
  description?: string;
  path?: string;
}

export function createMetadata(input: MetadataInput = {}): Metadata {
  const title = input.title
    ? `${input.title} | Malith Ileperuma`
    : "Malith Ileperuma | DevOps Engineer";

  const description = input.description ?? siteDescription;
  const path = input.path ?? "/";
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Malith Ileperuma",
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
