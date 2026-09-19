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

## Performance
Balance perceived speed and artwork quality. Optimize dimensions/formats/loading and unnecessary JS/render blocking. Animation libraries must justify their cost. Target good Core Web Vitals without degrading artwork solely for synthetic scores.

## SEO
Every indexable page needs a unique descriptive title, useful description, canonical, logical H1/headings, crawlable internal links and appropriate alt text. Keep sitemap, robots, canonical and OG coherent. Structured data must accurately represent visible content.

## Design changes
Preserve established brand character unless redesign is requested. Reuse existing spacing, typography, table and flow patterns where equivalent components exist.

## Error recovery and broken-link defense
Use two layers of protection. First, deployment checks must detect broken internal HTML/CSS/JavaScript references before release. Second, GitHub Pages must have a custom `404.html` fallback that clearly remains a 404 experience and offers Home, Gallery and Information recovery links.

The 404 page is not indexable and must not appear in the sitemap. Do not auto-redirect unknown URLs to Home. Because this is a GitHub Project Pages site, 404-local assets and rescue links must resolve under the `/website/` base path even when the missing requested URL is deeply nested.

## Technical source policy
The repository contains root source-like files and a docs/ deployment/build tree. Confirm build/deploy mapping before editing. Prefer source files and regenerate output through the established build. Do not hand-edit duplicated generated files as a shortcut.
