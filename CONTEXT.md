# mdloom

単一のMarkdownファイルを、GFM準拠でパステルカラー調の見栄えの良い単一のHTMLファイルへ変換するCLIツール。

## Language

**Document**:
変換対象となる、単一のMarkdownファイル。
_Avoid_: ソースファイル、入力ファイル

**Output**:
変換によって生成される単一のHTMLファイル。DocumentのMarkdown本文とDiagramのSVG、Themeが1ファイルに埋め込まれている。
_Avoid_: 成果物、生成物

**Diagram**:
Document中にMermaid記法で書かれた図。変換時にSVG化され、Outputへ埋め込まれる。
_Avoid_: チャート、図表

**Diagram Viewer**:
Output内でDiagramを開くと別タブで表示される、拡大閲覧専用のビュー。
_Avoid_: プレビュー、ポップアップ

**Theme**:
Outputに適用されるフォントとCSSの組。変換時に差し替え可能。
_Avoid_: スタイル、スキン

**Default Theme**:
mdloomが標準で同梱する、パステルカラー調のTheme。backpaper0/markserveのトーンを参考にする。
