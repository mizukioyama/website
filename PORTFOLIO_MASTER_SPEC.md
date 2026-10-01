# Portfolio Master Specification

## Mission
Present Mizuki Oyama's artwork, artistic thinking, career/activity record, exhibitions/information and commission pathway in a restrained portfolio experience where the work remains the visual focus.

## Principles
Artwork first. Keep the interface simple, calm and legible. Preserve intentional whitespace and rhythm. Mobile is first-class. Effects support rather than compete with artwork. Avoid improvement-for-improvement's-sake.

## Canonical content
Biography is the factual activity/career source of truth. Artist Statement is the artistic philosophy/intent source of truth. AI may improve surrounding presentation and SEO but must not invent facts or change substantive meaning without approval.

## Page purposes
Home establishes artist identity/worldview and leads into work. Gallery makes artwork easy to browse and inspect. Biography communicates career/activity. Artist Statement communicates artistic philosophy with reading comfort. Information communicates current/relevant exhibition/activity information. Order explains commission availability, process, conditions and inquiry path. Contact provides a clear route. Policy provides necessary policy/legal information.

## Language presentation

The page-specific language behavior below is the normative specification. The status section records how current production maps to it.

| Page | Required presentation | Language control |
| --- | --- | --- |
| Home | Japanese / English switch | Shown |
| Gallery | Japanese / English switch | Shown |
| Biography | Japanese followed by English | Hidden |
| Artist Statement | Japanese followed by English | Hidden |
| Information | Japanese / English switch | Shown |
| Order | Japanese / English switch | Shown |
| Contact | Japanese followed immediately by the corresponding English; bilingual across the full page, form, and modals | Hidden |
| Policy | Japanese / English switch | Shown |
| Yurayura | Japanese / English switch | Shown |

For switchable pages, the shared Header Ja / En control selects the corresponding content, stores the preference, preserves it across page navigation, and synchronizes `document.documentElement.lang`. Only the selected language is displayed in normal page content. Gallery modal titles and captions follow the selected language, including when the language changes while the modal is open.

Biography, Artist Statement, and Contact display Japanese followed immediately by the corresponding English and hide the language control. Contact pairs each text unit in meaning order throughout the page, including form labels, request options, Policy copy, submit/status text, and both modals. Visiting a bilingual page must not overwrite or clear stored `selectedLang` or compatibility `lang`; switchable pages retain the previously selected language. Contact uses the shared bilingual-page behavior and keeps the root `lang` set to Japanese, matching the primary page language. Keep accurate `lang` attributes on language-specific content.

Before enabling a language control for any switchable page, complete and review its English content. Do not present an incomplete English page as a complete language option.

### Current implementation status — 2026-10-01

Contact's Japanese-first bilingual layout was restored in implementation commit `0b6a4b4c8d9bba9435dafd6789e2290749d7af4f`. The shared bilingual behavior hides its language control while preserving stored language preferences. Its long visual test received a targeted 60-second timeout in `25be9c5b51d0345e0cf5ca23f92ce562534af14b`; only the reviewed Contact desktop-1440 and mobile-390 Linux baselines were updated in `17b97a8991832837ea0bd991b125df6049ede51e`. Pages deploys #399–#401 passed. Visual Regression #428 passed (55 passed / 17 skipped), and `npm run check` passed. Public browser confirmation for this handoff was blocked by the admin-enforced browser policy, so final design handoff readiness remains pending. Yurayura's complete English content and switch were implemented in `8e61d22`; its reviewed Linux visual baselines were recorded separately in `123073c`.

## Gallery behavior

The Category sidebar starts closed at desktop, tablet and mobile widths. Activating Category toggles it open or closed; Enter and Space provide the same operation. Selecting a category closes it. Scrolling does not change its state. Do not use a `collapsed` class to control Category visibility. The existing `mobile-open` class may continue to represent the open state.

The glass overlay appears only at viewport widths of 599px and below while the sidebar is open. Activating the overlay closes the sidebar. There is no glass overlay at 600px and above.

