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
    if (!element || element.querySelector("canvas") || !window.VANTA || typeof window.VANTA.TRUNK !== "function") {
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
      color: 0xffffff,
      chaos: 2.50
    });
    startSphereTint(element, trunkInstance);
    return trunkInstance;
  }

  // Gradient tint for the sphere (Mizuki 2026-11-22): TRUNK
  // itself stays untouched (same rings, same animation,
  // drawn in white); after each frame the rings are tinted
  // in place with a radial gradient via source-atop, which
  // only paints where the rings already are.
  const TINT_STOPS = ["#caf0fe", "#006d8f", "#caf0fe"];
  let tintStop = null;

  function startSphereTint(element, instance) {
    let rafId = 0;
    let stopped = false;

    function tintWith(ctx, canvas) {
      if (stopped) return;
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;
      const radius = Math.min(w, h) * 0.27;
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radius);
      gradient.addColorStop(0, TINT_STOPS[0]);
      gradient.addColorStop(0.5, TINT_STOPS[1]);
      gradient.addColorStop(1, TINT_STOPS[2]);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    function arm(attempts) {
      if (stopped) return;
      const canvas = element.querySelector("canvas");
      const p5 = instance && instance.p5;
      if (canvas && p5 && typeof p5.registerMethod === "function") {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Runs after every p5 draw: guaranteed ordering.
        p5.registerMethod("post", function () { tintWith(ctx, canvas); });
        return;
      }
      if (attempts < 240) {
        rafId = window.requestAnimationFrame(function () { arm(attempts + 1); });
      }
    }
    arm(0);
    tintStop = function () {
      stopped = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
    };
  }

  function destroyTrunkSphere() {
    if (tintStop) {
      tintStop();
      tintStop = null;
    }
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
