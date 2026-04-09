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
    const path = parsedPath ?? [];
    const coords = path.length > 0 ? path[path.length - 1] : null;

    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += getDistance(path[i - 1], path[i]);
    }

    set({ path, coords, distance });
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
