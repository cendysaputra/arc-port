(function () {
  "use strict";

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var coarse = window.matchMedia("(pointer: coarse)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function allowed() {
    return fine.matches && !coarse.matches && !reduce.matches;
  }

  function arrow() {
    return "<svg class=\"cursor-arrow\" width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" aria-hidden=\"true\" focusable=\"false\">" +
      "<path fill=\"#090909\" d=\"M1 1 L1 15.2 L5.1 11.1 L8.3 17 L10.6 15.9 L7.4 10 L13.2 10 Z\"></path></svg>";
  }

  function makeCursor(name, guest) {
    var el = document.createElement("div");
    el.className = "cursor" + (guest ? " cursor-guest" : " cursor-self");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = arrow() + "<span class=\"cursor-tag\"></span>";
    el.querySelector(".cursor-tag").textContent = name;
    return el;
  }

  var self = makeCursor("Cendy", false);
  var guests = [
    makeCursor("Claudy", true),
    makeCursor("Artify", true)
  ];
  document.body.appendChild(self);

  var hero = document.querySelector(".hero");
  if (hero) {
    if (getComputedStyle(hero).position === "static") hero.style.position = "relative";
    guests.forEach(function (guest) { hero.appendChild(guest); });
  }

  var root = document.documentElement;
  var targetX = 0;
  var targetY = 0;
  var x = 0;
  var y = 0;
  var ready = false;

  function place(el, px, py) {
    el.style.transform = "translate3d(" + px.toFixed(1) + "px," + py.toFixed(1) + "px,0)";
  }

  function enable(on) {
    root.classList.toggle("has-live-cursor", on);
  }

  document.addEventListener("pointermove", function (event) {
    if (!allowed()) {
      enable(false);
      return;
    }
    root.classList.remove("is-keyboard");
    targetX = event.clientX;
    targetY = event.clientY;
    if (!ready) {
      x = targetX;
      y = targetY;
      ready = true;
    }
    var card = event.target && event.target.closest ? event.target.closest(".card") : null;
    self.querySelector(".cursor-tag").textContent = card ? "lihat proyek" : "Cendy";
    enable(true);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") root.classList.add("is-keyboard");
  });

  function cubic(a, b, c, d, t) {
    var u = 1 - t;
    return (u * u * u * a) + (3 * u * u * t * b) + (3 * u * t * t * c) + (t * t * t * d);
  }

  var paths = [
    { el: guests[0], dur: 14000, hold: 0, pts: [[0.08, 0.22], [0.28, 0.05], [0.42, 0.38], [0.18, 0.48]] },
    { el: guests[1], dur: 18000, hold: 0, pts: [[0.72, 0.18], [0.9, 0.42], [0.55, 0.62], [0.34, 0.36]] }
  ];
  var start = 0;

  function tick(now) {
    if (!start) start = now;
    if (allowed() && ready) {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      place(self, x, y);
    }
    if (allowed() && hero) {
      var box = hero.getBoundingClientRect();
      var name = document.querySelector(".hero-name");
      var nameBox = name ? name.getBoundingClientRect() : null;
      paths.forEach(function (path) {
        if (path.hold > now) return;
        var t = ((now - start) % path.dur) / path.dur;
        var p = path.pts;
        var px = box.left + cubic(p[0][0], p[1][0], p[2][0], p[3][0], t) * box.width;
        var py = box.top + cubic(p[0][1], p[1][1], p[2][1], p[3][1], t) * box.height;
        if (nameBox) {
          var nx = nameBox.left + nameBox.width * 0.35;
          var ny = nameBox.top + nameBox.height * 0.55;
          var dx = px - nx;
          var dy = py - ny;
          if (dx * dx + dy * dy < 90 * 90) path.hold = now + 1400;
        }
        place(path.el, px - box.left, py - box.top);
      });
    } else {
      enable(false);
    }
    window.requestAnimationFrame(tick);
  }

  fine.addEventListener("change", function () { if (!allowed()) enable(false); });
  reduce.addEventListener("change", function () { if (!allowed()) enable(false); });
  window.requestAnimationFrame(tick);
})();
