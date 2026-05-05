import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const includeDirs = ["src", "content", "scripts", ".github", "public"];
const skipDirs = new Set([
  "node_modules",
  ".git",
  ".next",
  "coverage",
  "playwright-report",
  "test-results",
]);

const patterns = [
  {
    name: "Generic API key assignment",
    regex:
      /(?:api|access|secret|auth|token)[_-]?(?:key|token|secret)?\s*[:=]\s*["'][A-Za-z0-9_\-]{20,}["']/gi,
  },
  { name: "AWS access key id", regex: /AKIA[0-9A-Z]{16}/g },
  {
    name: "Private key block",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
  },
  { name: "GitHub token", regex: /ghp_[A-Za-z0-9]{36}/g },
  { name: "Slack token", regex: /xox[baprs]-[A-Za-z0-9-]{10,}/g },
  {
    name: "JWT-like token",
    regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}/g,
  },
];

const allowedPatternHits = [/<okta-domain>/, /example/i, /\.env\.example/];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (skipDirs.has(entry.name)) return [];
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(entryPath);
      return [entryPath];
    }),
  );
  return files.flat();
}

function isTextFile(file) {
  const ext = path.extname(file).toLowerCase();
  const textExtensions = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".mdx",
    ".yml",
    ".yaml",
    ".env",
    ".txt",
    ".css",
    ".html",
  ]);
  return textExtensions.has(ext) || path.basename(file).startsWith(".");
}

async function main() {
  const files = (
    await Promise.all(
      includeDirs.map(async (dir) => {
        const abs = path.join(root, dir);
        try {
          await fs.access(abs);
          return walk(abs);
        } catch {
          return [];
        }
      }),
    )
  ).flat();

  const findings = [];

  for (const file of files) {
    if (!isTextFile(file)) continue;
    const content = await fs.readFile(file, "utf8");
    const relative = path.relative(root, file);

    for (const { name, regex } of patterns) {
      const matches = [...content.matchAll(regex)];
      for (const match of matches) {
        const snippet = (match[0] ?? "").slice(0, 120);
        if (
          allowedPatternHits.some(
            (allowed) => allowed.test(snippet) || allowed.test(relative),
          )
        ) {
          continue;
        }
        findings.push({ file: relative, type: name, snippet });
      }
    }
  }

  if (findings.length === 0) {
    console.log(
      "Secret scan passed: no high-confidence secret patterns found.",
    );
    return;
  }

  console.error(`Secret scan found ${findings.length} potential issue(s):`);
  for (const finding of findings.slice(0, 50)) {
    console.error(`- ${finding.file} [${finding.type}] ${finding.snippet}`);
  }

  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
