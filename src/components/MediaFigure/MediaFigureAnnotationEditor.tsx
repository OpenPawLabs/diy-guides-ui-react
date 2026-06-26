"use client";

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@heroui/react";
import { COLORS, hexToRgba, markerTextColor } from "../../types/colors";
import type {
  AnnotationTool,
  CircleAnnotation,
  MediaAnnotation,
  MediaAnnotationEditing,
  PointAnnotation,
  RectangleAnnotation,
} from "./MediaFigure";
import { MEDIA_FIGURE_POINT_MARKER_CLASS, MEDIA_FIGURE_SHAPE_OUTLINE_CLASS } from "./MediaFigureAnnotations";

type Point = { x: number; y: number };
type RectCorner = "nw" | "ne" | "sw" | "se";

/**
 * Smallest circle radius / rectangle edge, as a percentage of the frame, applied to
 * the live draft as well as the commit so the preview is WYSIWYG. Kept small — just
 * enough to stay visible and grabbable — so tight shapes around small features are
 * possible without the cursor snapping the size up on release.
 */
const MIN_RADIUS = 2;
const MIN_SIZE = 3;

interface Gesture {
  mode:
    | "create-point"
    | "create-circle"
    | "create-rectangle"
    | "move"
    | "resize-circle"
    | "resize-rect";
  /** Annotation id being edited, or `null` while drawing a new one. */
  id: string | null;
  start: Point;
  base: MediaAnnotation;
  corner?: RectCorner;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isCircle = (a: MediaAnnotation): a is CircleAnnotation =>
  a.type === "circle";
const isRect = (a: MediaAnnotation): a is RectangleAnnotation =>
  a.type === "rectangle";

const xsOf = (a: MediaAnnotation) => (isRect(a) ? [a.x1, a.x2] : [a.x]);
const ysOf = (a: MediaAnnotation) => (isRect(a) ? [a.y1, a.y2] : [a.y]);

/** Shift an annotation by a delta, clamped so it stays within the frame. */
function translate(a: MediaAnnotation, dx: number, dy: number): MediaAnnotation {
  const cdx = clamp(dx, -Math.min(...xsOf(a)), 100 - Math.max(...xsOf(a)));
  const cdy = clamp(dy, -Math.min(...ysOf(a)), 100 - Math.max(...ysOf(a)));
  if (isRect(a)) {
    return { ...a, x1: a.x1 + cdx, y1: a.y1 + cdy, x2: a.x2 + cdx, y2: a.y2 + cdy };
  }
  return { ...a, x: a.x + cdx, y: a.y + cdy };
}

/** Radius (% of frame width) from a center to a point, correcting for frame aspect. */
function radiusBetween(center: Point, p: Point, aspect: number): number {
  return Math.hypot(p.x - center.x, (p.y - center.y) / aspect);
}

function normalizeRect(r: RectangleAnnotation): RectangleAnnotation {
  return {
    ...r,
    x1: Math.min(r.x1, r.x2),
    y1: Math.min(r.y1, r.y2),
    x2: Math.max(r.x1, r.x2),
    y2: Math.max(r.y1, r.y2),
  };
}

function blankAnnotation(
  tool: AnnotationTool,
  p: Point,
  color: MediaAnnotationEditing["color"],
): MediaAnnotation {
  if (tool === "circle") return { type: "circle", x: p.x, y: p.y, radius: 0, color };
  if (tool === "rectangle")
    return { type: "rectangle", x1: p.x, y1: p.y, x2: p.x, y2: p.y, color };
  return { type: "point", x: p.x, y: p.y, color };
}

function createMode(tool: AnnotationTool): Gesture["mode"] {
  if (tool === "circle") return "create-circle";
  if (tool === "rectangle") return "create-rectangle";
  return "create-point";
}

/** Recompute the edited annotation from the live pointer position. */
function applyGesture(g: Gesture, p: Point, aspect: number): MediaAnnotation {
  switch (g.mode) {
    case "create-point":
      return { ...(g.base as PointAnnotation), x: p.x, y: p.y };
    case "move":
      return translate(g.base, p.x - g.start.x, p.y - g.start.y);
    case "create-circle":
      return { ...(g.base as CircleAnnotation), radius: radiusBetween(g.start, p, aspect) };
    case "resize-circle": {
      const c = g.base as CircleAnnotation;
      return { ...c, radius: radiusBetween({ x: c.x, y: c.y }, p, aspect) };
    }
    case "create-rectangle":
      return { ...(g.base as RectangleAnnotation), x2: p.x, y2: p.y };
    case "resize-rect": {
      const r = g.base as RectangleAnnotation;
      const movesLeft = g.corner === "nw" || g.corner === "sw";
      const movesTop = g.corner === "nw" || g.corner === "ne";
      return {
        ...r,
        x1: movesLeft ? p.x : r.x1,
        x2: movesLeft ? r.x2 : p.x,
        y1: movesTop ? p.y : r.y1,
        y2: movesTop ? r.y2 : p.y,
      };
    }
  }
}

/** Normalize and enforce a minimum visible size before committing. */
function finalize(a: MediaAnnotation): MediaAnnotation {
  if (isCircle(a)) return { ...a, radius: Math.max(a.radius, MIN_RADIUS) };
  if (isRect(a)) {
    const r = normalizeRect(a);
    return {
      ...r,
      x2: Math.max(r.x2, r.x1 + MIN_SIZE),
      y2: Math.max(r.y2, r.y1 + MIN_SIZE),
    };
  }
  return a;
}

function Handle({
  x,
  y,
  cursor,
  onPointerDown,
}: {
  x: number;
  y: number;
  cursor: string;
  onPointerDown: (event: ReactPointerEvent) => void;
}) {
  return (
    <span
      onPointerDown={onPointerDown}
      className="annotation-handle pointer-events-auto absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-background bg-accent shadow"
      style={{ left: `${x}%`, top: `${y}%`, cursor }}
    />
  );
}

export interface MediaFigureAnnotationEditorProps {
  annotations: MediaAnnotation[];
  editing: MediaAnnotationEditing;
}

/**
 * Interactive overlay that turns {@link MediaFigure} annotations into a drawing
 * canvas: click or drag to add, click to select, drag to move, and drag the
 * handles to resize. All geometry is computed in frame percentages and reported
 * through the editing callbacks — selection, color, and persistence stay external.
 */
export function MediaFigureAnnotationEditor({
  annotations,
  editing,
}: MediaFigureAnnotationEditorProps) {
  const { tool, color, selectedId, onSelect, onAdd, onChange, onRemove } = editing;
  const rootRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [draft, setDraft] = useState<MediaAnnotation | null>(null);

  const selecting = tool === "select";

  const pointFrom = (event: ReactPointerEvent): Point => {
    const rect = rootRef.current!.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  };

  const begin = (event: ReactPointerEvent, next: Gesture) => {
    rootRef.current?.setPointerCapture(event.pointerId);
    movedRef.current = false;
    setGesture(next);
    setDraft(finalize(next.base));
  };

  const handleRootPointerDown = (event: ReactPointerEvent) => {
    if (selecting) {
      onSelect?.(null);
      return;
    }
    const start = pointFrom(event);
    begin(event, {
      mode: createMode(tool),
      id: null,
      start,
      base: blankAnnotation(tool, start, color),
    });
  };

  const handlePointerMove = (event: ReactPointerEvent) => {
    if (!gesture) return;
    const rect = rootRef.current!.getBoundingClientRect();
    movedRef.current = true;
    setDraft(finalize(applyGesture(gesture, pointFrom(event), rect.width / rect.height)));
  };

  const handlePointerUp = (event: ReactPointerEvent) => {
    if (gesture && draft) {
      rootRef.current?.releasePointerCapture(event.pointerId);
      if (gesture.id === null) onAdd?.(draft);
      else if (movedRef.current) onChange?.(gesture.id, draft);
    }
    setGesture(null);
    setDraft(null);
  };

  const startMove = (
    event: ReactPointerEvent,
    id: string,
    annotation: MediaAnnotation,
  ) => {
    event.stopPropagation();
    rootRef.current?.focus();
    onSelect?.(id);
    begin(event, { mode: "move", id, start: pointFrom(event), base: annotation });
  };

  const startResizeCircle = (
    event: ReactPointerEvent,
    id: string,
    annotation: CircleAnnotation,
  ) => {
    event.stopPropagation();
    begin(event, {
      mode: "resize-circle",
      id,
      start: pointFrom(event),
      base: annotation,
    });
  };

  const startResizeRect = (
    event: ReactPointerEvent,
    id: string,
    annotation: RectangleAnnotation,
    corner: RectCorner,
  ) => {
    event.stopPropagation();
    begin(event, {
      mode: "resize-rect",
      id,
      start: pointFrom(event),
      base: normalizeRect(annotation),
      corner,
    });
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if ((event.key === "Delete" || event.key === "Backspace") && selectedId != null) {
      event.preventDefault();
      onRemove?.(selectedId);
    }
  };

  const renderShape = (a: MediaAnnotation, id: string, interactive: boolean) => {
    const selected = interactive && id === selectedId;
    const hex = COLORS[a.color ?? "GREY"];
    const pointer = interactive ? "pointer-events-auto cursor-move" : "pointer-events-none";
    const onDown = interactive
      ? (event: ReactPointerEvent) => startMove(event, id, a)
      : undefined;

    if (isCircle(a)) {
      return (
        <div key={id}>
          <div
            role="img"
            aria-label={a.title}
            onPointerDown={onDown}
            className={cn(
              "absolute rounded-full",
              MEDIA_FIGURE_SHAPE_OUTLINE_CLASS,
              pointer,
              selected && "outline outline-2 outline-offset-2 outline-accent",
            )}
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              width: `${a.radius * 2}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              borderColor: hex,
              backgroundColor: hexToRgba(hex, 0.1),
            }}
          />
          {selected && (
            <Handle
              x={a.x + a.radius}
              y={a.y}
              cursor="ew-resize"
              onPointerDown={(event) => startResizeCircle(event, id, a)}
            />
          )}
        </div>
      );
    }

    if (isRect(a)) {
      const left = Math.min(a.x1, a.x2);
      const top = Math.min(a.y1, a.y2);
      const width = Math.abs(a.x2 - a.x1);
      const height = Math.abs(a.y2 - a.y1);
      const corners: { corner: RectCorner; x: number; y: number; cursor: string }[] = [
        { corner: "nw", x: left, y: top, cursor: "nwse-resize" },
        { corner: "ne", x: left + width, y: top, cursor: "nesw-resize" },
        { corner: "sw", x: left, y: top + height, cursor: "nesw-resize" },
        { corner: "se", x: left + width, y: top + height, cursor: "nwse-resize" },
      ];
      return (
        <div key={id}>
          <div
            role="img"
            aria-label={a.title}
            onPointerDown={onDown}
            className={cn(
              "absolute",
              MEDIA_FIGURE_SHAPE_OUTLINE_CLASS,
              pointer,
              selected && "outline outline-2 outline-offset-2 outline-accent",
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
          {selected &&
            corners.map(({ corner, x, y, cursor }) => (
              <Handle
                key={corner}
                x={x}
                y={y}
                cursor={cursor}
                onPointerDown={(event) => startResizeRect(event, id, a, corner)}
              />
            ))}
        </div>
      );
    }

    return (
      <span
        key={id}
        role="img"
        aria-label={a.title}
        onPointerDown={onDown}
        style={{
          left: `${a.x}%`,
          top: `${a.y}%`,
          backgroundColor: hex,
          color: markerTextColor(hex),
        }}
        className={cn(
          MEDIA_FIGURE_POINT_MARKER_CLASS,
          pointer,
          selected && "outline outline-2 outline-offset-2 outline-accent",
        )}
      >
        {a.label}
      </span>
    );
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="application"
      aria-label="Annotation editor"
      onPointerDown={handleRootPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "absolute inset-0 focus:outline-none",
        selecting ? "cursor-default" : "cursor-crosshair",
      )}
    >
      {annotations.map((annotation, index) => {
        const id = annotation.id ?? String(index);
        const live = gesture?.id === id && draft ? draft : annotation;
        return renderShape(live, id, selecting);
      })}
      {gesture?.id === null && draft && renderShape(draft, "__draft__", false)}
    </div>
  );
}
