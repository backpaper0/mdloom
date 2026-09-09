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

const { renderDiagrams } = await import("./diagram.js");

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
