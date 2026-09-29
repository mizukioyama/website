# Header / Footer Review Report

## 2026-09-22 Min-Max Calculator typography settings

- Added `assets/css/user-settings.css` as the user-facing semantic typography settings file.
- Root visual pages load it after their page CSS; existing `--font-*` names remain compatibility aliases.
- Major shared roles and root-page heading/menu/form/modal declarations now reference the new settings.
- The settings use px bounds and Calculator-style `clamp(px, calc(px + vw), px)` interpolation from 375px to 1440px.
- Backup created at `backups/20260922_before_user_settings_typography/`.
- PASS: typography, JavaScript, component, SEO, link, webpack syntax and diff checks.
- PASS: local browser source check at 1280×720; seven root pages loaded the setting once and had no horizontal overflow.
- PASS: Gallery category structure, 8 works, pagination, modal open/close and scroll locking.
- PENDING: generated docs rebuild and public verification because `node_modules` is absent and `webpack` / `html-minifier-terser` are unavailable.

## 2026-09-20 Phase 3 bilingual and typography audit

- Base verified against `ad577fcae63180a1dfca1a41c6c08a8c5320a3a3` on branch `phase3-bilingual-mobile-typography-audit`.
- Biography and Artist Statement now keep both `lang="ja"` and `lang="en"` regions visible while hiding only the language-switch UI; stored language preference remains available to Gallery.
- Root typography tokens were consolidated for body, list, UI, caption, table, metadata, category, and pagination text. Heading hierarchy and page structures were not redesigned.
- `npm run build`, `check:js`, `check:generated`, `check:seo`, `check:links`, and the combined `npm run check` completed successfully locally.
- Playwright package execution is not available in this local checkout; browser smoke checks were performed against generated `docs/` with the persistent browser. Full seven-viewport CI and Pages verification remain pending.

## 2026-09-11 Non-Index Body Text 12-14px

- Changed the PC non-index base and paragraph clamp to `clamp(12px, calc(10px + 0.4vw), 14px)`.
- Updated the stylesheet cache-busting query on artist-statement, biography, contact, gallery, and policy pages.
- `index.html`, mobile rules, and explicit form/modal sizes remain excluded.
- `git diff --check`: PASS

## 2026-09-11 Non-Index Body Text 12-13.5px

- Changed the PC non-index base and paragraph clamp to `clamp(12px, calc(10px + 0.4vw), 13.5px)`.
- Updated the stylesheet cache-busting query on artist-statement, biography, contact, gallery, and policy pages.
- `index.html` and mobile rules remain excluded.
- `git diff --check`: PASS

## 2026-09-11 Non-Index Body Text Cascade Fix

- The first 11px–12px rule only changed `html/body`; the later shared `p` rule still produced larger visible paragraphs.
- Moved the PC `p` override after the shared paragraph definition so visible non-index body text now uses `clamp(11px, calc(10px + 0.4vw), 12px)`.
- Bumped the stylesheet query on artist-statement, biography, contact, gallery, and policy pages.
- `index.html` remains excluded.
- `git diff --check`: PASS

## 2026-09-11 Non-Index Body Text 11-12px Correction

- Corrected the PC non-index rule so `html`, `body`, and visible page `p` elements use `clamp(11px, calc(10px + 0.4vw), 12px)`.
- This fixes the cascade issue where the global paragraph rule kept the displayed body text unchanged.
- Updated the `gallery.css` cache-busting query on all five non-index pages.
- `index.html` remains excluded.
- `git diff --check`: PASS

## 2026-09-11 Non-Index Common Text Scale

- Moved the Contact PC base text clamp into shared `css/gallery.css`, which is loaded by Contact, artist-statement, biography, gallery, and policy pages.
- index.html remains excluded because it does not load `css/gallery.css`.
- Removed the duplicate Contact-only base rule from `css/form.css`.
- Updated the common stylesheet cache-busting query on all five non-index pages.
- `git diff --check`: PASS

## 2026-09-11 Contact Base Text Scale

- Updated the PC Contact `html, body` font-size to match the policy page: `clamp(0.75rem, calc(0.4rem + 0.8vw), 1.25rem)`.
- Kept the existing explicit form-label, placeholder, consent, and modal text sizes unchanged.
- Updated the Contact `form.css` cache-busting query.
- `git diff --check`: PASS

## 2026-09-11 Contact Body Left Alignment

- On PC widths, aligned `#contact .content` left edge to the Contact page H1's `left: 20vmin` position.
- Kept the existing content width, top spacing, form layout, and mobile rules unchanged.
- Updated the Contact `form.css` cache-busting query so the alignment is loaded after deployment.
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Scroll Lock

- Added a shared `policy-modal-open` class to lock both `html` and `body` scrolling while the Site Policy modal is open.
- Applied the lock to Contact through `js/form.js`, including the automatic policy modal opening path.
- Applied the same lock to the checkbox-controlled Site Policy modal in `index.html`.
- The existing modal inner scrolling remains available through `overflow-y: scroll`.
- `node --check js/form.js`: PASS
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Width 40vw

- Changed the desktop Contact Site Policy modal width from `75vw` to `40vw`.
- Preserved `75vh` height, viewport centering, internal scrolling, and mobile overrides.
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Size 75%

- Set the Contact Site Policy modal to `75vw` wide and `75vh` high on desktop.
- Removed the previous `400px` maximum width and `30%` height restriction.
- Added `max-height: 75vh` and `box-sizing: border-box` so the modal stays within the viewport and scrolls internally when needed.
- Preserved the mobile-specific modal sizing and all modal behavior.
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Viewport Fix

- Root cause: `main#contact` uses `backdrop-filter`, which makes fixed descendants use the filtered main area as their containing block.
- Moved the Site Policy checkbox, overlay, and modal box to `document.body` during Contact page initialization.
- Kept the centered `translate(-50%, -50%)` positioning and preserved the policy content, consent gate, and close behavior.
- Updated the `form.js` cache-busting query in `contact.html` so deployed browsers load the fix.
- `node --check js/form.js`: PASS
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Centering

- Target: `contact.html` Site Policy modal.
- Changed the hidden and visible transforms to `translate(-50%, -50%)` so the modal is centered in the viewport like the submission-success modal.
- Applied the same centered transform in the mobile media query.
- Preserved modal content, sizing, overlay, close behavior, and Site Policy loading logic.
- `node --check js/form.js`: PASS
- `git diff --check`: PASS

## Scope

- Target: `js/menu.js` and the root page script references
- Compatibility: `js/footer.js` remains as a non-destructive compatibility shim
- Not changed: `header.html`, `footer.html`, `css/menu.css`, `css/footer.css`
- Backups: `backups/20260905_103000_before_header_footer_js_css/` and `backups/20260905_110500_before_footer_into_menu/`

## Implemented

