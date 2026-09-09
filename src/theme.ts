/**
 * mdloom Default Theme (issue #5 で決定した "Card Stack" バリアント).
 * 元データ: `prototype/theme-default` ブランチの `default-theme.css`。
 * markserve (https://github.com/backpaper0/markserve) のトーンを参考にした
 * パステルピンク/ブルー/ラベンダー、角丸16px/10px、ソフトシャドウの配色。
 */
export const DEFAULT_THEME_CSS = `:root {
  --font-system: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", "Noto Sans JP", Meiryo, sans-serif;

  --pastel-pink: #ffd6e8;
  --pastel-pink-strong: #ff8fb1;
  --pastel-blue: #cfe8ff;
  --pastel-blue-strong: #7fb8e8;
  --pastel-lavender: #e5d9ff;
  --pastel-lavender-strong: #b9a3f5;
  --text-main: #4a4a4a;
  --text-muted: #8a8a99;
  --bg: #fffdfb;
  --bg-soft: #fafbfe;
  --bg-code: #f6f4ff;
  --border-soft: #eee7fb;
  --radius-lg: 16px;
  --radius-md: 10px;
  --shadow-soft: 0 2px 10px rgba(120, 100, 160, 0.12);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-system);
  background: var(--bg);
  color: var(--text-main);
  line-height: 1.8;
}

.markdown-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.markdown-body h1 {
  font-size: 2rem;
  margin: 0 0 0.6em;
}

.markdown-body h2 {
  font-size: 1.4rem;
  margin: 2.2em 0 1em;
  padding-left: 0.7em;
  border-left: 6px solid var(--pastel-pink-strong);
  border-image: linear-gradient(var(--pastel-pink-strong), var(--pastel-blue-strong)) 1;
}

.markdown-body h3 {
  font-size: 1.1rem;
  margin: 1.6em 0 0.6em;
  color: var(--text-main);
}

.markdown-body p,
.markdown-body ul,
.markdown-body ol {
  margin: 0.9em 0;
}

.markdown-body a {
  color: var(--pastel-blue-strong);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body blockquote {
  margin: 1.2em 0;
  padding: 0.8em 1.2em;
  background: var(--bg-soft);
  border-left: 4px solid var(--pastel-lavender-strong);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-muted);
  box-shadow: var(--shadow-soft);
}

.markdown-body code {
  background: var(--bg-code);
  border-radius: 6px;
  padding: 0.15em 0.4em;
  font-size: 0.9em;
}

.markdown-body pre {
  background: var(--bg-code);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 1.1rem 1.3rem;
  overflow-x: auto;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  font-size: 0.88em;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.2em 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.markdown-body th,
.markdown-body td {
  border: 1px solid var(--border-soft);
  padding: 0.6em 0.9em;
  text-align: left;
}

.markdown-body th {
  background: var(--pastel-blue);
}

.markdown-body hr {
  border: none;
  border-top: 2px dashed var(--pastel-lavender-strong);
  margin: 2.4em 0;
}

/* Diagram Viewer への導線 (CONTEXT.md: Diagram / Diagram Viewer, issue #6 の決定) */
.mdloom-diagram {
  position: relative;
  margin: 1.2em 0;
  background: var(--bg-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 1.4rem;
  text-align: center;
  cursor: zoom-in;
}

.mdloom-diagram:hover,
.mdloom-diagram:focus-visible {
  box-shadow: 0 4px 16px rgba(120, 100, 160, 0.2);
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
  color: var(--text-muted);
}
`;
