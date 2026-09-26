# Portfolio Improvement Roadmap

## Rule
Prioritize evidence-backed improvements. Keep this short/current. Do not accumulate speculative tasks.

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
