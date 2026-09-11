# Header / Footer Review Report

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
