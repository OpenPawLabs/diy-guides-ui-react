import { useCallback, useEffect, useRef, type RefObject } from "react";
import {
  getOverviewRect,
  pickActiveGuideSection,
} from "../utils/pickActiveGuideStep";
import {
  buildGuideStepUrl,
  guideStepUrlId,
  readGuideStepFromLocation,
  type GuideStepUrlMode,
} from "../utils/guideStepUrl";

export interface UseGuideStepUrlSyncOptions {
  enabled: boolean;
  rootRef: RefObject<HTMLElement | null>;
  /** Overview anchor from `GuideLayout` — used when the URL has no step. */
  guideTopRef?: RefObject<HTMLElement | null> | null;
  /** Top of `GuideLayout.Content` — bounds the overview region for URL sync. */
  guideContentRef?: RefObject<HTMLElement | null> | null;
  stepNumbers: number[];
  mode?: GuideStepUrlMode;
  stepUrlKey?: string;
  /** Step scroll margin (px) — parent offset plus library progress-bar clearance. */
  scrollMarginTop?: number;
  /** Overview scroll margin (px) — parent offset only. */
  overviewScrollMarginTop?: number;
  /**
   * Fraction of a section's height that must remain visible below fixed chrome for
   * it to stay active. Applies to the overview and steps alike. @default 0.2
   */
  activeStepMinVisibleRatio?: number;
  onActiveStepChange?: (step: number | null) => void;
}

const SCROLL_SETTLE_MS = 900;

function smoothScrollToElement(element: HTMLElement, scrollMarginTop: number) {
  const top = Math.max(
    0,
    element.getBoundingClientRect().top + window.scrollY - scrollMarginTop,
  );
  window.scrollTo({ top, behavior: "smooth" });
}

function getStepElement(step: number): HTMLElement | null {
  return document.getElementById(guideStepUrlId(step));
}

/**
 * Keeps the page URL in sync with the guide step in view and smooth-scrolls when
 * the URL names a step (including on load and `hashchange`).
 */
export function useGuideStepUrlSync({
  enabled,
  rootRef,
  guideTopRef = null,
  guideContentRef = null,
  stepNumbers,
  mode = "hash",
  stepUrlKey = "step",
  scrollMarginTop = 0,
  overviewScrollMarginTop = 0,
  activeStepMinVisibleRatio = 0.2,
  onActiveStepChange,
}: UseGuideStepUrlSyncOptions) {
  const activeStepRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const didInitialScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOverviewScrollMarginRef = useRef(overviewScrollMarginTop);
  /** Flushes scroll-driven URL sync after programmatic scroll settles. */
  const syncActiveFromScrollRef = useRef<(() => void) | null>(null);

  const writeUrl = useCallback(
    (step: number | null) => {
      if (typeof window === "undefined") {
        return;
      }

      const nextUrl = buildGuideStepUrl(window.location.href, step, mode, stepUrlKey);
      if (nextUrl === window.location.href) {
        return;
      }

      window.history.replaceState(window.history.state, "", nextUrl);
    },
    [mode, stepUrlKey],
  );

  const setActiveStep = useCallback(
    (step: number | null, { updateUrl }: { updateUrl: boolean }) => {
      if (activeStepRef.current === step) {
        return;
      }

      activeStepRef.current = step;
      if (updateUrl) {
        writeUrl(step);
      }
      onActiveStepChange?.(step);
    },
    [onActiveStepChange, writeUrl],
  );

  const scrollToStep = useCallback(
    (step: number | null) => {
      if (typeof window === "undefined") {
        return;
      }

      const target =
        step != null
          ? getStepElement(step)
          : (guideTopRef?.current ?? rootRef.current);

      if (target == null) {
        return;
      }

      const margin = step != null ? scrollMarginTop : overviewScrollMarginTop;

      isProgrammaticScrollRef.current = true;
      if (scrollTimerRef.current != null) {
        clearTimeout(scrollTimerRef.current);
      }

      smoothScrollToElement(target, margin);
      setActiveStep(step, { updateUrl: false });

      scrollTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        scrollTimerRef.current = null;
        syncActiveFromScrollRef.current?.();
      }, SCROLL_SETTLE_MS);
    },
    [guideTopRef, overviewScrollMarginTop, rootRef, scrollMarginTop, setActiveStep],
  );

  const scrollFromUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const step = readGuideStepFromLocation(window.location, mode, stepUrlKey);
    scrollToStep(step);
  }, [mode, scrollToStep, stepUrlKey]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || didInitialScrollRef.current) {
      return;
    }

    const requestedStep = readGuideStepFromLocation(
      window.location,
      mode,
      stepUrlKey,
    );
    const hasTargets =
      rootRef.current != null &&
      (requestedStep == null ||
        stepNumbers.includes(requestedStep) ||
        stepNumbers.length > 0);

    if (!hasTargets) {
      return;
    }

    if (requestedStep != null && getStepElement(requestedStep) == null) {
      return;
    }

    didInitialScrollRef.current = true;
    scrollFromUrl();
  }, [
    enabled,
    mode,
    rootRef,
    scrollFromUrl,
    stepNumbers.join(","),
    stepUrlKey,
  ]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    if (prevOverviewScrollMarginRef.current === overviewScrollMarginTop) {
      return;
    }

    prevOverviewScrollMarginRef.current = overviewScrollMarginTop;

    const requestedStep = readGuideStepFromLocation(
      window.location,
      mode,
      stepUrlKey,
    );
    if (requestedStep != null || isProgrammaticScrollRef.current) {
      return;
    }

    scrollToStep(null);
  }, [enabled, mode, overviewScrollMarginTop, scrollToStep, stepUrlKey]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const handleUrlChange = () => {
      scrollFromUrl();
    };

    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
      if (scrollTimerRef.current != null) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
        isProgrammaticScrollRef.current = false;
        syncActiveFromScrollRef.current?.();
      }
    };
  }, [enabled, scrollFromUrl]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || stepNumbers.length === 0) {
      return;
    }

    const updateActiveFromScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const guideTopRect = guideTopRef?.current?.getBoundingClientRect() ?? null;
      const contentTopRect =
        guideContentRef?.current?.getBoundingClientRect() ?? null;
      const overviewRect = getOverviewRect(guideTopRect, contentTopRect);

      const active = pickActiveGuideSection({
        overviewRect,
        overviewContentInsetTop: overviewScrollMarginTop,
        stepNumbers,
        getStepRect: (step) => getStepElement(step)?.getBoundingClientRect() ?? null,
        activeStepMinVisibleRatio,
        stepContentInsetTop: scrollMarginTop,
      });
      setActiveStep(active, { updateUrl: true });
    };

    const observer = new IntersectionObserver(updateActiveFromScroll, {
      root: null,
      rootMargin: `-${scrollMarginTop}px 0px 0px 0px`,
      threshold: [0, 0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 0.8, 0.9, 1],
    });

    const observeTargets = [
      guideTopRef?.current,
      guideContentRef?.current,
      ...stepNumbers.map((step) => getStepElement(step)),
    ];

    for (const element of observeTargets) {
      if (element != null) {
        observer.observe(element);
      }
    }

    syncActiveFromScrollRef.current = updateActiveFromScroll;
    updateActiveFromScroll();

    return () => {
      syncActiveFromScrollRef.current = null;
      observer.disconnect();
    };
  }, [
    activeStepMinVisibleRatio,
    enabled,
    guideContentRef,
    guideTopRef,
    overviewScrollMarginTop,
    scrollMarginTop,
    setActiveStep,
    stepNumbers.join(","),
  ]);
}
