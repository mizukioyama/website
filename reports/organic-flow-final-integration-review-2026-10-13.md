# Organic Flow — Final Integration Candidate Review

Date: 2026-10-13
Repository: isolated local candidate based on `mizukioyama/website`
Candidate branch: `feat/organic-flow-production-integration`
Base commit: `d8b215acbe6b8d848d10367104bd0a29c0a2f3df`
Candidate implementation commit: `5bf879ea2100be7ebd6ea4fd3f77abb4b3345d68`

## Result

The Organic Flow overlay candidate is implemented for Biography and Artist Statement in an isolated checkout. Local build and repository checks pass. Targeted reload, reduced-motion, runtime, and seven-viewport overlay checks pass. This is a local candidate for owner review; it is not released or merged.

Local-only review pages are being served from the candidate checkout: [Biography](http://127.0.0.1:8772/website/biography.html) and [Artist Statement](http://127.0.0.1:8772/website/artist-statement.html). The existing preview on port 8771 remains separate.

`PERFORMANCE — INCONCLUSIVE`
`USER VISUAL ACCEPTANCE — PENDING`
`DRAFT PR / GITHUB CI — NOT RUN (GitHub CLI is unauthenticated)`

## Scope and behavior

- Adds a Canvas2D Organic Flow layer only on Biography and Artist Statement, above the existing TRUNK sphere and below page content, inside the existing `#portfolio-overlay-animation` layer.
- Adds the five-choice Showcase Random selector with equal 20% initial weights: Organic Contour, Flowing Ribbons, Branching Currents, Atmospheric Flow, and Hybrid Random.
- A session-scoped key remembers the previous choice to prevent consecutive repeats across reloads and the two target routes. It does not write to the Organic Flow settings store or change other preview ports' storage.
- Hybrid Random reuses the existing contribution randomizer. Its values remain bounded and sum to 100. The selected page path remains unchanged on reload.
- The candidate preserves Selected Ink Field, VANTA.TRUNK, overlay `z-index: 5`, `pointer-events: none`, `aria-hidden="true"`, and the Ripple archive. Ripple assets are not requested in the targeted browser run.
- The source/build mapping now copies the candidate engine and integration files to generated `docs/`.

## User settings

No exported user settings JSON was supplied or imported. The engine identifies its code-created configuration as `new-defaults` with `userTunedValuesRecovered: false`; those defaults are not reported as the user's tuned settings. Existing preview tabs and their storage at ports 8765, 8766, 8767, and 8771 were not opened, reset, or modified.

## Verification

| Check | Result |
|---|---|
| `npm run test:organic-flow` | PASS, 6/6 |
| Biography / Artist Statement Showcase Random reload tests | PASS, 2/2; route preserved, consecutive choice avoided, resize does not reroll, one Organic canvas |
| Browser reduced-motion emulation | PASS for `reduce` and `no-preference` on both routes; Organic canvas remains single, RAF stops/resumes, TRUNK follows motion preference |
| Overlay/runtime seven-width browser test | PASS; test ran once and inspected both target routes at 1440, 1280, 1024, 768, 430, 390, and 375px; six project duplicates skipped |
| Runtime resources | Ripple DOM/request count 0; no external resource failures or Organic runtime errors observed. Existing VANTA missing-THREE and GPU readback warnings were observed and are not attributed to this change. |
| `npm run check` | PASS, including build, generated-doc sync, SEO, links, component sync, and JS/typography checks |
| `git diff --check` | PASS |
| Local snapshot comparison | NOT COMPARABLE: all four target page/viewport runs reached snapshot lookup, but corresponding `*-darwin.png` expected snapshots do not exist in this checkout. This was not a pixel-difference failure; no baseline was changed. Generated actual screenshots were inspected, with no obvious overlap/clipping in the captures. |
| Linux Visual Regression / GitHub Actions | NOT RUN; GitHub CLI is unauthenticated, and this host is macOS. No baseline changed. |

Webpack completed with existing asset-size/performance advisory warnings for large site assets. There were no compilation errors.

The browser test verifies layer geometry/runtime, not owner visual acceptance of the animation composition or full page screenshots at every width.

## Performance evidence and limit

The attached 96/96 idle-condition comparison is from the previous Organic Flow preview, not this production-integration candidate. It used Chrome 153 on macOS and short 1.8-second samples; it is not a real-device or final-candidate performance acceptance.

| Prior preview mode | Average FPS | Average p95 frame time | Organic draw average |
|---|---:|---:|---:|
| Organic OFF | 32.08 | 59.97 ms | NOT_AVAILABLE |
| Manual | 34.78 | 50.94 ms | 0.876 ms |
| Hybrid | 35.56 | 48.73 ms | 0.898 ms |
| Hybrid Random | 33.23 | 50.55 ms | 0.813 ms |
| Showcase Random | 35.82 | 44.82 ms | 0.920 ms |

The prior run's worst result was Artist Statement / 768px / Hybrid Random: 23.21 average FPS, 67.7 ms p95, and 116.4 ms maximum frame time. Organic OFF was also low in that environment. The candidate itself has not received a comparable performance run; do not interpret these figures as a pass or as proof that Organic Flow caused the low FPS.

## Files in the implementation commit

- `biography.html`, `artist-statement.html`
- `css/organic-flow.css`
- `js/organic-flow-engine.js`, `js/organic-flow-production.js`
- `webpack.config.js`, `package.json`
- `tests/organic-flow-engine.test.cjs`, `tests/visual/visual.spec.cjs`
- Corresponding generated `docs/` HTML, CSS, and JavaScript
- `reports/organic-flow-priority-performance-comparison-2026-10-11.json` (prior-preview data only)

The existing generic review reports and `reports/chatgpt-review-package.zip` were preserved byte-for-byte. No source outside this isolated candidate, production `main`, Pages, or visual baselines changed. No push, PR, merge, or deployment occurred.

## Remaining gates

1. Owner reviews the local candidate composition on Biography and Artist Statement.
2. Supply/import the user's exported settings JSON before treating any values as tuned or final.
3. Run comparable performance measurements on this candidate and appropriate physical devices; current result remains inconclusive.
4. After review and GitHub authentication is available, create the authorized Draft PR and inspect its CI. No login flow was started.
5. Obtain separate approval before production merge or public deployment.
