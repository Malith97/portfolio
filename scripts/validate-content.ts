import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const PROJECT_ROOT = process.cwd();
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");

const ALLOWED_BEYOND_WORK_CATEGORIES = new Set([
  "running",
  "cycling",
  "photography",
  "cooking",
  "achievements",
  "other",
]);

const PLACEHOLDER_PATTERN =
  /\b(placeholder|demo|sample|template|todo|tbd|lorem)\b/i;

interface ValidationIssue {
  file: string;
  message: string;
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

async function getMdxFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return getMdxFiles(entryPath);
      }

      if (
        entry.isFile() &&
        (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      ) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat().sort((a, b) => a.localeCompare(b));
}

function pushIssue(
  issues: ValidationIssue[],
  file: string,
  message: string,
): void {
  issues.push({
    file: toPosix(path.relative(PROJECT_ROOT, file)),
    message,
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateImageReference(
  contentFile: string,
  imagePath: string,
  issues: ValidationIssue[],
): Promise<void> {
  if (!isNonEmptyString(imagePath)) {
    return;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return;
  }

  const normalized = imagePath.replace(/^\/+/, "");
  const publicPath = path.join(PROJECT_ROOT, "public", normalized);
  const projectPath = path.join(PROJECT_ROOT, normalized);

  const existsInPublic = await fileExists(publicPath);
  const existsInProject = await fileExists(projectPath);

  if (!existsInPublic && !existsInProject) {
    pushIssue(
      issues,
      contentFile,
      `Referenced image does not exist: ${imagePath}`,
    );
  }
}

async function validateCaseStudies(issues: ValidationIssue[]): Promise<number> {
  const caseStudiesDir = path.join(CONTENT_ROOT, "case-studies");
  const files = await getMdxFiles(caseStudiesDir);

  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const { data } = matter(source);

    const title = data.title;
    const slug = data.slug;
    const date = data.date;
    const category = data.category;
    const coverImage = data.coverImage;
    const images = data.images;
    const photos = data.photos;
    const summary = data.summary;

    if (!isNonEmptyString(title))
      pushIssue(issues, file, "Missing required field: title");
    if (!isNonEmptyString(slug))
      pushIssue(issues, file, "Missing required field: slug");
    if (!isNonEmptyString(date))
      pushIssue(issues, file, "Missing required field: date");
    if (!isNonEmptyString(category))
      pushIssue(issues, file, "Missing required field: category");
    if (!isNonEmptyString(coverImage))
      pushIssue(issues, file, "Missing required field: coverImage");

    const placeholderSource = [
      title,
      slug,
      summary,
      category,
      path.basename(file),
    ]
      .filter(isNonEmptyString)
      .join(" ");
    if (PLACEHOLDER_PATTERN.test(placeholderSource)) {
      pushIssue(issues, file, "Contains placeholder/demo-like content");
    }

    if (isNonEmptyString(coverImage)) {
      await validateImageReference(file, coverImage, issues);
    }

    const galleryImages = new Set<string>();
    if (isNonEmptyStringArray(images)) {
      images.forEach((image) => galleryImages.add(image));
    }
    if (isNonEmptyStringArray(photos)) {
      photos.forEach((image) => galleryImages.add(image));
    }

    for (const image of galleryImages) {
      await validateImageReference(file, image, issues);
    }
  }

  return files.length;
}

async function validateBeyondWork(issues: ValidationIssue[]): Promise<number> {
  const beyondWorkDir = path.join(CONTENT_ROOT, "beyond-work");
  const files = await getMdxFiles(beyondWorkDir);

  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const { data } = matter(source);

    const title = data.title;
    const slug = data.slug;
    const date = data.date;
    const category = data.category;
    const coverImage = data.coverImage;
    const images = data.images;
    const photos = data.photos;
    const summary = data.summary;

    if (!isNonEmptyString(title))
      pushIssue(issues, file, "Missing required field: title");
    if (!isNonEmptyString(slug))
      pushIssue(issues, file, "Missing required field: slug");
    if (!isNonEmptyString(date))
      pushIssue(issues, file, "Missing required field: date");
    if (!isNonEmptyString(category))
      pushIssue(issues, file, "Missing required field: category");
    if (!isNonEmptyString(coverImage))
      pushIssue(issues, file, "Missing required field: coverImage");

    const normalizedCategory = isNonEmptyString(category)
      ? category.trim().toLowerCase()
      : "";
    if (
      normalizedCategory &&
      !ALLOWED_BEYOND_WORK_CATEGORIES.has(normalizedCategory)
    ) {
      pushIssue(
        issues,
        file,
        `Invalid category "${category}". Allowed values: ${Array.from(ALLOWED_BEYOND_WORK_CATEGORIES).join(", ")}`,
      );
    }

    const placeholderSource = [
      title,
      slug,
      summary,
      category,
      path.basename(file),
    ]
      .filter(isNonEmptyString)
      .join(" ");
    if (PLACEHOLDER_PATTERN.test(placeholderSource)) {
      pushIssue(issues, file, "Contains placeholder/demo-like content");
    }

    if (isNonEmptyString(coverImage)) {
      await validateImageReference(file, coverImage, issues);
    }

    const galleryImages = new Set<string>();
    if (isNonEmptyStringArray(images)) {
      images.forEach((image) => galleryImages.add(image));
    }
    if (isNonEmptyStringArray(photos)) {
      photos.forEach((image) => galleryImages.add(image));
    }

    for (const image of galleryImages) {
      await validateImageReference(file, image, issues);
    }
  }

  return files.length;
}

async function main(): Promise<void> {
  const issues: ValidationIssue[] = [];
  const [caseStudyCount, beyondWorkCount] = await Promise.all([
    validateCaseStudies(issues),
    validateBeyondWork(issues),
  ]);

  if (issues.length > 0) {
    console.error("Content validation failed:\n");
    for (const issue of issues) {
      console.error(`- ${issue.file}: ${issue.message}`);
    }
    console.error(`\n${issues.length} issue(s) found.`);
    process.exit(1);
  }

  console.log(
    `Content validation passed for ${caseStudyCount} case study file(s) and ${beyondWorkCount} beyond-work file(s).`,
  );
}

main().catch((error) => {
  console.error("Content validation crashed.");
  console.error(error);
  process.exit(1);
});
