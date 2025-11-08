import { useEffect, useRef } from "react";
import { useCameraService } from "./use-camera";
import type { CameraViewerProps } from "./models/camera-viewer-model";

export function CameraViewer({
  serviceParameters,
  serviceCallbacks,
  uiParameters,
  renderUI,
}: CameraViewerProps) {
  const { serviceStates, serviceBehaviors } = useCameraService(
    serviceParameters,
    serviceCallbacks,
  );

  const ctx = { ...serviceStates, ...serviceBehaviors };
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    showDefaultControls = true,
    showPreview = true,
    wrapperClass = "",
    videoClass = "rounded-md w-full h-64 bg-black object-cover",
  } = uiParameters ?? {};

  useEffect(() => {
    if (videoRef.current && ctx.stream) {
      videoRef.current.srcObject = ctx.stream;
    }
  }, [ctx.stream]);

  return (
    <div
      className={`relative flex flex-col items-center gap-4 rounded bg-white p-4 shadow ${wrapperClass}`}
    >
      <video ref={videoRef} autoPlay playsInline muted className={videoClass} />

      {renderUI ? (
        renderUI(ctx)
      ) : (
        <>
          {showDefaultControls && (
            <div className="flex gap-2">
              <button
                onClick={ctx.start}
                disabled={ctx.isReady}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Start
              </button>
              <button
                onClick={ctx.capture}
                disabled={!ctx.isReady || ctx.isCapturing}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Capture
              </button>
              <button
                onClick={ctx.stop}
                disabled={!ctx.isReady}
                className="rounded bg-red-600 px-3 py-1 text-white"
              >
                Stop
              </button>
              <button
                onClick={ctx.reset}
                className="rounded bg-gray-600 px-3 py-1 text-white"
              >
                Reset
              </button>
            </div>
          )}

          {showPreview && ctx.previewUrl && (
            <img
              src={ctx.previewUrl}
              alt="Captured"
              className="mt-2 h-40 w-auto rounded border border-gray-300"
            />
          )}
        </>
      )}
    </div>
  );
}
