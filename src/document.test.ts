import { describe, expect, it } from "vitest";
import { buildHtmlDocument } from "./document.js";

describe("buildHtmlDocument", () => {
  it("assembles a self-contained document with the given title, content, and css", () => {
    const html = buildHtmlDocument({
      title: "My Doc",
      contentHtml: "<h1>Hello</h1>",
      css: ".markdown-body { color: red; }",
      markdownSource: "# Hello",
    });

    expect(html).toContain("<title>My Doc</title>");
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain(".markdown-body { color: red; }");
    expect(html).toContain('class="markdown-body"');
    expect(html).toContain('querySelectorAll(".mdloom-diagram")');
  });

  it("escapes the title", () => {
    const html = buildHtmlDocument({
      title: "<script>alert(1)</script>",
      contentHtml: "",
      css: "",
      markdownSource: "",
    });

    expect(html).toContain(
      "<title>&lt;script&gt;alert(1)&lt;/script&gt;</title>",
    );
  });

  it("layers font css after the theme css so it can override it", () => {
    const html = buildHtmlDocument({
      title: "t",
      contentHtml: "",
      css: "body { font-family: system-ui; }",
      fontCss:
        "@font-face { font-family: Custom; src: url(data:font/woff2;base64,AAA); }",
      markdownSource: "",
    });

    const cssIndex = html.indexOf("font-family: system-ui");
    const fontCssIndex = html.indexOf("@font-face");
    expect(cssIndex).toBeGreaterThanOrEqual(0);
    expect(fontCssIndex).toBeGreaterThan(cssIndex);
  });

  it("omits nothing extra when fontCss is absent", () => {
    const html = buildHtmlDocument({
      title: "t",
      contentHtml: "",
      css: "",
      markdownSource: "",
    });

    expect(html).not.toContain("undefined");
  });

  it("embeds the Source Viewer trigger and script", () => {
    const html = buildHtmlDocument({
      title: "t",
      contentHtml: "",
      css: "",
      markdownSource: "# Hello",
    });

    expect(html).toContain('id="mdloom-source-viewer-trigger"');
    expect(html).toContain('getElementById("mdloom-source-viewer-trigger")');
  });

  it("embeds the raw markdown source, HTML-escaped, for the Source Viewer to read", () => {
    const html = buildHtmlDocument({
      title: "t",
      contentHtml: "",
      css: "",
      markdownSource: "# Hi <b>&</b>\n\nsome `code`",
    });

    expect(html).toContain(
      '<div id="mdloom-source" hidden># Hi &lt;b&gt;&amp;&lt;/b&gt;\n\nsome `code`</div>',
    );
  });
});
