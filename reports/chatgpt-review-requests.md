# Review Requests

## 2026-09-11 Contact Body Left Alignment

Please review the focused `css/form.css` and `contact.html` change.

1. Confirm that the PC Contact body text starts on the same left edge as the Contact H1.
2. Confirm that the existing two-column/content width and top spacing remain unchanged.
3. Confirm that mobile layout remains unchanged.

## 2026-09-11 Site Policy Modal Scroll Lock

Please review the focused `contact.html`, `index.html`, and `js/form.js` changes.

1. Confirm page scrolling is disabled while each Site Policy modal is open.
2. Confirm policy content can still scroll inside the modal.
3. Confirm page scrolling is restored after closing each modal.
4. Confirm the submission-success modal and consent behavior remain unchanged.

## 2026-09-11 Site Policy Modal Width 40vw

Please review the focused `contact.html` CSS change.

1. Confirm the desktop modal width is `40vw`.
2. Confirm the height remains `75vh` and the modal remains centered.
3. Confirm internal scrolling and mobile behavior remain intact.

## 2026-09-11 Site Policy Modal Size 75%

Please review the focused `contact.html` CSS change.

1. Confirm that the desktop modal uses 75% of the viewport width and height.
2. Confirm that long policy content scrolls inside the modal without moving the modal off-screen.
3. Confirm that mobile sizing, centering, consent behavior, and close behavior remain intact.

## 2026-09-11 Site Policy Modal Viewport Fix

Please review the focused `js/form.js` and `contact.html` change.

1. Confirm that the Site Policy modal is moved under `document.body` and remains a sibling of the checkbox and overlay.
2. Confirm that it is centered in the viewport while the Contact page is scrolled.
3. Confirm that the consent gate, policy loading, close behavior, and submission-success modal remain unchanged.

## 2026-09-11 Site Policy Modal Centering

Please review the focused `contact.html` CSS change.

1. Confirm that the Site Policy modal is centered at desktop and mobile widths.
2. Confirm that the submission-success modal remains unchanged and centered.
3. Confirm that the existing modal content, overlay, close behavior, and policy loading remain unchanged.

## 2026-09-11 Site Policy Modal Unification

Please review the focused `index.html` change.

1. Confirm that opening the index Site Policy modal shows the current Japanese and English content from `policy.html`.
2. Confirm that the existing modal open/close behavior, gallery link, and visual styling remain unchanged.
3. Confirm that the inline policy remains available as a fallback if `policy.html` cannot be fetched.
4. Treat GitHub Pages deployment/cache refresh and physical-device checks as separate acceptance steps.

## 2026-09-07 Gallery Sidebar Right Alignment Review

Please review only the gallery layout addition in `css/gallery.css`.

### Required checks

1. Confirm that desktop/tablet layout uses an approximately 20% sidebar track, 15% responsive gap, and up to 55% artwork track.
2. Confirm that `clamp()` and `calc()` keep the two-column layout within the available width at 600px, 768px, 1024px, and desktop widths.
3. Confirm that the combined sidebar/artwork group is right-aligned without changing the gallery HTML, artwork rendering, pagination, modal, or JavaScript behavior.
4. Confirm that widths below 600px retain the existing fixed sidebar and mobile artwork behavior.
5. Confirm that the outer `.gallery-containt` does not duplicate the existing `.gallery .content` vertical offset.
6. Treat screenshot-based, physical-device, generated-output, and public-deployment checks as separate boundaries.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

Please review the current working-tree changes in `js/menu.js`, the compatibility shim in `js/footer.js`, and the root page script references.

## Required checks

1. Confirm that the generated DOM remains equivalent to `header.html` and `footer.html` for visible structure, order, text, class names, and links.
2. Confirm that no runtime request for `header.html` or `footer.html` remains in the target scripts.
3. Confirm that footer rendering is invoked by `menu.js` and that no root page still loads `footer.js`.
4. Confirm that loading the compatibility shim after `menu.js` does not render the footer twice.
5. Confirm that the menu keeps the existing `open` class behavior and that clicking the mask closes it.
6. Confirm that Japanese and English language controls update `html[lang]`, active classes, radio state, and language-specific content.
7. Confirm that pages without `header-container`, `footer-container`, or `p.subtext` do not throw errors.
8. Confirm that the existing root CSS files remain sufficient and that no layout or animation regression was introduced.

## Review boundary

This request is for local code review only. Do not publish, deploy, send, or modify external services.

## 2026-09-06 Visual Alignment Review

