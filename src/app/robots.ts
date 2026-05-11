import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*.txt", "/*.html"],
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
