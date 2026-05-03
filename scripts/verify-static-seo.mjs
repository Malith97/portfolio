import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const APP_DIR = path.join(ROOT, "src", "app");
const BASE_URL = "https://malithileperuma.com";

const expectedRoutes = [
  "/",
  "/about",
  "/work-education",
  "/case-studies",
  "/beyond-work",
  "/contact",
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function ensureFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    fail(`${description} not found: ${path.relative(ROOT, filePath)}`);
  }
}

function ensureAnyExists(paths, description) {
  const exists = paths.some((candidate) => fs.existsSync(candidate));
  if (!exists) {
    fail(
      `${description} not found. Checked: ${paths
        .map((candidate) => path.relative(ROOT, candidate))
        .join(", ")}`,
    );
  }
}

function listAppRoutesFromPages() {
  const found = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile() || entry.name !== "page.tsx") {
        continue;
      }

      const relDir = path.relative(APP_DIR, path.dirname(fullPath));
      const route = relDir === "" ? "/" : `/${relDir.replace(/\\/g, "/")}`;
      found.push(route);
    }
  }

  walk(APP_DIR);

  return found.filter((route) => !route.includes("[")).sort();
}

function parseSitemapPaths(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].trim(),
  );

  return matches
    .map((url) => {
      if (!url.startsWith(BASE_URL)) {
        return null;
      }

      const pathPart = url.slice(BASE_URL.length) || "/";
      return pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
    })
    .filter((value) => value !== null);
}

function main() {
  ensureFile(path.join(OUT_DIR, "index.html"), "Homepage output");
  ensureAnyExists(
    [path.join(OUT_DIR, "about.html"), path.join(OUT_DIR, "about", "index.html")],
    "About page output",
  );

  const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
  ensureFile(sitemapPath, "Sitemap output");

  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  const sitemapPaths = parseSitemapPaths(sitemapXml);

  if (sitemapPaths.length === 0) {
    fail("Sitemap has no <loc> entries.");
  }

  const uniqueSitemapPaths = [...new Set(sitemapPaths)].sort();
  const expectedSorted = [...expectedRoutes].sort();

  const missingExpected = expectedSorted.filter(
    (route) => !uniqueSitemapPaths.includes(route),
  );
  if (missingExpected.length > 0) {
    fail(`Sitemap is missing expected routes: ${missingExpected.join(", ")}`);
  }

  if (uniqueSitemapPaths.includes("/story")) {
    fail("Sitemap must not include /story.");
  }

  const unexpectedRoutes = uniqueSitemapPaths.filter(
    (route) => !expectedSorted.includes(route),
  );
  if (unexpectedRoutes.length > 0) {
    fail(`Sitemap contains unexpected routes: ${unexpectedRoutes.join(", ")}`);
  }

  const existingStaticRoutes = listAppRoutesFromPages();
  const nonExistentRoutes = uniqueSitemapPaths.filter(
    (route) => !existingStaticRoutes.includes(route),
  );
  if (nonExistentRoutes.length > 0) {
    fail(
      `Sitemap contains routes without matching src/app/**/page.tsx: ${nonExistentRoutes.join(", ")}`,
    );
  }

  const robotsPath = path.join(OUT_DIR, "robots.txt");
  ensureFile(robotsPath, "Robots output");

  const robotsText = fs.readFileSync(robotsPath, "utf8");
  if (!robotsText.includes(`${BASE_URL}/sitemap.xml`)) {
    fail("robots.txt does not reference https://malithileperuma.com/sitemap.xml");
  }

  console.log("✅ Static SEO verification passed.");
  console.log(`   Verified routes: ${expectedRoutes.join(", ")}`);
  console.log(`   Existing static routes detected: ${existingStaticRoutes.join(", ")}`);
}

main();
