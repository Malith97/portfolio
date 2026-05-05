import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);
const largeThreshold = 300 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(entryPath);
      return [entryPath];
    }),
  );
  return files.flat();
}

async function main() {
  const allFiles = await walk(publicDir);
  const imageFiles = allFiles.filter((file) =>
    imageExtensions.has(path.extname(file).toLowerCase()),
  );

  const stats = await Promise.all(
    imageFiles.map(async (file) => {
      const { size } = await fs.stat(file);
      return {
        file: path.relative(root, file),
        size,
        ext: path.extname(file).toLowerCase(),
      };
    }),
  );

  const totalSize = stats.reduce((sum, item) => sum + item.size, 0);
  const largeImages = stats
    .filter((item) => item.size >= largeThreshold)
    .sort((a, b) => b.size - a.size);

  const byExt = new Map();
  for (const item of stats) {
    byExt.set(item.ext, (byExt.get(item.ext) ?? 0) + 1);
  }

  console.log("Image Audit Summary");
  console.log(`- Image files: ${stats.length}`);
  console.log(`- Total image size: ${formatBytes(totalSize)}`);
  console.log(
    `- Files >= ${formatBytes(largeThreshold)}: ${largeImages.length}`,
  );
  console.log("- Count by extension:");
  for (const [ext, count] of [...byExt.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    console.log(`  - ${ext}: ${count}`);
  }

  if (largeImages.length > 0) {
    console.log("\nLargest image assets:");
    for (const item of largeImages.slice(0, 20)) {
      console.log(`- ${item.file}: ${formatBytes(item.size)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