Please review only the focused changes in `webpack.config.js` and `js/page-nation.js`.

### Required checks

1. Confirm that the six root visual pages are copied as static pages and retain their local page-specific CSS and scripts.
2. Confirm that the root visual script allowlist contains every script required by those pages and does not depend on deleted or malformed legacy scripts.
3. Confirm that removing `require("fs")` from `js/page-nation.js` does not change the existing HTML structure, class names, CSS, or intended gallery behavior.
4. Confirm that local and generated pages match at both `390x844` and `1710x895`, including cursor, menu, background, gallery, modal, and footer behavior.
5. Confirm that unrelated working-tree deletions and untracked files are excluded from any proposed commit.
6. Confirm that public deployment remains `PENDING` until an explicit push and a completed GitHub Actions run are verified.

This remains a local review request. Do not publish, deploy, send, delete, or modify external services.

## 2026-09-06 Public Follow-up Result

- The public deployment was explicitly approved and pushed as commit `2e960b5100a39ed1e3b14f726da0d4cfb072e8b3`.
- GitHub Actions run 29 completed successfully.
- The public mobile and desktop gallery checks passed after the sidebar source correction.
- The root public HTML/CSS resources match the local source; remaining physical-device acceptance is still required for a complete real-device review.

## 2026-09-06 Cursor Visual Parity Review

Please review only the cursor CSS synchronization in `src/style/all.css`, `docs/styles/main.css`, and the cursor asset references in the six root visual pages.

### Required checks

1. Confirm that the static-page and Webpack cursor rules use the same dot/ring sizes, colors, blend mode, hover sizes, and `gradientGlow` animation.
2. Confirm that the generated CSS does not retain the former static white-ring-only definition.
3. Confirm that `js/cursor.js` and `src/js/cursor.js` still create only one cursor pair and preserve delegated hover behavior.
4. Confirm that all six root visual pages use the same cursor-only cache version for `css/all.css` and `js/cursor.js`.
5. Confirm that the change does not alter page layout, menu, footer, gallery, modal, or form behavior.
6. Confirm desktop and mobile/touch behavior separately; physical-device acceptance remains outside the automated check.

### Review boundary

This request is for local code review of the cursor parity change. Do not delete unrelated files or include unrelated working-tree changes in a commit.

## 2026-09-06 Cursor Deployment Result

- Commit `e4e388397f224e45f970820466fc17f7bebf8f06` was pushed to `main`.
- GitHub Actions run 30 completed successfully.
- The deployed biography page loaded the versioned cursor assets and passed the one-pair, `cursor: none`, 8px dot, 15px ring, and animated stalker checks.

## 2026-09-06 Responsive Typography Review

Please review only the responsive font-size changes in the canonical root pages, active source styles, sidebars, and generated `docs` assets.

### Required checks

1. Confirm that the current effective desktop or largest existing value is preserved as each `clamp()` maximum.
2. Confirm that every new `font-size` clamp uses `rem` minimum and maximum values and a responsive preferred value.
3. Confirm that mobile fixed overrides were removed only where the shared clamp covers the same selector and does not change layout intent.
4. Check line wrapping, heading hierarchy, menu/footer spacing, modal content, form controls, tables, and pagination at 320px, 390px, 768px, 1024px, and desktop widths.
5. Confirm that root CSS and `docs/css` remain synchronized and that active Webpack chunks contain the same typography policy.
6. Confirm that no HTML structure, class name, animation, or non-typography behavior changed.
7. Treat physical Safari/iOS/Android and real pointer/touch acceptance as separate checks from static validation.

### Review boundary

This request is for local code review only. Do not publish, deploy, send, delete, or modify external services.

## 2026-09-07 Responsive Width Hardening Review

Please review only the width and breakpoint changes in the root visual CSS/HTML and active `src/style` CSS files.

### Required checks

1. Confirm that each new `min()`/`calc()` preserves the existing desktop maximum while preventing viewport overflow at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
2. Confirm that gallery grids remain two columns where the existing UI required two columns, and that container-query stacking still activates at the existing threshold.
3. Confirm that the modal padding, form widths, footer padding, menu offset, biography text/table widths, and matching form remain usable without horizontal clipping.
4. Confirm that the corrected source gallery width declarations are valid CSS and do not reintroduce the former reversed `clamp()` behavior.
5. Confirm that no HTML structure, class name, animation, or non-width behavior changed.
6. Review the source/build boundary separately: the current `docs` directory contains unrelated pre-existing generated changes, so no generated-output cleanup or deletion should be proposed from this request.
7. Treat the missing `scripts/check-generated.cjs`, pre-existing missing image assets, physical-device testing, and public deployment as separate pending items.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Index Heading Semantics Review

