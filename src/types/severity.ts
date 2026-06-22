/**
 * Severity is the shared design token that gives DIY-guide components a single,
 * consistent vocabulary for tone — used by step bullets, image annotations, and
 * safety callouts. Each level maps 1:1 onto a HeroUI semantic color so the whole
 * system stays visually coherent.
 */
export type GuideSeverity = "note" | "info" | "tip" | "caution" | "danger";

/** HeroUI semantic color names shared by `Alert` status and `Chip` color. */
export type HeroSemanticColor =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger";

/** Severity → HeroUI semantic color (drives `Alert.status`, `Chip.color`, …). */
export const severityColor: Record<GuideSeverity, HeroSemanticColor> = {
  note: "default",
  info: "accent",
  tip: "success",
  caution: "warning",
  danger: "danger",
};

/** Severity → Tailwind background utility for a small, text-less bullet dot. */
export const severityDotClass: Record<GuideSeverity, string> = {
  note: "bg-foreground",
  info: "bg-accent",
  tip: "bg-success",
  caution: "bg-warning",
  danger: "bg-danger",
};

/** Severity → background + contrasting foreground for a labeled marker pin. */
export const severityMarkerClass: Record<GuideSeverity, string> = {
  note: "bg-foreground text-background",
  info: "bg-accent text-accent-foreground",
  tip: "bg-success text-success-foreground",
  caution: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
};

/** Severity → default human-readable label (callout titles, a11y text, …). */
export const severityLabel: Record<GuideSeverity, string> = {
  note: "Note",
  info: "Info",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};
