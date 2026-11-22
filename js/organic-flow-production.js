(function mountOrganicFlowProduction() {
  "use strict";

  const SHOWCASE_WEIGHTS = Object.freeze({
    contour: 20,
    ribbons: 20,
    currents: 20,
    atmosphere: 20,
    "hybrid-random": 20
  });
  const HYBRID_BASE = Object.freeze({ contour: 40, ribbons: 25, currents: 15, atmosphere: 20 });
  const LAST_VARIANT_KEY = "portfolioOrganicFlow:lastShowcaseVariant:v1";
  const validChoices = ["contour", "ribbons", "currents", "atmosphere", "hybrid-random"];
  let selectedChoice = null;
  let selectedContributions = null;
  let instance = null;
  let status = "initializing";

  function readLastChoice() {
    try {
      const value = window.sessionStorage.getItem(LAST_VARIANT_KEY);
      return validChoices.includes(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function rememberChoice(value) {
    try {
      window.sessionStorage.setItem(LAST_VARIANT_KEY, value);
    } catch (error) {
      // Storage can be unavailable in private or restricted browsing contexts.
    }
  }

  function chooseNext() {
    const engine = window.OrganicFlow;
    if (!engine || typeof engine.chooseShowcaseVariant !== "function") return "contour";
    return engine.chooseShowcaseVariant(SHOWCASE_WEIGHTS, Math.random(), readLastChoice());
  }

  function mount(choice, contributions, remember) {
    if (instance) return instance;
    const engine = window.OrganicFlow;
    const overlay = document.getElementById("portfolio-overlay-animation");
    if (!engine || typeof engine.create !== "function" || !overlay) {
      status = "unavailable";
      return null;
    }

    const nextChoice = validChoices.includes(choice) ? choice : chooseNext();
    const isHybridRandom = nextChoice === "hybrid-random";
    const nextContributions = isHybridRandom
      ? { ...(contributions || HYBRID_BASE) }
      : { ...HYBRID_BASE };
    const canvas = document.createElement("canvas");

    try {
      const nextInstance = engine.create(canvas, window, null, {
        settings: { ...engine.DEFAULTS, lineCount: 80, lineWidth: 2.0, opacity: 0.40, color: "#006d8f", colors: ["#caf0fe", "#006d8f", "#caf0fe"], shadowBlur: 7, shadowAlpha: 0.6 },
        variant: isHybridRandom ? "contour" : nextChoice,
        mode: isHybridRandom ? "hybrid" : "manual",
        hybridContributions: nextContributions
      });
      if (!nextInstance) {
        canvas.remove();
        status = "unavailable";
        return null;
      }
      instance = nextInstance;
      selectedChoice = nextChoice;
      selectedContributions = nextContributions;
      overlay.dataset.organicFlowVariant = selectedChoice;
      status = "active";
      if (remember) rememberChoice(selectedChoice);
      if (document.hidden) instance.pause();
      return instance;
    } catch (error) {
      canvas.remove();
      status = "unavailable";
      return null;
    }
  }

  function getState() {
    return {
      status,
      variant: selectedChoice,
      hybridContributions: selectedContributions ? { ...selectedContributions } : null,
      lastVariant: readLastChoice(),
      sessionStorageKey: LAST_VARIANT_KEY,
      canvasCount: document.querySelectorAll("#portfolio-overlay-animation .organic-flow-canvas").length,
      engine: instance ? instance.snapshot() : null
    };
  }

  Object.defineProperty(window, "__organicFlowProduction", {
    configurable: false,
    enumerable: false,
    value: Object.freeze({ getState })
  });

  // Fixed by Mizuki (2026-11-22): hybrid mix with tuned
  // settings (lineCount 80, lineWidth 2.0, opacity 0.40,
  // gradient #caf0fe -> #006d8f -> #caf0fe). No per-load
  // random choice any more.
  const initialChoice = "hybrid-random";
  const initialMix = { ...HYBRID_BASE };
  mount(initialChoice, initialMix, false);

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    if (instance) instance.destroy();
    instance = null;
    mount(selectedChoice, selectedContributions, false);
  });

  document.addEventListener("visibilitychange", () => {
    if (!instance) return;
    if (document.hidden) instance.pause();
    else instance.resume();
  });
})();
