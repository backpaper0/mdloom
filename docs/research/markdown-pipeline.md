# Markdown pipeline: parser + syntax highlighter choice

## Question

mdloom converts a single Markdown file into a single, good-looking, GFM-compliant,
pastel-colored standalone HTML file. This record decides which GFM parser and which
syntax-highlighting library to build the conversion pipeline on.

Two constraints are fixed going in (not open questions):

1. **Syntax highlighting is build-time only.** It must run inside the Node.js CLI
   process at conversion time and emit static HTML + CSS. The output file must
   require no runtime JavaScript to show highlighted code.
2. **`​```mermaid` fences must be detectable as a distinct "Diagram" block** so a
   later stage can swap them for inline SVG. Whatever parser is chosen must make it
   easy to find fenced-code nodes with `lang === 'mermaid'` via an AST
   visitor/plugin and divert them before or during HTML serialization — they must
   never reach the syntax highlighter as code.

## Findings

### GFM parser options

**unified / remark ecosystem** — [remark-gfm](https://github.com/remarkjs/remark-gfm),
[remark-rehype](https://github.com/remarkjs/remark-rehype),
[rehype-stringify](https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify),
[mdast-util-to-hast](https://github.com/syntax-tree/mdast-util-to-hast),
[unist-util-visit](https://github.com/syntax-tree/unist-util-visit).

- `remark-gfm`'s own README lists exactly five GFM extensions it implements:
  **autolink literals** (bare URLs/emails), **footnotes** (`[^1]`),
  **strikethrough** (`~~x~~`, with `~x~` allowed via `singleTilde: true`, default
  on — GFM technically prohibits single tildes, matching what github.com actually
  renders), **tables**, and **task lists**. It's a single plugin covering all of
  GFM's non-CommonMark syntax; it depends on `micromark-extension-gfm` +
  `mdast-util-gfm` and requires `remark-parse`/`remark` v11+.
- Usage per the README is a straight unified chain:
  ```js
  import {unified} from 'unified'
  import remarkParse from 'remark-parse'
  import remarkGfm from 'remark-gfm'
  import remarkRehype from 'remark-rehype'
  import rehypeStringify from 'rehype-stringify'

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  ```
- `remark-rehype`'s README frames its job precisely: it turns an mdast (markdown)
  tree into a hast (HTML) tree so that downstream `rehype-*` plugins can operate on
  HTML-shaped nodes. Key option: `allowDangerousHtml` (default `false`) to pass
  raw HTML through — the README calls unguarded use of this "typically
  discouraged" (XSS risk), which matters since mdloom is turning arbitrary
  Markdown into a shareable HTML file.
- `rehype-stringify`'s README: final serialization step, `unified().use(rehypeStringify, options)`,
  with knobs for quote style, self-closing tags, character-reference encoding, etc.
  — good for the "good-looking, standalone" output requirement (clean, minimal HTML).
- Mermaid-fence interception: two natural extension points, both documented by
  primary sources.
  1. **A remark (mdast) transformer using `unist-util-visit`.** Its README shows
     visiting `code` nodes and reading `node.lang`:
     ```js
     import {visit} from 'unist-util-visit'

     visit(tree, 'code', (node) => {
       if (node.lang === 'mermaid') {
         // mark it, e.g. node.data = {hName: 'div', hProperties: {className: ['mermaid-diagram']}, hChildren: [...]}
       }
     })
     ```
     Run as a unified plugin between `remarkGfm` and `remarkRehype`, this catches
     every mermaid fence before any HTML/highlighting exists.
  2. **`mdast-util-to-hast`'s `handlers` option** (used internally by
     `remark-rehype`, and also settable directly as a `remark-rehype` option). Its
     README documents `handlers: Partial<Record<NodeType, Handler>>` — you can
     override the `code` handler itself:
     ```js
     unified().use(remarkRehype, {
       handlers: {
         code(state, node) {
           if (node.lang === 'mermaid') {
             return {type: 'element', tagName: 'div',
               properties: {className: ['mermaid-diagram']},
               children: [{type: 'text', value: node.value}]}
           }
           // fall back to default code handling for everything else
         }
       }
     })
     ```
  Either works; approach 1 (a small mdast transform plugin) is more idiomatic and
  keeps the mermaid decision entirely in mdast, before rehype/highlighting exist.
- Weight (npm registry, unpacked size, direct deps — checked 2026-09-09):

  | package | version | unpacked size | direct deps |
  |---|---|---|---|
  | unified | 11.0.5 | 146 KB | 7 |
  | remark-parse | 11.0.0 | 19 KB | 4 |
  | remark-gfm | 4.0.1 | 22 KB | 5 |
  | remark-rehype | 11.1.2 | 48 KB | 5 |
  | rehype-stringify | 10.0.1 | 20 KB | 3 |
  | unist-util-visit | 5.1.0 | 34 KB | 3 |

  Each package is tiny, but the unified/remark/rehype/mdast/hast/micromark
  ecosystem is famously deep — dozens of small transitive packages (micromark
  extension pieces, `mdast-util-*`, `hast-util-*`, `unist-util-*`, `vfile*`). Total
  install is small in bytes (low single-digit MB) but has a large `node_modules`
  entry count, which is a maintenance/audit surface, not a runtime cost.

**markdown-it** — [markdown-it](https://github.com/markdown-it/markdown-it),
[markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists).

- markdown-it's README states it follows the CommonMark spec "+ adds syntax
  extensions & sugar." Checking the package source directly (`src/rules_block/`
  and `src/rules_inline/` in the GitHub repo, v15.0.1) confirms **tables and
  strikethrough are built into core**, not plugins: `src/rules_block/table.ts`
  and `src/rules_inline/strikethrough.ts` exist alongside `heading.ts`,
  `list.ts`, etc.; `src/rules_inline/autolink.ts` handles CommonMark-style
  `<autolink>`, and the `linkify: true` constructor option (via bundled
  `linkify-it`) additionally auto-links bare URLs, matching GFM's autolink-literal
  behavior. **Task lists are the one GFM feature missing from core** and need a
  plugin — `markdown-it-task-lists` (used via `md.use(taskLists)`) turns
  `- [ ]`/`- [x]` list items into checkbox HTML, per its README. So GFM parity
  needs markdown-it core + `linkify: true` + one small task-list plugin; no
  separate table/strikethrough/autolink plugin is required (unlike remark, where
  all of these including autolink-literals ride on a single `remark-gfm` plugin —
  a wash in practice, but worth noting the split is different).
- Mermaid-fence interception: markdown-it's own docs (`docs/examples/renderer_rules.md`
  in the repo) document overriding `md.renderer.rules`, and the default `fence`
  rule (`src/renderer.ts`) shows the exact token shape to match against:
  ```js
  // default_rules.fence(tokens, idx, options, env, slf) reads:
  //   const token = tokens[idx]
  //   const info = token.info ? unescapeAll(token.info).trim() : ''
  //   langName = info.split(/(\s+)/g)[0]
  //   if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content)
  ```
  So the override is a direct token check — no visitor utility needed:
  ```js
  const defaultFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const lang = token.info.trim().split(/\s+/)[0]
    if (lang === 'mermaid') {
      return `<div class="mermaid-diagram" data-mermaid-source="${escapeHtml(token.content)}"></div>`
    }
    return defaultFence(tokens, idx, options, env, self)
  }
  ```
  This is arguably *more* direct than the remark approach for this one job (single
  string check on `token.info`, one renderer-rule override, no separate AST-walk
  package) but it operates on a flat token stream rather than a real tree, which
  matters less here since we only need one fence type diverted.
- Weight (same method): markdown-it 15.0.1 itself reports **1.96 MB unpacked**
  (this includes its published `dist/` UMD bundles plus Unicode tables it ships,
  e.g. via `uc.micro`/`linkify-it`/`punycode.js` — not just source), with 6 direct
  dependencies (`mdurl`, `argparse`, `entities`, `uc.micro`, `linkify-it`,
  `punycode.js`) — a comparatively shallow, non-fragmented dependency tree.
  `markdown-it-task-lists` is 23 KB with **zero** dependencies.

**Other options (one-line mentions):**
- **micromark** directly (the tokenizer under remark) — lower-level than needed;
  remark already wraps it with mdast + the plugin ecosystem mdloom wants.
- **marked** (v18, 483 KB unpacked, zero deps) — fast and dependency-free, but
  GFM task lists/footnotes need hand-rolled extensions and there's no
  standard mdast-equivalent tree/visitor API as clean as remark's or as
  token-rule-based as markdown-it's for intercepting a fence type; not a good fit
  for the "swap mermaid fences via AST visitor" requirement.

### Syntax highlighter options (build-time only)

**shiki** — [shiki.style](https://shiki.style) (official docs).

- Per its own README/docs: shiki is "a beautiful syntax highlighter based on
  TextMate grammar" — the same grammars and themes VS Code uses — via
  `@shikijs/vscode-textmate`, run through either an **Oniguruma engine (WASM)**
  or a pure-**JavaScript regex engine** (`@shikijs/engine-javascript`,
  since v3.9.1 covers all built-in languages, strict-by-default with an optional
  forgiving mode).
- The [regex-engines guide](https://shiki.style/guide/regex-engines) gives an
  explicit recommendation split: **Oniguruma/WASM for Node.js CLI/build-time use**
  ("bundle size and WebAssembly concerns are minimal; maximum compatibility is
  prioritized"), and the JS engine for browser/edge runtimes where WASM
  instantiation cost or bundle size matter. For mdloom (a Node CLI, highlighting
  happens once per run, not per request) this means the default Oniguruma engine
  is the right choice — WASM bootstrap cost (loading a ~600 KB `.wasm`, per
  `@shikijs/engine-oniguruma`'s package size below) is a one-time, sub-process-lifetime
  cost, not a per-request tax.
- Node API, per [shiki.style/guide/install](https://shiki.style/guide/install):
  `npm install -D shiki`, then
  ```js
  import { codeToHtml } from 'shiki'
  const html = await codeToHtml(code, { lang: 'ts', theme: 'nord' })
  ```
  `codeToHtml` returns a highlighted HTML string; `codeToHast`/`codeToTokens` are
  available for intermediate trees/tokens if mdloom wants to post-process before
  final stringification. The docs recommend using `createHighlighter` once as a
  **long-lived singleton** rather than calling `codeToHtml`'s one-shot helper
  repeatedly, to avoid redundant engine/grammar initialization — directly
  applicable to mdloom highlighting many fences in one document.
- **Output format**: shiki emits **inline styles** per token span (`style="color:…"`),
  not CSS classes — no separate stylesheet is needed for a single theme, which
  fits mdloom's "no runtime JS, self-contained file" goal well since the colors
  travel with the markup.
- **Dual/multi-theme (light+dark) support**: documented at
  [shiki.style/guide/dual-themes](https://shiki.style/guide/dual-themes) — pass
  `themes: { light: 'min-light', dark: 'nord' }` instead of a single `theme`, and
  shiki emits CSS custom properties per token (`--shiki-light`, `--shiki-dark`,
  plus `-bg` variants) that a small CSS snippet toggles via
  `prefers-color-scheme` or a `.dark` class:
  ```css
  @media (prefers-color-scheme: dark) {
    .shiki, .shiki span { color: var(--shiki-dark) !important; background-color: var(--shiki-dark-bg) !important; }
  }
  ```
  This is a strong match for mdloom's "pastel-colored" aesthetic goal if a
  light/dark pastel theme pair is wanted, and stays 100% static CSS + inline
  styles — zero runtime JS.
- **Weight**: shiki's own bundle-size table (install guide) shows the tension
  directly: full/default bundle **6.9 MB minified / 1.3 MB gzip**; a "core only,
  compose your own" import is **106 KB / 34 KB gzip**. Registry sizes (checked
  2026-09-09, shiki 4.4.3): the top-level `shiki` package itself is 603 KB
  unpacked, but its dependencies `@shikijs/langs` (all bundled grammars) is
  **8.65 MB unpacked** and `@shikijs/themes` (all bundled themes) is **1.48 MB
  unpacked**; `@shikijs/engine-oniguruma` (WASM engine + binary) is 644 KB.
  These are **on-disk/`node_modules` sizes only** — per the docs, languages and
  themes are bundled as separate async chunks and only the ones actually
  requested (via `createHighlighter({ themes: [...], langs: [...] })`, or the
  fine-grained `createHighlighterCore` + `import js from '@shikijs/langs/javascript'`
  pattern) are loaded into memory at runtime. For mdloom, pin `langs` to a fixed,
  small set of fenced-code languages actually seen (or lazily add the specific
  `lang` per fence as it's encountered) to keep memory/startup bounded.

**highlight.js** (via `rehype-highlight` / `lowlight`).

- [highlight.js](https://github.com/highlightjs/highlight.js)'s README claims
  support for "over 180 languages in the core library," zero dependencies, works
  "in the browser as well as on the server," with `require('highlight.js/lib/core')`
  + explicit per-language registration as the trimmed-down server usage pattern
  (vs. `require('highlight.js')` which loads everything). The README does not
  make an explicit accuracy claim — no comparison to TextMate grammars.
- [lowlight](https://github.com/wooorm/lowlight)'s README describes itself as a
  wrapper that runs highlight.js's grammars but returns **hast trees** (not HTML
  strings) — "a virtual version of highlight.js" — via `createLowlight(grammars).highlight(lang, code)`,
  which is what lets it plug into a rehype/hast pipeline instead of producing raw
  markup.
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight)'s README
  confirms it's the rehype-plugin wrapper around lowlight: it walks the hast tree
  after parsing, wraps tokens in `<span class="hljs-...">` elements (**CSS-class
  output**, prefix configurable via `prefix`, default `hljs-`) — meaning, unlike
  shiki, a **separate highlight.js theme stylesheet** must be embedded/inlined
  into mdloom's output HTML for colors to show (still static, still no runtime JS,
  but it's markup + external/inlined CSS rather than self-contained inline
  styles). Bundles 37 common languages by default (`common` grammar set); the
  full 190-language set is available via the `all` languages import at the cost
  of more weight.
- **Weight**: `rehype-highlight` 7.0.2 is small itself (26 KB unpacked, 5 deps),
  but its `highlight.js` dependency is **5.5 MB unpacked** (all ~180+ language
  grammars bundled in one package by default) — larger on disk than even shiki's
  full language bundle from a single dependency, though (per its README) trimmed
  imports (`highlight.js/lib/core` + per-language registration, or lowlight's
  `common` grammar subset) avoid loading the full set.
- **Accuracy trade-off**: highlight.js/lowlight use hand-written, regex-based
  state-machine grammars (each language is its own bespoke JS grammar file)
  rather than TextMate grammars; the project doesn't claim TextMate-level
  fidelity anywhere in its README. In practice this means less precise
  token-boundary detection on complex languages (e.g. nested template literals,
  JSX, generics-heavy TypeScript) compared to shiki's VS Code-grade grammars —
  this is a known, documented difference in *tooling approach* (bespoke regex
  grammars vs. reused TextMate grammars) even though highlight.js's own README
  doesn't frame it as an accuracy concession.

**Other options (one-line mentions):**
- **Prism.js server-side** — usable in Node via `prismjs` + `loadLanguages`, CSS-class
  output like highlight.js, smaller core but similarly non-TextMate grammars; no
  compelling advantage over the highlight.js/lowlight path already in the rehype
  ecosystem.
- **rehype-pretty-code** — a rehype plugin that itself wraps shiki (adds
  line-numbering/line-highlighting/diff niceties on top). Worth a look later as a
  drop-in *if* mdloom ever wants line-level annotations, but it's an extra layer
  over plain shiki that isn't needed for basic fence highlighting.

## Comparison tables

### Parser

| | unified/remark (`remark-parse`+`remark-gfm`+`remark-rehype`+`rehype-stringify`) | markdown-it (core + `markdown-it-task-lists`) |
|---|---|---|
| **GFM conformance** | Full GFM via one plugin (`remark-gfm`): tables, task lists, strikethrough, autolink literals, footnotes — all in one place, documented explicitly in its README | Tables, strikethrough, CommonMark autolinks + `linkify:true` URL autolinking are built into core (confirmed via source: `src/rules_block/table.ts`, `src/rules_inline/strikethrough.ts`, `src/rules_inline/autolink.ts`); only task lists need a plugin |
| **Mermaid-fence extensibility** | mdast is a real tree; `unist-util-visit(tree, 'code', ...)` finds all fenced blocks by `node.lang` cleanly, or override `mdast-util-to-hast`'s `handlers.code`. Runs before any HTML exists. | Override `md.renderer.rules.fence`, check `token.info.trim().split(/\s+/)[0] === 'mermaid'`, return custom markup instead of calling `options.highlight`. Flat token stream, but the check is a one-line string compare — very direct for this single case. |
| **Weight/dependencies** | Each package tiny (20–150 KB unpacked); ecosystem has a deep, fragmented transitive tree (many `micromark-*`/`mdast-util-*`/`hast-util-*`/`unist-util-*` packages) | markdown-it itself 1.96 MB unpacked (ships UMD dist + Unicode tables) but only 6 shallow direct deps; task-list plugin is 23 KB, zero deps |
| **Notes** | Natural fit if mdloom also wants other rehype plugins later (e.g. `rehype-slug`, `rehype-sanitize`); tree-based transforms are easy to reason about and test in isolation | Simpler mental model (tokens + renderer rules) for a project that mainly needs "parse → tweak one rule → stringify"; less ecosystem plugin choice than unified but everything needed is either core or one small plugin |

### Syntax highlighter

| | shiki | highlight.js (via `lowlight` + `rehype-highlight`) |
|---|---|---|
| **Output format** | Inline styles per token (`style="color:…"`); CSS custom properties (`--shiki-light`/`--shiki-dark`) when using multi-theme mode — self-contained, no separate stylesheet needed for a single theme | CSS classes (`hljs-*`) on `<span>`s — requires embedding/inlining a separate highlight.js theme stylesheet into the output HTML for colors to appear |
| **Accuracy** | Real TextMate grammars (same as VS Code) via Oniguruma/WASM or a JS regex engine; README explicitly markets this as "accurate and powerful" | Hand-written regex/state-machine grammars per language; no TextMate-grammar-level accuracy claim in its own docs; known to be less precise on complex/nested syntax |
| **Build-time-only weight** | `shiki` pkg 603 KB unpacked; full grammar+theme deps (`@shikijs/langs` 8.65 MB, `@shikijs/themes` 1.48 MB) are on-disk only — fine-grained `createHighlighter({langs, themes})` or `createHighlighterCore` loads only what's requested at runtime; Oniguruma WASM engine (~644 KB incl. binary) recommended by shiki's own docs for Node/CLI/build-time use | `highlight.js` dependency alone is 5.5 MB unpacked (all languages bundled by default); trimmed `lib/core` + explicit per-language registration, or lowlight's 37-language `common` set, avoids loading everything |
| **Language coverage** | Broad mainstream coverage via bundled TextMate grammars (hundreds via `@shikijs/langs`) | "Over 180 languages" per README; `rehype-highlight` defaults to a 37-language `common` subset, `all` for the full set |
| **Notes** | Best fit for a "good-looking," self-contained HTML file — theme colors travel with the markup; dual-theme (light/dark pastel) support built in via CSS variables | Mature, zero-dependency core library; simpler mental model, but forces mdloom to also generate/inline a highlight.js theme CSS block separately from the HTML |

## Recommended pipeline

**Parser**: `remark-parse` + `remark-gfm` → `remark-rehype` → `rehype-stringify`
(the standard unified/remark/rehype chain).

**Highlighter**: `shiki`, called at build time via its Node API
(`createHighlighter` singleton + `codeToHtml`/`codeToHast`).

**Rationale**: `remark-gfm` gives full GFM conformance (including footnotes,
which markdown-it doesn't have a single blessed core/near-core answer for) from
one well-documented plugin, and mdast's real tree + `unist-util-visit` is the
cleanest, most testable way to isolate "find every mermaid fence" as its own
pipeline stage — a plain function over a tree, independent of rendering. Shiki's
inline-style/CSS-variable output keeps the "no runtime JS, static HTML+CSS,
good-looking, pastel" output goal simplest: no separate stylesheet to generate
and inline for code blocks, and its dual-theme CSS-variable feature is a
ready-made mechanism if mdloom wants a light/dark pastel pair later. markdown-it
remains a reasonable fallback if unified's dependency-tree depth becomes a real
problem (e.g. supply-chain audit friction), since its `fence`-rule override is
even more direct for the single "divert mermaid" case — but it doesn't change
the highlighter recommendation either way.

**Order of operations**:

1. `remarkParse` — Markdown text → mdast.
2. `remarkGfm` — enables GFM syntax extensions in the mdast (tables, task lists,
   strikethrough, autolink literals, footnotes).
3. **Mermaid-fence detection (own small unified plugin)** — walks the mdast with
   `unist-util-visit(tree, 'code', ...)`, and for every `code` node with
   `node.lang === 'mermaid'`, marks it as a Diagram block (e.g. attach
   `node.data = { hName: 'div', hProperties: { className: ['mermaid-diagram'],
   'data-mermaid-source': node.value } }`, or tag it in a side map keyed by node
   identity for a later swap pass). **This step runs here — after GFM parsing,
   before `remarkRehype` — so mermaid fences never reach a code-highlighting
   step at all.**
4. **Syntax highlighting (own unified plugin, or inline in step 3's visitor)** —
   for every remaining `code` node (i.e., not marked as a Diagram in step 3),
   call `shiki`'s `codeToHtml`/`codeToHast` with the node's `lang`, and replace
   the mdast `code` node's hast representation with shiki's highlighted output
   (either by setting `node.data.hChildren` from `codeToHast`'s result before
   `remarkRehype` runs, or via a custom `code` handler passed to `remarkRehype`'s
   `handlers` option). Because this only ever sees non-mermaid `code` nodes
   (step 3 already diverted those), the highlighter never has to special-case
   mermaid.
5. `remarkRehype` — mdast → hast, applying the custom `code` handler from step 4
   for already-highlighted nodes (or passing them through, since they were
   already rewritten to their target `div`/`pre` shape in step 3/4).
6. `rehypeStringify` — hast → final HTML string.
7. A later, separate stage (outside this parser/highlighter pipeline, per the
   fixed constraints) finds the `div.mermaid-diagram[data-mermaid-source]`
   placeholders in the serialized HTML (or, more robustly, still-tagged hast
   nodes before stringification) and replaces each with its rendered inline SVG.

**Where the mermaid step sits, restated**: between `remark-gfm` and
`remark-rehype`, operating on the mdast tree — strictly *before* syntax
highlighting runs, so a ```mermaid fence is never handed to shiki as "code to
highlight." Highlighting (step 4) and mermaid-tagging (step 3) both operate on
the same set of `code` mdast nodes, but are mutually exclusive per node: a node
is either diverted as a Diagram or sent to the highlighter, never both.

