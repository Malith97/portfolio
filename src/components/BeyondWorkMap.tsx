import MapRoute from "@/components/MapRoute";
import type { PostMapMeta } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

interface BeyondWorkMapProps {
  categoryId?: string;
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

function isEligibleMapCategoryId(categoryId?: string): boolean {
  const normalized = normalizeCategory(categoryId);
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

function resolveMode(categoryId: string | undefined, category: string | undefined, map: PostMapMeta): "bike" | "run" {
  if (map.mode === "bike") {
    return "bike";
  }

  if (map.mode === "run") {
    return "run";
  }

  const normalized = normalizeCategory(categoryId ?? category);
  return normalized === "cycling" ? "bike" : "run";
}

export async function BeyondWorkMap({ categoryId, category, map, postTitle, sectionLabel, className, view = "detail" }: BeyondWorkMapProps) {
  const language = await getServerLanguage();
  const t = getDictionary(language);

  if (view !== "detail") {
    return null;
  }

  if ((!isEligibleMapCategoryId(categoryId) && !isEligibleMapCategory(category)) || !hasRenderableMap(map) || !map) {
    return null;
  }

  const title = map.title ?? (postTitle ? `${postTitle} ${t.beyondWorkDetail.route}` : t.beyondWorkDetail.route);
  const mode = resolveMode(categoryId, category, map);

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
        labels={{
          routeMap: t.common.routeMap,
          loading: t.common.loading,
          mapDataUnavailable: t.common.mapDataUnavailable,
          runningMode: t.common.runningMode,
          cyclingMode: t.common.cyclingMode,
          start: t.common.start,
          end: t.common.end
        }}
      />
    </section>
  );
}
