# CSS Variables Guide

## ユーザー調整の入口（Font Sizeの正本）

Font Sizeの編集用正本は [`assets/css/user-settings.css`](assets/css/user-settings.css) です。通常ユーザーが編集する範囲は、同ファイルの `USER EDITABLE — TYPOGRAPHY` sectionだけです。Compatibility alias、internal token、legacy tokenは通常のFont Size調整では編集しません。

同じHTMLタグの `font-size` は、ページグループ内で原則として共有します。ページグループは次の3つです。

- Home: `index.html`
- Standard pages: Gallery / Biography / Artist Statement / Information / Order / Contact / Policy / Yurayura
- 404: 独立したnot-found experience

将来的な基本形は次のgroup tokenです。

- Home: `--type-home-h1-size` / `--type-home-h2-size` / `--type-home-h3-size` / `--type-home-h4-size` / `--type-home-p-size` / `--type-home-span-size`
- Standard pages: `--type-page-h1-size` / `--type-page-h2-size` / `--type-page-h3-size` / `--type-page-h4-size` / `--type-page-p-size` / `--type-page-span-size`
- 404: `--type-404-title-size` / `--type-404-code-size` / `--type-404-p-size`

同じグループ内で、ページ名・class名だけを理由に同じタグ用の別Font Size tokenを維持しません。既存の`--type-gallery-h2-size`、`--type-home-h2-size`、`--type-biography-h2-size`、`--type-state-h2-size`などは、selector・使用ページ・scope・値を監査したうえで統合する移行対象です。

通常のFont Sizeは、9elements Min-Max Calculatorと同じ考え方で、375px〜1440pxを基準に `clamp(MIN, FLUID, MAX)` で管理します。

- 375px時の最小側の表示サイズ
- 1440px時の最大側の表示サイズ

375px未満ではMIN、375px〜1440pxではfluid interpolation、1440px超ではMAXを維持します。viewportごとのFont Sizeを大量に個別設定せず、breakpointはレイアウトまたはcomponent構造の切り替えに必要な場合だけ使用します。

Header / Navigation、Menu、Footer、Form、Button、Modal、Caption / helper、404 codeなど、通常の文章・見出しと役割が明確に異なるUI componentだけは例外として許可します。例外の理由はCSSコメントまたはこのガイドに記録します。ページ名だけを理由に例外tokenを追加しません。

現在のページ名と同一HTMLタグを組み合わせたtokenは移行対象です。ただし、現在値が異なる同一グループ・同一タグについては、ユーザーが最終Font Sizeを決める前に共通値を選択・削除・統合・数値最適化しません。既存デザインを意図せず変更しないためです。

ページのHTMLでは、共通CSSの後に `user-settings.css` を読み込みます。既存の `--font-*` 変数は互換aliasとして残しているため、既存のCSSやページ内スタイルをいきなり置き換えずに調整できます。

## CalculatorからCSSへ

9elements Min-Max Calculatorには、次の順で入力します。

1. Min：375px時に表示したいpx
2. Max：1440px時に表示したいpx
3. Viewport Min：375px
4. Viewport Max：1440px

Calculatorが返す値を、`--type-*` 変数の `clamp()` に反映します。プロジェクトでは固定値・最小値・最大値をpxで記載します。

本文を `14px → 16px` にする例：

```css
/* 375px → 1440px = 14px → 16px */
--type-body-size: clamp(14px, calc(13.2958px + 0.1878vw), 16px);
```

H2を `24px → 32px` にする例：

```css
/* 375px → 1440px = 24px → 32px */
--type-gallery-h2-size: clamp(24px, calc(21.1831px + 0.7512vw), 32px);
```

数値を変更した後は、375 / 390 / 430 / 768 / 1024 / 1280 / 1440pxで、改行・overflow・header/footer・ボタン・Galleryモーダルを確認します。

## 現在のsemantic role（移行途中）

この表には、現在の実装で使用される共通tokenと既存の移行対象tokenが含まれます。表に残るページ固有tokenは、現時点で削除・統合しません。

| Role | 375px | 1440px | 主な対象 |
| --- | ---: | ---: | --- |
| `--type-body-size` | 12px | 14px | 本文・日英通常文 |
| `--type-list-size` | 11px | 12.8px | リスト・履歴 |
| `--type-ui-size` | 14px | 16px | リンク・UI・button |
| `--type-caption-size` | 11px | 13px | caption・補助文 |
| `--type-category-size` | 14px | 17.6px | Gallery category |
| `--type-header-footer-size` | 18px | 25.6px | header/footer |
| `--type-gallery-h1-size` | 39px | 81.6px | Gallery/共通ページH1 |
| `--type-gallery-h2-size` | 17.2px | 33.2px | 共通ページH2 |
| `--type-home-title-size` | 25.6px | 28.8px | TOP title |
| `--type-form-button-size` | 16px | 19.2px | Form button/required |
| `--type-modal-title-size` | 32px | 38.4px | Form modal heading |

## 対象外・互換維持

border、hairline、icon/stroke、装飾線、`z-index`、`font-size: 0` による表示制御、resetの `inherit` / `100%` はユーザー調整用のfluid typography対象外です。Letter-spacing、tracking、404表示の光学調整、component固有helperも、同一タグのFont Size統一とは別問題として扱います。Legacy/non-Home optical token群を一括削除しません。Formのplaceholder・floating labelは既存のデスクトップ縮小表示を維持するため、専用の互換roleを使います。

Menu主要項目だけは、既存表示を維持するため `<=599px` / `600–1298px` / `>=1299px` の3段階を同じファイル内で管理しています。`docs/` は生成物です。デザイン変更はroot HTML / `css/` / `assets/css/`を編集し、依存関係が揃った環境でbuildしてから生成物を更新します。
