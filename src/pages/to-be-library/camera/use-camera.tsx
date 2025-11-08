import { useState, useCallback, useRef, useEffect } from "react";
import type {
  CameraServiceProps,
  CameraServiceCallbacks,
  CameraServiceStates,
  CameraServiceBehaviors,
} from "./models/use-camera-model";

export function useCameraService(
  parameters: CameraServiceProps = {},
  callbacks: CameraServiceCallbacks = {},
) {
  const { video = false, facingMode = "user", autoStart = false } = parameters;
  const { onStart, onStop, onCapture, onError } = callbacks;

  const streamRef = useRef<MediaStream | null>(null);

  // States
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Stop
  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsReady(false);
    setIsCapturing(false);
    streamRef.current = null;
    onStop?.();
  }, [onStop]);

  // Reset
  const reset = useCallback(() => {
    setCapturedBlob(null);
    setPreviewUrl(null);
    onCapture?.(null, null);
  }, [onCapture]);

  // Start
  const start = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: video,
      });
      streamRef.current = media;
      setStream(media);
      setIsReady(true);
      onStart?.();
    } catch (err) {
      onError?.((err as Error).message);
    }
  }, [facingMode, video, onStart, onError]);

  // Capture (photo mode only)
  const capture = useCallback(async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    setIsCapturing(true);
    try {
      const blob = await imageCapture.takePhoto();
      const url = URL.createObjectURL(blob);
      setCapturedBlob(blob);
      setPreviewUrl(url);
      onCapture?.(blob, url);
    } catch (err) {
      onError?.((err as Error).message);
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture, onError]);

  // Auto start
  useEffect(() => {
    if (autoStart) start();
    return () => stop();
  }, [autoStart, start, stop]);

  const serviceStates: CameraServiceStates = {
    isReady,
    isCapturing,
    stream,
    capturedBlob,
    previewUrl,
  };

  const serviceBehaviors: CameraServiceBehaviors = {
    start,
    stop,
    capture,
    reset,
  };

  return { serviceStates, serviceBehaviors };
}
