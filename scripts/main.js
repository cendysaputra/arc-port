(function () {
  "use strict";

  var site = window.SITE && typeof window.SITE === "object" ? window.SITE : {};

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function safeUrl(value) {
    var url = String(value == null ? "" : value).trim();
    if (!url || /[\u0000-\u001F\s]/.test(url)) return "";
    if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "";
    return url;
  }

  function applyText(selector, value) {
    var next = text(value);
    if (!next) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = next;
    });
  }

  function applyContact(contact) {
    if (!contact || typeof contact !== "object") return;
    var link = document.querySelector("[data-contact]");
    if (!link) return;
    var href = contact.href ? safeUrl(contact.href) : "";
    if (href) link.setAttribute("href", href);
    if (text(contact.label)) link.textContent = text(contact.label);
    if (/^https?:\/\//i.test(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
  }

  function hydrate() {
    var name = text(site.name);
    if (name) {
      applyText("[data-site-name]", name);
      document.title = name;
    }
    applyText("[data-site-intro]", site.sentence);
    if (text(site.description)) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", text(site.description));
    }
    applyContact(site.contact);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function tagLabels() {
    var source = Array.isArray(site.tags) ? site.tags : [];
    var labels = [];
    source.forEach(function (tag) {
      var label = String(tag == null ? "" : tag).trim();
      if (!label || label.toLowerCase() === "all") return;
      if (labels.indexOf(label) === -1) labels.push(label);
    });
    return labels;
  }

  function renderTags() {
    var list = document.querySelector("[data-tags]");
    if (!list) return;
    var items = ["all"].concat(tagLabels());
    list.innerHTML = items.map(function (tag) {
      var isAll = tag === "all";
      var label = isAll ? "All" : tag;
      return (
        "<li><button type=\"button\" class=\"tag\" data-filter=\"" + esc(isAll ? "all" : label) +
        "\" aria-pressed=\"" + (isAll ? "true" : "false") + "\">" + esc(label) + "</button></li>"
      );
    }).join("");
  }

  function setFilter(tag) {
    var normalized = tag && tag !== "all" ? tag : "all";
    document.querySelectorAll("[data-filter]").forEach(function (button) {
      var on = button.getAttribute("data-filter") === normalized;
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var status = document.querySelector("[data-filter-status]");
    if (status) {
      status.textContent = normalized === "all"
        ? "Showing all projects"
        : "Showing projects tagged " + normalized;
    }
  }

  document.addEventListener("click", function (event) {
    var filter = event.target && event.target.closest ? event.target.closest("[data-filter]") : null;
    if (!filter) return;
    var next = filter.getAttribute("data-filter");
    if (!next || next === "all") {
      setFilter("all");
      return;
    }
    var active = filter.getAttribute("aria-pressed") === "true";
    setFilter(active ? "all" : next);
  });

  hydrate();
  renderTags();
  setFilter("all");
})();
