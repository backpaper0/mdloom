import { renderMermaid } from "@mermaid-js/mermaid-cli";
import puppeteer from "puppeteer";
import * as vega from "vega";
import * as vegaLite from "vega-lite";

export interface DiagramRequest {
  readonly id: string;
  readonly definition: string;
}

export interface VegaDiagramRequest extends DiagramRequest {
  readonly notation: "vega" | "vega-lite";
}

/**
 * Renders each Mermaid diagram definition to an inline SVG string, keyed by
 * request id. Launches a single headless browser and reuses it across all
 * diagrams in the document.
 */
export async function renderDiagrams(
  requests: readonly DiagramRequest[],
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  if (requests.length === 0) {
    return results;
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    for (const { id, definition } of requests) {
      const { data } = await renderMermaid(browser, definition, "svg", {
        mermaidConfig: { theme: "base" },
      });
      results.set(id, Buffer.from(data).toString("utf-8"));
    }
  } finally {
    await browser.close();
  }

  return results;
}

/**
 * Renders each Vega / Vega-Lite spec to an inline SVG string, keyed by
 * request id. Vega-Lite specs are compiled to Vega specs first; both then go
 * through the same Vega runtime. No browser is needed.
 */
export async function renderVegaDiagrams(
  requests: readonly VegaDiagramRequest[],
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const { id, definition, notation } of requests) {
    const spec = JSON.parse(definition);
    const vgSpec =
      notation === "vega-lite" ? vegaLite.compile(spec).spec : spec;
    const runtime = vega.parse(vgSpec);
    const view = new vega.View(runtime, {
      renderer: "none",
      logger: vega.logger(vega.None),
    });
    const svg = await view.toSVG();
    results.set(id, svg);
  }

  return results;
}
