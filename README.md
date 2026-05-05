# Portfolio Website for Malith Ileperuma
Production-focused, bilingual DevOps portfolio built with Next.js, static export, and content-driven publishing.

## 1) Overview
This repository contains the source code for [malithileperuma.com](https://malithileperuma.com), a personal portfolio platform for Malith Ileperuma.

It is designed for:
- Recruiters and hiring teams evaluating DevOps/platform engineering capability
- Engineering leaders reviewing delivery outcomes through case studies
- Visitors interested in professional background and work outside engineering

Core problems this project solves:
- Presents technical experience and outcomes in a structured, searchable format
- Publishes case studies and journal-style content from local MDX sources
- Supports bilingual content presentation (English/Finnish) without route duplication
- Enforces baseline SEO and quality checks as part of CI and pre-deploy workflows

Primary value delivered:
- Personal branding with professional narrative depth
- Content-first case study publishing
- EN/FI language support
- Static SEO readiness (metadata, robots, sitemap, canonical URLs)
- Performance-aware static output and asset auditing

## 2) Live Site
- Production: [https://malithileperuma.com](https://malithileperuma.com)
- Sitemap: [https://malithileperuma.com/sitemap.xml](https://malithileperuma.com/sitemap.xml)
- Robots: [https://malithileperuma.com/robots.txt](https://malithileperuma.com/robots.txt)

## 3) Key Features
- EN/FI language support with persisted client preference
- Story page with chapter navigation and timeline sections
- Work & Education timeline
- Case studies listing + detail routes
- Beyond Work content with category filtering and detail pages
- Dynamic metadata per route and per content detail page
- Content-driven sitemap generation from local MDX files
- Static robots generation with sitemap reference
- Responsive UI with keyboard-focus styles and skip-to-content support
- Test and CI readiness (unit/integration, e2e, static SEO and content checks)

## 4) Tech Stack
| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Static export mode (`output: "export"`) |
| Runtime UI | React 18 | Client + server components |
| Language | TypeScript | Strict typed app/lib/test code |
| Styling | Tailwind CSS + global CSS | Custom theme/tokens in `globals.css` |
| Motion | Framer Motion | Header and UI motion primitives |
| Content Parsing | gray-matter + remark + remark-gfm + remark-html | MDX frontmatter + Markdown to HTML |
| Maps | Leaflet + React-Leaflet | Route visualization for running/cycling entries |
| Testing (unit/integration) | Vitest + Testing Library + jsdom | Coverage via V8 provider |
| Testing (E2E) | Playwright | Chromium project, local webServer boot |
| Linting | ESLint (`next lint`) | CI enforced |
| Formatting | Prettier | Scripted format/format:check |
| Build/Validation Scripts | Node + tsx scripts | content validation, SEO static verification, audits |
| Deployment | Cloudflare Pages (via GitHub Actions) | `out/` artifact deployed with Wrangler |

## 5) Architecture
### High-level
- Application routes are in `src/app` (Next.js App Router).
- Reusable UI is in `src/components`.
- Content/data and domain helpers are in `src/lib`.
- Case studies and beyond-work entries are MDX in `content/`.
- Static assets are in `public/` and emitted into static output at build time.

### Route model
- Static pages: `/`, `/story`, `/work-education`, `/case-studies`, `/beyond-work`, `/about`, `/contact`
- Dynamic content pages:
  - `/case-studies/[slug]`
  - `/beyond-work/[slug]`
- Compatibility route:
  - `/experience` redirects to `/work-education`

### i18n model
- Language keys: `eng` and `fi`
- Dictionaries in `src/locales/en.ts` and `src/locales/fi.ts`
- Client language preference persisted in localStorage + cookie (`portfolio-lang`)
- Dynamic detail pages fetch both EN/FI content variants and resolve at render time

### Content model
- Source folders:
  - `content/case-studies/*.mdx`
  - `content/beyond-work/*.mdx`
- Frontmatter supports localized fields (`titleFi`, `summaryFi`, `contentFi`, localized arrays)
- `src/lib/content.ts` normalizes metadata and compiles localized Markdown to HTML

### SEO and discovery flow
- Route metadata generated through `createMetadata()` (`src/lib/metadata.ts`)
- `src/app/sitemap.ts` scans content folders and appends dynamic slug URLs
- `src/app/robots.ts` emits allow-all policy + sitemap URL
- `scripts/verify-static-seo.mjs` validates built static artifacts and sitemap consistency

### Testing strategy
- Unit/integration tests cover content, metadata, i18n, helpers, and selected components
- E2E tests cover smoke navigation, language toggle behavior, route consistency, and detail-page i18n

### Static generation model
- `output: "export"` in `next.config.mjs`
- Dynamic route slugs generated via `generateStaticParams()` from content
- Build output emitted to `out/` for deployment

### Architecture diagram (text)
```text
content/*.mdx + public assets
        │
        ├─> src/lib/content.ts (frontmatter + markdown normalization)
        │
        ├─> src/app/* routes (static + [slug] pages)
        │        └─> src/components/* (UI, map, listings, detail renderers)
        │
        ├─> src/lib/metadata.ts + app/robots.ts + app/sitemap.ts
        │
        └─> next build (static export) -> out/
                 └─> Cloudflare Pages deploy (GitHub Actions)
```

## 6) Project Structure
| Path | Purpose |
|---|---|
| `src/app` | App Router pages, dynamic routes, metadata endpoints (`robots`, `sitemap`, `manifest`) |
| `src/components` | UI composition, content views, header/footer, map and image primitives |
| `src/lib` | Content parsing, metadata builder, i18n helpers, profile/domain data, tests |
| `src/locales` | EN/FI dictionaries and dictionary type contracts |
| `content` | Source MDX content for case studies and beyond-work posts |
| `public/content` | Story and beyond-work media assets |
| `public/case-studies` | Case-study media assets |
| `public/routes` | Route GeoJSON assets for map rendering |
| `scripts` | Validation/audit scripts (`validate-content`, SEO static verification, bundle/image/security audits) |
| `e2e` | Playwright end-to-end test suite |
| `.github/workflows` | CI quality gate and Cloudflare Pages CI/CD workflows |

## 7) Content Strategy
### Content-driven publishing
- Case studies and beyond-work entries are authored as MDX with structured frontmatter.
- Detail routes are generated from content slugs (`generateStaticParams`).
- Listings are auto-populated from content files; no manual route registry is required.

### Story content and assets
- Story page narrative is dictionary-driven (`src/locales/*`) with chapter IDs.
- Story image mapping is component-level (`src/components/story-page-content.tsx`) and resolves to assets under `public/content/story`.

### Translation handling
- Two-level localization model:
  - Dictionary-based UI translation (navigation, labels, page copy)
  - Content-level translation from frontmatter/body (`titleFi`, `summaryFi`, `contentFi`, etc.)
- Case-study editorial components also use `src/lib/post-translations.ts` for localized title/summary overlays.

### Sitemap relationship
- `src/app/sitemap.ts` reads files from `content/case-studies` and `content/beyond-work`.
- Every content slug included in build output is expected in sitemap and validated by `verify:seo-static`.

## 8) SEO Strategy
Implemented:
- Route-level metadata with canonical URLs
- Open Graph and Twitter card metadata via shared metadata builder
- XML sitemap generated from static routes + content slugs
- Robots file with explicit sitemap pointer
- JSON-LD structured data (Person + WebSite) injected in root layout
- Manifest endpoint for PWA metadata

Notes:
- Canonical and metadata base URL are driven by `NEXT_PUBLIC_SITE_URL` (fallback: production domain).
- Static SEO verification script checks sitemap/robots consistency against generated output.
- This setup is ready for Google Search Console submission using `/sitemap.xml`.

## 9) Quality Engineering
Quality controls present in the repository:
- Formatting: Prettier (`format`, `format:check`)
- Linting: ESLint (`lint`)
- Type safety: TypeScript (`typecheck`)
- Unit/integration tests: Vitest (`test`, `test:unit`, `test:coverage`)
- E2E tests: Playwright (`test:e2e`, `test:e2e:headed`)
- Content integrity checks: `validate:content`
- Static SEO checks: `verify:seo-static`
- Build validation: `build`
- Additional audits: bundle, images, CWV readiness, links, dependency usage, secrets

CI workflows (`.github/workflows/ci.yml` and `cloudflare-pages-ci-cd.yml`) enforce these gates before deployment.

## 10) Getting Started
### Prerequisites
- Node.js 20+
- npm (lockfile is included)

### Install
```bash
npm install
```

### Development server
```bash
npm run dev
```

### Production build
```bash
npm run build
```

### Test
```bash
npm test
```

### Lint / format / type-check
```bash
npm run format
npm run lint
npm run typecheck
```

## 11) Available Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Run local Next.js dev server |
| `npm run build` | Build production static export |
| `npm run start` | Start Next.js server mode script (present in package) |
| `npm run lint` | Run ESLint via Next.js |
| `npm run typecheck` | Run TypeScript no-emit validation |
| `npm run format` | Apply Prettier formatting to configured files |
| `npm run format:check` | Verify formatting without writing |
| `npm test` | Run Vitest suite |
| `npm run test:unit` | Run Vitest with coverage |
| `npm run test:coverage` | Run Vitest with coverage |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:headed` | Run Playwright E2E in headed mode |
| `npm run audit:bundle` | Report emitted JS/CSS bundle sizes |
| `npm run audit:images` | Report image inventory and large files |
| `npm run audit:cwv` | Snapshot image/CWV-related code usage |
| `npm run audit:links` | Audit `target="_blank"` rel protections |
| `npm run audit:secrets` | Scan repository for high-confidence secret patterns |
| `npm run audit:deps:usage` | Detect potentially unused runtime dependencies |
| `npm run audit:deps:vuln` | Run npm vulnerability audit (high threshold) |
| `npm run verify:seo-static` | Verify static SEO artifacts in `out/` |
| `npm run audit:baseline` | Run combined baseline checks/audits |
| `npm run validate:content` | Validate MDX structure/content references |
| `npm run check` | Run lint + typecheck + content validate + build |

## 12) Environment & Configuration
Required runtime/public env variables found:
- `NEXT_PUBLIC_SITE_URL` (documented in `.env.example`)

If this variable is not provided, the project defaults to:
- `https://malithileperuma.com`

No additional required runtime environment variables were found in application code.

## 13) Deployment
### Build output model
- The project is configured for static export (`output: "export"`).
- Build artifacts are emitted to `out/`.

### CI/CD target
- GitHub Actions workflow deploys `out/` to Cloudflare Pages using `cloudflare/wrangler-action@v3`.
- Preview deploys run for PRs to `main`.
- Production deploys run on push to `main`.

### Deployment prerequisites (from workflow)
- `CLOUDFLARE_API_TOKEN` (secret)
- `CLOUDFLARE_ACCOUNT_ID` (secret)
- `CLOUDFLARE_PROJECT_NAME` (repo variable)

### Static hosting assets
- `public/_headers` defines security and cache policies
- `public/_redirects` contains route redirect rules

## 14) Roadmap
### Completed
- Multi-page portfolio architecture on Next.js App Router
- Bilingual EN/FI UI layer and localized content rendering
- Content-driven case studies and beyond-work publishing
- Dynamic metadata, sitemap, robots, and JSON-LD structured data
- Unit/integration and E2E testing setup
- CI quality gates and Cloudflare Pages deployment workflow
- Content and static SEO verification scripts

### Planned / Future improvement
- Expand E2E coverage depth beyond current smoke/navigation language checks
- Add analytics and search-console performance observability dashboards
- Expand structured data coverage for content entities (case-study/article-level schema)
- Add dedicated long-form blog/articles section if content scope grows
- Add automated redirect governance for future slug changes
- Continue image payload optimization and media budget enforcement

## 15) Maintenance Checklist
### Before release
```bash
npm run validate:content
npm run format
npm run lint
npm run typecheck
npm test -- --coverage || npm run test -- --coverage || true
npm run build
npm run verify:seo-static
```

### After release
- Check [sitemap.xml](https://malithileperuma.com/sitemap.xml)
- Check [robots.txt](https://malithileperuma.com/robots.txt)
- Submit/refresh sitemap in Google Search Console
- Inspect critical routes (`/`, `/story`, `/case-studies`, `/beyond-work`) for metadata and crawlability

## 16) Known Considerations
- Static-export language baseline: `getServerLanguage()` currently returns default language (`eng`), while FI preference is applied client-side after hydration.
- Translation maintenance overhead: localized content exists across frontmatter/dictionaries and selected post-translation mappings, which must stay synchronized.
- Fallback image path: `SafeImage` default fallback (`/media/photo-1.webp`) is referenced in code but not currently present in `public/media`.
- Legacy static assets: some media assets may remain in `public/` after content pruning and can be cleaned up in future maintenance.

## 17) License / Ownership
No license file was found in this repository.

Unless explicitly stated otherwise by the owner, this project should be treated as **All Rights Reserved**.
