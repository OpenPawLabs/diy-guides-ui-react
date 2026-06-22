"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Card, ProgressBar, Separator, cn } from "@heroui/react";
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
  className,
}: GuideStepListProps) {
  const steps = Children.toArray(children).filter(isStepElement);
  const total = steps.length;

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

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {showProgress && total > 0 && (
        <div className="sticky top-2 mx-2 z-10">
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
          return (
            <li key={step.key ?? number}>
              {cloneElement(step, {
                number,
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
