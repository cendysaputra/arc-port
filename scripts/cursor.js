(function () {
  "use strict";

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var root = document.documentElement;

  var cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML =
    "<svg class=\"cursor-arrow\" width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" aria-hidden=\"true\" focusable=\"false\">" +
      "<path fill=\"#090909\" stroke=\"#ffffff\" stroke-width=\"1\" stroke-linejoin=\"miter\" paint-order=\"stroke fill\" d=\"M1 0.75 L1 13.1 L4.15 9.95 L7.05 15.15 L8.95 14.2 L6.05 9 L11.4 9 Z\"></path>" +
    "</svg>" +
    "<span class=\"cursor-label\"></span>";
  document.body.appendChild(cursor);

  var label = cursor.querySelector(".cursor-label");
  var targetX = 0;
  var targetY = 0;
  var x = 0;
  var y = 0;
  var active = false;
  var pointed = null;
  var last = 0;

  function hide() {
    active = false;
    root.classList.remove("has-cursor");
    if (pointed) {
      pointed.classList.remove("is-pointed");
      pointed = null;
    }
  }

  function placeLabel(px, py) {
    label.classList.remove("is-flip-x", "is-flip-y");
    if (!label.textContent) return;
    var width = label.offsetWidth;
    var height = label.offsetHeight;
    if (px + 18 + width > window.innerWidth - 12) label.classList.add("is-flip-x");
    if (py + 20 + height > window.innerHeight - 12) label.classList.add("is-flip-y");
  }

  document.addEventListener("pointermove", function (event) {
    if (!fine.matches) {
      hide();
      return;
    }
    var card = event.target && event.target.closest ? event.target.closest(".card:not([hidden])") : null;
    var name = card ? card.getAttribute("data-title") || "" : "";
    if (!card || !name) {
      hide();
      return;
    }
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active || reduce.matches) {
      x = targetX;
      y = targetY;
    }
    active = true;
    if (pointed && pointed !== card) pointed.classList.remove("is-pointed");
    pointed = card;
    card.classList.add("is-pointed");
    root.classList.add("has-cursor");
    if (label.textContent !== name) label.textContent = name;
    placeLabel(targetX, targetY);
  });

  root.addEventListener("mouseleave", hide);

  fine.addEventListener("change", function () {
    if (!fine.matches) hide();
  });

  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      x = targetX;
      y = targetY;
    }
  });

  function tick(now) {
    if (fine.matches && active) {
      var dt = last ? Math.min(48, now - last) : 16;
      var ease = reduce.matches ? 1 : 1 - Math.exp(-dt / 40);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      if (Math.abs(targetX - x) < 0.15 && Math.abs(targetY - y) < 0.15) {
        x = targetX;
        y = targetY;
      }
      cursor.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
    }
    last = now;
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);
})();
