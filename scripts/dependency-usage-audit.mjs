import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pkg = JSON.parse(
  await fs.readFile(path.join(root, "package.json"), "utf8"),
);

const declaredRuntimeDeps = Object.keys(pkg.dependencies ?? {});
const allowlist = new Set(["next", "react", "react-dom"]);

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

function extractImportPackage(specifier) {
  if (!specifier || specifier.startsWith(".") || specifier.startsWith("@/"))
    return null;
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return scope && name ? `${scope}/${name}` : null;
  }
  return specifier.split("/")[0];
}

async function main() {
  const scanRoots = [path.join(root, "src"), path.join(root, "scripts")];
  const codeFiles = (
    await Promise.all(
      scanRoots.map(async (scanRoot) => {
        try {
          await fs.access(scanRoot);
          return walk(scanRoot);
        } catch {
          return [];
        }
      }),
    )
  )
    .flat()
    .filter((file) => /\.(ts|tsx|js|mjs|cjs)$/.test(file));

  const used = new Set();
  const importRegex =
    /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

  for (const file of codeFiles) {
    const content = await fs.readFile(file, "utf8");
    const matches = [...content.matchAll(importRegex)];
    for (const match of matches) {
      const specifier = match[1] ?? match[2];
      const pkgName = extractImportPackage(specifier);
      if (pkgName) used.add(pkgName);
    }
  }

  const potentiallyUnused = declaredRuntimeDeps.filter(
    (dep) => !used.has(dep) && !allowlist.has(dep),
  );

  console.log("Dependency usage audit summary");
  console.log(`- Runtime dependencies declared: ${declaredRuntimeDeps.length}`);
  console.log(
    `- Runtime dependencies referenced in source/scripts: ${[...used].filter((dep) => declaredRuntimeDeps.includes(dep)).length}`,
  );

  if (potentiallyUnused.length === 0) {
    console.log("- Potentially unused runtime dependencies: none");
  } else {
    console.log("- Potentially unused runtime dependencies:");
    for (const dep of potentiallyUnused) {
      console.log(`  - ${dep}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
