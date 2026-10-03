(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[init " + name + "]", e); }
  }

  /* Cabecera: sombra al hacer scroll */
  function initHeader() {
    var h = document.querySelector(".header");
    if (!h) return;
    var on = function () { h.classList.toggle("is-scrolled", window.scrollY > 8); };
    on();
    window.addEventListener("scroll", on, { passive: true });
  }

  /* Menú móvil */
  function initNav() {
    var btn = document.querySelector(".burger");
    var nav = document.getElementById("nav");
    if (!btn || !nav) return;
    var set = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };
    btn.addEventListener("click", function () { set(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* Revelado al hacer scroll (con red de seguridad) */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    var show = function (el) { el.classList.add("in"); };
    if (!("IntersectionObserver" in window)) { els.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(show); }, 6000);
  }

  /* Línea de tiempo horizontal (en móvil se muestra vertical con todo el detalle) */
  function initTimeline() {
    var root = document.getElementById("timeline");
    var panel = document.getElementById("tl-panel");
    if (!root || !panel) return;
    var steps = Array.prototype.slice.call(root.querySelectorAll(".step"));
    var bar = root.querySelector(".tl-progress");
    var prev = document.getElementById("tl-prev");
    var next = document.getElementById("tl-next");
    var current = 0;

    function render(i, focus) {
      current = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, n) {
        s.classList.toggle("is-active", n === current);
        s.classList.toggle("is-done", n < current);
        var b = s.querySelector(".step-btn");
        if (n === current) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      var s = steps[current];
      var title = s.querySelector(".step-title").textContent;
      panel.innerHTML =
        '<span class="num">' + (current + 1) + '</span>' +
        '<h3>' + title + '</h3>' +
        '<div class="body">' + s.querySelector(".step-detail").innerHTML + '</div>';
      if (bar) {
        var span = steps.length - 1;
        bar.style.width = "calc((100% - 100% / " + steps.length + ") * " + (current / span) + ")";
      }
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === steps.length - 1;
      if (prev) prev.style.opacity = current === 0 ? ".35" : "1";
      if (next) next.style.opacity = current === steps.length - 1 ? ".35" : "1";
      if (focus) steps[current].querySelector(".step-btn").focus();
    }

    steps.forEach(function (s, n) {
      s.querySelector(".step-btn").addEventListener("click", function () { render(n); });
    });
    if (prev) prev.addEventListener("click", function () { render(current - 1); });
    if (next) next.addEventListener("click", function () { render(current + 1); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); render(current + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); render(current - 1, true); }
    });
    render(0);
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  safe(initHeader, "header");
  safe(initNav, "nav");
  safe(initReveal, "reveal");
  safe(initTimeline, "timeline");
  safe(initYear, "year");
})();
