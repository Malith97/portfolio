import type { MetadataRoute } from "next";

const baseUrl = "https://malithileperuma.com";
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
