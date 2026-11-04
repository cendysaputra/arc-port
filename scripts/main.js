(function () {
  "use strict";

  var site = window.SITE && typeof window.SITE === "object" ? window.SITE : {};

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeUrl(value) {
    var url = String(value == null ? "" : value).trim();
    if (!url || /[\u0000-\u001F\s]/.test(url)) return "#";
    if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;
    if (url.indexOf("//") === 0) return url;
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "#";
    return url;
  }

  function projectList() {
    if (Array.isArray(site.projects)) return site.projects;
    if (Array.isArray(window.PROJECTS)) return window.PROJECTS;
    return [];
  }

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function applyText(selector, value) {
    var next = text(value);
    if (!next) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = next;
    });
  }

  function applyContact(contact) {
    if (!contact || typeof contact !== "object") return;
    var href = contact.href ? safeUrl(contact.href) : "";
    var button = document.querySelector("[data-contact]");
    if (button) {
      if (href && href !== "#") button.setAttribute("href", href);
      if (text(contact.label)) button.textContent = text(contact.label);
    }
    markExternal(button, href);
    var footer = document.querySelector("[data-contact-link]");
    if (!footer || !href || href === "#") return;
    footer.setAttribute("href", href);
    markExternal(footer, href);
    var mail = /^mailto:([^?]+)/i.exec(String(contact.href).trim());
    if (mail) {
      try {
        footer.textContent = decodeURIComponent(mail[1]);
      } catch (err) {
        footer.textContent = mail[1];
      }
    } else if (text(contact.text)) {
      footer.textContent = text(contact.text);
    }
  }

  function markExternal(el, href) {
    if (!el) return;
    if (/^https?:\/\//i.test(href)) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  }

  function renderHeroTags(tags) {
    var list = document.querySelector("[data-hero-tags]");
    if (!list || !Array.isArray(tags)) return;
    var labels = tags.map(function (tag) {
      return String(tag == null ? "" : tag).trim();
    }).filter(Boolean);
    var items = ["all"].concat(labels);
    list.innerHTML = items.map(function (tag) {
      var isAll = tag === "all";
      var label = isAll ? "All" : tag;
      return (
        "<li><button type=\"button\" class=\"tag" + (isAll ? " is-active" : "") +
        "\" data-filter=\"" + esc(isAll ? "all" : label) +
        "\" aria-pressed=\"" + (isAll ? "true" : "false") + "\">" +
        esc(label) + "</button></li>"
      );
    }).join("");
  }

  function hydrate() {
    var name = text(site.name);
    if (name) {
      applyText("[data-hero-name], [data-footer-name]", name);
      document.title = name;
    }
    applyText("[data-hero-sentence]", site.sentence);
    applyText("[data-about]", site.about);
    if (text(site.description)) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", text(site.description));
    }
    applyContact(site.contact);
    if (Array.isArray(site.tags)) renderHeroTags(site.tags);
  }

  function slug(value) {
    var base = String(value == null ? "" : value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return base || "project";
  }

  function uniqueId(base, used) {
    var id = base || "project";
    if (!used[id]) {
      used[id] = true;
      return id;
    }
    var n = 2;
    while (used[id + "-" + n]) n += 1;
    var next = id + "-" + n;
    used[next] = true;
    return next;
  }

  function dateParts(value) {
    var raw = String(value == null ? "" : value).trim();
    var match = /^(\d{4})[/.](\d{2})[/.](\d{2})$/.exec(raw);
    if (match) {
      return {
        label: match[1] + "/" + match[2] + "/" + match[3],
        iso: match[1] + "-" + match[2] + "-" + match[3]
      };
    }
    var year = /^(\d{4})$/.exec(raw);
    if (year) return { label: year[1], iso: year[1] };
    return { label: raw, iso: "" };
  }

  function placeholderSvg(title) {
    var label = esc(title).slice(0, 28);
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 700\">" +
      "<rect width=\"800\" height=\"700\" fill=\"#fafafa\"/>" +
      "<rect x=\"48\" y=\"48\" width=\"704\" height=\"604\" fill=\"none\" stroke=\"#2f2725\" stroke-width=\"2\"/>" +
      "<text x=\"88\" y=\"360\" fill=\"#2f2725\" font-family=\"sans-serif\" font-size=\"42\">" + label + "</text></svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function thumbSrc(project, title) {
    var raw = String(project.thumb == null ? "" : project.thumb).trim();
    if (!raw) return placeholderSvg(title);
    var safe = safeUrl(raw);
    return safe === "#" ? placeholderSvg(title) : safe;
  }

  function icon(name) {
    var paths = {
      zoom: "<circle cx=\"6\" cy=\"6\" r=\"3.2\"></circle><path d=\"M8.6 8.6 L12 12\"></path>",
      phone: "<rect x=\"4.2\" y=\"1.4\" width=\"5.6\" height=\"11.2\"></rect><path d=\"M6.2 10.6 H7.8\"></path>",
      related: "<rect x=\"1.2\" y=\"1.2\" width=\"4.4\" height=\"4.4\"></rect><rect x=\"8.4\" y=\"8.4\" width=\"4.4\" height=\"4.4\"></rect><path d=\"M5.6 3.4 H8.4 V8.4\"></path>",
      heart: "<path d=\"M7 11.6 2.6 7.3C1.4 6.1 1.5 4.2 2.8 3.2 4 2.3 5.4 2.6 6.3 3.7L7 4.5 7.7 3.7C8.6 2.6 10 2.3 11.2 3.2 12.5 4.2 12.6 6.1 11.4 7.3Z\"></path>"
    };
    return "<svg viewBox=\"0 0 14 14\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"square\" stroke-linejoin=\"miter\">" +
      (paths[name] || "") + "</svg>";
  }

  function filterTagSet() {
    var set = {};
    var list = Array.isArray(site.tags) ? site.tags : [];
    list.forEach(function (tag) {
      var label = String(tag == null ? "" : tag).trim();
      if (label && label.toLowerCase() !== "all") set[label] = true;
    });
    return set;
  }

  function tagList(project) {
    if (!Array.isArray(project.tags)) return [];
    return project.tags.map(function (tag) {
      return String(tag == null ? "" : tag).trim();
    }).filter(Boolean);
  }

  function renderCard(project, used) {
    if (!project || typeof project !== "object") return "";
    var title = text(project.title);
    if (!title) return "";
    var id = uniqueId(slug(project.id || title), used);
    var href = safeUrl(project.href || ("#project-" + id));
    if (href === "#") href = "#project-" + id;
    var outbound = /^https?:\/\//i.test(href) ? " target=\"_blank\" rel=\"noopener\"" : "";
    var src = thumbSrc(project, title);
    var alt = text(project.alt) || ("Cover image for " + title);
    var dated = dateParts(project.year || project.date);
    var credit = text(project.credit);
    var creditHref = safeUrl(project.creditHref || "#about");
    var tags = tagList(project);
    var time = dated.label
      ? "<time" + (dated.iso ? " datetime=\"" + esc(dated.iso) + "\"" : "") + ">" + esc(dated.label) + "</time>"
      : "";
    var creditOutbound = /^https?:\/\//i.test(creditHref) ? " target=\"_blank\" rel=\"noopener\"" : "";
    var creditHtml = credit
      ? "<a class=\"link credit\" href=\"" + esc(creditHref) + "\"" + creditOutbound + ">" + esc(credit) + "</a>"
      : "";
    var filters = filterTagSet();
    var tagsHtml = tags.map(function (tag) {
      if (!filters[tag]) {
        return "<li><span class=\"tag\">" + esc(tag) + "</span></li>";
      }
      return "<li><button type=\"button\" class=\"tag\" data-filter=\"" + esc(tag) + "\" aria-pressed=\"false\">" + esc(tag) + "</button></li>";
    }).join("");

    return (
      "<li class=\"card\" id=\"project-" + esc(id) + "\" data-tags=\"" + esc(JSON.stringify(tags)) + "\">" +
        "<a class=\"card-thumb\" href=\"" + esc(href) + "\"" + outbound + ">" +
          "<img src=\"" + esc(src) + "\" alt=\"" + esc(alt) + "\" width=\"800\" height=\"700\">" +
        "</a>" +
        "<div class=\"card-meta\">" +
          "<a class=\"card-title\" href=\"" + esc(href) + "\"" + outbound + ">" + esc(title) + "</a>" +
          "<div class=\"card-actions\">" +
            "<a class=\"icon-button\" href=\"" + esc(src) + "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"" + esc("Zoom " + title) + "\">" + icon("zoom") + "</a>" +
            "<button type=\"button\" class=\"icon-button\" data-device aria-pressed=\"false\" aria-label=\"" + esc("View " + title + " on a phone") + "\">" + icon("phone") + "</button>" +
            "<button type=\"button\" class=\"icon-button\" data-related aria-label=\"" + esc("Show work related to " + title) + "\">" + icon("related") + "</button>" +
            "<button type=\"button\" class=\"icon-button\" data-favorite aria-pressed=\"false\" aria-label=\"" + esc("Save " + title) + "\">" + icon("heart") + "</button>" +
          "</div>" +
        "</div>" +
        "<p class=\"card-foot\">" + time + creditHtml + "</p>" +
        "<ul class=\"tag-list card-tags\">" + tagsHtml + "</ul>" +
      "</li>"
    );
  }

  function renderGrid() {
    var grid = document.querySelector("[data-grid]");
    if (!grid) return;
    var used = {};
    grid.innerHTML = projectList().map(function (project) {
      return renderCard(project, used);
    }).filter(Boolean).join("");
  }

  function cardTags(card) {
    try {
      var parsed = JSON.parse(card.dataset.tags || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function setFilter(tag) {
    var normalized = tag && tag !== "all" ? tag : "all";
    document.querySelectorAll("[data-filter]").forEach(function (button) {
      var on = button.dataset.filter === normalized;
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.classList.toggle("is-active", on);
    });
    var cards = document.querySelectorAll(".card");
    var shown = 0;
    cards.forEach(function (card) {
      var match = normalized === "all" || cardTags(card).indexOf(normalized) !== -1;
      card.hidden = !match;
      if (match) shown += 1;
    });
    var empty = document.querySelector("[data-empty]");
    if (empty) {
      empty.hidden = shown !== 0;
      empty.textContent = cards.length === 0 ? "No projects yet." : "No projects for this tag.";
    }
    var status = document.querySelector("[data-filter-status]");
    if (status) {
      status.textContent = normalized === "all"
        ? "Showing " + shown + " projects"
        : "Showing " + shown + " projects tagged " + normalized;
    }
  }

  document.addEventListener("click", function (event) {
    var favorite = event.target.closest("[data-favorite]");
    if (favorite) {
      var saved = favorite.getAttribute("aria-pressed") === "true";
      favorite.setAttribute("aria-pressed", saved ? "false" : "true");
      return;
    }

    var device = event.target.closest("[data-device]");
    if (device) {
      var card = device.closest(".card");
      var narrow = device.getAttribute("aria-pressed") === "true";
      device.setAttribute("aria-pressed", narrow ? "false" : "true");
      if (card) card.classList.toggle("is-phone", !narrow);
      return;
    }

    var related = event.target.closest("[data-related]");
    if (related) {
      var host = related.closest(".card");
      var tags = host ? cardTags(host) : [];
      var filters = filterTagSet();
      var pick = "";
      tags.forEach(function (tag) {
        if (!pick && filters[tag]) pick = tag;
      });
      if (pick) setFilter(pick);
      return;
    }

    var filter = event.target.closest("[data-filter]");
    if (!filter) return;
    if (filter.dataset.filter === "all") {
      setFilter("all");
      return;
    }
    var active = filter.getAttribute("aria-pressed") === "true";
    setFilter(active ? "all" : filter.dataset.filter);
  });

  hydrate();
  renderGrid();
  setFilter("all");
})();