- Removed runtime `fetch("header.html")` and `fetch("footer.html")` dependencies.
- Removed the footer's runtime dependency on jQuery.
- Integrated footer rendering, year output, and `toggleAccordion` into `js/menu.js`.
- Removed redundant `js/footer.js` script tags from the five root pages that render a footer.
- Kept `js/footer.js` as a compatibility shim without its own rendering or event setup.
- Recreated the existing header and footer DOM from JavaScript using `<template>` and `DocumentFragment` cloning.
- Preserved the existing element order, class names, links, labels, language attributes, exhibition text, and footer year output.
- Preserved menu open/close behavior and added keyboard operation without changing visual styles.
- Kept both `selectedLang` and legacy `lang` storage keys synchronized for existing page scripts.
- Added null checks for missing containers and missing title/subtitle elements.
- Kept the existing CSS files unchanged because their selectors already target the generated structure.

## Verification

- `node --check js/menu.js`: PASS
- `node --check js/footer.js`: PASS
- `git diff --check`: PASS

## 2026-09-11 Site Policy Modal Unification

- Target: `index.html` Site Policy modal.
- The modal now loads the Japanese and English policy sections from `policy.html` after page load.
- The previous inline modal content remains as a fallback if the policy page cannot be fetched.
- `index.html` already permits same-origin connections through its CSP, so no external origin was added.
- `git diff --check`: PASS
- No active root HTML page references `js/footer.js`: PASS
- `js/menu.js` contains the only root footer implementation: PASS
- Generated header markup compared with `header.html` after whitespace normalization: identical.
- Generated footer visible markup compared with `footer.html` without its inline script: identical.
- Browser check on the local site: header, footer year, English switch, menu open/close, and mask close: PASS.

## Boundary

The browser showed an unrelated existing `require is not defined` error from `js/page-nation.js` and the existing warning from `vanta.trunk.min.js`: `No THREE defined on window`. Neither is part of the footer integration; no header/footer error was observed.

## 2026-09-06 Public Visual Alignment

### Scope

- Target files: `webpack.config.js` and `js/page-nation.js`.
- Root visual pages kept as the source of truth: `index`, `artist-statement`, `biography`, `gallery`, `contact`, and `policy`.
- Existing user changes, deleted files, and external services were not altered.
- Backup directory: `backups/20260906_before_public_visual_alignment/`.

### Implemented

- Copied the six root visual pages directly into `docs` so page-specific inline CSS and scripts are not rewritten by the src-based HTML build.
- Copied the root `css` and `img` directories used by the local preview.
- Copied an explicit allowlist of root visual scripts instead of the whole root `js` directory. This prevents an unused legacy script from breaking the public build.
- Removed the unused browser-incompatible `require("fs")` statement from `js/page-nation.js` so the existing browser script can load normally.
- Preserved the existing HTML structure, class names, CSS, visual page scripts, cursor implementation, and page behavior.

### Verification

- `npm run check`: PASS (`check:js`, production build, and local link check).
- `node --check webpack.config.js`: PASS.
- `git diff --check -- js/page-nation.js webpack.config.js`: PASS.
- Same-tab browser comparison at `390x844`: all six pages matched in layout metrics, image dimensions, canvas count, modal state, and document height.
- Same-tab browser comparison at `1710x895`: all six pages matched in the same checks.
- Gallery after the change: 8 rendered work elements and 5 pagination controls in both local and generated pages.
- The regenerated `docs` output contains the same root visual page assets as the local preview; the page-nation `require` error is no longer present in the source or generated script.

### Boundary

- The live GitHub Pages site was not changed in this turn. A push and the resulting Actions deployment are still required before the public URL can be declared aligned.
- The browser showed the existing VANTA warning `No THREE defined on window` and browser-extension warnings. These are outside the visual alignment change.
- The missing `img/心樹-web.jpg` remains unchanged in both local and generated pages; no replacement image was guessed.

## 2026-09-06 Public Verification

### Deployment

- The public build was corrected to copy the root `sidebar.html`; the previous `src/sidebar.html` copy was a different structure and caused the mobile flow/layout mismatch.
- The follow-up commit is `2e960b5100a39ed1e3b14f726da0d4cfb072e8b3` and changes only `webpack.config.js` relative to `32217179b5b533feefb0367333609040ceef29de`.
- GitHub Actions run 29 completed successfully: `https://github.com/mizukioyama/website/actions/runs/34021183962`.

### Verification

- Public `gallery.html` at `390x844`: root sidebar structure, `position: fixed`, gallery start at approximately `714px`, 8 images, 5 pagination controls, fixed menu, and both cursor elements present.
- Public `gallery.html` at `1710x895`: root sidebar structure, 8 images, 5 pagination controls, fixed menu, and footer rendered.
- Public `gallery.html`, `sidebar.html`, `css/gallery.css`, and `css/mobile.css` match the local root files by SHA-256.
- Same mobile audit across all six public root pages confirmed header/cursor presence and no horizontal overflow; the expected index page omission of the footer was preserved.
- Public visual scripts match the reproduced production build output; the deployed one-line form is production compression, not a separate UI implementation.

### Remaining Boundary

- Physical-device Safari/iOS and Android acceptance is not covered by the browser check.
- The existing VANTA warning and missing `img/心樹-web.jpg` remain outside this alignment fix.

## 2026-09-06 Cursor Visual Parity

### Scope

- Target files: `src/style/all.css`, the generated `docs/styles/main.css`, and the six root visual pages.
- Static root pages continue to use the existing `css/all.css` and `js/cursor.js` implementation with a cursor-only cache version.
- Backup directory: `backups/20260906_before_cursor_visual_fix/`.

### Implemented

- Synchronized the Webpack cursor CSS with the static-page cursor design.
- Added the same `gradientGlow` animation to the stalker ring.
- Preserved the existing cursor sizes, hover sizes, blend mode, z-index, and hidden native cursor behavior.
- Updated the generated bundle CSS so local/generated pages do not retain the former static white-ring variant.
- Added a cursor-only version query to the shared CSS and JS references on the six static root pages so stale public subresources are not reused.

### Verification

- `node --check js/cursor.js`: PASS.
- `node --check src/js/cursor.js`: PASS.
- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- Source and generated cursor CSS blocks match in declarations and animation settings.
- All six root visual pages reference the versioned cursor CSS and JS assets.
- Public browser inspection confirmed one `#cursor`, one `#stalker`, `cursor: none`, 8px dot, 15px ring, and the `gradientGlow` animation.

### Deployment

- Public commit: `e4e388397f224e45f970820466fc17f7bebf8f06`.
- GitHub Actions run 30 completed successfully: `https://github.com/mizukioyama/website/actions/runs/34023920689`.
- Post-deployment `biography.html` loaded `css/all.css?v=20260906-cursor` and `js/cursor.js?v=20260906-cursor` and retained the expected cursor geometry.

### Boundary

- Physical mouse/touch acceptance on Safari, iOS, and Android remains pending.
- The public static-page assets were already aligned; this change closes the separate Webpack CSS path mismatch and adds a cache refresh boundary for the cursor assets.

## 2026-09-06 Responsive Typography

### Scope

- Target: the six canonical root visual pages, the two active Webpack source pages, shared CSS, sidebar markup, and the corresponding `docs` assets.
- Design boundary: preserve the current effective desktop values as the `clamp()` maximum, while retaining smaller mobile values through the minimum and viewport interpolation.
- Backup: `backups/20260906_before_responsive_font_size/`.

