import type { Code, Root as MdastRoot } from "mdast";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { type DiagramRequest, renderDiagrams } from "./diagram.js";
import { highlightCode } from "./highlight.js";

const MERMAID_LANG = "mermaid";

interface PendingCodeBlock {
  readonly marker: string;
  readonly code: string;
  readonly lang: string | null;
}

/**
 * Converts a single Markdown document (GFM) into an HTML fragment: Mermaid
 * fences become inline SVG, other fenced code blocks become Shiki-highlighted
 * `<pre>` blocks. The result is the converted content only — wrapping it in a
 * full document with a Theme and Diagram Viewer is out of scope here.
 */
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as MdastRoot;

  const diagramRequests: DiagramRequest[] = [];
  const pendingCodeBlocks: PendingCodeBlock[] = [];
  let diagramIndex = 0;
  let codeIndex = 0;

  visit(tree, "code", (node: Code) => {
    if (node.lang === MERMAID_LANG) {
      const marker = `mdloom-diagram-${diagramIndex++}`;
      diagramRequests.push({ id: marker, definition: node.value });
      node.data = { hName: "div", hProperties: { className: [], id: marker } };
    } else {
      const marker = `mdloom-code-${codeIndex++}`;
      pendingCodeBlocks.push({
        marker,
        code: node.value,
        lang: node.lang ?? null,
      });
      node.data = { hName: "div", hProperties: { className: [], id: marker } };
    }
  });

  const diagramSvgs = await renderDiagrams(diagramRequests);
  const codeHtml = new Map<string, string>();
  for (const { marker, code, lang } of pendingCodeBlocks) {
    codeHtml.set(marker, await highlightCode(code, lang));
  }

  const hastTree = unified().use(remarkRehype).runSync(tree);
  let html = unified().use(rehypeStringify).stringify(hastTree);

  for (const { id } of diagramRequests) {
    const svg = diagramSvgs.get(id);
    if (svg === undefined) {
      throw new Error(
        `mdloom: missing rendered diagram for placeholder "${id}"`,
      );
    }
    html = replacePlaceholder(
      html,
      id,
      `<div class="mdloom-diagram">${svg}</div>`,
    );
  }
  for (const { marker } of pendingCodeBlocks) {
    const highlighted = codeHtml.get(marker);
    if (highlighted === undefined) {
      throw new Error(
        `mdloom: missing highlighted code for placeholder "${marker}"`,
      );
    }
    html = replacePlaceholder(html, marker, highlighted);
  }

  return html;
}

/**
 * The `code` mdast handler always wraps its (possibly overridden) result in
 * `<pre>...</pre>`, and merges its default `className` into our override, so
 * a placeholder div set via `node.data` always renders as
 * `<pre><div class="" id="marker">...</div></pre>`. Content inside the div is
 * HTML-escaped by rehype-stringify, so it can't itself contain an unescaped
 * `</div>`, making the first `</div>` after the opening tag the div's close.
 */
function replacePlaceholder(
  html: string,
  marker: string,
  replacement: string,
): string {
  const openTag = `<pre><div class="" id="${marker}">`;
  const start = html.indexOf(openTag);
  if (start === -1) {
    throw new Error(`mdloom: placeholder not found: ${marker}`);
  }
  const closeTag = "</div></pre>";
  const closeIndex = html.indexOf(closeTag, start + openTag.length);
  if (closeIndex === -1) {
    throw new Error(`mdloom: placeholder not closed: ${marker}`);
  }
  const end = closeIndex + closeTag.length;
  return html.slice(0, start) + replacement + html.slice(end);
}
