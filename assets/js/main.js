/* ==========================================================================
   ModCut portfolio — behaviour
   1. Loads the app video (file or embed) from attributes on #app-video
   2. Reveals sections on scroll
   3. Gently scales the video frame as it scrolls into view
   4. Adds a hairline under the nav after scrolling
   You normally do NOT need to edit this file — set the video in index.html.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. App video ---------- */

  // Turns normal YouTube / Vimeo share links into embeddable URLs.
  // Any other URL is used as-is (e.g. an embed link copied from another host).
  function toEmbedUrl(url) {
    var u;
    try { u = new URL(url, window.location.href); } catch (e) { return url; }
    var host = u.hostname.replace(/^www\.|^m\./, "");
    var id = null;

    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.searchParams.get("v")) id = u.searchParams.get("v");
      else {
        var m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
        if (m) id = m[2];
      }
    }
    if (id) {
      return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?rel=0&modestbranding=1";
    }

    if (host === "vimeo.com") {
      var v = u.pathname.match(/^\/(\d+)/);
      if (v) return "https://player.vimeo.com/video/" + v[1] + "?dnt=1";
    }
    return u.href;
  }

  function showVideoError(frame, message) {
    var placeholder = frame.querySelector(".video-placeholder");
    if (!placeholder) return;
    placeholder.hidden = false;
    placeholder.classList.add("video-placeholder--error");
    placeholder.querySelector(".video-placeholder__title").textContent = "The video could not be loaded";
    placeholder.querySelector(".video-placeholder__hint").textContent = message;
  }

  function setupVideo() {
    var frame = document.getElementById("app-video");
    if (!frame) return;

    var file = (frame.dataset.videoFile || "").trim();
    var embed = (frame.dataset.videoEmbed || "").trim();
    var poster = (frame.dataset.videoPoster || "").trim();
    var title = frame.dataset.videoTitle || "App demo video";
    var placeholder = frame.querySelector(".video-placeholder");

    if (file) {
      var video = document.createElement("video");
      // Accept both "asset%20vid/x.mp4" and "asset vid/x.mp4":
      // encode spaces etc. only if the path isn't already encoded.
      video.src = /%[0-9a-f]{2}/i.test(file) ? file : encodeURI(file);
      video.controls = true;
      video.playsInline = true;
      // Sound on, no autoplay: visitors press Play, so the browser allows audio.
      video.autoplay = false;
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.removeAttribute("autoplay");
      video.removeAttribute("muted");
      video.preload = "metadata";
      video.setAttribute("aria-label", title);
      if (poster) video.poster = poster;
      video.addEventListener("error", function () {
        video.remove();
        showVideoError(frame, "Check that \"" + file + "\" exists and is an MP4 (H.264) or WebM file.");
      });
      if (placeholder) placeholder.hidden = true;
      frame.appendChild(video);
    } else if (embed) {
      var iframe = document.createElement("iframe");
      iframe.src = toEmbedUrl(embed);
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      if (placeholder) placeholder.hidden = true;
      frame.appendChild(iframe);
    }
    // Otherwise the placeholder stays visible.
  }

  /* ---------- 2. Reveal on scroll ---------- */

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    // Small stagger for siblings revealed at the same time
    var observer = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (entry, i) {
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 80, 320) + "ms";
        el.classList.add("is-visible");
        // Clear the delay afterwards so hover effects stay instant
        setTimeout(function () { el.style.transitionDelay = ""; }, 1400);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 3 & 4. Scroll effects ---------- */

  function setupScrollEffects() {
    var nav = document.getElementById("nav");
    var frame = document.getElementById("app-video");
    var ticking = false;

    function update() {
      ticking = false;
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);

      if (frame && !prefersReducedMotion) {
        // Scale from 0.92 to 1 as the frame travels from the bottom of the
        // viewport to roughly its middle.
        var rect = frame.getBoundingClientRect();
        var vh = window.innerHeight || 1;
        var progress = (vh - rect.top) / (vh * 0.6);
        progress = Math.max(0, Math.min(1, progress));
        var scale = 0.92 + 0.08 * progress;
        frame.style.setProperty("--scale", scale.toFixed(4));
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Footer year ---------- */

  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  setupVideo();
  setupReveal();
  setupScrollEffects();
  setYear();
})();