### Implemented

- Converted active fixed `font-size` declarations for body text, headings, links, menus, footers, forms, modals, tables, timelines, sidebars, and matching-page controls to `clamp(min, preferred, max)`.
- Used `rem` for every new minimum and maximum and `rem` plus `vw` in the preferred value.
- Removed duplicate mobile fixed-size overrides where the shared clamp now provides the responsive interpolation.
- Synchronized the root CSS copies in `docs/css` and updated the active Webpack CSS chunks and inline page styles.
- Kept HTML structure, class names, colors, layout rules, animations, and behavior unchanged.
- Left legacy/test-only typography files outside the active page/build path unchanged.

### Verification

- Active and generated target scan: 282 `clamp()` font-size declarations; all have three arguments and `rem` minimum/maximum values.
- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- Root CSS and `docs/css` eight-file synchronization: PASS.
- Focused `git diff --check` for edited source styles and sidebar files: PASS.
- Visual browser and physical-device acceptance at desktop/mobile widths: PENDING.

### Boundary

- No push or deployment was performed for this typography-only change.
- Remaining fixed values are confined to legacy/test or unused style paths and were not changed to avoid altering unrelated pages.

## 2026-09-07 Responsive Width Hardening

### Scope

- Targeted only width-related display-risk areas in the root visual CSS/HTML and the active `src/style` CSS path.
- Preserved existing classes, DOM structure, animation rules, gallery column intent, modal behavior, and page-specific visual direction.
- Created a pre-edit copy of all width targets and reports at `/tmp/website-main-width-backup/`.

### Implemented

- Replaced viewport-overflow-prone `100vw`/`100svw`/`-webkit-fill-available` declarations with containing-block-safe widths.
- Added `min()` and `calc()` guards for gallery containers, cards, footers, forms, modal panels, menu offsets, and the matching form's former fixed `850px` container.
- Replaced reversed or ineffective percentage `clamp()` width declarations in the active source gallery styles with valid `min()`/`calc()` rules.
- Added breakpoint-specific centering and max-width guards for the source gallery and legacy information layouts from tablet through mobile widths.
- Added `min-width: 0`, `max-width: 100%`, wrapping, and safe image/text constraints to prevent flex/grid children and biography tables from forcing horizontal overflow.

### Verification

- CSS parse: PASS (13 targeted CSS files parsed with PostCSS).
- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- Local browser load at desktop width: PASS for `biography.html`.
- Local Chrome screenshot at `390x844`: PASS for biography text wrapping and contact layout; the page remained usable within the narrow viewport.
- Targeted remaining-width scan: no active reversed width `clamp()` or targeted fixed `100vw`/`100svw`/`850px`/`52vmin` declarations remained; one commented legacy example remains for reference.
- `check:generated` could not run because `scripts/check-generated.cjs` is absent from the current working tree.
- No push, deployment, external send, or deletion was performed.

### Boundary

- The current working tree already contains unrelated generated-output edits, deletions, and untracked files. They were not reset or included in this width change.
- The local browser logged pre-existing missing image requests for `img/心樹-web.jpg` and `img/202343-2.jpg`; no replacement was guessed.
- Physical Safari/iOS/Android acceptance and post-deployment public verification remain pending.

## 2026-09-07 JavaScript Dependency Audit and Integration

### Scope

- Targets: the six canonical root pages, `js/menu.js`, `js/page-nation.js`, and `webpack.config.js`.
- Safety boundary: no JavaScript source file was deleted; the pre-edit backup is `/tmp/website-js-integration-backup-20260907/`.
- Visual boundary: existing markup, class names, CSS, animation timing, and page-specific behavior were preserved.

### p5 Decision

- `p5.min.js` is required by `vanta.trunk.min.js`, which creates `VANTA.TRUNK` with `window.p5` and calls p5 canvas lifecycle methods.
- `artist-statement.html`, `biography.html`, and `contact.html` each initialize `VANTA.TRUNK`.
- `p5.min.js` was therefore retained. Removing it would remove or break the existing trunk background and would not be a display-preserving cleanup.

### Implemented

- Integrated the custom cursor initialization from `js/cursor.js` into `js/menu.js`.
- Integrated the loading-screen typing routine from `js/loading.js` into `js/menu.js`.
- Removed the root-page runtime references to `cursor.js` and `loading.js`; all six root pages now use the common `menu.js` path for these behaviors.
- Integrated the gallery sidebar fetch, category toggle, and scroll collapse behavior from `js/side.js` into `js/page-nation.js`.
- Removed the gallery runtime reference to `side.js`; `page-nation.js` still invokes `setupCategoryFilter()` only after the sidebar is loaded.
- Kept `form.js`, `time.js`, `mobile.js`, and `bg_wave.js` page-specific because they serve different pages or require page-specific/vendor dependencies.
- Kept jQuery, jquery-ripples, Three.js, p5, and VANTA files separate as vendor/runtime assets rather than manually merging them.
- Kept the original integrated files and their compatibility copy entries in the Webpack allowlist; complete deletion remains approval-gated.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- `node --check webpack.config.js`: PASS.
- Focused `git diff --check` for this integration: PASS.
- Local browser: gallery sidebar, category list, gallery items, pagination, header, and footer loaded from the integrated path.
- Local browser: Biography common header/footer and Contact form loaded without a runtime failure.
- Isolated production build in `/tmp/website-js-build-validation-20260907/`: PASS; generated root pages reference only `menu.js` plus `page-nation.js` on gallery, while p5 and VANTA assets remain available.

### Boundary

- The working `docs/` directory was not regenerated because it contains unrelated tracked and untracked generated changes; only the isolated build was used for output verification.
- GitHub Pages was not pushed or deployed in this task.
- Physical Safari/iOS/Android and real pointer/touch acceptance remain pending.

## 2026-09-07 Sidebar JS/CSS and Gallery/Footer Width

### Implemented

