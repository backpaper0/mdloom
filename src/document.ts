import { DIAGRAM_VIEWER_SCRIPT } from "./diagram-viewer.js";
import { SOURCE_VIEWER_SCRIPT } from "./source-viewer.js";

export interface BuildHtmlDocumentOptions {
  /** Used as the Output's `<title>`. */
  readonly title: string;
  /** The converted Document body (from `convertMarkdownToHtml`). */
  readonly contentHtml: string;
  /** The Document's raw Markdown text, embedded for the Source Viewer. */
  readonly markdownSource: string;
  /** Theme CSS: the Default Theme, or the `--css` override, verbatim. */
  readonly css: string;
  /**
   * Raw CSS from `--font`, layered after `css` so it can override the
   * Theme's font declarations. mdloom does no font embedding of its own
   * (no reading/base64-encoding of font files): a `--font` file is expected
   * to be CSS (e.g. `@font-face` with an already-embedded data URI), and is
   * inlined as-is.
   */
  readonly fontCss?: string;
}

/**
 * Assembles the single, self-contained Output HTML file: Theme CSS, the
 * converted Document, and the Diagram Viewer script, with no external
 * assets (the Output is opened via `file://`).
 */
export function buildHtmlDocument({
  title,
  contentHtml,
  css,
  fontCss,
  markdownSource,
}: BuildHtmlDocumentOptions): string {
  const style = fontCss ? `${css}\n${fontCss}` : css;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
${style}
</style>
</head>
<body>
<div class="mdloom-toolbar">
<button type="button" id="mdloom-source-viewer-trigger" class="mdloom-source-viewer-trigger">Markdownソースを表示</button>
</div>
<div class="markdown-body">
${contentHtml}
</div>
<div id="mdloom-source" hidden>${escapeHtml(markdownSource)}</div>
<script>
${DIAGRAM_VIEWER_SCRIPT}
${SOURCE_VIEWER_SCRIPT}
</script>
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
