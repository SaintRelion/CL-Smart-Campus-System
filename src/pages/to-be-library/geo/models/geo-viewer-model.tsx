import type { JSX } from "react";
import type { GeoState } from "./geo-state-model";

export interface GeoViewerProps {
  uiParameters?: GeoViewerUIParameters;
  renderUI?: (
    ctx: Pick<
      GeoState,
      "coords" | "path" | "distance" | "isRunning" | "start" | "stop" | "reset"
    >,
  ) => JSX.Element;
}

export interface GeoViewerUIParameters {
  showDefaultData?: boolean;
  showDefaultControls?: boolean;
  showMap?: boolean;
  showMarker?: boolean;
  mapHeight?: number | string;
  wrapperClass?: string;
}
