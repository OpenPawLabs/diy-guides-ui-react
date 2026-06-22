import type { ReactNode } from "react";
import { Alert, cn } from "@heroui/react";
import {
  type CalloutType,
  calloutTypeHex,
  calloutTypeLabel,
} from "../../types/callout";
import { hexToRgba } from "../../types/colors";

export interface CalloutProps {
  /** Tone of the callout — controls color, default icon, and default title. @default "caution" */
  type?: CalloutType;
  /** Heading text. Pass `null` to omit. Defaults to the callout type label. */
  title?: ReactNode;
  /** Override the leading indicator icon. */
  icon?: ReactNode;
  /** Callout body. */
  children: ReactNode;
  className?: string;
}

const triangle = (
  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />
);

const circleInfo = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </>
);

const circleCheck = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </>
);

const calloutTypeGlyph: Record<CalloutType, ReactNode> = {
  note: circleInfo,
  info: circleInfo,
  tip: circleCheck,
  caution: triangle,
  danger: triangle,
};

function CalloutTypeIcon({ type }: { type: CalloutType }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {calloutTypeGlyph[type]}
    </svg>
  );
}

/**
 * Safety / informational callout for guides — battery, heat, ESD, and other
 * hazards. Wraps HeroUI `Alert`, mapping {@link CalloutType} to a guide
 * palette accent, default icon, and title so a single `type` prop styles the
 * whole box.
 */
export function Callout({
  type = "caution",
  title,
  icon,
  children,
  className,
}: CalloutProps) {
  const resolvedTitle = title === undefined ? calloutTypeLabel[type] : title;
  const accent = calloutTypeHex(type);

  return (
    <Alert
      className={cn("border", className)}
      style={{
        backgroundColor: hexToRgba(accent, 0.1),
        borderColor: accent,
      }}
    >
      <Alert.Indicator style={{ color: accent }}>
        {icon ?? <CalloutTypeIcon type={type} />}
      </Alert.Indicator>
      <Alert.Content>
        {resolvedTitle != null && <Alert.Title>{resolvedTitle}</Alert.Title>}
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
