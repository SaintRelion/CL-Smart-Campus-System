export type Coords = { lat: number; lng: number };

export interface GeoServiceProps {
  highAccuracy?: boolean;
  autoStopAfterMs?: number;
  minDistance?: number;
  mode?: "single" | "tracking";
  externalCoords?: Coords;
  externalPath?: Coords[];
}

export interface GeoServiceStates {
  coords: Coords | null;
  path: Coords[];
  distance: number;
  isRunning: boolean;
}

export interface GeoServiceBehaviors {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export interface GeoServiceCallbacks {
  onStart?: () => void;
  onStop?: () => void;
  onCoords?: (coords: Coords) => void;
  onError?: (message: string) => void;
  onPath?: (path: Coords[]) => void;
}
