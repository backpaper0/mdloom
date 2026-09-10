# Themeを複数化するにあたり、各Themeを共通CSS変数を持たない自己完結したCSSとして実装する

これまでThemeはDefault Theme(パステルピンク/パープル)一種類のみで、`DEFAULT_THEME_CSS`という単一のCSS文字列としてハードコードされていた。色相バリエーション(ocean/forest/sunset/stoneなど)を新規Themeとして追加するにあたり、全Theme共通の`--pastel-*`のようなCSS変数プレフィックス・命名規則を設計して各Themeがそれに従う案もあったが、採用しなかった。`--pastel-*`はtheme.tsの外部から参照されておらず、Theme間で変数名を揃える技術的必然性がないこと、また各Themeを自己完結にしておくことで、新規Theme候補の配色検討時に他Themeとの変数名の衝突を気にせず自由に作業できることを優先し、各Themeは現行の`DEFAULT_THEME_CSS`と同じ形で完全に自己完結したCSS文字列として実装する。

この方針に合わせて、Theme複数化に伴うCLIの設計も次のように整理した。

- `--theme <name>`オプションを新設する。未知のTheme名を渡された場合はサイレントなフォールバックをせずエラー終了し、エラーメッセージに利用可能なTheme名の一覧を含める。
- `--theme`と`--css`の同時指定はエラーとする。「同梱Themeを選ぶ」と「完全に自前のCSSへ差し替える」は意図が競合するため、どちらか一方を暗黙に優先しない。
- `--font`は`--theme`とは独立した上書き軸のまま併用可能とする。各Themeに専用フォント指定は持たせない。
- 既存の`mdloom css`サブコマンドは廃し、`mdloom theme`を親コマンドとするサブコマンド体系(`mdloom theme list`で利用可能なTheme名を1行1件出力、`mdloom theme css [name]`で指定Theme、省略時はDefault ThemeのCSSを出力)に再編する。パッケージはまだ0.1.0のため、後方互換のための非推奨エイリアスは設けずクリーンに置き換える。

## Consequences

新規Themeを追加する際は、他Themeの変数命名やCSS変数体系を意識する必要がなく、`DEFAULT_THEME_CSS`と同形の独立したCSS文字列定数を1つ追加するだけでよい。一方でTheme間の共通スタイル(セレクタ構成・装飾)を変更したい場合は、変数の共有がないため各Themeの定義を個別に修正する必要がある。

`mdloom css`は存在しなくなり、`mdloom theme list`/`mdloom theme css [name]`に置き換わる。README・USAGEの具体的な書き換え内容は別チケット([CONTEXT.md/READMEの更新方針を確定する](https://github.com/backpaper0/mdloom/issues/16))で扱う。
