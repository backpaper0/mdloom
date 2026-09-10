import { readFile, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { parseArgs } from "node:util";
import { buildHtmlDocument } from "./document.js";
import { convertMarkdownToHtml } from "./pipeline/index.js";
import { DEFAULT_THEME_CSS } from "./theme.js";

const USAGE = `usage: mdloom <input.md> -o <output.html> [--css <path>] [--font <path>]
       mdloom css`;

/**
 * Runs the mdloom CLI. Returns the process exit code rather than calling
 * `process.exit` so the entry point (`cli.ts`) stays a thin wrapper and this
 * is straightforward to exercise in tests.
 */
export async function run(argv: readonly string[]): Promise<number> {
  if (argv[0] === "css") {
    process.stdout.write(DEFAULT_THEME_CSS);
    return 0;
  }

  let values: { output?: string; css?: string; font?: string };
  let positionals: string[];
  try {
    ({ values, positionals } = parseArgs({
      args: argv as string[],
      options: {
        output: { type: "string", short: "o" },
        css: { type: "string" },
        font: { type: "string" },
      },
      allowPositionals: true,
    }));
  } catch (error) {
    console.error(`mdloom: ${(error as Error).message}\n${USAGE}`);
    return 1;
  }

  const input = positionals[0];
  if (!input || !values.output) {
    console.error(USAGE);
    return 1;
  }

  try {
    const markdown = await readFile(input, "utf-8");
    const contentHtml = await convertMarkdownToHtml(markdown);
    const css = values.css
      ? await readFile(values.css, "utf-8")
      : DEFAULT_THEME_CSS;
    const fontCss = values.font
      ? await readFile(values.font, "utf-8")
      : undefined;
    const title = basename(input, extname(input));

    const html = buildHtmlDocument({
      title,
      contentHtml,
      css,
      fontCss,
      markdownSource: markdown,
    });
    await writeFile(values.output, html, "utf-8");
    return 0;
  } catch (error) {
    console.error(`mdloom: ${(error as Error).message}`);
    return 1;
  }
}
