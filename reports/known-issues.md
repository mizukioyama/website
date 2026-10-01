# Known Issues

> The current register below is authoritative as of 2026-10-01. Dated entries that follow record the status at that time and are historical where they conflict with this summary.

## Current production baseline

- Contact bilingual implementation `0b6a4b4c8d9bba9435dafd6789e2290749d7af4f`, targeted timeout adjustment `25be9c5b51d0345e0cf5ca23f92ce562534af14b`, and two-image Linux baseline update `17b97a8991832837ea0bd991b125df6049ede51e` are on `main` and `origin/main`. Pages deploys #399–#401 passed; Visual Regression #428 passed (55 passed / 17 skipped).
- Current language matrix: switchable — Home, Gallery, Information, Order, Policy, Yurayura; bilingual — Biography, Artist Statement, Contact. Contact labels, request choices, policy copy, submit/status text, and both modals display Japanese followed by English. The shared bilingual logic hides the language control and preserves stored language preference.
- Contact form interactions, required-marker isolation, seven-width runtime assertions, language invariants, build, and `npm run check` passed. Only Contact desktop-1440 and mobile-390 Linux snapshots were updated after reviewing the intended bilingual-content diffs; other baselines and typography values were unchanged.
- Visual Regression #398 remains resolved historical. The #426 Contact tablet-768 timeout was test-budget related: the test hit the 30-second global limit during geometry checks. A targeted 60-second Contact timeout removed it; #427 had no timeout and #428 passed.
- Public browser acceptance for the published Contact bilingual layout and the other eight pages remains pending because the admin-enforced browser policy denied access. Final design handoff readiness is therefore open.

## Remaining handoff gate and follow-ups

- Complete the public rendered-page acceptance when browser access is available.
- Continue shared same-tag typography-role checker coverage as a separate follow-up. Final value selection remains with the owner.

## 2026-09-22 Min-Max Calculator typography settings

- `npm run build` is pending: this checkout has no `node_modules`, so `webpack` is unavailable.
- `npm run check:generated` is pending: `html-minifier-terser` is unavailable.
- `docs/` was intentionally not hand-edited and is not declared regenerated for this change.
- Generated Concept output, GitHub Pages delivery, cache-busting/public verification, and physical Safari/iOS/Android acceptance are pending.
- Local browser verification was performed at 1280×720; the seven-viewport values are calculated from the new Calculator formulas, not seven rendered screenshots in this checkout.
- Existing special form breakpoint font sizes are preserved through a dedicated compatibility role to avoid an abrupt visual change.

## 2026-09-20 Phase 3 pending gates

- The local repository does not have the Playwright test package available, so the full seven-viewport Visual Regression matrix is pending CI.
- Generated build output is authoritative for deployment, but the existing embed/cache-version step rewrites timestamp-only query strings on unchanged pages. Those unrelated generated changes must stay out of the focused commit.
- Public Pages deployment, public browser verification, and physical-device acceptance have not been performed for this branch.
- The duplicate `src/` page files and unusual root artifacts are documented in `reports/source-of-truth-audit.md`; no deletion or move is proposed.

- The current PC non-index clamp is `clamp(12px, calc(10px + 0.4vw), 14px)`; headings, form controls, and modal text with explicit sizes are intentionally unchanged.
- The current PC non-index clamp is `clamp(12px, calc(10px + 0.4vw), 13.5px)`; headings, form controls, and modal text with explicit sizes are intentionally unchanged.
- The PC `p` override is intentionally placed after the shared paragraph rule; page-specific selectors with explicit `font-size` values, such as modal and form controls, retain their own sizes.
- The PC 12px–14px override targets `p` elements in the shared gallery stylesheet; headings, form controls, modal text, and other selectors with explicit font sizes retain their existing values.
- The shared PC base clamp is intentionally limited to pages loading `css/gallery.css`; index.html remains on its separate index stylesheet.
- The policy clamp is applied to the PC Contact page base `html, body` size; selectors with explicit font sizes continue to use their existing values.
- The left-alignment rule is intentionally scoped to viewport widths of 601px and above; mobile uses the existing `css/mobile.css` layout.
- Browser acceptance should include both Contact and index because the two pages use different modal initialization paths.
- The 40vw width change applies to the desktop Contact Site Policy modal; mobile sizing continues to use its existing media-query values.
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
# 2026-09-23 Contact Semantic Rename

