import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Language } from "@/lib/i18n";

export type ContentSection = "case-studies" | "beyond-work";

export type MapMode = "run" | "bike";

export interface PostMapMeta {
  title?: string;
  mode?: MapMode;
  points?: [number, number][];
  start?: [number, number];
  end?: [number, number];
  routeFile?: string;
  distanceLabel?: string;
}

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
  categoryId?: string;
  category?: string;
  location?: string;
  featured?: boolean;
  cardMeta?: string;
  distance?: string;
  duration?: string;
  occasion?: string;
  event?: string;
  result?: string;
  team?: string;
  weather?: string;
  route?: string;
  routeImage?: string;
  map?: PostMapMeta;
  difficulty?: string;
  theme?: string;
  photoCount?: string;
  notes?: string;
  temperature?: string;
  distanceWalked?: string;
  dishType?: string;
  cuisine?: string;
  timeSpent?: string;
  whatITried?: string;
  whatILearned?: string;
  sharedWith?: string;
  personalNote?: string;
  ingredients: string[];
  steps: string[];
  cookingTime?: string;
  notesForNextTime: string[];
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

function toReadingTime(markdown: string, language: Language): string {
  const text = markdown.replace(/[\n#*_`>-]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return language === "fi" ? `${minutes} min lukuaika` : `${minutes} min read`;
}

function optimizeContentHtml(html: string): string {
  const withOptimizedImages = html.replace(
    /<img\s+/g,
    '<img loading="lazy" decoding="async" ',
  );

  return withOptimizedImages.replace(
    /<a\s+([^>]*href="https?:\/\/[^"]+"[^>]*)>/g,
    (_match, attrs: string) => {
      const nextAttrs: string[] = [attrs.trim()];

      if (!/\btarget=/.test(attrs)) {
        nextAttrs.push('target="_blank"');
      }

      if (!/\brel=/.test(attrs)) {
        nextAttrs.push('rel="nofollow noopener noreferrer"');
      }

      return `<a ${nextAttrs.join(" ")}>`;
    },
  );
}

function normalizeMeta(
  slug: string,
  data: Record<string, unknown>,
  markdown: string,
  language: Language,
): PostMeta {
  const resolveLocalizedValue = <T>(value: unknown): T | undefined => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value as T;
    }

    if (typeof value === "object") {
      const localizedObject = value as Record<string, unknown>;
      const preferred =
        language === "fi"
          ? localizedObject.fi
          : (localizedObject.eng ?? localizedObject.en);
      const fallback =
        localizedObject.eng ?? localizedObject.en ?? localizedObject.fi;
      return (preferred ?? fallback) as T | undefined;
    }

    return value as T;
  };

  const getLocalizedField = <T>(key: string): T | undefined => {
    const directRaw = data[key];

    // Object-localized fields like { eng, fi } are resolved first.
    if (
      directRaw &&
      typeof directRaw === "object" &&
      !Array.isArray(directRaw)
    ) {
      const directObjectValue = resolveLocalizedValue<T>(directRaw);
      if (directObjectValue !== undefined) {
        return directObjectValue;
      }
    }

    // For Finnish, prefer explicit *Fi fields before falling back to base keys.
    if (language === "fi") {
      const fiValue = resolveLocalizedValue<T>(data[`${key}Fi`]);
      if (fiValue !== undefined) {
        return fiValue;
      }
    }

    return resolveLocalizedValue<T>(directRaw);
  };

  const getLocalizedString = (key: string): string | undefined => {
    const value = getLocalizedField<string>(key);
    return typeof value === "string" ? value : undefined;
  };

  const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      );
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getLocalizedStringArray = (key: string): string[] => {
    const directValue = getLocalizedField<unknown>(key);
    const localizedArray = toStringArray(directValue);
    if (localizedArray.length > 0) {
      return localizedArray;
    }

    return toStringArray(data[key]);
  };

  const toCoordinatePair = (value: unknown): [number, number] | undefined => {
    if (!Array.isArray(value) || value.length < 2) {
      return undefined;
    }

    const lat = Number(value[0]);
    const lon = Number(value[1]);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return undefined;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return undefined;
    }

    return [lat, lon];
  };

  const toMapMeta = (value: unknown): PostMapMeta | undefined => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    const mapObject = value as Record<string, unknown>;
    const rawMode =
      typeof mapObject.mode === "string"
        ? mapObject.mode.toLowerCase()
        : undefined;
    const mode: MapMode | undefined =
      rawMode === "run" || rawMode === "bike" ? rawMode : undefined;
    const points = Array.isArray(mapObject.points)
      ? mapObject.points
          .map((point) => toCoordinatePair(point))
          .filter((point): point is [number, number] => Boolean(point))
      : [];
    const start = toCoordinatePair(mapObject.start);
    const end = toCoordinatePair(mapObject.end);
    const routeFile = resolveLocalizedValue<string>(mapObject.routeFile);
    const title = resolveLocalizedValue<string>(mapObject.title);
    const distanceLabel = resolveLocalizedValue<string>(
      mapObject.distanceLabel,
    );

    if (!routeFile && points.length < 2 && !(start && end)) {
      return undefined;
    }

    return {
      title,
      mode,
      points: points.length >= 2 ? points : undefined,
      start,
      end,
      routeFile,
      distanceLabel,
    };
  };

  const images = getLocalizedStringArray("images");
  const photos = getLocalizedStringArray("photos");
  const mergedImages = [...images, ...photos];
  const uniqueImages = mergedImages.filter(
    (image, index) => mergedImages.indexOf(image) === index,
  );

  const coverImage =
    typeof getLocalizedString("coverImage") === "string"
      ? (getLocalizedString("coverImage") as string)
      : typeof getLocalizedString("image") === "string"
        ? (getLocalizedString("image") as string)
        : (uniqueImages[0] ?? "");

  const tags = getLocalizedStringArray("tags");
  const gear = getLocalizedStringArray("gear");
  const highlights = getLocalizedStringArray("highlights");
  const ingredients = getLocalizedStringArray("ingredients");
  const steps = getLocalizedStringArray("steps");
  const notesForNextTime = getLocalizedStringArray("notesForNextTime");

  return {
    slug:
      typeof getLocalizedString("slug") === "string"
        ? (getLocalizedString("slug") as string)
        : slug,
    title:
      typeof getLocalizedString("title") === "string"
        ? (getLocalizedString("title") as string)
        : slug,
    summary:
      typeof getLocalizedString("summary") === "string"
        ? (getLocalizedString("summary") as string)
        : "",
    date:
      typeof getLocalizedString("date") === "string"
        ? (getLocalizedString("date") as string)
        : "1970-01-01",
    tags,
    image: coverImage,
    images:
      uniqueImages.length > 0 ? uniqueImages : coverImage ? [coverImage] : [],
    coverImage,
    photos:
      uniqueImages.length > 0 ? uniqueImages : coverImage ? [coverImage] : [],
    impact: getLocalizedString("impact"),
    categoryId: getLocalizedString("categoryId"),
    category: getLocalizedString("category"),
    location: getLocalizedString("location"),
    featured: typeof data.featured === "boolean" ? data.featured : false,
    cardMeta: getLocalizedString("cardMeta"),
    distance: getLocalizedString("distance"),
    duration: getLocalizedString("duration"),
    occasion: getLocalizedString("occasion"),
    event: getLocalizedString("event"),
    result: getLocalizedString("result"),
    team: getLocalizedString("team"),
    weather: getLocalizedString("weather"),
    route: getLocalizedString("route"),
    routeImage: getLocalizedString("routeImage"),
    map: toMapMeta(resolveLocalizedValue<Record<string, unknown>>(data.map)),
    difficulty: getLocalizedString("difficulty"),
    theme: getLocalizedString("theme"),
    photoCount: getLocalizedString("photoCount"),
    notes: getLocalizedString("notes"),
    temperature: getLocalizedString("temperature"),
    distanceWalked: getLocalizedString("distanceWalked"),
    dishType: getLocalizedString("dishType"),
    cuisine: getLocalizedString("cuisine"),
    timeSpent: getLocalizedString("timeSpent"),
    whatITried: getLocalizedString("whatITried"),
    whatILearned: getLocalizedString("whatILearned"),
    sharedWith: getLocalizedString("sharedWith"),
    personalNote: getLocalizedString("personalNote"),
    ingredients,
    steps,
    cookingTime: getLocalizedString("cookingTime"),
    notesForNextTime,
    gear,
    highlights,
    readingTime: toReadingTime(markdown, language),
  };
}

