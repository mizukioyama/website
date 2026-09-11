# Next Actions

1. After Pages rebuilds, hard-reload each non-index page and confirm visible PC body text is 12px–14px.
2. Confirm index.html remains unchanged.
3. Confirm mobile pages retain their existing text scale.

4. After Pages rebuilds, use a cache-busting URL and confirm computed PC paragraph size is 12px–14px on each non-index page.
5. Confirm index.html remains on its separate stylesheet and text scale.
6. Confirm mobile paragraph sizing is unchanged.

1. After Pages rebuilds, hard-reload each non-index page and confirm visible PC body text is 12px–13.5px.
2. Confirm index.html remains unchanged.
3. Confirm mobile pages retain their existing text scale.

4. After Pages rebuilds, use a cache-busting URL and confirm computed PC paragraph size is 12px–13.5px on each non-index page.
5. Confirm index.html remains on its separate stylesheet and text scale.
6. Confirm mobile paragraph sizing is unchanged.

4. Superseded: the current target is 12px–13.5px; use the current checks above after the Pages rebuild.
5. Confirm index.html remains unchanged.
6. Confirm mobile pages retain their existing text scale.

4. After Pages rebuilds, compare PC text scale on Contact, artist-statement, biography, gallery, and policy at the same viewport width.
5. Confirm index.html retains its separate text scale.
6. Confirm mobile pages remain unchanged.

4. After Pages rebuilds, compare PC Contact body text with the policy page at the same viewport width.
5. Confirm form labels, placeholders, consent text, and modal text retain their intended sizes.
6. Confirm the mobile Contact page is unchanged.

4. After Pages rebuilds, hard-reload Contact at a desktop width and compare the H1 and body left edges.
5. Confirm the mobile Contact page retains its existing spacing.
6. Confirm the form and Site Policy modal are unaffected.

4. Open the Contact Site Policy modal and confirm page scrolling is locked while modal-internal scrolling still works.
5. Repeat the scroll-lock check on index.html.
6. Close each modal and confirm page scrolling is restored.

4. After Pages rebuilds, confirm the Contact Site Policy modal width is 40vw at desktop width.
5. Confirm the 75vh height and internal scroll behavior remain usable.
6. Confirm mobile sizing remains usable.

4. After GitHub Pages rebuilds, confirm the Contact Site Policy modal occupies 40vw of the viewport at desktop width.
5. Confirm the full policy can be read by scrolling within the modal.
6. Confirm the mobile layout remains usable and does not overflow horizontally.

4. After GitHub Pages rebuilds, hard-reload Contact and confirm the Site Policy modal remains centered after scrolling.
5. Confirm the checkbox and overlay remain functional after the modal elements are moved to `body`.
6. Confirm the submission-success modal remains centered after a test submission in an approved test environment.

4. Open the Contact page at desktop and mobile widths and confirm the Site Policy modal is centered like the submission-success modal.
5. Hard-reload the deployed Contact page after GitHub Pages rebuilds.
6. Confirm the submission-success modal remains centered after a test submission in an approved test environment.

4. Open the index page, open Site Policy, and confirm that the displayed Japanese and English text matches `policy.html`.
5. Hard-reload the deployed page after GitHub Pages rebuilds to clear any cached HTML.
6. Keep the existing inline fallback until successful public browser verification is complete.

4. Open each root page in the normal local preview and check the header at desktop and mobile widths.
5. Verify the footer on `artist-statement.html`, `biography.html`, `contact.html`, and `policy.html` after a hard reload.
6. Confirm in the browser network panel that the root pages do not request `footer.js`, `footer.html`, or jQuery for footer rendering.
7. If the webpack `src/` build is also a required deployment path, apply the same design to `src/js/all.js` and `src/js/side-foot.js` as a separate scoped change.
8. Do not remove the compatibility shim unless its remaining references and rollback need have been reviewed and explicit deletion approval is given.
9. Investigate the unrelated VANTA warning only if the affected page's background is not intentionally disabled.

## 2026-09-06 Public Alignment Follow-up

