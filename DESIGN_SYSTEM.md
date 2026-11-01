# Portfolio Design System

## Purpose
This file defines the implementation-level visual rules for the Mizuki Oyama portfolio. It is subordinate to `PORTFOLIO_MASTER_SPEC.md` and the latest explicit user instruction, and it is authoritative for visual implementation details such as units, typography, responsive scales, spacing responsibility and effect geometry.

## Core visual principle
Artwork remains primary. Interface styling should be restrained, stable and predictable. Responsive behavior should improve readability and composition without changing the apparent character of type, tracking, strokes or shadows more than necessary.

## Unit policy

Use units according to what the value is responsible for.

### Use px for stable visual geometry
Use `px` when a value should keep a consistent visible shape across pages and environments:
- `font-size` fixed values and the min/max/fixed terms inside responsive typography
- `letter-spacing`
- border and hairline thickness
- icon/stroke thickness when optical consistency matters
- `text-shadow` offset, blur and spread
- `box-shadow` offset, blur and spread
- other small optical details whose shape should not change with the root font size

Do not use `rem` or `em` for those properties in active portfolio UI unless an explicit exception is documented.

### Use relative or viewport units for responsive layout
Use relative or viewport units where the value is responsible for layout adaptation:
- percentages for proportional positioning and widths
- `vw`, `vh`, `dvh`, `vmin`, `vmax` for viewport-driven composition
- `fr` for grid distribution
- `ch` where text measure is intentionally character-based
- relative units for spacing only when the spacing is intentionally designed to scale

Do not convert responsive layout dimensions to px only for uniformity.

### Line height
Prefer unitless `line-height` so rhythm follows the active font size consistently. Use fixed values only when a specific visual treatment requires it and has been verified across the supported viewport matrix.

## Responsive breakpoints
The shared portfolio breakpoint model is:
- Mobile: `<= 599px`
- Tablet: `600px - 1298px`
- Desktop: `>= 1299px`

Avoid introducing near-duplicate breakpoint values unless a component has a verified layout need. If an exception is required, document why it differs.

## Responsive typography
Responsive text can remain fluid inside a breakpoint, but use px for all fixed/min/max terms.

Preferred pattern:

```css
font-size: clamp(18px, calc(15.2px + 0.6vw), 19px);
```

Avoid:

```css
font-size: clamp(1.125rem, calc(0.95rem + 0.6vw), 1.1875rem);
```

The `vw` term may remain because it provides fluid interpolation. The visual bounds should remain px-based.

## Shared typography tokens
Use shared CSS custom properties as the source of truth whenever the same role appears on multiple pages. Do not create page-specific font-size overrides for body text, common links, header navigation or footer navigation unless a real page-specific readability issue has been verified.

Current shared roles include:
- body text
- list text
- UI/link text
- captions
- table text
- metadata
- category controls
- pagination
- header/footer navigation

Shared body-text target scale:
- 1440px: 14px
- 1280px: 14px
- 1024px: 14px
- 768px: approximately 13.5px
- 430px: approximately 12.1px
- 390px / 375px: 12px

Non-Home pages must not override `--font-body-size` with the historical reduced-root compatibility values. They should inherit the same shared body token as Home unless a verified page-specific readability issue requires an exception.

Japanese and English paragraphs that express the same normal body-copy role must use the same page-group token (for Standard Pages, `--type-page-p-size`). Translation text must not be reduced to caption/metadata sizing merely because it is English. Caption, metadata, table, form-helper and intentional subtext roles may use their dedicated tokens.

When changing a shared token, inspect all consumers before merging.

## Font-size source of truth and page-group rule

The formal user-editing source of truth for font size is `assets/css/user-settings.css`. Users normally edit only the `USER EDITABLE — TYPOGRAPHY` section. Compatibility aliases, internal implementation tokens and legacy tokens are not normal font-size editing surfaces.

The same HTML tag uses one shared font-size role within its page group by default:

