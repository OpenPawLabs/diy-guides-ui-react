"use client";

import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Dropdown,
  Link,
  buttonGroupVariants,
  buttonVariants,
  cn,
  type ButtonVariants,
} from "@heroui/react";

/** HeroUI button look applied to the button. @default "primary" */
export type LinkButtonVariant = NonNullable<ButtonVariants["variant"]>;
/** HeroUI button size. @default "md" */
export type LinkButtonSize = NonNullable<ButtonVariants["size"]>;

export interface LinkButtonItemProps {
  /** Destination — a URL to navigate to, or a (relative) file path to download. */
  href: string;
  /** Download instead of navigate. `true` keeps the file name; a string renames it. */
  download?: boolean | string;
  /** Open in a new tab (sets `target="_blank"` + safe `rel`). */
  external?: boolean;
  /** The visible label. Kept as children so editors can edit it in place. */
  children: ReactNode;
}

/**
 * Optional, editor-only affordances. Presence switches `LinkButton` into edit
 * mode: the primary action stops navigating, its label becomes editable in place,
 * and a chevron reveals an options panel for managing the other links. Every
 * member is an intent callback — the library performs no file or menu logic.
 * Omit entirely for the read-only reader experience.
 */
export interface LinkButtonEditing {
  /** Append a new option (e.g. seed a blank link). Drives the "Add option" control. */
  onAddItem?: () => void;
  /** Remove the option at `index`. */
  onRemoveItem?: (index: number) => void;
  /** Move the option from `from` to `to` (drag-reorder + "make default"). */
  onReorderItem?: (from: number, to: number) => void;
  /** Edit the option at `index` — e.g. open a link / upload picker for its href. */
  onSelectItem?: (index: number) => void;
}

export interface LinkButtonProps {
  /** HeroUI button variant for theming. @default "primary" */
  variant?: LinkButtonVariant;
  /** HeroUI button size. @default "md" */
  size?: LinkButtonSize;
  /** Optional leading icon on the primary action. */
  icon?: ReactNode;
  /** Accessible label for the dropdown trigger. @default "More download options" */
  menuLabel?: string;
  /** Opt-in editor affordances; presence enables edit mode. Omit for readers. */
  editing?: LinkButtonEditing;
  /** `LinkButton.Item` children — the first is the primary action, the rest fill the menu. */
  children: ReactNode;
  className?: string;
}

/** Data-only carrier; `LinkButton` reads its props and places the label itself. */
function LinkButtonItem(_props: LinkButtonItemProps): null {
  return null;
}

