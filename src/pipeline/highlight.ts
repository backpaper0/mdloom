import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
} from "shiki";

const SHIKI_THEME = "catppuccin-latte";
const FALLBACK_LANG = "text";

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [SHIKI_THEME],
    langs: [],
  });
  return highlighterPromise;
}

/**
 * Highlights a fenced code block into a self-contained `<pre>` HTML string
 * (inline styles, no runtime JS, no separate stylesheet). Falls back to
 * unhighlighted plaintext when `lang` isn't a language Shiki recognizes.
 */
export async function highlightCode(
  code: string,
  lang: string | null,
): Promise<string> {
  const highlighter = await getHighlighter();
  const requestedLang = lang ?? FALLBACK_LANG;

  if (
    requestedLang !== FALLBACK_LANG &&
    !highlighter.getLoadedLanguages().includes(requestedLang)
  ) {
    try {
      await highlighter.loadLanguage(requestedLang as BundledLanguage);
    } catch {
      return highlightCode(code, FALLBACK_LANG);
    }
  }

  return highlighter.codeToHtml(code, {
    lang: requestedLang,
    theme: SHIKI_THEME,
  });
}
