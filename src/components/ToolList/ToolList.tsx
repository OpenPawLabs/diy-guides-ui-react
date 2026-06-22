import type { ReactNode } from "react";
import { Card, Link, cn } from "@heroui/react";

export interface ToolListProps {
  /** Section heading. Pass `null` to omit. @default "What you need" */
  title?: ReactNode;
  /** `ToolList.Item` children. */
  children: ReactNode;
  className?: string;
}

export interface ToolListItemProps {
  /** Tool or part name. */
  name: ReactNode;
  /** Optional thumbnail image URL. */
  thumbnail?: string;
  /** When set, the name links here (e.g. a store or info page). */
  href?: string;
  /** Quantity required, rendered as `×N`. */
  quantity?: number;
  /** Trailing price or cost note. */
  price?: ReactNode;
  /** Secondary detail line beneath the name. */
  children?: ReactNode;
  className?: string;
}

function ToolListItem({
  name,
  thumbnail,
  href,
  quantity,
  price,
  children,
  className,
}: ToolListItemProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 py-3 first:pt-0 last:pb-0",
        className,
      )}
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="size-12 shrink-0 rounded-md border border-default object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {href ? (
          <Link href={href} className="font-medium">
            {name}
          </Link>
        ) : (
          <span className="font-medium">{name}</span>
        )}
        {children != null && (
          <span className="text-sm text-default-500">{children}</span>
        )}
      </div>
      {quantity != null && (
        <span className="shrink-0 text-sm text-default-500">×{quantity}</span>
      )}
      {price != null && (
        <span className="shrink-0 text-sm font-medium">{price}</span>
      )}
    </li>
  );
}

function ToolListRoot({
  title = "What you need",
  children,
  className,
}: ToolListProps) {
  return (
    <Card className={cn("w-full", className)}>
      {title != null && (
        <Card.Header>
          <Card.Title>{title}</Card.Title>
        </Card.Header>
      )}
      <Card.Content>
        <ul className="flex flex-col divide-y divide-default">{children}</ul>
      </Card.Content>
    </Card>
  );
}

/**
 * The "What you need" panel for a guide: a titled card listing required tools
 * and parts. Compose rows with `ToolList.Item`.
 */
export const ToolList = Object.assign(ToolListRoot, { Item: ToolListItem });
