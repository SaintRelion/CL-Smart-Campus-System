export interface CameraServiceProps {
  video?: boolean; // if false = photo mode
  facingMode?: "user" | "environment";
  autoStart?: boolean;
}

export interface CameraServiceStates {
  isReady: boolean;
  isCapturing: boolean;
  stream: MediaStream | null;
  capturedBlob: Blob | null;
  previewUrl: string | null;
}

export interface CameraServiceBehaviors {
  start: () => Promise<void>;
  stop: () => void;
  capture: () => Promise<void>;
  reset: () => void;
}

export interface CameraServiceCallbacks {
  onStart?: () => void;
  onStop?: () => void;
  onCapture?: (blob: Blob | null, url: string | null) => void;
  onError?: (error: string) => void;
}