Please review only the home-page heading change in `index.html`, `src/index.html`, `css/all.css`, `css/index.css`, `src/style/home.css`, and the synchronized public CSS copies.

### Required checks

1. Confirm that `Exhibition / Close` remains the only primary h1 on the home page.
2. Confirm that `AbstractArtist / MizukiOyama` is now an h2 with the `creator-title` class.
3. Confirm that `.creator-title` preserves the previous h1 typography, width, color, line-height, and responsive behavior.
4. Confirm that no JavaScript selector or existing slide behavior depends on the second title being an h1.
5. Treat screenshot-based, physical-device, generated-output, and public-deployment checks as separate boundaries.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 SEO Head and Static H1 Review

Please review only the SEO/head and static-h1 changes in the root pages, active `src/` pages, `js/menu.js`, `webpack.config.js`, `scripts/check-generated.cjs`, `sitemap.xml`, and `robots.txt`.

### Required checks

1. Confirm that each primary page has a unique title and description, a canonical URL under `https://mizukioyama.github.io/website/`, and a matching `og:url`.
2. Confirm that no active primary page retains the placeholder author, unsupported `meta keywords`, or the former broken OGP path.
3. Confirm that `og:image` and JSON-LD image URLs resolve to the existing `img/shinju.jpg` asset.
4. Confirm that the five animated content h1 elements contain readable HTML text before JavaScript runs.
5. Confirm that `menu.js` derives the scramble target from the static h1 text and preserves the existing random-character animation.
6. Confirm that `aria-label` remains stable while `TextScramble` updates only the visual HTML content.
7. Validate the home `WebSite`/`Person` and biography `ProfilePage`/`Person` JSON-LD with a structured-data validator after deployment.
8. Confirm that `sitemap.xml` is valid XML, contains only canonical public pages, and that `robots.txt` points to it on the correct host.
9. Confirm that matching and bot pages remain `noindex, nofollow` and are not added to the sitemap.
10. Confirm that generated `docs` output is derived by the build and that no unrelated working-tree changes are included in a future commit.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 CSS Organization Audit Review

Please review the CSS load cleanup and rollback archive.

### Required checks

1. Confirm that the five root pages and five legacy `src/` templates no longer request `css/font.css`.
2. Confirm that `chatbot.css`, `gallery_top.css`, `サンプルline_animation.css`, `font.css`, and `matchingミス.css` have no active source references.
3. Confirm that the five candidates are retained in `archive/css-delete-candidates-20260907/` and were not permanently deleted.
4. Confirm that generated `docs/css/` is treated as build output and is regenerated rather than edited as a source file.
5. Confirm that legacy CSS referenced by `_layoutsdefault.html` remains available.

### Review boundary

This request is for local code review only. Permanent deletion, deployment, and physical-device acceptance remain separate actions.

## 2026-09-07 Footer Layout Restoration Review

Please review the footer layout restoration in `css/footer.css`.

### Required checks

1. Confirm that desktop padding is restored to `4rem clamp(1.5rem, calc(7vw - 1rem), 6rem)`.
2. Confirm that mobile padding is restored to `3rem 1.5rem 0`.
3. Confirm that the added link-width rule and footer-only `box-sizing` override are removed.
4. Confirm that `#footer-container` and the footer remain full device width without horizontal overflow.
5. Treat public deployment and physical mobile/touch acceptance as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Mobile Footer 90% Width Review

Please review only the mobile footer container width change in `css/footer.css`.

### Required checks

1. Confirm that `#footer-container` uses the same 90% and nested `calc()`/`clamp()` policy as the mobile gallery.
2. Confirm that the generated `footer` remains 100% of its responsive container without horizontal overflow.
3. Confirm that desktop and tablet footer widths remain unchanged.
4. Treat physical-device acceptance and public deployment as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Mobile Gallery 90% Width Review

Please review only the mobile gallery wrapper change in `css/mobile.css`.

### Required checks

1. Confirm that the mobile gallery wrapper uses 90% as its width basis.
2. Confirm that the nested `calc()` and `clamp()` prevent viewport overflow at 320px, 390px, and 599px.
3. Confirm that the inner gallery remains `width: 100%` of the wrapper and keeps the existing two-column mobile grid.
4. Confirm that desktop 55% and tablet 72% rules remain unaffected.
5. Treat physical-device acceptance and public deployment as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Gallery 55% and Footer Width Correction Review

