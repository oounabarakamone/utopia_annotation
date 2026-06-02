# ユートピア注釈アプリ 完全分離版

## ファイル構成

- `index.html`：ページ本体
- `lyrics.txt`：歌詞本文
- `notes.json`：注釈データ
- `script.js`：表示・タップ処理
- `style.css`：見た目

## 修正内容

歌詞本文を `script.js` から分離し、`lyrics.txt` に移しました。
注釈データは `notes.json` にあります。

旧版で起きていた `君">君` のような壊れ方は、HTML文字列を何度も置換していたことが原因でした。
この版では、本文を左から読み、最長一致した語句だけをDOM要素として注釈化します。

## GitHub Pagesで更新する方法

リポジトリ直下に以下5ファイルを置いてください。

- `index.html`
- `lyrics.txt`
- `notes.json`
- `script.js`
- `style.css`

既存ファイルは上書きしてください。
