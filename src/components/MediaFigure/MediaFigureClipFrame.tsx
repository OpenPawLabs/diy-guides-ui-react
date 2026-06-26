"use client";

import { useEffect, useState, type ReactNode, type SyntheticEvent } from "react";
import { cn } from "@heroui/react";
import {
  getDisplayRegionStyles,
  type MediaDisplayRegion,
} from "../../utils/mediaCrop";
import { useElementSize } from "../../hooks/useElementSize";
import { MediaFigureModel } from "./MediaFigureModel";

const DISPLAY_REGION_SETTLE_MS = 400;

export interface MediaFigureClipFrameProps {
  className?: string;
  src: string;
  type?: "image" | "video" | "model";
  displayRegion?: MediaDisplayRegion;
  modelFileName?: string;
  layoutSettleKey?: boolean | number | string;
  remeasureWhenVisible?: boolean;
  children?: ReactNode;
}

/**
 * A clipping frame with optional {@link MediaDisplayRegion} crop. Measurement is
 * taken on this element's border box so crop math matches the visible area — including
 * inside modals and container-query layouts.
 */
export function MediaFigureClipFrame({
  className,
  src,
  type = "image",
  displayRegion,
  modelFileName,
  layoutSettleKey,
  remeasureWhenVisible = false,
  children,
}: MediaFigureClipFrameProps) {
  const needsStableLayout = Boolean(displayRegion);
  const { ref: clipRef, size: frameSize, measureAfterLayout } = useElementSize<
    HTMLDivElement
  >({
    settleMs: needsStableLayout ? DISPLAY_REGION_SETTLE_MS : 0,
    observeParent: needsStableLayout,
    remeasureWhenVisible: needsStableLayout && remeasureWhenVisible,
    layoutSettleKey,
  });
  const [sourceSize, setSourceSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const cropStyles =
    displayRegion &&
    sourceSize &&
    frameSize &&
    getDisplayRegionStyles(
      displayRegion,
      sourceSize.width,
      sourceSize.height,
      frameSize.width,
      frameSize.height,
    );

  const useCrop = Boolean(cropStyles);
  const pendingCrop = Boolean(displayRegion && sourceSize && !cropStyles);
  const coverClass = "size-full object-cover object-center";

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setSourceSize({ width: img.naturalWidth, height: img.naturalHeight });
      measureAfterLayout();
    }
  };

  const handleVideoMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      setSourceSize({ width: video.videoWidth, height: video.videoHeight });
      measureAfterLayout();
    }
  };

  useEffect(() => {
    setSourceSize(null);
  }, [src]);

  if (type === "model") {
    return (
      <div ref={clipRef} className={cn("@container relative overflow-hidden", className)}>
        <MediaFigureModel src={src} modelFileName={modelFileName} />
        {children}
      </div>
    );
  }

  return (
    <div ref={clipRef} className={cn("@container relative overflow-hidden", className)}>
      {type === "video" ? (
        <video
          src={src}
          controls
          className={useCrop ? "absolute max-w-none" : coverClass}
          style={{
            ...(useCrop && cropStyles ? cropStyles : undefined),
            opacity: pendingCrop ? 0 : 1,
          }}
          onLoadedMetadata={displayRegion ? handleVideoMetadata : undefined}
        />
      ) : (
        <img
          src={src}
          alt=""
          className={useCrop ? "absolute max-w-none" : coverClass}
          style={{
            ...(useCrop && cropStyles ? cropStyles : undefined),
            opacity: pendingCrop ? 0 : 1,
          }}
          onLoad={displayRegion ? handleImageLoad : undefined}
        />
      )}
      {children}
    </div>
  );
}

export interface MediaFigureMediaProps {
  src: string;
  type: "image" | "video" | "model";
  displayRegion?: MediaDisplayRegion;
  modelFileName?: string;
  layoutSettleKey?: boolean | number | string;
  remeasureWhenVisible?: boolean;
}

/** Fills an existing relative clip frame (used inside {@link MediaFigure}). */
export function MediaFigureMedia({
  className = "absolute inset-0",
  ...props
}: MediaFigureMediaProps & { className?: string }) {
  return <MediaFigureClipFrame className={className} {...props} />;
}
