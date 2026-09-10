/**
 * mdloom Default Theme.
 * 元データ: `markdown-pastel.css` (VS Code Markdown Preview 向けパステルテーマ)。
 * パステルピンク/パープル/ブルー、見出しのグラデーション、角丸12px、ソフトシャドウの配色。
 */
export const DEFAULT_THEME_CSS = `:root {
  --pastel-bg: #fdfcff;
  --pastel-text: #4a4458;
  --pastel-heading: #6a5d8f;
  --pastel-pink: #ffd6e8;
  --pastel-purple: #e5d4ff;
  --pastel-blue: #d4e8ff;
  --pastel-mint: #d4f5e9;
  --pastel-yellow: #fff3d4;
  --pastel-peach: #ffe4d6;
  --pastel-border: #ece7f5;
  --pastel-accent: #b8a4e0;
  --pastel-link: #a67fd4;
  --pastel-code-bg: #f5f1fb;
  --pastel-quote-bg: #f7f3ff;
  --pastel-shadow: rgba(184, 164, 224, 0.15);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

.markdown-body {
  font-family: "UD Digi Kyokasho NP-R", "UD Digi Kyokasho NP",
    "UD Digi Kyokasho N-R", "UD Digi Kyokasho N", "UDデジタル教科書体 NP-R",
    "Segoe UI", "Yu Gothic UI", "Meiryo", system-ui, sans-serif;
  background: var(--pastel-bg);
  color: var(--pastel-text);
  font-size: 15px;
  line-height: 1.85;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 3rem;
  letter-spacing: 0.02em;
}

/* Headings */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: var(--pastel-heading);
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
}

.markdown-body h1 {
  font-size: 2.2em;
  padding-bottom: 0.4em;
  background: linear-gradient(120deg, #d4548f, #8a5fd4, #4a7fd4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--pastel-pink), var(--pastel-purple), var(--pastel-blue)) 1;
}

.markdown-body h2 {
  font-size: 1.6em;
  padding: 0.2em 0.7em;
  border-left: 6px solid var(--pastel-accent);
  background: linear-gradient(90deg, var(--pastel-purple), transparent);
  border-radius: 0 8px 8px 0;
}

.markdown-body h3 {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 2px dashed var(--pastel-border);
}

.markdown-body h4 {
  font-size: 1.1em;
}

.markdown-body h4::before {
  content: "✿ ";
  color: var(--pastel-accent);
}

/* Links */
.markdown-body a {
  color: var(--pastel-link);
  text-decoration: none;
  border-bottom: 1px solid var(--pastel-accent);
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  color: var(--pastel-heading);
  background: var(--pastel-purple);
  border-radius: 3px;
}

/* Paragraphs & lists */
.markdown-body p {
  margin: 1em 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.6em;
}

.markdown-body li {
  margin: 0.4em 0;
}

.markdown-body ul li::marker {
  color: var(--pastel-accent);
}

.markdown-body ol li::marker {
  color: var(--pastel-accent);
  font-weight: 700;
}

/* Blockquote */
.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.4em;
  background: var(--pastel-quote-bg);
  border-left: 5px solid var(--pastel-accent);
  border-radius: 0 10px 10px 0;
  color: var(--pastel-text);
  box-shadow: 0 2px 8px var(--pastel-shadow);
}

.markdown-body blockquote p {
  margin: 0.3em 0;
}

/* Inline code */
.markdown-body code {
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  background: var(--pastel-code-bg);
  color: #b5588f;
  padding: 0.15em 0.45em;
  border-radius: 6px;
  font-size: 0.9em;
}

/* Code block */
.markdown-body pre {
  background: var(--pastel-code-bg);
  padding: 1.2em;
  border-radius: 12px;
  overflow: auto;
  border: 1px solid var(--pastel-border);
  box-shadow: 0 4px 14px var(--pastel-shadow);
}

.markdown-body pre code {
  background: transparent;
  color: var(--pastel-text);
  padding: 0;
  font-size: 1em;
  line-height: 1.6;
}

/* Tables */
.markdown-body table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 1.4em 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px var(--pastel-shadow);
}

.markdown-body th {
  background: linear-gradient(120deg, var(--pastel-purple), var(--pastel-pink));
  color: var(--pastel-heading);
  font-weight: 700;
  padding: 0.7em 1em;
  text-align: left;
}

.markdown-body td {
  padding: 0.6em 1em;
  border-top: 1px solid var(--pastel-border);
}

.markdown-body tr:nth-child(even) td {
  background: var(--pastel-quote-bg);
}

.markdown-body tr:hover td {
  background: var(--pastel-blue);
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  height: 3px;
  margin: 2.5em 0;
  background: linear-gradient(90deg, transparent, var(--pastel-pink), var(--pastel-purple), var(--pastel-blue), transparent);
  border-radius: 3px;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px var(--pastel-shadow);
}

/* Image Viewer への導線 (CONTEXT.md: Image / Image Viewer) */
.mdloom-image {
  cursor: zoom-in;
}

.mdloom-image:hover,
.mdloom-image:focus-visible {
  box-shadow: 0 8px 24px var(--pastel-shadow);
  outline: none;
}

/* Task lists */
.markdown-body input[type="checkbox"] {
  accent-color: var(--pastel-accent);
  width: 1.05em;
  height: 1.05em;
  vertical-align: middle;
}

/* Emphasis */
.markdown-body strong {
  color: var(--pastel-heading);
  font-weight: 700;
}

.markdown-body mark {
  background: var(--pastel-yellow);
  color: var(--pastel-text);
  padding: 0.1em 0.3em;
  border-radius: 4px;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer) */
.mdloom-diagram {
  position: relative;
  margin: 1.4em 0;
  background: var(--pastel-quote-bg);
  border: 1px solid var(--pastel-border);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--pastel-shadow);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 6px 20px var(--pastel-shadow);
  outline: none;
}

.mdloom-diagram svg {
  max-width: 100%;
  height: auto;
}

.mdloom-diagram::after {
  content: "\\1F50D クリックで拡大表示";
  display: block;
  margin-top: 0.8rem;
  font-size: 0.8em;
  color: var(--pastel-heading);
}

/* Source Viewer への導線 (CONTEXT.md: Source Viewer) */
.mdloom-toolbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 3rem 0;
  text-align: right;
}

.mdloom-source-viewer-trigger {
  font: inherit;
  font-size: 0.85em;
  color: var(--pastel-heading);
  background: var(--pastel-quote-bg);
  border: 1px solid var(--pastel-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.mdloom-source-viewer-trigger:hover,
.mdloom-source-viewer-trigger:focus-visible {
  box-shadow: 0 4px 14px var(--pastel-shadow);
  outline: none;
}
`;

/**
 * Theme名からCSSを引くレジストリ。現時点ではDefault Theme(`default`)のみ
 * を登録する。新規Themeは、ここへ自己完結したCSS文字列を1エントリ追加する
 * だけで済む(ADR 0003)。
 */
const THEMES: Readonly<Record<string, string>> = {
  default: DEFAULT_THEME_CSS,
};

/** 利用可能なTheme名の一覧を返す。 */
export function listThemeNames(): string[] {
  return Object.keys(THEMES);
}

/** Theme名からCSS文字列を引く。未知のTheme名の場合は`undefined`を返す。 */
export function getThemeCss(name: string): string | undefined {
  return THEMES[name];
}
