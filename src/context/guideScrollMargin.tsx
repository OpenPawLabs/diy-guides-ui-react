"use client";

import { createContext, useContext, type RefObject } from "react";

/** Extra top scroll margin (px) supplied by a page shell such as `GuideLayout`. */
export const GuideScrollMarginContext = createContext(0);

/** Scroll anchor for the guide overview — set by `GuideLayout` on its root element. */
export const GuideTopRefContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useGuideScrollMargin(): number {
  return useContext(GuideScrollMarginContext);
}

export function useGuideTopRef(): RefObject<HTMLElement | null> | null {
  return useContext(GuideTopRefContext);
}

/** Tailwind `scroll-mt-4` — baseline breathing room below the scroll anchor. */
export const GUIDE_STEP_BASE_SCROLL_MARGIN = 16;

/** Sticky progress bar `top-2` offset in px. */
export const GUIDE_STEP_PROGRESS_STICKY_TOP = 8;

export function computeGuideStepScrollMarginTop({
  siteScrollMarginTop = 0,
  progressBarHeight = 0,
  includeProgressBar = false,
  additionalScrollMarginTop = 0,
}: {
  siteScrollMarginTop?: number;
  progressBarHeight?: number;
  includeProgressBar?: boolean;
  additionalScrollMarginTop?: number;
}): number {
  const progressMargin = includeProgressBar
    ? progressBarHeight + GUIDE_STEP_PROGRESS_STICKY_TOP
    : 0;

  return (
    GUIDE_STEP_BASE_SCROLL_MARGIN +
    siteScrollMarginTop +
    progressMargin +
    additionalScrollMarginTop
  );
}