## Sources consulted

- https://github.com/remarkjs/remark-gfm
- https://github.com/remarkjs/remark-rehype
- https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify
- https://github.com/markdown-it/markdown-it (README, `docs/usage.md`,
  `docs/examples/renderer_rules.md`, and source tree `src/rules_block/`,
  `src/rules_inline/`, `src/renderer.ts` at commit tip of `master`, v15.0.1)
- https://github.com/revin/markdown-it-task-lists
- https://github.com/syntax-tree/unist-util-visit
- https://github.com/syntax-tree/mdast-util-to-hast
- https://shiki.style/guide/install
- https://shiki.style/guide/dual-themes
- https://shiki.style/guide/regex-engines
- https://github.com/highlightjs/highlight.js
- https://github.com/wooorm/lowlight
- https://github.com/rehypejs/rehype-highlight
- npm registry package metadata (`npm view <pkg> dist.unpackedSize / dependencies`),
  checked 2026-09-09, for: unified, remark-parse, remark-gfm, remark-rehype,
  rehype-stringify, unist-util-visit, markdown-it, markdown-it-task-lists, shiki,
  @shikijs/core, @shikijs/langs, @shikijs/themes, @shikijs/engine-oniguruma,
  @shikijs/engine-javascript, @shikijs/vscode-textmate, rehype-highlight,
  lowlight, highlight.js, micromark, marked
