/* ============================================================
   HRVR Digital Solutions — navigation.js
   Sticky header state, mobile drawer, active section tracking,
   Escape / outside-click closing, focus management, footer year.
   ============================================================ */

(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navLinks = document.getElementById("nav-links");
  var hamburger = document.getElementById("hamburger");
  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[data-nav-link][href^="#"]')
  );
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var footerYear = document.getElementById("footer-year");
  var scrollLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  /* ---------- sticky header ---------- */
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  /* ---------- mobile menu ---------- */
  function menuIsOpen() {
    return navLinks && navLinks.classList.contains("is-open");
  }

  function openMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleMenu() {
    if (menuIsOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ---------- smooth anchor navigation (keeps URL clean) ---------- */
  function onAnchorClick(event) {
    var link = event.currentTarget;
    var hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    var target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update the hash without an extra jump.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", hash);
    }
  }

  /* ---------- active section tracking ---------- */
  function setActiveSection(id) {
    sectionLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function onScrollActive() {
    var marker = window.scrollY + (window.innerHeight * 0.35);
    var currentId = sections.length ? sections[0].id : "";
    sections.forEach(function (section) {
      if (section.offsetTop <= marker) currentId = section.id;
    });
    setActiveSection(currentId);
  }

  /* ---------- global listeners for closing the menu ---------- */
  function onDocumentClick(event) {
    if (!menuIsOpen()) return;
    if (navLinks.contains(event.target) || hamburger.contains(event.target)) return;
    closeMenu();
  }

  function onKeydown(event) {
    if (event.key === "Escape" && menuIsOpen()) {
      closeMenu();
      if (hamburger) hamburger.focus();
    }
  }

  /* ---------- footer year ---------- */
  function updateFooterYear() {
    if (!footerYear) return;
    footerYear.textContent = String(new Date().getFullYear());
  }

  function initNavigation() {
    if (hamburger) {
      hamburger.addEventListener("click", toggleMenu);
    }

    scrollLinks.forEach(function (link) {
      link.addEventListener("click", onAnchorClick);
    });

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeydown);

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          onScrollHeader();
          onScrollActive();
          ticking = false;
        });
      },
      { passive: true }
    );

    onScrollHeader();
    onScrollActive();
    updateFooterYear();
  }

  window.HRVRNavigation = {
    init: initNavigation,
    closeMenu: closeMenu,
  };
})();
