"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Card, ProgressBar, Separator, cn } from "@heroui/react";
import {
  computeGuideOverviewScrollMarginTop,
  computeGuideStepScrollMarginTop,
  useGuideContentRef,
  useGuideScrollMargin,
  useGuideTopRef,
} from "../../context/guideScrollMargin";
import { useGuideStepUrlSync } from "../../hooks/useGuideStepUrlSync";
import { useElementSize } from "../../hooks/useElementSize";
import { guideStepUrlId, type GuideStepUrlMode } from "../../utils/guideStepUrl";
import type { GuideStepProps } from "../GuideStep";

export interface GuideProgress {
  completed: number;
  total: number;
}

export interface GuideStepListProps {
  /** `GuideStep` children — numbered automatically in order. */
  children: ReactNode;
  /** Show the aggregate progress bar. @default true */
  showProgress?: boolean;
  /** Fires whenever the number of completed steps changes. */
  onProgressChange?: (progress: GuideProgress) => void;
  /**
   * Keep the page URL in sync with the step in view (`#step-N` by default).
   * Smooth-scrolls on load and when the URL changes; clears the step from the
   * URL when the reader is at the top of the guide.
   * @default true
   */
  syncStepUrl?: boolean;
  /** Where to store the active step in the URL. @default "hash" */
  stepUrlMode?: GuideStepUrlMode;
  /** Query parameter name when `stepUrlMode` is `"search"`. @default "step" */
  stepUrlKey?: string;
  /** Fires when the visible step changes (from scroll or URL). */
  onActiveStepChange?: (step: number | null) => void;
  /**
   * Extra parent/site header offset (px) beyond `GuideLayout.scrollMarginTop`.
   * @default 0
   */
  scrollMarginTop?: number;
  /**
   * Fraction of a step's height that must remain visible in the viewport for it
   * to stay the active step while scrolling. @default 0.2
   */
  activeStepMinVisibleRatio?: number;
  className?: string;
}

function isStepElement(node: ReactNode): node is ReactElement<GuideStepProps> {
  return isValidElement(node);
}

/**
 * Ordered sequence of `GuideStep`s. Numbers each step in order, owns their
 * completion state, and renders a derived progress bar — so a guide author only
 * has to drop in steps. Listen to overall progress via `onProgressChange`.
 */
export function GuideStepList({
  children,
  showProgress = true,
  onProgressChange,
  syncStepUrl = true,
  stepUrlMode = "hash",
  stepUrlKey = "step",
  onActiveStepChange,
  scrollMarginTop: additionalParentScrollMarginTop = 0,
  activeStepMinVisibleRatio = 0.2,
  className,
}: GuideStepListProps) {
  const steps = Children.toArray(children).filter(isStepElement);
  const total = steps.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: progressRef, size: progressSize } = useElementSize<HTMLDivElement>({
    settleMs: showProgress ? 250 : 0,
    layoutSettleKey: showProgress,
  });

  const parentScrollMarginTop = useGuideScrollMargin();
  const guideTopRef = useGuideTopRef();
  const guideContentRef = useGuideContentRef();

  const overviewScrollMarginTop = useMemo(
    () =>
      computeGuideOverviewScrollMarginTop({
        parentScrollMarginTop,
        additionalParentScrollMarginTop,
      }),
    [additionalParentScrollMarginTop, parentScrollMarginTop],
  );

  const stepScrollMarginTop = useMemo(
    () =>
      computeGuideStepScrollMarginTop({
        parentScrollMarginTop,
        additionalParentScrollMarginTop,
        progressBarHeight: progressSize?.height ?? 0,
        includeProgressBar: showProgress && total > 0,
      }),
    [
      additionalParentScrollMarginTop,
      parentScrollMarginTop,
      progressSize?.height,
      showProgress,
      total,
    ],
  );

  const progressBarStickyTop = overviewScrollMarginTop;

  useLayoutEffect(() => {
    const guideTop = guideTopRef?.current;
    if (guideTop == null) {
      return;
    }

    guideTop.style.scrollMarginTop = `${overviewScrollMarginTop}px`;
  }, [guideTopRef, overviewScrollMarginTop]);

  const stepNumbers = steps.map(
    (step, index) => step.props.number ?? index + 1,
  );

  const [completed, setCompleted] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(
      steps.map((step, index) => {
        const number = step.props.number ?? index + 1;
        return [
          number,
          Boolean(step.props.defaultCompleted ?? step.props.isCompleted),
        ];
      }),
    ),
  );

  const completedCount = Object.values(completed).filter(Boolean).length;

  useEffect(() => {
    onProgressChange?.({ completed: completedCount, total });
  }, [completedCount, total, onProgressChange]);

  useGuideStepUrlSync({
    enabled: syncStepUrl,
    rootRef,
    guideTopRef,
    guideContentRef,
    stepNumbers,
    mode: stepUrlMode,
    stepUrlKey,
    scrollMarginTop: stepScrollMarginTop,
    overviewScrollMarginTop,
    activeStepMinVisibleRatio,
    onActiveStepChange,
  });

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-8", className)}>
      {showProgress && total > 0 && (
        <div
          ref={progressRef}
          className="sticky z-10 mx-2"
          style={{ top: progressBarStickyTop }}
        >
          <Card className="w-full px-6 py-4">
            <ProgressBar
              value={completedCount}
              maxValue={total}
              aria-label="Guide progress"
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-sm text-default-500">
                <span>Guide Progress</span>
                <ProgressBar.Output>
                  {completedCount} / {total} steps
                </ProgressBar.Output>
              </div>
              <ProgressBar.Track className="h-2 overflow-hidden rounded-full bg-default-soft">
                <ProgressBar.Fill className="h-full rounded-full bg-success transition-[width]" />
              </ProgressBar.Track>
            </ProgressBar>
          </Card>
        </div>
      )}

      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const number = step.props.number ?? index + 1;
          const stepId = syncStepUrl ? guideStepUrlId(number) : step.props.id;

          return (
            <li key={step.key ?? number}>
              {cloneElement(step, {
                number,
                id: step.props.id ?? stepId,
                scrollMarginTop: syncStepUrl ? stepScrollMarginTop : undefined,
                isCompleted: completed[number] ?? false,
                onCompletedChange: (value: boolean) => {
                  setCompleted((prev) => ({ ...prev, [number]: value }));
                  step.props.onCompletedChange?.(value);
                },
              })}
              {index < steps.length - 1 && <Separator className="my-8" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
