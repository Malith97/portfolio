# Testing Report

## Scope
This report reflects verified test outputs from the current repository state.

## Completed Test Setup
### Unit/integration tests present
- `src/lib/i18n.test.ts`
- `src/lib/format.test.ts`
- `src/lib/metadata.test.ts`
- `src/lib/content.test.ts`
- `src/components/section-heading.test.tsx`
- `src/components/site-footer.test.tsx`

### E2E tests present
- `e2e/smoke.spec.ts`
  - homepage core hero content
  - navigation to case studies
  - Finnish locale rendering via cookie

### Tooling in use
- Vitest + jsdom + Testing Library
- Playwright (Chromium)
- V8 coverage reports

## Measured Results (Verified)
### `npm test`
- Status: pass
- Test files: 6 passed
- Tests: 14 passed

### `npm run test:unit`
- Status: pass
- Test files: 6 passed
- Tests: 14 passed
- Coverage:
  - Lines: 16.99%
  - Statements: 16.99%
  - Branches: 74.31%
  - Functions: 91.89%

### `npm run test:coverage`
- Not rerun in this verification pass.
- Assumption: expected to match `test:unit` because both run `vitest run --coverage`.

### `npm run test:e2e`
- Status: fail (current verified run)
- Failure mode: all 3 tests timed out at `page.goto("/")` with teardown timeout/trace archive issues.
- Useful context:
  - Next dev warning shown: cross-origin request notice for `/ _next/*` and recommendation to set `allowedDevOrigins`.

## Known Limitations
1. E2E currently unstable in this environment and not a reliable gate at the moment.
2. Coverage remains low for UI-heavy modules despite passing thresholds.
3. No visual regression suite is configured.

## Recommendations
1. Stabilize E2E by adjusting Playwright web server strategy (or using `next start` for smoke tests) and evaluating `allowedDevOrigins` for dev.
2. Add targeted tests for map/lightbox/header interactions and network failure paths.
3. Raise line/statement thresholds incrementally once flaky E2E is resolved.
