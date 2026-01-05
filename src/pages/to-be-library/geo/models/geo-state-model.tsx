export type Coords = { lat: number; lng: number };

export interface GeoServiceProps {
  highAccuracy?: boolean;
  autoStopAfterMs?: number;
  minDistance?: number;
  mode?: "single" | "tracking";
  externalCoords?: Coords;
  externalPath?: Coords[];
}

export interface GeoState {
  // States
  coords: Coords | null;
  path: Coords[];
  distance: number;
  isRunning: boolean;

  // Parameters
  params: GeoServiceProps;

  // Behaviors
  initTracking: () => void;
  start: () => void;
  stop: () => void;
  reset: () => void;

  setParsedPath: (parsedPath?: Coords[]) => void;

  // Internal: watchId reference
  watchId: number | null;
}
