import type { CSSProperties } from "react";

/** Top-left and width of a 4:3 crop rect in intrinsic source pixels. Height is derived. */
export interface MediaDisplayRegion {
  /** Left edge in pixels from the source left. */
  x: number;
  /** Top edge in pixels from the source top. */
  y: number;
  /** Width in source pixels; height is computed as `round(width × 3 / 4)`. */
  width: number;
}

export const DISPLAY_REGION_ASPECT = 4 / 3;

/** Smallest selectable region width, in source pixels, so a crop never collapses. */
export const MIN_REGION_WIDTH = 16;

/** Height in source pixels for a 4:3 region with the given width. */
export function displayRegionHeight(width: number): number {
  return Math.round((width * 3) / 4);
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Snap a region to integer source pixels and keep its 4:3 box fully inside the
 * source: width is bounded by both axes, then `x` / `y` are pinned so the derived
 * height fits. Use it to sanitize any externally supplied or in-progress region.
 */
export function clampDisplayRegion(
  region: MediaDisplayRegion,
  sourceWidth: number,
  sourceHeight: number,
): MediaDisplayRegion {
  const maxWidth = Math.min(sourceWidth, Math.floor(sourceHeight * DISPLAY_REGION_ASPECT));
  const width = clamp(
    Math.round(region.width),
    Math.min(MIN_REGION_WIDTH, maxWidth),
    maxWidth,
  );
  const height = displayRegionHeight(width);
  return {
    width,
    x: clamp(Math.round(region.x), 0, sourceWidth - width),
    y: clamp(Math.round(region.y), 0, sourceHeight - height),
  };
}

/**
 * Largest centered 4:3 region for a source — the rect the fixed frame shows when
 * no `displayRegion` is set. Used as the starting selection in the crop editor so
 * opening it mirrors the current center-crop.
 */
export function centeredDisplayRegion(
  sourceWidth: number,
  sourceHeight: number,
): MediaDisplayRegion {
  const widthLimited = sourceWidth / sourceHeight <= DISPLAY_REGION_ASPECT;
  const width = widthLimited
    ? sourceWidth
    : Math.round(sourceHeight * DISPLAY_REGION_ASPECT);
  const height = displayRegionHeight(width);
  return clampDisplayRegion(
    { x: (sourceWidth - width) / 2, y: (sourceHeight - height) / 2, width },
    sourceWidth,
    sourceHeight,
  );
}

function isValidDisplayRegion(
  region: MediaDisplayRegion,
  sourceWidth: number,
  sourceHeight: number,
): boolean {
  const { x, y, width } = region;
  if (width <= 0 || x < 0 || y < 0) {
    return false;
  }

  const height = displayRegionHeight(width);
  return x + width <= sourceWidth && y + height <= sourceHeight;
}

/**
 * CSS styles to show a 4:3 source-pixel region scaled to fill a 4:3 frame.
 * Returns `null` when the region is invalid for the given source dimensions.
 */
export function getDisplayRegionStyles(
  region: MediaDisplayRegion,
  sourceWidth: number,
  sourceHeight: number,
  frameWidth: number,
  frameHeight: number,
): CSSProperties | null {
  if (
    frameWidth <= 0 ||
    frameHeight <= 0 ||
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    !isValidDisplayRegion(region, sourceWidth, sourceHeight)
  ) {
    return null;
  }

  const scale = frameWidth / region.width;

  return {
    position: "absolute",
    width: scale * sourceWidth,
    height: scale * sourceHeight,
    left: -region.x * scale,
    top: -region.y * scale,
    maxWidth: "none",
  };
}
