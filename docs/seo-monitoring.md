# SEO Monitoring Setup

## 1. Search Console
1. Add your property in Google Search Console as `https://malithileperuma.com`.
2. Copy the verification token.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in your deployment environment.
4. Redeploy and click **Verify** in Search Console.

Optional:
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` for Bing Webmaster Tools.
- `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` for Yandex Webmaster.

## 2. Core Web Vitals Telemetry
1. Create an endpoint that accepts `POST` JSON payloads for web vitals.
2. Set `NEXT_PUBLIC_WEB_VITALS_ENDPOINT` to that URL.
3. Redeploy and monitor incoming `LCP`, `INP`, `CLS`, `FCP`, and `TTFB`.

The app already reports web vitals through `src/components/web-vitals-reporter.tsx`.

## 3. SEO/Performance Checks
Run after major content or layout updates:

```bash
npm run build
npm run verify:seo-static
npm run audit:cwv
npm run audit:bundle
npm run audit:images
```
