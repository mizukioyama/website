/* Page transition (fog).
 *
 * Plain browser navigation is kept as-is; this script only puts a
 * fog layer over the screen around it:
 *  - on an in-site link click, fog gathers in from all four edges
 *    of the frame — left, right, top and bottom — until the
 *    screen is covered, and the browser then navigates normally;
 *  - on the destination page, when (and only when) a
 *    sessionStorage flag says the visit came through that cover,
 *    the page starts covered by the same fog, holds for a moment,
 *    and the fog then streams back out to the four edges and is
 *    gone.
 * Direct landings, reloads and external arrivals never get a
 * layer. No SPA-style content swapping is performed.
 *
 * The fog is the same material as the entry gate's background
 * (js/gate-fog.js): cloud sprites in three depths built from one
 * neutral fog photograph and a neutral wash underneath. Only
 * the driver differs — the gate loops gently at 15% density,
 * while the transition runs between clear and full cover.
 * The slide panels of the previous design are gone (2026-11-27,
 * at the artist's request).
 *
 * Motion is compositor-driven: the three depth layers are
 * painted once at their full-cover pose and then moved purely
 * with CSS transitions (opacity and transform), which the
 * browser's compositor animates at the display's refresh rate
 * without touching the main thread. The earlier engine redrew
 * about seventy large sprites on a canvas every frame; on a
 * slow phone that ran at a few frames per second and the fog
 * brightened and cleared in visible steps — a flicker, as the
 * artist reported from a screen recording (2026-11-27).
 *
 * The script runs in <head>, before <body> exists, so the overlay
 * is attached to <html> (it is position:fixed, so this is
 * equivalent). If anything goes wrong while building or animating
 * the layer, the navigation falls back to the plain browser one.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-page-transition";

  /* Motion. */
  var COVER_MS = 1050; /* fog gathers from the edges to full cover */
  var REVEAL_MS = 1050; /* fog streams back out to the edges */
  var HOLD_MS = 260; /* pause at full cover after landing */
  /* If navigation has still not happened this long after the
     cover should have finished, navigate anyway. */
  var NAV_FALLBACK_MS = 2800;
  /* Destination pages start the reveal once the page is parsed
     and its sprites are built, but do not wait longer than
     this. */
  var REVEAL_FALLBACK_MS = 1500;
  /* Hard cap: the landing layer is removed by then at the latest. */
  var EXIT_SAFETY_MS = 4500;
  /* Fog front lag: a particle's gather starts later the nearer it
     sits to the centre (0 at an edge, FRONT_LAG at the centre),
     so the fog visibly closes in from all four sides. */
  var FRONT_LAG = 0.5;
  /* Peak strength of the neutral wash at full cover. */
  var WASH_PEAK = 0.88;

  /* The layers are static paintings of soft cloud texture;
     device pixels beyond 1:1 buy nothing and only make the
     compositor move larger textures. */
  var MAX_DPR = 1.0;
  /* Neutral fog wash colour (no tint). */
  var WASH = "46,46,46";
  /* The flat cover colour, brightness-matched to the average
     of the textured cover as it appears on the artist's phone
     screen (measured from his screen recordings: the textured
     cover reads about 77.5, an earlier flat of 70 read 72.7,
     so the flat is set to 75). The flat state appears at every
     navigation boundary — the landing page's first frames, and
     the leaving page's last frame after the texture crossfade
     — so if it differs from the textured cover, the swap reads
     as a blink. */
  var FLAT = "75,75,75";

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    reduceMotion = false;
  }

  /* ---- Asset base (this script's own URL, so the same-origin
     path check works from every page depth, including 404). ---- */
  var base = "";
  try {
    var cs = document.currentScript;
    if (cs && cs.src) {
      base = cs.src.replace(/js\/page-transition\.js(?:[?#].*)?$/, "");
    }
  } catch (error) {
    base = "";
  }
  var basePath = "/";
  try {
    basePath = new URL(base || "/", window.location.href).pathname;
  } catch (error) {
    basePath = "/";
  }

  /* ---- Session flag ---- */
  function readFlag() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }
  function setFlag() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (error) {
      /* Storage unavailable: navigate without a flag. */
    }
  }
  function clearFlag() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* Nothing to clear. */
    }
  }

  /* ---- Fog engine (same material as js/gate-fog.js) ---- */
  var FOG_TEX_URL = "data:image/jpeg;base64,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";

  var fogSprites = null;

  function buildSprites(img) {
    var S = 384;
    /* Charcoal tones only (deep charcoal, chosen 2026-11-27):
       strip every trace of colour, lift the contrast gently,
       then remap the grey into the charcoal range 24..96 so the
       cloud shading survives as a dark veil. The remap is
       pointwise, so it runs ONCE on the source photo here and
       every sprite below just slices the result with drawImage.
       Running it per sprite (6 x 384x384 pixel passes) blocked
       the main thread for hundreds of milliseconds on a slow
       phone — long enough to freeze the fog animation into a
       few bright steps, which reads as flicker. */
    var srcC = document.createElement("canvas");
    srcC.width = img.width;
    srcC.height = img.height;
    var sg = srcC.getContext("2d");
    if (!sg) {
      return null;
    }
    sg.drawImage(img, 0, 0);
    try {
      var sid = sg.getImageData(0, 0, srcC.width, srcC.height);
      var sd = sid.data;
      for (var p = 0; p < sd.length; p += 4) {
        var lum = 0.2126 * sd[p] + 0.7152 * sd[p + 1] + 0.0722 * sd[p + 2];
        lum = (lum - 128) * 1.06 + 136;
        lum = lum < 0 ? 0 : lum > 255 ? 255 : lum;
        var v = Math.round(24 + (lum / 255) * 72);
        sd[p] = v;
        sd[p + 1] = v;
        sd[p + 2] = v;
      }
      sg.putImageData(sid, 0, 0);
    } catch (error) {
      /* If pixels are unreachable, the colour original still works. */
    }
    var sprites = [];
    for (var i = 0; i < 6; i++) {
      var c = document.createElement("canvas");
      c.width = S;
      c.height = S;
      var g = c.getContext("2d");
      if (!g) {
        return null;
      }
      var sw = img.width * (0.42 + Math.random() * 0.2);
      var sh = img.height * (0.42 + Math.random() * 0.2);
      var sx = Math.random() * Math.max(1, img.width - sw);
      var sy = Math.random() * Math.max(1, img.height - sh);
      g.drawImage(srcC, sx, sy, sw, sh, 0, 0, S, S);
      /* Irregular soft edge: two offset radial masks multiplied. */
      g.globalCompositeOperation = "destination-in";
      var grad = g.createRadialGradient(S / 2, S / 2, S * 0.06, S / 2, S / 2, S * 0.5);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.55, "rgba(0,0,0,0.88)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, S, S);
      var ox = (Math.random() - 0.5) * S * 0.3;
      var oy = (Math.random() - 0.5) * S * 0.3;
      var grad2 = g.createRadialGradient(S / 2 + ox, S / 2 + oy, S * 0.05, S / 2 + ox, S / 2 + oy, S * 0.46);
      grad2.addColorStop(0, "rgba(0,0,0,1)");
      grad2.addColorStop(0.7, "rgba(0,0,0,0.9)");
      grad2.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad2;
      g.fillRect(0, 0, S, S);
      g.globalCompositeOperation = "source-over";
      sprites.push(c);
    }
    return sprites;
  }

  var spritesSettled = false;
  var onSpritesSettled = null;
  function settleSprites() {
    if (spritesSettled) return;
    spritesSettled = true;
    if (onSpritesSettled) {
      var cb = onSpritesSettled;
      onSpritesSettled = null;
      cb();
    }
  }
  if (FOG_TEX_URL && !reduceMotion) {
    var fogImg = new Image();
    fogImg.onload = function () {
      try {
        fogSprites = buildSprites(fogImg);
      } catch (error) {
        fogSprites = null;
      }
      settleSprites();
    };
    fogImg.onerror = function () {
      settleSprites();
    };
    fogImg.src = FOG_TEX_URL;
  } else {
    spritesSettled = true;
  }

  /* Three depths. Sizes are fractions of the viewport width, drift
     is px/s at DPR 1, opacity is the per-particle ceiling. */
  var LAYERS = [
    { count: 16, sizeMin: 0.9, sizeMax: 1.5, drift: 6, opacity: 0.50, wander: 16 },
    { count: 24, sizeMin: 0.5, sizeMax: 0.9, drift: 12, opacity: 0.62, wander: 11 },
    { count: 30, sizeMin: 0.2, sizeMax: 0.45, drift: 21, opacity: 0.50, wander: 7 }
  ];

  /* One fog field. Every particle knows its distance from the
     nearest edge (0 at an edge, 1 at the centre) and its inward
     direction (from that edge toward the centre, blended with the
     direction to the centre point so corners flow diagonally). */
  function makeField(w, h) {
    var small = w < 700;
    var pxScale = w / Math.max(1, window.innerWidth || w);
    function edgeInfo(x, y) {
      var ex = Math.min(x, w - x) / (w / 2);
      var ey = Math.min(y, h - y) / (h / 2);
      var edgeDist = Math.min(ex, ey);
      var inx = 0;
      var iny = 0;
      if (ex <= ey) {
        inx = x <= w / 2 ? 1 : -1;
      } else {
        iny = y <= h / 2 ? 1 : -1;
      }
      var cx = w / 2 - x;
      var cy = h / 2 - y;
      var cl = Math.sqrt(cx * cx + cy * cy) || 1;
      inx = inx * 0.65 + (cx / cl) * 0.35;
      iny = iny * 0.65 + (cy / cl) * 0.35;
      var il = Math.sqrt(inx * inx + iny * iny) || 1;
      return { edgeDist: edgeDist, edgePx: Math.min(x, w - x, y, h - y), inx: inx / il, iny: iny / il };
    }
    var parts = [];
    for (var li = 0; li < LAYERS.length; li++) {
      var layer = LAYERS[li];
      var n = small ? Math.round(layer.count * 0.62) : layer.count;
      for (var i = 0; i < n; i++) {
        var x = Math.random() * w;
        var y = Math.random() * h;
        var ei = edgeInfo(x, y);
        parts.push({
          li: li,
          x: x,
          y: y,
          size: (layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin)) * w,
          spr: Math.floor(Math.random() * 6),
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.05,
          drift: layer.drift * (0.7 + Math.random() * 0.6),
          opacity: layer.opacity * (0.7 + Math.random() * 0.5),
          edgeDist: ei.edgeDist,
          edgePx: ei.edgePx,
          inx: ei.inx,
          iny: ei.iny,
          travel: (30 + Math.random() * 52) * pxScale,
          delay: ei.edgeDist * FRONT_LAG + Math.random() * 0.05,
          ph1: Math.random() * Math.PI * 2,
          ph2: Math.random() * Math.PI * 2,
          f1: 0.25 + Math.random() * 0.3,
          f2: 0.7 + Math.random() * 0.6,
          wander: layer.wander * (0.7 + Math.random() * 0.6) * pxScale,
          breathPh: Math.random() * Math.PI * 2
        });
      }
    }
    return { parts: parts };
  }

  /* ---- Overlay: static layers, compositor-driven motion ---- */
  var fog = null; /* { overlay, flat, wash, layers, ctxs, field, painted, w, h } */
  var safetyTimers = [];

  function later(fn, ms) {
    var id = window.setTimeout(fn, ms);
    safetyTimers.push(id);
    return id;
  }
  function clearTimers() {
    safetyTimers.forEach(function (id) {
      window.clearTimeout(id);
    });
    safetyTimers = [];
  }

  /* One easing for every fog motion: a slow start, a smooth
     middle and a soft settle, approximating the viscous ease
     the frame engine used. */
  var EASE = "cubic-bezier(0.65, 0, 0.25, 1)";
  function setTransition(el, dur, delay) {
    el.style.transition =
      "opacity " + dur + "ms " + EASE + " " + delay + "ms, " +
      "transform " + dur + "ms " + EASE + " " + delay + "ms";
  }

  /* Layer motion. For the cover each depth starts slightly
     spread and off-axis and settles into place as it fades in,
     so the fog reads as gathering from all four sides; for the
     reveal the depths drift back outward while dissolving.
     Delays stagger the depths so they do not move as one slab. */
  var COVER_FROM = [
    "translate(-1.5%, 1%) scale(1.05)",
    "translate(2%, -1%) scale(1.07)",
    "translate(-2%, -1.5%) scale(1.04)"
  ];
  var REVEAL_TO = [
    "translate(2.5%, -1.5%) scale(1.13)",
    "translate(-3%, 2%) scale(1.15)",
    "translate(1.5%, 2.5%) scale(1.10)"
  ];
  var LAYER_DELAY = [0, 80, 160];

  /* ---- Frame contour, baked into the layers ----
     The fog must stay inside the site frame's inner contour.
     That used to be a CSS mask on the overlay, but a mask makes
     the browser re-rasterise the whole overlay on every frame
     of an animation — on the artist's phone both fog engines
     (per-frame canvas, then CSS transitions) presented only
     about seven frames per second, a visible flicker, and the
     mask was the one expensive piece they shared. So the
     contour (the same arc-sampled paths the mask used) is now
     painted into each layer itself: solids are filled only
     inside it, and the texture layers have everything outside
     it erased once, before any motion starts. The animated
     stack then needs no mask at all. */
  var CONTOURS = [
    { maxW: 767, w: 390, h: 844, d: "M375.5 821.5L377.6 821.2L379.5 820.4L381.2 819.2L382.4 817.5L383.2 815.6L383.5 813.5L383.5 559.4L383.2 557.3L382.4 555.4L381.2 553.7L379.5 552.5L377.6 551.7L375.5 551.4L376.6 551.4L373.8 551.0L371.1 549.9L368.8 548.2L367.1 545.9L366.0 543.2L365.6 540.4L365.6 33.5L365.2 30.7L364.1 28.0L362.4 25.7L360.1 24.0L357.4 22.9L354.6 22.5L20.5 22.5L16.9 23.0L13.5 24.4L10.6 26.6L8.4 29.5L7.0 32.9L6.5 36.5L6.5 682.2L6.8 684.3L7.6 686.2L8.8 687.9L10.5 689.1L12.4 689.9L14.5 690.2L13.4 690.2L16.2 690.6L18.9 691.7L21.2 693.4L22.9 695.7L24.0 698.4L24.4 701.2L24.4 810.5L24.8 813.3L25.9 816.0L27.6 818.3L29.9 820.0L32.6 821.1L35.4 821.5Z" },
    { maxW: 1199, w: 800, h: 1280, d: "M778.7 1245.9L780.8 1245.6L782.7 1244.8L784.4 1243.6L785.6 1241.9L786.4 1240.0L786.7 1237.9L786.7 853.3L786.1 848.9L784.4 844.8L781.7 841.3L778.2 838.6L774.1 836.9L769.7 836.3L772.0 836.3L766.3 835.6L761.0 833.4L756.4 829.9L752.9 825.3L750.7 820.0L750.0 814.3L750.0 56.1L749.3 50.4L747.1 45.1L743.6 40.5L739.0 37.0L733.7 34.8L728.0 34.1L27.3 34.1L23.7 34.6L20.3 36.0L17.4 38.2L15.2 41.1L13.8 44.5L13.3 48.1L13.3 1029.8L13.9 1034.2L15.6 1038.3L18.3 1041.8L21.8 1044.5L25.9 1046.2L30.3 1046.8L28.0 1046.8L33.7 1047.5L39.0 1049.7L43.6 1053.2L47.1 1057.8L49.3 1063.1L50.0 1068.8L50.0 1223.9L50.7 1229.6L52.9 1234.9L56.4 1239.5L61.0 1243.0L66.3 1245.2L72.0 1245.9Z", portrait: true },
    { maxW: Infinity, w: 1440, h: 900, d: "M1408.0 876.0L1410.1 875.7L1412.0 874.9L1413.7 873.7L1414.9 872.0L1415.7 870.1L1416.0 868.0L1416.0 618.0L1415.0 610.2L1412.0 603.0L1407.2 596.8L1401.0 592.0L1393.8 589.0L1386.0 588.0L1390.0 588.0L1379.6 586.6L1370.0 582.6L1361.7 576.3L1355.4 568.0L1351.4 558.4L1350.0 548.0L1350.0 64.0L1348.6 53.6L1344.6 44.0L1338.3 35.7L1330.0 29.4L1320.4 25.4L1310.0 24.0L38.0 24.0L34.4 24.5L31.0 25.9L28.1 28.1L25.9 31.0L24.5 34.4L24.0 38.0L24.0 706.0L25.0 713.8L28.0 721.0L32.8 727.2L39.0 732.0L46.2 735.0L54.0 736.0L50.0 736.0L60.4 737.4L70.0 741.4L78.3 747.7L84.6 756.0L88.6 765.6L90.0 776.0L90.0 836.0L91.4 846.4L95.4 856.0L101.7 864.3L110.0 870.6L119.6 874.6L130.0 876.0Z" }
  ];
  function contourFor(vw, vh) {
    for (var i = 0; i < CONTOURS.length; i++) {
      var c = CONTOURS[i];
      if (vw <= c.maxW && (!c.portrait || vh > vw)) {
        return c;
      }
    }
    return CONTOURS[CONTOURS.length - 1];
  }
  /* Run fn with the context transformed so the contour's
     viewBox units map onto this canvas. */
  function withContour(f, ctx, fn) {
    ctx.save();
    ctx.setTransform(f.w / f.contour.w, 0, 0, f.h / f.contour.h, 0, 0);
    fn(new Path2D(f.contour.d));
    ctx.restore();
  }
  function fillContour(f, ctx, color) {
    withContour(f, ctx, function (path) {
      ctx.fillStyle = color;
      ctx.fill(path);
    });
  }
  function eraseOutsideContour(f, ctx) {
    withContour(f, ctx, function (path) {
      var outer = new Path2D();
      outer.rect(0, 0, f.contour.w, f.contour.h);
      outer.addPath(path);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill(outer, "evenodd");
    });
  }

  function buildOverlay() {
    removeOverlay();
    var overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.className = "page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    var cw = Math.max(1, Math.round((window.innerWidth || 1024) * dpr));
    var ch = Math.max(1, Math.round((window.innerHeight || 768) * dpr));
    function makeCanvas(cls) {
      var canvas = document.createElement("canvas");
      canvas.className = cls;
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.opacity = "0";
      var ctx = null;
      try {
        ctx = canvas.getContext("2d");
      } catch (error) {
        ctx = null;
      }
      overlay.appendChild(canvas);
      return { el: canvas, ctx: ctx };
    }
    /* Flat layer: the brightness-matched solid cover, painted
       only inside the frame contour. A painted canvas is the
       landing page's guarantee that the page underneath is
       never seen uncovered: it is part of the overlay's very
       first frame. */
    var flatC = makeCanvas("pt-flat");
    /* Wash layer: the deep base tone under the cloud texture. */
    var washC = makeCanvas("pt-wash");
    var layers = [];
    var ctxs = [];
    for (var i = 0; i < 3; i++) {
      var lc = makeCanvas("ft-canvas");
      layers.push(lc.el);
      ctxs.push(lc.ctx);
    }
    document.documentElement.appendChild(overlay);
    fog = {
      overlay: overlay, flat: flatC.el, wash: washC.el,
      flatCtx: flatC.ctx, washCtx: washC.ctx,
      layers: layers, ctxs: ctxs,
      field: null, painted: false, solidsPainted: false,
      w: cw, h: ch,
      contour: contourFor(window.innerWidth || 1024, window.innerHeight || 768)
    };
    paintSolids();
    return overlay;
  }

  function removeOverlay() {
    clearTimers();
    /* The landing backing (see the landing block) must never
       outlive the overlay, whatever path removes it. */
    document.documentElement.style.background = "";
    var overlay = document.getElementById("page-transition-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    fog = null;
  }

  /* Paint the two solid layers (flat cover colour, wash)
     inside the frame contour. Done once, at build time. */
  function paintSolids() {
    if (!fog || fog.solidsPainted) {
      return;
    }
    if (fog.flatCtx) {
      fillContour(fog, fog.flatCtx, "rgb(" + FLAT + ")");
    }
    if (fog.washCtx) {
      fillContour(fog, fog.washCtx, "rgb(" + WASH + ")");
    }
    fog.solidsPainted = true;
  }

  /* Paint the three depth layers once, at the pose the old
     per-frame engine reached at full cover: every particle at
     its base position, full size and full alpha, over a
     transparent ground (the wash layer sits beneath). */
  function paintLayers() {
    if (!fog || fog.painted || !fogSprites) {
      return;
    }
    if (!fog.field) {
      fog.field = makeField(fog.w, fog.h);
    }
    var parts = fog.field.parts;
    for (var li = 0; li < 3; li++) {
      var ctx = fog.ctxs[li];
      if (!ctx) {
        continue;
      }
      ctx.clearRect(0, 0, fog.w, fog.h);
      for (var i = 0; i < parts.length; i++) {
        var pt = parts[i];
        if (pt.li !== li) {
          continue;
        }
        var sz = pt.size * 1.06;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        ctx.globalAlpha = Math.min(1, pt.opacity);
        ctx.drawImage(fogSprites[pt.spr % fogSprites.length], -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      /* Keep this depth inside the frame, once and for all. */
      eraseOutsideContour(fog, ctx);
    }
    fog.painted = true;
  }

  /* ---- Enter (leaving page): fog gathers, then navigate ---- */
  var navigating = false;
  function startEnter(targetHref) {
    if (navigating) return;
    navigating = true;
    var navigated = false;
    function go() {
      if (navigated) return;
      navigated = true;
      setFlag();
      window.location.href = targetHref;
    }
    try {
      buildOverlay();
      paintLayers();
    } catch (error) {
      go();
      return;
    }
    if (!fog) {
      go();
      return;
    }
    var i;
    if (fog.painted) {
      for (i = 0; i < 3; i++) {
        fog.layers[i].style.transform = COVER_FROM[i];
      }
      /* Commit the initial states, then transition into the
         covered state: the wash rises underneath and the three
         depths stagger in, all finishing together. */
      void fog.overlay.offsetWidth;
      setTransition(fog.wash, COVER_MS, 0);
      fog.wash.style.opacity = String(WASH_PEAK);
      for (i = 0; i < 3; i++) {
        setTransition(fog.layers[i], COVER_MS - LAYER_DELAY[i], LAYER_DELAY[i]);
        fog.layers[i].style.opacity = "1";
        fog.layers[i].style.transform = "none";
      }
    } else {
      /* No cloud texture (its image failed): cover with the
         flat layer alone (it is already the flat colour, and
         already clipped to the frame). */
      void fog.overlay.offsetWidth;
      setTransition(fog.flat, COVER_MS, 0);
      fog.flat.style.opacity = "1";
    }
    later(go, COVER_MS + 40);
    later(go, NAV_FALLBACK_MS);
  }

  /* ---- Exit (destination page): crossfade in, hold, clear ---- */
  function revealMotion() {
    if (!fog) {
      return;
    }
    /* The wash lifts last, so the texture thins first and the
       centre of the page breathes open before the base tone
       goes. */
    setTransition(fog.wash, REVEAL_MS, 150);
    fog.wash.style.opacity = "0";
    setTransition(fog.flat, REVEAL_MS, 150);
    fog.flat.style.opacity = "0";
    for (var i = 0; i < 3; i++) {
      setTransition(fog.layers[i], REVEAL_MS, i * 70);
      fog.layers[i].style.opacity = "0";
      fog.layers[i].style.transform = REVEAL_TO[i];
    }
    later(removeOverlay, REVEAL_MS + 400);
  }

  function startReveal() {
    if (!fog) {
      removeOverlay();
      return;
    }
    later(removeOverlay, EXIT_SAFETY_MS);
    var hasTex = false;
    try {
      paintLayers();
      hasTex = fog.painted;
    } catch (error) {
      hasTex = false;
    }
    if (hasTex) {
      /* Crossfade the flat start into the textured cover: the
         wash and the depth layers fade in OVER the flat layer,
         which stays at full opacity underneath until the
         reveal. (Fading the flat out at the same time made the
         composite dip about ten points below both endpoints
         mid-crossfade — a pulse in the landing, measured from
         the artist's recording.) Once the texture stack is at
         full cover the flat contributes nothing, and
         revealMotion fades it away with everything else. */
      var XFADE_MS = 400;
      setTransition(fog.wash, XFADE_MS, 0);
      fog.wash.style.opacity = String(WASH_PEAK);
      for (var i = 0; i < 3; i++) {
        setTransition(fog.layers[i], XFADE_MS, i * 60);
        fog.layers[i].style.opacity = "1";
      }
      later(revealMotion, XFADE_MS + HOLD_MS);
    } else {
      /* No texture: the flat layer already IS the whole cover
         at full opacity; revealMotion fades it directly. */
      later(revealMotion, HOLD_MS);
    }
  }

  /* ---- Click interception ---- */
  document.addEventListener("click", function (ev) {
    if (reduceMotion || navigating) return;
    if (ev.defaultPrevented || ev.button !== 0) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var node = ev.target;
    var anchor =
      node && node.closest ? node.closest("a[href]") : null;
    if (!anchor) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;
    var href = anchor.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return;
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname.indexOf(basePath) !== 0) return;
    if (!/(\.html|\/)$/.test(url.pathname)) return;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return; /* same page: let the browser handle any hash change */
    }
    ev.preventDefault();
    startEnter(url.href);
  });

  /* Back/forward cache restore: never leave a layer behind. */
  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted) {
      navigating = false;
      removeOverlay();
    }
  });

  /* ---- Landing: arrived through the fog, so start covered ---- */
  if (!reduceMotion && readFlag()) {
    clearFlag();
    try {
      buildOverlay();
      /* Start covered by the flat colour, so the page is never
         seen uncovered from the very first paint: the flat
         layer is painted into the overlay synchronously as it
         is built, and the root background (the same colour)
         backs the whole viewport until the overlay itself is
         presented — on slow phones the page's own first paint
         could otherwise win the race and flash through. The
         colour matches the covered average of the textured
         fog, so the swap between pages has no brightness
         step. */
      document.documentElement.style.background = "rgb(" + FLAT + ")";
      fog.flat.style.opacity = "1";
      var revealed = false;
      var domReady = false;
      var reveal = function () {
        if (revealed) return;
        revealed = true;
        startReveal();
      };
      /* Start the reveal only when the page is parsed AND the
         cloud sprites are built, so the sprite build (a visible
         main-thread block on slow phones) happens during the
         static hold instead of cutting into the moving reveal.
         The reveal itself then waits for a calm beat — two
         animation frames or a short timer, whichever comes
         first — so heavy destination-page initialisation
         (deferred scripts run before DOMContentLoaded, WebGL
         setup on the TOP page) also finishes in the hold: a
         timer cannot fire while the thread is jammed, and
         frames only flow once it is responsive. The fallback
         timer still caps the total wait. */
      var calmQueued = false;
      var tryReveal = function () {
        if (!domReady || !spritesSettled || revealed || calmQueued) return;
        calmQueued = true;
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(reveal);
        });
        later(reveal, 120);
      };
      onSpritesSettled = tryReveal;
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        domReady = true;
        tryReveal();
      } else {
        document.addEventListener("DOMContentLoaded", function () {
          domReady = true;
          tryReveal();
        });
      }
      later(reveal, REVEAL_FALLBACK_MS);
    } catch (error) {
      removeOverlay();
    }
  }
})();
