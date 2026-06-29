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
