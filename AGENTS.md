# Portfolio Site AI Operating Rules

## Purpose
This repository is the official portfolio website for Mizuki Oyama. AI/Codex must improve it safely and efficiently while preserving the artist's intent and existing visual identity.

## Source of truth
Priority: latest explicit user instruction > PORTFOLIO_MASTER_SPEC.md > DESIGN_SYSTEM.md > QA_CHECKLIST.md > SITE_MAP.md > ROADMAP.md > existing implementation.
Biography and Artist Statement are authoritative for career facts and artistic philosophy. Never invent or materially reinterpret them.

## Loop Engineering
Every task follows Discover -> Plan -> Execute -> Verify -> Iterate.

### Discover
Identify the exact page/component and outcome. Read SITE_MAP.md and inspect actual imports, selectors, build mappings and dependencies. Search for duplicate source/deployed files. Never assume docs/ is source. Establish a before-state for visual changes.

### Plan
Name target files and affected shared dependencies. Prefer the smallest sufficient change. Predict impact on desktop/mobile, SEO, accessibility, performance and other pages.

### Execute
Preserve architecture/design unless change is required. Do not perform unrelated refactors. Reuse existing components/styles. Never edit generated/deployed output when a source/build pipeline exists unless explicitly required.

### Verify
Run npm run check where applicable, then verify relevant UI. For visual changes inspect desktop/mobile and compare before/after. Check console errors, overflow, overlap, clipping/wrapping, navigation, links, images, focus/keyboard and reduced motion.

### Iterate
Clear defects may be fixed autonomously and re-tested. Ask before subjective brand/design changes, substantive Biography/Statement changes, content deletion, information-architecture changes, destructive Git actions or irreversible external actions.

## Change authority
AUTO: clear bugs, broken links, invalid markup, obvious responsive overflow, regressions, safe accessibility defects, implementation/spec inconsistencies.
SAFE EXECUTION: SEO metadata, minor copy clarity, spacing refinements, performance optimization and animation tuning that preserve meaning and brand.
APPROVAL: major layout/navigation redesign; deletion; artist identity/artwork interpretation/Biography/Statement meaning; major color/type identity changes; destructive or irreversible actions.

## Anti-regression
Never change a shared selector without checking consumers. Never solve one viewport by breaking another. Never hide overflow to conceal a defect. Never remove content/features just to pass a test. Do not modify healthy areas without a concrete UX, SEO, accessibility, performance, maintainability or user-request reason. Stop blind patching when root cause is uncertain.

## Visual units
Use px for values whose visual shape should remain stable across the site: font-size fixed/min/max terms, letter-spacing, border/hairline thickness, icon/stroke thickness where relevant, and text-shadow/box-shadow offsets, blur and spread. Responsive typography may still use viewport units inside clamp(), but keep all fixed/min/max terms in px, e.g. `clamp(18px, calc(15.2px + 0.6vw), 19px)`. Prefer unitless line-height. Do not convert responsive layout dimensions or spacing to px unless a fixed shape is intentional. Follow DESIGN_SYSTEM.md for the complete unit policy.

Typography operating rule: the formal Font Size source of truth is `assets/css/user-settings.css`, and the normal user-editing surface is only `USER EDITABLE — TYPOGRAPHY`. Use shared same-tag roles across the site (`--type-h1-size`, `--type-h2-size`, `--type-h3-size`, `--type-h4-size`, `--type-body-size`) rather than creating page-name-specific tokens. Normal font sizes use a 375px-to-1440px `clamp()` range with MIN below 375px and MAX above 1440px. Use explicit breakpoint overrides only for required layout/component changes, not for routine font-size tuning.

Permitted font-size exceptions are limited to clearly distinct UI components such as navigation/menu, form controls, buttons, modal controls and the 404 display code; document the reason. Letter-spacing, tracking, 404 optical treatment, component helpers and legacy/non-Home optical tokens are separate concerns from same-tag font-size and must not be bulk-deleted as part of this rule. Existing page-specific typography tokens are migration targets and must remain until the user completes the final font-size adjustment. AI/Codex must not numerically optimize, unify, delete or merge them beforehand.

## Visual Regression standard
Treat Playwright Visual Regression as a standard Verify step for changes that can affect UI, CSS, layout, shared components, header/footer/menu, images, responsive behavior or page structure. The normal CI matrix is 1440, 768 and 390 px; committed screenshot baselines are compared at 1440 and 390 px. Use the full 1440/1280/1024/768/430/390/375 matrix for detailed audits or breakpoint-sensitive work.

Before changing a baseline, classify the difference as: real UI regression; test implementation defect; nondeterministic animation/font/time/random effect; or intentional approved design change. Never update screenshots only to make a failing test pass. Stabilization belongs in tests and must not alter production design solely for Visual Regression.

New indexable pages must be registered in tests/visual/visual.spec.cjs. The Visual Regression suite compares registered routes against sitemap.xml so an unregistered sitemap page fails CI. Non-indexable special pages such as 404 must remain explicitly registered when they are part of recovery or critical UX.

## Priority
Broken functionality -> layout/responsive -> usability -> accessibility -> SEO -> performance -> content/conversion -> visual polish -> animation. Page-purpose-critical issues can override this.

## Content
Always consider useful copy improvements exposed by requested work. Preserve the user's voice. Correct clear errors safely. Substantive artistic wording requires approval.

## Animation
Motion needs a purpose: orientation, feedback, hierarchy, atmosphere or transition. Artwork/reading remain primary. Prefer lightweight CSS; justify heavy canvas/WebGL. Respect prefers-reduced-motion. Avoid harming LCP, CLS, INP, readability or mobile stability.

## Completion
Report target, files changed, verification, remaining risks/decisions and next priority. Update ROADMAP.md when project state changes.