1. Review the focused diff in `webpack.config.js` and `js/page-nation.js` without staging unrelated user changes.
2. Confirm the target branch and deployment scope before any push. The local branch is behind `origin/main`, so do not force-push or overwrite remote history.
3. After an approved push, wait for GitHub Actions and verify the public URL with a hard reload at desktop and mobile widths.
4. Recheck cursor geometry, menu open/close, gallery pagination, modal open/close, and the contact form on the deployed site.
5. Treat a real-device Safari/mobile check as a separate acceptance step; the current browser comparison is automated/configured local evidence only.
6. Handle the broader `page-nation.js` refactor and the VANTA warning as separate changes so the visual alignment rollback remains narrow.

## 2026-09-06 Verified Status

1. Perform a physical Safari/iOS and Android check for final acceptance.
2. Review the public cursor with physical mouse/touch input; the browser check confirmed both cursor elements are present.
3. Keep the broader `page-nation.js` refactor, VANTA warning, and missing biography image separate from this alignment fix.

## 2026-09-06 Cursor Follow-up

1. After the cursor change is deployed, hard-reload the public pages and compare the dot, ring glow, hover enlargement, and pointer tracking with the local preview.
2. Repeat the check at desktop and mobile widths; verify touch devices do not show an unintended native or custom pointer artifact.
3. Keep any cache, browser-engine, or physical-device difference separate from the source CSS parity result.

## 2026-09-06 Cursor Deployment Status

1. Complete the remaining physical Safari/iOS/Android and touch-device acceptance check.
2. If an older cursor is still visible, hard-reload once; the deployed static pages now use the cursor-only versioned asset URLs.

## 2026-09-06 Responsive Typography

1. Open the six root visual pages locally at 320px, 390px, 768px, 1024px, and desktop widths and compare line wrapping with the intended current design.
2. Check menu, footer, modal, contact form, biography table, timeline, gallery captions, and pagination for clipping or unintended overflow.
3. Repeat the same checks on the generated `docs` pages after an approved deployment; no deployment was requested in this turn.
4. If a specific page needs a visual exception, record the selector and viewport before changing the shared clamp policy.
5. Keep legacy/test typography cleanup separate from this display-preserving change.

## 2026-09-07 Responsive Width Hardening

1. Review the focused width diff and confirm the intended visual baseline at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
2. Restore or provide the missing FontAwesome webfont input before running the production build; do not alter dependencies solely for this review.
3. Add or restore `scripts/check-generated.cjs` only as a separately reviewed tooling change, then rerun generated-output validation.
4. After explicit push approval, rebuild `docs`, inspect the generated diff, and verify the public pages at mobile and desktop widths.
5. Perform physical Safari/iOS/Android and touch acceptance before declaring the responsive width change complete.

## 2026-09-07 JavaScript Integration

1. Review the focused integration diff and confirm that the common cursor, loading, header, and footer behavior remains visually identical.
2. Open gallery locally and verify sidebar injection, category filtering, pagination, modal open/close, and scroll collapse after a hard reload.
3. If deletion is desired, explicitly approve removal of the now-unreferenced `js/cursor.js`, `js/loading.js`, and `js/side.js` files and their generated copies after a fresh reference scan and backup.
4. Rebuild the actual `docs/` directory only after the mixed generated-output changes are reviewed; inspect the generated diff before any publication.
5. Push and verify GitHub Actions only after explicit approval; public deployment is not part of this task.
6. Perform physical Safari/iOS/Android and touch acceptance separately from the static and local-browser checks.

## 2026-09-07 Sidebar JS/CSS and Width Follow-up

1. Check the gallery at 320px, 390px, 600px, 768px, 1024px, and desktop widths, including sidebar visibility and footer content width.
2. Verify category filtering, pagination, modal open/close, language switching, and sidebar scroll-toggle behavior after a hard reload.
3. Rebuild the actual `docs/` directory only after the mixed generated-output changes are reviewed; inspect the generated diff before publication.
4. Push and verify GitHub Pages only after explicit approval; public deployment is not part of this task.
5. Perform physical Safari/iOS/Android and touch acceptance separately from static and local-browser verification.

## 2026-09-07 Gallery 55% and Footer Width Follow-up

