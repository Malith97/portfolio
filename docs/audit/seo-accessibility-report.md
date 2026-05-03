# SEO and Accessibility Report

## Changes made
1. Sitemap generation was corrected to use the canonical base URL `https://malithileperuma.com` with no trailing slash.
2. Sitemap was restricted to only production routes:
- `/`
- `/about`
- `/work-education`
- `/case-studies`
- `/beyond-work`
- `/contact`
3. `/story` was removed from sitemap and the route file was removed from `src/app` so it is no longer a real route.
4. Route priorities were applied:
- `/` = 1.0
- `/about` = 0.9
- `/case-studies` = 0.8
- `/work-education` = 0.8
- `/contact` = 0.6
- `/beyond-work` = 0.5
5. `lastModified` was added in sitemap output.
6. `robots.ts` was verified/fixed to:
- allow all crawlers
- reference `https://malithileperuma.com/sitemap.xml`
- include `host: https://malithileperuma.com`
7. Added static-export SEO verification script:
- `scripts/verify-static-seo.mjs`
- validates `out/index.html`, `/about` output, `out/sitemap.xml`, route membership, no `/story`, no unexpected routes, and `out/robots.txt` sitemap reference.
8. Added package command:
- `npm run verify:seo-static`
9. CI now runs `verify:seo-static` after build and before deployment, so bad sitemap output blocks deploy.

## Final sitemap routes
- `https://malithileperuma.com`
- `https://malithileperuma.com/about`
- `https://malithileperuma.com/work-education`
- `https://malithileperuma.com/case-studies`
- `https://malithileperuma.com/beyond-work`
- `https://malithileperuma.com/contact`

## How to verify live sitemap
1. Open `https://malithileperuma.com/sitemap.xml`.
2. Confirm `/about` is present.
3. Confirm `/story` is absent.
4. Confirm only the six routes listed above are present.

## Cloudflare cache purge note
If live sitemap still shows stale entries after deploy, run a Cloudflare cache purge (prefer "Purge Everything" once after this sitemap fix) for the production Pages project so `/sitemap.xml` and `/robots.txt` refresh immediately.

## Google Search Console submission steps
1. Open Google Search Console for `https://malithileperuma.com`.
2. Submit/update sitemap: `https://malithileperuma.com/sitemap.xml`.
3. Use URL Inspection for `/about` and request indexing if needed.
4. Recheck Indexing > Sitemaps and Page Indexing reports after recrawl.
