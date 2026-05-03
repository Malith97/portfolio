import type { MetadataRoute } from "next";

const baseUrl = "https://malithileperuma.com";
export const dynamic = "force-static";

const now = new Date();

const routes: Array<{
  path: string;
  priority: number;
}> = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.9 },
  { path: "/case-studies", priority: 0.8 },
  { path: "/work-education", priority: 0.8 },
  { path: "/contact", priority: 0.6 },
  { path: "/beyond-work", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: route.path === "/" ? baseUrl : `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
