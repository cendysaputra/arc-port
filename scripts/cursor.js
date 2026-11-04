(function () {
  "use strict";

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches) return;

  var root = document.documentElement;
  var cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = "<svg class=\"cursor-arrow\" width=\"14\" height=\"14\" viewBox=\"0 0 18 18\" aria-hidden=\"true\" focusable=\"false\">" +
    "<path fill=\"#090909\" d=\"M1 1 L1 15.2 L5.1 11.1 L8.3 17 L10.6 15.9 L7.4 10 L13.2 10 Z\"></path></svg>" +
    "<span class=\"cursor-tag\">Cendy</span>";
  document.body.appendChild(cursor);
  var tag = cursor.querySelector(".cursor-tag");

  var targetX = 0;
  var targetY = 0;
  var x = 0;
  var y = 0;
  var seen = false;

  function labelFor(target) {
    if (!target || !target.closest) return "Cendy";
    var filter = target.closest("[data-filter]");
    if (filter) return filter.textContent.replace(/\s+/g, " ").trim();
    var row = target.closest(".work-row");
    if (row && row.getAttribute("data-title")) return row.getAttribute("data-title");
    if (target.closest("a, button")) return "Open \u2197";
    return "Cendy";
  }

  document.addEventListener("pointermove", function (event) {
    if (!fine.matches) return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!seen || reduce.matches) {
      x = targetX;
      y = targetY;
      seen = true;
    }
    tag.textContent = labelFor(event.target);
    var row = event.target && event.target.closest ? event.target.closest(".work-row") : null;
    root.classList.toggle("cursor-on-row", !!row);
  });

  function tick() {
    if (fine.matches && seen) {
      var ease = reduce.matches ? 1 : 0.18;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
    }
    window.requestAnimationFrame(tick);
  }

  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      x = targetX;
      y = targetY;
    }
  });

  window.requestAnimationFrame(tick);
})();
