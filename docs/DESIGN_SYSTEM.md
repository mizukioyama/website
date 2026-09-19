# Design System and Motion Policy

## Direction
A restrained artist portfolio. Artwork, space, typography and pacing carry the experience. UI decoration is subordinate.

## Guardrails
Keep hierarchy simple. Reuse existing patterns. Preserve whitespace unless it harms usability. Avoid generic SaaS styling and excessive cards, shadows, gradients, badges or simultaneous effects. When tables are appropriate, follow the established Biography table language. When process/steps are appropriate, follow the established 1-5 flow language near the Statement.

## Responsive
Design for content, not fixed devices. No horizontal text scrolling. Artwork remains appreciable without destabilizing layout. Controls stay touch-usable.

## Motion hierarchy
Home/hero: atmospheric, slow motion may reinforce the artistic world without delaying content.
Gallery: artwork primary; subtle reveal/hover/transition only.
Biography/Statement: reading primary; static or restrained reveal.
Information: motion clarifies hierarchy/current items, not every block.
Order: motion may clarify progression; CTA/pricing/conditions remain stable.
Navigation/controls: fast predictable state feedback.

## Animation decision
Before adding motion answer: purpose; whether motion is simplest; whether CSS can replace a heavy library; mobile smoothness; LCP/CLS/INP impact; reduced-motion behavior. If unclear, do not add it.

Avoid loading Three.js, p5, Vanta or similar solely for a minor effect. Pause/disable hidden/offscreen continuous animation where feasible.

Any shared spacing, typography, navigation, breakpoint, image-size or animation change requires before/after visual verification.
