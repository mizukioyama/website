> The 2026-10-01 handoff status below is current. Older dated sections are retained as historical records and do not override it.

# User Checklist

## Current implementation and final design handoff — 2026-10-01

- [x] Contact bilingual implementation commit `0b6a4b4c8d9bba9435dafd6789e2290749d7af4f`; targeted timeout commit `25be9c5b51d0345e0cf5ca23f92ce562534af14b`; Contact-only Linux baselines commit `17b97a8991832837ea0bd991b125df6049ede51e`.
- [x] Current language modes match `PORTFOLIO_MASTER_SPEC.md`: switchable — Home, Gallery, Information, Order, Policy, Yurayura; bilingual — Biography, Artist Statement, Contact.
- [x] Contact shows Japanese followed immediately by English throughout the introduction, request choices, form labels, Policy copy, submit/status text, and both modals. Its language control is hidden through shared bilingual behavior; stored `selectedLang` and compatibility `lang` are preserved.
- [x] Contact form functionality, required-marker styling, seven-viewport runtime assertions, and language invariants passed. `npm run build` and `npm run check` passed.
- [x] Pages deploys #399–#401 passed. Visual Regression #428 passed (55 passed / 17 skipped). Only Contact desktop-1440 and mobile-390 Linux baselines were updated after reviewing the bilingual-content diffs.
- [x] Contact timeout stabilization: #426 hit the 30-second global limit at tablet-768 geometry checks; the targeted 60-second timeout passed without recurrence in #427 and #428.
- [ ] Verify published Contact and the other eight pages at 1440px / 390px. Browser verification remains pending because the admin-enforced policy check denied access.
- [ ] Establish final design handoff readiness only after public rendered-page acceptance; then the owner may perform desired final visual/layout adjustments.
- [ ] After owner adjustments, run the ordinary build/check, review Visual Regression without updating baselines, and verify public Pages output.

## 2026-09-20 Phase 3 review gates — historical checklist


- [ ] Review the source-of-truth mapping and retained legacy/reference classifications.
- [ ] Confirm Biography and Artist Statement show Japanese and English simultaneously.
- [x] Historical language policy as recorded in the earlier 2026-09-29 update: switch UI was hidden on Biography, Artist Statement, Information, Contact and Yurayura; the later 2026-09-29 specification update supersedes it for Information, Contact and Yurayura.
- [ ] Confirm an English Gallery preference is preserved after returning from either bilingual page.
- [ ] Review Typography at 1440, 1280, 1024, 768, 430, 390, and 375px.
- [ ] Confirm no unintended wrapping, overflow, table, form, Gallery, Yurayura, or 404 regression.
- [ ] Confirm CI Visual Regression and Pages checks before any merge or ROADMAP close.

- [ ] Confirm PC body paragraphs on all non-index pages use the 12px–14px clamp.
- [ ] Confirm index.html is excluded.
- [ ] Confirm computed PC paragraph size is 12px–14px on all non-index pages after a hard reload.
- [ ] Confirm mobile text sizing and explicit form/modal sizes remain unchanged.
- [ ] Confirm PC body paragraphs on all non-index pages use the 12px–13.5px clamp.
- [ ] Confirm index.html is excluded.
- [ ] Confirm computed PC paragraph size is 12px–13.5px on all non-index pages after a hard reload.
- [ ] Confirm index.html remains excluded.
- [ ] Confirm PC body paragraphs on every non-index page use the 12px–13.5px clamp.
- [ ] Confirm index.html is excluded.
- [ ] Confirm mobile text sizing remains unchanged.
- [ ] Confirm the shared PC text scale applies to all non-index pages.
- [ ] Confirm index.html is not changed by the shared rule.
- [ ] Confirm PC Contact body text uses `clamp(0.75rem, calc(0.4rem + 0.8vw), 1.25rem)`.
- [ ] Confirm form and modal text remain readable and intentionally sized.
- [ ] Confirm the Contact H1 and body text share the same left edge on PC.
- [ ] Confirm the Contact mobile layout remains unchanged.
- [ ] Confirm Contact page scroll is locked while Site Policy is open.
- [ ] Confirm index page scroll is locked while Site Policy is open.
- [ ] Confirm policy content can scroll inside each modal.
- [ ] Confirm page scroll is restored after closing each modal.
- [ ] Confirm the Contact Site Policy modal is 40vw wide on desktop.
- [ ] Confirm the modal remains 75vh high and centered.
- [ ] Confirm the Contact Site Policy modal is approximately 75% of the viewport width and height on desktop.
- [ ] Scroll inside the modal and confirm the policy content remains readable.
- [ ] Confirm mobile width and height remain usable without horizontal overflow.
- [ ] After the Pages rebuild, hard-reload Contact and open Site Policy after scrolling the page.
- [ ] Confirm the Site Policy modal is centered in the viewport at desktop and mobile widths.
- [ ] Confirm the consent checkbox and Close action still work.
- [ ] Open the Contact page and confirm the Site Policy modal is centered at desktop width.
- [ ] Repeat the Site Policy modal check at a mobile width.
- [ ] Confirm the submission-success modal remains centered and unchanged.
- [ ] Open `index.html`, open the Site Policy modal, and confirm the Japanese and English contents match `policy.html`.
- [ ] Confirm the index modal still closes with `Close` and the `view` link still opens the gallery.
- [ ] Hard-reload the deployed index page after the Pages rebuild.

