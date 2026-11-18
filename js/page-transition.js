/* Page transition (vertical tab panels).
 *
 * Plain browser navigation is kept as-is; this script only puts a
 * panel layer over the screen around it:
 *  - on an in-site link click, seven matte-iron panels slide in
 *    from the top and bottom edges (alternating), cover the
 *    screen, the destination page name appears, and the browser
 *    then navigates normally;
 *  - on the destination page, when (and only when) a
 *    sessionStorage flag says the visit came through that cover,
 *    the page starts covered by the same panels, which hold for a
 *    moment and then slide out through the opposite edge.
 * Direct landings, reloads and external arrivals never get a
 * layer. No SPA-style content swapping is performed.
 *
 * The first panel is a black brand panel. The other six carry a
 * framed print of an artwork (the site's own gallery images) on
 * an iron plate, with a file-tab spine on the right edge; each
 * tab is labelled with a page title instead of a number. A thin
 * fog film (soft light gradients, a fine noise texture and a 1px
 * backdrop blur) lies over the panels. All design values were
 * tuned and approved in a GUI preview (2026-11-18).
 *
 * The script runs in <head>, before <body> exists, so the overlay
 * is attached to <html> (it is position:fixed, so this is
 * equivalent). If anything goes wrong while building or animating
 * the layer, the navigation falls back to the plain browser one.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-page-transition";

  /* Motion (approved values; durations are for one panel). */
  var IN_MS = 560;
  var OUT_MS = 540;
  var STAGGER_MS = 55;
  var OUT_STAGGER_MS = 44;
  var HOLD_MS = 430;
  /* If navigation has still not happened this long after the
     cover should have finished, navigate anyway. */
  var NAV_FALLBACK_MS = 2800;
  /* Destination pages start the reveal on DOMContentLoaded, but
     do not wait longer than this. */
  var REVEAL_FALLBACK_MS = 1500;
  /* Hard cap: the landing layer is removed by then at the latest. */
  var EXIT_SAFETY_MS = 4500;

  /* Composition (approved values). */
  var WIDTHS = [20.5, 14, 14, 14, 14, 14, 14];
  var OVERLAP_PX = 40;
  var RIGHT_BAND_PX = 66;
  var BODY_W = 10; /* spine body width, px */
  var TAB_W = 10; /* tab protrusion width, px */
  var TAB_LEN = 25; /* tab length, % of panel height */
  var TAB_SHOULDER = 1.5; /* straight shoulder slope, % */
  var TAB_NOTCH = 0; /* concave fillet depth, % (0 = none) */
  var TAB_TOPS = [5, 15, 5, 15, 5, 15];
  var TAB_TITLES = [
    "ART INDEX",
    "ARTIST STATEMENT",
    "BIOGRAPHY",
    "INFORMATION",
    "ORDER",
    "CONTACT"
  ];
  var ARTWORKS = ["kagayaki", "kaien", "kouen", "kouka", "shinju", "souen"];
  var CHEKI_PX = 8; /* plate margin around the print */
  var NUM_SIZE = 10;
  var NUM_POS = 55; /* tab title anchor, px from the panel bottom area */
  var NUM_COLOR = "#232527";
  var BRAND_SIZE = 14;

  var PAGE_TITLES = {
    "": "TOP",
    "index.html": "TOP",
    "gallery.html": "ART INDEX",
    "artist-statement.html": "ARTIST STATEMENT",
    "biography.html": "BIOGRAPHY",
    "information.html": "INFORMATION",
    "order.html": "ORDER",
    "contact.html": "CONTACT",
    "policy.html": "POLICY"
  };

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    reduceMotion = false;
  }

  /* ---- Asset base (this script's own URL, so the artwork paths
     work from every page depth, including the 404 page). ---- */
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
  function artURL(name) {
    return base + "img/" + name + "-web.jpg";
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

  /* ---- Small helpers ---- */
  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }
  function easeOutExpo(x) {
    return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }
  function easeInCubic(x) {
    return x * x * x;
  }

  /* Matte iron: one horizontal gradient shared by every plate and
     spine, so the tab and its plate always read as one material.
     Lightness follows the approved brightness (0.81). */
  function ironGradient(vertical) {
    var l = 0.6 * 0.81 * 100;
    return (
      "linear-gradient(" +
      (vertical ? "180deg" : "90deg") +
      ", hsl(220, 4%, " +
      (l + 4).toFixed(1) +
      "%) 0%, hsl(220, 4%, " +
      l.toFixed(1) +
      "%) 55%, hsl(220, 4%, " +
      (l - 5).toFixed(1) +
      "%) 100%)"
    );
  }

  /* Spine outline for the stacked (portrait) layout: the desktop
     outline transposed — the spine runs along the bottom edge of
     each band, the tab protrudes downward, its left edge is the
     straight sloped shoulder and its right edge returns flat. */
  function spineClipH(zt, zr) {
    var by = (BODY_W / (BODY_W + TAB_W)) * 100;
    var sh = Math.min(TAB_SHOULDER, TAB_LEN / 3);
    var pts = [];
    pts.push("0% 0%");
    pts.push("100% 0%");
    pts.push("100% " + by.toFixed(1) + "%");
    pts.push(zr.toFixed(1) + "% " + by.toFixed(1) + "%");
    pts.push(zr.toFixed(1) + "% 100%");
    pts.push(zt.toFixed(1) + "% 100%");
    pts.push((zt - sh).toFixed(1) + "% " + by.toFixed(1) + "%");
    pts.push("0% " + by.toFixed(1) + "%");
    return "polygon(" + pts.join(", ") + ")";
  }

  /* Iron texture: large soft blotches plus a fine grain, drawn as
     one SVG turbulence tile (black alpha only, so it shades any
     iron colour the same way). */
  function noiseURI() {
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
      "<filter id='b'><feTurbulence type='fractalNoise' baseFrequency='0.011 0.017' numOctaves='3'/>" +
      "<feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0'/></filter>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2'/>" +
      "<feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter>" +
      "<rect width='300' height='300' filter='url(#b)'/>" +
      "<rect width='300' height='300' filter='url(#n)'/></svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  /* Spine outline: the tab leaves the body's right edge with a
     straight sloped shoulder at the top, its bottom edge is
     horizontal, and a concave fillet (depth TAB_NOTCH, 0 in the
     approved design) returns it to the body. Percentages are of
     the spine element (body + tab width, full height). */
  function spineClip(zt, zb) {
    var bx = (BODY_W / (BODY_W + TAB_W)) * 100;
    var sh = Math.min(TAB_SHOULDER, TAB_LEN / 3);
    var notchX = bx + TAB_NOTCH * 4;
    function pt(p) {
      return p[0].toFixed(1) + "% " + p[1].toFixed(1) + "%";
    }
    function qbez(p0, pc, p1, t) {
      var u = 1 - t;
      return [
        u * u * p0[0] + 2 * u * t * pc[0] + t * t * p1[0],
        u * u * p0[1] + 2 * u * t * pc[1] + t * t * p1[1]
      ];
    }
    var pts = [];
    pts.push("0% 0%");
    pts.push(bx.toFixed(1) + "% 0%");
    pts.push(bx.toFixed(1) + "% " + (zt - sh).toFixed(1) + "%");
    pts.push("100% " + zt + "%");
    pts.push("100% " + zb + "%");
    pts.push(notchX.toFixed(1) + "% " + zb + "%");
    var f0 = [notchX, zb];
    var fc = [notchX, zb + TAB_NOTCH];
    var f1 = [bx, zb + TAB_NOTCH];
    [0.3, 0.6].forEach(function (t) {
      pts.push(pt(qbez(f0, fc, f1, t)));
    });
    pts.push(bx.toFixed(1) + "% 100%");
    pts.push("0% 100%");
    return "polygon(" + pts.join(", ") + ")";
  }

  /* ---- Overlay construction ---- */
  var panels = [];
  var inners = [];
  var motionX = false; /* portrait: panels travel along X */
  var destEl = null;
  var destTextEl = null;
  var rafId = 0;
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

  function buildOverlay(destTitle) {
    removeOverlay();
    var overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.className = "page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var frameBg = document.createElement("div");
    frameBg.className = "pt-framebg";
    overlay.appendChild(frameBg);

    var W = window.innerWidth || 1024;
    var H = window.innerHeight || 768;
    var portrait = W <= 768;
    motionX = portrait;
    if (portrait) overlay.className += " pt-h";

    var wrap = document.createElement("div");
    wrap.className = portrait ? "pt-wrap pt-wrap-h" : "pt-wrap";
    overlay.appendChild(wrap);

    var grad = ironGradient(portrait);
    var tex = noiseURI();
    var wrapW = portrait ? H - RIGHT_BAND_PX : W - RIGHT_BAND_PX;
    var sumW = 0;
    var i;
    for (i = 0; i < WIDTHS.length; i++) sumW += WIDTHS[i];
    var sumPx = wrapW + OVERLAP_PX * (WIDTHS.length - 1);
    panels = [];
    inners = [];
    var left = 0;
    var photoIdx = 0;

    for (i = 0; i < WIDTHS.length; i++) {
      var colW = (sumPx * WIDTHS[i]) / sumW;
      var d = document.createElement("div");
      d.className = "pt-panel";
      if (portrait) {
        d.style.top = left + "px";
        d.style.height = colW + "px";
        d.style.left = "0px";
        d.style.width = "100%";
      } else {
        d.style.left = left + "px";
        d.style.width = colW + "px";
      }
      d.style.zIndex = WIDTHS.length - i; /* earlier panels on top */

      var plate = document.createElement("div");
      plate.className = "pt-plate";
      plate.style.background = grad;
      var ptex = document.createElement("div");
      ptex.className = "pt-tex";
      ptex.style.backgroundImage = tex;
      ptex.style.opacity = "1";
      plate.appendChild(ptex);
      d.appendChild(plate);

      var img = document.createElement("div");
      img.className = "pt-img";
      if (i === 0) {
        img.style.top = "0px";
        img.style.left = "0px";
        img.style.right = "0px";
        img.style.bottom = "0px";
        img.style.borderRadius = "0px";
        img.style.boxShadow = "none";
        var brand = document.createElement("div");
        brand.className = portrait ? "pt-brand pt-brand-h" : "pt-brand";
        brand.innerHTML =
          '<div class="pt-sub">From Nature, To Inspiration</div>' +
          '<div class="pt-name" style="font-size:' +
          BRAND_SIZE +
          'px">Mizuki Oyama</div>' +
          '<div class="pt-foot">ABSTRACT ARTIST — PORTFOLIO</div>';
        img.appendChild(brand);
        inners.push(null);
      } else {
        img.style.top = CHEKI_PX + "px";
        img.style.left = CHEKI_PX + "px";
        img.style.right = (portrait ? CHEKI_PX : BODY_W + CHEKI_PX) + "px";
        img.style.bottom = (portrait ? BODY_W + CHEKI_PX : CHEKI_PX) + "px";
        var inner = document.createElement("div");
        inner.className = "pt-inner";
        inner.style.backgroundImage = 'url("' + artURL(ARTWORKS[photoIdx]) + '")';
        img.appendChild(inner);
        inners.push(inner);

        var zt = TAB_TOPS[photoIdx];
        var zb = Math.min(96, zt + TAB_LEN);
        var title = TAB_TITLES[photoIdx] || "";
        var spine = document.createElement("div");
        var stex = document.createElement("div");
        stex.className = "pt-tex";
        stex.style.backgroundImage = tex;
        stex.style.opacity = "1";
        var num = document.createElement("div");
        if (portrait) {
          spine.className = "pt-spine-h";
          spine.style.height = BODY_W + TAB_W + "px";
          spine.style.bottom = -TAB_W + "px";
          spine.style.left = "0px";
          spine.style.width = "100%";
          spine.style.zIndex = 2;
          spine.style.background = grad;
          spine.style.clipPath = spineClipH(zt, zb);
          spine.appendChild(stex);
          num.className = "pt-num-h";
          num.textContent = title;
          num.style.left = "calc(" + zt + "% + 8px)";
          num.style.top = BODY_W - 2 + "px";
          num.style.fontSize = NUM_SIZE + "px";
          num.style.color = NUM_COLOR;
          spine.appendChild(num);
        } else {
          spine.className = "pt-spine";
          spine.style.width = BODY_W + TAB_W + "px";
          spine.style.right = -TAB_W + "px";
          spine.style.zIndex = 2;
          spine.style.background = grad;
          spine.style.clipPath = spineClip(zt, zb);
          spine.appendChild(stex);
          num.className = "pt-num";
          num.textContent = title;
          num.style.left = BODY_W - 1 + "px";
          num.style.width = Math.max(TAB_W + 2, 18) + "px";
          num.style.fontSize = NUM_SIZE + "px";
          num.style.color = NUM_COLOR;
          var titleH = title.length * NUM_SIZE * 1.18;
          var titleBottom = (zb / 100) * H - Math.max(4, NUM_POS - 43);
          num.style.top = Math.max(4, Math.round(titleBottom - titleH)) + "px";
          spine.appendChild(num);
        }
        d.appendChild(spine);
        photoIdx++;
      }
      d.appendChild(img);
      if (i > 0) {
        var shade = document.createElement("div");
        if (portrait) {
          shade.className = "pt-shade-h";
          shade.style.top = OVERLAP_PX + TAB_W + "px";
        } else {
          shade.className = "pt-shade";
          shade.style.left = OVERLAP_PX + "px";
        }
        d.appendChild(shade);
      }
      wrap.appendChild(d);
      panels.push(d);
      left += colW - OVERLAP_PX;
    }

    var fog = document.createElement("div");
    fog.className = "pt-fog";
    var fogTex = document.createElement("div");
    fogTex.className = "pt-fogtex";
    fogTex.style.backgroundImage = tex;
    fog.appendChild(fogTex);
    overlay.appendChild(fog);

    destEl = document.createElement("div");
    destEl.className = "pt-dest";
    destTextEl = document.createElement("div");
    destTextEl.textContent = destTitle || "";
    destEl.appendChild(destTextEl);
    overlay.appendChild(destEl);

    document.documentElement.appendChild(overlay);
    return overlay;
  }

  function setPanel(i, offsetPercent, innerOffset) {
    var fn = motionX ? "translateX" : "translateY";
    if (panels[i]) {
      panels[i].style.transform = fn + "(" + offsetPercent + "%)";
    }
    if (inners[i]) {
      inners[i].style.transform = fn + "(" + innerOffset + "px)";
    }
  }

  function removeOverlay() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    clearTimers();
    var overlay = document.getElementById("page-transition-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    panels = [];
    inners = [];
    destEl = null;
    destTextEl = null;
  }

  /* ---- Enter (leaving page): panels gather, then navigate ---- */
  var navigating = false;
  function startEnter(targetHref, destTitle) {
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
      buildOverlay(destTitle);
    } catch (error) {
      go();
      return;
    }
    var n = panels.length;
    var inTotal = IN_MS + (n - 1) * STAGGER_MS;
    var i;
    for (i = 0; i < n; i++) {
      setPanel(i, i % 2 === 0 ? -106 : 106, i % 2 === 0 ? 14 : -14);
    }
    if (destEl) destEl.style.opacity = "0";
    var t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var el = now - t0;
      for (var j = 0; j < n; j++) {
        var dir = j % 2 === 0 ? -1 : 1;
        var local = el - j * STAGGER_MS;
        if (local < 0) {
          setPanel(j, dir * 106, -dir * 14);
        } else if (local < IN_MS) {
          var p = easeOutExpo(local / IN_MS);
          setPanel(j, dir * 106 * (1 - p), -dir * 14 * (1 - p));
        } else {
          setPanel(j, 0, 0);
        }
      }
      if (destEl) {
        destEl.style.opacity = clamp01((el - inTotal + 60) / 240);
      }
      if (el >= inTotal) {
        rafId = 0;
        go();
        return;
      }
      rafId = window.requestAnimationFrame(step);
    }
    rafId = window.requestAnimationFrame(step);
    later(go, NAV_FALLBACK_MS);
  }

  /* ---- Exit (destination page): hold, then panels pass through ---- */
  function startExit() {
    var n = panels.length;
    if (!n) {
      removeOverlay();
      return;
    }
    if (destEl) destEl.style.opacity = "1";
    var outTotal = OUT_MS + (n - 1) * OUT_STAGGER_MS;
    var t0 = null;
    var startAt = null;
    function step(now) {
      if (t0 === null) t0 = now;
      if (startAt === null) {
        startAt = now + HOLD_MS;
      }
      var el = now - startAt;
      if (el >= 0) {
        for (var j = 0; j < n; j++) {
          var dir = j % 2 === 0 ? -1 : 1;
          var lo = el - j * OUT_STAGGER_MS;
          if (lo < 0) {
            setPanel(j, 0, 0);
          } else if (lo < OUT_MS) {
            var q = easeInCubic(lo / OUT_MS);
            setPanel(j, -dir * 106 * q, dir * 12 * q);
          } else {
            setPanel(j, -dir * 106, dir * 12);
          }
        }
        if (destEl) {
          destEl.style.opacity = 1 - clamp01((el + 40) / 200);
        }
      }
      if (el >= outTotal) {
        rafId = 0;
        removeOverlay();
        return;
      }
      rafId = window.requestAnimationFrame(step);
    }
    rafId = window.requestAnimationFrame(step);
    later(removeOverlay, EXIT_SAFETY_MS);
  }

  function titleFor(url, anchor) {
    var name = url.pathname.split("/").pop() || "";
    if (PAGE_TITLES.hasOwnProperty(name)) return PAGE_TITLES[name];
    if (anchor && anchor.textContent) {
      var t = anchor.textContent.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
      if (t && t.length <= 26) return t.toUpperCase();
    }
    return "";
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
    startEnter(url.href, titleFor(url, anchor));
  });

  /* Back/forward cache restore: never leave a layer behind. */
  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted) {
      navigating = false;
      removeOverlay();
    }
  });

  /* Preload the panel artwork quietly after the page has loaded,
     so a later click finds it in cache. */
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      ARTWORKS.forEach(function (name) {
        var im = new Image();
        im.src = artURL(name);
      });
    }, 1600);
  });

  /* ---- Landing: arrived through a cover, so start covered ---- */
  if (!reduceMotion && readFlag()) {
    clearFlag();
    try {
      var here = window.location.pathname.split("/").pop() || "";
      buildOverlay(PAGE_TITLES.hasOwnProperty(here) ? PAGE_TITLES[here] : "");
      var i;
      for (i = 0; i < panels.length; i++) setPanel(i, 0, 0);
      if (destEl) destEl.style.opacity = "1";
      var revealed = false;
      var reveal = function () {
        if (revealed) return;
        revealed = true;
        startExit();
      };
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        reveal();
      } else {
        document.addEventListener("DOMContentLoaded", reveal);
        later(reveal, REVEAL_FALLBACK_MS);
      }
    } catch (error) {
      removeOverlay();
    }
  }
})();
