# Security Report

## Scope
This report distinguishes verified outcomes from recommendations and assumptions.

## Completed Fixes (Verified)
1. Static CSP delivery in `next.config.mjs` was replaced with middleware-based CSP (`middleware.ts`).
2. Production CSP now uses request nonce for scripts instead of global `unsafe-inline`.
3. JSON-LD script in `src/app/layout.tsx` now receives a nonce.
4. Existing security headers (HSTS, X-Frame-Options, nosniff, etc.) remain configured in `next.config.mjs`.

## Previous vs Current CSP (Evidence-Based)
### Previous script policy
- `script-src 'self' 'unsafe-inline'`

### Current script policy
- Production: `script-src 'self' 'nonce-<per-request-nonce>'`
- Development: `script-src 'self' 'unsafe-inline' 'unsafe-eval'`

### Directive status
- `default-src`: `'self'`
- `script-src`: nonce-based in production
- `style-src`: `'self' 'unsafe-inline'` (unchanged)
- `img-src`: self + data/blob + required external domains
- `font-src`: self + data
- `connect-src`: self + OSM tile domain
- `frame-ancestors`: `'none'`
- `base-uri`: `'self'`
- `form-action`: `'self'`
- `object-src`: `'none'`
- `upgrade-insecure-requests`: enabled

## Measured Results (Verified)
- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run build`: pass
- `npm run audit:secrets`: pass

## Dependency Vulnerability Verification
### Verified successful security result (prior run with network access)
- `npm run audit:deps:vuln`: `found 0 vulnerabilities`

### Current-session caveat
- Latest local rerun failed due DNS/network resolution (`getaddrinfo ENOTFOUND registry.npmjs.org`), so vulnerability status could not be re-fetched in that attempt.

## Known Limitations / Tradeoffs
1. Development CSP intentionally allows `unsafe-inline` and `unsafe-eval` for Next.js dev tooling compatibility.
2. `style-src 'unsafe-inline'` remains for compatibility and has not been removed in this pass.
3. Trusted third-party domains remain in `img-src`/`connect-src` by application design.

## Recommendations
1. Add a periodic CI job for `npm audit` with network-enabled environment and artifact retention.
2. Move to stricter style policy (nonce/hash) only after validating framework/runtime compatibility.
3. Consider CSP report-only telemetry before further tightening.
