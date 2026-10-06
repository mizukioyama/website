# Portfolio Improvement Roadmap

## Rule
Prioritize evidence-backed improvements. Keep this short/current. Do not accumulate speculative tasks.
Only the baseline and current priority queue below define active status. Dated phase entries later in this file are historical records; unchecked historical items are not automatically current tasks.

## Current production baseline — 2026-10-04

- Production HEAD / origin/main: a246a20eed526013c43a5e40c3b3024bc06e7884. The Selected Ink + TRUNK implementation and rollback policy remain unchanged.
- Primary background is Selected Ink Field on all nine routes. The original VANTA.TRUNK sphere is an optional accent only on Biography and Artist Statement. Ripple is disabled and VANTA.FOG stays disabled in Selected Ink mode; legacy rollback remains available.
- Biography / Artist Statement preserve the user-approved 5500 layout refinements, scoped to those two pages. No Selected Ink visual parameters or Linux baselines changed in the sphere restoration.
- Pages #419 passed. Visual Regression #446 passed (user-confirmed).

## Current priority queue — 2026-10-05

- Background system: Selected Ink Field is the primary background on all nine site routes. The original VANTA.TRUNK sphere runs as an optional accent only on Biography and Artist Statement. Ripple remains disabled, VANTA.FOG remains disabled in Selected Ink mode, and the legacy rollback path is retained.
- Biography / Artist Statement layout refinements remain scoped to those two pages. Their approved 5500 composition and the shared page spacing are unchanged by the sphere restoration.
- Runtime checks confirm one Selected Ink canvas on each route, one TRUNK canvas only on Biography and Artist Statement, and zero Ripple / VANTA.FOG canvases. Repeated mount/destroy, reduced-motion changes, and no-WebGL-context-loss checks passed.
- Release gates: Pages #419 passed; Visual Regression #446 passed (user-confirmed). Existing Linux baselines were not changed; no baseline commit was needed.
- Gallery release-candidate build and component, JavaScript, typography, generated-output, SEO, link, and CRLF-aware checks pass. After the implementation commit, check:docs-sync also passes against the committed generated docs.
- Headless software-WebGL measurements were low and variable; they are not a real-GPU or device performance acceptance. Incremental TRUNK cost on the user's GPU remains unmeasured. No Selected Ink quality values were changed.
- Gallery Phase H-1: the seven-viewport Gallery candidate is committed on codex/selected-ink-field-background-system. Linux Visual Regression full_audit=true is the next gate; do not push to main, deploy Pages, or update baselines before artifact review.
- Owner visual review in a headed browser and physical iOS / Android performance acceptance remain pending.

## Current priority queue

1. Owner review of the deployed Biography / Artist Statement background composition and sphere placement; real-GPU and physical-device performance acceptance remains pending.
2. Complete Gallery Phase H-1 Linux preflight on the feature branch: verify the full 1440 / 1280 / 1024 / 768 / 430 / 390 / 375px matrix with full_audit=true, inspect actual / expected / diff artifacts, and keep main, Pages, and baselines unchanged.
3. Keep current Linux baselines unchanged unless a later reviewed Visual Regression run confirms an intentional target-page difference.

This queue records the Gallery release candidate and its pending Linux visual gate. Feature-branch publication is scoped to preflight; main push, Pages deployment, and baseline updates remain deferred.

## Phase 0 - Governance
- [x] AI operating rules and Loop Engineering
- [x] Master specification
- [x] Site/change map (`SITE_MAP.md`)
- [x] Design/motion/unit policy (`DESIGN_SYSTEM.md`)
- [x] SEO/content policy
- [x] QA/regression policy (`QA_CHECKLIST.md`)
- [x] Verify all source -> build -> docs mappings and update SITE_MAP
- [x] Add automated visual regression tooling if absent

## Phase 1 - Baseline audit
- [ ] External/manual only: replace the three retired-domain links in the ended 2022 CAMPFIRE project with the current official portfolio URL. This does not block Phase 1.
- [x] Verify deployed /exhibitions/yurayura/ route and legacy redirect after the current GitHub Pages build
- [x] Capture desktop/mobile visual baseline for core pages
- [x] Run full repository checks and resolve failures
- [x] Audit console/runtime errors
- [x] Audit responsive overflow/overlap/wrapping
- [x] Audit navigation and conversion paths
- [x] Audit same-name person entity disambiguation (小山瑞樹 / Mizuki Oyama) and document SEO identity gaps before implementation
- [x] Biography / Artist Statement mobile reading comfort: page-specific typography/spacing refined and verified across 1440/1280/1024/768/430/390/375 px

