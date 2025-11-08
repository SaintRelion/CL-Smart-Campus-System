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

import { useGeoService } from "./use-geo";
import type { GeoViewerProps } from "./models/geo-viewer-model";
import type { Coords } from "./models/use-geo-model";

function Recenter({ coords }: { coords: Coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], map.getZoom());
  }, [coords, map]);
  return null;
}

export function GeoViewer({
  serviceParameters,
  serviceCallbacks,
  uiParameters,
  renderUI,
}: GeoViewerProps) {
  const { serviceStates, serviceBehaviors } = useGeoService(
    serviceParameters,
    serviceCallbacks,
  );

  const ctx = {
    ...serviceStates,
    ...serviceBehaviors,
  };

  const {
    autoStart = false,
    showDefaultData = true,
    showDefaultControls = true,
    showMap = true,
    showMarker = true,
    mapHeight = "16rem",
    wrapperClass = "",
  } = uiParameters ?? {};

  // autoStart when first mounted
  useEffect(() => {
    console.log("Auto");
    if (autoStart) serviceBehaviors.start();
    // return serviceBehaviors.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          center={ctx.coords || { lat: 0, lng: 0 }}
          zoom={16}
          scrollWheelZoom
          style={{ height: mapHeight, width: "100%" }}
          className="rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showMarker && ctx.coords && (
            <Marker position={ctx.coords} icon={markerIcon} />
          )}
          {ctx.path.length > 1 && (
            <Polyline positions={ctx.path} color="blue" />
          )}
          {ctx.coords && <Recenter coords={ctx.coords} />}
        </MapContainer>
      )}

      {renderUI ? (
        renderUI(ctx)
      ) : (
        <>
          {showDefaultData && (
            <div className="w-full text-sm text-gray-600">
              {ctx.coords ? (
                <>
                  <p>
                    Lat: {ctx.coords.lat.toFixed(6)}, Lng:{" "}
                    {ctx.coords.lng.toFixed(6)}
                  </p>
                  {ctx.path.length > 0 && (
                    <p>Distance: {(ctx.distance / 1000).toFixed(3)} km</p>
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
                onClick={ctx.start}
                disabled={ctx.isRunning}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Start
              </button>
              <button
                onClick={ctx.stop}
                disabled={!ctx.isRunning}
                className="rounded bg-red-600 px-3 py-1 text-white"
              >
                Stop
              </button>
              <button
                onClick={ctx.reset}
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