1. Check the gallery at desktop, tablet, 390px, and 320px widths and confirm the intended 55%/72%/100% transitions.
2. Confirm footer links and copyright text use the available width without clipping or unintended line wrapping.
3. Rebuild and inspect generated `docs/` only after the unrelated generated changes are reviewed.
4. Push and verify GitHub Pages only after explicit approval.

## 2026-09-07 Mobile Footer 90% Follow-up

1. Check the footer container and generated footer at 320px, 390px, and 599px.
2. Confirm footer links and copyright text remain readable within the 90% container.
3. Repeat the check on a physical mobile device before final acceptance.
4. Push and verify GitHub Pages only after explicit approval.
5. Perform physical Safari/iOS/Android and touch acceptance separately.

## 2026-09-07 Gallery Layout Restoration Follow-up

1. Compare the public gallery after an approved push at desktop and mobile widths.
2. Confirm the artwork area does not receive a duplicate vertical offset after build generation.
3. Perform physical Safari/iOS/Android and touch acceptance separately.

## 2026-09-07 Footer Full Device Width Follow-up

1. Check the public/mobile footer width after an approved push at 375px and 390px.
2. Confirm the footer background and links span the device content width without horizontal overflow.
3. Perform physical Safari/iOS/Android and touch acceptance separately.
4. Push and verify GitHub Pages only after explicit approval.

## 2026-09-07 Mobile Gallery 90% Follow-up

1. Check gallery width and horizontal overflow at 320px, 390px, and 599px.
2. Confirm the two-column artwork grid and pagination remain usable within the 90% wrapper.
3. Repeat the check on a physical mobile device before final acceptance.
4. Push and verify GitHub Pages only after explicit approval.

## 2026-09-07 Footer Layout Restoration Follow-up

1. Compare the local footer with the pre-width-change layout at desktop and mobile widths.
2. Confirm the footer remains full device width without changing its internal spacing or link layout.
3. Perform physical Safari/iOS/Android and touch acceptance separately.
4. Push and verify GitHub Pages only after explicit approval.

## 2026-09-07 CSS Organization Follow-up

1. Decide whether to permanently delete the five archived CSS candidates.
2. If approved, create a fresh backup, run a final reference scan, delete only the approved exact files, and verify the build.
3. Regenerate and inspect `docs/` before any further public deployment.
4. Verify rendered desktop/mobile parity after deployment.

## 2026-09-07 SEO Head and Static H1 Follow-up

1. Review the focused source diff and confirm the final Japanese title/description wording for each public page.
2. Open the six public pages locally at 320px, 390px, tablet, and desktop widths and confirm that static h1 text transitions into the same scramble animation.
3. Validate the home and biography JSON-LD with Google's Rich Results Test after the site is available at the final public URL.
4. Check `robots.txt`, `sitemap.xml`, canonical URLs, OGP image loading, and social-card previews after an approved push.
5. Decide whether the legacy blog, Jekyll template, partial, and test HTML files should be excluded, `noindex`, or separately optimized.
6. Push and verify GitHub Actions only after explicit approval; no push was performed in this turn.

## 2026-09-07 Index Heading Semantics Follow-up

1. Compare the two home-page title slides at desktop and mobile widths to confirm the h2 replacement is visually identical.
2. Confirm the scramble animation still targets the existing visible title elements after a hard reload.
3. Push and verify GitHub Pages only after explicit approval.
4. Perform physical Safari/iOS/Android and touch acceptance separately.

## 2026-09-07 Gallery Sidebar Right Alignment Follow-up

1. Compare the gallery at 600px, 768px, 1024px, and desktop widths and confirm the 20%/15%/55% relationship.
2. Confirm the mobile layout below 600px keeps the fixed sidebar and does not introduce horizontal overflow.
3. Rebuild and inspect generated `docs/` only after the unrelated generated changes are reviewed.
4. Push and verify GitHub Pages only after explicit approval.
5. Perform physical Safari/iOS/Android and touch acceptance separately.

## 2026-09-07 Gallery Sidebar Vertical Offset Follow-up

1. Compare the public gallery after an approved push at desktop and mobile widths.
2. Confirm the sidebar remains below the heading and does not overlap the subtitle.
3. Rebuild and inspect generated `docs/` output before public deployment.
4. Perform physical Safari/iOS/Android and touch acceptance separately.
