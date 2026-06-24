import type { ReactNode } from "react";
import { cn, Modal } from "@heroui/react";
import {
  COLORS,
  hexToRgba,
  markerTextColor,
  type GuideColor,
} from "../../types/colors";
import type { MediaDisplayRegion } from "../../utils/mediaCrop";
import { MediaFigureMedia } from "./MediaFigureMedia";

/** Shared fields for every annotation shape. */
interface MediaAnnotationBase {
  /** Stable key; falls back to array index. */
  id?: string;
  /** Marker color — match the related step bullet for visual linking. @default "GREY" */
  color?: GuideColor;
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

export type { MediaDisplayRegion };

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
  const color = annotation.color ?? "GREY";
  const hex = COLORS[color];

  if (isCircleAnnotation(annotation)) {
    return (
      <div
        key={key}
        role="img"
        aria-label={annotation.title}
        className="pointer-events-none absolute rounded-full border-2"
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          width: `${annotation.radius * 2}%`,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          borderColor: hex,
          backgroundColor: hexToRgba(hex, 0.1),
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
        className="pointer-events-none absolute border-2"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
          borderColor: hex,
          backgroundColor: hexToRgba(hex, 0.1),
        }}
      />
    );
  }

  return (
    <span
      key={key}
      role="img"
      aria-label={annotation.title}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        backgroundColor: hex,
        color: markerTextColor(hex),
      }}
      className="absolute flex min-h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-xs font-semibold shadow ring-2 ring-background"
    >
      {annotation.label}
    </span>
  );
}

export interface MediaFigureProps {
  /** Image, video, or 3D model source URL. */
  src: string;
  /** Media kind. @default "image" */
  type?: "image" | "video" | "model";
  /** Markers overlaid on the media, positioned by percentage of the visible frame. */
  annotations?: MediaAnnotation[];
  /**
   * When set, show this 4:3 source-pixel rect (`height` is `round(width × 3 / 4)`),
   * scaled to fill the frame without re-encoding the image.
   */
  displayRegion?: MediaDisplayRegion;
  /**
   * Let readers click an image to open it full size in a modal lightbox. Applies
   * only to `type="image"`; turn it off in editing contexts where the click drives
   * another action. @default true
   */
  zoomable?: boolean;
  className?: string;
}

/**
 * Instructional image, video, or 3D model with percentage-positioned annotation overlays.
 * The frame is always 4:3; non-4:3 sources are center-cropped unless
 * `displayRegion` selects a source-pixel crop. Point markers use
 * {@link GuideColor} values so they can be visually linked to matching `GuideStep`
 * bullets; circles and rectangles use the same color for their outline and fill.
 * Image figures are zoomable by default: clicking opens the full-size source in a
 * modal lightbox (see `zoomable`).
 */
export function MediaFigure({
  src,
  type = "image",
  annotations = [],
  displayRegion,
  zoomable = true,
  className,
}: MediaFigureProps) {
  const frameClassName =
    "relative aspect-[4/3] overflow-hidden rounded-lg border border-default bg-default-soft";
  const frame = (
    <>
      <MediaFigureMedia src={src} type={type} displayRegion={displayRegion} />
      {annotations.map(renderAnnotation)}
    </>
  );

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      {zoomable && type === "image" ? (
        <Modal>
          <Modal.Trigger
            aria-label="View image full size"
            className={cn(frameClassName, "cursor-zoom-in")}
          >
            {frame}
          </Modal.Trigger>
          <Modal.Backdrop variant="blur">
            <Modal.Container placement="center">
              <Modal.Dialog
                aria-label="Full size image"
                className="w-auto max-w-[95vw] overflow-hidden bg-transparent p-0 shadow-none"
              >
                <img
                  src={src}
                  alt=""
                  className="max-h-[88vh] w-auto max-w-[95vw] object-contain"
                />
                <Modal.CloseTrigger />
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      ) : (
        <div className={frameClassName}>{frame}</div>
      )}
    </figure>
  );
}
