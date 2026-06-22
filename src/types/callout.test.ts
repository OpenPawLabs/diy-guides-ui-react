import { describe, expect, it } from "vitest";
import { COLORS } from "./colors";
import {
  calloutTypeColor,
  calloutTypeHex,
  calloutTypeLabel,
  type CalloutType,
} from "./callout";

const types: CalloutType[] = ["note", "info", "tip", "caution", "danger"];

describe("calloutTypeColor", () => {
  it("maps each type to a guide palette name", () => {
    expect(calloutTypeColor).toEqual({
      note: "GREY",
      info: "LIGHT_BLUE",
      tip: "GREEN",
      caution: "ORANGE",
      danger: "RED",
    });
  });
});

describe("calloutTypeHex", () => {
  it("resolves palette hex for each type", () => {
    for (const type of types) {
      expect(calloutTypeHex(type)).toBe(COLORS[calloutTypeColor[type]]);
    }
  });
});

describe("calloutTypeLabel", () => {
  it("provides a default title for each type", () => {
    expect(calloutTypeLabel.note).toBe("Note");
    expect(calloutTypeLabel.danger).toBe("Danger");
  });
});
