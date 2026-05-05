import type { MetadataRoute } from "next";
import { getAllBeyondWorkPosts, getAllCaseStudies } from "@/lib/content";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

const baseUrl = "https://malithileperuma.com";
export const dynamic = "force-static";

const now = new Date();

const routes: Array<{
  path: string;
  priority: number;
}> = [
  { path: "/", priority: 1 },
  { path: "/story", priority: 0.9 },
  { path: "/experience", priority: 0.85 },
  { path: "/about", priority: 0.9 },
  { path: "/case-studies", priority: 0.8 },
  { path: "/work-education", priority: 0.8 },
  { path: "/contact", priority: 0.6 },
  { path: "/beyond-work", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, beyondWorkPosts] = await Promise.all([
    getAllCaseStudies(DEFAULT_LANGUAGE),
    getAllBeyondWorkPosts(DEFAULT_LANGUAGE),
  ]);

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: route.path === "/" ? baseUrl : `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route.priority,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((post) => ({
    url: `${baseUrl}/case-studies/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const beyondWorkEntries: MetadataRoute.Sitemap = beyondWorkPosts.map((post) => ({
    url: `${baseUrl}/beyond-work/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...caseStudyEntries, ...beyondWorkEntries];
}