## Phase 2 - SEO and content
- [x] Audit title/meta/H1/canonical across indexable pages
- [x] Audit sitemap/robots/internal links — sitemap exact match, 9 indexable pages, robots policy, internal links, Pages and Visual Regression verified.
- [x] Audit artwork alt text and metadata — 69 Gallery records, accessible alt text, thumbnail/detail fallback, language/category/modal regression checks, Pages and Visual Regression verified.
- [x] Review copy clarity while preserving artist voice — clarified Home, Information and Contact functional copy; retained Order/Policy/Yurayura where already clear; reviewed Biography/Artist Statement without changing substantive artistic meaning.
- [x] Review structured-data opportunities using verifiable visible facts — current Person/WebSite/ProfilePage/page-type markup is retained; Yurayura Event rich-result eligibility is intentionally deferred until a verified venue name/address is visible on the page, because Google requires event location and structured data must not introduce non-visible facts.

## Phase 3 - UX
- [x] Verify shared spacing/typography/component consistency — typography uses px-based fixed/min/max terms with responsive clamp() interpolation; Header/Footer share breakpoint-specific type tokens across 1440/1280/1024/768/430/390/375 px; CI, Pages deploy, public checks, and Visual Regression verified.
- [x] Integrate normal Font Size roles by Home / Standard pages / 404 — same-tag content uses group tokens, UI components remain explicit exceptions, and final value tuning belongs to the user; source HTML and screenshot baselines were not changed.
- [x] Optimize mobile gallery/artwork viewing — mobile Gallery now uses a single artwork column with 44px side insets, full available artwork width, compact card flow without the legacy 350px minimum, and a minimum 48px artwork action target; verified at 1440/1280/1024/768/430/390/375 px with a refreshed Gallery-only 390px visual baseline.
- [x] Verify Biography/Statement reading comfort
- [x] Verify Order flow and Contact path — Order CTA reaches the usable Contact form; request/inquiry mode, request-category requirement, core required fields, Policy-gated consent, mocked Apps Script submission success, thanks modal and reset behavior are covered without sending external data.
- [x] Review Information hierarchy/current-event usability — Upcoming remains before Past, and the current Yurayura event stays the first actionable record with visible date and detail link.

## Phase 4 - Performance and motion
- [ ] Measure Core Web Vitals/PageSpeed baseline
- [ ] Audit image formats/dimensions/loading/quality
- [ ] Audit heavy JS/Three.js/p5/Vanta/ripples by page
- [ ] Propose page-appropriate motion improvements
- [ ] Implement reduced-motion/offscreen safeguards where missing

## Maintenance - post-Phase 1 (non-blocking)

### SEO/social image separation
- [ ] Consider a dedicated non-artwork portfolio OGP/Person image so social/entity metadata no longer reuses `img/shinju.jpg`; keep current artwork-image suppression until that separation is intentionally designed and verified.

### Build pipeline / Webpack audit
- [ ] Decide whether the current Webpack pipeline remains the simplest, safest and most maintainable fully free build for this portfolio. This task does not block Phase 1 and must not remove or broadly restructure Webpack during Phase 1.
  - Map source -> build -> `docs/` for Home, Gallery, Biography, Artist Statement, Information, Order, Contact, Policy, 404 and `/exhibitions/yurayura/`, classifying root HTML, `src/` HTML, Webpack generation, copy processing, custom Node scripts and direct `docs/` output.
  - Inventory Webpack responsibilities: JavaScript bundling, HTML generation/copy, CSS processing, image/font/audio copy, Gallery captions, shared fragments, production assets and any other build-only behavior.
  - Identify every behavior that currently requires Webpack before proposing removal.
  - Evaluate a parallel `static HTML/CSS/JS + small Node build scripts + GitHub Pages` output without replacing the working pipeline first.
  - Audit dependency candidates such as `file-loader`, `html-webpack-inline-source-plugin` and other packages not referenced by the active build; do not remove anything before proving it is unused.
  - Relate npm vulnerabilities and deprecated dependencies to the active build surface.
  - Compare Webpack-retain vs Webpack-removal options for build simplicity, maintainability, dependency count, security surface, Actions runtime, GitHub Pages fit, Visual Regression compatibility, Gallery-caption automation, future page additions and rollback.
  - Migration gate: Discover -> confirm build mapping -> identify Webpack dependencies -> design alternative -> generate in parallel -> compare generated/SEO/links/Visual Regression -> confirm identical or approved differences -> make the final migration decision.

