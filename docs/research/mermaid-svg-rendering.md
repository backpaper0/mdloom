# Mermaid → SVG レンダリング方式調査 (Issue #3)

調査日: 2026-09-09
対象: mdloom (単一 Markdown ファイル → 単一自己完結 HTML ファイルへ変換する Node.js/TypeScript 製 CLI)。
Markdown 内の Mermaid コードブロック(以下「図」)を SVG 化し、出力 HTML にインライン埋め込みする実装方式を選定する。

前提: Puppeteer / mermaid-cli 系のヘッドレスブラウザ依存を許容する方針は決定済み。本ドキュメントでは「具体的にどの実装方式を採るか」のみを扱う。

---

## 1. 調査結果サマリー

### 1-1. `@mermaid-js/mermaid-cli` (mmdc) をライブラリとして使う vs サブプロセス起動

mermaid-cli の README には CLI バイナリ (`mmdc`) の使い方だけでなく、Node.js から直接 `import` して呼び出すプログラマティック API が明記されている。

```js
import { run } from "@mermaid-js/mermaid-cli";
await run("input.mmd", "output.svg", /* options */);
```

ただし README は次のように明記している(重要な制約):

> "the NodeJS API is not covered by semver, as `mermaid-cli` follows `mermaid`'s versioning."

