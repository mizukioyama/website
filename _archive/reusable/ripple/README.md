# Retired Ripple Background Assets — DO NOT DELETE

**DO NOT DELETE WITHOUT OWNER APPROVAL.** These files are intentionally retained for possible reuse on another website. They are not part of the current portfolio production runtime and are excluded from the production build.

## Contents and source identity

| Archived file | Former production path | SHA-256 |
| --- | --- | --- |
| `jquery.ripples-min.js` | `js/jquery.ripples-min.js` | `eb790b658284d3ba4960d81e19bd0fd668e079f9a4ae876078cbedfab2ef4b20` |
| `bg_wave.js` | `js/bg_wave.js` | `8aba9a345b9f70654d644e464851e11c0ac42882f51105b4b8c5b52c737b6109` |

The source bytes were archived unchanged on 2026-10-07. The Yurayura source previously referenced the same files through `../../js/`; the other six affected routes used `js/`.

## What the files do

- `jquery.ripples-min.js` is the jQuery Ripples WebGL plugin. It adds a `.jquery-ripples` class and a WebGL canvas to the target element, and uses animation frames, pointer/touch input, and resize handling.
- `bg_wave.js` initializes `div.ripples`, creates pointer-driven and timed random drops, and calls the plugin API.

## Dependencies and former mount

Load jQuery 3.7.1 first, then the plugin, then `bg_wave.js`. The plugin requires a browser with WebGL and the floating-point texture support it checks at initialization (`OES_texture_float`). A compatible CSS background layer is also required.

The former markup was:

```html
<div class="ripples"></div>
```

It appeared after the header container and before the VANTA background container. The former shared styles set the element to a fixed full-screen layer with a dark translucent background, `opacity: 0.25`, `z-index: 1`, and `pointer-events: none`; the mobile rule used `height: 100svh` at 599px and below. The plugin itself adds its canvas. These styles were removed from production CSS when the runtime was retired; restore an appropriate equivalent only in the destination site's visual system.

## Reuse / restoration

For another site, copy these two files to that site's chosen asset paths, load jQuery before the plugin and the initializer, add the mount element above, and recreate the required background styling. Update relative script URLs for the destination route. Validate WebGL support, resize behavior, interaction, reduced-motion behavior, and layer order in that site before release.

These files are not wired back into this portfolio. Restoring them here requires a separately reviewed change to the page markup, script loading, build configuration, CSS, and visual/runtime tests. Do not re-enable Ripple by toggling a background mode alone.

## Last retirement check

Retired on 2026-10-07. Before retirement, the source references existed on Biography, Artist Statement, Order, Contact, Policy, Information, and Yurayura. The active `selectedInkField` mode made `bg_wave.js` return before initializing the plugin, while the Ripple layer was hidden. The archived engine was not reactivated for a standalone visual test during retirement; this change verifies its absence from production requests and output, not the archived engine's current compatibility with browsers or another site's CSS.