## Phase 5 - Continuous improvement
- [ ] Use before/after visual comparison for UI changes
- [ ] Re-run SEO/link/build checks after relevant changes
- [ ] Periodically review current Information, commissions and artwork metadata
- [ ] Avoid changes with no measurable or user-requested benefit

## Completed
- 2026-09-27: Audited bilingual behavior and source ownership across nine pages, repaired the switchable-page initialization/CSS/language and Gallery modal-caption paths, and removed only proven duplicate, overridden, or unreferenced CSS. The seven-viewport baseline comparison had zero measured computed-style/geometry differences and zero overflow. The user later confirmed Information and Contact as Japanese-first bilingual pages and Yurayura as Japanese-led with partial English and no language control until a full translation is reviewed; the current rules are recorded in PORTFOLIO_MASTER_SPEC.md.
- 2026-09-27: Restored Gallery Category state ownership across breakpoints, removed scroll-driven collapsed behavior, preserved the mobile glass overlay, repaired Japanese/English captions for the current modal title markup, and passed the 599px/600px local browser matrix. The follow-up below fixes the stale typography assertion; the combined check now stops at docs sync because generated docs remain uncommitted. No public release was performed.
- 2026-09-26: Integrated normal typography tokens for Home, Standard pages and 404; unified regular same-tag sizes from the user-selected generic seeds, preserved component exceptions and Biography's inline compatibility alias, updated the four typography MDs, and passed full 10-page × 7-viewport geometry/runtime checks. Screenshot baselines were unchanged; local platform-matched pixel comparison was unavailable.
- 2026-09-22: Added `assets/css/user-settings.css` as the user-facing typography source of truth. Shared/root-page typography now uses Calculator-style px `clamp()` roles with 375px → 1440px comments and legacy aliases preserved; source checks pass and generated output will be rebuilt from the current main baseline.
- 2026-09-22: Restored Order and Yurayura detail-page vertical layout to the shared portfolio rhythm by removing their page-specific zero-margin override and matching Information's 60vmin content start on desktop/mobile; added geometry regression coverage and seven-viewport verification.
- 2026-09-22: Completed Information hierarchy/current-event usability review. The existing Upcoming→Past structure was retained and regression coverage now protects the Yurayura event title/date/detail CTA.
- 2026-09-21: Completed Phase 3 Order/Contact flow verification. Reused existing Order→Contact, request-mode and Policy-modal coverage, then added missing required-field/consent checks and a fully mocked Google Apps Script submission path so success/reset behavior is verified without external writes.
- 2026-09-21: Completed Phase 3 mobile Gallery/artwork viewing optimization. Mobile Gallery changed from two columns to one, normalized 44px side insets, removed the legacy fixed card/action heights, expanded artwork to available width, preserved Category/modal interactions, added geometry/touch-target assertions, and passed the Gallery audit at 1440/1280/1024/768/430/390/375 px.
- 2026-09-21: Completed structured-data opportunity audit against current Google Search guidance. Retained the existing WebSite/Person/ProfilePage and page-type graph, avoided speculative markup with no measurable benefit, and documented Yurayura Event location as the only current rich-result blocker pending verified visible venue details.
- 2026-09-21: Restored deterministic deployment of the existing Google Search Console HTML verification file by copying it to the `docs/` deployment root and checking source/output parity.
- 2026-09-21: Removed the unlinked/noindex legacy `matching` / `bot` Webpack application and its private source JS/CSS/assets. Simplified Webpack to deterministic static portfolio assembly and removed bundle-only Babel/CSS/HTML/CSP/jQuery dependencies while preserving the nine canonical pages and deployment checks.
- 2026-09-21: Removed six superseded `reports/` audit files from the active repository (history remains in Git), removed the unreferenced root `js/side.js` compatibility asset after confirming Gallery sidebar behavior is integrated into the current runtime, and deleted four zero-reference legacy source files (`src/assets/js/structured-data.js`, `src/js/gallery.js`, `src/js/matching.js`, `src/js/rollup.config-min.js`).
- 2026-09-21: Removed verified-unused repository/archive assets after successful quarantine and dependency audit: deleted the 227-file delete-candidate archive, unused blog prototypes, unused backup audio, unused local font sources, and unused npm packages (`file-loader`, `gh-pages`, `html-webpack-inline-source-plugin`, `@fortawesome/fontawesome-free`). Generated `docs/` and the lockfile are rebuilt from the remaining active source graph.
- 2026-09-21: Audited the full committed `docs/` tree against a clean GitHub Pages build, replaced commit/time cache tokens with deterministic content hashes, synchronized stale generated HTML/JS/assets, upgraded the post-build parity check from `docs/css/` to the entire `docs/` deployment tree, and moved the Visual Regression build before its temporary Playwright package install so CI uses the same clean `npm ci` build environment as Pages.
- 2026-09-21: Confirmed that committed `docs/css/` had drifted behind the CSS actually generated and deployed by GitHub Actions; synchronized the committed CSS mirror with the current build output and added a post-build Git working-tree check so stale `docs/css/` cannot pass the normal repository check again.
- 2026-09-21: Re-verified Biography / Artist Statement reading comfort after the ZIP audit; normal Japanese/English body copy now shares the documented body token, source and computed-size regression checks cover all seven breakpoints, static source-of-truth HTML is preserved through the build, and the full 1440/1280/1024/768/430/390/375 px Visual Regression audit passed (119 passed, 35 intentionally skipped).\n- 2026-09-20: Completed copy-clarity review across current core/indexable content. Applied only meaning-preserving functional copy fixes to Home, Information and Contact; retained clear Order/Policy/Yurayura copy; Biography and Artist Statement were reviewed but substantive consolidation/rewording was intentionally deferred because it requires artist approval.
- 2026-09-20: Established the current visual-unit governance: px for stable typography/tracking/shadow geometry, responsive `clamp(px, calc(px + vw), px)` typography, breakpoint-specific shared Header/Footer sizing, and authoritative `DESIGN_SYSTEM.md`, `QA_CHECKLIST.md`, and `SITE_MAP.md` documentation.
- 2026-09-20: Merged PR #6 at `09f5f7b0e791420c6c6b70613b840b50dff68212`; GitHub Pages deploy run `35499140808` and post-deploy Visual Regression run `35499183314` passed, followed by public checks across the 10 required routes.
- 2026-09-20: Completed artwork alt-text and metadata audit; verified 69 Gallery records, #1501–#1504 detail fallbacks, generated output, public Gallery interactions, Pages deployment, and post-deploy Visual Regression without changing image-index suppression.
- 2026-09-20: Sitemap/internal-link/image-index controls were implemented and audited; final closure remains open because the GitHub Pages project-site `/website/robots.txt` is not a host-root robots.txt file.
- 2026-09-20: Completed indexable-page title/meta/H1/canonical audit; corrected Home heading semantics without changing approved visuals and extended SEO checks for indexable metadata uniqueness, generated H1/OG URL alignment and exact sitemap URL integrity.
- 2026-09-20: Completed Phase 1 navigation/conversion audit by reusing existing Gallery, Order, Contact, 404 and Yurayura interaction coverage and adding only missing Home menu, Information -> Yurayura, external exhibition CTA destination/safety, and Policy-path checks on desktop/mobile.
- 2026-09-19: Completed Biography / Artist Statement mobile reading comfort improvements without changing canonical body copy; verified full seven-viewport audit, English wrapping, Biography tables, Statement 1-5 flow, runtime/resources/overflow, and approved only the two mobile-390 baselines.
- 2026-09-19: Retired-domain final audit completed. oyama-artist-gallery.online and freelife-artist.com are permanently retired, must not be revived or redirected, and no longer block Phase 1. Remaining CAMPFIRE cleanup is external/manual only.
- 2026-09-19: Strengthened the canonical 小山瑞樹 / Mizuki Oyama Person entity as Abstract Artist with verified sameAs profiles and automated retired-domain/identity checks.
- 2026-09-19: Visual Regression environment completed with Playwright/Chromium, approved 1440/390 baselines, representative 1440/768/390 CI, runtime/overflow/resource checks, and optional seven-viewport detailed audit.
- 2026-09-19: Added GitHub Pages custom 404 fallback at docs/404.html and strengthened pre-deploy internal link validation for /website/ project-root links.
- 2026-09-19: Migrated exhibition archives to /exhibitions/{slug}/; Yurayura now uses /exhibitions/yurayura/ with legacy URL migration and automated exhibition SEO/build checks.
- 2026-09-19: Added the Yurayura exhibition detail/archive page and linked it from Information.
- 2026-09-19: Information visual shell aligned with the main portfolio pages, including shared background, header/footer and responsive styling.
- 2026-09-19: Information page source completed and shared header/footer navigation aligned; static source verification passed 13/13.
- 2026-09-19: Verified source -> build -> docs mapping; corrected Information/shared-navigation build inputs.
- 2026-09-19: Portfolio-specific AI governance/specification framework established.

