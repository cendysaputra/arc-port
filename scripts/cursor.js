(function () {
  "use strict";

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var root = document.documentElement;

  var cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML =
    "<svg class=\"cursor-arrow\" width=\"20\" height=\"20\" viewBox=\"-1 -1 20 20\" aria-hidden=\"true\" focusable=\"false\">" +
      "<path fill=\"#ffffff\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linejoin=\"round\" d=\"M1.2 1.2 L1.2 14.2 L4.8 10.6 L7.7 16 L9.8 15 L6.9 9.6 L12.2 9.6 Z\"></path>" +
      "<path fill=\"#090909\" d=\"M1.2 1.2 L1.2 14.2 L4.8 10.6 L7.7 16 L9.8 15 L6.9 9.6 L12.2 9.6 Z\"></path>" +
    "</svg>" +
    "<span class=\"cursor-label\" hidden></span>";
  document.body.appendChild(cursor);

  var label = cursor.querySelector(".cursor-label");
  var targetX = 0;
  var targetY = 0;
  var x = 0;
  var y = 0;
  var active = false;
  var pointed = null;

  function hide() {
    active = false;
    root.classList.remove("has-cursor");
    if (pointed) {
      pointed.classList.remove("is-pointed");
      pointed = null;
    }
    label.hidden = true;
    label.textContent = "";
  }

  function placeLabel(px, py) {
    label.classList.remove("is-flip-x", "is-flip-y");
    if (label.hidden) return;
    var width = label.offsetWidth;
    var height = label.offsetHeight;
    if (px + 22 + width > window.innerWidth - 8) label.classList.add("is-flip-x");
    if (py + 20 + height > window.innerHeight - 8) label.classList.add("is-flip-y");
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
    label.hidden = false;
    label.textContent = name;
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

  function tick() {
    if (fine.matches && active) {
      var ease = reduce.matches ? 1 : 0.22;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
    }
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);
})();
