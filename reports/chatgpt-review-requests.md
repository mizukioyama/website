# ChatGPTレビュー依頼

## レビュー対象

バックアップ基準の `mizukioyama/website` 修正版。

## 確認してほしい点

1. トップ、Information、NFT、Contact Us、Site Policy、Web制作ヒアリングの表示がバックアップの意図から外れていないか。
2. 画像・音声・フォントのパスが `docs` 配下で成立しているか。
3. Canvas、Ripple、ヘッダー読込、ヒアリング送信処理に、ブラウザコンソールの例外が再発していないか。
4. 未実装のカテゴリ／年別ページを現存する `gallery.html` に戻す暫定リンク方針でよいか。
5. 画像圧縮工程を外したビルド方針を、表示を保つ暫定対応として採用してよいか。

## レビュー時の注意

- 画像圧縮による容量改善は今回の表示保全範囲外。
- モバイル実機、SafariのWebGL対応差、外部フォーム送信は別途確認が必要。

## Header / Footer追加確認

1. `js/menu.js`だけでヘッダーとフッターが生成され、5ページで各フッターが1件だけ表示されること。
2. `header-container`と`footer-container`をマウント位置として残す方針が、既存HTML構造と整合すること。
3. ルートページが`js/footer.js`を読み込まず、`footer.html`取得やjQueryに依存しないこと。
4. 互換シムを併読してもフッターが二重描画されないこと。

## Local / Public表示同期の確認

1. `webpack.config.js`が直下のビジュアル6ページをテンプレートとして使い、`src`版の別レイアウトを公開へ出力しないこと。
2. 公開ビルドのCSS・画像・ページ固有JavaScriptがローカル直下版と一致し、非ビジュアルページの`js/main.js`を上書きしていないこと。
3. ローカルと公開の各ページで`#cursor`と`#stalker`が1件ずつになり、リンク、ボタン、メニュー、ページネーションのホバー表示が同じこと。
4. Pages再生成後に、キャッシュを含めて公開6ページの見た目がローカル直下版と一致すること。

## 2026-09-06 Responsive Typography Push Review

Please review only the responsive `font-size` changes included in the push candidate.

1. Confirm that active fixed font sizes were converted to `clamp(min, preferred, max)` with `rem` minimum and maximum values.
2. Confirm that the existing larger desktop values remain the clamp maxima and that mobile overrides do not introduce clipping or unexpected wrapping.
3. Check the six root visual pages and the active generated `docs` assets at 320px, 390px, 768px, 1024px, and desktop widths.
4. Confirm that HTML structure, class names, layout rules, animations, menu/footer behavior, cursor behavior, forms, modals, tables, and pagination remain unchanged.
5. Treat physical Safari/iOS/Android and real pointer/touch acceptance as pending until manually checked.

### Review boundary

This request is for local/static review of the responsive typography push candidate. Unrelated deletions, untracked files, and the stale local branch state must remain excluded.

## 2026-09-07 Responsive Width Hardening Review

Please review only the `min()`/`calc()` and breakpoint width changes in the root visual CSS/HTML and active `src/style` CSS.

1. Confirm that the gallery, modal, form, footer, menu, biography table, and matching form do not overflow at narrow and intermediate widths.
2. Confirm that the existing two-column gallery behavior and desktop visual baseline remain unchanged.
3. Confirm that the corrected source gallery declarations are valid CSS and do not reintroduce reversed `clamp()` behavior.
4. Treat generated-output synchronization, physical-device acceptance, and public post-deployment visual checks as separate boundaries.

## 2026-09-07 JavaScript Integration Review

Please review only the JavaScript integration changes in `js/menu.js`, `js/page-nation.js`, and the six root HTML script lists.

1. Confirm that `p5.min.js` remains required by `vanta.trunk.min.js` and the existing `VANTA.TRUNK` calls.
2. Confirm that cursor and loading behavior is preserved after moving it into `menu.js`.
3. Confirm that gallery sidebar loading, category filtering, pagination, and scroll collapse are preserved after moving it into `page-nation.js`.
4. Confirm that page-specific scripts and vendor libraries remain correctly separated.
5. Confirm that no unrelated working-tree changes are included in the push.

This is a local code review request. Do not delete, deploy, or modify external services without separate approval.