- Moved the existing gallery sidebar markup into `js/menu.js` as `SIDEBAR_MARKUP` and render it with a `template` and `replaceChildren`.
- Replaced the gallery `sidebar.html` fetch with a `site:sidebar-ready` event between `menu.js` and `page-nation.js`; category filtering, pagination, and scroll toggle behavior remain in the existing gallery flow.
- Moved sidebar layout, responsive rules, and work fade-in animation from the partial HTML into `css/gallery.css`.
- Kept `sidebar.html` as a compatibility/reference partial without its inline style block; it is no longer requested during gallery initialization.
- Increased the active gallery content limit from `1100px` to `1400px`, added a fluid `.gallery-containt` wrapper, and kept the mobile gallery content at `width: 100%` within its responsive parent.
- Reduced excessive footer side padding with `clamp()` on desktop and mobile so the footer content uses more of the available width without changing its structure.
- Created a pre-edit rollback copy at `/tmp/website-sidebar-width-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- Focused `git diff --check`: PASS.
- Local gallery browser: sidebar categories, gallery items, pagination, header, and footer rendered successfully.
- Local HTTP log: no runtime request for `sidebar.html`; only the gallery document, CSS, and JavaScript were requested.

### Boundary

- The generated `docs/` output was not regenerated in place because unrelated generated changes are present.
- Public GitHub Pages was not pushed or deployed in this task.
- Physical mobile-device and touch acceptance remain pending; the mobile rules were statically reviewed but not accepted as a physical-device result.

## 2026-09-07 Gallery 55% and Footer Width Correction

### Implemented

- Reduced the desktop gallery wrapper to approximately `55%` of the available main content width.
- Set the intermediate breakpoint to approximately `72%` so tablet layouts retain usable two-column artwork cards.
- Kept the mobile gallery wrapper and content at `100%` within the mobile page padding.
- Made `#footer-container` and `footer` explicitly use the full available width, with `box-sizing: border-box` and reduced responsive side padding.
- Set footer links to use the full footer content width so the visible footer region does not remain artificially narrow.
- Created a pre-edit rollback copy at `/tmp/website-gallery-footer-55-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- Focused `git diff --check`: PASS.
- Local browser: gallery sidebar, artwork grid, pagination, header, and footer rendered after the width change.
- Local HTTP log: no runtime request for `sidebar.html`.

### Boundary

- Generated `docs/` was not regenerated in place because unrelated generated changes remain in the working tree.
- Public GitHub Pages was not pushed for this correction.

## 2026-09-07 Mobile Footer 90% Width

### Implemented

- Applied the same mobile `min(90%, calc(100vw - clamp(...)))` width policy to `#footer-container`.
- Kept the generated `footer` at `width: 100%` of that responsive container.
- Preserved desktop and tablet footer widths and existing footer markup.
- Created a pre-edit rollback copy at `/tmp/website-footer-mobile-90-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- Focused `git diff --check`: PASS.

### Boundary

- Physical mobile-device and touch acceptance remain pending.
- Public GitHub Pages was not pushed for this correction.
- Physical mobile-device and touch acceptance remain pending.

## 2026-09-07 Mobile Gallery 90% Width

### Implemented

- Set the mobile `.gallery-containt` width to `min(90%, calc(100vw - clamp(2rem, 8vw, 3rem)))`.
- Kept the inner gallery content at `width: 100%` so it follows the responsive wrapper without exceeding it.
- Left the desktop 55% and tablet 72% gallery rules unchanged.
- Created a pre-edit rollback copy at `/tmp/website-gallery-mobile-90-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- Focused `git diff --check`: PASS.

### Boundary

- Physical mobile-device and touch acceptance remain pending.
- Public GitHub Pages was not pushed for this correction.

## 2026-09-07 Footer Full Device Width

### Implemented

- Changed the mobile `#footer-container` from the 90% rule to `width: 100%`.
- Added `min-width: 100%` and `max-width: 100%` so the global `div { width: fit-content; }` reset cannot shrink the footer container.
- Kept the generated `footer` at full container width.
- Created a pre-edit rollback copy at `/tmp/website-footer-device-width-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- `node --check js/menu.js`: PASS.
- `node --check js/page-nation.js`: PASS.
- Focused `git diff --check`: PASS.

### Boundary

- Public GitHub Pages was not pushed for this correction.
- Physical mobile-device and touch acceptance remain pending.

## 2026-09-07 Footer Layout Restoration

### Implemented

- Restored the pre-width-change desktop footer padding: `4rem clamp(1.5rem, calc(7vw - 1rem), 6rem)`.
- Restored the pre-width-change mobile footer padding: `3rem 1.5rem 0`.
- Removed the added `footer a { width: 100%; }` rule and the footer-only `box-sizing` override so the internal layout follows the previous CSS.
- Retained the full-width `#footer-container` and footer width constraints required for device-width rendering.
- Created a pre-edit rollback copy at `/tmp/website-footer-layout-restore-backup-20260907/`.

### Verification

- `npm run check:js`: PASS (22 files).
- `npm run check:links`: PASS.
- Physical mobile-device and touch acceptance remain pending.

### Boundary

- This correction has not been pushed.
- The public GitHub Pages instance still serves the previous pushed CSS until a later approved push.

## 2026-09-07 CSS Organization Audit

### Implemented

- Reviewed root-page CSS, Webpack source CSS, and generated `docs/css/` separately.
- Moved five unreferenced CSS candidates into `archive/css-delete-candidates-20260907/` instead of permanently deleting them.
- Removed the five root-page links and five legacy `src/` template links to `css/font.css` after confirming that no active duration-variable consumer remains.
- Preserved legacy CSS referenced by `_layoutsdefault.html` and kept the moved files available for rollback.

### Verification

- Active source reference scan found no references to the five moved candidates.
- Generated `docs/` was not edited directly; it remains a build output and must be regenerated by `npm run build`.
- Permanent deletion remains approval-gated.

## 2026-09-07 SEO Head and Static H1 Improvement

### Scope

- Primary source: the six root visual pages and their `src/` counterparts.
- Active Webpack pages: `src/information.html`, `src/matching.html`, and `src/bot.html`.
- Build/deployment files: `webpack.config.js`, `sitemap.xml`, `robots.txt`, and generated `docs/` output.
- Backup: `backups/20260907_before_seo_head_improvement/`.

### Implemented

- Replaced generic or duplicated title/description metadata with page-specific Japanese SEO descriptions.
- Corrected all primary canonical and `og:url` values to the deployed `/website/` path.
- Replaced the broken OGP image URL with the existing `img/shinju.jpg` asset and added image alt metadata.
- Removed unsupported `meta keywords` from the active primary page heads and removed duplicate Typekit loading from the home source.
- Removed mobile zoom-locking viewport attributes and added `lang="ja"` to the policy pages.
- Added static text to the five animated content h1 elements while preserving `TextScramble` as the visual effect.
- Changed `menu.js` to use the static h1 text as the animation target and set a stable `aria-label`.
- Added `WebSite`/`Person` JSON-LD to the home page and `ProfilePage`/`Person` JSON-LD to the biography page.
- Updated the unused structured-data reference to the current site identity and removed placeholder social URLs.
- Converted `sitemap.xml` to valid XML, added `robots.txt`, and copied both through Webpack into `docs`.
- Marked the internal matching and bot pages `noindex, nofollow`.
- Restored the two existing published image assets required by still-referenced source paths and corrected the home CSS reference from the missing Japanese filename to `shinju.jpg`.
- Made the optional Font Awesome copy step conditional so a missing local optional dependency does not abort the build.
- Updated the generated-output checker to validate minified JSON-LD attributes instead of treating JSON-LD as JavaScript.

### Verification

- `npm run check`: PASS (`check:js`, production build, generated inline-script/JSON-LD validation, and local reference validation).
- Generated output contains the corrected titles, canonicals, static h1 text, `robots.txt`, and XML sitemap.
- Source and generated missing-image references are resolved.
- Chrome headless mobile screenshot: NOT_TESTED; this environment's Chrome exited with status 134 before producing a screenshot.

### Boundary

