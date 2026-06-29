/* @vitest-environment node */

import { describe, expect, it } from "vitest";
import { demoteTailwindUtilitiesLayer } from "./vite.config";

describe("demoteTailwindUtilitiesLayer", () => {
  it("moves generated Tailwind utilities below host app utilities", () => {
    const css = "@layer components{.card{display:block}}@layer utilities{.hidden{display:none}}";

    expect(demoteTailwindUtilitiesLayer(css)).toBe(
      "@layer components{.card{display:block}}@layer components{.hidden{display:none}}",
    );
  });
});
