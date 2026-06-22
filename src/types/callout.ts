import { COLORS, type GuideColor } from "./colors";

/**
 * Callout types express safety and informational tone for {@link Callout}.
 * Each type maps to a {@link GuideColor} accent from the shared palette.
 */
export type CalloutType = "note" | "info" | "tip" | "caution" | "danger";

/** Callout type → guide palette accent (drives border, background tint, and icon). */
export const calloutTypeColor: Record<CalloutType, GuideColor> = {
  note: "GREY",
  info: "LIGHT_BLUE",
  tip: "GREEN",
  caution: "ORANGE",
  danger: "RED",
};

/** Resolved hex accent for a callout type. */
export function calloutTypeHex(type: CalloutType): string {
  return COLORS[calloutTypeColor[type]];
}

/** Callout type → default human-readable title. */
export const calloutTypeLabel: Record<CalloutType, string> = {
  note: "Note",
  info: "Info",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};
