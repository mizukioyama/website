# SEO and Content Guide

## Goal
Increase discoverability without keyword-stuffed marketing copy. Preserve artistic credibility and the user's voice.

## Per-page review
Check indexability/canonical, unique title, meta description, one clear H1, logical H2/H3, crawlable internal links, descriptive link labels, useful image alt text, OG metadata, accurate structured data, sitemap inclusion and duplicate/conflicting source/generated metadata.

## Content review
Evaluate first-visit clarity, repetition, natural Japanese, scanability, heading/body relationship, page purpose, useful next action/internal links, and consistency with Biography/Artist Statement.

## Authority
AUTO: typos, punctuation, obvious duplicates and established factual formatting inconsistencies.
SAFE: small clarity/SEO edits preserving exact meaning.
APPROVAL: new biography facts, new artistic interpretations, unestablished awards/ownership/exhibition claims, substantive Biography/Statement rewriting.

## Artist SEO
Use the artist name consistently where useful without stuffing. Expose artwork title and factual metadata where available. Alt text describes useful image content/context rather than repeating keywords. Link artwork, artist context, commissions and current information naturally.

## Exhibition/event SEO
Information is the listing/entry page; each exhibition or event must have a dedicated indexable archive URL under `/exhibitions/{slug}/`. Use a year child path only when one exhibition series actually has multiple annual detail pages.

For every new exhibition page verify all of the following before release: source path and generated path; unique title and description; exactly one H1; canonical ending in the intended directory URL; matching `og:url`; Event JSON-LD `url` and `@id`; verified dates and organizer facts; crawlable Information link; sitemap inclusion; working CSS/JS/image paths from the nested directory; and a persistent post-event archive plan.

The automated SEO check discovers `src/exhibitions/**/index.html`, derives the expected canonical from the source path, validates canonical/OG/Event JSON-LD alignment and rejects duplicate exhibition titles/descriptions. A copied exhibition page must therefore be fully re-authored for its new event metadata before checks pass.

Legacy static URLs that cannot issue HTTP redirects on GitHub Pages may remain as minimal migration pages using `noindex,follow`, canonical to the new URL, a zero-delay meta refresh and a normal crawlable link. Do not use JavaScript-only redirects.

## Technical
Keep robots.txt, sitemap.xml, canonical and public GitHub Pages paths coherent. Validate builds with npm run check:seo and npm run check:links. Structured data must match visible verified content.

When suggesting copy, state the problem briefly, provide replacement and mark safe-to-apply versus artistic approval.


## Person entity disambiguation
The canonical artist entity is `https://mizukioyama.github.io/website/#person`.

Use the same identity consistently across structured data:
- name: `小山瑞樹`
- alternateName: `Mizuki Oyama`
- jobTitle: `Abstract Artist`
- official URL: `https://mizukioyama.github.io/website/`
- Biography and Artist Statement remain the canonical human-readable sources for biography and artistic intent.

Use `disambiguatingDescription` to describe the artist positively and concretely. Do not add negative statements such as "not a lawyer" to visible copy or JSON-LD.

Only confirmed identity profiles may appear in `sameAs`. Current confirmed URLs:
- `https://camp-fire.jp/profile/OyamaMizuki`
- `https://note.com/merry_ruff8755`
- `https://www.instagram.com/1998_m.oyama/`

Retired domains `oyama-artist-gallery.online` and `freelife-artist.com` must never be added to canonical, OGP, JSON-LD, sitemap or `sameAs`. They are retired permanently and should not receive new redirects or revival configuration.
