/** Fraction of a step's height that is visible in the viewport. */
export function getStepVisibleRatio(
  rect: DOMRect,
  innerHeight: number = window.innerHeight,
): number {
  if (rect.height <= 0) {
    return 0;
  }

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, innerHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight / rect.height;
}

/**
 * Picks the active step while scrolling: the earliest step that still has at
 * least `activeStepMinVisibleRatio` of its height on screen. Later steps do
 * not take over until every earlier step has fallen below that threshold.
 */
export function pickActiveGuideStep(
  stepNumbers: number[],
  activeStepMinVisibleRatio: number,
  getRect: (step: number) => DOMRect | null,
  innerHeight: number = window.innerHeight,
): number | null {
  const scored = stepNumbers.flatMap((step) => {
    const rect = getRect(step);
    if (rect == null) {
      return [];
    }

    return [
      {
        step,
        visibleRatio: getStepVisibleRatio(rect, innerHeight),
      },
    ];
  });

  if (scored.length === 0) {
    return null;
  }

  const eligible = scored.filter(
    (entry) => entry.visibleRatio >= activeStepMinVisibleRatio,
  );

  if (eligible.length > 0) {
    return eligible[0]!.step;
  }

  const partiallyVisible = scored.filter((entry) => entry.visibleRatio > 0);
  if (partiallyVisible.length > 0) {
    return partiallyVisible[partiallyVisible.length - 1]!.step;
  }

  return null;
}

/** Whether the guide overview anchor is aligned with the top of the viewport. */
export function isGuideOverviewVisible(
  anchorRect: DOMRect | null,
  scrollMarginTop: number,
): boolean {
  if (anchorRect == null) {
    return false;
  }

  return anchorRect.top >= -4 && anchorRect.top <= scrollMarginTop + 4;
}

/** True when the reader is back at the guide overview — no step should be in the URL. */
export function shouldClearGuideStepFromUrl({
  guideTopRect,
  firstStepRect,
  scrollMarginTop,
  activeStepMinVisibleRatio,
  innerHeight = window.innerHeight,
}: {
  guideTopRect: DOMRect | null;
  firstStepRect: DOMRect | null;
  scrollMarginTop: number;
  activeStepMinVisibleRatio: number;
  innerHeight?: number;
}): boolean {
  if (!isGuideOverviewVisible(guideTopRect, scrollMarginTop)) {
    return false;
  }

  if (firstStepRect == null) {
    return true;
  }

  return (
    getStepVisibleRatio(firstStepRect, innerHeight) < activeStepMinVisibleRatio
  );
}
