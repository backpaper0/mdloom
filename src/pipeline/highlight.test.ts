import { describe, expect, it } from "vitest";
import { highlightCode } from "./highlight.js";

describe("highlightCode", () => {
  it("highlights a known language into a self-contained pre block", async () => {
    const html = await highlightCode("const x: number = 1;", "ts");

    expect(html).toContain('<pre class="shiki');
    expect(html).toContain("style=");
    expect(html).not.toContain("<script");
  });

  it("renders plaintext without lang", async () => {
    const html = await highlightCode("hello world", null);

    expect(html).toContain('<pre class="shiki');
    expect(html).toContain("hello world");
  });

  it("falls back to plaintext for an unrecognized language", async () => {
    const html = await highlightCode("some text", "not-a-real-language");

    expect(html).toContain('<pre class="shiki');
    expect(html).toContain("some text");
  });

  it("HTML-escapes code content", async () => {
    const html = await highlightCode("<script>alert(1)</script>", null);

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&#x3C;script>alert(1)&#x3C;/script>");
  });
});
