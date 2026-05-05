import type { MetadataRoute } from "next";

import { siteDescription, siteUrl } from "@/lib/metadata";

const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Malith Ileperuma | DevOps Engineer",
    short_name: "Malith Portfolio",
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      {
        src: "/media/malith-avatar.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/media/malith-avatar.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    id: `${normalizedSiteUrl}/`,
  };
}
