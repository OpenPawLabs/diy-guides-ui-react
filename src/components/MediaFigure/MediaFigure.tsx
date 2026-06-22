import type { CSSProperties, ReactNode } from "react";
import { cn } from "@heroui/react";
import {
  type GuideSeverity,
  severityMarkerClass,
} from "../../types/severity";

/** A positioned marker overlaid on the media, tied to a step instruction. */
export interface MediaAnnotation {
  /** Stable key; falls back to array index. */
  id?: string;
  /** Horizontal position as a percentage (0–100) of the frame width. */
  x: number;
  /** Vertical position as a percentage (0–100) of the frame height. */
  y: number;
  /** Marker tone — match the related step bullet for visual linking. @default "note" */
  severity?: GuideSeverity;
  /** Short content shown inside the marker (e.g. a number or letter). */
  label?: ReactNode;
  /** Accessible description / tooltip for the marker. */
  title?: string;
}

export interface MediaFigureProps {
  /** Image or video source URL. */
  src: string;
  /** Required alternative text / accessible name for the media. */
  alt: string;
  /** Media kind. @default "image" */
  type?: "image" | "video";
  /** Optional caption rendered beneath the frame. */
  caption?: ReactNode;
  /** Markers overlaid on the media, positioned by percentage. */
  annotations?: MediaAnnotation[];
  /** CSS `aspect-ratio` for the frame, e.g. `"4/3"`. @default "4/3" */
  aspectRatio?: string;
  className?: string;
}

/**
 * Instructional image or video with an optional caption and percentage-positioned
 * annotation markers. Markers use {@link GuideSeverity} colors so they can be
 * visually linked to the matching `GuideStep` bullets.
 */
export function MediaFigure({
  src,
  alt,
  type = "image",
  caption,
  annotations = [],
  aspectRatio = "4/3",
  className,
}: MediaFigureProps) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div
        className="relative overflow-hidden rounded-lg border border-default bg-default-soft"
        style={{ aspectRatio } as CSSProperties}
      >
        {type === "video" ? (
          <video
            src={src}
            aria-label={alt}
            controls
            className="size-full object-cover"
          />
        ) : (
          <img src={src} alt={alt} className="size-full object-cover" />
        )}

        {annotations.map((annotation, index) => (
          <span
            key={annotation.id ?? index}
            role="img"
            aria-label={annotation.title}
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
            className={cn(
              "absolute flex min-h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-xs font-semibold shadow ring-2 ring-background",
              severityMarkerClass[annotation.severity ?? "note"],
            )}
          >
            {annotation.label}
          </span>
        ))}
      </div>

      {caption != null && (
        <figcaption className="text-sm text-default-500">{caption}</figcaption>
      )}
    </figure>
  );
}
