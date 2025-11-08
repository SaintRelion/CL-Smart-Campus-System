import type { JSX } from "react";
import type {
  GeoServiceCallbacks,
  GeoServiceProps,
  GeoServiceStates,
  GeoServiceBehaviors,
} from "./use-geo-model";

export interface GeoViewerProps {
  serviceParameters: GeoServiceProps;
  serviceCallbacks?: GeoServiceCallbacks;
  uiParameters?: GeoViewerUIParameters;
  renderUI?: (ctx: GeoServiceStates & GeoServiceBehaviors) => JSX.Element;
}

export interface GeoViewerUIParameters {
  autoStart?: boolean;
  showDefaultData?: boolean;
  showDefaultControls?: boolean;
  showControls?: boolean;
  showMap?: boolean;
  showMarker?: boolean;
  mapHeight?: number | string;
  wrapperClass?: string;
}
