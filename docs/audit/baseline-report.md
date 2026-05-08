# Baseline Report

## Scope

Baseline checks were executed against the current repository state to establish measurable quality, performance, security, and test baselines.

## Commands Run

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run validate:content`
- `npm run build`
- `npm run audit:bundle`
- `npm run audit:images`
- `npm run audit:cwv`
- `npm run audit:links`
- `npm run audit:deps:usage`
- `npm run audit:secrets`
- `npm run audit:deps:vuln`

## Baseline Results

### Quality

- Lint: pass (`next lint` with no warnings/errors).
- Type-check: pass (`tsc --noEmit`).
- Content validation: pass (7 case-study files, 11 beyond-work files).

### Build

- Production build: pass.
- Route summary indicates app-router pages are building correctly.
- Shared first-load JS: 87.3 kB.

### Bundle

- Emitted JS files: 25
- Total emitted JS: ~1014.1 kB
- Largest chunk: `fd9d1056-6402681317ea8432.js` (~168.8 kB)

### Images

Initial image audit (before optimization pass):

- Image files: 142
- Total image size: 39.57 MB
- Files >= 300 KB: 34

Post-optimization image audit:

- Image files: 143
- Total image size: 34.08 MB
- Files >= 300 KB: 33

### Core Web Vitals Readiness Snapshot

- `Image`/`SafeImage` usage: 19
- Explicit `sizes` usage: 17
- `priority` declarations: 17
- `dangerouslySetInnerHTML` occurrences: 3 (2 content-rendering, 1 JSON-LD script)

### Security

- External link hardening check: pass (`target="_blank"` links include `rel` protections).
- Secret scan: pass (no high-confidence secret patterns detected).
- Dependency audit: fail (known advisories; details in security report).

## Failures and Warnings Encountered During Baseline

1. `npm audit` reports 5 vulnerabilities (4 high, 1 moderate), with fixes requiring breaking upgrades.
2. Some combined commands in sandbox required elevated permissions (sandbox IPC/port restrictions).
3. E2E baseline needed elevated execution due local port bind restrictions in sandbox.

## Baseline Artifacts and Evidence

- Build/route and bundle output captured in terminal logs.
- Audit scripts under `scripts/` provide repeatable machine-readable summaries.
- E2E artifacts (screenshots/videos/traces) generated during failed runs in `test-results/` and then resolved.

## Prioritized Remediation Plan

1. Keep current app stable while planning Next.js + eslint-config-next upgrade window to address high vulnerabilities.
2. Continue reducing largest image assets in `public/content/beyond-work/**`.
3. Expand automated tests around client-heavy components (`site-header`, `photo-grid`, `MapRouteClient`).
4. Maintain CI gating with lint/typecheck/test/build/security checks.
