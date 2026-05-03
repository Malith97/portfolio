# Project Discovery

## Stack Summary
- Framework/runtime: Next.js 14 (App Router) with React 18 and TypeScript.
- Styling: Tailwind CSS + custom global CSS.
- Content model: Markdown/MDX files in `content/` parsed with `gray-matter` + `remark`.
- Mapping: Leaflet + React-Leaflet for route/map visualization.
- Animation: Framer Motion.
- Package manager: npm (`package-lock.json` present).

## Commands Discovered
From `package.json`:
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Content validation: `npm run validate:content`
- Aggregate check: `npm run check`

Added during audit:
- Formatting: `npm run format`, `npm run format:check`
- Unit/integration tests: `npm test`, `npm run test:unit`, `npm run test:coverage`
- E2E: `npm run test:e2e`, `npm run test:e2e:headed`
- Audit scripts:
  - `npm run audit:bundle`
  - `npm run audit:images`
  - `npm run audit:cwv`
  - `npm run audit:links`
  - `npm run audit:secrets`
  - `npm run audit:deps:usage`
  - `npm run audit:deps:vuln`
  - `npm run audit:baseline`

## Project Structure
- `src/app`: App Router pages and metadata routes (`robots.ts`, `sitemap.ts`, `not-found.tsx`).
- `src/components`: UI components including map, photo grid, navigation, footer.
- `src/lib`: content parsing, i18n, metadata, profile/domain helpers.
- `src/locales`: centralized EN/FI dictionaries.
- `content/`: case studies and beyond-work posts (MDX/Markdown).
- `public/`: static media, logos, route geojson, resume.
- `scripts/`: content validation plus added audit scripts.

## CI/CD & Deployment Detection
- No CI workflow was present initially.
- No explicit deployment target config (no `vercel.json`, `netlify.toml`, `Dockerfile`, etc.).
- Inferred target pattern: static/dynamic Next.js deployment on a Node-compatible platform.

## Public Assets and External Dependencies
- Local media and content images under `public/`.
- External network dependencies used at runtime:
  - OpenStreetMap tile server (`tile.openstreetmap.org`)
  - jsDelivr devicon CDN (`cdn.jsdelivr.net`)
  - Unsplash image host (`images.unsplash.com`)

## Environment and Sensitive Config
- Environment variable usage:
  - `NEXT_PUBLIC_SITE_URL` (metadata base URL).
- Added `.env.example` to document required public env value.
- `.gitignore` updated to cover common secret/log/artifact files.

## Key Risks Identified
1. Dependency advisories in current Next.js/tooling chain (high severity in audit).
2. Large static image footprint (especially user-generated gallery images).
3. CSP/security headers existed but required hardening/validation.
4. No built-in test suite or CI quality gates before this audit.
5. `dangerouslySetInnerHTML` usage in content rendering requires explicit trust boundaries.

## Suggested Priorities
1. Establish CI gates (lint, typecheck, tests, build, audits).
2. Add and enforce test harness (unit + E2E smoke coverage).
3. Harden HTTP security headers and document CSP trade-offs.
4. Reduce largest image payloads and formalize media optimization workflow.
5. Track unresolved dependency vulnerabilities and schedule framework upgrade path.