つまり `run()` などの JS API はセマンティックバージョニングの保証対象外であり、`mermaid-cli` のバージョンは内部で使う `mermaid` 本体のバージョンに追従して上げられる(=API の破壊的変更が semver のマイナー/パッチでも起こり得る)。
(出典: https://github.com/mermaid-js/mermaid-cli README)

ソース (`src/index.js`, 2026-09-09 時点の `master`) を確認すると、公開されている関数は次の4つ:

- `run(input, output, opts)` — CLI 相当のメイン処理。Markdown ファイル一括処理や単一図のレンダリングを行う。`browser` を渡さなければ内部で `puppeteer.launch(puppeteerConfig)` を実行し、自前で Puppeteer ブラウザを起動・管理する。
- `renderMermaid(browser, definition, outputFormat, opt)` — 実際に1つの図を描画するコア関数。**`browser`(Puppeteer の `Browser`/`BrowserContext` インスタンス)を呼び出し側が用意して渡す必要がある**。ライフサイクル管理(起動/終了)は呼び出し側の責務。戻り値は `{ title, desc, data: Uint8Array }` の Promise。
- `cli()` — CLI エントリポイント。
- `error()` — エラーヘルパ。

`renderMermaid` の内部実装は、あらかじめビルドされた `dist/index.html`(mermaid.js をバンドルしたシェルページ)に `page.goto(pathToFileURL(...))` で遷移し、`page.$eval` 経由でページ内の `mermaid.render(svgId, definition, container)` を呼び出して SVG 文字列を取り出す、という構造。つまり「Puppeteer + HTML シェル + `mermaid.render()`」というアーキテクチャそのものであり、質問2で調査する自前実装と技術的に同一の土台を採用している。
(出典: https://github.com/mermaid-js/mermaid-cli/blob/master/src/index.js, https://github.com/mermaid-js/mermaid-cli/blob/master/src/cli.js)

package.json (v11.17.0, 2026-09-09時点) では:

- `exports` は `"./src/index.js"`(型は `"./dist-types/src/index.d.ts"`)= ライブラリとして import 可能な形でパッケージ設計されている。
- `dependencies` に `mermaid: ^11.14.0` を含み、mermaid 本体を内包(=常に mermaid-cli が固定/管理するバージョンの mermaid が使われる。呼び出し側が mermaid のバージョンを自由に選べるわけではない)。
- `puppeteer` は `peerDependencies`(`^23 || ^24 || ^25`)としてのみ宣言されており、npm install 時に自動では入らない。利用者(mdloom側)が明示的に `puppeteer` (または `puppeteer-core` + `browser` を自前提供)をインストールする必要がある。
(出典: https://github.com/mermaid-js/mermaid-cli/blob/master/package.json, https://registry.npmjs.org/@mermaid-js/mermaid-cli/latest)

CLI サブプロセス起動 (`child_process.spawn('mmdc', [...])`) との比較では、ライブラリ利用は次の利点がある: 一時ファイル (`.mmd` 入力/`.svg` 出力) の生成が不要、プロセス起動オーバーヘッドがない、TypeScript から直接 Promise ベースで結果 (Uint8Array) を受け取れる、ブラウザインスタンスを図ごとに使い回せる(1ファイル中に複数の Mermaid ブロックがあっても Puppeteer 起動は1回で済む)。デメリットは非公式 semver 扱いである点と、mermaid-cli 内部実装(`dist/index.html` の場所など)への暗黙の依存が生まれる点。

### 1-2. Puppeteer/Playwright を直接制御し `mermaid.render()` を呼ぶ自前実装

Mermaid 公式ドキュメント (mermaid.js.org) の Usage ページでは、ブラウザ環境における `mermaid.render()` の使い方が現在の推奨 API として説明されている:

```js
const { svg, bindFunctions } = await mermaid.render('graphDiv', graphDefinition);
element.innerHTML = svg;
if (bindFunctions) bindFunctions(element);
```

`mermaidAPI.render(id, text, callback)` はコールバック形式の旧 API で、内部実装向け・非推奨とされており、外部利用者は `mermaid` (トップレベル export) の `render()` を使うべきとされている。
(出典: https://mermaid.js.org/config/usage.html)

ただし mermaid.js.org の Usage ページ自体には、**Node.js / サーバーサイド / ヘッドレスブラウザでの呼び出し方についての公式ガイダンスは存在しない**。公式ドキュメントが Node.js からの利用について案内している唯一の経路は「CLI が必要な場合は mermaid-cli を使え」という誘導のみで、`/config/mermaidCLI.html` ページは次のように書かれている:

> "mermaid CLI has been moved to mermaid-cli. Please read its documentation instead."

(出典: https://mermaid.js.org/config/mermaidCLI.html)

つまり Mermaid 公式は「自前で Puppeteer を書け」というレシピを一切提供しておらず、事実上 mermaid-cli が公式の「Node.js から Mermaid を描画する」リファレンス実装になっている。

自前で Puppeteer 制御する場合の最小構成は、mermaid-cli のソースが示す通り:

1. mermaid.js(UMD/ESM バンドル)を埋め込んだ最小 HTML シェルを用意する(`<script>` で mermaid を読み込み、`window.mermaid` を公開)。
2. Puppeteer で `page.goto()` によりそのシェルを開く(`file://` または `data:` URL でも可)。
3. `page.evaluate()` (または `page.$eval`) 内で `await mermaid.render(id, definitionText)` を呼び、返り値の `svg` 文字列を Node 側に戻す。
4. 複数図をレンダリングする場合は同一ページ/ブラウザを使い回し、図ごとに新しい `<div>` に対して `render` を呼ぶか、ページを都度 `goto` し直す。

この方式は mermaid-cli に依存せず、**mermaid 本体のバージョンを mdloom 側で自由に選べる**(`package.json` の `mermaid` のバージョンを直接管理できる)という利点があるが、HTML シェルの保守・Puppeteer 起動オプション・エラーハンドリング・フォント/アイコンパック等 mermaid-cli が既に解決している細部を自前で再実装する必要があり、実装・保守コストが増える。

### 1-3. その他の代替手段

- **`mermaid` コア npm パッケージ + jsdom/svgdom シム**: mermaid.js の GitHub issue #3886「using mermaid.js from node.js without headless web browser?」は mermaid メンテナによって **"not planned" としてクローズ**されている。すなわち mermaid 本体はブラウザ非依存の(ヘッドレスブラウザなしの)サーバーサイドレンダリングを公式にはサポートしない方針。(出典: https://github.com/mermaid-js/mermaid/issues/3886)
  - サードパーティ実装として `isomorphic-mermaid` (npm, v0.1.1, 2026-09時点) が存在し、`svgdom` + `jsdom` + `dompurify` を組み合わせて Puppeteer/Playwright なしで mermaid を動かすことを謳っている。しかし GitHub 上のコミット数はわずか2件、スター14件と極めて初期段階のプロジェクトで、README にもサポートする図の種類や既知の制限についての詳細な記載がない。(出典: https://registry.npmjs.org/isomorphic-mermaid/latest, https://github.com/tani/isomorphic-mermaid)
  - 本番導入するにはリスクが高く、"実際に動くかどうか" の検証コストを mdloom 側が負う必要がある。
- **mermaid-cli の内部 `render` モジュールを直接使う**: これは実質的に 1-1 の「mermaid-cli をライブラリとして呼ぶ」と同じ話で、`renderMermaid()` を直接呼ぶことで `run()` の CLI 的な入出力(ファイルI/O、Markdown 一括処理)をバイパスし、より低レベルな1関数呼び出しに絞ることができる。
- **`node-mermaid-render` (npm)**: README には「mermaid-cli をベースにした簡易版」とあるが、`package.json` を確認すると内部で `puppeteer` (^20.8.0、かなり古いメジャー) と `mermaid` (^10.1.0、これも旧バージョン) にピン留めされている。GitHub スター2件、フォーク0件で明らかにメンテナンスされていない個人プロジェクト。(出典: https://raw.githubusercontent.com/KermanX/node-mermaid-render/main/package.json)
- **`headless-mermaid`, `sebastianjs`, `mdx-mermaid` など**: 検索で見つかったが、いずれも小規模・個人メンテナンスのプロジェクトで、mermaid のメジャーバージョン追従や Chromium ダウンロード周りの運用ノウハウ(後述)を mermaid-cli ほど確立していない。

---

## 2. 比較表

| 選択肢 | 依存関係フットプリント | SVG品質 / mermaidバージョン追従 | 呼び出し方式 | npm install \<github-url\> との相性 |
|---|---|---|---|---|
| **mermaid-cli をライブラリ import** (`run`/`renderMermaid`) | `@mermaid-js/mermaid-cli` (mermaid ^11.14 を内包) + peerDep `puppeteer` (^23-25, Chromiumフルダウンロード)。推移的依存は中程度(commander, chalk, katex, ELK layout, zenuml など) | mermaid-cli が使う mermaid バージョンにロックされる(mdloom 側で個別に mermaid をアップグレードできない)。ただし mermaid-cli は活発にメンテされておりmermaid最新版に追従が早い(11.17.0時点で mermaid ^11.14) | **プロセス内関数呼び出し**。`renderMermaid()` は Promise で `{svg, ...}` を直接返す。一時ファイル不要 | Puppeteer が peerDependency なので **mdloomのpackage.jsonにも`puppeteer`を明示的に追加する必要がある**。postinstallのChromiumフルDLは通常どおり走る(下記参照) |
| **mermaid-cli を子プロセス起動** (`mmdc` spawn) | 同上 + mmdc バイナリの解決(`npx`かPATH経由) | 同上 | サブプロセス起動 + 一時ファイル(`.mmd`入力、`.svg`出力)のI/Oが必要。エラーハンドリングが exit code/stderr 経由になり型安全性が落ちる | 同上。加えてグローバル/ローカルのバイナリ解決の手間が増える |
| **自前 Puppeteer + mermaid.render() (HTMLシェル)** | `puppeteer` (フルバンドル) + `mermaid` npm本体のみ。mermaid-cliの周辺パッケージ(katex, ELK, zenuml, fontawesome)は不要にできる分、依存はむしろ絞れる | **mdloom側で mermaid のバージョンを完全に自由に選べる**・更新できる。ただしHTMLシェル/フォント/アイコン対応などを自前で保守する必要 | プロセス内関数呼び出し。実装量は増えるが完全に制御可能 | 同様に `puppeteer` を直接 dependency にする。Chromium DLの扱いは同じ考慮が必要 |
| **mermaid + jsdom/svgdom シム** (`isomorphic-mermaid` 等) | Puppeteerなし、Chromiumダウンロードなし。`jsdom`+`svgdom`+`dompurify`は比較的軽量 | mermaid公式が非サポート方針(issue #3886 not planned)。サードパーティ実装は極めて未成熟(2 commits, 14 stars) | プロセス内関数呼び出し(理論上は最軽量) | Chromium DL問題そのものが発生しないため理論上は最も相性が良いが、**信頼性・図種類網羅性が未検証で採用リスクが高い** |
| **node-mermaid-render / headless-mermaid 等の野良ラッパー** | 内部でPuppeteerを使うものが多く、mermaid-cliと同等以上の依存 | 古いmermaid/puppeteerバージョンにピン留めされがち(例: mermaid ^10.1.0)。追従なし | プロセス内関数呼び出し | 個人メンテプロジェクトでインストール経路の検証・保守情報が薄い |

### Chromium ダウンロード / `npm install <github-url>` との相性(共通論点)

Puppeteer (v25.10.0, 2026-09時点) は `postinstall` で `node install.mjs` を実行し、既定では Chrome for Testing 一式(Linuxで約280MB)をダウンロードする。この挙動は **npm レジストリ経由のインストールでも `npm install git+https://github.com/...` のような git 依存経由のインストールでも同様に発生する**(postinstall スクリプトは依存解決後にnpmが実行するものであり、パッケージの取得元では変わらない)。
(出典: https://pptr.dev/guides/installation, https://registry.npmjs.org/puppeteer/latest)

制御用の環境変数(`@puppeteer/browsers` の Configuration インターフェースで定義、pptr.dev 公式ドキュメントで確認):

- `PUPPETEER_SKIP_DOWNLOAD` — 全ブラウザのダウンロードをスキップ(`skipDownload` の環境変数版)
- `PUPPETEER_CHROME_SKIP_DOWNLOAD` / `PUPPETEER_FIREFOX_SKIP_DOWNLOAD` — ブラウザ単位でスキップ
- `PUPPETEER_CACHE_DIR` — ダウンロード先キャッシュディレクトリ変更(既定 `~/.cache/puppeteer`)
- `PUPPETEER_EXECUTABLE_PATH` — 既存の実行可能ファイルを指定して自動検出をバイパス
(出典: https://pptr.dev/api/puppeteer.configuration)

なお過去バージョンの Puppeteer では `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` という名称の環境変数が使われていた(GitHub issue #2262 で言及)。現行(v20以降)のドキュメントでは `PUPPETEER_SKIP_DOWNLOAD` に統一されているため、mdloom で参照するのは後者にすべき。

`puppeteer-core` を使うという選択肢もある: pptr.dev は「puppeteer-core はダウンロードを一切行わず、`executablePath` を呼び出し側が明示的に指定する設計」と説明している。ただし mdloom のように**エンドユーザー環境に既存のChrome/Chromiumがあるとは限らないCLIツール**では、`puppeteer-core` 前提にすると「ブラウザをどう用意させるか」という別の運用問題(手動インストール手順、`@puppeteer/browsers install chrome@stable` の実行案内など)をユーザーに負わせることになる。
(出典: https://pptr.dev/guides/configuration, https://www.npmjs.com/package/@puppeteer/browsers, https://pptr.dev/browsers-api)

`allowScripts`(pnpm/Yarn Berry/Bun等の新しいパッケージマネージャがデフォルトで postinstall をブロックする仕組み)の存在にも注意が必要: postinstallがブロックされた場合、Puppeteerは自動ダウンロードをスキップし、実行時に「Chromiumが見つからない」エラーになる。mdloom を `npm install <github-url>` で配布する場合、利用者の npm 設定(`ignore-scripts` 等)次第でこの問題が起こり得るため、README等で `npx puppeteer browsers install chrome` の手動実行手順を案内する必要がある。
(出典: https://pptr.dev/guides/installation)

---

## 3. 推奨(Recommendation)

**mermaid-cli (`@mermaid-js/mermaid-cli`) をライブラリとしてプロセス内 import し、`renderMermaid()` (または `run()`) を直接呼び出す方式を推奨する。** サブプロセス起動 (`mmdc` spawn) や、自前 Puppeteer + `mermaid.render()` のフルスクラッチ実装、jsdom/svgdomベースの脱ブラウザ方式は不採用とする。

理由(比較基準に対応):

1. **依存フットプリント**: いずれにせよ Puppeteer(Chromiumフルダウンロード込み)は必須になる方針が確定しているため、この軸での差はほぼ「mermaid-cli 固有の周辺依存(katex, ELK layout, zenuml, fontawesome)を追加で背負うかどうか」だけに縮む。これらは mermaid の標準機能(数式、代替レイアウトエンジン、ZenUML、アイコン)をフルサポートするために必要なものであり、自前実装でも同等の機能を持たせたければ結局同じパッケージ群が要る。mermaid-cli を使うことで、これらの統合作業(HTMLシェルへのバンドル、フォント設定など)を再発明せずに済む。
2. **SVG品質 / バージョン追従**: mermaid-cli は mermaid 本体を `dependencies` として抱えており(現行 `^11.14.0`)、mermaid の最新メジャーに追従してリリースされている(11.17.0が最新)。mdloom が独自に mermaid バージョンを選びたい強い理由(特定バージョンの図法や修正が必要等)が出てくるまでは、mermaid-cli のバージョン管理に乗る方が保守コストが低い。将来 mermaid のバージョンを個別制御したくなった場合は、選択肢2(自前HTMLシェル)への切り替えを検討する。
3. **プロセス内呼び出し**: `renderMermaid(browser, definition, "svg", opt)` は Promise で `{ data: Uint8Array, title, desc }` を直接返すため、一時ファイルなし・子プロセスなしで TypeScript コードに統合できる。1つの Markdown ファイル中に複数の Mermaid ブロックがあっても、Puppeteer の `Browser` インスタンスを1回起動して使い回せば良く、CLI サブプロセスを図の数だけ起動するより高速・シンプル。
4. **`npm install <github-url>` との相性**: mermaid-cli 自体はこの点で特別なことをしておらず、Puppeteer が peerDependency である以上、mdloom の `package.json` に `puppeteer` を直接の dependency として追加する必要がある。これはどの選択肢を採っても避けられない(自前実装でも同じ)。したがってこの軸は選択の決定要因にはならないが、**mdloom 側で必ず対応すべき事項**として以下をリスク/フォローアップ事項に切り出す。

### リスク・フォローアップとして次回以降に決めるべき事項

- **mermaid-cli JS API は semver 対象外**という README の明記(https://github.com/mermaid-js/mermaid-cli README)を踏まえ、mdloom の `package.json` では `@mermaid-js/mermaid-cli` を(`^`ではなく)必要に応じてより厳密なバージョン範囲でピン留めすることを検討する。将来 `renderMermaid()` のシグネチャが変わるリスクを許容できる体制(依存更新時にCIで疎通確認する等)を用意する。
- `puppeteer` を mdloom の直接 dependency として追加し、`peerDependencies` 経由の暗黙依存にしない(mmdc の peerDependency 要件 `^23 || ^24 || ^25` を満たすバージョンを選定)。
- README / インストール手順に、Chromium ダウンロードが `ignore-scripts` 環境やCI上でブロックされた場合の対処(`npx puppeteer browsers install chrome` を手動実行する、または `PUPPETEER_CACHE_DIR` を明示してキャッシュさせる)を明記する。
- `PUPPETEER_SKIP_DOWNLOAD` を意図的に設定するユースケース(例: 社内配布用に別途Chromiumを用意済みの環境)向けに、`PUPPETEER_EXECUTABLE_PATH` を経由できることをドキュメント化しておく。
- `renderMermaid()` は `browser`(Puppeteer の `Browser`/`BrowserContext`)を呼び出し側管理にする設計なので、mdloom 側で「1回の変換コマンド実行につき Puppeteer を1回起動し、Markdown内の全 Mermaid ブロックをそのブラウザで処理してから終了時に `browser.close()` する」というライフサイクル管理を実装する必要がある(mermaid-cliの`run()`はMarkdown一括処理・複数出力ファイル生成を前提にしたCLI向けの設計になっているため、mdloomの「1 Markdown → 1 self-contained HTML」というユースケースに素直に合わせるなら `run()` より低レベルな `renderMermaid()` を直接叩く方が制御しやすい可能性が高い。両関数を実際に小さく試作してAPIの使い勝手を確認するフォローアップを推奨)。
- `isomorphic-mermaid` のようなブラウザレス手法は、mermaid本体が公式に非サポート(issue #3886, not planned)としている領域であり、今回は不採用とするが、将来 Puppeteer/Chromium依存そのものをなくしたいという要求が出た場合の再調査対象としてメモしておく。

---

## 4. 参照(References)

- mermaid-cli GitHub リポジトリ(README, `src/index.js`, `package.json`): https://github.com/mermaid-js/mermaid-cli
- mermaid-cli `src/index.js` (raw, master): https://raw.githubusercontent.com/mermaid-js/mermaid-cli/master/src/index.js
- mermaid-cli `package.json` (raw, master): https://raw.githubusercontent.com/mermaid-js/mermaid-cli/master/package.json
- npm registry: `@mermaid-js/mermaid-cli` latest: https://registry.npmjs.org/@mermaid-js/mermaid-cli/latest
- npm registry: `mermaid` latest: https://registry.npmjs.org/mermaid/latest
- npm registry: `puppeteer` latest: https://registry.npmjs.org/puppeteer/latest
- npm registry: `isomorphic-mermaid` latest: https://registry.npmjs.org/isomorphic-mermaid/latest
- Mermaid 公式ドキュメント Usage ページ(`mermaid.render()` API): https://mermaid.js.org/config/usage.html
- Mermaid 公式ドキュメント mermaidCLI ページ(mermaid-cli への誘導): https://mermaid.js.org/config/mermaidCLI.html
- Mermaid 公式ドキュメント Integrations(コミュニティツール一覧): https://mermaid.js.org/ecosystem/integrations-community.html
- Puppeteer 公式ドキュメント Installation ガイド: https://pptr.dev/guides/installation
- Puppeteer 公式ドキュメント Configuration ガイド: https://pptr.dev/guides/configuration
- Puppeteer 公式ドキュメント Configuration インターフェース API リファレンス(環境変数一覧): https://pptr.dev/api/puppeteer.configuration
- `@puppeteer/browsers` npm パッケージ / API: https://www.npmjs.com/package/@puppeteer/browsers , https://pptr.dev/browsers-api
- mermaid GitHub issue #3886「using mermaid.js from node.js without headless web browser?」(not planned としてクローズ): https://github.com/mermaid-js/mermaid/issues/3886
- `isomorphic-mermaid` GitHub リポジトリ: https://github.com/tani/isomorphic-mermaid
- `node-mermaid-render` GitHub リポジトリおよび `package.json`: https://github.com/KermanX/node-mermaid-render , https://raw.githubusercontent.com/KermanX/node-mermaid-render/main/package.json
- Puppeteer 過去バージョンの環境変数名についての参考(legacy `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`): https://github.com/puppeteer/puppeteer/issues/2262
