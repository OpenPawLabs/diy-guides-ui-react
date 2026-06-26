import type { ReactNode } from "react";
import { cn } from "@heroui/react";
import { COLORS, markerTextColor } from "../../types/colors";
import type { MediaAnnotation, MediaFigureProps } from "./MediaFigure";
import type { MediaDisplayRegion } from "../../utils/mediaCrop";
import { MediaFigureAnnotationLayer } from "./MediaFigureAnnotations";
import { MediaFigureClipFrame } from "./MediaFigureClipFrame";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-2/3">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/** Solid-color stand-ins for sources that have no still image to show. */
const TYPE_PLACEHOLDER: Record<
  Exclude<NonNullable<MediaFigureProps["type"]>, "image">,
  { hex: string; content: ReactNode }
> = {
  model: { hex: COLORS.BLUE, content: <span className="text-lg font-bold">3D</span> },
  video: { hex: COLORS.MAGENTA, content: <PlayIcon /> },
};

export interface MediaFigureThumbnailProps {
  /** Source URL of the underlying media. */
  src: string;
  /** Media kind. Non-image types render a colored placeholder. @default "image" */
  type?: MediaFigureProps["type"];
  /** Markers overlaid on the media, positioned by percentage of the visible frame. */
  annotations?: MediaAnnotation[];
  /**
   * When set, show this 4:3 source-pixel rect in the thumbnail, matching the main
   * {@link MediaFigure} crop.
   */
  displayRegion?: MediaDisplayRegion;
  className?: string;
}

/**
 * A 4:3 thumbnail for a {@link MediaFigure} source. Images render with the same
 * crop and annotation overlays as the main figure; videos and 3D models — which have
 * no still image — render a colored placeholder (a play icon or "3D") so they never
 * appear as a broken image in a gallery.
 */
export function MediaFigureThumbnail({
  src,
  type = "image",
  annotations = [],
  displayRegion,
  className,
}: MediaFigureThumbnailProps) {
  if (type === "image") {
    return (
      <MediaFigureClipFrame
        className={cn("aspect-[4/3]", className)}
        src={src}
        type="image"
        displayRegion={displayRegion}
      >
        <MediaFigureAnnotationLayer annotations={annotations} />
      </MediaFigureClipFrame>
    );
  }

  const { hex, content } = TYPE_PLACEHOLDER[type];
  return (
    <div
      aria-hidden="true"
      className={cn("flex aspect-[4/3] items-center justify-center", className)}
      style={{ backgroundColor: hex, color: markerTextColor(hex) }}
    >
      {content}
    </div>
  );
}
