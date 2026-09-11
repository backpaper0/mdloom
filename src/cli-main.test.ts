import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { run } from "./cli-main.js";
import {
  DEFAULT_THEME_CSS,
  FOREST_THEME_CSS,
  OCEAN_THEME_CSS,
  STONE_THEME_CSS,
  SUNSET_THEME_CSS,
} from "./theme.js";

describe("run", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "mdloom-cli-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("prints all Theme names, one per line, for the theme list subcommand", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const exitCode = await run(["theme", "list"]);

    expect(exitCode).toBe(0);
    expect(write).toHaveBeenCalledWith(
      "default\nocean\nforest\nsunset\nstone\n",
    );
    write.mockRestore();
  });

  it("prints the Default Theme css for the theme css subcommand when the name is omitted", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const exitCode = await run(["theme", "css"]);

    expect(exitCode).toBe(0);
    expect(write).toHaveBeenCalledWith(DEFAULT_THEME_CSS);
    write.mockRestore();
  });

  it.each([
    ["ocean", OCEAN_THEME_CSS],
    ["forest", FOREST_THEME_CSS],
    ["sunset", SUNSET_THEME_CSS],
    ["stone", STONE_THEME_CSS],
  ])(
    "prints the %s Theme css for the theme css subcommand",
    async (name, css) => {
      const write = vi
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      const exitCode = await run(["theme", "css", name]);

      expect(exitCode).toBe(0);
      expect(write).toHaveBeenCalledWith(css);
      write.mockRestore();
    },
  );

  it("fails with an available-themes list when theme css names an unknown Theme", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run(["theme", "css", "nope"]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("default"));
    error.mockRestore();
  });

  it("falls through to a usage message when the old bare css subcommand is invoked", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run(["css"]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("usage: mdloom"),
    );
    error.mockRestore();
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
    // Default Theme が markdown-body / mdloom-diagram をスタイリングしていることの回帰確認
    expect(html).toContain(".markdown-body");
    expect(html).toContain(".mdloom-diagram");
  });

  it("uses the Default Theme css when --theme default is passed explicitly", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");

    const exitCode = await run([input, "-o", output, "--theme", "default"]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(DEFAULT_THEME_CSS);
  });

  it("uses the Ocean Theme css when --theme ocean is passed", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");

    const exitCode = await run([input, "-o", output, "--theme", "ocean"]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(OCEAN_THEME_CSS);
    expect(html).not.toContain(DEFAULT_THEME_CSS);
    // Ocean ThemeがDefault Themeとセレクタ構成・装飾を共有していることの回帰確認
    expect(html).toContain(".markdown-body");
    expect(html).toContain(".mdloom-diagram");
  });

  it("uses the Forest Theme css when --theme forest is passed", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");

    const exitCode = await run([input, "-o", output, "--theme", "forest"]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(FOREST_THEME_CSS);
    expect(html).not.toContain(DEFAULT_THEME_CSS);
    // Forest ThemeがDefault Themeとセレクタ構成・装飾を共有していることの回帰確認
    expect(html).toContain(".markdown-body");
    expect(html).toContain(".mdloom-diagram");
  });

  it("uses the Sunset Theme css when --theme sunset is passed", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");

    const exitCode = await run([input, "-o", output, "--theme", "sunset"]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(SUNSET_THEME_CSS);
    expect(html).not.toContain(DEFAULT_THEME_CSS);
    // Sunset ThemeがDefault Themeとセレクタ構成・装飾を共有していることの回帰確認
    expect(html).toContain(".markdown-body");
    expect(html).toContain(".mdloom-diagram");
  });

  it("uses the Stone Theme css when --theme stone is passed", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");

    const exitCode = await run([input, "-o", output, "--theme", "stone"]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(STONE_THEME_CSS);
    expect(html).not.toContain(DEFAULT_THEME_CSS);
    // Stone ThemeがDefault Themeとセレクタ構成・装飾を共有していることの回帰確認
    expect(html).toContain(".markdown-body");
    expect(html).toContain(".mdloom-diagram");
  });

  it("fails with an available-themes list when --theme names an unknown Theme", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    await writeFile(input, "# Hello\n", "utf-8");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run([input, "-o", output, "--theme", "nope"]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("default"));
    error.mockRestore();
  });

  it.each(["constructor", "toString", "hasOwnProperty", "__proto__"])(
    "fails with an available-themes list when --theme is the Object.prototype property %s",
    async (name) => {
      const input = join(dir, "doc.md");
      const output = join(dir, "doc.html");
      await writeFile(input, "# Hello\n", "utf-8");
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      const exitCode = await run([input, "-o", output, "--theme", name]);

      expect(exitCode).toBe(1);
      expect(error).toHaveBeenCalledWith(expect.stringContaining("default"));
      error.mockRestore();
    },
  );

  it("fails when --theme and --css are passed together", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    const css = join(dir, "custom.css");
    await writeFile(input, "# Hello\n", "utf-8");
    await writeFile(css, ".markdown-body { color: blue; }", "utf-8");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const exitCode = await run([
      input,
      "-o",
      output,
      "--theme",
      "default",
      "--css",
      css,
    ]);

    expect(exitCode).toBe(1);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("layers a --font css file on top of a --theme selection", async () => {
    const input = join(dir, "doc.md");
    const output = join(dir, "doc.html");
    const font = join(dir, "font.css");
    await writeFile(input, "# Hello\n", "utf-8");
    await writeFile(font, "@font-face { font-family: Custom; }", "utf-8");

    const exitCode = await run([
      input,
      "-o",
      output,
      "--theme",
      "default",
      "--font",
      font,
    ]);

    expect(exitCode).toBe(0);
    const html = await readFile(output, "utf-8");
    expect(html).toContain(DEFAULT_THEME_CSS);
    expect(html).toContain("@font-face { font-family: Custom; }");
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

  it("prints a usage message and exits 0 for --help", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const exitCode = await run(["--help"]);

    expect(exitCode).toBe(0);
    expect(write).toHaveBeenCalledWith(
      expect.stringContaining("usage: mdloom"),
    );
    write.mockRestore();
  });

  it("prints a usage message and exits 0 for -h", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const exitCode = await run(["-h"]);

    expect(exitCode).toBe(0);
    expect(write).toHaveBeenCalledWith(
      expect.stringContaining("usage: mdloom"),
    );
    write.mockRestore();
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
