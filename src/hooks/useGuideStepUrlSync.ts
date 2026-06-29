import { useCallback, useEffect, useRef, type RefObject } from "react";
import { pickActiveGuideStep } from "../utils/pickActiveGuideStep";
import {
  buildGuideStepUrl,
  guideStepUrlId,
  readGuideStepFromLocation,
  type GuideStepUrlMode,
} from "../utils/guideStepUrl";
export interface UseGuideStepUrlSyncOptions {
  enabled: boolean;
  rootRef: RefObject<HTMLElement | null>;
  stepNumbers: number[];
  mode?: GuideStepUrlMode;
  stepUrlKey?: string;
  /** Top scroll margin (px) — should match each step's `scrollMarginTop`. @default 0 */
  scrollMarginTop?: number;
  /**
   * Fraction of a step's height that must remain visible in the viewport for it
   * to stay active. When less than this remains on screen, the next step takes
   * over. @default 0.2
   */
  activeStepMinVisibleRatio?: number;
  onActiveStepChange?: (step: number | null) => void;
}

const SCROLL_SETTLE_MS = 900;

function smoothScrollToElement(element: HTMLElement) {
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getStepElement(step: number): HTMLElement | null {
  return document.getElementById(guideStepUrlId(step));
}

function pickActiveStep(
  stepNumbers: number[],
  activeStepMinVisibleRatio: number,
): number | null {
  return pickActiveGuideStep(stepNumbers, activeStepMinVisibleRatio, (step) => {
    const element = getStepElement(step);
    return element?.getBoundingClientRect() ?? null;
  });
}
/**
 * Keeps the page URL in sync with the guide step in view and smooth-scrolls when
 * the URL names a step (including on load and `hashchange`).
 */
export function useGuideStepUrlSync({
  enabled,
  rootRef,
  stepNumbers,
  mode = "hash",
  stepUrlKey = "step",
  scrollMarginTop = 0,
  activeStepMinVisibleRatio = 0.2,
  onActiveStepChange,
}: UseGuideStepUrlSyncOptions) {
  const activeStepRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const didInitialScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        step != null ? getStepElement(step) : rootRef.current;

      if (target == null) {
        return;
      }

      isProgrammaticScrollRef.current = true;
      if (scrollTimerRef.current != null) {
        clearTimeout(scrollTimerRef.current);
      }

      smoothScrollToElement(target);
      setActiveStep(step, { updateUrl: false });

      scrollTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        scrollTimerRef.current = null;
      }, SCROLL_SETTLE_MS);
    },
    [rootRef, setActiveStep],
  );

  const scrollFromUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const step = readGuideStepFromLocation(window.location, mode, stepUrlKey);
    scrollToStep(step);
    setActiveStep(step, { updateUrl: false });
  }, [mode, scrollToStep, setActiveStep, stepUrlKey]);

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

      const active = pickActiveStep(
        stepNumbers,
        activeStepMinVisibleRatio,
      );      setActiveStep(active, { updateUrl: true });
    };

    const observer = new IntersectionObserver(updateActiveFromScroll, {
      root: null,
      rootMargin: `-${scrollMarginTop}px 0px 0px 0px`,
      threshold: [0, 0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 0.8, 0.9, 1],
    });

    for (const step of stepNumbers) {
      const element = getStepElement(step);
      if (element != null) {
        observer.observe(element);
      }
    }

    updateActiveFromScroll();

    return () => {
      observer.disconnect();
    };
  }, [
    activeStepMinVisibleRatio,
    enabled,
    scrollMarginTop,
    setActiveStep,
    stepNumbers.join(","),
  ]);
}
