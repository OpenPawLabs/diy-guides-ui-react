"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button, Checkbox, cn } from "@heroui/react";
import { useControlledState } from "../../hooks/useControlledState";
import { calloutTypeLabel } from "../../types/callout";
import { COLORS, type GuideColor } from "../../types/colors";
import {
  MediaFigure,
  MediaFigureThumbnail,
  type MediaFigureProps,
} from "../MediaFigure";

const MAX_STEP_IMAGES = 3;

/** Completed mark-complete button — softer than `COLORS.GREEN`, still readable with white text. */
const COMPLETE_BUTTON_BG = "#3ABF84";
const COMPLETE_BUTTON_BG_HOVER = "#34B07A";
/** Dark green accent for the checkbox control when a step is marked complete. */
const COMPLETE_CHECKBOX_GREEN = "#0B7A47";

/**
 * Optional, editor-only media affordances. Presence switches `GuideStep.Media`
 * into edit mode: an empty-state add target, an "Edit annotations" / "Adjust crop"
 * overlay on the main image, a remove control per thumbnail, a "+" tile to append,
 * and (with `onReorderImage`) drag-to-reorder thumbnails. All members are intent
 * callbacks — the library performs no file or menu logic. Omit entirely for the
 * read-only reader experience.
 */
export interface GuideStepMediaEditing {
  /** Append a new image (e.g. open a file picker). Drives the empty target and "+" tile. */
  onAddImage?: () => void;
  /** Edit annotations for the image at `index` (fired from the main image overlay). */
  onEditAnnotations?: (index: number) => void;
  /**
   * Adjust the crop / display region for the image at `index`. When set, an
   * "Adjust crop" action appears in the main image overlay beside "Edit annotations".
   */
  onEditCrop?: (index: number) => void;
  /** Remove the image at `index` (fired by a thumbnail's remove control). */
  onRemoveImage?: (index: number) => void;
  /**
   * Move the image from `from` to `to`. When set, edit-mode thumbnails become
   * drag-reorderable (the library only reports the move; the consumer reorders).
   */
  onReorderImage?: (from: number, to: number) => void;
  /** Selection changed to `index` (in edit mode thumbnails select on click). */
  onSelectImage?: (index: number) => void;
  /** Controlled active image index. */
  activeIndex?: number;
  /** Show the "+" add tile while below the three-image limit. @default true */
  canAddImage?: boolean;
}

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
  /**
   * Editor-only media affordances. When provided, the media area becomes
   * editable (add / annotate / remove / select). Leave undefined for readers.
   */
  mediaEditing?: GuideStepMediaEditing;
  /** Step body — requires `GuideStep.Media` (≥1 image) and `GuideStep.Bullets` (≥1 bullet). */
  children?: ReactNode;
  className?: string;
}

/**
 * Bullet presentation — `dot` uses a colored dot; `caution` / `reminder` / `note`
 * use semantic icons and labels; `button` renders its children (e.g. a `LinkButton`)
 * as a standalone action with no marker.
 */
export type GuideStepBulletVariant =
  | "dot"
  | "caution"
  | "reminder"
  | "note"
  | "button";

/**
 * Optional, editor-only affordances for the bullet list. Passing `editing` to
 * `GuideStep.Bullets` adds a drag handle to reorder bullets, a remove control per
 * bullet, and a "+ New bullet" button. Every member is an intent callback — the
 * library performs no data mutation. Omit entirely for the read-only reader experience.
 */
export interface GuideStepBulletsEditing {
  /** Append a new bullet. Drives the "+ New bullet" button. */
  onAddBullet?: () => void;
  /** Remove the bullet at `index`. Hidden while only one bullet remains. */
  onRemoveBullet?: (index: number) => void;
  /** Move the bullet from `from` to `to`. When set (and >1 bullet), bullets gain a drag handle. */
  onReorderBullet?: (from: number, to: number) => void;
}

/** Internal per-bullet editing descriptor injected by `GuideStep.Bullets` via cloneElement. */
interface BulletEditDescriptor {
  canReorder: boolean;
  isDragging: boolean;
  isOver: boolean;
  onRemove?: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export interface GuideStepBulletProps {
  /**
   * Bullet style. `dot` renders a colored dot (link to `MediaFigure`
   * annotations); `caution`, `reminder`, and `note` render iFixit-style semantic bullets;
   * `button` renders its children (typically a `LinkButton`) with no marker.
   * @default "dot"
   */
  variant?: GuideStepBulletVariant;
  /** Marker color for `dot` bullets — match a related `MediaFigure` annotation. @default "GREY" */
  color?: GuideColor;
  /** Override the auto-generated label for semantic bullet types. */
  label?: ReactNode;
  /** Hide the auto-generated label for `caution`, `reminder`, and `note` bullets. */
  hideLabel?: boolean;
  /**
   * Editor-only: when set, the marker (dot or semantic icon) renders as a button
   * that fires this on press — e.g. to open a color / variant picker. Omit for readers.
   */
  onMarkerPress?: () => void;
  /** Accessible label for the marker button when `onMarkerPress` is set. */
  markerAriaLabel?: string;
  children: ReactNode;
  className?: string;
}

const bulletVariantLabel: Record<
  Exclude<GuideStepBulletVariant, "dot" | "button">,
  string
> = {
  caution: calloutTypeLabel.caution,
  reminder: "Reminder",
  note: calloutTypeLabel.note,
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

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CropIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-3.5"
    >
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  );
}

