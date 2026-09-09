import { DIAGRAM_VIEWER_SCRIPT } from "./diagram-viewer.js";

export interface BuildHtmlDocumentOptions {
  /** Used as the Output's `<title>`. */
  readonly title: string;
  /** The converted Document body (from `convertMarkdownToHtml`). */
  readonly contentHtml: string;
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
<div class="markdown-body">
${contentHtml}
</div>
<script>
${DIAGRAM_VIEWER_SCRIPT}
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
