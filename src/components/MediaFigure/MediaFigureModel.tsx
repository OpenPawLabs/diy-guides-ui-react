"use client";

import { useEffect, useRef } from "react";

export interface MediaFigureModelProps {
  src: string;
}

export function MediaFigureModel({ src }: MediaFigureModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let viewer: { Destroy: () => void; Resize: () => void } | null = null;

    import("online-3d-viewer").then((OV) => {
      if (disposed) {
        return;
      }

      const embeddedViewer = new OV.EmbeddedViewer(container, {
        projectionMode: OV.ProjectionMode.Orthographic,
        backgroundColor: new OV.RGBAColor(0, 0, 0, 0),
        onModelLoaded: () => {
          const o3dv = embeddedViewer.GetViewer();
          o3dv.SetNavigationMode(OV.NavigationMode.FreeOrbit);
          o3dv.SetUpVector(OV.Direction.Z, false);
          const boundingSphere = o3dv.GetBoundingSphere(() => true);
          o3dv.FitSphereToWindow(boundingSphere, false);
        },
      });

      viewer = embeddedViewer;
      embeddedViewer.LoadModelFromUrlList([src]);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          embeddedViewer.Resize();
        });
        resizeObserver.observe(container);
      }
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      viewer?.Destroy();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 [&_canvas]:size-full!"
      aria-label="Interactive 3D model"
      role="img"
    />
  );
}
