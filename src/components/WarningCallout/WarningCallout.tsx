import type { ReactNode } from "react";
import { Alert } from "@heroui/react";
import {
  type GuideSeverity,
  severityColor,
  severityLabel,
} from "../../types/severity";

export interface WarningCalloutProps {
  /** Tone of the callout — controls color, default icon, and default title. @default "caution" */
  severity?: GuideSeverity;
  /** Heading text. Pass `null` to omit. Defaults to the severity label. */
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

const severityGlyph: Record<GuideSeverity, ReactNode> = {
  note: circleInfo,
  info: circleInfo,
  tip: circleCheck,
  caution: triangle,
  danger: triangle,
};

function SeverityIcon({ severity }: { severity: GuideSeverity }) {
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
      {severityGlyph[severity]}
    </svg>
  );
}

/**
 * Safety / informational callout for guides — battery, heat, ESD, and other
 * hazards. Wraps HeroUI `Alert`, mapping {@link GuideSeverity} to the matching
 * status, default icon, and title so a single `severity` prop styles the whole box.
 */
export function WarningCallout({
  severity = "caution",
  title,
  icon,
  children,
  className,
}: WarningCalloutProps) {
  const resolvedTitle = title === undefined ? severityLabel[severity] : title;

  return (
    <Alert status={severityColor[severity]} className={className}>
      <Alert.Indicator>{icon ?? <SeverityIcon severity={severity} />}</Alert.Indicator>
      <Alert.Content>
        {resolvedTitle != null && <Alert.Title>{resolvedTitle}</Alert.Title>}
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
