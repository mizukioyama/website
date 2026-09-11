# Known Issues

- The 75% sizing change is scoped to the Contact Site Policy modal; the index page modal keeps its existing sizing until separately requested.
- The viewport fix requires the updated `form.js` cache-busting URL to be served by GitHub Pages before public browsers can show the change.
- Browser and physical-device acceptance of the centered Site Policy modal has not been performed in this turn; static checks passed.
- The index Site Policy modal depends on a same-origin fetch of `policy.html` for current content. If the fetch fails, its preserved inline content is shown instead and may become stale until manually updated.
- Browser and physical-device acceptance of the index modal has not been performed in this turn; static checks passed.

- The legacy `header.html` and `footer.html` files remain in the repository as source references and build inputs; they are no longer requested by the root runtime scripts.
- `js/footer.js` remains as a compatibility shim and is intentionally not deleted without explicit approval; the five root pages now initialize the footer through `js/menu.js` only.
- The webpack source path under `src/` still has separate HTML-partial loaders (`src/js/all.js` and `src/js/side-foot.js`). This change intentionally targets the root files named in the request and does not alter the separate build pipeline.
- The root `index.html` has no `footer-container`, so the footer is not rendered there, matching its existing page structure.
- `js/page-nation.js` no longer contains the unused browser-incompatible `require("fs")` statement. A broader refactor of its duplicate functions, DOM guards, and rendering flow remains a separate scope from this visual alignment fix.
- The browser test reported the pre-existing VANTA warning `No THREE defined on window` on the artist statement page. It is outside the header/footer change.

## 2026-09-06 Visual Alignment Status

- The local root pages and regenerated `docs` pages matched at `390x844` and `1710x895` in same-tab browser comparisons.
- The live GitHub Pages deployment is not yet updated. Public verification is therefore `PENDING` until the reviewed change is pushed and GitHub Actions completes.
- The current working tree contains unrelated user deletions and untracked files. They must not be included in a visual-alignment commit without explicit review.
- The VANTA `No THREE defined on window` warning remains observable in the browser and was not changed because the background canvas still renders during the comparison.
- The biography image `img/心樹-web.jpg` remains unavailable locally and in `docs`; it was intentionally not replaced.

## 2026-09-06 Public Alignment Resolution

- The public sidebar mismatch is resolved by copying the root `sidebar.html` instead of the incompatible `src/sidebar.html`.
- GitHub Actions completed successfully for the fix, and public mobile/desktop gallery checks now show the local sidebar structure and layout behavior.
- Public JS files are production-compressed; this changes file formatting only and matched the reproduced build output.
- Real iOS/Android device testing, the VANTA warning, the missing biography image, and the broader `page-nation.js` refactor remain separate work.

## 2026-09-06 Cursor Visual Parity

- The static and Webpack cursor CSS paths are now synchronized; the previous Webpack-only static white-ring definition was replaced with the same animated stalker-ring design used by the static pages.
- The public browser check confirmed the expected cursor elements and computed dimensions. Physical mouse/touch testing is still not performed.
- The six static root pages now version the cursor CSS/JS references to reduce stale-cache reuse; a hard reload is still recommended after deployment.

## 2026-09-06 Cursor Deployment Status

- The cursor parity commit is deployed successfully through GitHub Actions run 30. Physical-device and browser-engine acceptance remains pending.

## 2026-09-06 Responsive Typography

- The responsive font-size change is statically validated, but rendered visual acceptance has not yet been completed across all pages and viewport widths.
- A `clamp()` maximum preserves the current effective larger value; exact visual line wrapping can still vary by browser font loading, fallback font, zoom, and device pixel ratio.
- Legacy/test-only files retain fixed font sizes because they are outside the active canonical page/build path and changing them would expand the requested scope.
- Physical Safari/iOS/Android and real mouse/touch checks remain pending.

## 2026-09-07 Responsive Width Hardening

- `scripts/check-generated.cjs` is referenced by `package.json` but is absent from the current working tree, so generated-output validation remains unavailable.
- The current `docs` directory and root worktree contain unrelated generated changes, deletions, and untracked files. They were intentionally not cleaned or synchronized in this scoped width change.
- Local browser verification logged pre-existing 404s for `img/心樹-web.jpg` and `img/202343-2.jpg`; image replacement is outside this task and was not guessed.
- Public GitHub Pages has not been updated for this width change; deployment and public verification are pending explicit approval.
- Physical Safari/iOS/Android, touch, and real-device acceptance remain pending.
- Legacy/test-only width files, including `src/style/matchingミス.css`, were left unchanged because they are outside the active page/build path.

## 2026-09-07 JavaScript Integration

- `p5.min.js` is not an unused library in this site: `vanta.trunk.min.js` requires p5 and the artist statement, biography, and contact pages call `VANTA.TRUNK`.
- `js/cursor.js`, `js/loading.js`, and `js/side.js` remain in the repository and in the Webpack compatibility allowlist after their runtime logic was integrated; they were not deleted without explicit approval.
- The six root HTML pages no longer request `cursor.js` or `loading.js`, and `gallery.html` no longer requests `side.js`.
- The existing `docs/` output was not regenerated in place because unrelated generated changes are present. An isolated build passed in `/tmp/website-js-build-validation-20260907/`.
- The isolated build reports the existing large-asset warnings for p5, Three.js, and artwork images; these warnings do not establish that p5 is removable.
- Public GitHub Pages was not updated, and physical Safari/iOS/Android or touch acceptance remains pending.

