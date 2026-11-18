/* ============================================================
   HRVR Digital Solutions — main.js
   Single entry point: initializes every module in dependency
   order. Modules expose init() on window.HRVR* namespaces.
   ============================================================ */

(function () {
  "use strict";

  function boot() {
    var modules = [
      window.HRVRNavigation,
      window.HRVRAnimations,
      window.HRVRInteractions,
      // contact.js and validation.js self-initialize on load;
      // theme.js has already applied the theme in <head>.
    ];

    modules.forEach(function (mod) {
      if (mod && typeof mod.init === "function") {
        try {
          mod.init();
        } catch (err) {
          // One failing module must not break the rest of the page.
          if (window.console && window.console.error) {
            window.console.error("HRVR module failed to initialize:", err);
          }
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