- No push or public deployment was performed in this turn.
- Existing generated-output changes and unrelated untracked files were preserved; `docs` was rebuilt and missing pre-existing generated files were restored from the pre-build backup.
- Legacy blog, Jekyll template, partial, and test HTML files remain outside the active deployment path and were not made indexable by this change.

## 2026-09-07 Index Heading Semantics Follow-up

### Implemented

- Kept `Exhibition / Close` as the single primary `h1` in `index.html` and `src/index.html`.
- Changed the alternate `AbstractArtist / MizukiOyama` slide title from `h1` to `h2.creator-title`.
- Mirrored the former h1 typography, width, font, weight, color, and mobile line-height rules on `.creator-title` so the visual presentation is unchanged.

### Verification

- Root and source index pages now contain one primary h1: PASS.
- `npm run check:js`: PASS.
- `npm run check:generated`: PASS.
- `npm run check:links`: PASS.
- Focused CSS/HTML whitespace check: PASS.

### Boundary

- Screenshot-based and physical-device visual acceptance remain pending.
- Public deployment requires a separate explicit push.

## 2026-09-07 Gallery Layout Restoration

### Root Cause

- The right-alignment rule added `margin-top: 60vmin` to `.gallery-containt` while the existing `.gallery .content` already had the same vertical offset.
- The two margins stacked and pushed the artwork area below its intended position.

### Implemented

- Restored the outer `.gallery-containt` margin to `0`.
- Kept the existing `.gallery .content` `margin-top: 60vmin` as the sole artwork offset.
- Kept the sidebar/artwork right-alignment grid and the mobile breakpoint behavior unchanged.

### Verification

- Backup comparison identified the duplicate margin: PASS.
- Local desktop screenshot after the fix: PASS.
- Local mobile screenshot after the fix: PASS.
- `npm run check:js`: PASS.
- `npm run check:links`: PASS.
- Focused CSS whitespace check: PASS.

### Boundary

- Public deployment has not been updated for this restoration.
- Physical-device acceptance remains pending.

## 2026-09-07 Gallery Sidebar Right Alignment

### Implemented

- Added a desktop/tablet CSS grid for the gallery page without changing its HTML or JavaScript.
- Positioned the sidebar in an approximately 20% track and the artwork area in an approximately 55% track.
- Added an approximately 15% responsive gap between the sidebar and artwork area using `clamp()` and `calc()`.
- Right-aligned the combined layout and preserved the existing fixed mobile sidebar below 600px.

### Verification

- Local gallery browser load: PASS.
- Sidebar generation, 8 artwork items, and pagination controls: PASS.
- `npm run check:js`: PASS.
- `npm run check:links`: PASS.
- Focused CSS whitespace check: PASS.

### Boundary

- Screenshot-based, physical-device, and public-deployment verification remain pending.
- The generated `docs/` output was not edited directly because it contains unrelated existing changes.

## 2026-09-07 Gallery Sidebar Vertical Offset Restoration

### Root Cause

- The pre-alignment backup preserved `#sidebar-container { top: 20vh; }`.
- The desktop right-alignment override replaced that offset with `top: 0`, moving the sidebar upward into the gallery heading/subtitle area.

### Implemented

- Restored `top: 20vh` inside the desktop right-alignment rule.
- Kept the right-aligned grid, responsive 20% sidebar track, 15% gap, 55% artwork limit, and mobile breakpoint unchanged.
- Created the rollback copy at `backups/20260907_before_gallery_vertical_restore/gallery.css`.

### Verification

- Compared the current CSS with `backups/20260907_before_gallery_sidebar_right_align/gallery.css`: PASS.
- Same-viewport local browser comparison shows the sidebar below the heading without overlap: PASS.
- JavaScript syntax check: PASS.
- Local HTML/CSS/JavaScript reference check: PASS.
- Focused CSS whitespace check: PASS.

### Boundary

- This correction is local only; public deployment has not been performed.
- Mobile CSS remains outside the changed desktop breakpoint; physical-device acceptance remains pending.
# 2026-09-23 Contact Semantic Rename — phase3-css-structure-cleanup-v2

## Scope

- Targeted only the three requested Contact candidates from HEAD `fbf8a0f51dfe12b908313efc0d6c007ddc6fcb8a`.
- Source-only edits: `css/all.css`, `css/gallery.css`, and `css/form.css`.
- `docs/` was regenerated by the build and was not edited directly.
- No numeric value, `clamp()`/`calc()` expression, unit, breakpoint, selector, specificity, declaration order, cascade, or Contact typography rule was changed.

## Semantic audit

| Old name | New name | Confirmed role |
| --- | --- | --- |
| `--legacy-px-1_256` | `--font-contact-control-fluid-mid` | Contact message / submit button / floating-label control clamp middle term (`var(...) + 0.92vw`) |
| `--legacy-px-1_628` | `--font-contact-input-fluid-mid` | Contact input clamp middle term (`var(...) + 0.46vw`) |
| `--legacy-px-2` | `--font-contact-control-fluid-max` | Contact control/input clamp maximum term; the one commented legacy formula was renamed too |

Each variable has three source definitions: `css/all.css` base, `css/gallery.css` 600–899px, and `css/gallery.css` 900px+. Source definition changes: 9. Source reference changes: 5 (`1_256`: 1, `1_628`: 1, `2`: 3 including the commented legacy formula). Generated mirrors are synchronized by build.

## Rename invariants

- Active source references to all three old names: 0.
- Value / formula / structure differences after normalizing the new names back to the old names: 0.
- Source custom-property audit across active CSS, HTML, JS, and `src/` templates: undefined 0, unused 0.
- `git diff --check`: PASS.

## Contact seven-viewport matrix

The source formula evaluation covers 1440, 1280, 1024, 768, 430, 390, and 375px. The before and after matrices are identical: computed-style difference count 0. Width and height declarations remain unchanged (`input`/`message` width `100%`; input height `42pt` at 1440 and `40pt` below 1300; message height `calc(150pt + 80px)`; submit height `40pt` at 1440, `28pt` at 601–1299, and `35pt` at <=600). Line-height declarations remain unchanged (`normal` input, `1.4` message on mobile, `1.5rem` submit, and existing label rules).

| Viewport | Input font-size | Message font-size | Submit font-size | Label font-size |
| ---: | ---: | ---: | ---: | ---: |
| 1440 | 16px | 16px | 19.2px | 12px |
| 1280 | 28px | 28px | 28px | 12px |
| 1024 | 27.5024px | 27.5024px | 27.0048px | 12px |
| 768 | 21.932416px | 21.932416px | 23.986432px | 12px |
| 430 | 11.10334px | 11.10334px | 11.10334px | 14px |
| 390 | 11.02822px | 11.02822px | 11.02822px | 14px |
| 375 | 11.00005px | 11.00005px | 11.00005px | 14px |

## Verification

- `npm run build`: PASS; Webpack completed with the repository's existing asset-size/performance warnings, and caption embedding/versioning completed.
- `npm run check`: first run reached the expected generated-sync gate after build; final PASS is recorded after committing the regenerated `docs/` output.
- Generated CSS is byte-identical to source for `all.css`, `gallery.css`, and `form.css`; old names are absent from generated output.
- SEO and links are included in the final `npm run check` gate.

