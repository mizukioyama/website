# Phase 3 source-of-truth audit

Date: 2026-09-20
Branch: `phase3-bilingual-mobile-typography-audit`
Base: `ad577fcae63180a1dfca1a41c6c08a8c5320a3a3`

## Page mapping

| Route | Authoritative source | Generated/deployed output | Status |
| --- | --- | --- | --- |
| Home | `index.html` plus root `css/` and `js/` | `docs/index.html` | Active root visual source |
| Gallery | `gallery.html` plus root `css/` and `js/` | `docs/gallery.html` | Active root visual source |
| Biography | `biography.html` plus root `css/` and `js/` | `docs/biography.html` | Active root visual source; bilingual mode added |
| Artist Statement | `artist-statement.html` plus root `css/` and `js/` | `docs/artist-statement.html` | Active root visual source; bilingual mode added |
| Information | `src/information.html` and copied shared assets | `docs/information.html` | Active src page in Webpack mapping |
| Order | `order.html` plus root shared assets | `docs/order.html` | Active root visual source |
| Contact | `contact.html` plus root shared assets | `docs/contact.html` | Active root visual source |
| Policy | `policy.html` plus root shared assets | `docs/policy.html` | Active root visual source |
| Yurayura | `src/exhibitions/yurayura/index.html` | `docs/exhibitions/yurayura/index.html` | Active exhibition source |
| 404 | `src/404.html` | `docs/404.html` | Active fallback source |

`webpack.config.js` confirms the root visual page list and the explicit `src/` mappings. The `docs/` tree is generated output and was not treated as an independent source. The duplicate `src/biography.html`, `src/artist-statement.html`, and related files remain reference/alternate build inputs; they were not deleted or silently promoted to authoritative sources.

## Repository classifications

- Active runtime: root page HTML, root `css/`, root `js/`, `src/information.html`, `src/404.html`, `src/exhibitions/yurayura/`, and the Webpack configuration.
- Generated/deployed: `docs/`.
- Reference/alternate or legacy candidates, retained unchanged: `src/` duplicates not selected by the current root visual mapping, `_layoutsdefault.html`, `sidebar.html`, `js/footer.js`, `test.html`, `memo.md`, `tatus`, `webpack`, `website`, `website@1.0.0`, `npm list webpack.yaml`, and `path/to/project/public/assets/`.
- No file was deleted or moved during this audit.

## Phase 3 changes

- Biography and Artist Statement carry `data-language-mode="bilingual"`. Their Japanese and English regions remain explicitly marked with `lang` attributes and are both made visible by the shared menu runtime. The switch UI is hidden on these pages, while the stored preference is preserved for Gallery and other switchable pages.
- Shared root typography tokens now control body, list, UI, caption, table, metadata, category, and pagination text. Existing heading hierarchy, menu hierarchy, layouts, imagery, and page structures remain separate.
- Generated output was rebuilt from the source. The build tool refreshes cache-query timestamps on several unchanged HTML outputs; those generated timestamp-only changes are not part of the intended source diff.
