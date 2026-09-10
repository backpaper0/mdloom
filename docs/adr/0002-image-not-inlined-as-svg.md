# SVGファイルのImageはDiagramと違いインライン展開せずdata URI化する

Imageとして参照されるファイルがSVGだった場合、Diagram(Mermaid/Vega・Vega-Lite)と同じくインラインの`<svg>`要素としてOutputへ展開する案もあったが、他のラスター画像(png/jpg/gif/webp)と同じ経路で`data:image/svg+xml;base64,...`として埋め込むことにした。DiagramはOutput側で生成された自己完結のSVGであり中身をmdloomが把握しているのに対し、ImageはDocumentの外部にある任意のファイルであり、その中の`id`やCSSがOutput側の他要素と衝突するリスクを避けたい。また埋め込み経路をラスター画像と揃えることで、Image Viewerの実装(data URIからBlobを再構成して別タブで開く)を画像フォーマットによらず単一の仕組みに保てる。

## Consequences

SVG画像はDiagramのようにOutputのDOMへ直接展開されず、常に`<img>`のdata URIとして扱われる。将来Diagramと同様のインライン展開が必要になった場合は、Imageとは別の概念として切り出す。