function isItem(node: ReactNode): node is ReactElement<LinkButtonItemProps> {
  return isValidElement(node) && node.type === LinkButtonItem;
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LinkIcon() {
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
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function PromoteIcon() {
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
      <path d="M12 19V5M5 12l7-7 7 7" />
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
      className="size-3.5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
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

function linkAttrs(item: ReactElement<LinkButtonItemProps>) {
  const { href, download, external } = item.props;
  return {
    href,
    download,
    ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
  };
}

/** Thin centered divider between the primary action and the dropdown trigger. */
function SplitDivider() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none z-10 my-auto h-5 w-px self-center rounded-full bg-current opacity-25"
    />
  );
}

function LinkButtonRoot({
  variant = "primary",
  size = "md",
  icon,
  menuLabel = "More download options",
  editing,
  children,
  className,
}: LinkButtonProps) {
  const items = Children.toArray(children).filter(isItem);

  if (editing) {
    return (
      <LinkButtonEditor
        items={items}
        variant={variant}
        size={size}
        icon={icon}
        menuLabel={menuLabel}
        editing={editing}
        className={className}
      />
    );
  }

  if (items.length === 0) {
    if (import.meta.env.DEV) {
      console.warn("LinkButton requires at least one LinkButton.Item.");
    }
    return null;
  }

  const [primary, ...rest] = items;
  const primaryClass = buttonVariants({ variant, size });

  if (rest.length === 0) {
    return (
      <Link {...linkAttrs(primary)} className={cn(primaryClass, className)}>
        {icon}
        {primary.props.children}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        buttonGroupVariants({ orientation: "horizontal" }).base(),
        className,
      )}
    >
      <Link {...linkAttrs(primary)} className={primaryClass}>
        {icon}
        {primary.props.children}
      </Link>
      <SplitDivider />
      <Dropdown>
        <Dropdown.Trigger
          aria-label={menuLabel}
          className={buttonVariants({ variant, size, isIconOnly: true })}
        >
          <ChevronDownIcon />
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu>
            {rest.map((item, index) => (
              <Dropdown.Item key={index} {...linkAttrs(item)}>
                {item.props.children}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}

interface LinkButtonEditorProps {
  items: ReactElement<LinkButtonItemProps>[];
  variant: LinkButtonVariant;
  size: LinkButtonSize;
  icon?: ReactNode;
  menuLabel: string;
  editing: LinkButtonEditing;
  className?: string;
}

function LinkButtonEditor({
  items,
  variant,
  size,
  icon,
  menuLabel,
  editing,
  className,
}: LinkButtonEditorProps) {
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const { onAddItem, onRemoveItem, onReorderItem, onSelectItem } = editing;

  const primary = items[0];
  const secondary = items.slice(1);
  const primaryClass = buttonVariants({ variant, size });
  const canReorder = onReorderItem != null;

  const endReorder = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const dropOnto = (index: number) => {
    if (dragIndex != null && dragIndex !== index) {
      onReorderItem?.(dragIndex, index);
    }
    endReorder();
  };

  return (
    <div className={cn("relative inline-flex flex-col items-start", className)}>
      <div className={buttonGroupVariants({ orientation: "horizontal" }).base()}>
        <span className={cn(primaryClass, "cursor-text")}>
          {icon}
          {primary ? (
            primary.props.children
          ) : (
            <span className="opacity-60">Add a link</span>
          )}
        </span>
        {primary && onSelectItem && (
          <button
            type="button"
            onClick={() => onSelectItem(0)}
            aria-label="Edit primary link"
            className={cn(
              buttonVariants({ variant, size, isIconOnly: true }),
              "relative",
            )}
          >
            <SplitDivider />
            <LinkIcon />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={menuLabel}
          aria-expanded={open}
          className={cn(
            buttonVariants({ variant, size, isIconOnly: true }),
            "relative",
          )}
        >
          {!(primary && onSelectItem) && <SplitDivider />}
          <ChevronDownIcon />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-default-200 bg-background p-2 shadow-lg">
            {secondary.length > 0 ? (
              <ul className="flex flex-col gap-0.5">
                {secondary.map((item, offset) => {
                  const index = offset + 1;
                  return (
                    <li
                      key={index}
                      draggable={canReorder || undefined}
                      onDragStart={
                        canReorder ? () => setDragIndex(index) : undefined
                      }
                      onDragOver={
                        canReorder
                          ? (event) => {
                              event.preventDefault();
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
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition",
                        canReorder && "cursor-grab",
                        dragIndex === index && "opacity-40",
                        overIndex === index &&
                          dragIndex !== index &&
                          "ring-2 ring-accent",
                      )}
                    >
                      {canReorder && (
                        <span className="shrink-0 text-default-400">
                          <GripIcon />
                        </span>
                      )}
                      <span className="min-w-0 flex-1 text-sm">
                        {item.props.children}
                      </span>
                      {onReorderItem && (
                        <button
                          type="button"
                          onClick={() => onReorderItem(index, 0)}
                          aria-label="Make default download"
                          className="shrink-0 rounded p-0.5 text-default-500 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <PromoteIcon />
                        </button>
                      )}
                      {onSelectItem && (
                        <button
                          type="button"
                          onClick={() => onSelectItem(index)}
                          aria-label="Edit link"
                          className="shrink-0 rounded p-0.5 text-default-500 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <LinkIcon />
                        </button>
                      )}
                      {onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          aria-label="Remove option"
                          className="shrink-0 rounded p-0.5 text-default-500 transition hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <RemoveIcon />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-1.5 py-1 text-sm text-default-500">
                No other options yet.
              </p>
            )}

            {onAddItem && (
              <button
                type="button"
                onClick={onAddItem}
                className="mt-1 w-full rounded-md px-1.5 py-1 text-left text-sm font-medium text-accent transition hover:bg-default-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                + Add option
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * A download / navigation button with an optional dropdown of alternatives. With a
 * single `LinkButton.Item` it renders one button that links or downloads; with more,
 * it becomes a split button — the first item is the primary action and the rest sit
 * behind a chevron. Provide `editing` to drive it from an authoring tool without
 * changing the reader output.
 */
export const LinkButton = Object.assign(LinkButtonRoot, { Item: LinkButtonItem });
