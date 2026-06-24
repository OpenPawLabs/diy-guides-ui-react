"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
} from "react";
import { cn } from "@heroui/react";
import {
  centeredDisplayRegion,
  clampDisplayRegion,
  displayRegionHeight,
  MIN_REGION_WIDTH,
  type MediaDisplayRegion,
} from "../../utils/mediaCrop";

type Point = { x: number; y: number };
type Corner = "nw" | "ne" | "sw" | "se";

interface Gesture {
  mode: "move" | "resize";
  corner?: Corner;
  /** Pointer position (source pixels) where the gesture began. */
  start: Point;
  /** Region at the start of the gesture. */
  base: MediaDisplayRegion;
}

const HANDLES: { corner: Corner; cursor: string }[] = [
  { corner: "nw", cursor: "nwse-resize" },
  { corner: "ne", cursor: "nesw-resize" },
  { corner: "sw", cursor: "nesw-resize" },
  { corner: "se", cursor: "nwse-resize" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Move a region by a source-pixel delta, kept inside the source. */
function moveRegion(
  base: MediaDisplayRegion,
  dx: number,
  dy: number,
  sourceWidth: number,
  sourceHeight: number,
): MediaDisplayRegion {
  return clampDisplayRegion(
    { x: base.x + dx, y: base.y + dy, width: base.width },
    sourceWidth,
    sourceHeight,
  );
}

/**
 * Resize from a corner with the opposite corner pinned, locked to 4:3. Width is
 * taken from the pointer's horizontal distance to the anchor and bounded by both
 * the source edges and the derived height, so the box can never leave the image.
 */
function resizeRegion(
  base: MediaDisplayRegion,
  corner: Corner,
  p: Point,
  sourceWidth: number,
  sourceHeight: number,
): MediaDisplayRegion {
  const draggingLeft = corner === "nw" || corner === "sw";
  const draggingTop = corner === "nw" || corner === "ne";
  const anchorX = draggingLeft ? base.x + base.width : base.x;
  const anchorY = draggingTop
    ? base.y + displayRegionHeight(base.width)
    : base.y;

  const maxByX = draggingLeft ? anchorX : sourceWidth - anchorX;
  const maxByY = draggingTop ? anchorY : sourceHeight - anchorY;
  const maxWidth = Math.min(maxByX, maxByY * (4 / 3));
  const width = clamp(Math.abs(p.x - anchorX), MIN_REGION_WIDTH, maxWidth);
  const height = displayRegionHeight(width);

  return clampDisplayRegion(
    {
      x: draggingLeft ? anchorX - width : anchorX,
      y: draggingTop ? anchorY - height : anchorY,
      width,
    },
    sourceWidth,
    sourceHeight,
  );
}

export interface MediaCropEditorProps {
  /** Image source to crop. */
  src: string;
  /**
   * Current 4:3 region in source pixels. When omitted, the editor starts from the
   * largest centered region (the same view the fixed frame center-crops to).
   */
  region?: MediaDisplayRegion;
  /** Reports a new region (source pixels) when the user finishes a drag. */
  onChange: (region: MediaDisplayRegion) => void;
  className?: string;
}

/**
 * Interactive crop tool: shows the full source image with a draggable, 4:3-locked
 * selection that maps directly to a {@link MediaDisplayRegion} in source pixels.
 * Drag the box to move it, drag a corner to resize. The component owns all
 * pixel geometry and reports the chosen region — selection chrome and persistence
 * stay with the consumer (see the authoring tool's crop modal).
 *
 * Once the source loads, the editor publishes its aspect ratio as the
 * `--crop-aspect` custom property on its root, so a sized container can fit the
 * whole image without scrolling — e.g.
 * `width: min(100cqw, calc(100cqh * var(--crop-aspect)))`.
 */
export function MediaCropEditor({
  src,
  region,
  onChange,
  className,
}: MediaCropEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [draft, setDraft] = useState<MediaDisplayRegion | null>(null);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setSource({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  const effective =
    draft ??
    (source
      ? region
        ? clampDisplayRegion(region, source.width, source.height)
        : centeredDisplayRegion(source.width, source.height)
      : null);

  const toSource = (event: ReactPointerEvent): Point => {
    const rect = rootRef.current!.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * source!.width,
      y: ((event.clientY - rect.top) / rect.height) * source!.height,
    };
  };

  const begin = (event: ReactPointerEvent, next: Gesture) => {
    event.stopPropagation();
    rootRef.current?.setPointerCapture(event.pointerId);
    setGesture(next);
    setDraft(next.base);
  };

  const handlePointerMove = (event: ReactPointerEvent) => {
    if (!gesture || !source) return;
    const p = toSource(event);
    const next =
      gesture.mode === "move"
        ? moveRegion(
            gesture.base,
            p.x - gesture.start.x,
            p.y - gesture.start.y,
            source.width,
            source.height,
          )
        : resizeRegion(
            gesture.base,
            gesture.corner!,
            p,
            source.width,
            source.height,
          );
    setDraft(next);
  };

  const handlePointerUp = (event: ReactPointerEvent) => {
    if (gesture && draft) {
      rootRef.current?.releasePointerCapture(event.pointerId);
      onChange(draft);
    }
    setGesture(null);
    setDraft(null);
  };

  const box =
    effective && source
      ? {
          left: (effective.x / source.width) * 100,
          top: (effective.y / source.height) * 100,
          width: (effective.width / source.width) * 100,
          height:
            (displayRegionHeight(effective.width) / source.height) * 100,
        }
      : null;

  return (
    <div
      ref={rootRef}
      role="application"
      aria-label="Crop editor"
      className={cn(
        "relative inline-block touch-none select-none overflow-hidden leading-none",
        className,
      )}
      style={
        source
          ? ({ "--crop-aspect": source.width / source.height } as CSSProperties)
          : undefined
      }
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        onLoad={handleLoad}
        className="block h-auto w-full select-none"
      />
      {box && (
        <div
          className="crop-region absolute cursor-move border-2 border-background"
          style={{
            left: `${box.left}%`,
            top: `${box.top}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
          onPointerDown={(event) =>
            begin(event, { mode: "move", start: toSource(event), base: effective! })
          }
        >
          {HANDLES.map(({ corner, cursor }) => (
            <span
              key={corner}
              className="crop-handle pointer-events-auto absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-background bg-accent shadow"
              style={{
                left: corner === "nw" || corner === "sw" ? "0%" : "100%",
                top: corner === "nw" || corner === "ne" ? "0%" : "100%",
                cursor,
              }}
              onPointerDown={(event) =>
                begin(event, {
                  mode: "resize",
                  corner,
                  start: toSource(event),
                  base: effective!,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
