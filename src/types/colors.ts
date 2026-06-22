/**
 * Fixed palette for visually linking step bullet dots to image annotation markers.
 * Each name maps to a hex value applied directly via inline styles.
 */
export const COLORS = {
  GREY: "#41454E",
  RED: "#E7320D",
  ORANGE: "#FF850A",
  YELLOW: "#F5E429",
  GREEN: "#20E98B",
  LIGHT_BLUE: "#20B3E9",
  BLUE: "#1738DE",
  MAGENTA: "#D945B1",
} as const;

export type GuideColor = keyof typeof COLORS;

/** Convert a `#rrggbb` hex string to `rgba(r, g, b, alpha)`. */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Pick a readable foreground for a solid-color marker pin. */
export function markerTextColor(hex: string): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111111" : "#ffffff";
}
