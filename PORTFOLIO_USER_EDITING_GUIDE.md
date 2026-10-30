# Portfolio user editing environment

This isolated VS Code worktree is based on the published Portfolio main. Changes made here stay local until they are reviewed through a pull request and deployed by GitHub Pages. Saving a file or opening the local preview does not publish it.

## Source of truth

| Content | Edit this source | Generated output |
| --- | --- | --- |
| Home | `index.html` | `docs/index.html` |
| Biography | `biography.html` | `docs/biography.html` |
| Artist Statement | `artist-statement.html` | `docs/artist-statement.html` |
| Information | `src/information.html` | `docs/information.html` |
| Yurayura detail | `src/exhibitions/yurayura/index.html` | `docs/exhibitions/yurayura/index.html` |
| Header / Footer markup | `src/components/header.html`, `src/components/footer.html` | Synced into `js/menu.js` by the build |
| Shared and page styles | `css/` and the imported files listed in `SITE_MAP.md` | Copied to `docs/css/` |
| Typography controls | `assets/css/user-settings.css`, section `USER EDITABLE — TYPOGRAPHY` | Included by the build |

`docs/` is generated deployment output. Do not edit it by hand. Edit the source, then build and inspect the generated page.

## Local preview

1. In VS Code, open the Command Palette with `Cmd+Shift+P`.
2. Open the Yuruyura `assets/data/exhibitions.json` file in a VS Code editor tab, and keep the Portfolio editing folder as the workspace. Use that tab to edit the one data source and the Portfolio workspace to build and preview the result.
3. For Portfolio HTML/CSS edits, choose `Tasks: Run Task` → `Portfolio: Build generated site`. For a Yuruyura JSON-only edit, skip the build; the preview reads that JSON file directly.
4. Run `Tasks: Run Task` → `Portfolio: Preview generated site`.
5. Open `http://127.0.0.1:4174/website/`. The preview task prints this URL in its terminal. Stop the server with the terminal's stop button or `Ctrl+C`.
6. Use `Portfolio: Full quality checks` before handing a change to Codex for release review.

The preview server serves the generated `docs/` tree under the same `/website/` path used by GitHub Pages.

## Safe editing and release

Keep this worktree separate from the formal checkout and the existing Gallery WIP. Ask Codex to review the source diff, rebuild `docs/`, run `npm run check`, and run the relevant Visual Regression before release. Do not commit directly to `main`; use a reviewed isolated branch and pull request. Font-size tuning remains under the user's control. The cross-site exhibition data feed is implemented as described below.

## Yurayura event data and automatic Portfolio updates

The single public authoring source is `assets/data/exhibitions.json` in the isolated Yurayura editing worktree:
`assets/data/exhibitions.json` in the Yurayura editing checkout.
Edit one event record there. `city`, `venue`, `startsAt`, and `endsAt` may be `null` only when the information is genuinely unconfirmed; an event with no dates remains explicitly undated. Keep date-time values offset-aware (normally `+09:00`). Set `published: true` only after the event and its copy are approved for public display.

Keep the public facts in the common fields and the two editorial voices separate under `copy.yurayura` and `copy.portfolio`. Both `ja` and `en` are required for both sites. Yurayura's current Information page remains Japanese-led; Portfolio's Information language switch renders only `copy.portfolio` in the selected language. Do not put internal notes, private contact details, unapproved recruitment conditions, or HTML into the public JSON. The public-data validator applies an allowlist; `node scripts/export-public-events.cjs --check` validates the canonical JSON without writing files.

After editing, validate Yurayura locally with `node --test tests/exhibition-state.test.cjs` and `node scripts/export-public-events.cjs --check`. For a local official-site preview, run `python3 -m http.server 8000 --bind 127.0.0.1` from the Yurayura editing folder and open `http://127.0.0.1:8000/information.html`. In the Portfolio workspace, run `Portfolio: Build generated site`, then `Portfolio: Preview generated site`; this preview reads the same local JSON path and opens at `http://127.0.0.1:4174/website/`.

Only publishing the approved Yurayura data to its GitHub Pages site changes the public feed. Portfolio fetches that public JSON on each Information page visit, so ordinary event updates need no Portfolio commit or redeploy. GitHub Pages currently advertises a 10-minute cache lifetime; the Portfolio request bypasses the browser cache and adds a time-based query value, but a CDN may still delay a new value. Confirm the updated public JSON first, then reload Portfolio Information and check both languages. If retrieval or validation fails, the page reports that the current schedule could not be checked and retains the existing first-edition archive.

## 2026-10-26 shared Header and Standard background candidate

- Header links: edit `src/components/header.html` only; `npm run build` synchronizes the JS component and no-JavaScript navigation in all ten page sources. Runtime replaces the fallback, so only one primary navigation exists.
- Desktop navigation uses the existing navigation typography from 1024px, wrapping when necessary. Up to 1023px retains the overlay; Escape closes it, and hidden links are inert. This component-specific boundary does not change body typography breakpoints.
- Standard background: edit `css/standard-background.css` for the Biography/Statement-derived base color/image and TRUNK opacity/geometry. `gallery.css` imports it; Home does not. Selected Ink Field lives in `js/selected-ink-field.js`; the optional TRUNK lifecycle belongs to `js/background-system-config.js`; Organic Flow settings remain in `js/organic-flow-engine.js` and production selection in `js/organic-flow-production.js`.
- Cascade: shared base/reset → shared standard/component rules → deliberate page-specific inline rules; `assets/css/user-settings.css` remains the typography source. Keep role-specific overrides; do not flatten font-size controls or remove compatibility tokens without checking consumers.
- New Standard pages need the common Header fallback, `data-background-accent="trunkSphere"`, one TRUNK mount, one overlay, and the same background scripts/styles as Information. Add indexable pages to sitemap and visual tests; 404 stays noindex.
- Build with `Portfolio: Build generated site`; preview with `Portfolio: Preview generated site`; run `Portfolio: Full quality checks` and the relevant Playwright suite. Do not edit generated `docs/` by hand. The shared-design direction was approved on 2026-10-27. Linux image review and passing release checks remain required before merge.


