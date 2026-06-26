import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

export interface UseElementSizeOptions {
  /**
   * Keep sampling size for this many milliseconds after mount and whenever
   * `layoutSettleKey` changes — catches modal enter transitions and container-query
   * layout that finishes after the first paint.
   */
  settleMs?: number;
  /** Also observe the parent element for size changes (container queries, flex). */
  observeParent?: boolean;
  /**
   * Re-measure when the element becomes fully visible — useful for content mounted
   * inside animated modals.
   */
  remeasureWhenVisible?: boolean;
  /** Changing this value triggers a fresh settle sampling window. */
  layoutSettleKey?: boolean | number | string;
}

function scheduleSettleSampling(
  measure: () => void,
  settleMs: number,
): () => void {
  measure();
  requestAnimationFrame(() => {
    measure();
    requestAnimationFrame(measure);
  });

  const timeouts: ReturnType<typeof setTimeout>[] = [];
  for (let elapsed = 50; elapsed <= settleMs; elapsed += 50) {
    timeouts.push(setTimeout(measure, elapsed));
  }

  return () => {
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  };
}

/**
 * Tracks an element's border-box size via layout effect + ResizeObserver, with
 * helpers for async layout (image decode, modal enter animation, container queries).
 */
export function useElementSize<T extends HTMLElement>(
  options: UseElementSizeOptions = {},
) {
  const {
    settleMs = 0,
    observeParent = false,
    remeasureWhenVisible = false,
    layoutSettleKey,
  } = options;

  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize | null>(null);

  const measure = useCallback(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const { width, height } = element.getBoundingClientRect();
    if (width <= 0 || height <= 0) {
      return;
    }

    setSize((previous) =>
      previous?.width === width && previous?.height === height
        ? previous
        : { width, height },
    );
  }, []);

  const measureAfterLayout = useCallback(() => {
    measure();
    requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(() => {
        measure();
        setTimeout(measure, 0);
      });
    });
  }, [measure]);

  useLayoutEffect(() => {
    measure();

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => measure());
    observer.observe(element);
    if (observeParent && element.parentElement) {
      observer.observe(element.parentElement);
    }

    const transitionTargets: HTMLElement[] = [];
    let ancestor: HTMLElement | null = element;
    for (let depth = 0; ancestor && depth < 6; depth += 1) {
      transitionTargets.push(ancestor);
      ancestor = ancestor.parentElement;
    }

    const onTransitionEnd = () => measureAfterLayout();
    for (const target of transitionTargets) {
      target.addEventListener("transitionend", onTransitionEnd);
    }

    return () => {
      observer.disconnect();
      for (const target of transitionTargets) {
        target.removeEventListener("transitionend", onTransitionEnd);
      }
    };
  }, [measure, measureAfterLayout, observeParent]);

  useEffect(() => {
    if (settleMs <= 0) {
      return;
    }
    return scheduleSettleSampling(measure, settleMs);
  }, [layoutSettleKey, measure, settleMs]);

  useEffect(() => {
    if (!remeasureWhenVisible) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.99) {
            measureAfterLayout();
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.99, 1] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [layoutSettleKey, measureAfterLayout, remeasureWhenVisible]);

  useEffect(() => {
    if (layoutSettleKey !== undefined) {
      measureAfterLayout();
    }
  }, [layoutSettleKey, measureAfterLayout]);

  return { ref, size, measure, measureAfterLayout };
}
