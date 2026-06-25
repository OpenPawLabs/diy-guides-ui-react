import "./styles/index.css";

// Shared design tokens
export { COLORS, hexToRgba, markerTextColor, type GuideColor } from "./types/colors";
export {
  type CalloutType,
  calloutTypeColor,
  calloutTypeHex,
  calloutTypeLabel,
} from "./types/callout";

// Guide components
export { DifficultyBadge } from "./components/DifficultyBadge";
export type {
  DifficultyBadgeProps,
  Difficulty,
} from "./components/DifficultyBadge";

export { Callout } from "./components/Callout";
export type { CalloutProps } from "./components/Callout";

export {
  MediaFigure,
  mediaFigureType,
  MediaFigureThumbnail,
  MediaCropEditor,
} from "./components/MediaFigure";
export type {
  MediaFigureProps,
  MediaFigureThumbnailProps,
  MediaCropEditorProps,
  MediaAnnotation,
  MediaAnnotationEditing,
  AnnotationTool,
  MediaDisplayRegion,
  PointAnnotation,
  CircleAnnotation,
  RectangleAnnotation,
} from "./components/MediaFigure";

export {
  DISPLAY_REGION_ASPECT,
  MIN_REGION_WIDTH,
  displayRegionHeight,
  centeredDisplayRegion,
  clampDisplayRegion,
} from "./utils/mediaCrop";

export { ToolList } from "./components/ToolList";
export type { ToolListProps, ToolListItemProps } from "./components/ToolList";

export { LinkButton } from "./components/LinkButton";
export type {
  LinkButtonProps,
  LinkButtonItemProps,
  LinkButtonEditing,
  LinkButtonVariant,
  LinkButtonSize,
} from "./components/LinkButton";

export { GuideStep } from "./components/GuideStep";
export type {
  GuideStepProps,
  GuideStepBulletProps,
  GuideStepBulletVariant,
  GuideStepMediaEditing,
  GuideStepBulletsEditing,
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
