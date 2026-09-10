import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DiagramRequest, VegaDiagramRequest } from "./diagram.js";

const renderDiagramsMock = vi.fn(
  async (requests: readonly DiagramRequest[]) => {
    const result = new Map<string, string>();
    for (const { id, definition } of requests) {
      result.set(id, `<svg data-definition="${definition}"></svg>`);
    }
    return result;
  },
);

const renderVegaDiagramsMock = vi.fn(
  async (requests: readonly VegaDiagramRequest[]) => {
    const result = new Map<string, string>();
    for (const { id, definition, notation } of requests) {
      result.set(
        id,
        `<svg data-notation="${notation}" data-definition="${definition}"></svg>`,
      );
    }
    return result;
  },
);

vi.mock("./diagram.js", () => ({
  renderDiagrams: renderDiagramsMock,
  renderVegaDiagrams: renderVegaDiagramsMock,
}));

const { convertMarkdownToHtml } = await import("./convert.js");

describe("convertMarkdownToHtml", () => {
  beforeEach(() => {
    renderDiagramsMock.mockClear();
    renderVegaDiagramsMock.mockClear();
  });

  it("converts plain GFM markdown", async () => {
    const html = await convertMarkdownToHtml("# Title\n\nHello **world**.\n");

    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>world</strong>");
  });

  it("renders GFM tables, task lists, and strikethrough", async () => {
    const html = await convertMarkdownToHtml(
      "| a | b |\n| - | - |\n| 1 | 2 |\n\n- [x] done\n- [ ] todo\n\n~~gone~~\n",
    );

    expect(html).toContain("<table>");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("<del>gone</del>");
  });

  it("replaces a non-mermaid fenced code block with highlighted output", async () => {
    const html = await convertMarkdownToHtml("```ts\nconst x = 1;\n```\n");

    expect(html).toContain('<pre class="shiki');
    expect(html).not.toContain("mdloom-code-0");
    expect(renderDiagramsMock).toHaveBeenCalledWith([]);
  });

  it("replaces a mermaid fence with the rendered diagram", async () => {
    const html = await convertMarkdownToHtml(
      "```mermaid\ngraph TD; A-->B;\n```\n",
    );

    expect(renderDiagramsMock).toHaveBeenCalledWith([
      { id: "mdloom-diagram-0", definition: "graph TD; A-->B;" },
    ]);
    expect(html).toContain(
      '<div class="mdloom-diagram"><svg data-definition="graph TD; A-->B;"></svg></div>',
    );
    expect(html).not.toContain("mermaid");
  });

  it("replaces a vega-lite fence with the rendered diagram", async () => {
    const html = await convertMarkdownToHtml(
      '```vega-lite\n{"mark":"bar"}\n```\n',
    );

    expect(renderVegaDiagramsMock).toHaveBeenCalledWith([
      {
        id: "mdloom-diagram-0",
        definition: '{"mark":"bar"}',
        notation: "vega-lite",
      },
    ]);
    expect(html).toContain(
      '<div class="mdloom-diagram"><svg data-notation="vega-lite" data-definition="{"mark":"bar"}"></svg></div>',
    );
  });

  it("replaces a vega fence with the rendered diagram", async () => {
    const html = await convertMarkdownToHtml('```vega\n{"marks":[]}\n```\n');

    expect(renderVegaDiagramsMock).toHaveBeenCalledWith([
      { id: "mdloom-diagram-0", definition: '{"marks":[]}', notation: "vega" },
    ]);
    expect(html).toContain(
      '<div class="mdloom-diagram"><svg data-notation="vega" data-definition="{"marks":[]}"></svg></div>',
    );
  });

  it("shares one placeholder index across mermaid, vega, and vega-lite fences", async () => {
    const markdown = [
      "```mermaid",
      "graph TD; A-->B;",
      "```",
      "",
      "```vega-lite",
      '{"mark":"bar"}',
      "```",
      "",
    ].join("\n");

    await convertMarkdownToHtml(markdown);

    expect(renderDiagramsMock).toHaveBeenCalledWith([
      { id: "mdloom-diagram-0", definition: "graph TD; A-->B;" },
    ]);
    expect(renderVegaDiagramsMock).toHaveBeenCalledWith([
      {
        id: "mdloom-diagram-1",
        definition: '{"mark":"bar"}',
        notation: "vega-lite",
      },
    ]);
  });

  it("keeps document order and distinct placeholders across mixed blocks", async () => {
    const markdown = [
      "Intro paragraph.",
      "",
      "```mermaid",
      "graph TD; A-->B;",
      "```",
      "",
      "```ts",
      "const x = 1;",
      "```",
      "",
      "```mermaid",
      "graph TD; C-->D;",
      "```",
      "",
    ].join("\n");

    const html = await convertMarkdownToHtml(markdown);

    const introIndex = html.indexOf("Intro paragraph.");
    const firstDiagramIndex = html.indexOf('data-definition="graph TD; A-->B;');
    const codeIndex = html.indexOf('<pre class="shiki');
    const secondDiagramIndex = html.indexOf(
      'data-definition="graph TD; C-->D;',
    );

    expect(introIndex).toBeGreaterThanOrEqual(0);
    expect(firstDiagramIndex).toBeGreaterThan(introIndex);
    expect(codeIndex).toBeGreaterThan(firstDiagramIndex);
    expect(secondDiagramIndex).toBeGreaterThan(codeIndex);
  });
});
