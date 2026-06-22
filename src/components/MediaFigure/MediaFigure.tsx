import type { CSSProperties, ReactNode } from "react";
import { cn } from "@heroui/react";
import {
  type GuideSeverity,
  severityMarkerClass,
} from "../../types/severity";

/** Shared fields for every annotation shape. */
interface MediaAnnotationBase {
  /** Stable key; falls back to array index. */
  id?: string;
  /** Marker tone — match the related step bullet for visual linking. @default "note" */
  severity?: GuideSeverity;
  /** Accessible description / tooltip for the marker. */
  title?: string;
}

/** A labeled pin at a percentage position — the only type that shows a `label`. */
export interface PointAnnotation extends MediaAnnotationBase {
  /** @default "point" */
  type?: "point";
  /** Horizontal position as a percentage (0–100) of the frame width. */
  x: number;
  /** Vertical position as a percentage (0–100) of the frame height. */
  y: number;
  /** Short content shown inside the marker (e.g. a number or letter). */
  label?: ReactNode;
}

/** A circle centered at a percentage position with a percentage radius. */
export interface CircleAnnotation extends MediaAnnotationBase {
  type: "circle";
  /** Center horizontal position as a percentage (0–100) of the frame width. */
  x: number;
  /** Center vertical position as a percentage (0–100) of the frame height. */
  y: number;
  /** Radius as a percentage (0–100) of the frame width. */
  radius: number;
}

/** A rectangle defined by two opposite corners, each at a percentage position. */
export interface RectangleAnnotation extends MediaAnnotationBase {
  type: "rectangle";
  /** First corner — horizontal position as a percentage (0–100) of the frame width. */
  x1: number;
  /** First corner — vertical position as a percentage (0–100) of the frame height. */
  y1: number;
  /** Opposite corner — horizontal position as a percentage (0–100) of the frame width. */
  x2: number;
  /** Opposite corner — vertical position as a percentage (0–100) of the frame height. */
  y2: number;
}

export type MediaAnnotation =
  | PointAnnotation
  | CircleAnnotation
  | RectangleAnnotation;

const severityOutlineClass: Record<GuideSeverity, string> = {
  note: "border-foreground/80 bg-foreground/10",
  info: "border-accent bg-accent/10",
  tip: "border-success bg-success/10",
  caution: "border-warning bg-warning/10",
  danger: "border-danger bg-danger/10",
};

function isCircleAnnotation(
  annotation: MediaAnnotation,
): annotation is CircleAnnotation {
  return annotation.type === "circle";
}

function isRectangleAnnotation(
  annotation: MediaAnnotation,
): annotation is RectangleAnnotation {
  return annotation.type === "rectangle";
}

function renderAnnotation(annotation: MediaAnnotation, index: number) {
  const key = annotation.id ?? index;
  const severity = annotation.severity ?? "note";

  if (isCircleAnnotation(annotation)) {
    return (
      <div
        key={key}
        role="img"
        aria-label={annotation.title}
        className={cn(
          "pointer-events-none absolute rounded-full border-2",
          severityOutlineClass[severity],
        )}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          width: `${annotation.radius * 2}%`,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  if (isRectangleAnnotation(annotation)) {
    const left = Math.min(annotation.x1, annotation.x2);
    const top = Math.min(annotation.y1, annotation.y2);
    const width = Math.abs(annotation.x2 - annotation.x1);
    const height = Math.abs(annotation.y2 - annotation.y1);

    return (
      <div
        key={key}
        role="img"
        aria-label={annotation.title}
        className={cn(
          "pointer-events-none absolute border-2",
          severityOutlineClass[severity],
        )}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
        }}
      />
    );
  }

  return (
    <span
      key={key}
      role="img"
      aria-label={annotation.title}
      style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
      className={cn(
        "absolute flex min-h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-xs font-semibold shadow ring-2 ring-background",
        severityMarkerClass[severity],
      )}
    >
      {annotation.label}
    </span>
  );
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
 * annotation overlays. Point markers use {@link GuideSeverity} colors so they can be
 * visually linked to matching `GuideStep` bullets; circles and rectangles use the
 * same severity for their outline and fill.
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

        {annotations.map(renderAnnotation)}
      </div>

      {caption != null && (
        <figcaption className="text-sm text-default-500">{caption}</figcaption>
      )}
    </figure>
  );
}
