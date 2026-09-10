# mdloom

単一のMarkdownファイルを、GFM準拠でパステルカラー調の見栄えの良い単一のHTMLファイルへ変換するCLIツール。

Markdown中のMermaid記法、またはVega/Vega-Lite仕様(```vega / ```vega-lite フェンス)の図はSVG化してHTMLへ埋め込まれ、クリックすると別タブで拡大表示できます(Diagram Viewer)。フォント/CSS(Theme)は変換時に差し替え可能です。

## インストール

npmレジストリへは公開していません。GitHubリポジトリから直接インストールしてください。

```sh
npm install github:backpaper0/mdloom
```

インストール時に依存パッケージ`puppeteer`の`postinstall`が実行され、Mermaid記法のSVG化に使うChromiumのフルダウンロード(Linuxで約280MB)が走ります。`ignore-scripts`設定や一部のパッケージマネージャの安全設定(pnpmの`allow-scripts`等)で`postinstall`がブロックされている環境では、Chromiumのダウンロードがスキップされ、Mermaid記法を含むDocumentの変換時に実行時エラーになります。その場合は次のいずれかで対処してください。なお、Vega/Vega-Lite仕様の図のSVG化はChromiumを使わないため、この制約を受けません。

- `npx puppeteer browsers install chrome` を手動実行してChromiumを取得する
- 既存のChrome/Chromiumを使う場合は`PUPPETEER_EXECUTABLE_PATH`でその実行ファイルを指定する

インストールせずに`npx`から直接実行することもできます。

```sh
npx github:backpaper0/mdloom <input.md> -o <output.html>
```

## Getting Started

リポジトリに同梱されている`examples/example.md`をDocumentとして変換すると、GFM記法やMermaid記法・Vega/Vega-Lite仕様のDiagramがOutputへ正しく埋め込まれる様子をすぐに確認できます。

```sh
git clone https://github.com/backpaper0/mdloom.git
cd mdloom
npx mdloom examples/example.md -o example.html
```

生成された`example.html`をブラウザで開いてください。

- テキスト装飾・リスト・表などのGFM記法がHTMLへ変換されていること
- フローチャートやシーケンス図(Mermaid記法)、棒グラフや円グラフ(Vega/Vega-Lite仕様)のDiagramがOutputへ埋め込まれていること(クリックするとDiagram Viewerで別タブ表示されます)
- 「Markdownソースを表示」ボタンから、DocumentのMarkdownソースがSource Viewerで別タブ表示されること

が確認できれば、変換は正しく行われています。

## 使い方

```sh
mdloom <input.md> -o <output.html> [--css <path>] [--font <path>]
```

- `<input.md>`: 変換対象のMarkdownファイル(Document)
- `-o, --output <output.html>`: 出力先のHTMLファイル(Output)
- `--css <path>`: Default Themeの代わりに使うCSSファイル
- `--font <path>`: フォントを差し替えるCSSファイル(フォントファイルの埋め込み自体は行わないため、`@font-face`等の記述はこのCSS側で用意してください)

Default ThemeのCSSをファイルへ書き出したい場合は`mdloom css`サブコマンドを使います。

```sh
mdloom css > my-theme.css
```

## ライセンス

MIT
