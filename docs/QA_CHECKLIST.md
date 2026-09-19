# QA and Regression Checklist

A task is complete only when intended behavior is verified and no material regression is found.

## Automated baseline
Run npm run check unless the task genuinely cannot affect the build/site.

## Automated Visual Regression
The normal GitHub Actions Visual Regression run checks 1440x900, 768x1024 and 390x844. Core screenshot baselines are committed for 1440 and 390; 768 is a structural/runtime breakpoint check. Tests cover horizontal overflow, clipped text, visible image failures, page errors, same-origin console/resource failures, shared header/menu/footer behavior, 404 focus/recovery links and nested exhibition navigation.

Do not regenerate baselines to silence a failure. First classify the delta as a real regression, a test defect, nondeterministic rendering, or an intentional approved design change. Only the last case, or an explicitly verified safe UI correction, may update the committed baseline.

Indexable routes in sitemap.xml must be represented in tests/visual/visual.spec.cjs. The suite fails when a sitemap route is not registered. 404 is explicitly covered despite being noindex.

For a detailed responsive audit, manually dispatch the "Visual regression" workflow with `full_audit=true`. This runs 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 px. Keep the representative 3-viewport matrix as normal CI to control runtime.

## Visual viewport matrix
For layout/UI changes use the automated representative matrix for normal verification and the complete 1440, 1280, 1024, 768, 430, 390 and 375 px matrix for detailed audits, breakpoint-sensitive changes, or when the representative run exposes a responsive defect.

## Visual scan
Check unintended horizontal overflow, overlap, clipping, unintended wrapping, grid/alignment, margins/padding, stretched/cropped artwork, header/menu/footer, overlays/z-index, focus visibility, touch targets and layout shifts during loading.

## Functional
Check navigation, category/filter controls, gallery interactions, forms/CTAs, links, keyboard interaction, console errors and relevant back/forward behavior.

## Broken-link defense and 404
First defense: `npm run check:links` must reject missing relative references and internal Project Pages references under `/website/`, including same-origin absolute URLs that point into the project. Directory links must resolve to an existing `index.html`.

Second defense: verify the generated artifact contains root-level `docs/404.html`. The page must remain `noindex,follow`, stay out of sitemap.xml, avoid automatic redirecting, and provide keyboard-focusable Home, Gallery and Information links. Check a shallow and deeply nested missing URL when production access is available, plus desktop/mobile layout, header/footer/menu, console errors and failed resources.

## SEO
Check unique title/description, canonical, H1/headings, alt, internal links, sitemap/robots and structured data where present.

## Accessibility
Check semantic landmarks/headings, keyboard operation, focus, alt, labels, contrast, reduced motion and that information is not motion-only.

## Performance
Check oversized/eager images, new render-blocking assets, duplicate libraries, unnecessary JS, offscreen continuous animation, CLS sources and heavy mobile effects.

## Decision
Clear regression/spec violation -> fix and retest.
Existing clear local/safe bug -> fix; otherwise record in ROADMAP.
Subjective aesthetic change -> approval before major change.
Intentional requested difference -> accept/document.

## Failure loop
Diagnose root cause -> smallest correction -> rerun checks. Avoid blind patches; escalate when safe root cause is not established.
