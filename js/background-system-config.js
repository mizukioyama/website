(function configurePortfolioBackground() {
  "use strict";

  // Rollback switch: set to "legacy" to resume the existing Ripple / VANTA initializers.
  const backgroundMode = "selectedInkField";
  window.__PORTFOLIO_BACKGROUND_SYSTEM__ = backgroundMode;

  if (backgroundMode === "selectedInkField") {
    document.documentElement.classList.add("selected-ink-field-mode");
  }
})();
