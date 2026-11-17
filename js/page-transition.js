/* Page transition (liquid).
 *
 * Plain browser navigation is kept as-is; this script only puts a
 * liquid layer over the screen around it:
 *  - on an in-site link click, liquid spreads radially from the click
 *    point (about 700ms) and the browser then navigates normally;
 *  - on the destination page, when (and only when) a sessionStorage
 *    flag says the visit came through that cover, the page starts
 *    covered in still-flowing liquid, which then drains downward
 *    (about 750ms) and is gone.
 * Direct landings, reloads and external arrivals never get a layer.
 * No SPA-style content swapping is performed.
 *
 * The liquid is drawn by a small raw-WebGL fragment shader (no
 * library): a noise-warped front with a meniscus highlight, leading
 * droplets that merge into the body, thickness shading (thin film is
 * pale and slightly translucent, thick parts are deep), caustic-like
 * shimmer and specular streaks, all kept flowing by domain-warped
 * fbm. If WebGL is unavailable the previous flat fade is used, so a
 * transition always happens. The context is released as soon as the
 * animation ends.
 *
 * The script runs in <head>, before <body> exists, so the overlay is
 * attached to <html> (it is position:fixed, so this is equivalent).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-page-transition";
  var COVER_MS = 700;
  var REVEAL_MS = 750;
  /* Flat-fallback timings (used only when WebGL is unavailable). */
  var FADE_IN_MS = 380;
  var FADE_OUT_MS = 500;
  /* If navigation has still not happened this long after the cover
     finished, uncover the page again so it can never be left unusable. */
  var FALLBACK_MS = 3000;
  /* Destination pages start the reveal on DOMContentLoaded, but do
     not wait longer than this if parsing is held up by other scripts. */
  var REVEAL_FALLBACK_MS = 1500;
  var MAX_DPR = 1.5;

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    reduceMotion = false;
  }

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
      /* Storage unavailable (private mode etc.): navigate without a flag. */
    }
  }

  function clearFlag() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* Nothing to clear. */
    }
  }

  /* ---- Overlay element (shared by the liquid and flat paths) ---- */

  function getOverlay() {
    var overlay = document.getElementById("page-transition-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "page-transition-overlay";
      overlay.className = "page-transition-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.appendChild(overlay);
    }
    return overlay;
  }

  function removeOverlay() {
    stopLiquid();
    var overlay = document.getElementById("page-transition-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  /* ---- WebGL liquid renderer ---- */

  var VERT_SRC = [
    "attribute vec2 a_pos;",
    "void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  var FRAG_SRC = [
    "precision highp float;",
    "uniform vec2 u_res;",
    "uniform float u_time;",
    "uniform float u_progress;",
    "uniform float u_mode;", /* 0: cover (radial), 1: reveal (drain) */
    "uniform vec2 u_origin;", /* unit space, y up */
    "uniform float u_maxdist;",
    "",
    "float hash(vec2 p) {",
    "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
    "}",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
    "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);",
    "}",
    "float fbm(vec2 p) {",
    "  float v = 0.0;",
    "  float a = 0.5;",
    "  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);",
    "  for (int i = 0; i < 4; i++) {",
    "    v += a * noise(p);",
    "    p = rot * p * 2.0;",
    "    a *= 0.5;",
    "  }",
    "  return v;",
    "}",
    "float smin(float a, float b, float k) {",
    "  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);",
    "  return mix(b, a, h) - k * h * (1.0 - h);",
    "}",
    "",
    "void main() {",
    "  vec2 uv = gl_FragCoord.xy / u_res;",
    "  float aspect = u_res.x / u_res.y;",
    "  vec2 p = vec2(uv.x * aspect, uv.y);",
    "  float t = u_time;",
    "",
    "  /* Internal flow: domain-warped fbm, always moving slowly. */",
    "  vec2 flowP = p * 2.2;",
    "  float warp = fbm(flowP + vec2(t * 0.05, -t * 0.03));",
    "  float flow = fbm(flowP + warp * 1.4 + vec2(-t * 0.04, t * 0.02));",
    "",
    "  float d = 1.0; /* signed distance-ish: negative inside the liquid */",
    "  if (u_mode < 0.5) {",
    "    /* Cover: a front spreading radially from the click point. */",
    "    vec2 o = vec2(u_origin.x * aspect, u_origin.y);",
    "    float dist = length(p - o);",
    "    float ang = atan(p.y - o.y, p.x - o.x);",
    "    float edge = (fbm(vec2(cos(ang), sin(ang)) * 1.6 + vec2(t * 0.06, 0.0)) - 0.5) * 0.16",
    "               + (noise(p * 5.0 + t * 0.15) - 0.5) * 0.05;",
    "    float radius = u_progress * (u_maxdist + 0.25);",
    "    /* Edge noise lives only near the front, so the interior",
    "       thickness does not turn into radial spokes. */",
    "    float band = smoothstep(0.5, 0.05, abs(dist - radius));",
    "    d = dist - radius + edge * min(radius * 1.5, 1.0) * band;",
    "    /* Droplets running ahead of the front, merging back into it. */",
    "    for (int i = 0; i < 6; i++) {",
    "      float fi = float(i);",
    "      float seed = hash(vec2(fi, 7.0));",
    "      float a2 = seed * 6.2831 + fi * 1.047 + sin(t * 0.4 + fi) * 0.15;",
    "      float lead = radius * (1.02 + 0.05 * sin(t * 0.7 + fi * 1.7)) + 0.03 * seed;",
    "      vec2 c = o + vec2(cos(a2), sin(a2)) * lead;",
    "      float dr = (0.018 + 0.02 * hash(vec2(fi, 3.0)))",
    "               * (1.0 - smoothstep(0.92, 1.0, u_progress));",
    "      if (dr > 0.001) {",
    "        d = smin(d, length(p - c) - dr, 0.06);",
    "      }",
    "    }",
    "  } else {",
    "    /* Reveal: the surface level sinks, draining the liquid down. */",
    "    float level = mix(1.25, -0.3, u_progress);",
    "    float wob = (fbm(vec2(p.x * 2.4, t * 0.08)) - 0.5) * 0.14",
    "              + (noise(vec2(p.x * 9.0, t * 0.25)) - 0.5) * 0.03;",
    "    d = uv.y - (level + wob);",
    "    /* Drops detach from the front and fall ahead of it. */",
    "    float dropGate = smoothstep(0.01, 0.06, u_progress)",
    "                   * (1.0 - smoothstep(0.94, 1.0, u_progress));",
    "    if (dropGate > 0.001) {",
    "      for (int i = 0; i < 6; i++) {",
    "        float fi = float(i);",
    "        float seed = hash(vec2(fi, 11.0));",
    "        float seed2 = hash(vec2(fi, 23.0));",
    "        float cycle = fract(u_progress * (1.0 + 0.3 * seed) + seed * 7.0);",
    "        float x = (0.08 + 0.84 * seed2) * aspect + sin(t * 0.8 + fi * 2.1) * 0.006;",
    "        /* Drops sit on the revealed side above the surface,",
    "           fall toward it and merge back into the body. */",
    "        float y = level + 0.02 + (1.0 - cycle) * (1.0 - cycle) * (0.12 + 0.18 * seed);",
    "        float dr = (0.020 + 0.022 * seed) * (0.7 + 0.3 * cycle)",
    "                 * smoothstep(0.0, 0.12, cycle) * dropGate;",
    "        if (dr > 0.001) {",
    "          d = smin(d, length(p - vec2(x, y)) - dr, 0.05);",
    "        }",
    "      }",
    "    }",
    "  }",
    "",
    "  float aa = 1.5 / u_res.y;",
    "  float cover = 1.0 - smoothstep(-aa, aa, d);",
    "  if (cover <= 0.003) {",
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);",
    "    return;",
    "  }",
    "",
    "  /* Thickness: deeper inside reads thicker; the flow varies it. */",
    "  float thickness = clamp(-d * 2.2, 0.0, 1.0);",
    "  thickness = pow(thickness, 0.75);",
    "  thickness = clamp(thickness * (0.55 + 0.75 * flow), 0.0, 1.0);",
    "",
    "  vec3 thinCol = vec3(0.808, 0.867, 0.902); /* #cedde6 */",
    "  vec3 deepCol = mix(vec3(0.200, 0.259, 0.306), /* #33424e */",
    "                     vec3(0.180, 0.180, 0.180), /* #2e2e2e */",
    "                     flow * 0.6);",
    "  vec3 col = mix(thinCol, deepCol, thickness);",
    "",
    "  /* Caustic-like shimmer drifting with the flow. */",
    "  float caust = pow(fbm(p * 5.0 + flow * 2.0 - t * 0.06), 3.0);",
    "  col += vec3(0.90, 0.97, 1.00) * caust * (0.10 + 0.30 * thickness);",
    "",
    "  /* Specular streaks sliding along the flow. */",
    "  float spec = smoothstep(0.75, 0.95,",
    "    noise(vec2(p.x * 3.0 + flow * 3.0 - t * 0.12, p.y * 14.0)));",
    "  col += vec3(1.0) * spec * 0.12;",
    "",
    "  /* Meniscus: a bright rim just inside the edge (surface tension). */",
    "  float meniscus = smoothstep(-0.060, -0.015, d)",
    "                 * (1.0 - smoothstep(-0.015, 0.0, d));",
    "  col = mix(col, vec3(0.957, 0.965, 0.976), meniscus * 0.45);",
    "",
    "  float alpha = cover * mix(0.86, 1.0, thickness) * mix(0.80, 1.0, thickness);",
    "  gl_FragColor = vec4(col, alpha);",
    "}"
  ].join("\n");

  var liquid = null; /* { gl, canvas, ext, raf } */

  function compileShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /* Creates the canvas + context inside the overlay. Returns false
     when WebGL is unavailable, so callers can use the flat fade. */
  function startLiquid(overlay) {
    var canvas = document.createElement("canvas");
    canvas.className = "page-transition-canvas";
    canvas.setAttribute("aria-hidden", "true");
    overlay.appendChild(canvas);

    var gl = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power"
      }) || canvas.getContext("experimental-webgl");
    } catch (error) {
      gl = null;
    }
    if (!gl) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return false;
    }

    var vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    var frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    var prog = vert && frag ? gl.createProgram() : null;
    if (!prog) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return false;
    }
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return false;
    }
    gl.useProgram(prog);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    var loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));

    liquid = {
      gl: gl,
      canvas: canvas,
      ext: gl.getExtension("WEBGL_lose_context"),
      raf: 0,
      u: {
        res: gl.getUniformLocation(prog, "u_res"),
        time: gl.getUniformLocation(prog, "u_time"),
        progress: gl.getUniformLocation(prog, "u_progress"),
        mode: gl.getUniformLocation(prog, "u_mode"),
        origin: gl.getUniformLocation(prog, "u_origin"),
        maxdist: gl.getUniformLocation(prog, "u_maxdist")
      }
    };
    overlay.classList.add("is-liquid");
    return true;
  }

  function drawLiquid(mode, progress, originX, originY, timeSec) {
    if (!liquid) {
      return;
    }
    var gl = liquid.gl;
    gl.viewport(0, 0, liquid.canvas.width, liquid.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(liquid.u.res, liquid.canvas.width, liquid.canvas.height);
    gl.uniform1f(liquid.u.time, timeSec);
    gl.uniform1f(liquid.u.progress, progress);
    gl.uniform1f(liquid.u.mode, mode);
    gl.uniform2f(liquid.u.origin, originX, originY);
    /* Farthest corner distance in aspect space, from the origin. */
    var aspect = window.innerWidth / Math.max(1, window.innerHeight);
    var ox = originX * aspect;
    var oy = originY;
    var maxd = 0;
    var corners = [[0, 0], [aspect, 0], [0, 1], [aspect, 1]];
    for (var i = 0; i < corners.length; i++) {
      var dx = corners[i][0] - ox;
      var dy = corners[i][1] - oy;
      maxd = Math.max(maxd, Math.sqrt(dx * dx + dy * dy));
    }
    gl.uniform1f(liquid.u.maxdist, maxd);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function stopLiquid() {
    if (!liquid) {
      return;
    }
    if (liquid.raf) {
      window.cancelAnimationFrame(liquid.raf);
    }
    if (liquid.ext) {
      try {
        liquid.ext.loseContext();
      } catch (error) {
        /* Already gone. */
      }
    }
    liquid = null;
  }

  /* Viscous ease-out: fast spread, then a slight overshoot that
     settles back — no visible bounce. */
  function easeOutViscous(t) {
    var base = 1 - Math.pow(1 - t, 3);
    var overshoot = Math.sin(Math.PI * Math.min(t * 1.12, 1)) * 0.025 * (1 - t);
    return base + overshoot;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* Runs a liquid animation; onDone fires once at the end. The
     origin is only used by the cover (radial) mode. */
  var liquidOrigin = { x: 0.5, y: 0.5 };

  function animateLiquid(mode, durationMs, easeFn, onDone) {
    var start = null;
    var finished = false;
    function frame(now) {
      if (!liquid) {
        return;
      }
      if (start === null) {
        start = now;
      }
      var raw = Math.min((now - start) / durationMs, 1);
      drawLiquid(mode, easeFn(raw), liquidOrigin.x, liquidOrigin.y, now / 1000);
      if (raw < 1) {
        liquid.raf = window.requestAnimationFrame(frame);
      } else if (!finished) {
        finished = true;
        onDone();
      }
    }
    liquid.raf = window.requestAnimationFrame(frame);
  }

  /* ---- Destination side: reveal when arrived via a transition ---- */

  var revealStarted = false;

  function revealFlat(overlay) {
    if (revealStarted) {
      return;
    }
    revealStarted = true;
    if (!overlay) {
      return;
    }
    /* Double rAF so the covered state is painted before fading. */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        overlay.classList.remove("is-covered");
        overlay.classList.add("is-fading-out");
        window.setTimeout(removeOverlay, FADE_OUT_MS + 100);
      });
    });
  }

  function startReveal() {
    if (revealStarted) {
      return;
    }
    var overlay = document.getElementById("page-transition-overlay");
    if (!overlay) {
      revealStarted = true;
      return;
    }
    if (overlay.classList.contains("is-liquid")) {
      revealStarted = true;
      liquidOrigin = { x: 0.5, y: 0.5 };
      animateLiquid(1, REVEAL_MS, easeInOutCubic, function () {
        removeOverlay();
      });
      /* Absolute safety net: never stay covered. */
      window.setTimeout(removeOverlay, REVEAL_MS + 1200);
    } else {
      revealFlat(overlay);
    }
  }

  if (!reduceMotion && readFlag()) {
    /* Consume the flag at once, so a reload does not replay it. */
    clearFlag();
    var destOverlay = getOverlay();
    var liquidOk = false;
    try {
      liquidOk = startLiquid(destOverlay);
    } catch (error) {
      liquidOk = false;
    }
    if (liquidOk) {
      destOverlay.style.pointerEvents = "all";
      /* Paint the covered, flowing liquid at once, before <body>. */
      drawLiquid(1, 0, 0.5, 0.5, performance.now() / 1000);
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startReveal);
        window.setTimeout(startReveal, REVEAL_FALLBACK_MS);
      } else {
        startReveal();
      }
      /* Absolute safety net: never stay covered. */
      window.setTimeout(removeOverlay, REVEAL_FALLBACK_MS + REVEAL_MS + 2000);
    } else {
      destOverlay.classList.add("is-covered");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          revealFlat(destOverlay);
        });
        window.setTimeout(function () {
          revealFlat(destOverlay);
        }, REVEAL_FALLBACK_MS);
      } else {
        revealFlat(destOverlay);
      }
      window.setTimeout(removeOverlay, REVEAL_FALLBACK_MS + FADE_OUT_MS + 2000);
    }
  } else {
    clearFlag();
  }

  /* ---- Back/forward cache: never come back to a covered page ---- */

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      clearFlag();
      removeOverlay();
    }
  });

  /* ---- Leaving side: cover, then navigate normally ---- */

  var navigating = false;

  function isEligibleLink(anchor, event) {
    if (event.defaultPrevented) {
      return false;
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }
    if (!anchor || anchor.tagName !== "A") {
      return false;
    }
    var target = anchor.getAttribute("target");
    if (target && target.toLowerCase() !== "_self") {
      return false;
    }
    if (anchor.hasAttribute("download")) {
      return false;
    }
    var rawHref = anchor.getAttribute("href");
    if (!rawHref) {
      return false;
    }
    var url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (error) {
      return false;
    }
    /* Covers mailto:, tel:, javascript: and any non-web scheme. */
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    if (url.origin !== window.location.origin) {
      return false;
    }
    /* Same-page anchors and hash-only jumps stay instant. */
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    ) {
      return false;
    }
    return true;
  }

  document.addEventListener("click", function (event) {
    if (navigating || reduceMotion) {
      return;
    }
    var anchor = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!isEligibleLink(anchor, event)) {
      return;
    }

    var destination = anchor.href;
    event.preventDefault();
    navigating = true;
    setFlag();

    /* Click point as the liquid origin; keyboard clicks report
       (0, 0), which falls back to the screen centre. The shader
       works with y up, so the client y is flipped. */
    var originX = 0.5;
    var originY = 0.5;
    if (event.clientX > 0 || event.clientY > 0) {
      originX = event.clientX / Math.max(1, window.innerWidth);
      originY = 1 - event.clientY / Math.max(1, window.innerHeight);
    }

    var overlay = getOverlay();
    var liquidOk = false;
    try {
      liquidOk = startLiquid(overlay);
    } catch (error) {
      liquidOk = false;
    }

    if (liquidOk) {
      overlay.style.pointerEvents = "all";
      liquidOrigin = { x: originX, y: originY };
      var navigated = false;
      var go = function () {
        if (navigated) {
          return;
        }
        navigated = true;
        window.location.href = destination;
      };
      animateLiquid(0, COVER_MS, easeOutViscous, go);
      /* If rAF stalls, still navigate shortly after the cover time. */
      window.setTimeout(go, COVER_MS + 400);
      /* Fallback: if the navigation did not happen, uncover again. */
      window.setTimeout(function () {
        if (!navigating || navigated) {
          return;
        }
        navigating = false;
        clearFlag();
        removeOverlay();
      }, COVER_MS + FALLBACK_MS);
    } else {
      /* Flat fallback: the previous plain fade. */
      window.requestAnimationFrame(function () {
        overlay.classList.add("is-fading-in");
      });
      window.setTimeout(function () {
        window.location.href = destination;
      }, FADE_IN_MS);
      window.setTimeout(function () {
        if (!navigating) {
          return;
        }
        navigating = false;
        clearFlag();
        overlay.classList.remove("is-fading-in");
        overlay.classList.add("is-fading-out");
        window.setTimeout(removeOverlay, FADE_OUT_MS + 100);
      }, FADE_IN_MS + FALLBACK_MS);
    }
  });
})();
