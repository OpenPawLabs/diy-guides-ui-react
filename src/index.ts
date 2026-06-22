import "./styles/index.css";

// Shared design tokens
export {
  type GuideSeverity,
  type HeroSemanticColor,
  severityColor,
  severityDotClass,
  severityMarkerClass,
  severityLabel,
} from "./types/severity";

// Guide components
export { DifficultyBadge } from "./components/DifficultyBadge";
export type {
  DifficultyBadgeProps,
  Difficulty,
} from "./components/DifficultyBadge";

export { WarningCallout } from "./components/WarningCallout";
export type { WarningCalloutProps } from "./components/WarningCallout";

export { MediaFigure } from "./components/MediaFigure";
export type {
  MediaFigureProps,
  MediaAnnotation,
} from "./components/MediaFigure";

export { ToolList } from "./components/ToolList";
export type { ToolListProps, ToolListItemProps } from "./components/ToolList";

export { GuideStep } from "./components/GuideStep";
export type {
  GuideStepProps,
  GuideStepBulletProps,
  GuideStepBulletVariant,
} from "./components/GuideStep";

export { GuideStepList } from "./components/GuideStepList";
export type {
  GuideStepListProps,
  GuideProgress,
} from "./components/GuideStepList";

export { GuideLayout } from "./components/GuideLayout";
export type {
  GuideLayoutProps,
  GuideLayoutHeaderProps,
  GuideLayoutIntroProps,
} from "./components/GuideLayout";
