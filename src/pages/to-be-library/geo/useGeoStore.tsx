import { create } from "zustand";
import { getDistance } from "geolib";
import type { Coords, GeoState } from "./models/geo-state-model";

export const useGeoStore = create<GeoState>((set, get) => ({
  coords: null,
  path: [],
  distance: 0,
  isRunning: false,
  params: {},
  watchId: null,

  initTracking: () => {
    set({
      isRunning: false,
      params: { mode: "tracking", highAccuracy: true, minDistance: 3 },
    });
    get().start();
  },

  setParsedPath: (parsedPath?: Coords[]) => {
    const newPath: Coords[] = parsedPath ?? [];

    // Calculate total distance for the loaded path
    let totalDistance: number = 0;
    for (let i = 1; i < newPath.length; i++) {
      totalDistance += getDistance(newPath[i - 1], newPath[i]);
    }

    set({
      path: newPath,
      // Set current view to the last point of the loaded path
      coords: newPath.length > 0 ? newPath[newPath.length - 1] : null,
      distance: totalDistance,
      isRunning: false, // Stop tracking if we are viewing a historical log
    });
  },

  start: () => {
    const { isRunning, params, watchId } = get();
    if (isRunning || watchId !== null) return;

    if (!("geolocation" in navigator)) return;

    set({ isRunning: true });

    // Single mode
    if (params.mode === "single") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          set({ coords: p, isRunning: false });
        },
        (err) => {
          console.error(err.message);
          set({ isRunning: false });
        },
        { enableHighAccuracy: params.highAccuracy },
      );
      return;
    }

    // Tracking mode
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { path, distance, params: currentParams } = get();
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const last = path.at(-1);
        const min = currentParams.minDistance ?? 1;

        if (!last || getDistance(last, newPoint) > min) {
          set({
            coords: newPoint,
            path: [...path, newPoint],
            distance: last ? distance + getDistance(last, newPoint) : distance,
          });
        }
      },
      (err) => console.error(err.message),
      { enableHighAccuracy: params.highAccuracy, maximumAge: 1000 },
    );

    set({ watchId: id });
  },

  stop: () => {
    const { watchId } = get();
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    set({ isRunning: false, watchId: null });
  },

  reset: () => {
    get().stop();
    set({ coords: null, path: [], distance: 0 });
  },
}));
