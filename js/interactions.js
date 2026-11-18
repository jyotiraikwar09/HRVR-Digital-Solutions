/* ============================================================
   HRVR Digital Solutions — interactions.js
   Theme toggle UI, portfolio details modal, toast notifications,
   scroll-to-top control. Uses event delegation where practical
   and only textContent/createElement for dynamic content.
   ============================================================ */

(function () {
  "use strict";

  var themeToggle = document.getElementById("theme-toggle");
  var modal = document.getElementById("project-modal");
  var modalTitle = document.getElementById("project-modal-title");
  var modalStatus = document.getElementById("project-modal-status");
  var modalTech = document.getElementById("project-modal-tech");
  var modalClose = document.getElementById("project-modal-close");
  var scrollTopBtn = document.getElementById("scroll-top");
  var toastRegion = document.getElementById("toast-region");
  var lastFocusedTrigger = null;

  /* ---------- theme toggle ---------- */
  function syncToggleState() {
    if (!themeToggle || !window.HRVRTheme) return;
    var isLight = window.HRVRTheme.current() === "light";
    themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  function initThemeToggle() {
    syncToggleState();
    if (!themeToggle) return;
    themeToggle.addEventListener("click", function () {
      // brief transition class for smooth cross-fade of theme colors
      document.documentElement.classList.add("theme-transition");
      window.setTimeout(function () {
        document.documentElement.classList.remove("theme-transition");
      }, 320);
      if (window.HRVRTheme) window.HRVRTheme.toggle();
      syncToggleState();
    });
  }

  /* ---------- portfolio modal ---------- */
  function parseProjectData(card) {
    try {
      return JSON.parse(card.getAttribute("data-project") || "{}");
    } catch (err) {
      return null; // malformed data is ignored, never injected
    }
  }

  function fillModal(data) {
    if (!modalTitle || !modalStatus || !modalTech) return;
    modalTitle.textContent = typeof data.title === "string" ? data.title : "Project";

    var statusText = typeof data.status === "string" ? data.status : "Unknown";
    modalStatus.textContent = "Status: " + statusText;
    modalStatus.className =
      "project-modal__status status " +
      (statusText === "Completed" ? "status--done" : "status--progress");

    // Rebuild the tech list with createElement + textContent only.
    modalTech.textContent = "";
    if (Array.isArray(data.tech)) {
      data.tech.forEach(function (tech) {
        if (typeof tech !== "string") return;
        var li = document.createElement("li");
        li.className = "badge";
        li.textContent = tech;
        modalTech.appendChild(li);
      });
    }
  }

  function openModal(card) {
    if (!modal || typeof modal.show !== "function") return;
    var data = parseProjectData(card);
    if (!data) return;
    fillModal(data);
    lastFocusedTrigger = card.querySelector("[data-project-details]") || card;
    modal.showModal();
  }

  function closeModal() {
    if (!modal || modal.open === false) return;
    modal.close();
  }

  function initModal() {
    if (!modal) return;

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-project-details]");
      if (trigger) {
        var card = trigger.closest(".project-card");
        if (card) openModal(card);
        return;
      }
      if (event.target.closest("[data-modal-close-link]")) {
        closeModal(); // "DM me" link inside modal navigates to #contact
      }
    });

    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    // Native <dialog> handles Escape + backdrop focus for free;
    // clicking the dark overlay area also closes it.
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    modal.addEventListener("close", function () {
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
        lastFocusedTrigger.focus();
      }
    });
  }

  /* ---------- toasts ---------- */
  function showToast(message, kind) {
    if (!toastRegion) return;
    var toast = document.createElement("div");
    toast.className = "toast" + (kind === "success" || kind === "error" ? " toast--" + kind : "");
    toast.textContent = message; // textContent only — XSS-safe
    toastRegion.appendChild(toast);

    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () {
        if (toast.parentNode === toastRegion) {
          toastRegion.removeChild(toast);
        }
      }, 300);
    }, 4200);
  }

  /* ---------- scroll to top ---------- */
  function initScrollTop() {
    if (!scrollTopBtn) return;

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          scrollTopBtn.hidden = window.scrollY < 600;
          ticking = false;
        });
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initInteractions() {
    initThemeToggle();
    initModal();
    initScrollTop();
  }

  window.HRVRInteractions = {
    init: initInteractions,
    showToast: showToast,
  };
})();
