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
    return trunkInstance;
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
    window.addEventListener("pagehide", cleanup);
    window.addEventListener("pageshow", restoreAfterBackForwardCache);
    addMotionListener();
  }
})();
