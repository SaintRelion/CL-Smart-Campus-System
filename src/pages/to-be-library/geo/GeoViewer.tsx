import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, type JSX } from "react";
import { useGeoStore } from "./useGeoStore";

// Move icon outside to prevent re-creation on every render
const markerIcon: L.Icon = L.icon({
  iconUrl: "/my-marker.png",
  iconSize: [40, 35],
  iconAnchor: [20, 32],
});

function Recenter({ lat, lng }: { lat: number; lng: number }): null {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function GeoViewer(): JSX.Element {
  const coords = useGeoStore((s) => s.coords);
  const path = useGeoStore((s) => s.path);
  const distance = useGeoStore((s) => s.distance);

  const initTracking = useGeoStore((s) => s.initTracking);

  useEffect(() => {
    initTracking(); // Auto-starts when component mounts
  }, [initTracking]);

  return (
    <div className="flex flex-col items-center gap-4 rounded bg-white p-4 shadow">
      <div className="h-64 w-full overflow-hidden rounded">
        <MapContainer
          center={coords ? [coords.lat, coords.lng] : [0, 0]}
          zoom={16}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {coords && (
            <>
              <Marker position={[coords.lat, coords.lng]} icon={markerIcon} />
              <Recenter lat={coords.lat} lng={coords.lng} />
            </>
          )}

          {path.length > 1 && (
            <Polyline
              positions={path.map((p) => [p.lat, p.lng])}
              color="blue"
              weight={4}
            />
          )}
        </MapContainer>
      </div>

      <div className="w-full text-sm text-gray-600">
        {coords ? (
          <>
            <p>
              Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
            </p>
            <p>Distance: {(distance / 1000).toFixed(3)} km</p>
          </>
        ) : (
          <p>Waiting for location...</p>
        )}
      </div>
    </div>
  );
}