function isMediaFigure(
  node: ReactNode,
): node is ReactElement<MediaFigureProps> {
  return isValidElement(node) && node.type === MediaFigure;
}

function isGuideStepBullet(
  node: ReactNode,
): node is ReactElement<GuideStepBulletProps & { __edit?: BulletEditDescriptor }> {
  return isValidElement(node) && node.type === GuideStepBullet;
}

function countBullets(bulletsNode: ReactNode): number {
  if (!isValidElement<{ children?: ReactNode }>(bulletsNode)) return 0;
  return Children.toArray(bulletsNode.props.children).filter(isGuideStepBullet)
    .length;
}

function extractStepParts(children: ReactNode, allowEmptyMedia = false) {
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
    if (figures.length === 0 && !allowEmptyMedia) {
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
function GuideStepMedia(_props: { children?: ReactNode }) {
  return null;
}

/** Ordered container for `GuideStep.Bullet`s. */
function GuideStepBullets({
  children,
  className,
  editing,
}: {
  children: ReactNode;
  className?: string;
  /** Editor-only affordances; presence enables reorder / remove / add. Omit for readers. */
  editing?: GuideStepBulletsEditing;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (!editing) {
    return <ul className={cn("flex flex-col gap-2", className)}>{children}</ul>;
  }

  const { onAddBullet, onRemoveBullet, onReorderBullet } = editing;
  const bullets = Children.toArray(children).filter(isGuideStepBullet);
  const canReorder = onReorderBullet != null && bullets.length > 1;
  const canRemove = onRemoveBullet != null && bullets.length > 1;

  const endReorder = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const dropOnto = (index: number) => {
    if (dragIndex != null && dragIndex !== index) {
      onReorderBullet?.(dragIndex, index);
    }
    endReorder();
  };

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {bullets.map((bullet, index) =>
        cloneElement(bullet, {
          key: bullet.key ?? index,
          __edit: {
            canReorder,
            isDragging: dragIndex === index,
            isOver: overIndex === index && dragIndex !== index,
            onRemove: canRemove ? () => onRemoveBullet?.(index) : undefined,
            onDragStart: () => setDragIndex(index),
            onDragOver: () => setOverIndex(index),
            onDrop: () => dropOnto(index),
            onDragEnd: endReorder,
          },
        }),
      )}
      {onAddBullet && (
        <li className="list-none">
          <button
            type="button"
            onClick={onAddBullet}
            className="rounded-md px-1 py-0.5 text-sm font-medium text-default-500 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            + New bullet
          </button>
        </li>
      )}
    </ul>
  );
}

/** A single instruction line — dot bullets or semantic caution / reminder / note bullets. */
function GuideStepBullet(props: GuideStepBulletProps) {
  const {
    variant = "dot",
    color = "GREY",
    label,
    hideLabel = false,
    onMarkerPress,
    markerAriaLabel,
    children,
    className,
  } = props;
  const edit = (props as { __edit?: BulletEditDescriptor }).__edit;
  const [grabbing, setGrabbing] = useState(false);

  let marker: ReactNode = null;
  let body: ReactNode;

  if (variant === "dot") {
    marker = onMarkerPress ? (
      <button
        type="button"
        onClick={onMarkerPress}
        aria-label={markerAriaLabel ?? "Change bullet style"}
        className="mt-1.5 size-2 shrink-0 cursor-pointer rounded-full outline-none transition hover:ring-2 hover:ring-accent focus-visible:ring-2 focus-visible:ring-accent"
        style={{ backgroundColor: COLORS[color] }}
      />
    ) : (
      <span
        aria-hidden="true"
        className="mt-1.5 size-2 shrink-0 rounded-full"
        style={{ backgroundColor: COLORS[color] }}
      />
    );
    body = <span className="flex-1">{children}</span>;
  } else if (variant === "button") {
    marker = onMarkerPress ? (
      <button
        type="button"
        onClick={onMarkerPress}
        aria-label={markerAriaLabel ?? "Change bullet style"}
        className="size-2 shrink-0 cursor-pointer rounded-full bg-default-300 outline-none transition hover:ring-2 hover:ring-accent focus-visible:ring-2 focus-visible:ring-accent"
      />
    ) : null;
    body = <div className="min-w-0 flex-1">{children}</div>;
  } else {
    const resolvedLabel = label ?? bulletVariantLabel[variant];
    const icon =
      variant === "caution" ? (
        <CautionIcon />
      ) : variant === "reminder" ? (
        <ReminderIcon />
      ) : (
        <NoteIcon />
      );
    marker = onMarkerPress ? (
      <button
        type="button"
        onClick={onMarkerPress}
        aria-label={markerAriaLabel ?? "Change bullet style"}
        className="shrink-0 cursor-pointer rounded outline-none transition hover:opacity-70 focus-visible:ring-2 focus-visible:ring-accent"
      >
        {icon}
      </button>
    ) : (
      icon
    );
    body = (
      <span className="flex-1">
        {!hideLabel && (
          <>
            <span className="font-semibold">{resolvedLabel}:</span>{" "}
          </>
        )}
        {children}
      </span>
    );
  }

  const liClassName = cn(
    "flex gap-2.5",
    variant === "button" && "items-center",
    variant === "caution" && "text-danger",
    className,
  );

  if (!edit) {
    return (
      <li className={liClassName}>
        {marker}
        {body}
      </li>
    );
  }

  const { canReorder, isDragging, isOver, onRemove } = edit;

  return (
    <li
      className={cn(
        "group rounded-md",
        liClassName,
        isDragging && "opacity-40",
        isOver && "ring-2 ring-accent",
      )}
      draggable={canReorder && grabbing ? true : undefined}
      onDragStart={
        canReorder
          ? (event) => {
              event.dataTransfer.effectAllowed = "move";
              edit.onDragStart();
            }
          : undefined
      }
      onDragOver={
        canReorder
          ? (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              edit.onDragOver();
            }
          : undefined
      }
      onDrop={
        canReorder
          ? (event) => {
              event.preventDefault();
              edit.onDrop();
            }
          : undefined
      }
      onDragEnd={
        canReorder
          ? () => {
              setGrabbing(false);
              edit.onDragEnd();
            }
          : undefined
      }
    >
      {canReorder && (
        <span
          aria-hidden="true"
          onPointerDown={() => setGrabbing(true)}
          onPointerUp={() => setGrabbing(false)}
          className="mt-1 shrink-0 cursor-grab text-default-400 transition hover:text-default-500"
        >
          <GripIcon />
        </span>
      )}
      {marker}
      {body}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove bullet"
          className="mt-1 shrink-0 rounded p-0.5 text-default-400 opacity-0 transition hover:text-danger focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100"
        >
          <RemoveIcon />
        </button>
      )}
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
  mediaEditing,
}: {
  figures: ReactElement<MediaFigureProps>[];
  bullets: ReactNode;
  mediaEditing?: GuideStepMediaEditing;
}) {
  const editing = mediaEditing != null;
  const [internalActive, setInternalActive] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const activeIndex = mediaEditing?.activeIndex ?? internalActive;
  const active = figures[activeIndex] ?? figures[0];

  const setActive = (index: number) => {
    setInternalActive(index);
    mediaEditing?.onSelectImage?.(index);
  };

  const canReorder =
    editing && mediaEditing?.onReorderImage != null && figures.length > 1;

  const endReorder = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const dropOnto = (index: number) => {
    if (dragIndex != null && dragIndex !== index) {
      mediaEditing?.onReorderImage?.(dragIndex, index);
    }
    endReorder();
  };

  const canAdd =
    editing &&
    (mediaEditing?.canAddImage ?? true) &&
    figures.length >= 1 &&
    figures.length < MAX_STEP_IMAGES;
  const showThumbs = editing ? figures.length >= 1 : figures.length > 1;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="min-w-0">
        {active ? (
          editing ? (
            <div className="group relative">
              {cloneElement(active, {
                className: cn("w-full", active.props.className),
                zoomable: false,
              })}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg opacity-0 transition group-hover:bg-foreground/40 group-hover:opacity-100 focus-within:bg-foreground/40 focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => mediaEditing?.onEditAnnotations?.(activeIndex)}
                  className="flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-sm font-semibold text-foreground shadow transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <PencilIcon />
                  Edit annotations
                </button>
                {mediaEditing?.onEditCrop && (
                  <button
                    type="button"
                    onClick={() => mediaEditing?.onEditCrop?.(activeIndex)}
                    className="flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-sm font-semibold text-foreground shadow transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <CropIcon />
                    Adjust crop
                  </button>
                )}
              </div>
            </div>
          ) : (
            cloneElement(active, {
              className: cn("w-full", active.props.className),
            })
          )
        ) : (
          editing && (
            <button
              type="button"
              onClick={() => mediaEditing?.onAddImage?.()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-default bg-default-soft text-default-500 transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none"
            >
              <UploadIcon />
              <span className="text-sm font-medium">Add image</span>
            </button>
          )
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {(showThumbs || canAdd) && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Step images"
          >
            {figures.map((figure, index) =>
              editing ? (
                <div
                  key={figure.key ?? figure.props.src ?? index}
                  className={cn(
                    "relative rounded-md transition-shadow",
                    canReorder && "cursor-grab",
                    dragIndex === index && "opacity-40",
                    overIndex === index &&
                      dragIndex !== index &&
                      "ring-2 ring-accent ring-offset-2 ring-offset-background",
                  )}
                  draggable={canReorder || undefined}
                  onDragStart={
                    canReorder
                      ? (event) => {
                          event.dataTransfer.effectAllowed = "move";
                          setDragIndex(index);
                        }
                      : undefined
                  }
                  onDragOver={
                    canReorder
                      ? (event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          setOverIndex(index);
                        }
                      : undefined
                  }
                  onDrop={
                    canReorder
                      ? (event) => {
                          event.preventDefault();
                          dropOnto(index);
                        }
                      : undefined
                  }
                  onDragEnd={canReorder ? endReorder : undefined}
                >
                  <button
                    type="button"
                    className={cn(
                      "block overflow-hidden rounded-md border-2 transition-[box-shadow,opacity,border-color]",
                      index === activeIndex
                        ? "border-accent shadow-md"
                        : "border-default opacity-80 hover:opacity-100",
                    )}
                    onClick={() => setActive(index)}
                    aria-label={`Image ${index + 1}`}
                    aria-pressed={index === activeIndex}
                  >
                    <MediaFigureThumbnail
                      src={figure.props.src}
                      type={figure.props.type}
                      className="size-16 sm:size-20"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => mediaEditing?.onRemoveImage?.(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow transition hover:bg-danger focus-visible:bg-danger focus-visible:outline-none"
                  >
                    <RemoveIcon />
                  </button>
                </div>
              ) : (
                <button
                  key={figure.key ?? figure.props.src ?? index}
                  type="button"
                  className={cn(
                    "overflow-hidden rounded-md border-2 transition-[box-shadow,opacity,border-color]",
                    index === activeIndex
                      ? "border-accent shadow-md"
                      : "border-default opacity-80 hover:opacity-100",
                  )}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-label={`Image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                >
                  <MediaFigureThumbnail
                    src={figure.props.src}
                    type={figure.props.type}
                    className="size-16 sm:size-20"
                  />
                </button>
              ),
            )}
            {canAdd && (
              <button
                type="button"
                onClick={() => mediaEditing?.onAddImage?.()}
                aria-label="Add image"
                className="flex size-16 items-center justify-center rounded-md border-2 border-dashed border-default text-default-500 transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none sm:size-20"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
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
  mediaEditing,
  children,
  className,
}: GuideStepProps) {
  const [completed, setCompleted] = useControlledState(
    isCompleted,
    defaultCompleted,
    onCompletedChange,
  );
  const titleId = useId();
  const { figures, bullets } = extractStepParts(children, mediaEditing != null);

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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3 sm:flex-1">
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
            <h3
              id={titleId}
              className="min-w-0 flex-1 text-lg font-semibold leading-tight"
            >
              {title}
            </h3>
          )}
        </div>
        {completable && (
          <Button
            variant={completed ? "primary" : "secondary"}
            size="lg"
            onPress={() => setCompleted(!completed)}
            aria-pressed={completed}
            className={cn(
              "ml-auto shrink-0",
              completed && "guide-step-complete-button",
            )}
            style={
              completed
                ? ({
                    "--guide-step-complete-bg": COMPLETE_BUTTON_BG,
                    "--guide-step-complete-bg-hover": COMPLETE_BUTTON_BG_HOVER,
                    "--guide-step-complete-checkbox": COMPLETE_CHECKBOX_GREEN,
                  } as CSSProperties)
                : undefined
            }
          >
            <Checkbox
              isSelected={completed}
              isReadOnly
              aria-hidden
              className="pointer-events-none gap-2 text-inherit"
            >
              <Checkbox.Content className="flex items-center gap-2 whitespace-nowrap">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                Mark complete
              </Checkbox.Content>
            </Checkbox>
          </Button>
        )}
      </header>

      <GuideStepBody
        figures={figures}
        bullets={bullets}
        mediaEditing={mediaEditing}
      />
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
