"use client";

import dynamic from "next/dynamic";

import type { MapRouteProps } from "@/components/MapRouteClient";

const DynamicMapRoute = dynamic(
  () =>
    import("@/components/MapRouteClient").then(
      (module) => module.MapRouteClient,
    ),
  {
    ssr: false,
  },
);

export function MapRoute(props: MapRouteProps) {
  return <DynamicMapRoute {...props} />;
}

export default MapRoute;
export type { MapRouteProps };
