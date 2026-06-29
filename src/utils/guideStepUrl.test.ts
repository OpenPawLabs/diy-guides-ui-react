import { describe, expect, it } from "vitest";
import {
  buildGuideStepUrl,
  guideStepUrlId,
  parseGuideStepFromHash,
  parseGuideStepFromSearch,
  readGuideStepFromLocation,
} from "./guideStepUrl";

describe("guideStepUrl", () => {
  it("builds stable step ids", () => {
    expect(guideStepUrlId(3)).toBe("step-3");
  });

  it("parses hash fragments", () => {
    expect(parseGuideStepFromHash("#step-2")).toBe(2);
    expect(parseGuideStepFromHash("")).toBeNull();
    expect(parseGuideStepFromHash("#other")).toBeNull();
    expect(parseGuideStepFromHash("#step-0")).toBeNull();
  });

  it("parses search params", () => {
    expect(parseGuideStepFromSearch("?step=4")).toBe(4);
    expect(parseGuideStepFromSearch("?other=1")).toBeNull();
  });

  it("reads the active step from a location", () => {
    expect(
      readGuideStepFromLocation({ hash: "#step-5", search: "" }, "hash"),
    ).toBe(5);
    expect(
      readGuideStepFromLocation({ hash: "", search: "?step=6" }, "search"),
    ).toBe(6);
  });

  it("writes hash and search URLs", () => {
    const base = "https://example.com/guides/demo";

    expect(buildGuideStepUrl(base, 2, "hash")).toBe(`${base}#step-2`);
    expect(buildGuideStepUrl(`${base}#step-1`, null, "hash")).toBe(base);
    expect(buildGuideStepUrl(base, 3, "search")).toBe(`${base}?step=3`);
    expect(buildGuideStepUrl(`${base}?step=3`, null, "search")).toBe(base);
  });
});
