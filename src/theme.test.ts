import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_CSS } from "./theme.js";

describe("DEFAULT_THEME_CSS", () => {
  it("styles the markdown-body and mdloom-diagram classes used by the Output", () => {
    expect(DEFAULT_THEME_CSS).toContain(".markdown-body");
    expect(DEFAULT_THEME_CSS).toContain(".mdloom-diagram");
  });
});
