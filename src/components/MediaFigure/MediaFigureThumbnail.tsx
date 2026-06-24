import type { ReactNode } from "react";
import { cn } from "@heroui/react";
import { COLORS, markerTextColor } from "../../types/colors";
import type { MediaFigureProps } from "./MediaFigure";

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
  className?: string;
}

/**
 * A square thumbnail for a {@link MediaFigure} source. Images render directly;
 * videos and 3D models — which have no still image — render a colored placeholder
 * (a play icon or "3D") so they never appear as a broken image in a gallery.
 */
export function MediaFigureThumbnail({
  src,
  type = "image",
  className,
}: MediaFigureThumbnailProps) {
  if (type === "image") {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className={cn("object-cover", className)}
      />
    );
  }

  const { hex, content } = TYPE_PLACEHOLDER[type];
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center", className)}
      style={{ backgroundColor: hex, color: markerTextColor(hex) }}
    >
      {content}
    </div>
  );
}
