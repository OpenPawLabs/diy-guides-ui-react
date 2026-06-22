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
import {
  type GuideSeverity,
  severityDotClass,
  severityLabel,
} from "../../types/severity";
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
  /** Step body — requires `GuideStep.Media` (≥1 image) and `GuideStep.Bullets` (≥1 bullet). */
  children?: ReactNode;
  className?: string;
}

/** Bullet presentation — `color` uses a severity dot; others use semantic icons and labels. */
export type GuideStepBulletVariant = "color" | "caution" | "reminder" | "note";

export interface GuideStepBulletProps {
  /**
   * Bullet style. `color` renders a severity-colored dot (link to `MediaFigure`
   * annotations); `caution`, `reminder`, and `note` render iFixit-style semantic bullets.
   * @default "color"
   */
  variant?: GuideStepBulletVariant;
  /** Marker tone for `color` bullets — match a related `MediaFigure` annotation. @default "note" */
  severity?: GuideSeverity;
  /** Override the auto-generated label for semantic bullet types. */
  label?: ReactNode;
  /** Hide the auto-generated label for `caution`, `reminder`, and `note` bullets. */
  hideLabel?: boolean;
  children: ReactNode;
  className?: string;
}

const bulletVariantLabel: Record<
  Exclude<GuideStepBulletVariant, "color">,
  string
> = {
  caution: severityLabel.caution,
  reminder: "Reminder",
  note: severityLabel.note,
};

function CautionIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0 text-danger"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0 text-default-500"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function ReminderIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded bg-default-100"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-3.5 text-default-500"
      >
        <path d="M16 12V4h1V3H7v1h1v8l-2 2v1h5.2c-.2.6-.3 1.2-.3 1.8 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.6-.1-1.2-.3-1.8H18v-1l-2-2z" />
      </svg>
    </span>
  );
}

function isMediaFigure(
  node: ReactNode,
): node is ReactElement<MediaFigureProps> {
  return isValidElement(node) && node.type === MediaFigure;
}

function isGuideStepBullet(
  node: ReactNode,
): node is ReactElement<GuideStepBulletProps> {
  return isValidElement(node) && node.type === GuideStepBullet;
}

function countBullets(bulletsNode: ReactNode): number {
  if (!isValidElement<{ children?: ReactNode }>(bulletsNode)) return 0;
  return Children.toArray(bulletsNode.props.children).filter(isGuideStepBullet)
    .length;
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
  const bulletCount = countBullets(bullets);

  if (import.meta.env.DEV) {
    if (figures.length === 0) {
      console.warn(
        "GuideStep requires at least one MediaFigure inside GuideStep.Media.",
      );
    }
    if (bulletCount === 0) {
      console.warn(
        "GuideStep requires at least one GuideStep.Bullet inside GuideStep.Bullets.",
      );
    }
    if (figures.length > MAX_STEP_IMAGES) {
      console.warn(
        `GuideStep.Media supports at most ${MAX_STEP_IMAGES} images; ${figures.length} provided.`,
      );
    }
  }

  return {
    figures: figures.slice(0, MAX_STEP_IMAGES),
    bullets,
  };
}

/** Slot for up to three `MediaFigure`s — parent renders main image + hover thumbnails. */
function GuideStepMedia({ children: _children }: { children?: ReactNode }) {
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

/** A single instruction line — color dots or semantic caution / reminder / note bullets. */
function GuideStepBullet({
  variant = "color",
  severity = "note",
  label,
  hideLabel = false,
  children,
  className,
}: GuideStepBulletProps) {
  if (variant === "color") {
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

  const resolvedLabel = label ?? bulletVariantLabel[variant];
  const icon =
    variant === "caution" ? (
      <CautionIcon />
    ) : variant === "reminder" ? (
      <ReminderIcon />
    ) : (
      <NoteIcon />
    );

  return (
    <li
      className={cn(
        "flex gap-2.5",
        variant === "caution" && "text-danger",
        className,
      )}
    >
      {icon}
      <span className="flex-1">
        {!hideLabel && (
          <>
            <span className="font-semibold">{resolvedLabel}:</span>{" "}
          </>
        )}
        {children}
      </span>
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
  const active = figures[activeIndex] ?? figures[0];

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
 * Requires at least one `MediaFigure` in `GuideStep.Media` and one `GuideStep.Bullet`
 * in `GuideStep.Bullets`. Up to three images share a hover thumbnail gallery.
 */
export const GuideStep = Object.assign(GuideStepRoot, {
  Media: GuideStepMedia,
  Bullets: GuideStepBullets,
  Bullet: GuideStepBullet,
});
