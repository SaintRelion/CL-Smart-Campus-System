// GeoViewer.tsx
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, type JSX } from "react";
import { useGeoStore } from "./useGeoStore";

const markerIcon: L.Icon = L.icon({
  iconUrl: "/my-marker.png",
  iconSize: [40, 35],
  iconAnchor: [20, 32],
});

function Recenter({ lat, lng }: { lat: number; lng: number }): null {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export function GeoViewer(): JSX.Element {
  const coords = useGeoStore((s) => s.coords);
  const path = useGeoStore((s) => s.path);
  // const distance = useGeoStore((s) => s.distance);
  const initTracking = useGeoStore((s) => s.initTracking);

  useEffect(() => {
    initTracking();
  }, [initTracking]);

  console.log(path);

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

          {/* Fixed Polyline: mapping the object array to Leaflet's [lat, lng] array */}
          {/* {path.length > 1 && (
            <Polyline
              positions={path.map((p) => [p.lat, p.lng])}
              color="blue"
              weight={4}
              opacity={0.7}
            />
          )} */}
        </MapContainer>
      </div>

      <div className="w-full text-sm text-gray-600">
        {coords ? (
          <div className="flex justify-between">
            <p>
              Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
            </p>
            {/* <p className="font-bold text-blue-600">
              {(distance / 1000).toFixed(3)} km
            </p> */}
          </div>
        ) : (
          <p>Waiting for location...</p>
        )}
      </div>
    </div>
  );
}
