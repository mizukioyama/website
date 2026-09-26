# Portfolio Master Specification

## Mission
Present Mizuki Oyama's artwork, artistic thinking, career/activity record, exhibitions/information and commission pathway in a restrained portfolio experience where the work remains the visual focus.

## Principles
Artwork first. Keep the interface simple, calm and legible. Preserve intentional whitespace and rhythm. Mobile is first-class. Effects support rather than compete with artwork. Avoid improvement-for-improvement's-sake.

## Canonical content
Biography is the factual activity/career source of truth. Artist Statement is the artistic philosophy/intent source of truth. AI may improve surrounding presentation and SEO but must not invent facts or change substantive meaning without approval.

## Page purposes
Home establishes artist identity/worldview and leads into work. Gallery makes artwork easy to browse and inspect. Biography communicates career/activity. Artist Statement communicates artistic philosophy with reading comfort. Information communicates current/relevant exhibition/activity information. Order explains commission availability, process, conditions and inquiry path. Contact provides a clear route. Policy provides necessary policy/legal information.

## Journeys
Primary: Home -> Gallery -> deeper artist understanding.
Commission: Gallery/Statement/Biography -> Order -> Contact.
Information: Home/navigation -> Information -> exhibition/event detail -> relevant external action.

## Exhibition and event archives
Information is the index and entry point for exhibitions/events. Each exhibition or event must have its own crawlable, persistent detail URL; do not make a modal the only detail surface.

Canonical exhibition URLs use `/exhibitions/{slug}/`. Source pages use `src/exhibitions/{slug}/index.html` and build to `docs/exhibitions/{slug}/index.html`. If the same named exhibition later needs separate annual archives, extend only when required to `/exhibitions/{slug}/{year}/`; do not create empty year layers in advance.

Exhibition detail pages are long-lived activity records. Keep them after the event ends and grow them with verified exhibition views, exhibited works, reflections, outcomes and later context rather than deleting or replacing the URL.

New exhibition pages must receive their own title, description, canonical, OG URL, Event JSON-LD URL/@id, sitemap entry and internal Information link. Never copy an existing exhibition page and change only the visible body or URL.

## Responsive and accessibility
No unintended horizontal scroll, overlap, clipped text, inaccessible controls or unreadably narrow text. Use semantic structure, meaningful alt text, visible focus, usable touch targets, adequate contrast, logical headings and reduced-motion support.

Responsive behavior must preserve visual consistency rather than scaling every dimension indiscriminately. Use the shared breakpoint model unless a component has a documented reason to differ:
- Mobile: up to 599px
- Tablet: 600px to 1298px
- Desktop: 1299px and above

Typography may remain fluid within each breakpoint, but fixed visual geometry must not depend on the browser root font size. Use px for font-size bounds/fixed terms, letter-spacing, border thickness, icon/stroke thickness where shape consistency matters, and text/box-shadow offset/blur/spread. Responsive type may use `clamp(px, calc(px + vw), px)`. Keep line-height unitless unless a fixed optical treatment explicitly requires otherwise.

### Typography font-size policy

The user-editable font-size source of truth is `assets/css/user-settings.css`. The normal user-editing area is the `USER EDITABLE — TYPOGRAPHY` section only.

For the same HTML tag, `font-size` is shared within its page group by default. The three page groups are:

- Home: `index.html`
- Standard pages: Gallery, Biography, Artist Statement, Information, Order, Contact, Policy and Yurayura
- 404: the not-found experience, with its own typography roles

The intended group-level foundations are:

- Home: `--type-home-h1-size`, `--type-home-h2-size`, `--type-home-h3-size`, `--type-home-h4-size`, `--type-home-p-size`, `--type-home-span-size`
- Standard pages: `--type-page-h1-size`, `--type-page-h2-size`, `--type-page-h3-size`, `--type-page-h4-size`, `--type-page-p-size`, `--type-page-span-size`
- 404: `--type-404-title-size`, `--type-404-code-size`, `--type-404-p-size`

Page names alone are not a reason to create separate same-tag tokens within Home or Standard pages. Tokens such as `--type-gallery-h2-size`, `--type-home-h2-size`, `--type-biography-h2-size` and `--type-state-h2-size` must be audited as migration candidates according to their group, selector and current value.

Normal font sizes are managed with `clamp()` using 375px and 1440px as the reference range: keep the minimum below 375px, interpolate fluidly from 375px through 1440px, and keep the maximum above 1440px. Do not create large sets of viewport-specific font-size declarations. Add a breakpoint override only when layout or component structure requires it.

Exceptions are limited to components with a clearly different UI role, such as header/navigation, menu, footer, form controls, buttons, modal controls, captions/helpers and the 404 code. Each exception must have its reason documented in the relevant CSS or design documentation. Letter-spacing, tracking, 404 optical treatment and component-specific helper tokens are separate concerns and must not be treated as normal group typography.

Existing page-name-plus-tag font-size tokens remain migration targets for now. Do not delete, merge or numerically optimize them before the user completes the final font-size adjustment; doing so could change the established design unintentionally.

Do not convert layout behavior such as page width, percentage positioning, viewport-relative composition, or intentionally flexible spacing to px merely for consistency. Choose units by visual responsibility: px for stable shape, relative/viewport units for responsive layout.

## Performance
Balance perceived speed and artwork quality. Optimize dimensions/formats/loading and unnecessary JS/render blocking. Animation libraries must justify their cost. Target good Core Web Vitals without degrading artwork solely for synthetic scores.

## SEO
Every indexable page needs a unique descriptive title, useful description, canonical, logical H1/headings, crawlable internal links and appropriate alt text. Keep sitemap, robots, canonical and OG coherent. Structured data must accurately represent visible content.

## Design changes
Preserve established brand character unless redesign is requested. Reuse existing spacing, typography, table and flow patterns where equivalent components exist.

Typography, spacing and effects must follow `DESIGN_SYSTEM.md`. Header and footer navigation share the same responsive type token within each breakpoint. Do not introduce page-specific font-size overrides when an existing shared token can express the same intent.

## Error recovery and broken-link defense
Use two layers of protection. First, deployment checks must detect broken internal HTML/CSS/JavaScript references before release. Second, GitHub Pages must have a custom `404.html` fallback that clearly remains a 404 experience and offers Home, Gallery and Information recovery links.

The 404 page is not indexable and must not appear in the sitemap. Do not auto-redirect unknown URLs to Home. Because this is a GitHub Project Pages site, 404-local assets and rescue links must resolve under the `/website/` base path even when the missing requested URL is deeply nested.

## Technical source policy
The repository contains root source-like files and a docs/ deployment/build tree. Confirm build/deploy mapping before editing. Prefer source files and regenerate output through the established build. Do not hand-edit duplicated generated files as a shortcut.
