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
  const files = (await walk(srcDir)).filter(
    (file) => file.endsWith(".tsx") || file.endsWith(".ts"),
  );
  const findings = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const relative = path.relative(root, file);

    const targetBlankRegex = /<a[\s\S]*?target=\"_blank\"[\s\S]*?>/g;
    const matches = [...content.matchAll(targetBlankRegex)];

    for (const match of matches) {
      const node = match[0] ?? "";
      if (!/rel=\"[^\"]*(noopener|noreferrer)[^\"]*\"/.test(node)) {
        findings.push({ file: relative, snippet: node.slice(0, 180) });
      }
    }
  }

  if (findings.length === 0) {
    console.log(
      'External link audit passed: all target="_blank" anchors include rel protections.',
    );
    return;
  }

  console.error(
    `External link audit found ${findings.length} unsafe target=\"_blank\" anchor(s):`,
  );
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.snippet}`);
  }

  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
