# CI/CD Report

## Root Cause
Cloudflare deployment was misconfigured to run Worker-version upload behavior (`wrangler versions upload`) instead of Cloudflare Pages static deployment. At the same time, the app was not guaranteed to emit a static Pages bundle (`out/index.html`) because it still relied on runtime-only features.

## What Was Fixed
1. Converted app to static export compatibility for Pages direct upload.
   - `next.config.mjs` now uses `output: "export"`.
   - `next/image` export compatibility enabled with `images.unoptimized: true`.
2. Removed runtime-only request dependencies that block static export.
   - Removed `middleware.ts`.
   - Removed `next/headers` nonce usage in `src/app/layout.tsx`.
   - `src/lib/i18n-server.ts` now returns default language without request cookies.
3. Added Cloudflare Pages header rules via static file.
   - Added `public/_headers` for security and cache headers in Pages.
4. Hardened GitHub Actions deployment path.
   - Keeps `cloudflare/wrangler-action@v3` with explicit Pages command only:
     - `pages deploy out --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME }} --branch=<branch>`
   - Added deploy-dir validation in CI and deploy jobs:
     - fail if `out/` is missing
     - fail if `out/index.html` is missing
   - No `wrangler versions upload` usage in workflow.

## Required GitHub Secrets and Variables
- `secrets.CLOUDFLARE_API_TOKEN`
- `secrets.CLOUDFLARE_ACCOUNT_ID`
- `vars.CLOUDFLARE_PROJECT_NAME`

## Correct Cloudflare Settings
### If using Cloudflare Pages Dashboard Git Integration
- Build command: `npm run build`
- Output directory: `out`
- Deploy command: leave empty
- Do **not** use: `npx wrangler versions upload`

### If using GitHub Actions Direct Upload (this repo)
- Keep deploy in `.github/workflows/cloudflare-pages-ci-cd.yml`.
- In Cloudflare Pages project settings, disable Git auto-deploy/build to avoid duplicate deployments.
- Deploy command executed by action:
  - Preview: `pages deploy out --project-name=<PROJECT_NAME> --branch=<PR_BRANCH>`
  - Production: `pages deploy out --project-name=<PROJECT_NAME> --branch=main`

## Workflow Summary
- Triggers:
  - `pull_request` to `main` (preview)
  - `push` to `main` (production)
  - `workflow_dispatch`
- Node 20, `npm ci`, npm cache.
- Required gates: lint, format, typecheck, build.
- Optional gates run only when script exists.
- Artifacts include `out`, coverage/test/audit outputs.

## Known Limitations
- Server-side language detection via request cookie was removed for static export compatibility.
- Language selection still persists on client, but static HTML is emitted from default language at build time.
