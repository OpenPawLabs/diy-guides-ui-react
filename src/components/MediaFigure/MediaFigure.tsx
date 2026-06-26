import type { ReactNode } from "react";
import { cn, Modal } from "@heroui/react";
import type { GuideColor } from "../../types/colors";
import type { MediaDisplayRegion } from "../../utils/mediaCrop";
import { MediaFigureAnnotationLayer } from "./MediaFigureAnnotations";
import { MediaFigureClipFrame, MediaFigureMedia } from "./MediaFigureClipFrame";
import { MediaFigureAnnotationEditor } from "./MediaFigureAnnotationEditor";

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

/** Active annotation tool: `select` edits existing markers; the rest draw a new shape. */
export type AnnotationTool = "select" | "point" | "circle" | "rectangle";

/**
 * Editor-only annotation affordances. Passing this turns the figure into an
 * interactive annotation canvas — click or drag to draw, click to select, drag to
 * move, and drag the handles to resize (the lightbox is disabled). The library owns
 * all frame-percentage geometry and reports intent through these callbacks; tool
 * selection, color choice, and persistence stay with the consumer. Editing relies on
 * stable annotation `id`s so selection and updates can target a specific marker.
 */
export interface MediaAnnotationEditing {
  /** Active tool (controlled). */
  tool: AnnotationTool;
  /** Color applied to newly drawn annotations. */
  color: GuideColor;
  /** Selected annotation id, or `null` when nothing is selected (controlled). */
  selectedId?: string | null;
  /** Selection changed to an annotation `id`, or `null` when cleared. */
  onSelect?: (id: string | null) => void;
  /** A new annotation was drawn. It carries no `id` — the consumer assigns one. */
  onAdd?: (annotation: MediaAnnotation) => void;
  /** The annotation with `id` was moved or resized. */
  onChange?: (id: string, annotation: MediaAnnotation) => void;
  /** The selected annotation was deleted via `Delete` / `Backspace`. */
  onRemove?: (id: string) => void;
}

export interface MediaFigureProps {
  /** Image, video, or 3D model source URL. */
  src: string;
  /** Media kind. @default "image" */
  type?: "image" | "video" | "model";
  /**
   * File name with extension for 3D models when `src` is a blob or
   * extension-less URL. Pass the on-disk name (for example from
   * `./images/part.stl`) so online-3d-viewer can detect the format.
   */
  modelFileName?: string;
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
  /**
   * Editor-only annotation affordances. When set, the figure becomes an interactive
   * annotation canvas (the lightbox is disabled). Leave undefined for readers.
   */
  annotationEditing?: MediaAnnotationEditing;
  /**
   * Pass when the figure sits inside layout that settles after mount (e.g. modal
   * `isOpen`) so display-region crop re-samples once the frame reaches its final size.
   */
  layoutSettleKey?: boolean | number | string;
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
  modelFileName,
  annotations = [],
  displayRegion,
  zoomable = true,
  annotationEditing,
  layoutSettleKey,
  className,
}: MediaFigureProps) {
  const frameClassName =
    "@container relative aspect-[4/3] overflow-hidden rounded-lg border border-default bg-default-soft";
  const frame = (
    <>
      <MediaFigureMedia
        src={src}
        type={type}
        displayRegion={displayRegion}
        modelFileName={modelFileName}
        layoutSettleKey={layoutSettleKey}
      />
      {annotationEditing ? (
        <MediaFigureAnnotationEditor
          annotations={annotations}
          editing={annotationEditing}
        />
      ) : (
        <MediaFigureAnnotationLayer annotations={annotations} />
      )}
    </>
  );

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      {zoomable && type === "image" && !annotationEditing ? (
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
                <MediaFigureClipFrame
                  className="aspect-[4/3] max-h-[88vh] w-[min(95vw,calc(88vh*4/3))] rounded-lg border border-default bg-default-soft"
                  src={src}
                  type="image"
                  displayRegion={displayRegion}
                  remeasureWhenVisible
                >
                  <MediaFigureAnnotationLayer annotations={annotations} />
                </MediaFigureClipFrame>
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

/** Recognizes MDX preview wrappers as MediaFigure slots in `GuideStep.Media`. */
export const mediaFigureType = Symbol.for("@openpawlabs/diy-guides-ui/MediaFigure");

(MediaFigure as typeof MediaFigure & { [key: symbol]: boolean })[mediaFigureType] =
  true;
