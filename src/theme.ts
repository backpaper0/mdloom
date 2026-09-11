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
 * mdloom Ocean Theme.
 * 元データ: プロトタイプブランチ `prototype/theme-candidates` の
 * `src/theme-candidates.prototype.html` (ocean候補)。
 * 海をイメージした青緑系、ディープティール見出し・シアン寄りブルーのアクセント。
 * セレクタ構成・装飾はDefault Themeと同一構造で、配色値のみが異なる(ADR 0003)。
 */
export const OCEAN_THEME_CSS = `:root {
  --ocean-bg: #f7fdff;
  --ocean-text: #3f5866;
  --ocean-heading: #2c6e8f;
  --ocean-pink: #cdeeff;
  --ocean-purple: #c8f0e5;
  --ocean-blue: #d0e4ff;
  --ocean-mint: #cdf7f0;
  --ocean-yellow: #eaf6ff;
  --ocean-peach: #ffe0d0;
  --ocean-border: #d8eef5;
  --ocean-accent: #4fa8c9;
  --ocean-link: #2f8fb0;
  --ocean-code-bg: #eef9fb;
  --ocean-quote-bg: #eafbfa;
  --ocean-shadow: rgba(47, 143, 176, 0.15);
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
  background: var(--ocean-bg);
  color: var(--ocean-text);
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
  color: var(--ocean-heading);
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
}

.markdown-body h1 {
  font-size: 2.2em;
  padding-bottom: 0.4em;
  background: linear-gradient(120deg, #2f8fb0, #4fa8c9, #6ac6d9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--ocean-pink), var(--ocean-purple), var(--ocean-blue)) 1;
}

.markdown-body h2 {
  font-size: 1.6em;
  padding: 0.2em 0.7em;
  border-left: 6px solid var(--ocean-accent);
  background: linear-gradient(90deg, var(--ocean-purple), transparent);
  border-radius: 0 8px 8px 0;
}

.markdown-body h3 {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 2px dashed var(--ocean-border);
}

.markdown-body h4 {
  font-size: 1.1em;
}

.markdown-body h4::before {
  content: "✿ ";
  color: var(--ocean-accent);
}

/* Links */
.markdown-body a {
  color: var(--ocean-link);
  text-decoration: none;
  border-bottom: 1px solid var(--ocean-accent);
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  color: var(--ocean-heading);
  background: var(--ocean-purple);
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
  color: var(--ocean-accent);
}

.markdown-body ol li::marker {
  color: var(--ocean-accent);
  font-weight: 700;
}

/* Blockquote */
.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.4em;
  background: var(--ocean-quote-bg);
  border-left: 5px solid var(--ocean-accent);
  border-radius: 0 10px 10px 0;
  color: var(--ocean-text);
  box-shadow: 0 2px 8px var(--ocean-shadow);
}

.markdown-body blockquote p {
  margin: 0.3em 0;
}

/* Inline code */
.markdown-body code {
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  background: var(--ocean-code-bg);
  color: #1f7a99;
  padding: 0.15em 0.45em;
  border-radius: 6px;
  font-size: 0.9em;
}

/* Code block */
.markdown-body pre {
  background: var(--ocean-code-bg);
  padding: 1.2em;
  border-radius: 12px;
  overflow: auto;
  border: 1px solid var(--ocean-border);
  box-shadow: 0 4px 14px var(--ocean-shadow);
}

.markdown-body pre code {
  background: transparent;
  color: var(--ocean-text);
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
  box-shadow: 0 4px 14px var(--ocean-shadow);
}

.markdown-body th {
  background: linear-gradient(120deg, var(--ocean-purple), var(--ocean-pink));
  color: var(--ocean-heading);
  font-weight: 700;
  padding: 0.7em 1em;
  text-align: left;
}

.markdown-body td {
  padding: 0.6em 1em;
  border-top: 1px solid var(--ocean-border);
}

.markdown-body tr:nth-child(even) td {
  background: var(--ocean-quote-bg);
}

.markdown-body tr:hover td {
  background: var(--ocean-blue);
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  height: 3px;
  margin: 2.5em 0;
  background: linear-gradient(90deg, transparent, var(--ocean-pink), var(--ocean-purple), var(--ocean-blue), transparent);
  border-radius: 3px;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px var(--ocean-shadow);
}

/* Image Viewer への導線 (CONTEXT.md: Image / Image Viewer) */
.mdloom-image {
  cursor: zoom-in;
}

.mdloom-image:hover,
.mdloom-image:focus-visible {
  box-shadow: 0 8px 24px var(--ocean-shadow);
  outline: none;
}

/* Task lists */
.markdown-body input[type="checkbox"] {
  accent-color: var(--ocean-accent);
  width: 1.05em;
  height: 1.05em;
  vertical-align: middle;
}

/* Emphasis */
.markdown-body strong {
  color: var(--ocean-heading);
  font-weight: 700;
}

.markdown-body mark {
  background: var(--ocean-yellow);
  color: var(--ocean-text);
  padding: 0.1em 0.3em;
  border-radius: 4px;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer) */
.mdloom-diagram {
  position: relative;
  margin: 1.4em 0;
  background: var(--ocean-quote-bg);
  border: 1px solid var(--ocean-border);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--ocean-shadow);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 6px 20px var(--ocean-shadow);
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
  color: var(--ocean-heading);
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
  color: var(--ocean-heading);
  background: var(--ocean-quote-bg);
  border: 1px solid var(--ocean-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.mdloom-source-viewer-trigger:hover,
.mdloom-source-viewer-trigger:focus-visible {
  box-shadow: 0 4px 14px var(--ocean-shadow);
  outline: none;
}
`;