- Home: `index.html`
- Standard pages: Gallery, Biography, Artist Statement, Information, Order, Contact, Policy and Yurayura
- 404: the not-found experience, with independent 404 roles

Use the implemented group roles such as `--type-home-h1-size` / `--type-home-p-size`, `--type-page-h1-size` / `--type-page-p-size` / `--type-page-li-size`, and `--type-404-title-size` / `--type-404-p-size`. Normal same-tag content now uses one group token; page names, classes and IDs alone do not justify another same-tag size. Initial shared values came from the generic roles selected by the user and were not numerically optimized. Any retained old inline reference is a non-editable compatibility alias to its group token. Final size adjustments belong to the user in `USER EDITABLE — TYPOGRAPHY`.

## Fluid range and permitted exceptions

Normal font-size uses `clamp()` with the 375px-to-1440px range: the minimum is maintained at 375px and below, the value interpolates fluidly between 375px and 1440px, and the maximum is maintained at 1440px and above. Avoid viewport-by-viewport font-size declarations and do not add a breakpoint solely to adjust font size.

An explicit font-size exception is permitted only for a clearly different component role, such as header/navigation, menu, footer, interactive links, form controls, buttons, modal controls, Gallery cards, table/metadata text, captions/helpers, animated Home display text or the 404 code. Document each reason. Letter-spacing, tracking, optical treatment and component-specific helper tokens are separate visual concerns; they do not justify page-specific normal-content sizes.

AI/Codex must not numerically optimize or redesign the integrated values unless the user explicitly requests it. Final Font Size choices belong to the user.

## Header and footer
Header and Footer normally share the responsive size token. The approved 2026-10-29 PC component exceptions (min-width: 1024px) are an 18px brand and 16px primary menu, owned by the existing component rules in css/menu.css. Footer, language controls and mobile/tablet sizes retain the shared tokens.

Current target scale:
- 375px / 390px / 430px: approximately 18px
- 768px: approximately 20.5px
- 1024px: approximately 22.6px
- 1280px: approximately 24.6px
- 1440px: 25.6px

Implementation should remain breakpoint-specific and fluid with `clamp()`, using px bounds.

Do not add further independent Header/Footer font-size systems. The explicit PC component exceptions above do not change the shared Typography values.

## Letter spacing
Use px for tracking so the visual texture of type remains stable. Avoid `em` tracking for portfolio UI unless proportional tracking is deliberately required and documented.

When converting an existing `em` or `rem` value, preserve the current visible result as closely as practical rather than redesigning it at the same time.

## Shadows and optical effects
Use px for shadow geometry:
- x/y offset
- blur radius
- spread radius

Color/alpha may remain color functions. Do not scale shadows with `rem` or `em`.

Blur filters and backdrop blur should also use px when their optical appearance is intended to remain consistent.

## Borders and radii
Use px for borders and hairlines. Border radius may use px when the component shape should remain fixed; use percentage only when the geometry is intentionally proportional, such as circles.

## Spacing
Spacing is not automatically px-based. Choose the unit according to layout intent:
- fixed optical gap: px is acceptable
- viewport/composition spacing: viewport or percentage units may be better
- text rhythm: preserve the existing system unless a redesign is requested

Do not perform bulk unit conversion on margin/padding without a concrete layout reason.

## Source of truth and generated files
The root visual pages, active source pages under `src/`, shared CSS and active JavaScript-injected styles are editable sources. `docs/` is generated/deployment output.

Do not hand-edit generated `docs/` files to implement design changes. Update the authoritative source and rebuild.

## Design authority
Historical audit material is preserved in Git history rather than kept as active repository guidance.

Current design authority is:
1. latest explicit user instruction
2. `PORTFOLIO_MASTER_SPEC.md`
3. this `DESIGN_SYSTEM.md`
4. `QA_CHECKLIST.md`
5. `ROADMAP.md`
6. existing implementation when not contradicted above

## 2026-10-26 shared Header and Standard background candidate