- No known source, generated-output, SEO, link, undefined-variable, or unused-variable issue was introduced by this rename.
- The local CUA browser backend and Chrome headless process were unavailable in this environment, so the seven-viewport evidence is a deterministic CSS formula/computed-style comparison rather than fresh screenshot capture. A real-browser and physical-device acceptance pass remains a separate gate.
- Webpack emitted its existing large-asset/performance warnings; they are unrelated to this rename.
- Public deployment was not performed.
# 2026-09-23 Menu Semantic Rename

- No source, generated-output, SEO, link, undefined-variable, or unused-variable issue was introduced by this rename.
- The local CUA browser backend and Chrome headless process were unavailable, so the seven-viewport result is a deterministic CSS cascade/formula comparison rather than fresh screenshot capture. Real-browser and physical-device acceptance remain separate gates.
- Webpack emitted its existing large-asset/performance warnings; they are unrelated to this rename.
- Public deployment was not performed.


## 2026-09-27 Gallery Sidebar and Captions Repair

- The full npm run check does not pass: check:typography reports css/all.css: missing shared body scale. That file was already dirty at task start and was left untouched.
- check:docs-sync compares generated docs with committed HEAD and reports the current uncommitted generated output as stale. npm run build and check:generated pass; no commit was made.
- git diff --check exits nonzero on trailing whitespace and CRLF line endings in multiple already-dirty source/generated files. No broad whitespace or line-ending normalization was included.
- Webpack continues to report the repository's existing large images and third-party bundles over the recommended asset-size limit.
- Local browser checks passed at 599px and 600px. Physical iOS/Android and public-site acceptance remain unverified.
- The full-screen artwork modal covers the header language controls while open. Captions display correctly when opening the modal in either selected language; changing language requires closing the modal first.


## 2026-09-27 Language Audit and CSS Cleanup Follow-up

- The current source hides the language selector on Biography, Artist Statement, Information, Contact, and Yurayura. Biography and Artist Statement were already documented as bilingual-display pages; Information, Contact, and Yurayura also carry data-language-mode=bilingual and hide the selector. A user decision was requested on whether the latter three should stay bilingual or become single-language switchable.
- Browser console errors were zero and both Gallery captions rendered. The available browser interface did not expose a separate pageerror event hook, so that event was not independently asserted.
- The combined npm run check stops at check:docs-sync because regenerated docs/ is uncommitted. Source/generated parity and check:generated pass; the no-commit instruction was preserved.
- git diff --check reports CRLF lines in changed files as trailing whitespace. Files were not normalized because broad line-ending changes are prohibited.
- Webpack still emits its existing large-asset/performance warnings. Public and physical-device acceptance were not run.


## 2026-09-28 Intermediate Release Checkpoint

- No layout or functional regression was observed in the public 9-page 390px/1440px matrix or the seven-width Gallery check. Physical iOS Safari, Android, and touch-device acceptance has not been performed.
- Public browser console errors were 0. The existing VANTA warning `[VANTA] No THREE defined on window` appeared on page loads; no VANTA change was included.
- On the first uncached public Home visit, the loading veil remained visible until the intro completed (about 13 seconds in this browser session). It eventually cleared and the page worked; confirm on a physical device before considering a change.
- The repository does not provide the Playwright test package, so the automated Playwright suite was unavailable. The user-requested browser checks were performed in the connected browser.
- Webpack continues to emit its existing large-asset and performance warnings. They did not fail the build.
- GitHub Actions build and Pages deploy both passed for commit `6c676cf6098742a2ffe8ef8e2432b4f404e2e8e0`; public pages were available for inspection.
- Status at the 2026-09-28 checkpoint: Information, Contact, and Yurayura displayed bilingual content with hidden controls. On 2026-09-29 the user confirmed Information and Contact as Japanese-first bilingual, and Yurayura as Japanese-led with partial English and no control until a full translation is reviewed; see `PORTFOLIO_MASTER_SPEC.md`.

## 2026-09-28 Intermediate Release Follow-up

- Historical status at the time of this 2026-09-28 entry: Visual Regression run 398 failed. Resolved by the later Visual Regression #406 result: 53 passed, 13 skipped, 0 failed, with screenshot comparison enabled.
- PENDING: Physical iOS Safari and Android acceptance and owner review of the published checkpoint.
- WARN: Existing VANTA warning [VANTA] No THREE defined on window and WebGL GPU performance warnings appeared; public checks recorded zero console errors.
- Existing Webpack large-asset/performance warnings remain.
- Information, Contact, and Yurayura language behavior remains bilingual with the selector hidden; this is recorded current behavior, not a newly approved specification.
