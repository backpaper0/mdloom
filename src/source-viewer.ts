/**
 * Runs inside the Output HTML. Same `file://` constraint as the Diagram
 * Viewer (see `diagram-viewer.ts`): no fetch, no external links, and script-
 * driven `data:` navigation is blocked by Chrome. The Document's raw
 * Markdown text is embedded ahead of time in a hidden element (its HTML
 * entities decoded back to the original text via `.textContent`), so
 * clicking the trigger only needs to serialize that text into a Blob URL and
 * open it in a new tab — the same mechanism the Diagram Viewer uses for SVG.
 *
 * The Blob is typed `text/plain` (not `text/markdown`): browsers reliably
 * render `text/plain` inline, while less common text subtypes risk a
 * download prompt in some browsers instead of inline display.
 */
export const SOURCE_VIEWER_SCRIPT = `(function () {
  var trigger = document.getElementById("mdloom-source-viewer-trigger");
  var source = document.getElementById("mdloom-source");
  if (!trigger || !source) {
    return;
  }
  trigger.addEventListener("click", function () {
    var blob = new Blob([source.textContent], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 60000);
  });
})();`;
