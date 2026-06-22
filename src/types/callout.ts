/**
 * Callout types express safety and informational tone for {@link Callout}.
 * They map onto HeroUI semantic colors — separate from {@link GuideColor},
 * which links step bullets to image annotation markers.
 */
export type CalloutType = "note" | "info" | "tip" | "caution" | "danger";

/** HeroUI semantic color names shared by `Alert` status and `Chip` color. */
export type HeroSemanticColor =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger";

/** Callout type → HeroUI semantic color (drives `Alert.status`, `Chip.color`, …). */
export const calloutTypeColor: Record<CalloutType, HeroSemanticColor> = {
  note: "default",
  info: "accent",
  tip: "success",
  caution: "warning",
  danger: "danger",
};

/** Callout type → default human-readable title. */
export const calloutTypeLabel: Record<CalloutType, string> = {
  note: "Note",
  info: "Info",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};
