import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname } from "node:path";
import { parseArgs } from "node:util";
import { buildHtmlDocument } from "./document.js";
import { convertMarkdownToHtml } from "./pipeline/index.js";
import { DEFAULT_THEME_CSS, getThemeCss, listThemeNames } from "./theme.js";

const USAGE = `usage: mdloom <input.md> -o <output.html> [--theme <name>] [--css <path>] [--font <path>]
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

  let values: { output?: string; theme?: string; css?: string; font?: string };
  let positionals: string[];
  try {
    ({ values, positionals } = parseArgs({
      args: argv as string[],
      options: {
        output: { type: "string", short: "o" },
        theme: { type: "string" },
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

  if (values.theme !== undefined && values.css !== undefined) {
    console.error("mdloom: --theme and --css cannot be used together");
    return 1;
  }

  let themeCss = DEFAULT_THEME_CSS;
  if (values.theme !== undefined) {
    const css = getThemeCss(values.theme);
    if (css === undefined) {
      console.error(
        `mdloom: unknown theme "${values.theme}" (available: ${listThemeNames().join(", ")})`,
      );
      return 1;
    }
    themeCss = css;
  }

  try {
    const markdown = await readFile(input, "utf-8");
    const contentHtml = await convertMarkdownToHtml(markdown, dirname(input));
    const css = values.css ? await readFile(values.css, "utf-8") : themeCss;
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
