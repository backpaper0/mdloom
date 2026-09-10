import { beforeEach, describe, expect, it, vi } from "vitest";

const launchMock = vi.fn();
const closeMock = vi.fn();
const renderMermaidMock = vi.fn();

vi.mock("puppeteer", () => ({
  default: { launch: launchMock },
}));

vi.mock("@mermaid-js/mermaid-cli", () => ({
  renderMermaid: renderMermaidMock,
}));

const { renderDiagrams, renderVegaDiagrams } = await import("./diagram.js");

describe("renderDiagrams", () => {
  beforeEach(() => {
    launchMock.mockReset();
    closeMock.mockReset();
    renderMermaidMock.mockReset();
    launchMock.mockResolvedValue({ close: closeMock });
  });

  it("returns an empty map without launching a browser when there are no requests", async () => {
    const result = await renderDiagrams([]);

    expect(result.size).toBe(0);
    expect(launchMock).not.toHaveBeenCalled();
  });

  it("renders each diagram and keys the result by request id", async () => {
    renderMermaidMock.mockImplementation(
      async (_browser, definition: string) => ({
        data: Buffer.from(
          `<svg data-definition="${definition}"></svg>`,
          "utf-8",
        ),
      }),
    );

    const result = await renderDiagrams([
      { id: "a", definition: "graph TD; A-->B;" },
      { id: "b", definition: "graph TD; C-->D;" },
    ]);

    expect(result.get("a")).toBe(
      '<svg data-definition="graph TD; A-->B;"></svg>',
    );
    expect(result.get("b")).toBe(
      '<svg data-definition="graph TD; C-->D;"></svg>',
    );
    expect(launchMock).toHaveBeenCalledTimes(1);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("renders with the base Mermaid.js theme", async () => {
    renderMermaidMock.mockResolvedValue({
      data: Buffer.from("<svg></svg>", "utf-8"),
    });

    await renderDiagrams([{ id: "a", definition: "graph TD; A-->B;" }]);

    expect(renderMermaidMock).toHaveBeenCalledWith(
      expect.anything(),
      "graph TD; A-->B;",
      "svg",
      { mermaidConfig: { theme: "base" } },
    );
  });

  it("closes the browser even when rendering fails", async () => {
    renderMermaidMock.mockRejectedValue(new Error("invalid diagram"));

    await expect(
      renderDiagrams([{ id: "a", definition: "not mermaid" }]),
    ).rejects.toThrow("invalid diagram");
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});

describe("renderVegaDiagrams", () => {
  it("renders a vega-lite spec to an SVG string keyed by request id", async () => {
    const spec = JSON.stringify({
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      data: { values: [{ a: "A", b: 1 }] },
      mark: "bar",
      encoding: {
        x: { field: "a", type: "nominal" },
        y: { field: "b", type: "quantitative" },
      },
    });

    const result = await renderVegaDiagrams([
      { id: "a", definition: spec, notation: "vega-lite" },
    ]);

    const svg = result.get("a");
    expect(svg).toBeDefined();
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("renders a raw vega spec without compiling it as vega-lite", async () => {
    const spec = JSON.stringify({
      $schema: "https://vega.github.io/schema/vega/v6.json",
      width: 100,
      height: 100,
      marks: [],
    });

    const result = await renderVegaDiagrams([
      { id: "a", definition: spec, notation: "vega" },
    ]);

    const svg = result.get("a");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("renders each request and keys the result by request id", async () => {
    const barSpec = JSON.stringify({
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      data: { values: [{ a: "A", b: 1 }] },
      mark: "bar",
      encoding: {
        x: { field: "a", type: "nominal" },
        y: { field: "b", type: "quantitative" },
      },
    });
    const rawSpec = JSON.stringify({
      $schema: "https://vega.github.io/schema/vega/v6.json",
      width: 50,
      height: 50,
      marks: [],
    });

    const result = await renderVegaDiagrams([
      { id: "a", definition: barSpec, notation: "vega-lite" },
      { id: "b", definition: rawSpec, notation: "vega" },
    ]);

    expect(result.get("a")).toContain("<svg");
    expect(result.get("b")).toContain("<svg");
  });

  it("rejects when the spec is invalid", async () => {
    const spec = JSON.stringify({
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      mark: "not-a-real-mark",
    });

    await expect(
      renderVegaDiagrams([
        { id: "a", definition: spec, notation: "vega-lite" },
      ]),
    ).rejects.toThrow();
  });
});
