import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");

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
  const files = (await walk(srcDir)).filter((file) => file.endsWith(".tsx"));

  let imageUsage = 0;
  let imageWithSizes = 0;
  let imageWithPriority = 0;
  let dangerouslySetInnerHTMLCount = 0;

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");

    imageUsage +=
      (content.match(/<Image\b/g) ?? []).length +
      (content.match(/<SafeImage\b/g) ?? []).length;
    imageWithSizes +=
      (content.match(/\bsizes=\{/g) ?? []).length +
      (content.match(/\bsizes=\"/g) ?? []).length;
    imageWithPriority += (content.match(/\bpriority\b/g) ?? []).length;
    dangerouslySetInnerHTMLCount += (
      content.match(/dangerouslySetInnerHTML/g) ?? []
    ).length;
  }

  console.log("Core Web Vitals Readiness Snapshot");
  console.log(`- Image component usage (Image + SafeImage): ${imageUsage}`);
  console.log(`- Images with explicit sizes prop: ${imageWithSizes}`);
  console.log(`- Priority image declarations: ${imageWithPriority}`);
  console.log(
    `- dangerouslySetInnerHTML occurrences: ${dangerouslySetInnerHTMLCount}`,
  );
  console.log(
    "- Notes: verify LCP element priority and avoid overusing priority images.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
