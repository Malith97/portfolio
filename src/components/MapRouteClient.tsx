"use client";

import { useEffect, useMemo, useState } from "react";
import type { LatLngTuple } from "leaflet";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";

export type MapRouteMode = "bike" | "run";

export interface MapRouteProps {
  title: string;
  mode: MapRouteMode;
  points?: [number, number][];
  start?: [number, number];
  end?: [number, number];
  routeFile?: string;
  distanceLabel?: string;
}

function normalizeLatLng(coordinate?: [number, number]): LatLngTuple | undefined {
  if (!coordinate) {
    return undefined;
  }

  const [lat, lon] = coordinate;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return undefined;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return undefined;
  }

  return [lat, lon];
}

function toLatLngTupleFromGeoPoint(value: unknown): LatLngTuple | undefined {
  if (!Array.isArray(value) || value.length < 2) {
    return undefined;
  }

  const lon = Number(value[0]);
  const lat = Number(value[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return undefined;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return undefined;
  }

  return [lat, lon];
}

function extractRoutePoints(geoJson: unknown): LatLngTuple[] {
  const points: LatLngTuple[] = [];

  const pushLineString = (lineCoordinates: unknown) => {
    if (!Array.isArray(lineCoordinates)) {
      return;
    }

    for (const coordinate of lineCoordinates) {
      const point = toLatLngTupleFromGeoPoint(coordinate);
      if (point) {
        points.push(point);
      }
    }
  };

  const walkGeometry = (node: unknown): void => {
    if (!node || typeof node !== "object") {
      return;
    }

    const candidate = node as Record<string, unknown>;
    const type = typeof candidate.type === "string" ? candidate.type : "";

    if (type === "FeatureCollection" && Array.isArray(candidate.features)) {
      for (const feature of candidate.features) {
        walkGeometry(feature);
      }
      return;
    }

    if (type === "Feature") {
      walkGeometry(candidate.geometry);
      return;
    }

    if (type === "LineString") {
      pushLineString(candidate.coordinates);
      return;
    }

    if (type === "MultiLineString" && Array.isArray(candidate.coordinates)) {
      for (const line of candidate.coordinates) {
        pushLineString(line);
      }
    }
  };

  walkGeometry(geoJson);

  return points;
}

function extractRoutePointsFromGpx(gpxXml: string): LatLngTuple[] {
  if (typeof DOMParser === "undefined") {
    return [];
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxXml, "application/xml");
  const parseError = xml.querySelector("parsererror");
  if (parseError) {
    return [];
  }

  const nodes = Array.from(xml.querySelectorAll("trkpt, rtept"));
  const points: LatLngTuple[] = [];

  for (const node of nodes) {
    const lat = Number(node.getAttribute("lat"));
    const lon = Number(node.getAttribute("lon"));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      continue;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      continue;
    }

    points.push([lat, lon]);
  }

  return points;
}

function haversineDistanceKm(from: LatLngTuple, to: LatLngTuple): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDelta = toRad(to[0] - from[0]);
  const lonDelta = toRad(to[1] - from[1]);
  const fromLat = toRad(from[0]);
  const toLat = toRad(to[0]);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculatePolylineDistanceKm(points: LatLngTuple[]): number | undefined {
  if (points.length < 2) {
    return undefined;
  }

  let distance = 0;
  for (let index = 1; index < points.length; index += 1) {
    distance += haversineDistanceKm(points[index - 1], points[index]);
  }

  return distance > 0 ? distance : undefined;
}

