import type { MetadataRoute } from "next";

const baseUrl = "https://malithileperuma.dev";
export const dynamic = "force-static";

const pages = ["", "/story", "/work-education", "/case-studies", "/beyond-work", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    changeFrequency: "monthly",
    priority: page === "" ? 1 : 0.7
  }));
}
