import type { JSX } from "react";
import type {
  CameraServiceBehaviors,
  CameraServiceCallbacks,
  CameraServiceProps,
  CameraServiceStates,
} from "./use-camera-model";

export interface CameraViewerProps {
  serviceParameters?: CameraServiceProps;
  serviceCallbacks?: CameraServiceCallbacks;
  uiParameters?: CameraViewerUIParameters;
  renderUI?: (ctx: CameraServiceStates & CameraServiceBehaviors) => JSX.Element;
}

export interface CameraViewerUIParameters {
  showDefaultControls?: boolean;
  showPreview?: boolean;
  wrapperClass?: string;
  videoClass?: string;
}