/**
 * mdloom Forest Theme.
 * 元データ: プロトタイプブランチ `prototype/theme-candidates` の
 * `src/theme-candidates.prototype.html` (forest候補)。
 * 森をイメージした緑系、オリーブグリーン見出し・若葉グリーンのアクセント。
 * セレクタ構成・装飾はDefault Themeと同一構造で、配色値のみが異なる(ADR 0003)。
 */
export const FOREST_THEME_CSS = `:root {
  --forest-bg: #fafdf7;
  --forest-text: #445840;
  --forest-heading: #4a7a3f;
  --forest-pink: #dcf5cf;
  --forest-purple: #e3edc8;
  --forest-blue: #cdeedc;
  --forest-mint: #d6f5df;
  --forest-yellow: #f3f5c8;
  --forest-peach: #f0e4b0;
  --forest-border: #e3ecd8;
  --forest-accent: #7fae52;
  --forest-link: #5c8f3c;
  --forest-code-bg: #f2f7ec;
  --forest-quote-bg: #f1f7ea;
  --forest-shadow: rgba(92, 143, 60, 0.15);
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
  background: var(--forest-bg);
  color: var(--forest-text);
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
  color: var(--forest-heading);
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
}

.markdown-body h1 {
  font-size: 2.2em;
  padding-bottom: 0.4em;
  background: linear-gradient(120deg, #5c8f3c, #7fae52, #9fc46a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--forest-pink), var(--forest-purple), var(--forest-blue)) 1;
}

.markdown-body h2 {
  font-size: 1.6em;
  padding: 0.2em 0.7em;
  border-left: 6px solid var(--forest-accent);
  background: linear-gradient(90deg, var(--forest-purple), transparent);
  border-radius: 0 8px 8px 0;
}

.markdown-body h3 {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 2px dashed var(--forest-border);
}

.markdown-body h4 {
  font-size: 1.1em;
}

.markdown-body h4::before {
  content: "✿ ";
  color: var(--forest-accent);
}

/* Links */
.markdown-body a {
  color: var(--forest-link);
  text-decoration: none;
  border-bottom: 1px solid var(--forest-accent);
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  color: var(--forest-heading);
  background: var(--forest-purple);
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
  color: var(--forest-accent);
}

.markdown-body ol li::marker {
  color: var(--forest-accent);
  font-weight: 700;
}

/* Blockquote */
.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.4em;
  background: var(--forest-quote-bg);
  border-left: 5px solid var(--forest-accent);
  border-radius: 0 10px 10px 0;
  color: var(--forest-text);
  box-shadow: 0 2px 8px var(--forest-shadow);
}

.markdown-body blockquote p {
  margin: 0.3em 0;
}

/* Inline code */
.markdown-body code {
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  background: var(--forest-code-bg);
  color: #4a7a2f;
  padding: 0.15em 0.45em;
  border-radius: 6px;
  font-size: 0.9em;
}

/* Code block */
.markdown-body pre {
  background: var(--forest-code-bg);
  padding: 1.2em;
  border-radius: 12px;
  overflow: auto;
  border: 1px solid var(--forest-border);
  box-shadow: 0 4px 14px var(--forest-shadow);
}

.markdown-body pre code {
  background: transparent;
  color: var(--forest-text);
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
  box-shadow: 0 4px 14px var(--forest-shadow);
}

.markdown-body th {
  background: linear-gradient(120deg, var(--forest-purple), var(--forest-pink));
  color: var(--forest-heading);
  font-weight: 700;
  padding: 0.7em 1em;
  text-align: left;
}

.markdown-body td {
  padding: 0.6em 1em;
  border-top: 1px solid var(--forest-border);
}

.markdown-body tr:nth-child(even) td {
  background: var(--forest-quote-bg);
}

.markdown-body tr:hover td {
  background: var(--forest-blue);
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  height: 3px;
  margin: 2.5em 0;
  background: linear-gradient(90deg, transparent, var(--forest-pink), var(--forest-purple), var(--forest-blue), transparent);
  border-radius: 3px;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px var(--forest-shadow);
}

/* Image Viewer への導線 (CONTEXT.md: Image / Image Viewer) */
.mdloom-image {
  cursor: zoom-in;
}

.mdloom-image:hover,
.mdloom-image:focus-visible {
  box-shadow: 0 8px 24px var(--forest-shadow);
  outline: none;
}

/* Task lists */
.markdown-body input[type="checkbox"] {
  accent-color: var(--forest-accent);
  width: 1.05em;
  height: 1.05em;
  vertical-align: middle;
}

/* Emphasis */
.markdown-body strong {
  color: var(--forest-heading);
  font-weight: 700;
}

.markdown-body mark {
  background: var(--forest-yellow);
  color: var(--forest-text);
  padding: 0.1em 0.3em;
  border-radius: 4px;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer) */
.mdloom-diagram {
  position: relative;
  margin: 1.4em 0;
  background: var(--forest-quote-bg);
  border: 1px solid var(--forest-border);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--forest-shadow);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 6px 20px var(--forest-shadow);
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
  color: var(--forest-heading);
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
  color: var(--forest-heading);
  background: var(--forest-quote-bg);
  border: 1px solid var(--forest-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.mdloom-source-viewer-trigger:hover,
.mdloom-source-viewer-trigger:focus-visible {
  box-shadow: 0 4px 14px var(--forest-shadow);
  outline: none;
}
`;

