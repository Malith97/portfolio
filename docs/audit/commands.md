# CI Command Matrix

## Required Setup
- `npm ci`

## Required Quality Gates
- `npm run lint`
- `npm run format:check`
- `npm run typecheck`
- `npm run build:pages` (if script exists)
- `npm run build` (fallback when `build:pages` does not exist)

## Optional Gates (Only If Script Exists)
- `npm run validate:content`
- `npm run test:unit`
- `npm run test:coverage`
- `npx playwright install --with-deps chromium` (before e2e)
- `npm run test:e2e`
- `npm run audit:bundle`
- `npm run audit:images`
- `npm run audit:cwv`
- `npm run audit:links`
- `npm run audit:deps:usage`
- `npm run audit:secrets`
- `npm run audit:deps:vuln`

## Artifact Paths Uploaded by CI
- `coverage`
- `playwright-report`
- `test-results`
- `docs/audit`
- `out`

## Cloudflare Pages Deploy Commands
### Preview (PR)
- `wrangler pages deploy out --project-name=$CLOUDFLARE_PROJECT_NAME --branch=<pr-head-branch>`

### Production (Push to main)
- `wrangler pages deploy out --project-name=$CLOUDFLARE_PROJECT_NAME --branch=main`

## Prohibited Command For Pages
- Do not use: `npx wrangler versions upload`

## Cloudflare Dashboard Settings (Git Integration)
- Build command: `npm run build`
- Output directory: `out`
- Deploy command: leave empty

## Direct Upload Mode Note
- If deploying from GitHub Actions direct upload, disable Cloudflare Pages Git auto-deploy/build to avoid duplicate deployments.

## Deployment Preconditions (Validated in CI)
- `out/` must exist.
- `out/index.html` must exist.

## Local Reproduction Checklist
1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm run typecheck`
5. `npm run test:unit` (if script exists)
6. `npm run build`
