import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_CSS,
  FOREST_THEME_CSS,
  getThemeCss,
  listThemeNames,
  OCEAN_THEME_CSS,
  STONE_THEME_CSS,
  SUNSET_THEME_CSS,
} from "./theme.js";

describe("getThemeCss", () => {
  it("resolves the registered Theme names", () => {
    expect(getThemeCss("default")).toBe(DEFAULT_THEME_CSS);
    expect(getThemeCss("ocean")).toBe(OCEAN_THEME_CSS);
    expect(getThemeCss("forest")).toBe(FOREST_THEME_CSS);
    expect(getThemeCss("sunset")).toBe(SUNSET_THEME_CSS);
    expect(getThemeCss("stone")).toBe(STONE_THEME_CSS);
  });

  it("returns undefined for an unknown theme name", () => {
    expect(getThemeCss("nope")).toBeUndefined();
  });

  it.each(["constructor", "toString", "hasOwnProperty", "__proto__"])(
    "returns undefined for the Object.prototype property name %s",
    (name) => {
      expect(getThemeCss(name)).toBeUndefined();
    },
  );

  it("lists exactly the registered theme names", () => {
    expect(listThemeNames()).toEqual([
      "default",
      "ocean",
      "forest",
      "sunset",
      "stone",
    ]);
  });
});
