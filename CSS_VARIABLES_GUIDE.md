# CSS Variables Guide

## 最終デザイン調整でまず見る場所

この表は、既存のデザインを最後に調整するときの編集入口です。今回の整理では、CSSの値や公開デザインを変更していません。

| 調整対象 | 編集する正本 | 補足 |
| --- | --- | --- |
| HomeのH1–H4、本文p、span | `assets/css/user-settings.css` の `USER EDITABLE — TYPOGRAPHY` | `--type-home-*` の該当roleを調整します。 |
| Gallery、Biography、Artist Statement、Information、Order、Contact、Policy、YurayuraのH1–H4、本文p、span、li | 同上 | `--type-page-*` の該当roleを調整します。 |
| 404の見出し・コード・本文 | 同上 | `--type-404-*` を使用します。 |
| Header / Footer / Menu / UI文字 | 同上 | `--type-header-footer-size`、`--type-menu-*`、`--type-ui-size` など役割別tokenを使います。構造はHeader/Footer componentを編集します。 |
| caption / table / metadata / Category / pagination | 同上 | `--type-caption-size`、`--type-table-size`、`--type-metadata-size`、`--type-category-size`、`--type-pagination-size` が編集入口です。 |
| 共通のreset・グローバル表示 | `css/all.css` | 全体に影響するため、変更時は全ページを確認します。 |
| Standard pagesとGalleryの本文・Gallery/sidebar/Categoryの配置 | `css/gallery.css` | Standard pagesでも共有されています。影響範囲を確認してから調整します。 |
| Header / navigation / menuの配置・状態 | `css/menu.css` | Headerのmarkupは `src/components/header.html`。Menu内のtablet用Home規則は `css/index-tablet.css` をimportしています。 |
| Footerの配置・見た目 | `css/footer.css` | Footerのmarkupは `src/components/footer.html`。 |
| Homeのページ固有レイアウト・表示 | `index.html` と `css/index.css` | portrait tabletのHome layoutは `css/index-tablet.css` にあります。 |
| Contact form / controls | `contact.html` と `css/form.css` | 表示ロジックを変える作業は別途 `js/form.js` の確認が必要です。 |
| 既存のmobile-only共通override | `css/mobile.css` | 既存の幅条件を確認します。Footerやcomponent内にも個別media ruleがあります。 |

ページ本文のsourceは、7つのroot HTML（Home、Gallery、Biography、Artist Statement、Order、Contact、Policy）と、`src/information.html`、`src/exhibitions/yurayura/index.html`、`src/404.html`です。routeとbuild対応の一覧は [SITE_MAP.md](SITE_MAP.md) を参照してください。Galleryのcaption文言は `js/gallery-captions-data.js` がsourceです。レイアウトや文字サイズの編集場所と、本文データの編集場所を混同しないでください。

### Sourceから公開生成物まで

`src/components/header.html` と `src/components/footer.html` が共有markupのsourceです。`npm run build` はまずcomponentを同期して `js/menu.js` 内の生成区間を更新し、Webpackでsource HTML・CSS・選択されたJS・画像を `docs/` に出力し、その後Gallery captionを埋め込み、asset URLをversioningします。`docs/` はGitHub Pages用generated outputです。`docs/` 内を直接編集せず、`js/menu.js` の生成区間も直接編集しないでください。

最終調整後に通常実行する確認：

```sh
npm run build
npm run check
```

`npm run check` はcomponent / JavaScript / typography確認、build、generated docs同期、SEO、link確認を順に行います。Visual Regressionはbaselineを更新せずに別途実行し、公開前はGitHub ActionsとPages上の表示を確認してください。数値変更やresponsive rule変更を行った場合のviewport確認は [QA_CHECKLIST.md](QA_CHECKLIST.md) を参照してください。

## ユーザー調整の入口（Font Sizeの正本）

Font Sizeの編集用正本は [`assets/css/user-settings.css`](assets/css/user-settings.css) です。通常ユーザーが編集する範囲は、同ファイルの `USER EDITABLE — TYPOGRAPHY` sectionだけです。Compatibility alias、internal token、legacy tokenは通常のFont Size調整では編集しません。

同じHTMLタグの `font-size` は、ページグループ内で原則として共有します。ページグループは次の3つです。

- Home: `index.html`
- Standard pages: Gallery / Biography / Artist Statement / Information / Order / Contact / Policy / Yurayura
- 404: 独立したnot-found experience

現在のgroup tokenは次のとおりです。

