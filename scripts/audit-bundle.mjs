import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const chunksDir = path.join(root, ".next", "static", "chunks");

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
  try {
    await fs.access(chunksDir);
  } catch {
    console.error("Bundle audit requires a build first. Run: npm run build");
    process.exit(1);
  }

  const files = (await walk(chunksDir)).filter(
    (file) => file.endsWith(".js") || file.endsWith(".css"),
  );

  const stats = await Promise.all(
    files.map(async (file) => {
      const { size } = await fs.stat(file);
      return {
        file: path.relative(root, file),
        size,
        kind: file.endsWith(".css") ? "css" : "js",
      };
    }),
  );

  const totalJs = stats
    .filter((s) => s.kind === "js")
    .reduce((sum, s) => sum + s.size, 0);
  const totalCss = stats
    .filter((s) => s.kind === "css")
    .reduce((sum, s) => sum + s.size, 0);
  const largest = [...stats].sort((a, b) => b.size - a.size).slice(0, 15);

  console.log("Bundle Audit Summary");
  console.log(`- JS files: ${stats.filter((s) => s.kind === "js").length}`);
  console.log(`- CSS files: ${stats.filter((s) => s.kind === "css").length}`);
  console.log(`- Total JS: ${formatBytes(totalJs)}`);
  console.log(`- Total CSS: ${formatBytes(totalCss)}`);
  console.log("\nLargest emitted assets:");
  for (const item of largest) {
    console.log(`- ${item.file}: ${formatBytes(item.size)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
