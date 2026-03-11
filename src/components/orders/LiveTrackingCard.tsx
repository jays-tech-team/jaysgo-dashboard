import { useEffect, useMemo, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "../../../public/images/rider-icon.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type TrackingPoint = {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp?: string | number;
};

// Fix default marker icons in Vite/React builds.
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon as L.Icon<L.IconOptions>;

function coerceNumber(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  return Number.isFinite(n) ? n : null;
}

function normalizePoint(payload: unknown): TrackingPoint | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const lat = coerceNumber(obj.lat ?? obj.latitude);
  const lng = coerceNumber(obj.lng ?? obj.lon ?? obj.longitude);
  if (lat === null || lng === null) return null;
  return {
    lat,
    lng,
    heading: coerceNumber(obj.heading ?? obj.bearing ?? obj.course) ?? undefined,
    speed: coerceNumber(obj.speed) ?? undefined,
    accuracy: coerceNumber(obj.accuracy) ?? undefined,
    timestamp: (obj.timestamp ?? obj.time ?? obj.updated_at) as
      | string
      | number
      | undefined,
  };
}

export default function LiveTrackingCard({
  orderUuid,
}: {
  orderUuid: string | null | undefined;
}) {
  const [lastPoint, setLastPoint] = useState<TrackingPoint | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState<Array<[number, number]>>([]);

  const statusText = useMemo(() => {
    if (!orderUuid) return "No order selected";
    if (!isRunning) return "Starting…";
    if (!lastPoint) return "No live location available";
    return "Live updates (simulated)";
  }, [orderUuid, isRunning, lastPoint]);

  useEffect(() => {
    if (!orderUuid) return;
    setIsRunning(true);

    // Simulate GPS updates around a fixed point.
    const base = { lat: 51.523767, lng: -0.1585557 };
    const timer = window.setInterval(() => {
      const jitter = () => (Math.random() - 0.5) * 0.0015;
      const point = normalizePoint({
        lat: base.lat + jitter(),
        lng: base.lng + jitter(),
        speed: Math.max(0, Math.round(Math.random() * 12)),
        heading: Math.round(Math.random() * 360),
        timestamp: new Date().toISOString(),
      });
      if (point) {
        setLastPoint(point);
        setPath((prev) => {
          const next: Array<[number, number]> = [...prev, [point.lat, point.lng]];
          return next.length > 50 ? next.slice(next.length - 50) : next;
        });
      }
    }, 2000);

    return () => {
      window.clearInterval(timer);
      setIsRunning(false);
    };
  }, [orderUuid]);

  function Recenter({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);
    return null;
  }

  return (
    <ComponentCard
      title="Live Tracking"
      desc="Driver GPS tracking (if the driver app/provider sends it)."
    >
      <div className="space-y-3 text-sm">
        <p className="text-gray-600 dark:text-gray-300">{statusText}</p>

        <div className="h-[320px] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <MapContainer
            center={[lastPoint?.lat ?? 51.523767, lastPoint?.lng ?? -0.1585557]}
            zoom={18}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
             
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lastPoint && (
              <>
                <Marker position={[lastPoint.lat, lastPoint.lng]} />
                <Recenter lat={lastPoint.lat} lng={lastPoint.lng} />
              </>
            )}
            {path.length >= 2 && (
              <Polyline positions={path} pathOptions={{ color: "#2563eb", weight: 4 }} />
            )}
          </MapContainer>
        </div>

        {lastPoint && (
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Latitude
                </div>
                <div className="font-medium">{lastPoint.lat}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Longitude
                </div>
                <div className="font-medium">{lastPoint.lng}</div>
              </div>
              {typeof lastPoint.speed !== "undefined" && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Speed
                  </div>
                  <div className="font-medium">{lastPoint.speed}</div>
                </div>
              )}
              {typeof lastPoint.heading !== "undefined" && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Heading
                  </div>
                  <div className="font-medium">{lastPoint.heading}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}