/**
 * mdloom Sunset Theme.
 * 元データ: プロトタイプブランチ `prototype/theme-candidates` の
 * `src/theme-candidates.prototype.html` (sunset候補)。
 * 夕焼けをイメージした橙赤系、赤茶見出し・コーラルオレンジのアクセント。
 * セレクタ構成・装飾はDefault Themeと同一構造で、配色値のみが異なる(ADR 0003)。
 */
export const SUNSET_THEME_CSS = `:root {
  --sunset-bg: #fffaf7;
  --sunset-text: #664a42;
  --sunset-heading: #b5502f;
  --sunset-pink: #ffd9c2;
  --sunset-purple: #ffe3c8;
  --sunset-blue: #ffd0cc;
  --sunset-mint: #ffe9b8;
  --sunset-yellow: #fff0cc;
  --sunset-peach: #ffcbb0;
  --sunset-border: #f5e2d6;
  --sunset-accent: #e0764a;
  --sunset-link: #d1602f;
  --sunset-code-bg: #fdf1e9;
  --sunset-quote-bg: #fef2ea;
  --sunset-shadow: rgba(224, 118, 74, 0.15);
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
  background: var(--sunset-bg);
  color: var(--sunset-text);
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
  color: var(--sunset-heading);
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
}

.markdown-body h1 {
  font-size: 2.2em;
  padding-bottom: 0.4em;
  background: linear-gradient(120deg, #d1602f, #e0764a, #eb9a5f);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--sunset-pink), var(--sunset-purple), var(--sunset-blue)) 1;
}

.markdown-body h2 {
  font-size: 1.6em;
  padding: 0.2em 0.7em;
  border-left: 6px solid var(--sunset-accent);
  background: linear-gradient(90deg, var(--sunset-purple), transparent);
  border-radius: 0 8px 8px 0;
}

.markdown-body h3 {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 2px dashed var(--sunset-border);
}

.markdown-body h4 {
  font-size: 1.1em;
}

.markdown-body h4::before {
  content: "✿ ";
  color: var(--sunset-accent);
}

/* Links */
.markdown-body a {
  color: var(--sunset-link);
  text-decoration: none;
  border-bottom: 1px solid var(--sunset-accent);
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  color: var(--sunset-heading);
  background: var(--sunset-purple);
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
  color: var(--sunset-accent);
}

.markdown-body ol li::marker {
  color: var(--sunset-accent);
  font-weight: 700;
}

/* Blockquote */
.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.4em;
  background: var(--sunset-quote-bg);
  border-left: 5px solid var(--sunset-accent);
  border-radius: 0 10px 10px 0;
  color: var(--sunset-text);
  box-shadow: 0 2px 8px var(--sunset-shadow);
}

.markdown-body blockquote p {
  margin: 0.3em 0;
}

/* Inline code */
.markdown-body code {
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  background: var(--sunset-code-bg);
  color: #c05a2f;
  padding: 0.15em 0.45em;
  border-radius: 6px;
  font-size: 0.9em;
}

/* Code block */
.markdown-body pre {
  background: var(--sunset-code-bg);
  padding: 1.2em;
  border-radius: 12px;
  overflow: auto;
  border: 1px solid var(--sunset-border);
  box-shadow: 0 4px 14px var(--sunset-shadow);
}

.markdown-body pre code {
  background: transparent;
  color: var(--sunset-text);
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
  box-shadow: 0 4px 14px var(--sunset-shadow);
}

.markdown-body th {
  background: linear-gradient(120deg, var(--sunset-purple), var(--sunset-pink));
  color: var(--sunset-heading);
  font-weight: 700;
  padding: 0.7em 1em;
  text-align: left;
}

.markdown-body td {
  padding: 0.6em 1em;
  border-top: 1px solid var(--sunset-border);
}

.markdown-body tr:nth-child(even) td {
  background: var(--sunset-quote-bg);
}

.markdown-body tr:hover td {
  background: var(--sunset-blue);
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  height: 3px;
  margin: 2.5em 0;
  background: linear-gradient(90deg, transparent, var(--sunset-pink), var(--sunset-purple), var(--sunset-blue), transparent);
  border-radius: 3px;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px var(--sunset-shadow);
}

/* Image Viewer への導線 (CONTEXT.md: Image / Image Viewer) */
.mdloom-image {
  cursor: zoom-in;
}

.mdloom-image:hover,
.mdloom-image:focus-visible {
  box-shadow: 0 8px 24px var(--sunset-shadow);
  outline: none;
}

/* Task lists */
.markdown-body input[type="checkbox"] {
  accent-color: var(--sunset-accent);
  width: 1.05em;
  height: 1.05em;
  vertical-align: middle;
}

/* Emphasis */
.markdown-body strong {
  color: var(--sunset-heading);
  font-weight: 700;
}

.markdown-body mark {
  background: var(--sunset-yellow);
  color: var(--sunset-text);
  padding: 0.1em 0.3em;
  border-radius: 4px;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer) */
.mdloom-diagram {
  position: relative;
  margin: 1.4em 0;
  background: var(--sunset-quote-bg);
  border: 1px solid var(--sunset-border);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--sunset-shadow);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 6px 20px var(--sunset-shadow);
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
  color: var(--sunset-heading);
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
  color: var(--sunset-heading);
  background: var(--sunset-quote-bg);
  border: 1px solid var(--sunset-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.mdloom-source-viewer-trigger:hover,
.mdloom-source-viewer-trigger:focus-visible {
  box-shadow: 0 4px 14px var(--sunset-shadow);
  outline: none;
}
`;

