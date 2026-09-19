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
- [ ] Verify deployed /exhibitions/yurayura/ route and legacy redirect after the current GitHub Pages build
- [ ] Capture desktop/mobile visual baseline for core pages
- [ ] Run full repository checks and resolve failures
- [ ] Audit console/runtime errors
- [ ] Audit responsive overflow/overlap/wrapping
- [ ] Audit navigation and conversion paths

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

## Phase 5 - Continuous improvement
- [ ] Use before/after visual comparison for UI changes
- [ ] Re-run SEO/link/build checks after relevant changes
- [ ] Periodically review current Information, commissions and artwork metadata
- [ ] Avoid changes with no measurable or user-requested benefit

## Completed
- 2026-09-19: Visual Regression environment completed with Playwright/Chromium, approved 1440/390 baselines, representative 1440/768/390 CI, runtime/overflow/resource checks, and optional seven-viewport detailed audit.
- 2026-09-19: Added GitHub Pages custom 404 fallback at docs/404.html and strengthened pre-deploy internal link validation for /website/ project-root links.
- 2026-09-19: Migrated exhibition archives to /exhibitions/{slug}/; Yurayura now uses /exhibitions/yurayura/ with legacy URL migration and automated exhibition SEO/build checks.
- 2026-09-19: Added the Yurayura exhibition detail/archive page and linked it from Information.
- 2026-09-19: Information visual shell aligned with the main portfolio pages, including shared background, header/footer and responsive styling.
- 2026-09-19: Information page source completed and shared header/footer navigation aligned; static source verification passed 13/13.
- 2026-09-19: Verified source -> build -> docs mapping; corrected Information/shared-navigation build inputs.
- 2026-09-19: Portfolio-specific AI governance/specification framework established.