Please review only the latest width correction in `css/gallery.css`, `css/mobile.css`, and `css/footer.css`.

### Required checks

1. Confirm that desktop gallery width resolves to approximately `55%` at the existing desktop breakpoint.
2. Confirm that tablet and mobile breakpoints prevent unusable cards or horizontal overflow.
3. Confirm that `#footer-container`, `footer`, and footer links use the available width without changing footer structure or link order.
4. Confirm that footer padding remains responsive and does not clip content at 320px, 390px, 600px, 768px, 1024px, or desktop widths.
5. Treat generated `docs/`, public deployment, and physical-device acceptance as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 JavaScript Integration Review

Please review only the JavaScript integration changes in `js/menu.js`, `js/page-nation.js`, the six root HTML script lists, and `webpack.config.js`.

### Required checks

1. Confirm that `p5.min.js` remains required because `vanta.trunk.min.js` uses p5 for the existing `VANTA.TRUNK` background on the three affected pages.
2. Confirm that moving cursor and loading initialization into `menu.js` preserves the single cursor pair, hover delegation, typing timing, loading backdrop fade, and existing header/footer initialization.
3. Confirm that no root page still executes `cursor.js` or `loading.js`, and that the common `menu.js` path is loaded on all six root pages.
4. Confirm that moving sidebar loading and category collapse into `page-nation.js` preserves the gallery fetch, category filter, pagination, and scroll behavior.
5. Confirm that `form.js`, `time.js`, `mobile.js`, and `bg_wave.js` remain correctly page-scoped and are not unnecessarily added to the common path.
6. Confirm that vendor/runtime files remain separate and that no dynamic Webpack chunk such as `109.main.js` through `900.main.js` is proposed for deletion from this task.
7. Confirm that keeping the original integrated files as compatibility copies is appropriate until explicit deletion approval is provided.
8. Confirm that the isolated production build and local browser checks are sufficient for static/configured verification, while public deployment and physical-device acceptance remain pending.

### Review boundary

This is a local code review request only. Do not push, deploy, delete files, or modify external services.

## 2026-09-07 Sidebar JS/CSS and Width Review

Please review only the current sidebar integration and gallery/footer width changes in `js/menu.js`, `js/page-nation.js`, `sidebar.html`, `css/gallery.css`, `css/mobile.css`, and `css/footer.css`.

### Required checks

1. Confirm that the sidebar markup is equivalent to the previous partial, including category values, class names, and accessible text.
2. Confirm that `site:sidebar-ready` cannot initialize the gallery filter more than once and that script order does not race the generated language controls.
3. Confirm that no runtime `sidebar.html` fetch remains on the gallery page and that the compatibility partial is not required for initialization.
4. Confirm that the moved sidebar CSS preserves desktop and mobile positioning, typography, fade-in animation, and category interaction styling.
5. Confirm that the gallery width increase and footer padding reduction do not introduce horizontal overflow at 320px, 390px, 600px, 768px, 1024px, or desktop widths.
6. Confirm that gallery grid columns, modal behavior, pagination, and footer structure remain unchanged.
7. Treat generated `docs/` output, public deployment, and physical mobile/touch acceptance as separate pending boundaries.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Footer Full Device Width Review

Please review only the mobile full-width footer change in `css/footer.css`.

### Required checks

1. Confirm that `#footer-container` is `width: 100%` at mobile widths and no longer uses the 90% rule.
2. Confirm that `min-width: 100%` and `max-width: 100%` prevent the global `fit-content` reset from shrinking the footer.
3. Confirm that the generated `footer`, links, and copyright remain within the viewport without horizontal overflow.
4. Treat physical-device acceptance and public deployment as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.

## 2026-09-07 Gallery Sidebar Vertical Offset Restoration Review

Please review the latest desktop sidebar offset correction in `css/gallery.css`.

### Required checks

1. Confirm that the desktop right-alignment rule preserves `#sidebar-container` at `top: 20vh`.
2. Confirm that the sidebar no longer overlaps the `Art Index` heading or `作品一覧` subtitle.
3. Confirm that the 20% sidebar track, 15% responsive gap, and 55% artwork limit remain unchanged.
4. Confirm that the mobile breakpoint below 600px is unaffected.
5. Treat generated `docs/`, public deployment, and physical-device acceptance as separate pending checks.

### Review boundary

This request is for local code review only. Do not publish, deploy, push, send, delete, or modify external services.
