"use client";

import { useReportWebVitals } from "next/web-vitals";

const WEB_VITALS_ENDPOINT = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT;

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[web-vitals]", metric.name, metric.value, metric.rating);
    }

    if (!WEB_VITALS_ENDPOINT) {
      return;
    }

    const payload = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(WEB_VITALS_ENDPOINT, payload);
      return;
    }

    fetch(WEB_VITALS_ENDPOINT, {
      method: "POST",
      body: payload,
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // ignore network failures from non-critical telemetry
    });
  });

  return null;
}
