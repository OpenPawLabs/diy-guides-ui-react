"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  getDisplayRegionStyles,
  type MediaDisplayRegion,
} from "../../utils/mediaCrop";
import { MediaFigureModel } from "./MediaFigureModel";

export interface MediaFigureMediaProps {
  src: string;
  type: "image" | "video" | "model";
  displayRegion?: MediaDisplayRegion;
}

export function MediaFigureMedia({
  src,
  type,
  displayRegion,
}: MediaFigureMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [sourceSize, setSourceSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [frameSize, setFrameSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const updateFrameSize = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const { width, height } = frame.getBoundingClientRect();
    if (width > 0 && height > 0) {
      setFrameSize({ width, height });
    }
  }, []);

  useEffect(() => {
    if (!displayRegion) {
      return;
    }

    updateFrameSize();

    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const observer = new ResizeObserver(updateFrameSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [displayRegion, updateFrameSize]);

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
  const coverClass = "size-full object-cover object-center";

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setSourceSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  const handleVideoMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      setSourceSize({ width: video.videoWidth, height: video.videoHeight });
    }
  };

  if (type === "model") {
    return <MediaFigureModel src={src} />;
  }

  return (
    <div ref={frameRef} className="absolute inset-0">
      {type === "video" ? (
        <video
          src={src}
          controls
          className={useCrop ? "absolute max-w-none" : coverClass}
          style={useCrop && cropStyles ? cropStyles : undefined}
          onLoadedMetadata={displayRegion ? handleVideoMetadata : undefined}
        />
      ) : (
        <img
          src={src}
          className={useCrop ? "absolute max-w-none" : coverClass}
          style={useCrop && cropStyles ? cropStyles : undefined}
          onLoad={displayRegion ? handleImageLoad : undefined}
        />
      )}
    </div>
  );
}
