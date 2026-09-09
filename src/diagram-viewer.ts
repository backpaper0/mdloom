/**
 * Runs inside the Output HTML. The Output is opened via `file://` with no
 * external assets, so the Diagram Viewer can't fetch or link to anything
 * external: clicking a Diagram serializes its inline SVG into a Blob URL and
 * opens that in a new tab via `window.open`. This is the only mechanism
 * issue #6 found that works from `file://` — `data:` URL navigation
 * triggered from script (an `<a>` click or `window.open` directly) is
 * silently blocked by Chrome.
 */
export const DIAGRAM_VIEWER_SCRIPT = `(function () {
  function openDiagram(svg) {
    var markup = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([markup], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  document.querySelectorAll(".mdloom-diagram").forEach(function (wrapper) {
    var svg = wrapper.querySelector("svg");
    if (!svg) {
      return;
    }
    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("tabindex", "0");
    wrapper.addEventListener("click", function () {
      openDiagram(svg);
    });
    wrapper.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDiagram(svg);
      }
    });
  });
})();`;
