"use client";

import { createContext, useContext, type RefObject } from "react";

/** Parent/site header offset (px) supplied by a page shell such as `GuideLayout`. */
export const GuideScrollMarginContext = createContext(0);

/** Scroll anchor for the guide overview — set by `GuideLayout` on its root element. */
export const GuideTopRefContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

/** Top of `GuideLayout.Content` — marks where the step list begins. */
export const GuideContentRefContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useGuideScrollMargin(): number {
  return useContext(GuideScrollMarginContext);
}

export function useGuideTopRef(): RefObject<HTMLElement | null> | null {
  return useContext(GuideTopRefContext);
}

export function useGuideContentRef(): RefObject<HTMLElement | null> | null {
  return useContext(GuideContentRefContext);
}

/** Tailwind `scroll-mt-4` — default breathing room when URL sync is off. */
export const GUIDE_STEP_BASE_SCROLL_MARGIN = 16;

/** Breathing room between a stuck progress bar and the step below it. */
export const GUIDE_STEP_PROGRESS_STICKY_GAP = 8;

/** Parent/site header offset — overview anchor and sticky progress bar. */
export function computeParentScrollMarginTop({
  parentScrollMarginTop = 0,
  additionalParentScrollMarginTop = 0,
}: {
  parentScrollMarginTop?: number;
  additionalParentScrollMarginTop?: number;
} = {}): number {
  return parentScrollMarginTop + additionalParentScrollMarginTop;
}

/** Library-internal offset so deep-linked steps clear the sticky progress bar. */
export function computeGuideLibraryScrollMarginTop({
  progressBarHeight = 0,
  includeProgressBar = false,
}: {
  progressBarHeight?: number;
  includeProgressBar?: boolean;
} = {}): number {
  if (!includeProgressBar) {
    return 0;
  }

  return progressBarHeight + GUIDE_STEP_PROGRESS_STICKY_GAP;
}

/** Overview anchor — parent offset only. */
export function computeGuideOverviewScrollMarginTop({
  parentScrollMarginTop = 0,
  additionalParentScrollMarginTop = 0,
}: {
  parentScrollMarginTop?: number;
  additionalParentScrollMarginTop?: number;
} = {}): number {
  return computeParentScrollMarginTop({
    parentScrollMarginTop,
    additionalParentScrollMarginTop,
  });
}

/** Step scroll targets — parent offset plus library progress-bar clearance. */
export function computeGuideStepScrollMarginTop({
  parentScrollMarginTop = 0,
  additionalParentScrollMarginTop = 0,
  progressBarHeight = 0,
  includeProgressBar = false,
}: {
  parentScrollMarginTop?: number;
  additionalParentScrollMarginTop?: number;
  progressBarHeight?: number;
  includeProgressBar?: boolean;
}): number {
  return (
    computeGuideOverviewScrollMarginTop({
      parentScrollMarginTop,
      additionalParentScrollMarginTop,
    }) +
    computeGuideLibraryScrollMarginTop({
      progressBarHeight,
      includeProgressBar,
    })
  );
}
