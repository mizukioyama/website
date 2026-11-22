(function configurePortfolioBackground() {
  "use strict";

  const html = document.documentElement;
  // Primary background and optional page accents remain independently controlled.
  // Set to "legacy" to restore the previous Ripple/VANTA background path.
  const backgroundMode = "selectedInkField";
  window.__PORTFOLIO_BACKGROUND_SYSTEM__ = backgroundMode;

  if (backgroundMode === "selectedInkField") {
    html.classList.add("selected-ink-field-mode");
  }

  const existingAccents = window.__PORTFOLIO_BACKGROUND_ACCENTS__;
  if (existingAccents && existingAccents.version === 1) return;

  const hasTrunkSphereProfile = html.dataset.backgroundAccent === "trunkSphere";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let trunkInstance = null;
  let motionListenerCleanup = null;

  function mountTrunkSphere() {
    const mode = window.__PORTFOLIO_BACKGROUND_SYSTEM__;
    if (!hasTrunkSphereProfile || (mode !== "selectedInkField" && mode !== "legacy")) return null;
    if (mode === "selectedInkField" && reducedMotion.matches) return null;
    if (trunkInstance) return trunkInstance;

    const element = document.querySelector("#vanta-bg-bio");
    if (!element || element.querySelector("canvas")) {
      return null;
    }

    // Gradient rings (Mizuki 2026-11-22): VANTA TRUNK only
    // supports a single colour, so the sphere is drawn by a
    // small canvas renderer whose rings take the gradient
    // stops #caf0fe -> #006d8f -> #caf0fe from centre to rim.
    trunkInstance = mountGradientSphere(element);
    if (trunkInstance) return trunkInstance;

    if (!window.VANTA || typeof window.VANTA.TRUNK !== "function") {
      return null;
    }
    trunkInstance = window.VANTA.TRUNK({
      el: "#vanta-bg-bio",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 0.70,
      color: 0x006d8f,
      chaos: 2.50
    });
    return trunkInstance;
  }

  const SPHERE_STOPS = ["#caf0fe", "#006d8f", "#caf0fe"].map(function (hex) {
    const n = hex.slice(1);
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  });

  function sphereColour(frac) {
    const t = Math.min(1, Math.max(0, frac)) * (SPHERE_STOPS.length - 1);
    const i = Math.min(SPHERE_STOPS.length - 2, Math.floor(t));
    const f = t - i;
    const a = SPHERE_STOPS[i];
    const b = SPHERE_STOPS[i + 1];
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * f) + "," + Math.round(a[1] + (b[1] - a[1]) * f) + "," + Math.round(a[2] + (b[2] - a[2]) * f) + ")";
  }

  function mountGradientSphere(element) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return null;
    element.appendChild(canvas);

    let rafId = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.max(0.75, Math.min(window.devicePixelRatio || 1, window.innerWidth <= 768 ? 1.05 : 1.35));
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      if (destroyed) return;
      context.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.49;
      const maxR = Math.min(width, height) * 0.34;
      const step = Math.max(8, Math.min(width, height) * 0.0095);
      context.lineWidth = 1.2;
      context.globalAlpha = 0.85;
      for (let r = step; r < maxR; r += step) {
        const amp = 1.5 + (r / maxR) * 7;
        context.strokeStyle = sphereColour(r / maxR);
        context.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.05) {
          const wob = Math.sin(a * 3 + now * 0.00016 + r * 0.045) * amp * 0.6
            + Math.sin(a * 7 - now * 0.00011 + r * 0.11) * amp * 0.3
            + Math.sin(a * 13 + now * 0.00007 + r * 0.21) * amp * 0.18;
          const rr = r + wob;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr;
          if (a === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    }

    function onVisibility() {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!destroyed && !rafId) {
        rafId = window.requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = window.requestAnimationFrame(draw);

    return {
      mode: "canvas2d",
      destroy: function () {
        destroyed = true;
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.remove();
      }
    };
  }

  function destroyTrunkSphere() {
    const instance = trunkInstance;
    trunkInstance = null;
    if (instance && typeof instance.destroy === "function") instance.destroy();
  }

  function onMotionPreferenceChange(event) {
    if (window.__PORTFOLIO_BACKGROUND_SYSTEM__ !== "selectedInkField") return;
    if (event.matches) destroyTrunkSphere();
    else mountTrunkSphere();
  }

  function addMotionListener() {
    if (!hasTrunkSphereProfile || motionListenerCleanup) return;
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", onMotionPreferenceChange);
      motionListenerCleanup = function () { reducedMotion.removeEventListener("change", onMotionPreferenceChange); };
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(onMotionPreferenceChange);
      motionListenerCleanup = function () { reducedMotion.removeListener(onMotionPreferenceChange); };
    }
  }

  function cleanup() {
    destroyTrunkSphere();
    if (motionListenerCleanup) {
      motionListenerCleanup();
      motionListenerCleanup = null;
    }
  }

  function restoreAfterBackForwardCache(event) {
    if (!event.persisted) return;
    addMotionListener();
    if (!reducedMotion.matches) mountTrunkSphere();
  }

  const accents = {
    version: 1,
    mountTrunkSphere: mountTrunkSphere,
    destroyTrunkSphere: destroyTrunkSphere,
    cleanup: cleanup,
    getTrunkSphereInstance: function () { return trunkInstance; }
  };
  window.__PORTFOLIO_BACKGROUND_ACCENTS__ = accents;

  if (hasTrunkSphereProfile) {
    document.addEventListener("DOMContentLoaded", mountTrunkSphere, { once: true });
    window.addEventListener("pagehide", cleanup);
    window.addEventListener("pageshow", restoreAfterBackForwardCache);
    addMotionListener();
  }
})();