`js/gallery-captions-data.js` is the caption content source. `js/gallery-captions.js` resolves a caption from the current modal artwork title and writes it into the modal's existing heading/paragraph structure. Captions follow the selected language, including a language change while the modal stays open. Caption-data load or parse failure must not prevent the Gallery itself from rendering or operating.

Keep behavior ownership distinct: `js/menu.js` creates the shared sidebar and owns Category open/close state; `js/page-nation.js` owns Gallery filtering and pagination; `js/gallery-captions.js` owns caption presentation. Do not implement the same state or action in multiple scripts.

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
No unintended horizontal scroll, overlap, clipped text, inaccessible controls or unreadably narrow text. Use semantic structure, meaningful alt text, visible focus, usable touch targets, adequate contrast, logical headings and reduced-motion support. Mark non-Japanese text with the appropriate `lang` value and use table header cells with explicit associations where tabular content needs them.

Responsive behavior must preserve visual consistency rather than scaling every dimension indiscriminately. Use the shared breakpoint model unless a component has a documented reason to differ:
- Mobile: up to 599px
- Tablet: 600px to 1298px
- Desktop: 1299px and above

Typography may remain fluid within each breakpoint, but fixed visual geometry must not depend on the browser root font size. Use px for font-size bounds/fixed terms, letter-spacing, border thickness, icon/stroke thickness where shape consistency matters, and text/box-shadow offset/blur/spread. Responsive type may use `clamp(px, calc(px + vw), px)`. Keep line-height unitless unless a fixed optical treatment explicitly requires otherwise.

### Typography font-size policy

The user-editable font-size source of truth is `assets/css/user-settings.css`. The normal user-editing area is the `USER EDITABLE — TYPOGRAPHY` section only.

Do not manage a second set of user-editable font-size values in `css/all.css` or page stylesheets; those rules should consume the shared group tokens or a documented component-role token. Retain compatibility aliases while active references depend on them, and do not reintroduce legacy rules removed by an approved CSS cleanup.

For the same HTML tag, `font-size` is shared within its page group by default. The three page groups are:

- Home: `index.html`
- Standard pages: Gallery, Biography, Artist Statement, Information, Order, Contact, Policy and Yurayura
- 404: the not-found experience, with its own typography roles

The implemented group-level foundations are:

- Home: `--type-home-h1-size`, `--type-home-h2-size`, `--type-home-h3-size`, `--type-home-h4-size`, `--type-home-p-size`, `--type-home-span-size`
- Standard pages: `--type-page-h1-size`, `--type-page-h2-size`, `--type-page-h3-size`, `--type-page-h4-size`, `--type-page-p-size`, `--type-page-span-size`, `--type-page-li-size`
- 404: `--type-404-title-size`, `--type-404-code-size`, `--type-404-p-size`

Normal-content font sizes now use the shared group token for each HTML tag. Page names, classes and IDs alone do not create a separate same-tag font size. Shared values were seeded from the current generic Home H1/H2 and Standard-page H1/H2/H3/H4/body roles specifically selected by the user; this was structural integration, not numerical optimization. The user remains responsible for later final size adjustments in the `USER EDITABLE — TYPOGRAPHY` section. Any retained old inline reference is a non-editable compatibility alias to its group token, not an independent typography role.

Normal font sizes are managed with `clamp()` using 375px and 1440px as the reference range: keep the minimum below 375px, interpolate fluidly from 375px through 1440px, and keep the maximum above 1440px. Do not create large sets of viewport-specific font-size declarations. Add a breakpoint override only when layout or component structure requires it.

`scripts/check-typography.cjs` should verify the page-group token mapping for same-tag normal content and guard the documented component exceptions. The current checker has narrower coverage; its extension is tracked as a follow-up rather than treated as already complete.

Exceptions are limited to clearly different component roles such as header/navigation, menu, footer, interactive links, form controls, buttons, modal controls, Gallery cards, table/metadata text, captions/helpers, animated Home display text and the 404 code. Each exception must have its reason documented in CSS or design documentation. Letter-spacing, tracking, optical treatment and component helper tokens remain separate from normal group typography.

Do not numerically optimize or redesign the implemented values without the user's direction. Final Font Size choices belong to the user.

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