## Boundary

- Not changed: `--legacy-px-1_3`, other shared/ambiguous legacy variables, JS-generated CSS variables, Typography formulas, `clamp()`/`calc()` values, scope placement, or JS organization.
- No push, public deployment, deletion, or external send was performed.
# 2026-09-23 Menu Semantic Rename — phase3-css-structure-cleanup-v2

## Scope

- Targeted only `--legacy-px-1_3` from HEAD `ebda617d8d2e6c5c2535e1fc37f8c0884cad925e`.
- Source-only edits: `css/all.css`, `css/gallery.css`, and `css/menu.css`.
- `docs/` was regenerated by build; it was not edited directly.
- No numeric value, `clamp()`/`calc()` expression, unit, breakpoint, selector, specificity, declaration order, cascade, or Menu typography design was changed.

## Semantic audit

- Rename: `--legacy-px-1_3` → `--font-menu-item-fluid-mid`.
- Exact role: the Menu item mobile `clamp()` middle term, `calc(var(...) + 0.8vw)`, in `.inner li a` at `max-width: 599px`.
- Scope definitions: base `css/all.css`, 600–899px `css/gallery.css`, and 900px+ `css/gallery.css`.
- The later semantic Menu rules still control the final cascade; this rename does not alter that cascade.

## Rename invariants

- Source definition changes: 3.
- Source reference changes: 1.
- Active old-name definitions: 0.
- Active old-name references: 0.
- Value / formula / structure differences after normalizing the new name back to the old name: 0.
- Source custom-property audit across active CSS, HTML, JS, and `src/` templates: undefined 0, unused 0.
- `git diff --check`: PASS.

## Menu seven-viewport matrix

The before and after Menu item matrices are identical; computed-style difference count is 0.

| Viewport | font-size | line-height | width | height |
| ---: | ---: | ---: | --- | --- |
| 1440 | 24.64px | normal | auto/stretch-preserving | 100% |
| 1280 | 19.2px | normal | auto/stretch-preserving | 100% |
| 1024 | 18.496px | normal | auto/stretch-preserving | 100% |
| 768 | 17.472px | normal | auto/stretch-preserving | 100% |
| 430 | 25.84px | 1.4 | auto/stretch-preserving | 100% + min-height 44px |
| 390 | 25.6px | 1.4 | auto/stretch-preserving | 100% + min-height 44px |
| 375 | 25.6px | 1.4 | auto/stretch-preserving | 100% + min-height 44px |

## Verification

- `npm run build`: PASS; Webpack completed with the repository's existing asset-size/performance warnings.
- Generated `docs/css/all.css`, `gallery.css`, and `menu.css` synchronize with source; generated old-name active definition/reference counts are 0.
- Final `npm run check`: PASS, including generated sync, SEO, and links.

## Boundary

- No remaining legacy variable was changed.
- No JS-generated CSS, HTML inline/raw legacy variable, usage-separated variable, deletion, push, or public deployment was included.


## 2026-09-27 Gallery Sidebar and Captions Repair

### Findings

- Compared the Gallery JavaScript attached to the referenced conversation with the current files in the VS Code repository; the active source contained the same competing category handlers and the caption title-selector mismatch.
- Category state had three competing owners: menu.js used a mobile-only handler, page-nation.js added a second toggle plus scroll-driven collapsed state, and gallery-captions.js also managed category state and observers. At widths of 600px and above, the Gallery CSS disabled pointer input on the Category heading.
- The current modal markup renders its title as .works p, while caption lookup searched only .works h2. The caption data loaded, but the title lookup returned no match.

### Changes

- menu.js now owns the Category state at every width. It starts closed, toggles by click/Enter/Space, closes after selection, updates aria-expanded, and keeps the glass overlay mobile-only.
- page-nation.js retains category filtering and no longer owns toggle or scroll state.
- gallery-captions.js now handles caption data and modal captions only. It retains source parsing, JP/EN title mapping, language-change updates, and modal mutation observation; title matching supports both h2 and p.
- gallery.css no longer blocks the desktop Category heading or uses a collapsed-open selector. gallery.html has updated local asset cache keys.
- npm run build regenerated docs from the root sources and embedded 48 caption records. Shared component output is synchronized from src/components/header.html.

### Verification

- PASS: local browser at 599px and 600px; both start closed and click, Enter, Space, and category selection produce the expected state.
- PASS: scrolling while open preserves mobile-open and aria-expanded at both widths.
- PASS: at 599px the overlay is hidden closed, visible open, and clicking it closes the menu; at 600px it is absent.
- PASS: 蒼縁 displays the Japanese caption; sōen displays the English caption after switching language before opening the modal.
- PASS: caption data URL returned HTTP 200; browser console error and warning logs were empty.
- PASS: npm run build, check:components, check:js, check:generated, check:seo, and check:links.
- FAIL: npm run check stops at check:typography with css/all.css: missing shared body scale. css/all.css was already modified before this task and was not changed for this repair.
- FAIL: check:docs-sync reports committed docs stale because current source and generated output are uncommitted. check:generated confirms current source/generated consistency.
- WARN: git diff --check reports trailing whitespace and CRLF line endings across the already-dirty source and generated files; broad line-ending cleanup was kept out of this repair.
- Webpack completed with existing large-asset/performance warnings. Public delivery and physical-device checks were not run.

### Git boundary

- HEAD remains 9277c31def1e14290b5ff5dd6f821003f94060da on main. The working tree remains dirty with pre-existing user changes, this repair, and generated docs. No commit, push, merge, or deployment was performed.

## 2026-09-27 Language Audit and CSS Deduplication Follow-up

This entry supersedes the earlier Gallery repair check summary above where the typography-check and modal-language results differ.

### Language and caption findings

- The shared header source is src/components/header.html. js/menu.js renders the matching header and owns the language radio state. The header and component IDs had drifted to the misspelled langChenge in several selectors; they now consistently use langChange.
- The stored language is read from selectedLang first and legacy lang second. A selection writes both keys. The language radio handlers are bound once per generated input using data-language-bound; the header, navigation, Category control, caption observer, and Gallery initialization also have one-time guards.
- Header language initialization now runs immediately after the header is built, before the animation-frame menu setup. This applies the saved language before Gallery's first language-sensitive render.
- The browser's hidden attribute was losing to the positioned #langChange rule on bilingual pages. The explicit #langChange[hidden] rule now hides the control. On Gallery, the language control sits above the artwork modal layer so it remains usable while the modal is open.
- The caption loader still fetches js/gallery-captions-data.js?v=20260910-2 and parses its JavaScript object records. The current modal title is a paragraph, while the old matcher only looked for an h2. The matcher now supports either .works h2 or .works p, then updates .modal-text p using documentElement.lang. Language-change and modal-mutation updates remain guarded against duplicate binding.

