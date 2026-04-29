import MapRoute from "@/components/MapRoute";
import type { PostMapMeta } from "@/lib/content";

interface BeyondWorkMapProps {
  category?: string;
  map?: PostMapMeta;
  postTitle?: string;
  sectionLabel?: string;
  className?: string;
  view?: "detail" | "card";
}

function normalizeCategory(category?: string): string {
  return category?.trim().toLowerCase() ?? "";
}

function isEligibleMapCategory(category?: string): boolean {
  const normalized = normalizeCategory(category);
  return normalized === "running" || normalized === "cycling";
}

function hasRenderableMap(map?: PostMapMeta): boolean {
  if (!map) {
    return false;
  }

  if (Array.isArray(map.points) && map.points.length >= 2) {
    return true;
  }

  if (typeof map.routeFile === "string" && map.routeFile.trim().length > 0) {
    return true;
  }

  return Boolean(map.start && map.end);
}

function resolveMode(category: string | undefined, map: PostMapMeta): "bike" | "run" {
  if (map.mode === "bike") {
    return "bike";
  }

  if (map.mode === "run") {
    return "run";
  }

  const normalized = normalizeCategory(category);
  return normalized === "cycling" ? "bike" : "run";
}

export function BeyondWorkMap({ category, map, postTitle, sectionLabel, className, view = "detail" }: BeyondWorkMapProps) {
  if (view !== "detail") {
    return null;
  }

  if (!isEligibleMapCategory(category) || !hasRenderableMap(map) || !map) {
    return null;
  }

  const title = map.title ?? (postTitle ? `${postTitle} Route` : "Route");
  const mode = resolveMode(category, map);

  return (
    <section className={className ?? "space-y-4"}>
      {sectionLabel ? <p className="font-mono text-xs uppercase tracking-label text-muted">{sectionLabel}</p> : null}
      <MapRoute
        title={title}
        mode={mode}
        points={map.points}
        start={map.start}
        end={map.end}
        routeFile={map.routeFile}
        distanceLabel={map.distanceLabel}
      />
    </section>
  );
}
