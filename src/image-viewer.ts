/**
 * Runs inside the Output HTML. Same `file://` constraint as the Diagram
 * Viewer and Source Viewer (see `diagram-viewer.ts`): clicking an embedded
 * Image converts its `data:` URI `src` into a Blob URL and opens that in a
 * new tab via `window.open`, the same mechanism the other two viewers use
 * (direct `data:` URL navigation is silently blocked by Chrome). `fetch()`
 * on a `data:` URL is handled locally by the browser with no network
 * involved, so this works from `file://` the same as everything else here.
 */
export const IMAGE_VIEWER_SCRIPT = `(function () {
  function openImage(img) {
    fetch(img.src)
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 60000);
      });
  }

  document.querySelectorAll(".mdloom-image").forEach(function (img) {
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.addEventListener("click", function () {
      openImage(img);
    });
    img.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(img);
      }
    });
  });
})();`;