- [ ] Open `index.html` and confirm the header appears without waiting for an HTML partial.
- [ ] Open the menu and confirm the five links and exhibition information are unchanged.
- [ ] Close the menu by clicking the mask.
- [ ] Switch between `Ja` and `En` and confirm the active state and language content.
- [ ] Open `artist-statement.html` and confirm the footer links and current year appear.
- [ ] Repeat the footer check on `biography.html`, `contact.html`, and `policy.html`.
- [ ] Confirm the footer still appears when only `js/menu.js` is loaded by the page.
- [ ] Check one desktop and one mobile viewport for clipping or spacing changes.
- [ ] Confirm that the original HTML files remain available as rollback/reference files.

## 2026-09-06 Visual Alignment Check

- [ ] After approved deployment, hard-reload the public `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, and `policy.html` pages.
- [ ] Compare the public pages at a desktop width and a mobile width against the local preview.
- [ ] Confirm that the cursor shape, size, color, and hover movement match the local preview.
- [ ] Confirm that the gallery shows the same work count, pagination controls, modal content, and close behavior.
- [ ] Confirm that the menu and footer retain the same links, spacing, language controls, and current year.
- [ ] Record any remaining VANTA warning or missing biography image separately from visual alignment.

## 2026-09-06 Public Browser Evidence

- [x] GitHub Actions completed successfully for the public alignment commit.
- [x] Public mobile gallery checked at `390x844` with the local sidebar structure and fixed positioning.
- [x] Public desktop gallery checked at `1710x895` with the local sidebar structure, gallery, pagination, menu, and footer.
- [x] Public root HTML/CSS resource hashes match the local source files.
- [ ] Repeat the visual check on a physical iOS/Android device and with physical mouse/touch input.

## 2026-09-06 Cursor Visual Check

- [ ] Hard-reload the local and public pages before comparing the cursor.
- [ ] Confirm the 8px white dot and 15px ring appear together on desktop.
- [ ] Confirm the ring glow animation and hover enlargement match the local preview.
- [ ] Confirm the native cursor remains hidden while the custom cursor follows the pointer.
- [ ] Confirm mobile/touch pages have no unintended cursor artifact.
- [x] Confirm the cursor deployment completed successfully and the public biography page loads the versioned cursor assets.

## 2026-09-06 Responsive Typography Check

- [ ] Check `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, and `policy.html` locally at 320px, 390px, 768px, 1024px, and desktop widths.
- [ ] Confirm headings and body text keep the intended hierarchy and largest existing desktop size.
- [ ] Confirm Japanese and English text do not clip or produce unintended horizontal overflow.
- [ ] Open the menu and footer and confirm link spacing remains unchanged.
- [ ] Open gallery/contact modals and confirm their text, close controls, and scroll behavior remain usable.
- [ ] Check the contact form, biography table, timeline, captions, and pagination on a narrow viewport.
- [ ] Repeat the check on a physical iOS/Android device or record it as pending.

## 2026-09-07 Responsive Width Check