- Home: `--type-home-h1-size` / `--type-home-h2-size` / `--type-home-h3-size` / `--type-home-h4-size` / `--type-home-p-size` / `--type-home-span-size`
- Standard pages: `--type-page-h1-size` / `--type-page-h2-size` / `--type-page-h3-size` / `--type-page-h4-size` / `--type-page-p-size` / `--type-page-span-size` / `--type-page-li-size`
- 404: `--type-404-title-size` / `--type-404-code-size` / `--type-404-p-size`

通常コンテンツの同じタグは、各groupの共通tokenへ統合済みです。初期値はユーザーが指定した現在の汎用Home / Standard page tokenから採用し、数値最適化はしていません。最終Font Sizeはユーザー本人がこの設定ファイルで調整します。HTMLを維持するため残した旧inline参照は、共通tokenへ解決するCompatibility Aliasであり、独立した編集入口ではありません。

通常のFont Sizeは、9elements Min-Max Calculatorと同じ考え方で、375px〜1440pxを基準に `clamp(MIN, FLUID, MAX)` で管理します。

- 375px時の最小側の表示サイズ
- 1440px時の最大側の表示サイズ

375px未満ではMIN、375px〜1440pxではfluid interpolation、1440px超ではMAXを維持します。viewportごとのFont Sizeを大量に個別設定せず、breakpointはレイアウトまたはcomponent構造の切り替えに必要な場合だけ使用します。

Header / Navigation、Menu、Footer、interactive link、Form、Button、Modal、Gallery card、table/metadata、Caption / helper、animated Home display、404 codeなど、通常本文と役割が明確に異なるcomponentは例外です。理由はCSSコメントまたはこのガイドに記録します。ページ名だけを理由に例外tokenを追加しません。

ユーザーが最終値を決める前に、AI/CodexはFont Sizeを数値最適化・再設計しません。実装済みのgroup tokenと既存scopeを保ち、ユーザー本人の調整を待ちます。

ページのHTMLでは、共通CSSの後に `user-settings.css` を読み込みます。互換aliasは、HTMLを変更せずに既存inline参照をgroup tokenへ接続するためだけに残します。alias / internal / legacy tokenは通常の調整入口ではありません。

## CalculatorからCSSへ

9elements Min-Max Calculatorには、次の順で入力します。

1. Min：375px時に表示したいpx
2. Max：1440px時に表示したいpx
3. Viewport Min：375px
4. Viewport Max：1440px

Calculatorが返す値を、`--type-*` group tokenの `clamp()` に反映します。プロジェクトでは固定値・最小値・最大値をpxで記載します。ユーザーが最終値を決めるまでは既存値を最適化・再設計しません。

本文設定の例（現在のStandard-page p token）：

```css
/* Standard-page paragraph setting; responsive scopes remain in user-settings.css. */
--type-page-p-size: clamp(12px, calc(10.4px + 0.4vw), 14px);
```

Standard-page H2 setting（base scope。responsive scopesも同じtokenを使用）：

```css
--type-page-h2-size: clamp(17.2px, calc(4.4px + 2vw), 42.8px);
```

数値を変更した後は、375 / 390 / 430 / 768 / 1024 / 1280 / 1440pxで、改行・overflow・header/footer・ボタン・Galleryモーダルを確認します。

## 現在のsemantic roles

| Group | Shared normal-content roles | Component exceptions |
| --- | --- | --- |
| Home | `--type-home-h1-size`, `--type-home-h2-size`, `--type-home-h3-size`, `--type-home-h4-size`, `--type-home-p-size`, `--type-home-span-size` | Header/navigation, buttons, modal, date/time and animated display |
| Standard pages | `--type-page-h1-size`, `--type-page-h2-size`, `--type-page-h3-size`, `--type-page-h4-size`, `--type-page-p-size`, `--type-page-span-size`, `--type-page-li-size` | Header/navigation, links, menu, form, Gallery card, table/metadata, caption/helper and modal |
| 404 | `--type-404-title-size`, `--type-404-code-size`, `--type-404-p-size` | Recovery links remain a distinct interactive component |

## 対象外・互換維持

border、hairline、icon/stroke、装飾線、`z-index`、`font-size: 0` による表示制御、resetの `inherit` / `100%` はユーザー調整用のfluid typography対象外です。Letter-spacing、tracking、404表示の光学調整、component固有helperも、同一タグのFont Size統一とは別問題として扱います。Legacy/non-Home optical token群を一括削除しません。Formのplaceholder・floating labelは既存のデスクトップ縮小表示を維持するため、専用の互換roleを使います。

Menu主要項目だけは、既存表示を維持するため `<=599px` / `600–1298px` / `>=1299px` の3段階を同じファイル内で管理しています。`docs/` は生成物です。デザイン変更はroot HTML / `css/` / `assets/css/`を編集し、依存関係が揃った環境でbuildしてから生成物を更新します。
