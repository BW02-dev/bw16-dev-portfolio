/* ==========================================================================
   ModCut portfolio — behaviour
   1. Versions: clicking a version button reveals its detail panel
   2. Stops a panel's YouTube video when the panel is closed
   3. Reveals sections on scroll
   4. Adds a hairline under the nav after scrolling
   You normally do NOT need to edit this file — versions and the YouTube
   iframes live in index.html.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Video ---------- */

  // Reloading the iframe stops playback, so a closed panel doesn't keep playing sound.
  function stopVideos(panel) {
    panel.querySelectorAll(".video-frame iframe").forEach(function (iframe) {
      var src = iframe.getAttribute("src");
      iframe.setAttribute("src", src);
    });
  }

  /* ---------- 1. Versions ---------- */

  function setupVersions() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".version-chip"));
    if (!buttons.length) return;

    function panelFor(btn) {
      return document.getElementById(btn.getAttribute("aria-controls"));
    }

    function close(btn) {
      var panel = panelFor(btn);
      btn.setAttribute("aria-expanded", "false");
      if (panel) {
        if (!panel.hidden) stopVideos(panel);
        panel.classList.remove("is-open");
        panel.hidden = true;
      }
    }

    function open(btn, scroll) {
      buttons.forEach(function (other) { if (other !== btn) close(other); });
      var panel = panelFor(btn);
      btn.setAttribute("aria-expanded", "true");
      if (!panel) return;
      panel.hidden = false;
      // Next frame, so the fade-in transition runs after un-hiding
      window.requestAnimationFrame(function () { panel.classList.add("is-open"); });
      if (scroll) {
        panel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
      }
    }

    // Hide panels with JS only, so they stay readable if JavaScript is off.
    buttons.forEach(function (btn) {
      var panel = panelFor(btn);
      if (panel) panel.hidden = true;
      btn.addEventListener("click", function () {
        if (btn.getAttribute("aria-expanded") === "true") close(btn);
        else open(btn, true);
      });
    });

    // Open a version directly from a link such as  index.html#version-0-1-0
    var hash = window.location.hash.slice(1);
    if (hash) {
      buttons.forEach(function (btn) {
        if (btn.getAttribute("aria-controls") === hash) open(btn, false);
      });
    }
  }

  /* ---------- 2. Reveal on scroll ---------- */

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (entry, i) {
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 80, 320) + "ms";
        el.classList.add("is-visible");
        setTimeout(function () { el.style.transitionDelay = ""; }, 1400);
        observer.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 3. Nav hairline ---------- */

  function setupNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    function update() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Footer year ---------- */

  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  setupVersions();
  setupReveal();
  setupNav();
  setYear();
})();
