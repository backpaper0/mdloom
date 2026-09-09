import { renderMermaid } from "@mermaid-js/mermaid-cli";
import puppeteer from "puppeteer";

export interface DiagramRequest {
  readonly id: string;
  readonly definition: string;
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
      const { data } = await renderMermaid(browser, definition, "svg", {});
      results.set(id, Buffer.from(data).toString("utf-8"));
    }
  } finally {
    await browser.close();
  }

  return results;
}
