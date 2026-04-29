import dynamic from "next/dynamic";

import type { MapRouteProps } from "@/components/MapRouteClient";

const DynamicMapRoute = dynamic(
  () => import("@/components/MapRouteClient").then((module) => module.MapRouteClient),
  {
    ssr: false,
    loading: () => (
      <section className="surface-card space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-serif text-xl leading-tight text-text">Route map</p>
          <span className="font-mono text-[11px] uppercase tracking-label text-muted">Loading</span>
        </div>
        <div className="h-[300px] animate-pulse rounded-lg border border-border bg-[#121212] md:h-[420px]" />
      </section>
    )
  }
);

export function MapRoute(props: MapRouteProps) {
  return <DynamicMapRoute {...props} />;
}

export default MapRoute;
export type { MapRouteProps };