| Page | Ja/En result |
| --- | --- |
| Home | PASS at 390px and 1440px: both directions, active control, visible language content, documentElement.lang, and navigation persistence. |
| Gallery | PASS at 390px and 1440px: both directions, page content, modal title and caption, including changing language while the modal stays open. |
| Order | PASS at 390px and 1440px: both directions, Japanese/English content blocks, documentElement.lang, and navigation persistence. |
| Policy | PASS at 390px and 1440px: both directions, Japanese/English content blocks, documentElement.lang, and navigation persistence. |
| Biography | Both languages remain visible and the selector remains hidden under data-language-mode=bilingual. documentElement.lang stays at the source value ja. Navigation back to a switchable page preserves the stored choice. A local Ja/En click on this page is not applicable because the control is intentionally hidden. |
| Artist Statement | Both languages remain visible and the selector remains hidden under data-language-mode=bilingual. documentElement.lang stays at the source value ja. Navigation back to a switchable page preserves the stored choice. A local Ja/En click on this page is not applicable because the control is intentionally hidden. |
| Information | The source currently marks this page bilingual, hides the selector, and presents Japanese/English copy together. documentElement.lang stays ja. Ja/En operation on this page is not available under the current source mode. |
| Contact | The source currently marks this page bilingual, hides the selector, and presents Japanese/English copy together. documentElement.lang stays ja. Ja/En operation on this page is not available under the current source mode. |
| Yurayura | The source currently marks this page bilingual, hides the selector, and presents Japanese/English copy together. documentElement.lang stays ja. Ja/En operation on this page is not available under the current source mode. |

At the time of this 2026-09-27 audit, the project checklist documented Biography and Artist Statement as bilingual pages with the selector hidden. Information, Contact, and Yurayura also hid the selector and displayed Japanese and English together. The user decision was pending then; the confirmed 2026-09-29 policy is recorded in the latest addendum below.

Gallery Category remains owned by js/menu.js at all widths: initially closed, click toggles, Enter/Space toggles, category selection closes, and scrolling does not change state. No Gallery display state uses collapsed. The glass overlay is present only through 599px and follows the menu state.

### CSS cleanup and visual comparison

Compared with the saved post-Phase-1 baseline, removed only duplicate, overridden, or unreferenced declarations:

- css/all.css: the earlier --bg value overridden by the later value; unreferenced --legacy-px-1_1 and --font-menu-item-fluid-mid; the earlier h1 font-family declaration overridden in the same rule; and the earlier link padding value overridden by the next declaration.
- css/gallery.css: unreferenced --legacy-px-1_1 and --font-menu-item-fluid-mid definitions at the existing breakpoints, plus --gallery-sidebar-width and --gallery-sidebar-gap with no remaining references.
- css/mobile.css: the earlier duplicate .art-page #category-menu.mobile-open padding/gap rule and duplicate State heading declarations.
- css/menu.css: the dead misspelled #langChenge #mask selector and older menu font-size rules superseded by the active shared semantic rule.
- css/index.css: the overridden even-slide title shadow, card_line height, and first background gradient.
- order.html: an inline #langChenge hide rule targeting an ID that does not exist.

The root-level old numeric font-size scale was already absent in the saved pre-cleanup baseline. assets/css/user-settings.css remains the authoritative editable source, existing compatibility aliases with live references remain, and no blanket !important removal was made. The typography checker now checks that all.css uses the shared body token and that user-settings.css defines its role, instead of requiring a numeric token in the wrong file.

Before/after comparison used the saved generated docs baseline and the current generated docs. After the title animation settled, all 9 pages at 1440, 1280, 1024, 768, 430, 390, and 375px (63 page/viewport pairs) had zero measured computed-style or geometry differences in the selected 27 properties and page selectors. Horizontal overflow was zero in all pairs. Header, language control, navigation, menu mask, footer, Gallery card, sidebar, and caption/modal selectors were included.

Interactive before/after comparison also matched at 390px and 1440px. At 390px the closed Category menu measured 85.36px wide by 0px high and the open menu 93.16px by 506.13px; the mobile overlay changed from hidden to visible only while open. The modal box was 370.5px by 827.12px in both Japanese and English. At 1440px the Category menu measured 91.64px by 0px closed and 104.53px by 630px open; no glass overlay was present. The desktop modal measured 1368px by 855px in both languages. No horizontal overflow appeared.

### Checks and limits

- PASS: npm run build, check:components, check:js, check:typography, check:generated, check:seo, and check:links.
- BLOCKED by the no-commit boundary: check:docs-sync and the combined npm run check stop because docs/ differs from committed HEAD. Source and generated output are synchronized; committing docs/ is prohibited for this task.
- PASS: undefined CSS custom properties = 0, including the runtime property references scanned; conflict-marker scan = 0; browser console errors = 0; Gallery caption text rendered in both languages with no caption-load console error.
- Pageerror events were not independently instrumented because the available browser interface exposes console logs but not a pageerror event hook. Do not interpret this as a separate pageerror event assertion.
- git diff --check still reports changed CRLF lines as trailing whitespace. Line endings and unrelated manual changes were preserved rather than normalizing whole files.
- Webpack retains its existing large-asset/performance warnings. Public and physical-device checks were not run.

### Files and Git state

- Source/runtime: biography.html, contact.html, gallery.html, order.html, src/components/header.html, src/information.html, src/exhibitions/yurayura/index.html, js/menu.js, js/page-nation.js, js/gallery-captions.js.
- CSS/checker: css/all.css, css/gallery.css, css/mobile.css, css/menu.css, css/index.css, css/index-tablet.css, scripts/check-typography.cjs.
- Generated docs were rebuilt from source; no generated file was directly edited.
- Review reports and the existing review ZIP were updated append-only. Untracked css/変更メモ.css and docs/css/変更メモ.css were preserved.
- HEAD remains 9277c31def1e14290b5ff5dd6f821003f94060da. The working tree is dirty, including changes that existed before this follow-up. No commit, push, merge, or deployment was performed.


## 2026-09-28 Intermediate Release Checkpoint

### Release

- Published checkpoint commit `6c676cf6098742a2ffe8ef8e2432b4f404e2e8e0` (`Stabilize gallery interactions and CSS cleanup`) from `main`, parent `9277c31def1e14290b5ff5dd6f821003f94060da`.
- The commit contains 36 implementation, checker, and generated `docs/` files. Push to `origin/main` succeeded.
- GitHub Actions run 369, `Deploy static site to GitHub Pages`, completed successfully: both `build` and `deploy` jobs succeeded. Run: https://github.com/mizukioyama/website/actions/runs/36356601019
- Public site: https://mizukioyama.github.io/website/

### Public browser verification

