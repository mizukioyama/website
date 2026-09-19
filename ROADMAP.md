# Portfolio Improvement Roadmap

## Rule
Prioritize evidence-backed improvements. Keep this short/current. Do not accumulate speculative tasks.

## Phase 0 - Governance
- [x] AI operating rules and Loop Engineering
- [x] Master specification
- [x] Site/change map
- [x] Design/motion policy
- [x] SEO/content policy
- [x] QA/regression policy
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
- [ ] Audit title/meta/H1/canonical across indexable pages
- [ ] Audit sitemap/robots/internal links
- [ ] Audit artwork alt text and metadata
- [ ] Review copy clarity while preserving artist voice
- [ ] Review structured-data opportunities using verifiable visible facts

## Phase 3 - UX
- [ ] Verify shared spacing/typography/component consistency
- [ ] Optimize mobile gallery/artwork viewing
- [ ] Verify Biography/Statement reading comfort
- [ ] Verify Order flow and Contact path
- [ ] Review Information hierarchy/current-event usability

## Phase 4 - Performance and motion
- [ ] Measure Core Web Vitals/PageSpeed baseline
- [ ] Audit image formats/dimensions/loading/quality
- [ ] Audit heavy JS/Three.js/p5/Vanta/ripples by page
- [ ] Propose page-appropriate motion improvements
- [ ] Implement reduced-motion/offscreen safeguards where missing

## Maintenance - post-Phase 1 (non-blocking)

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
