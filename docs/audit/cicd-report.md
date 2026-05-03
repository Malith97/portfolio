# CI/CD Report

## Scope
Production-grade GitHub Actions pipeline for Cloudflare Pages direct upload using Wrangler.

## Workflow Added
- File: `.github/workflows/cloudflare-pages-ci-cd.yml`
- Triggers:
  - `pull_request` to `main`
  - `push` to `main`
  - `workflow_dispatch`
- Concurrency:
  - In-progress runs for the same ref are canceled.
- Permissions:
  - `contents: read` (least privilege)

## Required GitHub Secrets and Variables
- `secrets.CLOUDFLARE_API_TOKEN`
- `secrets.CLOUDFLARE_ACCOUNT_ID`
- `vars.CLOUDFLARE_PROJECT_NAME`

## Cloudflare Pages Setup
1. Create a Cloudflare Pages project (Direct Upload model).
2. Store credentials in repository settings:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Add repository variable:
   - `CLOUDFLARE_PROJECT_NAME`
4. Ensure your build generates a deployable static directory (`out/`) with `out/index.html` for direct upload.

## Pipeline Design
### Quality Gates Job
- Uses Node 20, `npm ci`, npm cache via `actions/setup-node`.
- Runs required gates:
  - `npm run lint`
  - `npm run format:check`
  - `npm run typecheck`
  - build (`build:pages` if present, else `build`)
- Runs optional gates only when script exists:
  - `validate:content`
  - one test gate only (prefers `test:coverage`, falls back to `test:unit`)
  - `test:e2e` (with Playwright browser install)
  - all requested audit scripts
- Vulnerability policy:
  - `audit:deps:vuln` fails hard by default.
  - It only becomes non-blocking when docs explicitly include accepted-risk language.
- Deploy-readiness detection:
  - publishes `can_deploy` and `deploy_reason` job outputs for downstream jobs.

### Artifact Uploads
- Always uploads when present:
  - `coverage`
  - `playwright-report`
  - `test-results`
  - `docs/audit`
  - build output (`out`)

### Preview Deploy
- Runs only for pull requests.
- Environment: `preview`.
- Deploy command:
  - `pages deploy out --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME }} --branch=<pr-head-branch>`
- Runs only when `can_deploy == true` (no unnecessary deploy runner minutes when static bundle is missing).
- Adds deployment URL and alias URL to workflow step summary.

### Production Deploy
- Runs only on `push` to `main`.
- Environment: `production`.
- Deploy command:
  - `pages deploy out --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME }} --branch=main`
- Runs only when `can_deploy == true` (no unnecessary deploy runner minutes when static bundle is missing).
- Adds deployment URL and alias URL to workflow step summary.

### Explicit Blocker Job
- `deploy-blocked` runs for PRs/main pushes when `can_deploy != true`.
- Fails fast with a clear architectural message and the detected reason (`missing_out_directory` or `missing_index_html`).
- Prevents hidden/skipped deploy behavior and keeps failure mode explicit.

## Static Export Compatibility Status (Current Repo)
Static direct upload is currently blocked by runtime features in the app:
- `middleware.ts` exists (runtime request handling).
- `src/app/layout.tsx` uses `headers()`.
- `src/lib/i18n-server.ts` uses `cookies()`.

Because of this, the new deploy jobs fail fast with a clear message when `out/` is missing, and recommend the Cloudflare-compatible server runtime path:
- OpenNext + Cloudflare Workers (`@opennextjs/cloudflare`).

## How Preview Deploys Work
1. PR to `main` triggers CI + quality gates.
2. If quality passes, deploy-preview runs.
3. Workflow validates static output and deploys `out/` to a branch preview URL.

## How Production Deploys Work
1. Push to `main` triggers CI + quality gates.
2. If quality passes, deploy-production runs.
3. Workflow validates static output and deploys `out/` to production.

## Known Limitations
- Current app architecture is not static-export compatible.
- Direct upload to Pages requires a real static `out/` directory.
- For SSR/middleware/cookies/headers use cases, migrate deployment target to OpenNext on Workers.

## Rollback Notes
- Cloudflare rollback options:
  - Promote/redeploy a previous successful Pages deployment in Cloudflare dashboard.
  - Re-run workflow from a known-good commit.
  - Revert commit on `main` and push.
- GitHub workflow rollback:
  - Revert `.github/workflows/cloudflare-pages-ci-cd.yml` to prior known-good revision if needed.