- 2026-10-04: Restored the original VANTA.TRUNK sphere as a scoped accent over Selected Ink Field on Biography and Artist Statement only. Selected Ink remains primary across all nine routes; Ripple and VANTA.FOG remain disabled in Selected Ink mode. Pages #418 and Visual Regression #445 passed, Linux baselines stayed unchanged, and the Gallery layout task is ready for a separate audit.

## Gallery Phase B-3 — 1440 measured checkpoint (2026-10-05)

- Closed state measured in Playwright at 1440px: .gallery-box and #gallery-container left 220px / width 1000px; first card left 252px / width 446.41px. The reported x≈600 state did not reproduce in this local HTTP context.
- The B-2 :has() state selector matched when Category opened. The 128px artwork shift came from centering a 1240px sidebar+gap+art grid, not from selector or specificity failure.
- The 1300px+ Gallery CSS now keeps closed artwork centered and limits open/closed artwork-area movement to 60px. Open Category is 190px wide with a 40px gap; card widths remain 446.41px. The centered-group target was subordinated to the user's explicit artwork-stability priority.
- HTTP preview returned 200; both states had no horizontal overflow or browser/page/resource errors. Source/generated Gallery CSS match. npm run check passed component sync, JS syntax, typography, and build, then stopped at check:docs-sync because generated docs WIP is dirty. Separate generated, SEO, and link checks passed after restoring pre-check docs; the generated check also passed on the final state. Build-side changes to other generated files were restored from pre-check copies.
- 1280px and below, Gallery behavior, background assets, baseline, and Git release state remain untouched. Await owner review at http://127.0.0.1:4173/website/gallery.html before further viewport work.


