# Site Map and Change Map

Verify against actual imports/build configuration before every change and update this map when architecture changes.

## Architecture
Root HTML/CSS/JS are primary source candidates. src/ contains build inputs/components and must be inspected. docs/ is the GitHub Pages deployment/build output candidate and should be treated as generated unless configuration proves otherwise. scripts/ contains validation/generation. webpack.config.js defines build mapping. package.json is the task entry point. img/ contains source assets. reports/ is analysis output.

## Validation
npm run check:js
npm run build
npm run check:generated
npm run check:seo
npm run check:links
npm run check

## Primary pages
| Purpose | Source candidate | Deployed counterpart | Risk |
|---|---|---|---|
| Home | index.html | docs/index.html | shared navigation, hero, animation, SEO |
| Gallery | gallery.html | docs/gallery.html | captions/data/filter/pagination/images |
| Biography | biography.html | docs/biography.html | canonical career content, tables |
| Artist Statement | artist-statement.html | docs/artist-statement.html | canonical artistic text, reading |
| Order | order.html | docs/order.html | commission flow, CTA |
| Contact | contact.html | docs/contact.html | form/privacy |
| Policy | policy.html | docs/policy.html | policy content |
| Information | verify build mapping | docs/information.html | current activity/exhibitions |

## Shared UI and code
sidebar.html and generated header/sidebar/footer fragments can affect multiple pages. Inspect webpack.config.js and loading behavior first.
css/all.css is broad/shared and high-risk. css/animation.css contains motion rules. Search selector usage before changing shared declarations.
Shared/functional JS includes main.js, menu.js, side.js, mobile.js, gallery-captions-data.js, gallery-captions.js, gallery_top.js, page-nation.js, worksdata.js, form.js and loading.js. Three.js, p5, Vanta and ripples are heavy dependencies; do not expand use without justification.

## Change-target protocol
Identify rendered page -> trace source/build/docs -> locate exact component/selectors/scripts -> search shared usage -> define expected delta -> edit narrowest source -> build -> verify generated parity -> verify affected pages/viewports.
Never infer a target from filename alone.
