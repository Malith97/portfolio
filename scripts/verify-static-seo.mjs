import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const APP_DIR = path.join(ROOT, "src", "app");
const BASE_URL = "https://malithileperuma.com";

const requiredBaseRoutes = [
  "/",
  "/story",
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

function listExportedDynamicRoutes(routePrefix) {
  const exportedDir = path.join(OUT_DIR, routePrefix);
  if (!fs.existsSync(exportedDir)) {
    return [];
  }

  const entries = fs.readdirSync(exportedDir, { withFileTypes: true });
  const slugs = new Set();

  for (const entry of entries) {
    if (
      entry.isFile() &&
      entry.name.endsWith(".html") &&
      entry.name !== "index.html"
    ) {
      slugs.add(entry.name.replace(/\.html$/, ""));
    }

    if (
      entry.isDirectory() &&
      fs.existsSync(path.join(exportedDir, entry.name, "index.html"))
    ) {
      slugs.add(entry.name);
    }
  }

  return [...slugs].map((slug) => `/${routePrefix}/${slug}`).sort();
}

function outputRouteExists(route) {
  if (route === "/") {
    return fs.existsSync(path.join(OUT_DIR, "index.html"));
  }

  const clean = route.replace(/^\/+/, "");
  return (
    fs.existsSync(path.join(OUT_DIR, `${clean}.html`)) ||
    fs.existsSync(path.join(OUT_DIR, clean, "index.html"))
  );
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
    [
      path.join(OUT_DIR, "about.html"),
      path.join(OUT_DIR, "about", "index.html"),
    ],
    "About page output",
  );
  ensureAnyExists(
    [
      path.join(OUT_DIR, "story.html"),
      path.join(OUT_DIR, "story", "index.html"),
    ],
    "Story page output",
  );
  const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
  ensureFile(sitemapPath, "Sitemap output");

  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  const sitemapPaths = parseSitemapPaths(sitemapXml);

  if (sitemapPaths.length === 0) {
    fail("Sitemap has no <loc> entries.");
  }

  const uniqueSitemapPaths = [...new Set(sitemapPaths)].sort();
  const expectedRoutes = [
    ...requiredBaseRoutes,
    ...listExportedDynamicRoutes("case-studies"),
    ...listExportedDynamicRoutes("beyond-work"),
  ].sort();

  const missingExpected = expectedRoutes.filter(
    (route) => !uniqueSitemapPaths.includes(route),
  );
  if (missingExpected.length > 0) {
    fail(`Sitemap is missing expected routes: ${missingExpected.join(", ")}`);
  }
  const nonExistentRoutes = uniqueSitemapPaths.filter(
    (route) => !outputRouteExists(route),
  );
  if (nonExistentRoutes.length > 0) {
    fail(
      `Sitemap references routes with no static output: ${nonExistentRoutes.join(", ")}`,
    );
  }

  const robotsPath = path.join(OUT_DIR, "robots.txt");
  ensureFile(robotsPath, "Robots output");

  const robotsText = fs.readFileSync(robotsPath, "utf8");
  if (!robotsText.includes(`${BASE_URL}/sitemap.xml`)) {
    fail(
      "robots.txt does not reference https://malithileperuma.com/sitemap.xml",
    );
  }

  console.log("✅ Static SEO verification passed.");
  console.log(`   Verified routes: ${expectedRoutes.join(", ")}`);
}

main();
