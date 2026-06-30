"use client";

import { useRef, type ReactNode } from "react";
import { Chip, cn } from "@heroui/react";
import {
  GuideScrollMarginContext,
  GuideTopRefContext,
} from "../../context/guideScrollMargin";
import {
  DifficultyBadge,
  type Difficulty,
} from "../DifficultyBadge";

export interface GuideLayoutProps {
  /** `GuideLayout.Header`, `GuideLayout.Intro`, `GuideLayout.Sidebar`, and `GuideLayout.Content`. */
  children: ReactNode;
  /**
   * Extra top scroll margin (px) for fixed site chrome above the guide — passed
   * to nested `GuideStepList`s so deep links land below the header.
   * @default 0
   */
  stepScrollMarginTop?: number;
  className?: string;
}

export interface GuideLayoutHeaderProps {
  /** Guide title. */
  title: ReactNode;
  /** Optional hero image URL — the guide's main image, shown left of the title block. */
  heroImage?: string;
  /** Alt text for `heroImage`. Defaults to `""` (decorative). */
  heroImageAlt?: string;
  /** Difficulty level — rendered as a `DifficultyBadge`. */
  difficulty?: Difficulty;
  /** Time estimate text, e.g. "20 – 30 minutes". */
  timeEstimate?: ReactNode;
  /** Byline / metadata line (contributors, last updated, …). */
  meta?: ReactNode;
  className?: string;
}

export interface GuideLayoutIntroProps {
  /** Introduction / overview copy beside the tools sidebar. */
  children: ReactNode;
  className?: string;
}

function GuideLayoutHeader({
  title,
  heroImage,
  heroImageAlt,
  difficulty,
  timeEstimate,
  meta,
  className,
}: GuideLayoutHeaderProps) {
  const hasBadges = difficulty != null || timeEstimate != null;
  const hasHeroImage = heroImage != null;

  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-default pb-6 md:[grid-area:header]",
        hasHeroImage && "sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
    >
      {hasHeroImage && (
        <div className="aspect-[4/3] h-32 shrink-0 overflow-hidden rounded-lg border border-default bg-default-100">
          <img
            src={heroImage}
            alt={heroImageAlt ?? ""}
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {meta != null && (
            <div className="text-sm text-default-500">{meta}</div>
          )}
        </div>

        {hasBadges && (
          <div className="flex flex-wrap items-center gap-2">
            {difficulty != null && <DifficultyBadge difficulty={difficulty} />}
            {timeEstimate != null && (
              <Chip variant="soft" color="default">
                <Chip.Label>{timeEstimate}</Chip.Label>
              </Chip>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/** Introduction column — sits left of `Sidebar` on desktop. */
function GuideLayoutIntro({ children, className }: GuideLayoutIntroProps) {
  return (
    <div className={cn("min-w-0 md:[grid-area:intro]", className)}>
      <div className="max-w-prose text-default-700">{children}</div>
    </div>
  );
}

/** "What you need" column — sits right of `Intro` on desktop. */
function GuideLayoutSidebar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("min-w-0 md:[grid-area:sidebar]", className)}>
      <div className="flex flex-col gap-4">{children}</div>
    </aside>
  );
}

/** Full-width main column — typically holds a `GuideStepList`. */
function GuideLayoutContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("min-w-0 w-full md:[grid-area:main]", className)}>
      {children}
    </main>
  );
}

/**
 * Responsive page shell for a guide: a full-width `Header` (optionally with a
 * 4:3 hero image left of the title), an intro row with `Intro` (description)
 * beside `Sidebar` (tools/parts), then full-width `Content` (steps). On mobile
 * the intro row stacks with intro first, then sidebar.
 */
export const GuideLayout = Object.assign(
  function GuideLayoutRoot({
    children,
    stepScrollMarginTop = 0,
    className,
  }: GuideLayoutProps) {
    const guideTopRef = useRef<HTMLDivElement>(null);

    return (
      <GuideTopRefContext.Provider value={guideTopRef}>
        <GuideScrollMarginContext.Provider value={stepScrollMarginTop}>
          <div
            ref={guideTopRef}
            className={cn(
              "mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-[minmax(0,1fr)_20rem] md:[grid-template-areas:'header_header'_'intro_sidebar'_'main_main']",
              className,
            )}
          >
            {children}
          </div>
        </GuideScrollMarginContext.Provider>
      </GuideTopRefContext.Provider>
    );
  },
  {
    Header: GuideLayoutHeader,
    Intro: GuideLayoutIntro,
    Sidebar: GuideLayoutSidebar,
    Content: GuideLayoutContent,
  },
);