async function readPostFile(
  section: ContentSection,
  slug: string,
): Promise<string> {
  const directory = getDirectory(section);
  const candidates = [
    path.join(directory, `${slug}.mdx`),
    path.join(directory, `${slug}.md`),
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

export async function getAllPosts(
  section: ContentSection,
  language: Language,
): Promise<PostMeta[]> {
  const directory = getDirectory(section);
  const files = await fs.readdir(directory);
  const postFiles = files.filter(
    (file) => file.endsWith(".mdx") || file.endsWith(".md"),
  );

  const posts = await Promise.all(
    postFiles.map(async (file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const source = await readPostFile(section, slug);
      const { data, content } = matter(source);
      return normalizeMeta(
        slug,
        data as Record<string, unknown>,
        content,
        language,
      );
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(
  section: ContentSection,
  slug: string,
  language: Language,
): Promise<Post | null> {
  try {
    const source = await readPostFile(section, slug);
    const { data, content } = matter(source);
    const localizedMarkdown =
      language === "fi" &&
      typeof (data as Record<string, unknown>).contentFi === "string"
        ? ((data as Record<string, unknown>).contentFi as string)
        : content;
    const processed = await remark()
      .use(remarkGfm)
      .use(remarkHtml)
      .process(localizedMarkdown);

    return {
      ...normalizeMeta(
        slug,
        data as Record<string, unknown>,
        localizedMarkdown,
        language,
      ),
      contentHtml: optimizeContentHtml(processed.toString()),
    };
  } catch {
    return null;
  }
}

export function getAllCaseStudies(language: Language): Promise<PostMeta[]> {
  return getAllPosts("case-studies", language);
}

export function getCaseStudyBySlug(
  slug: string,
  language: Language,
): Promise<Post | null> {
  return getPostBySlug("case-studies", slug, language);
}

export function getAllBeyondWorkPosts(language: Language): Promise<PostMeta[]> {
  return getAllPosts("beyond-work", language);
}

export function getBeyondWorkPostBySlug(
  slug: string,
  language: Language,
): Promise<Post | null> {
  return getPostBySlug("beyond-work", slug, language);
}
