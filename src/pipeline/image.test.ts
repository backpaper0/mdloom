import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { embedImage } from "./image.js";

const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("embedImage", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "mdloom-image-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("embeds a local png as a base64 data URI", async () => {
    const bytes = Buffer.from(PNG_BASE64, "base64");
    await writeFile(join(dir, "photo.png"), bytes);

    const result = await embedImage("photo.png", dir);

    expect(result).toBe(`data:image/png;base64,${bytes.toString("base64")}`);
  });

  it("embeds a local svg with the svg mime type", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    await writeFile(join(dir, "icon.svg"), svg, "utf-8");

    const result = await embedImage("icon.svg", dir);

    expect(result).toBe(
      `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`,
    );
  });

  it("resolves a relative path against baseDir", async () => {
    await mkdir(join(dir, "assets"), { recursive: true });
    const bytes = Buffer.from(PNG_BASE64, "base64");
    await writeFile(join(dir, "assets", "photo.png"), bytes);

    const result = await embedImage("assets/photo.png", dir);

    expect(result).toBe(`data:image/png;base64,${bytes.toString("base64")}`);
  });

  it("leaves an http(s) URL unchanged", async () => {
    expect(await embedImage("https://example.com/a.png", dir)).toBe(
      "https://example.com/a.png",
    );
    expect(await embedImage("http://example.com/a.png", dir)).toBe(
      "http://example.com/a.png",
    );
  });

  it("leaves a protocol-relative URL unchanged", async () => {
    expect(await embedImage("//example.com/a.png", dir)).toBe(
      "//example.com/a.png",
    );
  });

  it("leaves an existing data: URI unchanged", async () => {
    expect(await embedImage("data:image/png;base64,AAA", dir)).toBe(
      "data:image/png;base64,AAA",
    );
  });

  it("throws for an unsupported image extension", async () => {
    await expect(embedImage("photo.bmp", dir)).rejects.toThrow(
      /unsupported image extension ".bmp"/,
    );
  });

  it("throws when the local file doesn't exist", async () => {
    await expect(embedImage("missing.png", dir)).rejects.toThrow(
      /failed to read image "missing.png"/,
    );
  });
});
