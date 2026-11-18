/* ============================================================
   HRVR Digital Solutions — theme.js
   Loaded in <head> BEFORE the stylesheet render completes so
   the correct theme is applied on first paint (no flash).

   Priority: saved user choice > system preference > dark.
   This file intentionally does nothing DOM-heavy and exposes
   one global (window.HRVRTheme) used later by the toggle UI.
   ============================================================ */

(function () {
  "use strict";

  var THEME_KEY = "hrvr-theme";
  var root = document.documentElement;

  function getStoredTheme() {
    try {
      var t = window.localStorage.getItem(THEME_KEY);
      return t === "dark" || t === "light" ? t : null;
    } catch (err) {
      /* localStorage may be blocked (privacy mode) — fall through */
      return null;
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  var stored = getStoredTheme();
  var initialTheme = stored || getSystemTheme();
  applyTheme(initialTheme);

  // Expose a minimal API for the UI toggle (wired in interactions.js)
  window.HRVRTheme = {
    current: function () {
      return root.getAttribute("data-theme") === "light" ? "light" : "dark";
    },
    set: function (theme) {
      if (theme !== "dark" && theme !== "light") return;
      applyTheme(theme);
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (err) {
        /* non-fatal: preference just won't persist */
      }
      var toggle = document.getElementById("theme-toggle");
      if (toggle) {
        toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
        toggle.setAttribute(
          "aria-label",
          theme === "light" ? "Switch to dark theme" : "Switch to light theme"
        );
      }
    },
    toggle: function () {
      this.set(this.current() === "dark" ? "light" : "dark");
    },
  };
})();
