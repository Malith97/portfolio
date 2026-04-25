import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type ContentSection = "case-studies" | "beyond-work";

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  image: string;
  images: string[];
  coverImage?: string;
  photos: string[];
  impact?: string;
  category?: string;
  location?: string;
  featured?: boolean;
  distance?: string;
  duration?: string;
  weather?: string;
  route?: string;
  routeImage?: string;
  difficulty?: string;
  theme?: string;
  photoCount?: string;
  notes?: string;
  gear: string[];
  highlights: string[];
  readingTime: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function getDirectory(section: ContentSection): string {
  return path.join(CONTENT_ROOT, section);
}

function toReadingTime(markdown: string): string {
  const text = markdown.replace(/[\n#*_`>-]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function normalizeMeta(
  slug: string,
  data: Record<string, unknown>,
  markdown: string
): PostMeta {
  const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const images = toStringArray(data.images);
  const photos = toStringArray(data.photos);
  const mergedImages = [...images, ...photos];
  const uniqueImages = mergedImages.filter((image, index) => mergedImages.indexOf(image) === index);

  const coverImage =
    typeof data.coverImage === "string"
      ? data.coverImage
      : typeof data.image === "string"
        ? data.image
        : uniqueImages[0] ?? "";

  const tags = toStringArray(data.tags);
  const gear = toStringArray(data.gear);
  const highlights = toStringArray(data.highlights);

  return {
    slug: typeof data.slug === "string" ? data.slug : slug,
    title: typeof data.title === "string" ? data.title : slug,
    summary: typeof data.summary === "string" ? data.summary : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    tags,
    image: coverImage,
    images: uniqueImages.length > 0 ? uniqueImages : coverImage ? [coverImage] : [],
    coverImage,
    photos: uniqueImages.length > 0 ? uniqueImages : coverImage ? [coverImage] : [],
    impact: typeof data.impact === "string" ? data.impact : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    location: typeof data.location === "string" ? data.location : undefined,
    featured: typeof data.featured === "boolean" ? data.featured : false,
    distance: typeof data.distance === "string" ? data.distance : undefined,
    duration: typeof data.duration === "string" ? data.duration : undefined,
    weather: typeof data.weather === "string" ? data.weather : undefined,
    route: typeof data.route === "string" ? data.route : undefined,
    routeImage: typeof data.routeImage === "string" ? data.routeImage : undefined,
    difficulty: typeof data.difficulty === "string" ? data.difficulty : undefined,
    theme: typeof data.theme === "string" ? data.theme : undefined,
    photoCount: typeof data.photoCount === "string" ? data.photoCount : undefined,
    notes: typeof data.notes === "string" ? data.notes : undefined,
    gear,
    highlights,
    readingTime: toReadingTime(markdown)
  };
}

async function readPostFile(section: ContentSection, slug: string): Promise<string> {
  const directory = getDirectory(section);
  const candidates = [
    path.join(directory, `${slug}.mdx`),
    path.join(directory, `${slug}.md`)
  ];

  for (const file of candidates) {
    try {
      return await fs.readFile(file, "utf8");
    } catch {
      // continue to next candidate
    }
  }

  throw new Error(`Post not found: ${section}/${slug}`);
}

export async function getAllPosts(section: ContentSection): Promise<PostMeta[]> {
  const directory = getDirectory(section);
  const files = await fs.readdir(directory);
  const postFiles = files.filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts = await Promise.all(
    postFiles.map(async (file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const source = await readPostFile(section, slug);
      const { data, content } = matter(source);
      return normalizeMeta(slug, data as Record<string, unknown>, content);
    })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(
  section: ContentSection,
  slug: string
): Promise<Post | null> {
  try {
    const source = await readPostFile(section, slug);
    const { data, content } = matter(source);
    const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

    return {
      ...normalizeMeta(slug, data as Record<string, unknown>, content),
      contentHtml: processed.toString()
    };
  } catch {
    return null;
  }
}

export function getAllCaseStudies(): Promise<PostMeta[]> {
  return getAllPosts("case-studies");
}

export function getCaseStudyBySlug(slug: string): Promise<Post | null> {
  return getPostBySlug("case-studies", slug);
}

export function getAllBeyondWorkPosts(): Promise<PostMeta[]> {
  return getAllPosts("beyond-work");
}

export function getBeyondWorkPostBySlug(slug: string): Promise<Post | null> {
  return getPostBySlug("beyond-work", slug);
}
