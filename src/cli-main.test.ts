import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { run } from "./cli-main.js";
import { DEFAULT_THEME_CSS } from "./theme.js";

describe("run", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "mdloom-cli-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("prints the default theme css for the css subcommand", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const exitCode = await run(["css"]);

    expect(exitCode).toBe(0);
    expect(write).toHaveBeenCalledWith(DEFAULT_THEME_CSS);
    write.mockRestore();
  });

  it("converts a markdown file into a self-contained html Output", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n\nWorld.\n", "utf-8");

    const exitCode = await run([input, "-o", output]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain("<title>doc</title>");
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain(DEFAULT_THEME_CSS);
    expect(html).toContain('<div id="mdloom-source" hidden># Hello');
  });

  it("uses a custom --css file in place of the Default Theme", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    const css = join(dir, "custom.css");
    await writeFile(input, "# Hello\n", "utf-8");
    await writeFile(css, ".markdown-body { color: blue; }", "utf-8");

    const exitCode = await run([input, "-o", output, "--css", css]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(".markdown-body { color: blue; }");
    expect(html).not.toContain(DEFAULT_THEME_CSS);
  });

  it("layers a --font css file on top of the theme", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    const font = join(dir, "font.css");
    await writeFile(input, "# Hello\n", "utf-8");
    await writeFile(font, "@font-face { font-family: Custom; }", "utf-8");

    const exitCode = await run([input, "-o", output, "--font", font]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(DEFAULT_THEME_CSS);
    expect(html).toContain("@font-face { font-family: Custom; }");
  });

  it("embeds a local Image referenced relative to the input file, regardless of cwd", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    const bytes = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    );
    await writeFile(join(dir, "photo.png"), bytes);
    await writeFile(input, "![a photo](photo.png)\n", "utf-8");

    const exitCode = await run([input, "-o", output]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(`data:image/png;base64,${bytes.toString("base64")}`);
    expect(html).toContain('class="mdloom-image"');
  });

  it("fails when a referenced local image is missing", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "![missing](missing.png)\n", "utf-8");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run([input, "-o", output]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('failed to read image "missing.png"'),
    );
    error.mockRestore();
  });

  it("fails with a usage message when -o is missing", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run([join(dir, "doc.md")]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("usage: mdloom"),
    );
    error.mockRestore();
  });

  it("fails when the input file doesn't exist", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run([
      join(dir, "missing.md"),
      "-o",
      join(dir, "out.html"),
    ]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("mdloom:"));
    error.mockRestore();
  });
});
