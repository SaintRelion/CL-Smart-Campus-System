import { create } from "zustand";

import { getDistance } from "geolib";
import type { Coords, GeoState } from "./models/geo-state-model";

export const useGeoStore = create<GeoState>((set, get) => ({
  // STATES
  coords: null,
  path: [],
  distance: 0,
  isRunning: false,
  params: {},
  watchId: null,

  // BEHAVIOR
  initTracking: () => {
    set({
      isRunning: false,
      params: {
        mode: "tracking",
        highAccuracy: true,
        minDistance: 3,
      },
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

    set({
      path,
      coords,
      distance,
    });
  },

  start: () => {
    const { isRunning, params } = get();
    if (isRunning) return;

    if (!("geolocation" in navigator)) {
      console.error("Geolocation not supported");
      return;
    }

    set({ isRunning: true });

    if (params.mode === "single") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          set({ coords: p });
        },
        (err) => console.error(err.message),
        { enableHighAccuracy: params.highAccuracy },
      );
      set({ isRunning: false });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const last = get().path.at(-1);
        const min = params.minDistance ?? 1;

        if (!last || getDistance(last, newPoint) > min) {
          console.log(newPoint);
          set((s) => ({
            coords: newPoint,
            path: [...s.path, newPoint],
            distance: last
              ? s.distance + getDistance(last, newPoint)
              : s.distance,
          }));
        }
      },
      (err) => console.error(err.message),
      { enableHighAccuracy: params.highAccuracy, maximumAge: 1000 },
    );

    set({ watchId: id });
    console.log("START");

    if (params.autoStopAfterMs) {
      setTimeout(() => get().stop(), params.autoStopAfterMs);
    }
  },

  // Stop behavior
  stop: () => {
    const { watchId } = get();
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      set({ isRunning: false, watchId: null });
    }
    console.log("STOPPED");
  },

  // Reset behavior
  reset: () => {
    get().stop();
    set({ coords: null, path: [], distance: 0 });
  },
}));
