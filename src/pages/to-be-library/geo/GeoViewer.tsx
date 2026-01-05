import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

import { useGeoStore } from "./useGeoStore";
import type { GeoViewerProps } from "./models/geo-viewer-model";
import type { Coords } from "./models/geo-state-model";

function Recenter({ coords }: { coords: Coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], map.getZoom());
  }, [coords, map]);
  return null;
}

export function GeoViewer({ uiParameters, renderUI }: GeoViewerProps) {
  const coords = useGeoStore((s) => s.coords);
  const path = useGeoStore((s) => s.path);
  const distance = useGeoStore((s) => s.distance);
  const isRunning = useGeoStore((s) => s.isRunning);
  const start = useGeoStore((s) => s.start);
  const stop = useGeoStore((s) => s.stop);
  const reset = useGeoStore((s) => s.reset);

  const {
    showDefaultData = true,
    showDefaultControls = true,
    showMap = true,
    showMarker = true,
    mapHeight = "16rem",
    wrapperClass = "",
  } = uiParameters ?? {};

  const markerIcon = L.icon({
    iconUrl: "/my-marker.png",
    iconSize: [40, 35],
    iconAnchor: [20, 32],
  });

  return (
    <div
      className={`relative flex flex-col items-center gap-4 rounded bg-white p-4 shadow ${wrapperClass}`}
    >
      {/* Map Section */}
      {showMap && (
        <MapContainer
          center={coords || { lat: 0, lng: 0 }}
          zoom={16}
          scrollWheelZoom
          style={{ height: mapHeight, width: "100%" }}
          className="rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showMarker && coords && (
            <Marker position={coords} icon={markerIcon} />
          )}
          {path.length > 1 && <Polyline positions={path} color="blue" />}
          {coords && <Recenter coords={coords} />}
        </MapContainer>
      )}

      {renderUI ? (
        renderUI({ coords, path, distance, isRunning, start, stop, reset })
      ) : (
        <>
          {showDefaultData && (
            <div className="w-full text-sm text-gray-600">
              {coords ? (
                <>
                  <p>
                    Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                  </p>
                  {path.length > 0 && (
                    <p>Distance: {(distance / 1000).toFixed(3)} km</p>
                  )}
                </>
              ) : (
                <p>No coordinates yet</p>
              )}
            </div>
          )}
          {showDefaultControls && (
            <div className="flex gap-2">
              <button
                onClick={start}
                disabled={isRunning}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Start
              </button>
              <button
                onClick={stop}
                disabled={!isRunning}
                className="rounded bg-red-600 px-3 py-1 text-white"
              >
                Stop
              </button>
              <button
                onClick={reset}
                className="rounded bg-gray-600 px-3 py-1 text-white"
              >
                Reset
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