## 2026-09-07 Sidebar JS/CSS and Width Adjustment

- Local gallery initialization now generates the sidebar from `menu.js`; the old `sidebar.html` partial remains only as a compatibility/reference file and was not deleted.
- Desktop local browser verification passed. Mobile CSS was statically checked, but physical Safari/iOS/Android and touch acceptance remain pending.
- The requested width adjustment is applied to the active root CSS. The generated `docs/` output was not regenerated in place because it contains unrelated generated changes.
- Public GitHub Pages was not updated for this change; deployment and public visual verification remain pending explicit push/deploy approval.
- The pre-edit rollback copy is `/tmp/website-sidebar-width-backup-20260907/`.

## 2026-09-07 Gallery 55% and Footer Width Correction

- Desktop gallery content is now constrained to approximately 55%; tablet uses a wider intermediate value and mobile uses the available content width.
- Footer width is explicitly full-width at both the container and element level, with responsive padding reduced to expose more content area.
- Local desktop browser verification passed. Mobile CSS was statically checked, but physical Safari/iOS/Android and touch acceptance remain pending.
- Public GitHub Pages was not updated for this correction; deployment and public visual verification remain pending explicit approval.
- The pre-edit rollback copy is `/tmp/website-gallery-footer-55-backup-20260907/`.

## 2026-09-07 Mobile Gallery 90% Width

- Mobile gallery width now uses a 90% basis with nested `calc()`/`clamp()` constraints.
- Static checks passed; physical Safari/iOS/Android, touch, and exact rendered-width acceptance remain pending.
- Public GitHub Pages was not updated for this correction.
- The pre-edit rollback copy is `/tmp/website-gallery-mobile-90-backup-20260907/`.

## 2026-09-07 Mobile Footer 90% Width

- Mobile `#footer-container` now follows the same 90% responsive width policy as the gallery.
- Static checks passed; exact rendered mobile width and physical touch acceptance remain pending.
- Public GitHub Pages was not updated for this correction.
- The pre-edit rollback copy is `/tmp/website-footer-mobile-90-backup-20260907/`.

## 2026-09-07 Footer Full Device Width

- The mobile footer container now uses full device/content width instead of 90%.
- Explicit `min-width` and `max-width` protect it from the global `div { width: fit-content; }` reset.
- Static checks are expected to pass after this change; public deployment and physical mobile/touch acceptance remain pending.
- The pre-edit rollback copy is `/tmp/website-footer-device-width-backup-20260907/`.

## 2026-09-07 Footer Layout Restoration

- Desktop and mobile footer padding now match the pre-width-change values.
- The internal footer link width and footer-only `box-sizing` additions were removed.
- Full device-width container and footer constraints remain intentionally enabled.
- Public deployment and physical mobile/touch acceptance remain pending.
- The pre-edit rollback copy is `/tmp/website-footer-layout-restore-backup-20260907/`.

## 2026-09-07 CSS Organization Audit

- Five unreferenced CSS candidates were moved to `archive/css-delete-candidates-20260907/` and remain available for rollback.
- Root-page and legacy `src/` template links to `css/font.css` were removed after confirming that no active duration-variable consumer remains.
- Generated `docs/css/` was not edited directly; it requires a later build to synchronize with the source tree.
- The pre-move file backup is `/tmp/website-css-delete-backup-20260907/`.
- Permanent deletion and physical rendered-device acceptance remain pending.

## 2026-09-07 SEO Head and Static H1 Improvement

- Public GitHub Pages was not pushed or rechecked after this local change.
- Chrome headless exited with status 134, so a screenshot-based mobile visual check is pending.
- The production build emits existing asset-size warnings for large images, audio, and vendor JavaScript; the build still completes successfully.
- The local `node_modules` tree does not contain the optional Font Awesome package, so the build now skips that copy step locally; CI with the locked dependency can still copy it.
- Legacy blog, Jekyll, partial, and test HTML files were not modified because they are outside the active Webpack deployment path. Their indexability should be decided separately before publishing them.
- Physical Safari/iOS/Android, touch, social-card rendering, and post-deployment structured-data validation remain pending.

## 2026-09-07 Index Heading Semantics

- The home page now has one primary `h1`; the alternate slide title uses `h2.creator-title` with mirrored h1 styling.
- Static checks pass, but screenshot-based and physical-device visual acceptance remains pending.
- The change has not been pushed for public verification.

## 2026-09-07 Gallery Sidebar Right Alignment

- Desktop/tablet gallery positioning now uses a right-aligned grid with approximately 20% sidebar, 15% gap, and up to 55% artwork area.
- Mobile widths below 600px retain the existing fixed sidebar behavior.
- Exact screenshot comparison, physical-device testing, generated-output synchronization, and public deployment remain pending.

## 2026-09-07 Gallery Layout Restoration

- The duplicate `60vmin` outer margin was removed after comparing the current CSS with the pre-alignment backup.
- Local desktop and mobile screenshots now show the artwork area at the intended vertical position.
- Public deployment and physical-device acceptance remain pending.

## 2026-09-07 Gallery Sidebar Vertical Offset Restoration

- The desktop sidebar had been moved upward by an unintended `top: 0` override.
- The override now preserves the backup `top: 20vh` offset while retaining the requested right-aligned grid.
- Public deployment and physical-device acceptance remain pending.
