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
- `.next`

## Cloudflare Deployment Commands
### Preview (PR)
- `wrangler pages deploy out --project-name=$CLOUDFLARE_PROJECT_NAME --branch=<pr-head-branch>`

### Production (Push to main)
- `wrangler pages deploy out --project-name=$CLOUDFLARE_PROJECT_NAME --branch=main`

## Deployment Preconditions
- `out/` must exist.
- `out/index.html` must exist.

If either precondition fails, deployment is intentionally blocked and the workflow prints architecture guidance for OpenNext + Workers.

## Local Reproduction Checklist
1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm run typecheck`
5. `npm run validate:content` (if script exists)
6. `npm run test:unit` (if script exists)
7. `npm run test:coverage` (if script exists)
8. `npm run build` (or `npm run build:pages` if present)
9. `npm run test:e2e` (if script exists)
10. `npm run audit:bundle` (if script exists)
11. `npm run audit:images` (if script exists)
12. `npm run audit:cwv` (if script exists)
13. `npm run audit:links` (if script exists)
14. `npm run audit:deps:usage` (if script exists)
15. `npm run audit:secrets` (if script exists)
16. `npm run audit:deps:vuln` (if script exists)
