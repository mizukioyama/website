/* Page transition (fog fade).
 *
 * Plain browser navigation is kept as-is; this script only puts an
 * opaque layer over the screen around it:
 *  - on an in-site link click, the layer fades in (380ms) and the
 *    browser then navigates normally;
 *  - on the destination page, when (and only when) a sessionStorage
 *    flag says the visit came through that fade, the page starts
 *    covered and the layer fades out (500ms).
 * Direct landings, reloads and external arrivals never get a layer.
 * No SPA-style content swapping is performed.
 *
 * The script runs in <head>, before <body> exists, so the overlay is
 * attached to <html> (it is position:fixed, so this is equivalent).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-page-transition";
  var FADE_IN_MS = 380;
  var FADE_OUT_MS = 500;
  /* If navigation has still not happened this long after the click,
     uncover the page again so it can never be left unusable. */
  var FALLBACK_MS = 3000;
  /* Destination pages start the fade-out on DOMContentLoaded, but do
     not wait longer than this if parsing is held up by other scripts. */
  var REVEAL_FALLBACK_MS = 1500;

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
    var overlay = document.getElementById("page-transition-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  /* ---- Destination side: reveal when arrived via a transition ---- */

  var revealStarted = false;

  function reveal() {
    if (revealStarted) {
      return;
    }
    revealStarted = true;
    var overlay = document.getElementById("page-transition-overlay");
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

  if (!reduceMotion && readFlag()) {
    /* Consume the flag at once, so a reload does not replay the fade. */
    clearFlag();
    getOverlay().classList.add("is-covered");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", reveal);
      window.setTimeout(reveal, REVEAL_FALLBACK_MS);
    } else {
      reveal();
    }
    /* Absolute safety net: never stay covered. */
    window.setTimeout(removeOverlay, REVEAL_FALLBACK_MS + FADE_OUT_MS + 2000);
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

    var overlay = getOverlay();
    /* Paint the transparent state first so the fade actually runs. */
    window.requestAnimationFrame(function () {
      overlay.classList.add("is-fading-in");
    });

    window.setTimeout(function () {
      window.location.href = destination;
    }, FADE_IN_MS);

    /* Fallback: if the navigation did not happen, uncover again. */
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
  });
})();
