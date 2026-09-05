/**
 * Footer initialization is integrated into menu.js.
 * This compatibility shim avoids duplicate rendering if an older page still
 * includes this file during a staged update.
 */
if (typeof initializeFooter === "function") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeFooter, { once: true });
  } else {
    initializeFooter();
  }
}
