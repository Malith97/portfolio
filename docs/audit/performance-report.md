# Performance Report

## Scope
This report includes only measured values from audit scripts and build output currently available in the repository/session.

## Completed Changes (Performance-Relevant)
1. Image optimization was previously applied to key hero/avatar assets.
2. Asset caching headers are configured in `next.config.mjs` for static content paths.
3. `compress: true` and optimized Next image formats are enabled.
4. Performance audit scripts are present and runnable (`audit:bundle`, `audit:images`, `audit:cwv`).

## Measured Results (Verified)
### Production build (`npm run build`)
- Status: pass
- Build output summary:
  - First Load JS shared by all: **102 kB**
  - Homepage route first-load JS: **149 kB**

### Bundle audit (`npm run audit:bundle`)
- Status: pass
- JS files: 27
- Total JS: 1.03 MB
- Largest chunk: `.next/static/chunks/4bd1b696-c023c6e3521b1417.js` (169.0 KB)

### Image audit (`npm run audit:images`)
- Status: pass
- Image files: 143
- Total image size: 34.08 MB
- Files >= 300 KB: 33
- Largest image: `public/content/beyond-work/running/2025-02-15_running_vartto/img1.webp` (1.81 MB)

### CWV readiness snapshot (`npm run audit:cwv`)
- Status: pass
- Image usage (Image + SafeImage): 19
- Images with explicit `sizes`: 17
- `priority` declarations: 17
- `dangerouslySetInnerHTML` occurrences: 3

## Comparison Notes
- The baseline report documents an earlier first-load JS figure (87.3 kB) from before later framework/security changes.
- Current verified build output shows first-load shared JS at 102 kB.

## Known Limitations
1. This report does not include a fresh Lighthouse run in this pass.
2. Route-level runtime timings are not included (no RUM/trace instrumentation here).
3. Many gallery images remain large and dominate payload size.

## Recommendations
1. Add CI guardrails for maximum image size and total route media budget.
2. Revisit `priority` image usage and keep it limited to true LCP candidates.
3. Add Lighthouse CI or equivalent to track trends across changes.
