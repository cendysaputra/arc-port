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

  hydrate();
})();