- All nine pages (Home, Gallery, Biography, Artist Statement, Information, Order, Contact, Policy, Yurayura) were opened at 390x844 and 1440x900. No horizontal overflow was found. Header and menu control were present on all nine; the footer was present on the eight pages that include it (Home has no footer).
- Gallery was also checked at 1440, 1280, 1024, 768, 430, 390, and 375px. Category started closed at every width, the page had no horizontal overflow, and the glass overlay existed only at widths below 600px and started hidden.
- Mobile Gallery: opening Category showed the overlay; after scrolling, `aria-expanded` remained true; the header closed the menu; choosing Digital set the active category, displayed eight cards, and closed the menu; clicking the overlay also closed the menu.
- Desktop Gallery: Category opened and closed after selecting Digital; the glass overlay was absent. The modal fit inside the 1440x900 viewport. With the modal left open, the title/caption changed Japanese `蒼縁` to English `sōen` and back correctly; Close hid the modal.
- Home, Gallery, Order, and Policy switched Ja/En in both directions at 390px and 1440px. Biography, Artist Statement, Information, Contact, and Yurayura retained their existing bilingual display with the language control hidden. No language-spec change was made.
- CSS cleanup showed no public layout break or horizontal overflow in the checked page/viewport matrix.
- Public browser console errors: 0. The existing `[VANTA] No THREE defined on window` warning appeared on page loads. The first uncached Home visit kept its loading veil until its intro finished (about 13 seconds in this session); no change was made to that behavior.

### Local checks and boundaries

- Post-commit `npm run check`: PASS, including components, JavaScript syntax, typography, build, docs sync, generated output, SEO, and links. `npm run check:docs-sync` also passed independently. The check hid untracked files from Git status so the intentionally preserved `docs/css/変更メモ.css` user memo would not be mistaken for generated output; tracked generated docs are clean and synchronized.
- Undefined CSS custom-property references: 0. Conflict markers: 0. The Playwright package is unavailable in this checkout; browser verification used the connected real browser instead.
- Webpack completed with its existing large-asset/performance warnings. The release diff retained existing CRLF conventions; no broad line-ending conversion was made.
- Excluded from the release commit: `ROADMAP.md`, report files and review ZIP, `css/変更メモ.css`, and `docs/css/変更メモ.css`. The notes remain in place; reports and ROADMAP remain local changes.
- Physical iOS/Android acceptance remains pending. Information, Contact, and Yurayura language behavior and large MD/spec review are deferred to the next task.

## 2026-09-28 Final Intermediate Release Follow-up: cc19d2c

### Release and deployment
- Checkpoint commit 6c676cf6098742a2ffe8ef8e2432b4f404e2e8e0 was pushed to origin/main; Pages run 369 completed successfully.
- Follow-up commit b0f98e79badb5dc203aad7d40915dc04109ad5f4 aligned the visual regression selectors with the current Gallery DOM.
- Final corrective commit cc19d2cb5167b99a3b296a700a1f57caf9043d81 restored the shared mobile header typography and aligned the regression assertions. Push succeeded; main and origin/main are synchronized at this SHA.
- Pages run 371 completed successfully: https://github.com/mizukioyama/website/actions/runs/36362240463
- Public site: https://mizukioyama.github.io/website/

### Final verification
- Post-commit npm run check and standalone check:docs-sync passed. Components, JavaScript, typography, build, generated output, SEO, links, and source/docs synchronization passed.
- Local browser suite at 1280px and 430px completed with 33 passed and 11 skipped.
- After Pages run 371, public browser verification completed with 20 passed at 1440px and 390px, covering all nine pages plus the registered 404 route. The run used ignore-snapshots, so layout, content, overflow, and interaction assertions ran, but this result does not establish screenshot-baseline parity.
- Public browser checks reported zero console errors and zero horizontal overflow. The expected missing-route response for the 404 test was recorded. Existing VANTA and WebGL performance warnings were observed.
- Gallery Category, modal/caption, and Ja/En interactions were exercised in the public run. Home, Gallery, Order, and Policy retain Ja/En switching. Biography, Artist Statement, Information, Contact, and Yurayura retain their existing bilingual display with the language control hidden.
- CSS cleanup produced no observed layout break at the verified widths. Undefined CSS custom-property references = 0 and conflict markers = 0. A CRLF-aware diff check passed; no broad line-ending conversion was made.

### CI Visual Regression status
- Visual Regression run 398 failed on cc19d2c: https://github.com/mizukioyama/website/actions/runs/36362287009
- The repository-checks/build step passed; the visual test step exited with code 1. GitHub exposed only the generic failure annotation in the unauthenticated session. Retrieving the job log returned HTTP 403, so the failing assertion or screenshot difference could not be identified.
- At the time of this 2026-09-28 report, the Visual Regression gate was unresolved. It is resolved by the later #406 PASS recorded in the 2026-09-29 addendum below; the baseline was not changed in this documentation task.

### Working-tree boundary
- Final HEAD: cc19d2cb5167b99a3b296a700a1f57caf9043d81; branch main is synchronized with origin/main.
- Excluded and retained: css/変更メモ.css and docs/css/変更メモ.css remain untracked and unstaged; ROADMAP.md, this report set, and reports/chatgpt-review-package.zip remain local modifications and were not included in release commits.
- No files were deleted. The language specification for Information, Contact, and Yurayura and the broad MD/spec review were deferred.
- Physical-device acceptance and owner review remain pending. Keep the next specification task stopped until the owner has reviewed the published checkpoint and the Visual Regression failure has been classified.


## 2026-09-29 Language specification and release-baseline alignment

### Current source-of-truth roles

- `PORTFOLIO_MASTER_SPEC.md` is the canonical page-purpose and language-presentation specification.
- `AGENTS.md` is the canonical operational and Visual Regression/deployment sequence.
- `DESIGN_SYSTEM.md` owns visual and typography rules; `assets/css/user-settings.css` remains the editable font-size source described in `CSS_VARIABLES_GUIDE.md`.
- `SITE_MAP.md` owns public routes and source-to-generated mapping. `QA_CHECKLIST.md` is an evidence checklist that points back to the operational policy.
- `ROADMAP.md`, `reports/known-issues.md`, and `reports/next-actions.md` own current priorities, open issues, and ordered actions respectively. Dated review/checklist/request documents remain evidence archives.

### Confirmed page-language behavior

- Ja/En switch: Home, Gallery, Order and Policy.
- Japanese followed by English, with the switch hidden: Biography, Artist Statement, Information and Contact. Contact keeps its bilingual form labels/fields together.
- Yurayura remains Japanese-led with partial English and no switch. Consider a switch only after the full translation is prepared and reviewed.
- Information's remaining English coverage and language markup, Yurayura's full translation and language markup, and Yurayura table semantics remain open follow-ups.

### Formal release baseline

- `main` / `origin/main`: `f6427178ca3fa37ccd5744a6e66d14864f056818`.
- Pages build/deploy: PASS. Visual Regression #406: 53 passed, 13 skipped, 0 failed, with screenshot comparison active. The earlier #398 failure is resolved by this later passing result.
- Public Home, Gallery, Biography, Artist Statement, Information, Order, Contact, Policy and Yurayura were checked at 1440px and 390px. Horizontal overflow and browser console errors: 0. Gallery sidebar and captions behaved as expected.
- This documentation pass changes no HTML, CSS, JavaScript, generated `docs/` or screenshot baselines. No translation or accessibility implementation was performed.

### Review-package handling

`reports/chatgpt-review-package.zip` is a transfer snapshot for external review, not an authoritative spec or required build/deploy input. The repository operating rules do not require it in the documentation commit. It is retained unchanged and excluded from this commit; its existing modified working-tree version remains available for a separate decision.
