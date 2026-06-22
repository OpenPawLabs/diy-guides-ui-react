import type { ReactNode } from "react";
import { Chip, cn } from "@heroui/react";
import { COLORS, hexToRgba, type GuideColor } from "../../types/colors";

/** Relative effort required to complete a guide. */
export type Difficulty = "easy" | "moderate" | "difficult";

const difficultyColor: Record<Difficulty, GuideColor> = {
  easy: "GREEN",
  moderate: "ORANGE",
  difficult: "RED",
};

const difficultyLabel: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  difficult: "Difficult",
};

export interface DifficultyBadgeProps {
  /** Difficulty level — controls color and default label. */
  difficulty: Difficulty;
  /** Override the displayed text (defaults to a capitalized level name). */
  label?: ReactNode;
  /** Show the leading gauge icon. @default true */
  showIcon?: boolean;
  /** Chip size. @default "md" */
  size?: "sm" | "md" | "lg";
  className?: string;
}

function GaugeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[1em]"
    >
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="m13.4 10.6 3.6-3.6" />
      <path d="M3.3 16a9 9 0 1 1 17.4 0" />
    </svg>
  );
}

/**
 * Compact, color-coded indicator of how hard a guide is, built on HeroUI `Chip`.
 * Mirrors iFixit's difficulty pill (easy → green, moderate → orange, difficult → red).
 */
export function DifficultyBadge({
  difficulty,
  label,
  showIcon = true,
  size = "md",
  className,
}: DifficultyBadgeProps) {
  const accent = COLORS[difficultyColor[difficulty]];

  return (
    <Chip
      variant="soft"
      size={size}
      className={cn(className)}
      style={{
        backgroundColor: hexToRgba(accent, 0.15),
        color: accent,
      }}
    >
      {showIcon && <GaugeIcon />}
      <Chip.Label>{label ?? difficultyLabel[difficulty]}</Chip.Label>
    </Chip>
  );
}