function formatDistance(distanceKm?: number): string | null {
  if (!distanceKm || !Number.isFinite(distanceKm)) {
    return null;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(2)} km`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function getModeLabel(mode: MapRouteMode): string {
  return mode === "bike" ? "Cycling" : "Running";
}

function AutoFitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 13, { animate: false });
      return;
    }

    map.fitBounds(points, {
      padding: [24, 24],
      animate: false
    });
  }, [map, points]);

  return null;
}

export function MapRouteClient({ title, mode, points, start, end, routeFile, distanceLabel }: MapRouteProps) {
  const [routePoints, setRoutePoints] = useState<LatLngTuple[] | null>(null);
  const [routeFileError, setRouteFileError] = useState<string | null>(null);

  const normalizedPoints = useMemo(
    () => (points ?? []).map((point) => normalizeLatLng(point)).filter((point): point is LatLngTuple => Boolean(point)),
    [points]
  );
  const normalizedStart = useMemo(() => normalizeLatLng(start), [start]);
  const normalizedEnd = useMemo(() => normalizeLatLng(end), [end]);

  useEffect(() => {
    let isActive = true;
    const routePath = routeFile;

    if (normalizedPoints.length >= 2) {
      setRoutePoints(normalizedPoints);
      setRouteFileError(null);
      return () => {
        isActive = false;
      };
    }

    if (!routePath) {
      setRoutePoints(null);
      setRouteFileError(null);
      return () => {
        isActive = false;
      };
    }
    const safeRoutePath = routePath;

    async function loadRoute() {
      try {
        const response = await fetch(safeRoutePath, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error(`Route file returned ${response.status}`);
        }

        let loadedPoints: LatLngTuple[] = [];
        const routePathLower = safeRoutePath.toLowerCase();
        const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

        if (routePathLower.endsWith(".gpx") || contentType.includes("xml") || contentType.includes("gpx")) {
          const xmlText = await response.text();
          loadedPoints = extractRoutePointsFromGpx(xmlText);
        } else {
          const geoJson = await response.json();
          loadedPoints = extractRoutePoints(geoJson);
        }

        if (loadedPoints.length < 2) {
          throw new Error("Route file does not include enough coordinates.");
        }

        if (isActive) {
          setRoutePoints(loadedPoints);
          setRouteFileError(null);
        }
      } catch {
        if (isActive) {
          setRoutePoints(null);
          setRouteFileError("Route file could not be loaded.");
        }
      }
    }

    loadRoute();

    return () => {
      isActive = false;
    };
  }, [normalizedPoints, routeFile]);

  const fallbackLine = useMemo(() => {
    if (!normalizedStart || !normalizedEnd) {
      return [];
    }

    return [normalizedStart, normalizedEnd] satisfies LatLngTuple[];
  }, [normalizedEnd, normalizedStart]);

  const linePoints = useMemo(() => {
    if (routePoints && routePoints.length >= 2) {
      return routePoints;
    }

    if (normalizedPoints.length >= 2) {
      return normalizedPoints;
    }

    return fallbackLine;
  }, [fallbackLine, normalizedPoints, routePoints]);

  const startPoint = routePoints?.[0] ?? normalizedPoints[0] ?? normalizedStart;
  const endPoint =
    routePoints?.[routePoints.length - 1] ??
    (normalizedPoints.length > 0 ? normalizedPoints[normalizedPoints.length - 1] : undefined) ??
    normalizedEnd;

  const pointsToFit = useMemo(() => {
    const merged = [...linePoints];

    if (startPoint) {
      merged.push(startPoint);
    }

    if (endPoint) {
      merged.push(endPoint);
    }

    const unique = new Map<string, LatLngTuple>();
    for (const point of merged) {
      unique.set(`${point[0].toFixed(6)}:${point[1].toFixed(6)}`, point);
    }

    return Array.from(unique.values());
  }, [endPoint, linePoints, startPoint]);

  const calculatedDistance = useMemo(() => {
    if (linePoints.length >= 2) {
      return calculatePolylineDistanceKm(linePoints);
    }

    if (normalizedStart && normalizedEnd) {
      return haversineDistanceKm(normalizedStart, normalizedEnd);
    }

    return undefined;
  }, [linePoints, normalizedEnd, normalizedStart]);

  const resolvedDistanceLabel =
    typeof distanceLabel === "string" && distanceLabel.trim().length > 0
      ? distanceLabel
      : formatDistance(calculatedDistance);
  const modeLabel = getModeLabel(mode);
  const canRenderMap = pointsToFit.length > 0;

  return (
    <section className="surface-card space-y-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-xl leading-tight text-text">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-[#111111] px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-accent">
            {modeLabel}
          </span>
          {resolvedDistanceLabel ? (
            <span className="rounded-full border border-border bg-[#111111] px-2 py-0.5 font-mono text-[10px] tracking-label text-muted">
              {resolvedDistanceLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="h-[300px] sm:h-[340px] md:h-[420px]">
          {canRenderMap ? (
            <MapContainer
              className="h-full w-full"
              center={pointsToFit[0]}
              zoom={13}
              scrollWheelZoom={false}
              zoomControl
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <AutoFitBounds points={pointsToFit} />
              {linePoints.length >= 2 ? (
                <Polyline
                  positions={linePoints}
                  pathOptions={{
                    color: "#f2c75b",
                    weight: 4,
                    opacity: 0.92
                  }}
                />
              ) : null}
              {startPoint ? (
                <CircleMarker
                  center={startPoint}
                  radius={6}
                  pathOptions={{
                    color: "#0b0b0b",
                    weight: 2,
                    fillColor: "#22c55e",
                    fillOpacity: 0.95
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                    Start
                  </Tooltip>
                </CircleMarker>
              ) : null}
              {endPoint ? (
                <CircleMarker
                  center={endPoint}
                  radius={6}
                  pathOptions={{
                    color: "#0b0b0b",
                    weight: 2,
                    fillColor: "#ef4444",
                    fillOpacity: 0.95
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                    End
                  </Tooltip>
                </CircleMarker>
              ) : null}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
              {routeFileError ?? "Map data is unavailable for this entry."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
