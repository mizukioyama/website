# 次のアクション

1. GitHubへ反映後、公開URLで主要6ページを確認する。
2. スマートフォン実機または実効390px幅で、Information・NFT・Contact・ヒアリングの縦幅と操作を確認する。
3. Rippleを有効にしたい場合は、現行Webpackで扱える保守済み実装を選定し、表示比較を行ってから導入する。
4. 画像圧縮は容量・品質・ブラウザ表示を比較できる別ブランチで検証する。
5. 外部画像のNetwork/CSPエラーとGoogleフォームの送信結果を公開環境で確認する。
6. 未実装のカテゴリ／年別ページを追加する場合は、リンク先のコンテンツ仕様を確定してから別変更として実装する。
7. 公開後、ルート5ページで`menu.js`によるヘッダー／フッター表示と、`footer.js`未読込を確認する。
8. `header-container`または`footer-container`を削除したい場合は、表示位置をJSで生成する別設計として事前に表示比較を行う。
9. GitHub ActionsのPagesデプロイ完了後、公開6ページがローカル直下版と同じタイトル位置、背景、画像、カーソル1組になることを確認する。
10. Macのロック解除後、公開URLとローカルURLを同じ幅で再読み込みし、カーソルのホバー拡大、メニュー、言語切替、ギャラリーのページ送りを確認する。
11. 公開ファイル同期は確認済みのため、残る作業はMacのロック解除後の実画面・物理操作確認と、必要に応じたブラウザキャッシュ確認である。

## 2026-09-06 Responsive Typography Push

1. GitHub ActionsのPagesデプロイ完了後、主要6ページを強制再読み込みして確認する。
2. 320px、390px、768px、1024px、デスクトップ幅で、見出し、本文、メニュー、フッター、モーダル、フォーム、表、タイムライン、キャプション、ページネーションを確認する。
3. 日本語・英語の改行、切れ、横スクロール、ボタンや閉じる操作の可用性を確認する。
4. 実機Safari/iOS/Androidと物理マウス・タッチの結果は、自動検証とは分けて記録する。
5. 特定ページの例外が必要な場合は、ページ・セレクタ・幅・改行状態を記録してから別修正にする。

## 2026-09-07 Responsive Width Hardening

1. After Pages regeneration, compare the six root visual pages at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
2. Check the gallery modal, footer padding, menu offset, biography table, contact form, and matching form for clipping or horizontal scrolling.
3. Complete physical Safari/iOS/Android and touch-device acceptance separately from static validation.

## 2026-09-07 JavaScript Integration

1. Review the focused integration commit and confirm cursor, loading, header, footer, and gallery behavior.
2. If deletion is desired, explicitly approve removal of the retained compatibility files after a fresh reference scan and backup.
3. Perform physical Safari/iOS/Android and touch acceptance separately from static validation.
4. After push, confirm that GitHub Actions installs FontAwesome webfonts and completes the production build.
