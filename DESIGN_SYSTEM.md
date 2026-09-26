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

Japanese and English paragraphs that express the same normal body-copy role must use `--font-body-size` equally. Translation text must not be reduced to caption/metadata sizing merely because it is English. Caption, metadata, table, form-helper and intentional subtext roles may use their dedicated tokens.

When changing a shared token, inspect all consumers before merging.

## Font-size source of truth and page-group rule

The formal user-editing source of truth for font size is `assets/css/user-settings.css`. Users normally edit only the `USER EDITABLE — TYPOGRAPHY` section. Compatibility aliases, internal implementation tokens and legacy tokens are not normal font-size editing surfaces.

The same HTML tag uses one shared font-size role within its page group by default:

- Home: `index.html`
- Standard pages: Gallery, Biography, Artist Statement, Information, Order, Contact, Policy and Yurayura
- 404: the not-found experience, with independent 404 roles

Use group roles such as `--type-home-h1-size` / `--type-home-p-size`, `--type-page-h1-size` / `--type-page-p-size`, and `--type-404-title-size` / `--type-404-p-size`. Page names alone must not create separate same-tag font-size tokens within a group. Existing tokens such as `--type-gallery-h2-size`, `--type-home-h2-size`, `--type-biography-h2-size` and `--type-state-h2-size` are migration candidates; audit their selectors, pages, scopes and values before choosing a common value. Do not merge or numerically optimize them before the user confirms the final font size.

## Fluid range and permitted exceptions

Normal font-size uses `clamp()` with the 375px-to-1440px range: the minimum is maintained at 375px and below, the value interpolates fluidly between 375px and 1440px, and the maximum is maintained at 1440px and above. Avoid viewport-by-viewport font-size declarations and do not add a breakpoint solely to adjust font size.

An explicit font-size exception is permitted only for a component with a clearly different UI role, such as header/navigation, menu, footer, form controls, buttons, modal controls, captions/helpers or the 404 code. Document the reason for each exception. Letter-spacing, tracking, 404 optical treatment and component-specific helper tokens are separate visual concerns; they are not evidence that normal group typography should remain page-specific.

Before the user's final font-size adjustment, AI/Codex must not numerically optimize, unify, delete or merge the existing page-specific typography tokens. This preserves the current visual output while the migration is pending.

## Header and footer
Header navigation and footer navigation must use the same responsive size token within each breakpoint.

Current target scale:
- 375px / 390px / 430px: approximately 18px
- 768px: approximately 20.5px
- 1024px: approximately 22.6px
- 1280px: approximately 24.6px
- 1440px: 25.6px

Implementation should remain breakpoint-specific and fluid with `clamp()`, using px bounds.

Do not silently give the header and footer independent font-size systems again.

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