/**
 * mdloom Stone Theme.
 * 元データ: プロトタイプブランチ `prototype/theme-candidates` の
 * `src/theme-candidates.prototype.html` (stone候補)。
 * 低彩度のグレー/ベージュ系、はっきりした色相を避けた落ち着いた配色。
 * セレクタ構成・装飾はDefault Themeと同一構造で、配色値のみが異なる(ADR 0003)。
 */
export const STONE_THEME_CSS = `:root {
  --stone-bg: #fafaf9;
  --stone-text: #52514c;
  --stone-heading: #6b6b63;
  --stone-pink: #e8e6e0;
  --stone-purple: #e2e2df;
  --stone-blue: #dde1e0;
  --stone-mint: #e0e5df;
  --stone-yellow: #f0ebdc;
  --stone-peach: #ece3d8;
  --stone-border: #e4e2dc;
  --stone-accent: #9c9890;
  --stone-link: #7a776d;
  --stone-code-bg: #f2f1ed;
  --stone-quote-bg: #f3f2ee;
  --stone-shadow: rgba(120, 118, 110, 0.15);
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
  background: var(--stone-bg);
  color: var(--stone-text);
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
  color: var(--stone-heading);
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
}

.markdown-body h1 {
  font-size: 2.2em;
  padding-bottom: 0.4em;
  background: linear-gradient(120deg, #6b6b63, #8a8880, #9c9890);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--stone-pink), var(--stone-purple), var(--stone-blue)) 1;
}

.markdown-body h2 {
  font-size: 1.6em;
  padding: 0.2em 0.7em;
  border-left: 6px solid var(--stone-accent);
  background: linear-gradient(90deg, var(--stone-purple), transparent);
  border-radius: 0 8px 8px 0;
}

.markdown-body h3 {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 2px dashed var(--stone-border);
}

.markdown-body h4 {
  font-size: 1.1em;
}

.markdown-body h4::before {
  content: "✿ ";
  color: var(--stone-accent);
}

/* Links */
.markdown-body a {
  color: var(--stone-link);
  text-decoration: none;
  border-bottom: 1px solid var(--stone-accent);
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  color: var(--stone-heading);
  background: var(--stone-purple);
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
  color: var(--stone-accent);
}

.markdown-body ol li::marker {
  color: var(--stone-accent);
  font-weight: 700;
}

/* Blockquote */
.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.4em;
  background: var(--stone-quote-bg);
  border-left: 5px solid var(--stone-accent);
  border-radius: 0 10px 10px 0;
  color: var(--stone-text);
  box-shadow: 0 2px 8px var(--stone-shadow);
}

.markdown-body blockquote p {
  margin: 0.3em 0;
}

/* Inline code */
.markdown-body code {
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  background: var(--stone-code-bg);
  color: #6f6a5c;
  padding: 0.15em 0.45em;
  border-radius: 6px;
  font-size: 0.9em;
}

/* Code block */
.markdown-body pre {
  background: var(--stone-code-bg);
  padding: 1.2em;
  border-radius: 12px;
  overflow: auto;
  border: 1px solid var(--stone-border);
  box-shadow: 0 4px 14px var(--stone-shadow);
}

.markdown-body pre code {
  background: transparent;
  color: var(--stone-text);
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
  box-shadow: 0 4px 14px var(--stone-shadow);
}

.markdown-body th {
  background: linear-gradient(120deg, var(--stone-purple), var(--stone-pink));
  color: var(--stone-heading);
  font-weight: 700;
  padding: 0.7em 1em;
  text-align: left;
}

.markdown-body td {
  padding: 0.6em 1em;
  border-top: 1px solid var(--stone-border);
}

.markdown-body tr:nth-child(even) td {
  background: var(--stone-quote-bg);
}

.markdown-body tr:hover td {
  background: var(--stone-blue);
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  height: 3px;
  margin: 2.5em 0;
  background: linear-gradient(90deg, transparent, var(--stone-pink), var(--stone-purple), var(--stone-blue), transparent);
  border-radius: 3px;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px var(--stone-shadow);
}

/* Image Viewer への導線 (CONTEXT.md: Image / Image Viewer) */
.mdloom-image {
  cursor: zoom-in;
}

.mdloom-image:hover,
.mdloom-image:focus-visible {
  box-shadow: 0 8px 24px var(--stone-shadow);
  outline: none;
}

/* Task lists */
.markdown-body input[type="checkbox"] {
  accent-color: var(--stone-accent);
  width: 1.05em;
  height: 1.05em;
  vertical-align: middle;
}

/* Emphasis */
.markdown-body strong {
  color: var(--stone-heading);
  font-weight: 700;
}

.markdown-body mark {
  background: var(--stone-yellow);
  color: var(--stone-text);
  padding: 0.1em 0.3em;
  border-radius: 4px;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer) */
.mdloom-diagram {
  position: relative;
  margin: 1.4em 0;
  background: var(--stone-quote-bg);
  border: 1px solid var(--stone-border);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--stone-shadow);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 6px 20px var(--stone-shadow);
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
  color: var(--stone-heading);
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
  color: var(--stone-heading);
  background: var(--stone-quote-bg);
  border: 1px solid var(--stone-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.mdloom-source-viewer-trigger:hover,
.mdloom-source-viewer-trigger:focus-visible {
  box-shadow: 0 4px 14px var(--stone-shadow);
  outline: none;
}
`;

/**
 * Theme名からCSSを引くレジストリ。新規Themeは、ここへ自己完結したCSS文字列を
 * 1エントリ追加するだけで済む(ADR 0003)。
 */
const THEMES: Readonly<Record<string, string>> = {
  default: DEFAULT_THEME_CSS,
  ocean: OCEAN_THEME_CSS,
  forest: FOREST_THEME_CSS,
  sunset: SUNSET_THEME_CSS,
  stone: STONE_THEME_CSS,
};

/** 利用可能なTheme名の一覧を返す。 */
export function listThemeNames(): string[] {
  return Object.keys(THEMES);
}

/** Theme名からCSS文字列を引く。未知のTheme名の場合は`undefined`を返す。 */
export function getThemeCss(name: string): string | undefined {
  return THEMES[name];
}
