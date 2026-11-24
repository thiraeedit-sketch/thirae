/* THIRAE — main.js */
(function () {
  "use strict";

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });

  // Category filters
  var filters = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".card");
  var empty = document.getElementById("empty");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      var shown = 0;
      cards.forEach(function (c) {
        var match = f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) !== -1;
        c.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown !== 0;
    });
  });

  // Video lightbox
  var modal = document.getElementById("modal");
  var mVideo = document.getElementById("modalVideo");
  var mClose = document.getElementById("modalClose");
  var lastFocus = null;
  var heroVideo = document.getElementById("heroVideo");

  function openModal(src) {
    lastFocus = document.activeElement;
    if (heroVideo) heroVideo.pause();
    mVideo.src = src;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    mVideo.play().catch(function () { /* user can press play */ });
    mClose.focus();
  }
  function closeModal() {
    mVideo.pause();
    mVideo.removeAttribute("src");
    mVideo.load();
    modal.hidden = true;
    document.body.style.overflow = "";
    if (heroVideo) heroVideo.play().catch(function () {});
    if (lastFocus) lastFocus.focus();
  }
  cards.forEach(function (c) {
    c.querySelector(".thumb").addEventListener("click", function () {
      openModal(c.getAttribute("data-video"));
    });
  });
  mClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // Hero sound toggle
  var soundBtn = document.getElementById("soundBtn");
  if (soundBtn && heroVideo) {
    soundBtn.addEventListener("click", function () {
      heroVideo.muted = !heroVideo.muted;
      soundBtn.textContent = heroVideo.muted ? "Sound off" : "Sound on";
      soundBtn.setAttribute("aria-pressed", String(!heroVideo.muted));
      if (heroVideo.paused) heroVideo.play().catch(function () {});
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 5) * 70 + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
