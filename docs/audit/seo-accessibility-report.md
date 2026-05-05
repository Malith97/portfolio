# SEO and Accessibility Report

## Changes made
1. Sitemap generation was corrected to use the canonical base URL `https://malithileperuma.com` with no trailing slash.
2. `/story` was restored as an intentional portfolio route with dedicated page metadata and H1 (`My Story`).
3. Primary navigation now includes `Story` directly after `Home` while preserving EN/FI behavior and mobile navigation.
4. Sitemap was updated to include only production routes:
- `/`
- `/story`
- `/about`
- `/work-education`
- `/case-studies`
- `/beyond-work`
- `/contact`
5. Route priorities were applied:
- `/` = 1.0
- `/story` = 0.9
- `/about` = 0.9
- `/case-studies` = 0.8
- `/work-education` = 0.8
- `/contact` = 0.6
- `/beyond-work` = 0.5
6. `lastModified` was added in sitemap output.
7. `robots.ts` was verified/fixed to:
- allow all crawlers
- reference `https://malithileperuma.com/sitemap.xml`
- include `host: https://malithileperuma.com`
8. Added static-export SEO verification script:
- `scripts/verify-static-seo.mjs`
- validates `out/index.html`, `/story` output, `out/sitemap.xml`, required route membership, no unexpected/nonexistent routes, and `out/robots.txt` sitemap reference.
9. Added package command:
- `npm run verify:seo-static`
10. CI runs `verify:seo-static` after build and before deployment, so bad sitemap output blocks deploy.

## Final sitemap routes
- `https://malithileperuma.com`
- `https://malithileperuma.com/story`
- `https://malithileperuma.com/about`
- `https://malithileperuma.com/work-education`
- `https://malithileperuma.com/case-studies`
- `https://malithileperuma.com/beyond-work`
- `https://malithileperuma.com/contact`

## How to verify live sitemap
1. Open `https://malithileperuma.com/sitemap.xml`.
2. Confirm `/about` is present.
3. Confirm `/story` is present.
4. Confirm only the seven routes listed above are present.

## Cloudflare cache purge note
If live sitemap still shows stale entries after deploy, run a Cloudflare cache purge (prefer "Purge Everything" once after this sitemap fix) for the production Pages project so `/sitemap.xml` and `/robots.txt` refresh immediately.

## Google Search Console submission steps
1. Open Google Search Console for `https://malithileperuma.com`.
2. Submit/update sitemap: `https://malithileperuma.com/sitemap.xml`.
3. Use URL Inspection for `/story` and request indexing.
4. Use URL Inspection for `/about` and request indexing if needed.
5. Recheck Indexing > Sitemaps and Page Indexing reports after recrawl.
