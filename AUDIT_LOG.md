# Audit Log

## 2026-09-22 — Min-Max Calculator typography settings

### Scope

- Target: `mizukioyama/website` checkout at `/Users/mizu/05_デザイン・自主制作/web/website`
- Source of truth: root visual pages and root `css/` per `reports/source-of-truth-audit.md`
- Added: `assets/css/user-settings.css`, `CSS_VARIABLES_GUIDE.md`
- Updated: root visual page stylesheet order, shared CSS role references, `webpack.config.js`
- Backup: `backups/20260922_before_user_settings_typography/`

### Implementation

- Added Japanese-commented semantic `--type-*` variables with 375px → 1440px min/max values.
- Used px fixed/min/max terms and Calculator-style `clamp(px, calc(px + vw), px)` interpolation.
- Kept existing `--font-*` and `--root-font-size` variables as compatibility aliases.
- Routed common body/list/UI/caption/table/metadata/category/pagination, Header/Footer, TOP, Gallery, Menu, Form and Modal roles through the new settings.
- Added `assets/css/user-settings.css` after page CSS on the root visual pages so user changes are applied safely without selector-specific `!important` overrides.
- Added a Webpack copy rule so the setting file will be delivered as `docs/assets/css/user-settings.css` after a successful build.

### Seven-viewport calculation

The following values are the effective Calculator output for the main roles. Values are in px and ordered as 1440 / 1280 / 1024 / 768 / 430 / 390 / 375.

| Role | 1440 | 1280 | 1024 | 768 | 430 | 390 | 375 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Body | 14.00 | 13.70 | 13.22 | 12.74 | 12.10 | 12.03 | 12.00 |
| List | 12.80 | 12.53 | 12.10 | 11.66 | 11.09 | 11.03 | 11.00 |
| UI | 16.00 | 15.70 | 15.22 | 14.74 | 14.10 | 14.03 | 14.00 |
| Caption | 13.00 | 12.70 | 12.22 | 11.74 | 11.10 | 11.03 | 11.00 |
| Category | 17.60 | 17.06 | 16.19 | 15.33 | 14.19 | 14.05 | 14.00 |
| Header/Footer | 25.60 | 24.46 | 22.63 | 20.80 | 18.39 | 18.11 | 18.00 |
| Gallery H1 | 81.60 | 75.20 | 64.96 | 54.72 | 41.20 | 39.60 | 39.00 |
| Gallery H2 | 33.20 | 30.80 | 26.95 | 23.10 | 18.03 | 17.43 | 17.20 |
| TOP title | 28.80 | 28.32 | 27.55 | 26.78 | 25.77 | 25.65 | 25.60 |

### Verification evidence

- `npm run check:typography`: PASS
- `npm run check:js`: PASS (45 files, 5 inline scripts)
- `npm run check:components`: PASS
- `npm run check:seo`: PASS
- `npm run check:links`: PASS
- `node --check webpack.config.js`: PASS
- `git diff --check`: PASS
- Local browser at 1280×720: all 7 root pages loaded `user-settings.css` exactly once and reported no horizontal overflow.
- Local Gallery: 8 works, 4 pagination controls, category control, modal open/close and body scroll lock verified.
- Local TOP/Gallery computed values at 1280px matched the new semantic roles; Header/Footer computed size was approximately 24.46px.

### Boundary

- `npm run build` could not run because this checkout has no `node_modules` and `webpack` is unavailable.
- `npm run check:generated` could not run because `html-minifier-terser` is unavailable.
- Therefore `docs/` was not edited or declared regenerated, generated Concept output and public deployment remain pending, and no push/publication was performed.
- Physical Safari/iOS/Android acceptance remains pending.
