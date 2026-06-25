"use client";

import { useEffect, useRef } from "react";

export interface MediaFigureModelProps {
  src: string;
  /**
   * File name with extension for blob or extension-less URLs. Required when
   * `src` is a blob URL because online-3d-viewer infers format from the name.
   */
  modelFileName?: string;
}

function modelExtensionInUrl(src: string): string | null {
  const path = src.split(/[?#]/)[0] ?? src;
  const slash = path.lastIndexOf("/");
  const dot = path.lastIndexOf(".");
  if (dot <= slash) {
    return null;
  }
  return path.slice(dot + 1).toLowerCase() || null;
}

export function MediaFigureModel({ src, modelFileName }: MediaFigureModelProps) {
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
        backgroundColor: new OV.RGBAColor(219, 234, 254, 255),
        defaultColor: new OV.RGBColor(30, 64, 175),
        onModelLoaded: () => {
          const o3dv = embeddedViewer.GetViewer();
          o3dv.SetNavigationMode(OV.NavigationMode.FreeOrbit);
          o3dv.SetUpVector(OV.Direction.Z, false);
          const boundingSphere = o3dv.GetBoundingSphere(() => true);
          o3dv.FitSphereToWindow(boundingSphere, false);
        },
      });

      viewer = embeddedViewer;

      const useInputFiles =
        src.startsWith("blob:") ||
        (modelExtensionInUrl(src) === null && Boolean(modelFileName));

      if (useInputFiles && modelFileName) {
        embeddedViewer.LoadModelFromInputFiles([
          new OV.InputFile(modelFileName, OV.FileSource.Url, src),
        ]);
      } else {
        embeddedViewer.LoadModelFromUrlList([src]);
      }

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
  }, [src, modelFileName]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 [&_canvas]:size-full!"
      aria-label="Interactive 3D model"
      role="img"
    />
  );
}
