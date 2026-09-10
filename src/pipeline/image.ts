import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const MIME_TYPES: Readonly<Record<string, string>> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const REMOTE_URL_PATTERN = /^([a-z][a-z0-9+.-]*:)?\/\//i;

/**
 * Resolves a single Image's `url` (the `path` in a Markdown `![alt](path)`)
 * to a `data:` URI, so it embeds into the self-contained Output like a
 * Diagram does. Remote URLs (`http://`, `https://`, protocol-relative `//`)
 * and `data:` URIs already present in the source are returned unchanged:
 * mdloom does no network access at build time, and an already-embedded
 * image needs no further work. `url` is resolved against `baseDir` (the
 * Document's directory), matching how a browser resolves a relative image
 * path next to the Markdown file it's referenced from.
 */
export async function embedImage(
  url: string,
  baseDir: string,
): Promise<string> {
  if (REMOTE_URL_PATTERN.test(url) || url.startsWith("data:")) {
    return url;
  }

  const ext = extname(url).toLowerCase();
  const mimeType = MIME_TYPES[ext];
  if (!mimeType) {
    throw new Error(
      `mdloom: unsupported image extension "${ext}" for image "${url}"`,
    );
  }

  const path = resolve(baseDir, url);
  let bytes: Buffer;
  try {
    bytes = await readFile(path);
  } catch (error) {
    throw new Error(
      `mdloom: failed to read image "${url}" (resolved to "${path}"): ${(error as Error).message}`,
    );
  }

  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}
