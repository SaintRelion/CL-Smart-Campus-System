import { useState, useCallback, useRef, useEffect } from "react";
import { getDistance } from "geolib";
import type {
  GeoServiceCallbacks,
  GeoServiceProps,
  GeoServiceStates,
  GeoServiceBehaviors,
} from "./models/use-geo-model";
import type { Coords } from "./models/use-geo-model";

export function useGeoService(
  parameters: GeoServiceProps = {},
  callbacks: GeoServiceCallbacks = {},
) {
  const {
    mode = "single",
    highAccuracy = true,
    minDistance = 1,
    autoStopAfterMs,
    externalCoords,
    externalPath,
  } = parameters;

  const { onStart, onStop, onError, onCoords, onPath } = callbacks;

  // STATES
  const [coords, setCoords] = useState<Coords | null>(null);
  const [path, setPath] = useState<Coords[]>([]);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const watchRef = useRef<number | null>(null);

  // Update state if external values change
  useEffect(() => {
    if (externalCoords) setCoords(externalCoords);
  }, [externalCoords]);

  useEffect(() => {
    if (externalPath) {
      setPath(externalPath);
      // Recalculate distance
      let d = 0;
      for (let i = 1; i < externalPath.length; i++) {
        d += getDistance(externalPath[i - 1], externalPath[i]);
      }
      setDistance(d);
    }
  }, [externalPath]);

  // BEHAVIORS
  const stop = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
      setIsRunning(false);
      onStop?.();
    }
  }, [onStop]);

  const reset = useCallback(() => {
    setCoords(null);
    setPath([]);
    setDistance(0);
    stop();
  }, [stop]);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      const err = new Error("Geolocation not supported");
      onError?.(err.message);
      return;
    }

    if (isRunning) return;

    setIsRunning(true);
    onStart?.();

    if (mode === "single") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(p);
          onCoords?.(p);
        },
        (err) => {
          onError?.(err.message);
        },
        { enableHighAccuracy: highAccuracy },
      );
      setIsRunning(false);
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCoords(newPoint);
        onCoords?.(newPoint);

        setPath((prev) => {
          if (prev.length === 0) {
            onPath?.([newPoint]);
            return [newPoint];
          }

          const last = prev[prev.length - 1];
          const d = getDistance(last, newPoint);

          if (d > minDistance) {
            const newPath = [...prev, newPoint];
            setDistance((x) => x + d);
            onPath?.(newPath);
            return newPath;
          }

          return prev;
        });
      },
      (err) => {
        onError?.(err.message);
      },
      { enableHighAccuracy: highAccuracy, maximumAge: 1000 },
    );

    watchRef.current = id;

    if (autoStopAfterMs) {
      setTimeout(stop, autoStopAfterMs);
    }
  }, [
    isRunning,
    mode,
    highAccuracy,
    minDistance,
    autoStopAfterMs,
    onStart,
    onError,
    onCoords,
    onPath,
    stop,
  ]);

  const serviceStates: GeoServiceStates = {
    coords,
    path,
    distance,
    isRunning,
  };

  const serviceBehaviors: GeoServiceBehaviors = {
    start,
    stop,
    reset,
  };

  return { serviceStates, serviceBehaviors };
}
