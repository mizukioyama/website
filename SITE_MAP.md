# Portfolio Site Map and Source Map

## Purpose
This file records the current public page set and the authoritative source -> build -> deployment mapping. Use it before editing page structure, navigation, SEO routes, shared assets or generated output.

The public site is a GitHub Pages Project Site under:

`https://mizukioyama.github.io/website/`

The `/website/` base path must remain valid in internal URLs, assets, 404 recovery and deployment checks.

## Current indexable pages
The canonical indexable set contains 9 pages:

| Page | Public URL | Authoritative source | Generated/deployed output |
| --- | --- | --- | --- |
| Home | `/website/` | `index.html` | `docs/index.html` |
| Artist Statement | `/website/artist-statement.html` | `artist-statement.html` | `docs/artist-statement.html` |
| Biography | `/website/biography.html` | `biography.html` | `docs/biography.html` |
| Order | `/website/order.html` | `order.html` | `docs/order.html` |
| Gallery | `/website/gallery.html` | `gallery.html` | `docs/gallery.html` |
| Contact | `/website/contact.html` | `contact.html` | `docs/contact.html` |
| Policy | `/website/policy.html` | `policy.html` | `docs/policy.html` |
| Information | `/website/information.html` | `src/information.html` | `docs/information.html` |
| Yurayura | `/website/exhibitions/yurayura/` | `src/exhibitions/yurayura/index.html` | `docs/exhibitions/yurayura/index.html` |

The canonical URL list is also represented by `sitemap.xml`. Any page-count discrepancy must be investigated before changing sitemap or SEO checks.

## Non-indexable special pages

### 404
- Source: `src/404.html`
- Output: `docs/404.html`
- Must remain non-indexable.
- Must not appear in `sitemap.xml`.
- Must provide useful recovery links under the `/website/` base path.

### Legacy Yurayura migration URL
- Source: `src/exhibition-yurayura-2026.html`
- Output: `docs/exhibition-yurayura-2026.html`
- Exists only for migration from the pre-directory URL.
- Must remain non-indexable.
- Canonical destination is `/website/exhibitions/yurayura/`.

## Build responsibilities
`webpack.config.js` currently:
- copies the seven root visual pages directly into `docs/`
- copies `src/information.html` to `docs/information.html`
- copies `src/404.html` to `docs/404.html`
- copies `src/exhibition-yurayura-2026.html` as the legacy migration page
- copies `src/exhibitions/` into `docs/exhibitions/`
- copies root `css/`, selected root `js/`, `img/` and source image assets into the deployment tree
- still builds the separate `matching` and `bot` pages through HtmlWebpackPlugin

Do not assume similarly named files under `src/` are authoritative for the root visual pages. Confirm the mapping in `webpack.config.js` before editing.

## Shared visual sources
The public root-page visual system primarily uses:
- `css/` for shared/root visual CSS
- selected `js/` files for public root-page behavior and injected styles
- `src/components/header.html` and `src/components/footer.html` as the single editable source of truth for the portfolio Header/Footer markup; `npm run sync:components` embeds them into `js/menu.js` so public pages do not need runtime HTML-fragment fetches
- root visual HTML for Home, Artist Statement, Biography, Order, Gallery, Contact and Policy
- specific `src/` HTML sources for Information, 404 and exhibition archives

The separate legacy Webpack application used by `matching` / `bot` still has its own `src/header.html` and `src/footer.html` fragments. Those are not the Header/Footer source for the canonical portfolio pages.

`src/style/` is still active for the separate Webpack application bundle and must follow the same current design-unit rules even though it is not the primary styling source for the nine canonical portfolio pages.

## Generated output policy
`docs/` is deployment/generated output.

Do not implement a fix by hand-editing `docs/` when an authoritative source exists. Update the source, run the build, and verify generated parity.

## Navigation expectations
Primary portfolio paths:
- Home -> Gallery -> Biography / Artist Statement
- Gallery / Biography / Artist Statement -> Order -> Contact
- Home / navigation -> Information -> exhibition detail
- 404 -> Home / Gallery / Information recovery

Header/footer changes are shared-system changes and must be checked across all public pages.

## SEO route rules
For every indexable page:
- canonical URL must match the intended public URL
- sitemap entry must match the canonical URL exactly
- page must have an incoming crawlable internal link
- title/H1/description must remain appropriate and unique where required
- no noindex directive may be introduced accidentally

Do not add 404, redirects, legacy migration pages or other noindex routes to `sitemap.xml`.

## Change procedure
Before changing routes, page structure or build mapping:
1. read this file
2. inspect `webpack.config.js`
3. inspect `sitemap.xml`
4. inspect relevant source imports/selectors
5. update source, not generated output
6. run repository checks
7. run relevant Visual Regression
8. update this file if the source/build/public mapping changed