## Gallery Phase B-4 — 1440 desktop listing candidate (2026-10-05)

- Desktop Category is a horizontal filter area above the artwork list; the former sidebar-plus-artwork columns are removed at 1300px and wider.
- The artwork list uses four columns and eight items per page; the existing pagination JavaScript already had an eight-item page size and was not changed.
- Category open/closed states share the same centered gallery width, so opening filters only adds vertical height.
- Candidate remains local and uncommitted for user review at 1440px. Smaller viewports, production release, and baselines remain out of scope.

## Gallery Phase C — Tablet vertical layout + CSS cleanup (2026-10-05)

- PC and tablet now share the vertical Category → wrapped filter menu → Artwork Grid → Pagination structure. Closed/open Category states keep the same artwork X position and width.
- Measured grid: 1440px 1150px / 4 columns / 266.5px cards; 1280px 1120px / 4 / 259px; 1024px 956px / 3 / 300px; 768px 700px / 2 / 336px. Each has eight cards and 28px × 48px gaps.
- Mobile 430 / 390 / 375 remains two columns with the existing glass overlay; opening Category does not move the artwork grid. No horizontal overflow was measured at any of the seven widths.
- Gallery CSS reduced from 1253 to 1093 lines; mobile CSS from 410 to 330. The duplicate declaration inventory went from 24 to 0 in gallery.css and 1 to 0 in mobile.css. Proven dead typo/comment-only rules were removed; modal, caption, pagination, mobile Category and shared typography rules remain.
- Local browser checks covered Category toggle/filter, pagination, captions, modal open/close, Selected Ink canvas presence, image loads, headers/footers and console errors. `npm run build`, check:components, check:js, check:typography, check:generated, check:seo, and check:links passed. `check:docs-sync` remains blocked by preserved generated-page WIP; full `git diff --check` reports CRLF trailing whitespace on pre-existing Biography / Contact generated HTML. The Phase C source, generated CSS and Roadmap diff check is clean.
- No background engine, Biography/Artist Statement content, pagination JavaScript, baseline, or production release state was changed. Await owner review at http://127.0.0.1:4173/website/gallery.html; do not stage, commit, push, or update baselines yet.

## Gallery Phase D — Genre × Year filter acceptance (2026-10-05)

