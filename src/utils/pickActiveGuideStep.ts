/** Fraction of a section's height visible below fixed chrome at the top of the viewport. */
export function getStepVisibleRatio(
  rect: DOMRect,
  innerHeight: number = window.innerHeight,
  contentInsetTop: number = 0,
): number {
  if (rect.height <= 0) {
    return 0;
  }

  const visibleTop = Math.max(rect.top, contentInsetTop);
  const visibleBottom = Math.min(rect.bottom, innerHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight / rect.height;
}

/**
 * Overview region from the guide top anchor through the top of `GuideLayout.Content`
 * (header, intro, and sidebar — not the steps).
 */
export function getOverviewRect(
  guideTopRect: DOMRect | null,
  contentTopRect: DOMRect | null,
): DOMRect | null {
  if (guideTopRect == null) {
    return null;
  }

  const overviewBottom = contentTopRect?.top ?? guideTopRect.top;
  const height = Math.max(0, overviewBottom - guideTopRect.top);
  if (height <= 0) {
    return null;
  }

  return {
    top: guideTopRect.top,
    bottom: guideTopRect.top + height,
    left: guideTopRect.left,
    right: guideTopRect.right,
    width: guideTopRect.width,
    height,
    x: guideTopRect.x,
    y: guideTopRect.y,
    toJSON: () => ({}),
  } as DOMRect;
}

export interface PickActiveGuideSectionOptions {
  overviewRect: DOMRect | null;
  overviewContentInsetTop: number;
  stepNumbers: number[];
  getStepRect: (step: number) => DOMRect | null;
  activeStepMinVisibleRatio: number;
  stepContentInsetTop: number;
  innerHeight?: number;
}

/**
 * Picks the active guide section while scrolling. The overview (`null`) competes
 * with steps using the same `activeStepMinVisibleRatio` rule — the earliest
 * section with enough visible area below its content inset wins.
 */
export function pickActiveGuideSection({
  overviewRect,
  overviewContentInsetTop,
  stepNumbers,
  getStepRect,
  activeStepMinVisibleRatio,
  stepContentInsetTop,
  innerHeight = window.innerHeight,
}: PickActiveGuideSectionOptions): number | null {
  const overviewRatio =
    overviewRect != null
      ? getStepVisibleRatio(
          overviewRect,
          innerHeight,
          overviewContentInsetTop,
        )
      : 0;

  const stepScores = stepNumbers.flatMap((step) => {
    const rect = getStepRect(step);
    if (rect == null) {
      return [];
    }

    return [
      {
        step,
        visibleRatio: getStepVisibleRatio(rect, innerHeight, stepContentInsetTop),
      },
    ];
  });

  let activeStep: number | null = null;
  for (const entry of stepScores) {
    if (entry.visibleRatio >= activeStepMinVisibleRatio) {
      activeStep = entry.step;
      break;
    }
  }

  if (overviewRatio >= activeStepMinVisibleRatio) {
    const competingStepRatio =
      activeStep != null
        ? (stepScores.find((entry) => entry.step === activeStep)?.visibleRatio ?? 0)
        : 0;

    if (activeStep == null || overviewRatio >= competingStepRatio) {
      return null;
    }
  }

  if (activeStep != null) {
    return activeStep;
  }

  const partial = [
    ...(overviewRatio > 0
      ? [{ step: null as number | null, visibleRatio: overviewRatio }]
      : []),
    ...stepScores.filter((entry) => entry.visibleRatio > 0),
  ];

  if (partial.length > 0) {
    return partial[partial.length - 1]!.step;
  }

  return null;
}

/**
 * Picks the active step while scrolling — overview is not considered.
 * @deprecated Prefer `pickActiveGuideSection` when an overview region is available.
 */
export function pickActiveGuideStep(
  stepNumbers: number[],
  activeStepMinVisibleRatio: number,
  getRect: (step: number) => DOMRect | null,
  innerHeight: number = window.innerHeight,
  contentInsetTop: number = 0,
): number | null {
  return pickActiveGuideSection({
    overviewRect: null,
    overviewContentInsetTop: 0,
    stepNumbers,
    getStepRect: getRect,
    activeStepMinVisibleRatio,
    stepContentInsetTop: contentInsetTop,
    innerHeight,
  });
}