### 最終デザインレビューの確認順序（2026-10-27）

1. メニュー文言は `src/components/header.html`、配置・Hover・Focus・幅条件は `css/menu.css` を編集します。各ページへ別のメニューを追加しません。
2. 非Homeの基本背景は `css/standard-background.css`。作品画像やページ固有装飾は各ページの既存sourceに残します。本文レイヤー10を共通Overlayの5より上に保ちます。
3. Font Sizeは `assets/css/user-settings.css` の `USER EDITABLE — TYPOGRAPHY` だけで調整します。互換aliasは独立した編集箇所ではありません。
4. Build後、Previewの `http://127.0.0.1:4174/website/` を確認します。ローカル保存・Buildでは本番は変わりません。
5. `check:docs-sync` は「再ビルドしたdocsがGitの記録と一致するか」を確認するため、正しい生成内容でも未コミットなら停止します。チェックを無効化せず、承認された統合候補をクリーンな検証用Git環境に記録して確認します。
6. 共通デザインは承認済みです。同じ候補のLinux比較で意図した差分だけを個別審査し、全品質ゲート成功後にPRを統合・公開します。Mac画像をLinux基準へ置き換えません。


## 2026-10-27 menu and reading-layout candidate

Primary menu labels/links: `src/components/header.html`. Desktop alignment, the fluid 1080–1200px primary-menu region and single-color links: `css/menu.css`. Shared Biography/Statement reading navigation and bilingual paragraphs: `css/gallery.css`; mobile flow, gutters and reading rhythm: the existing mobile section of `css/mobile.css`. Statement question-line geometry remains in `artist-statement.html`. History-table column roles remain in `css/portfolio-history-table.css`.

Font-size editing stays in `assets/css/user-settings.css` → `USER EDITABLE — TYPOGRAPHY`; this candidate does not change its values. Build also synchronizes static Header/Footer fallbacks. `docs/` stays generated. The PC navigation release preserves separate editing worktrees; synchronize an editing checkout only after preserving its uncommitted work.

## PC scroll navigation (local candidate, 2026-10-28)

- Desktop threshold/layout: `js/menu.js` and the existing 1024px block in `css/menu.css`. Brand and language controls remain visible; primary menu hides at 55vh and the in-page rail appears at 100vh.
- Biography/Statement reuse their `.reading-nav`; mobile keeps its original inline links. Biography `data-sidebar-label` provides a compact desktop label while retaining the full accessible/mobile name.
- Other rails use existing page headings/steps with unique `id`, `data-page-nav` and `tabindex="-1"`. Only visible-language destinations are used. Do not duplicate the link list in JavaScript.
- Save source → `Portfolio: Build generated site` → reload `http://127.0.0.1:4174/website/`. `docs/` and Header fallbacks are generated. No automatic publication. The release includes the reviewed generated files; run quality checks after committing regenerated output.

## Fluid desktop menu width (local candidate, 2026-10-28)

`css/menu.css`: the menu region uses `min(100%, clamp(1080px, calc(25vw + 720px), 1200px))`. At 1920px it is 1200px, at 1440px it is 1080px; the horizontal rule shares that width and meets the viewport right edge. Below the available logo+menu space it shrinks safely. The existing 1299px typography boundary is reused for six equal columns; narrower desktop widths use evenly spaced links. No new viewport breakpoint or Font Size token. Home uses compact header-only vertical spacing to preserve its existing creator label. The left brand/language column stays visible while the primary menu and rule fade after 55vh. The in-page rail still appears after 100vh.

## Responsive layout ownership — approved design 2026-10-30

- Existing desktop rules in css/menu.css own the explicit PC brand18px / primary links16px exceptions. Shared Footer, language-control and non-PC Typography values remain unchanged. The logo link is relatively positioned with inset:auto so its existing hover decoration uses its own text width.
- css/gallery.css owns --reading-column-width, capped at800px and allowed to shrink. State Box is capped at1200px; six reading pages right-align the column with4vmin right padding. Scope parent padding to main: Statement has a legacy shared body/main ID.
- Sidebar remains fit-content. Its center is halfway between the viewport left edge and Content's left edge; the shared cap keeps24px clearance on each side in narrow space. It slides28px over350ms using the existing100vh state, with movement disabled for Reduced Motion. Wide-PC artwork stays alongside text; narrow-PC artwork precedes the column. Policy keeps its own HTML.
- css/mobile.css owns the shared non-Home H1 Grid and100svh first-view minimum. H1 centers at50svh; long bilingual subtitles may grow the flow box, with its visual offset retaining the same title center rather than clipping. Gallery retains absolute positioning and existing filter geometry;404 retains its independent recovery layout. Non-Home pages with centered titles place the existing menu control at the upper right to avoid short-screen text collisions. Home is unchanged.
- PC Biography H3 padding-inline is0; Information/Yurayura introduction wrappers fill the column. Timeline indents and tablet/mobile rules remain. Edit shared CSS, save, run the existing Build Task and reload preview; docs/ is generated.
