# website 修正レビュー報告

## 対象

- リポジトリ: `mizukioyama/website`
- 基準バックアップ: `website-main.zip`
- バックアップSHA-256: `4881c2c66d01eb78f178c3bec40248d99db0a3ad2680b1d3cd19d507a294b944`
- 作業方針: バックアップを基準にし、表示用HTML/CSS・画像・レイアウトを不要に変更しない

## 検出した原因と対応

1. `src/js/security.js` が `artCanvas` のないページでも `getContext()` を呼び、全ページで例外になる状態だった。Canvasが存在するときだけ描画し、存在しないときは安全に終了するよう修正した。旧404画像参照は、既存の作品画像をWebpack管理の参照に変更した。
2. `src/js/bg_wave.js` が利用できないRipple APIを無条件に呼んでいた。APIの存在確認と例外処理を追加し、対応環境でない場合は表示を止めずに終了するよう修正した。
3. `src/js/hearing.js` と `src/js/matching.js` に、スコープ外の `submitButton` を参照するイベント登録があったため除去した。DOM準備後の登録は維持している。
4. `src/js/all.js` が `header-container` のないヒアリング画面でも `innerHTML` を設定していたため、コンテナがある場合だけ実行するよう修正した。
5. `src/assets/js/structured-data.js` と `src/index.html` のJSON/JavaScript内コメントにより構文・JSON-LDが不正だったため、値を変えずコメントだけ除去し、JavaScript側を有効な定数にした。
6. 情報ページの存在しないCSS/JS参照、存在しないfavicon、未収録ページへのリンクを整理した。画面構造、文言、画像、CSSルールは変更していない。
7. `gh-pages` の出力先を存在しない `dist` から実際の公開成果物 `docs` に修正した。
8. mozjpeg/pngquant等のネイティブ圧縮工程をWebpackから除去した。現行環境では実行ファイルのコンパイルに失敗していたためで、元画像をそのまま出力し表示内容を変えないためのビルド安定化である。

## 検証結果

- バックアップZIP整合性: PASS (`unzip -tq`)
- クリーン依存関係インストール: PASS (`npm ci`)
- JavaScript構文検査: PASS (22 files)
- Webpackビルド: PASS（asset size warningのみ）
- HTML/CSSローカル参照検査: PASS
- ブラウザ主要6ページ: PASS（エラーなし）
- トップカード位置: バックアップと修正版で一致（x=305.20, y=169.20, w=669.59, h=381.59）

## 判定

表示基準を保ったまま、再現可能なビルドと主要ページの実行時例外を改善できた。モバイル実機、外部画像配信、フォーム送信先の実送信は未確認である。

## Header / Footer Integration

- ルートの`js/menu.js`に、既存のヘッダーとフッターの生成処理を統合した。
- `header.html`と`footer.html`の表示用構造、クラス名、リンク、文言、CSSは維持した。
- `header-container`と`footer-container`は、JavaScript生成物を挿入するマウント位置として残している。これらを削除する場合は、JS側で挿入先を新規作成する別の構造変更が必要になる。
- 5ページから`js/footer.js`の重複読み込みを外し、`js/footer.js`は削除せず互換シムとして残した。
- ローカルブラウザで5ページのフッター1件、5リンク、年表示、メニュー開閉、言語切替を確認した。
- `js/page-nation.js`のブラウザ非対応な`require("fs")`エラーと、VANTAの既存警告は今回の対象外として残っている。

## Local / Public Alignment

- ローカルプレビューはリポジトリ直下のHTML/CSS/JavaScriptを読み込み、GitHub Pagesは`src`から`docs`を生成していたため、同じページURLでも別のレイアウト・画像・カーソル実装が表示されていた。
- `webpack.config.js`のビジュアル6ページ（トップ、Artist Statement、Biography、Gallery、Contact、Site Policy）のテンプレートを直下HTMLへ統一した。
- 公開ビルドでは、直下ページが使用するCSS、画像、JavaScriptを優先して配置し、Information・Matching・Bot用のWebpackバンドルは`js/main.js`を保持するようにした。
- `js/cursor.js`と`src/js/cursor.js`の重複DOMContentLoaded処理を1つへ統合し、重複生成ガードとイベント委譲を共通化した。生成後の`docs/js/cursor.js`も1組のカーソルを生成する。

## Alignment Verification

- クリーン環境で`npm ci`: PASS
- `npm run build`: PASS（asset size warningのみ）
- `npm run check:js`: PASS（40 files、17 inline scripts）
- `npm run check:generated`: PASS（12 scripts）
- `npm run check:links`: PASS
- 生成されたビジュアル6ページのCSS資産ハッシュ: 直下版と一致
- 実画面の再確認: PENDING（検証時にMacがロック中。公開URLはPagesの再生成完了後に確認が必要）

## Public Deployment Verification

- GitHub `origin/main` が`6386369`を指すことを確認した。
- `https://mizukioyama.github.io/website/`の主要6ページを取得し、各ページの`header-container`、`footer-container`、`cursor.js`、`menu.js`を確認した。
- 主要6ページの`footer.js`読み込みは0件で、カーソルスクリプトは各ページ1件だった。
- 公開`menu.js`はヘッダーfetchを行わず、静的マークアップ生成を含む。公開`footer.js`は互換シムで、フッターfetchを行わない。
- 公開`css/all.css`と`css/gallery.css`のSHA-256はローカル直下版と一致した。
- 公開ファイル同期: PASS。実画面の見た目・カーソル操作: PENDING（Macロック中のため物理操作未実施）。