- [ ] Check `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, `policy.html`, and the matching page at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [x] Confirm the local Biography page loads at desktop width without a layout-breaking error.
- [x] Confirm the local Biography page text wraps within a 390px viewport.
- [x] Confirm the local Contact page does not show a fixed-width form overflow at a 390px viewport.
- [ ] Open the gallery modal at a narrow width and confirm its content, image, padding, and close control remain usable.
- [ ] Confirm footer padding and menu offset at tablet widths between the mobile and desktop breakpoints.
- [ ] Repeat the width check on generated `docs` pages after an approved production build and deployment.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Gallery Layout Restoration Check

- [x] Compare the current CSS with the pre-right-alignment backup.
- [x] Remove the duplicate outer `60vmin` margin.
- [x] Confirm local desktop artwork positioning after the fix.
- [x] Confirm local mobile sidebar and artwork rendering after the fix.
- [x] Pass JavaScript, local-reference, and focused CSS checks.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Gallery Sidebar Right Alignment Check

- [x] Keep gallery HTML and JavaScript unchanged.
- [x] Place the sidebar in an approximately 20% responsive track.
- [x] Place the artwork area to the right with an approximately 15% responsive gap.
- [x] Keep the artwork area capped at approximately 55% on wider screens.
- [x] Preserve the existing mobile fixed-sidebar behavior below 600px.
- [x] Pass JavaScript, local-reference, and focused CSS checks.
- [ ] Confirm exact rendered widths at 600px, 768px, 1024px, and desktop widths.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Mobile Gallery 90% Check

- [x] Confirm the mobile wrapper uses a 90% width basis.
- [x] Confirm `calc()` and `clamp()` are present in the mobile width rule.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check 320px, 390px, and 599px rendered widths for overflow.
- [ ] Confirm the two-column gallery and pagination remain usable on a physical mobile device.
- [ ] Push and verify the public site after explicit approval.

## 2026-09-07 Mobile Footer 90% Check

- [x] Confirm the mobile footer container uses a 90% width basis.
- [x] Confirm the footer itself remains 100% of the responsive container.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check footer text and links at 320px, 390px, and 599px.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.
- [ ] Push and verify the public site after explicit approval.

## 2026-09-07 Gallery 55% and Footer Width Check

- [x] Confirm the local gallery renders after the width correction.
- [x] Confirm the desktop gallery rule is approximately 55% and mobile override is 100%.
- [x] Confirm footer container and footer element use the full available width.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check gallery and footer at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [ ] Rebuild and inspect generated `docs/` after reviewing unrelated generated changes.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Footer Full Device Width Check

- [x] Confirm the mobile footer rule is `width: 100%`.
- [x] Confirm `min-width` and `max-width` are both constrained to 100%.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check the footer at 375px and 390px without horizontal overflow.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Sidebar JS/CSS and Width Check

- [x] Confirm the local gallery renders the sidebar from `menu.js` without fetching `sidebar.html`.
- [x] Confirm the local gallery renders category items, artwork, pagination, header, and footer.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check gallery/sidebar/footer at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [ ] Confirm category filtering, pagination, modal, language switching, and sidebar collapse behavior after a hard reload.
- [ ] Rebuild and inspect generated `docs/` output after reviewing unrelated generated changes.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 JavaScript Integration Check

- [x] Confirm p5 is retained because the existing VANTA.TRUNK background depends on it.
- [x] Confirm the six root pages load common cursor, loading, header, and footer behavior through `menu.js`.
- [x] Confirm gallery sidebar loading and category setup work through `page-nation.js`.
- [ ] Hard-reload all six local pages and compare cursor, menu, footer, and page-specific effects at desktop and mobile widths.
- [ ] Confirm that gallery filtering, pagination, modal open/close, and sidebar collapse remain unchanged.
- [ ] If complete deletion is wanted, provide explicit approval before removing the retained compatibility files.
- [ ] Repeat the checks on the generated `docs` pages after an approved rebuild and deployment.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Footer Layout Restoration Check

- [x] Restore the desktop footer padding to the previous value.
- [x] Restore the mobile footer padding to the previous value.
- [x] Remove the added footer link-width and footer-only `box-sizing` rules.
- [x] Keep the footer container and footer at full device width.
- [ ] Compare local and public rendered layouts after an approved push.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 CSS Organization Check

- [x] Inventory root-page CSS, Webpack source CSS, and generated CSS separately.
- [x] Confirm legacy layout CSS references before treating files as unused.
- [x] Remove the unused `font.css` request from the five root pages and five legacy `src/` templates.
- [x] Move the five unreferenced CSS candidates into one rollback archive folder.
- [x] Preserve the moved files because permanent deletion approval was not provided.
- [ ] Approve or reject permanent deletion of the five archived CSS candidates.
- [ ] Regenerate and inspect `docs/` after the source cleanup.
- [ ] Verify rendered desktop/mobile parity after deployment.

## 2026-09-07 SEO Head and Static H1 Check

- [x] Confirm each primary page has a page-specific title and description.
- [x] Confirm primary canonical and `og:url` values use the `/website/` path.
- [x] Confirm unsupported `meta keywords` and placeholder author text are removed from active primary heads.
- [x] Confirm the existing `img/shinju.jpg` asset is used for OGP and JSON-LD image URLs.
- [x] Confirm static readable text exists inside the five animated content h1 elements.
- [x] Confirm `menu.js` uses that static text as the existing scramble animation target.
- [x] Confirm `sitemap.xml` is XML and `robots.txt` references the correct sitemap URL.
- [x] Confirm generated output includes the SEO changes and internal matching/bot pages are `noindex, nofollow`.
- [x] Confirm `npm run check` passes; note the existing asset-size warnings separately.
- [ ] Compare the local six-page UI at 320px, 390px, tablet, and desktop widths.
- [ ] Validate JSON-LD and social-card previews after deployment.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch acceptance.

## 2026-09-07 Index Heading Semantics Check

- [x] Keep `Exhibition / Close` as the primary home-page h1.
- [x] Change the alternate `AbstractArtist / MizukiOyama` title to `h2.creator-title`.
- [x] Mirror the previous h1 visual rules for `.creator-title`.
- [x] Pass JavaScript, generated-output, and local-reference checks.
- [ ] Confirm the title visuals at desktop and mobile widths.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Gallery Sidebar Vertical Offset Check

- [x] Compare the current desktop rule with the pre-alignment backup.
- [x] Restore the desktop sidebar `top: 20vh` offset.
- [x] Confirm the local same-viewport screenshot no longer overlaps the heading/subtitle.
- [x] Pass JavaScript, reference, and focused whitespace checks.
- [ ] Confirm the generated `docs/` output after the next build.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.
## 2026-09-22 User typography settings acceptance

- [ ] Open `assets/css/user-settings.css` and confirm the intended 375px and 1440px values.
- [ ] Check TOP, Concept and Gallery at 375 / 390 / 430 / 768 / 1024 / 1280 / 1440px.
- [ ] Confirm Japanese/English wrapping has not changed unexpectedly.
- [ ] Confirm Header/Footer and Menu remain balanced and usable.
- [ ] Confirm buttons, FAQ/form labels, Gallery category/filter, pagination and modal remain usable.
- [ ] Confirm no horizontal overflow or clipped text.
- [ ] After an approved build, confirm generated `docs/assets/css/user-settings.css` is present.
- [ ] Public deployment and real-device acceptance are separate final gates.
# 2026-09-23 Contact Semantic Rename Check

- [x] Confirm `--legacy-px-1_256` → `--font-contact-control-fluid-mid` is a Contact `clamp()` middle term.
- [x] Confirm `--legacy-px-1_628` → `--font-contact-input-fluid-mid` is a Contact `clamp()` middle term.
- [x] Confirm `--legacy-px-2` → `--font-contact-control-fluid-max` is a Contact control/input `clamp()` maximum term.
- [x] Confirm base/tablet/desktop definitions retain identical values.
- [x] Confirm old active source references are 0.
- [x] Confirm unused custom properties are 0 and undefined custom properties are 0.
- [x] Confirm Contact 1440/1280/1024/768/430/390/375px before/after computed-style difference count is 0 by deterministic CSS evaluation.
- [x] Confirm `npm run build`, generated sync, SEO, and links in the final check.
- [ ] Perform fresh real-browser and physical-device acceptance if required.
- [ ] Obtain separate approval before public deployment.
# 2026-09-23 Menu Semantic Rename Check

- [x] Confirm `--legacy-px-1_3` → `--font-menu-item-fluid-mid` is the Menu item mobile `clamp()` middle term.
- [x] Confirm base/tablet/desktop values remain identical.
- [x] Confirm old active definition/reference counts are 0.
- [x] Confirm Menu 1440/1280/1024/768/430/390/375px computed-style difference count is 0.
- [x] Confirm active legacy unique count is 26 → 25.
- [x] Confirm unused custom properties are 0 and undefined custom properties are 0.
- [x] Confirm build, generated sync, SEO, and links in the final check.
- [ ] Perform fresh real-browser and physical-device acceptance if required.
- [ ] Obtain separate approval before public deployment.


## 2026-09-27 Gallery Sidebar and Captions Repair

- [x] Category starts closed at 599px and 600px.
- [x] Click opens and closes the menu at both widths.
- [x] Enter and Space toggle the menu.
- [x] Selecting a category closes the menu.
- [x] Scrolling does not change the open/closed state.
- [x] The mobile glass overlay is shown only at 599px while open and closes the menu when clicked; it is absent at 600px.
- [x] Japanese and English modal captions match 蒼縁 and sōen.
- [x] Caption data responds with HTTP 200; browser console errors and warnings are absent.
- [x] Build, component, JavaScript, generated-output, SEO, and link checks passed.
- [ ] Rerun the combined npm run check after the existing typography issue in css/all.css is resolved.
- [ ] Complete physical-device and public-site acceptance if required.


## 2026-09-27 Language Audit and CSS Cleanup Follow-up

- [x] Confirm the shared-header language UI source and js/menu.js implementation use the same langChange ID.
- [x] Confirm active Ja/En, documentElement.lang, language persistence, and navigation behavior on Home, Gallery, Order, and Policy at 390px and 1440px.
- [x] Confirm Biography and Artist Statement continue to show both languages with the selector hidden.
- [x] User confirmed Information and Contact as Japanese-first bilingual pages; Yurayura stays Japanese-led with partial English and no switch until its full English text is reviewed.
- [x] Confirm Gallery Category is initially closed, toggles by click/Enter/Space, closes after category selection, and does not change state on scroll.
- [x] Confirm the glass overlay is mobile-only and the Gallery caption changes Japanese/English while its modal remains open.
- [x] Compare generated baseline and current output at 1440/1280/1024/768/430/390/375px: 63 page/viewport pairs, zero measured computed-style/geometry differences, zero horizontal overflow.
- [x] Compare open/closed Gallery Category and modal geometry at 390px and 1440px; dimensions and computed values match the saved baseline.
- [x] Confirm undefined custom properties = 0, conflict markers = 0, and browser console errors = 0.
- [x] Confirm build, components, JavaScript, typography, generated output, SEO, and links checks pass.
- [ ] The combined npm run check remains blocked at docs sync while generated docs are uncommitted; no commit is permitted.
- [ ] Pageerror was not separately instrumented by the available browser interface.
- [ ] Complete physical-device/public acceptance only if later required.


## 2026-09-28 Intermediate Release Checkpoint

- [x] Commit `6c676cf6098742a2ffe8ef8e2432b4f404e2e8e0` is pushed to `origin/main`.
- [x] GitHub Actions Pages build and deploy jobs completed successfully.
- [x] Public Home, Gallery, Biography, Artist Statement, Information, Order, Contact, Policy, and Yurayura checked at 390x844 and 1440x900; no horizontal overflow found.
- [x] Public Gallery checked at 1440, 1280, 1024, 768, 430, 390, and 375px; Category starts closed and overflow is absent at all widths.
- [x] Public mobile Category opens/closes, shows its glass overlay only while open, stays open after scrolling, closes on category selection, and filters Digital to eight cards.
- [x] Public desktop Category selection closes the menu; modal opens, fits the viewport, switches 蒼縁 / sōen captions in both directions while open, and closes.
- [x] Home, Gallery, Order, and Policy switch Ja/En both ways at 390px and 1440px.
- [x] Biography, Artist Statement, Information, Contact, and Yurayura retain bilingual display and hidden language controls.
- [x] Public browser console errors = 0; existing VANTA warning recorded separately.
- [x] Post-commit `npm run check` and standalone `npm run check:docs-sync` pass with the preserved docs memo excluded from untracked status.
- [ ] Physical iOS Safari / Android acceptance.
- [ ] Owner review of the public checkpoint.
- [x] Information, Contact and Yurayura language specifications and this MD review are now documented; implementation remains deferred.

## 2026-09-28 Final Intermediate Release Follow-up

- [x] Commit 6c676cf6098742a2ffe8ef8e2432b4f404e2e8e0 and follow-up commits b0f98e79badb5dc203aad7d40915dc04109ad5f4 and cc19d2cb5167b99a3b296a700a1f57caf9043d81 were pushed to main.
- [x] Pages deploy run 371 completed successfully.
- [x] Public all-page check: nine pages at 1440px and 390px; 20 automated cases passed, including the registered 404 route. Screenshot comparisons were disabled for this targeted run.
- [x] Local all-page check at 1280px and 430px: 33 passed, 11 skipped.
- [x] Public Gallery Category/modal/caption and language-switch behaviors were exercised; existing bilingual pages stayed unchanged.
- [x] No public horizontal overflow or console errors were observed at the final checked widths.
- [x] User CSS memos remain present and unstaged; reports, ZIP, and ROADMAP remain outside the release commits.
- [x] Visual Regression #398 is resolved by #406: 53 passed, 13 skipped, 0 failed, screenshot comparison enabled.
- [ ] Owner review and physical iOS Safari/Android acceptance.
- [x] Language rules are documented; Information/Yurayura translation, accessibility implementation and design work remain future tasks.


## 2026-09-29 Documentation and formal baseline — historical snapshot superseded by current specification review above

- [x] Confirmed the nine-page language matrix with the user and recorded it in `PORTFOLIO_MASTER_SPEC.md`.
- [x] Recorded the public baseline `f6427178ca3fa37ccd5744a6e66d14864f056818`, Pages PASS, and Visual Regression #406 (53 passed, 13 skipped, 0 failed; screenshot comparisons active).
- [x] Recorded public checks at 1440px and 390px for all nine pages, zero horizontal overflow, zero console errors, and passing Gallery sidebar/caption behavior.
- [x] Listed Information translation gaps, Yurayura full-translation work and language/table accessibility work as follow-ups.
- [x] Kept implementation, generated output, screenshot baselines, and user CSS memos outside this documentation scope.


## 2026-10-04 Biography and Artist Statement local review

- [x] Confirmed the authoritative source mapping and edited the root HTML sources only.
- [x] Preserved the existing bilingual paragraph structure, classes, header/footer references, title area, and Biography history tables.
- [x] Retained the requested biography facts and concise NatureInspire mention; kept the detailed philosophy in Artist Statement.
- [x] Built the generated docs pages.
- [x] Checked Biography and Artist Statement at 1440px, 768px, and 390px for bilingual display, English reading comfort, and horizontal overflow.
- [x] Confirmed screenshot differences are from the changed copy; no screenshot baseline was updated.
- [ ] Owner review of the final copy and intentional 1440px visual differences.
- [ ] Public deployment and physical-device acceptance, if later requested.

## 2026-10-04 Selected Ink Field + TRUNK release checklist

- [x] Selected Ink Field remains the primary background on all nine routes.
- [x] Original TRUNK sphere restored only on Biography and Artist Statement with the prior VANTA settings.
- [x] Ripple and VANTA.FOG remain disabled in Selected Ink mode; rollback path retained.
- [x] Runtime canvas counts, repeated initialization, reduced-motion lifecycle, and no-context-loss checks passed.
- [x] Biography and Artist Statement local layout checks passed at 1440px and 390px; no horizontal overflow.
- [x] Build passed; clean candidate check chain passed. The formal checkout's docs-sync gate remains affected by preserved unrelated generated-output WIP.
- [x] Pages #418 passed; Visual Regression #445 passed (61 passed / 20 skipped / 0 failed).
- [x] Linux screenshot baselines unchanged; no baseline commit created.
- [x] Existing Gallery / Category / menu.js changes and review-package attachments were kept out of the production commits.
- [ ] Owner headed-browser review of the deployed sphere and background composition.
- [ ] Real-GPU / physical-device performance acceptance; headless software-WebGL readings are diagnostic only.
- [ ] Start the separate Gallery layout audit after reviewing the current preserved WIP.
