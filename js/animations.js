/* ============================================================
   HRVR Digital Solutions — animations.js
   Page loader, scroll reveal (IntersectionObserver), animated
   counters, typing animation, canvas particles.

   Performance & safety rules honored here:
   - requestAnimationFrame only; observers unobserve after reveal.
   - All loops pause when document.hidden.
   - No eval / no dynamic code. Pure DOM + canvas drawing.
   - Everything respects prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- page loader ---------- */
  function initPageLoader() {
    var loader = document.getElementById("page-loader");
    if (!loader) return;
    var done = function () {
      loader.classList.add("is-done");
      loader.setAttribute("aria-hidden", "true");
    };
    if (document.readyState === "complete") {
      window.setTimeout(done, 250);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(done, 250);
      });
      // Safety net: never trap the user behind the loader.
      window.setTimeout(done, 3000);
    }
  }

  /* ---------- scroll reveal ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target") || "0");
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

    if (reducedMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (document.hidden) {
        startTime = null; // pause while the tab is hidden
      }
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }

    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ---------- typing animation ---------- */
  var TYPING_PHRASES = [
    "Custom Business Websites",
    "Python Automations",
    "Mobile Apps",
    "Management Systems",
    "UI/UX Designs in Figma",
  ];

  function initTyping() {
    var el = document.getElementById("typing-text");
    if (!el || reducedMotion) {
      if (el) el.textContent = TYPING_PHRASES[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var timerId = null;

    function schedule(fn, delay) {
      timerId = window.setTimeout(fn, delay);
    }

    function tick() {
      if (document.hidden) {
        schedule(tick, 400); // idle while hidden
        return;
      }

      var phrase = TYPING_PHRASES[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          schedule(tick, 1800);
          return;
        }
        schedule(tick, 70);
      } else {
        charIndex -= 1;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
          schedule(tick, 400);
          return;
        }
        schedule(tick, 38);
      }
    }

    tick();

    // Clean up if the page is being torn down (e.g. bfcache restore edge cases).
    window.addEventListener("pagehide", function () {
      if (timerId) window.clearTimeout(timerId);
    });
  }

  /* ---------- canvas particles ---------- */
  function initParticles() {
    var canvas = document.getElementById("particle-canvas");
    if (!canvas || !canvas.getContext) return;

    if (reducedMotion) return; // static background is fine

    var ctx = canvas.getContext("2d");
    var particles = [];
    var rafId = null;
    var running = false;
    var MAX_PARTICLES = 46;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.1,
      };
    }

    function seed() {
      particles = [];
      var count = Math.min(MAX_PARTICLES, Math.floor(canvas.offsetWidth / 30));
      for (var i = 0; i < count; i += 1) {
        particles.push(createParticle());
      }
    }

    function drawFrame() {
      if (document.hidden) {
        rafId = window.requestAnimationFrame(drawFrame); // cheap idle while hidden
        return;
      }
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      var style = getComputedStyle(document.documentElement);
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      var base = isLight ? "109, 40, 217" : "167, 139, 250";

      for (var i = 0; i < particles.length; i += 1) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + base + "," + p.alpha + ")";
        ctx.fill();
      }

      // connective lines between close particles
      ctx.strokeStyle = "rgba(" + base + ",0.07)";
      for (var a = 0; a < particles.length; a += 1) {
        for (var b = a + 1; b < particles.length; b += 1) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var distSq = dx * dx + dy * dy;
          if (distSq < 130 * 130) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      void style;
      rafId = window.requestAnimationFrame(drawFrame);
    }

    function start() {
      if (running) return;
      running = true;
      resize();
      seed();
      rafId = window.requestAnimationFrame(drawFrame);
    }

    function stop() {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        seed();
      }, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (!running) {
        start();
      }
    });

    start();
  }

  /* ---------- public init ---------- */
  function initAnimations() {
    initPageLoader();
    initScrollReveal();
    initCounters();
    initTyping();
    initParticles();
  }

  window.HRVRAnimations = {
    init: initAnimations,
  };
})();
