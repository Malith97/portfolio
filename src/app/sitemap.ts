import fs from "node:fs/promises";
import path from "node:path";

import type { MetadataRoute } from "next";
import matter from "gray-matter";

const baseUrl = "https://malithileperuma.com";
export const dynamic = "force-static";

interface ContentRouteEntry {
  path: string;
  lastModified: Date;
}

const staticRoutes: Array<{
  path: string;
  priority: number;
  pageFile: string;
}> = [
  { path: "/", priority: 1.0, pageFile: "src/app/page.tsx" },
  { path: "/story", priority: 0.9, pageFile: "src/app/story/page.tsx" },
  {
    path: "/case-studies",
    priority: 0.8,
    pageFile: "src/app/case-studies/page.tsx",
  },
  {
    path: "/beyond-work",
    priority: 0.7,
    pageFile: "src/app/beyond-work/page.tsx",
  },
  { path: "/contact", priority: 0.6, pageFile: "src/app/contact/page.tsx" },
  { path: "/about", priority: 0.6, pageFile: "src/app/about/page.tsx" },
  {
    path: "/work-education",
    priority: 0.6,
    pageFile: "src/app/work-education/page.tsx",
  },
];

function toCanonical(pathname: string): string {
  return pathname === "/" ? baseUrl : `${baseUrl}${pathname}`;
}

function parseLastModified(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function getContentRouteEntries(
  section: "case-studies" | "beyond-work",
): Promise<ContentRouteEntry[]> {
  const contentDir = path.join(process.cwd(), "content", section);
  const files = await fs.readdir(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const entries = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const fullPath = path.join(contentDir, fileName);
      const source = await fs.readFile(fullPath, "utf8");
      const stats = await fs.stat(fullPath);
      const { data } = matter(source);

      const fileSlug = fileName.replace(/\.mdx$/, "");
      const frontmatterSlug =
        typeof data.slug === "string" && data.slug.trim().length > 0
          ? data.slug.trim()
          : null;
      const slug = frontmatterSlug ?? fileSlug;
      const lastModified =
        parseLastModified(data.updatedAt) ??
        parseLastModified(data.lastModified) ??
        parseLastModified(data.date) ??
        stats.mtime;

      return {
        path: `/${section}/${slug}`,
        lastModified,
      } satisfies ContentRouteEntry;
    }),
  );

  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, beyondWorkEntries] = await Promise.all([
    getContentRouteEntries("case-studies"),
    getContentRouteEntries("beyond-work"),
  ]);
  const now = new Date();

  const staticRouteChecks = await Promise.all(
    staticRoutes.map(async (route) => ({
      route,
      exists: await fs
        .access(path.join(process.cwd(), route.pageFile))
        .then(() => true)
        .catch(() => false),
    })),
  );

  const staticEntries: MetadataRoute.Sitemap = staticRouteChecks
    .filter((entry) => entry.exists)
    .map(({ route }) => ({
      url: toCanonical(route.path),
      lastModified: now,
      changeFrequency: "monthly",
      priority: route.priority,
    }));

  const caseStudyItems: MetadataRoute.Sitemap = caseStudies.map((entry) => ({
    url: toCanonical(entry.path),
    lastModified: entry.lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const beyondWorkItems: MetadataRoute.Sitemap = beyondWorkEntries.map(
    (entry) => ({
      url: toCanonical(entry.path),
      lastModified: entry.lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...caseStudyItems, ...beyondWorkItems];
}