- Filter counts are sourced from the full filtered set: All 69, Paint 25, Year 2024 4, Paint × 2024 1. Paint × 2025 is the data-confirmed zero-result pair.
- The Japanese / English count and empty-state messages, zero-result grid/pagination hiding, in-place recovery, current-page reset, independent Genre / Year toggling, language-state persistence, mouse / Enter / Space controls, and `aria-pressed` state pass the Gallery interaction suite at all seven viewport widths.
- A mobile Category menu/Footer stacking defect reproduced at 390px when zero results shortened the content. `main.gallery` now rises above the Footer only while the mobile Category menu is open; all seven viewport tests pass after the fix.
- `npm run build`, component / JS / typography / generated / SEO / link checks pass. `check:docs-sync` remains blocked by preserved generated-output WIP. Raw `git diff --check` reports CRLF line endings; CRLF-aware diff checking passes.
- Screenshot baselines remain unchanged. Human visual acceptance, physical-device testing, and release readiness remain separate. No Git staging, commit, push, or deployment was done.

## Gallery Phase E/F — mobile final spacing and release-candidate audit (2026-10-05)

- Removed the mobile-only 350px minimum card height; Gallery remains two columns at 430 / 390 / 375px. Natural card heights measured 268.9 / 250.5 / 243.6px, with readable captions and no horizontal overflow.
- Removed the corresponding stale commented rule and the obsolete inline Category pseudo-element CSS. Removed one duplicate filter-state synchronization call from the Genre / Year handler.
- Full Gallery interaction regression passed 7/7 configured widths. 390px touch emulation passed Year 2025 → Paint × 2025 → All, including the zero-result state.
- Local macOS screenshot comparison differs from existing Gallery snapshots: 1440 expected 4140px / actual 2802px; 390 expected 3342px / actual 2952px. These reflect the adopted four-column desktop layout and the mobile card-height adjustment. No baseline was updated.
- Correction: the tracked 390px Gallery baselines exist for both Linux (390×3319) and Darwin (390×3342). A fresh Linux actual comparison remains pending.
- Build, component, JS, typography, generated-output, SEO, link, and CRLF-aware diff checks passed. The docs-sync check remains blocked by 14 tracked generated docs outputs plus 215 preserved AppleDouble sidecars in this uncommitted tree.
- Selected Ink Field and other protected background/content files retain their hashes. No staging, commit, push, deploy, baseline update, or production publication was performed.

## Gallery Phase G — Release-candidate audit (2026-10-05)

- Rebuilt from source and confirmed generated output parity. Component, JavaScript, typography, generated-output, SEO, link, and CRLF-aware diff checks pass.
- The 7-width Gallery interaction/layout run passes on macOS Chromium. Snapshot matching was deliberately disabled; this is runtime evidence, not Linux Visual Regression evidence. Mobile 390px cross-route geometry checks also show no change from the shared .gallery .content width declaration across Gallery, Biography, Artist Statement, Information, Order, Contact, Policy, and Yurayura.
- The committed-sync checker inspects git status --porcelain -- docs; it therefore remains red while the 14 generated docs outputs are uncommitted, even though check:generated passes. A commit is prohibited at this checkpoint.
- The 215 docs/._* files all have AppleDouble magic/version headers, are untracked and unreferenced by source/build code. They remain on disk and are ignored by the new ._* rule.
- Linux actual/diff was not obtained: this host is macOS and has no Docker, Podman, or GitHub CLI. Linux baselines (1440×4134 and 390×3319) remain unchanged; 390 is included in the official screenshot projects.
- Branch codex/selected-ink-field-background-system, HEAD and origin/main a246a20eed526013c43a5e40c3b3024bc06e7884; staged files 0. No commit, push, deploy, or baseline update.


## Gallery Phase H-1 — Feature release candidate (2026-10-05)

- Revalidated 215 docs/._* files: all were untracked AppleDouble files with no source or build references and matched the .gitignore rule. A byte-for-byte backup was made under /private/tmp/portfolio-phase-h1-appledouble-20261005/sidecars; the 215 local sidecars were removed and the remaining count is zero. 変更メモ.css was preserved.
- Implementation commit 35acd44 contains only the seven Gallery source/test files and fourteen generated docs files. The Documentation commit remains separate.
- Local build and component, JavaScript, typography, generated-output, SEO, link, and CRLF-aware diff checks pass. check:docs-sync passes after the implementation commit.
- Protected background modules, Biography / Artist Statement source, review ZIP, and 1440 / 390 Linux Gallery baselines retain their preflight hashes.
- Current gate: feature-branch push and Linux Visual Regression workflow_dispatch with full_audit=true; review expected / actual / diff before any baseline decision. main, Pages, and production remain unchanged.
