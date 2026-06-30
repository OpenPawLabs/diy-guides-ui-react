import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock;
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserverMock {
    constructor(_callback: IntersectionObserverCallback) {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
}

if (typeof window !== "undefined") {
  window.scrollTo = () => {};
}

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