- Header links: edit `src/components/header.html` only; `npm run build` synchronizes the JS component and no-JavaScript navigation in all ten page sources. Runtime replaces the fallback, so only one primary navigation exists.
- Desktop navigation uses the shared Header/Footer typography from 1024px. Up to 1023px retains the overlay; Escape closes it, and hidden links are inert. This component-specific boundary does not change body typography breakpoints.
- Standard background: edit `css/standard-background.css` for the Biography/Statement-derived base color/image and TRUNK opacity/geometry. `gallery.css` imports it; Home does not. Selected Ink Field lives in `js/selected-ink-field.js`; the optional TRUNK lifecycle belongs to `js/background-system-config.js`; Organic Flow settings remain in `js/organic-flow-engine.js` and production selection in `js/organic-flow-production.js`.
- Cascade: shared base/reset → shared standard/component rules → deliberate page-specific inline rules; `assets/css/user-settings.css` remains the typography source. Keep role-specific overrides; do not flatten font-size controls or remove compatibility tokens without checking consumers.
- New Standard pages need the common Header fallback, `data-background-accent="trunkSphere"`, one TRUNK mount, one overlay, and the same background scripts/styles as Information. Add indexable pages to sitemap and visual tests; 404 stays noindex.
- Build with `Portfolio: Build generated site`; preview with `Portfolio: Preview generated site`; run `Portfolio: Full quality checks` and the relevant Playwright suite. Do not edit generated `docs/` by hand. This candidate requires Before/After design approval before merging or publishing.

Desktop horizontal navigation uses one shared size role, weight and tracking, with component line-height 1.4. The mobile overlay retains its existing text rhythm.


## Menu and mobile reading candidate — 2026-10-27

- Primary navigation is Top / ArtIndex / Biography / Artist Statement / Order / Contact, from the shared Header source on desktop, overlay and no-JavaScript fallback. Information and Policy stay in the unchanged shared Footer. The build embeds that Footer as a static fallback too; runtime replaces it without duplication.
- `.header-inner` is the only new layout class: one inner wrapper is needed to align the brand/language column at the left and the primary menu at the viewport right edge. The local 2026-10-28 candidate limits the menu itself to `min(100%, clamp(1080px, calc(25vw + 720px), 1200px))`; the wrapper is no longer capped at 1200px. The Header background remains full width. It uses `display: contents` below the existing 1024px boundary. No body/Gallery width is changed.
- Desktop brand and primary links use existing `--inv` on standard pages and `--text` on Home; text gradients, mask/noise and text shadows are disabled only within the desktop Header. Hover/current underline and focus outline remain visible. All six desktop links use the approved fixed 16px component exception; the PC brand uses 18px. The shared `--font-nav-size` alias and user-editable Typography values remain unchanged for Footer and non-PC consumers.
- Biography/Statement share `.reading-nav`, paragraph wrapping and translation-divider rules in `css/gallery.css`. Their mobile flow/gutters/line-height live in the existing mobile media query in `css/mobile.css`; font sizes remain inherited. Statement keeps its own question timeline rules because their vertical-line structure is a distinct role.
- Mobile title/subtitle, artwork, Reading Nav and text are in normal flow with no fixed height; the artwork remains uncropped. The shared reading gutter is `clamp(24px, 7vw, 32px)`, inside the existing mobile breakpoint. Year/content cells reuse the existing history-table roles.
- No new CSS variables, CSS files or media-query boundaries. The legacy Statement-only Reading Nav class and repeated inline body/divider declarations are removed. Typography checking follows the shared CSS source rather than requiring duplicate inline rules.
- Local candidate only. Design review, clean committed-output validation and formal Linux comparison precede publication approval.


## 2026-10-30 local navigation UX candidate

