"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Checkbox, cn } from "@heroui/react";
import { useControlledState } from "../../hooks/useControlledState";
import { type GuideSeverity, severityDotClass } from "../../types/severity";
import { MediaFigure, type MediaFigureProps } from "../MediaFigure";

const MAX_STEP_IMAGES = 3;

export interface GuideStepProps {
  /** Step number shown in the badge. Auto-assigned when inside `GuideStepList`. */
  number?: number;
  /** Step heading. */
  title?: ReactNode;
  /** Controlled completion state. */
  isCompleted?: boolean;
  /** Initial completion state when uncontrolled. @default false */
  defaultCompleted?: boolean;
  /** Fires whenever completion changes (controlled or not). */
  onCompletedChange?: (completed: boolean) => void;
  /** Render the "mark complete" checkbox. @default true */
  completable?: boolean;
  /** Step body — compose with `GuideStep.Media` and `GuideStep.Bullets`. */
  children?: ReactNode;
  className?: string;
}

export interface GuideStepBulletProps {
  /** Marker tone — match a related `MediaFigure` annotation to link them. @default "note" */
  severity?: GuideSeverity;
  children: ReactNode;
  className?: string;
}

function isMediaFigure(
  node: ReactNode,
): node is ReactElement<MediaFigureProps> {
  return isValidElement(node) && node.type === MediaFigure;
}

function extractStepParts(children: ReactNode) {
  let mediaChildren: ReactNode = null;
  let bullets: ReactNode = null;

  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue;
    if (child.type === GuideStepMedia) {
      mediaChildren = child.props.children;
    }
    if (child.type === GuideStepBullets) {
      bullets = child;
    }
  }

  const figures = Children.toArray(mediaChildren).filter(isMediaFigure);

  if (import.meta.env.DEV && figures.length > MAX_STEP_IMAGES) {
    console.warn(
      `GuideStep.Media supports at most ${MAX_STEP_IMAGES} images; ${figures.length} provided.`,
    );
  }

  return {
    figures: figures.slice(0, MAX_STEP_IMAGES),
    bullets,
  };
}

/** Slot for up to three `MediaFigure`s — parent renders main image + hover thumbnails. */
function GuideStepMedia() {
  return null;
}

/** Ordered container for `GuideStep.Bullet`s. */
function GuideStepBullets({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>{children}</ul>
  );
}

/** A single instruction line with a severity-colored marker dot. */
function GuideStepBullet({
  severity = "note",
  children,
  className,
}: GuideStepBulletProps) {
  return (
    <li className={cn("flex gap-2.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          severityDotClass[severity],
        )}
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function StepCheck() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}

function GuideStepBody({
  figures,
  bullets,
}: {
  figures: ReactElement<MediaFigureProps>[];
  bullets: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMedia = figures.length > 0;
  const hasBullets = bullets != null;
  const active = figures[activeIndex] ?? figures[0];

  if (!hasMedia && !hasBullets) return null;

  if (!hasMedia) {
    return <div className="min-w-0">{bullets}</div>;
  }

  if (!hasBullets) {
    return (
      <div className="min-w-0">
        {cloneElement(figures[0], {
          className: cn("w-full", figures[0].props.className),
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="min-w-0">
        {active &&
          cloneElement(active, {
            className: cn("w-full", active.props.className),
            caption: undefined,
          })}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {figures.length > 1 && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Step images"
          >
            {figures.map((figure, index) => (
              <button
                key={figure.key ?? figure.props.src ?? index}
                type="button"
                className={cn(
                  "overflow-hidden rounded-md border-2 transition-[box-shadow,opacity,border-color]",
                  index === activeIndex
                    ? "border-accent shadow-md"
                    : "border-default opacity-80 hover:opacity-100",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                aria-label={figure.props.alt}
                aria-pressed={index === activeIndex}
              >
                <img
                  src={figure.props.src}
                  alt=""
                  className="size-16 object-cover sm:size-20"
                />
              </button>
            ))}
          </div>
        )}
        {bullets}
      </div>
    </div>
  );
}

function GuideStepRoot({
  number,
  title,
  isCompleted,
  defaultCompleted = false,
  onCompletedChange,
  completable = true,
  children,
  className,
}: GuideStepProps) {
  const [completed, setCompleted] = useControlledState(
    isCompleted,
    defaultCompleted,
    onCompletedChange,
  );
  const titleId = useId();
  const { figures, bullets } = extractStepParts(children);

  return (
    <section
      aria-labelledby={title != null ? titleId : undefined}
      data-completed={completed || undefined}
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        completed && "opacity-60",
        className,
      )}
    >
      <header className="flex items-center gap-3">
        {number != null && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-bold tabular-nums",
              completed
                ? "bg-success text-success-foreground"
                : "bg-foreground text-background",
            )}
          >
            {completed ? <StepCheck /> : number}
          </span>
        )}
        {title != null && (
          <h3 id={titleId} className="flex-1 text-lg font-semibold">
            {title}
          </h3>
        )}
        {completable && (
          <Checkbox
            isSelected={completed}
            onChange={setCompleted}
            className="ml-auto shrink-0 text-sm text-default-500"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>Mark complete</Checkbox.Content>
          </Checkbox>
        )}
      </header>

      <GuideStepBody figures={figures} bullets={bullets} />
    </section>
  );
}

/**
 * A single numbered guide step: header with number badge and optional completion
 * checkbox, plus a two-column body (main image left, thumbnails + bullets right).
 * Up to three `MediaFigure`s in `GuideStep.Media` share a hover thumbnail gallery.
 */
export const GuideStep = Object.assign(GuideStepRoot, {
  Media: GuideStepMedia,
  Bullets: GuideStepBullets,
  Bullet: GuideStepBullet,
});
