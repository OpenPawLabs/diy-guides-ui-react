import {
  COLORS,
  hexToRgba,
  markerTextColor,
} from "../../types/colors";
import { cn } from "@heroui/react";
import type {
  CircleAnnotation,
  MediaAnnotation,
  RectangleAnnotation,
} from "./MediaFigure";

// FYI: Dynamic sizes for annotations/borders are based on css styles in index.css
/** Shared layout for point pins — pairs with `.media-figure-point-marker` in styles. */
export const MEDIA_FIGURE_POINT_MARKER_CLASS =
  "media-figure-point-marker absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-semibold shadow ring-2 ring-background";

/** Circle and rectangle outlines — pairs with `.media-figure-shape-outline` in styles. */
export const MEDIA_FIGURE_SHAPE_OUTLINE_CLASS = "media-figure-shape-outline";

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

export function renderMediaFigureAnnotation(
  annotation: MediaAnnotation,
  index: number,
) {
  const key = annotation.id ?? index;
  const color = annotation.color ?? "GREY";
  const hex = COLORS[color];

  if (isCircleAnnotation(annotation)) {
    return (
      <div
        key={key}
        role="img"
        aria-label={annotation.title}
        className={cn(
          "pointer-events-none absolute rounded-full",
          MEDIA_FIGURE_SHAPE_OUTLINE_CLASS,
        )}
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
        className={cn(
          "pointer-events-none absolute",
          MEDIA_FIGURE_SHAPE_OUTLINE_CLASS,
        )}
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
      className={MEDIA_FIGURE_POINT_MARKER_CLASS}
    >
      {annotation.label}
    </span>
  );
}

export function MediaFigureAnnotationLayer({
  annotations,
}: {
  annotations: MediaAnnotation[];
}) {
  return <>{annotations.map(renderMediaFigureAnnotation)}</>;
}