- Reuse the single shared Header panel and native button. Desktop primary links remain inline below55vh; from55vh the same panel opens from a compact top-right control. Mobile keeps its64px circle at right5vmin/bottom35vmin. New desktop controls do not move the mobile button.
- The existing scroll controller owns the compact state and100vh reading navigation. Sidebar center is50% on both axes of its allocated free area; use the shared4vh link gap and bounded scrollable height to avoid artwork/header contact in short viewports. Footer root-margin56px hides the rail before its real element enters the viewport; focus moves to the visible compact button before inert is applied.
- Discrete controls share a44px target floor in all.css. Existing44px Reading Nav height is reused, with a44px minimum width for its shortest link. Prose inline links and artwork cards retain their semantic layout. Footer uses natural height so enlarged controls cannot collide with copyright.
- Short mobile first views reserve up to80px of line width beside the restored fixed control. H1 remains at50svh, with unchanged Font Size tokens and no new breakpoint or JavaScript layout measurement.
- Gallery audit: standard-background.css remains the shared static image/contrast source; Selected Ink Field is the primary WebGL canvas (z=-1), TRUNK is the optional accent (z=0), Organic Flow is the distinct overlay (z=5), and the Gallery reading surface uses the common rgba(0,0,0,.05)/blur(10px) at z=10 (2026-10-31 visibility correction: removed Gallery-only .7/15px overrides). Three normal-motion canvases serve different roles; no Ripple/Fog runtime resource remains. Retain these layers. Only inactive legacy background-color comments were removed.
- Owner design review completed. Navigation UX release verification, individually reviewed Linux references and deployment evidence are tracked in PR #44; physical-device acceptance remains separate.

## 2026-10-31 local UX / Home review candidate

- All page H1 weight is 100 in css/all.css, matching Art Index. Existing size tokens stay unchanged; Home creator and exhibition H2 roles keep their existing weights.
- Navigation underline transitions affect text decoration only, retaining full-cell targets. Ja/En uses a 44px / 12px separator / 44px grid.
- Contact Site Policy uses its existing shared dialog controller, a fixed header and a scrolling content pane; policy.html remains copy authority. Only the stored language is shown in this dialog. Viewing and explicit consent are separate.
- Home .card uses 1.618 landscape and 1/1.618 portrait ratios, constrained to the viewport. The existing portrait-tablet boundary shares the portrait ratio.
- Home entry reuses language radios/storage; START invokes initializeTyping for only the selected language, then emits portfolio:homeready once to start the existing slideshow. Same-tab session return skips the entry/typing. No-JS and runtime-error fallbacks leave the site accessible.
- Local review only; Linux baseline and publication remain pending.


## 2026-11-01 local interaction / typography candidate

- PC H1 keeps the same size and weight100, but uses the existing Gallery Regular glyphs through the locally served Portfolio Shippori family. The official Google Fonts Latin subset and OFL license live in css/fonts; the alias prevents a same-name installed ExtraBold font from substituting on pages without the web face. Only the existing1024px PC query references it; mobile H1 is unchanged.
- Discrete controls keep their full targets. A single nav-label span bounds the shared Footer-style pseudo underline to the text; underline timing is .5s ease and hover opacity/shadow follows the existing shared link rule. The static no-JavaScript generator strips decoration markup and asserts six links.
- Cursor nodes stay in the normal root stack at12000 above Policy10001 and thanks10099; no active dialog uses the browser Top Layer. Native cursor hiding activates only after mouse input on a fine hover pointer. Touch keeps native behavior without generating cursor nodes.
- Policy/artwork reading panes share padding20–32px and the existing modal-body token16–18px. Only this explicit modal component token changes; normal page Typography values are preserved. Thanks presentation is consolidated into form.css, replacing competing JavaScript/legacy CSS overrides. Each modal keeps close/Escape/focus return and a bounded independently scrolling body.
- Home keeps its golden ratios and existing slideshow/START/loading/language persistence. The portrait card has24px side gutters when height permits. View is a native same-tab Gallery link; the former Enter and Home-only Policy DOM/fetch/controller are removed. Only data-home-slide controls receive slide-click handlers; closed-exhibition copy and disabled View stay intact.
- Local review only. No commit, push, deployment or Linux baseline update in this task.
