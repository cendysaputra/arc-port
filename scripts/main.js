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
    applyFooterMail(site.contact);
    applyProjectCount();
  }

  function applyProjectCount() {
    var node = document.querySelector("[data-project-count]");
    if (!node) return;
    var n = 0;
    projectList().forEach(function (project) {
      if (project && text(project.title)) n += 1;
    });
    node.textContent = n === 1 ? "1 project" : n + " projects";
  }

  function applyFooterMail(contact) {
    var mail = document.querySelector("[data-footer-mail]");
    if (!mail || !contact || typeof contact !== "object") return;
    var href = contact.href ? safeUrl(contact.href) : "";
    if (!href) return;
    mail.setAttribute("href", href);
    if (/^mailto:/i.test(href)) {
      mail.textContent = href.replace(/^mailto:/i, "").split("?")[0];
      mail.removeAttribute("target");
      mail.removeAttribute("rel");
    } else if (/^https?:\/\//i.test(href)) {
      mail.setAttribute("target", "_blank");
      mail.setAttribute("rel", "noopener");
    }
  }

  function tickJakarta() {
    var clock = document.querySelector("[data-jakarta-time]");
    if (!clock) return;
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    function part(type) {
      for (var i = 0; i < parts.length; i += 1) {
        if (parts[i].type === type) return parts[i].value;
      }
      return "00";
    }
    clock.textContent = part("hour") + ":" + part("minute") + ":" + part("second");
    clock.setAttribute("datetime", new Date().toISOString());
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

  function projectList() {
    if (Array.isArray(site.projects)) return site.projects;
    if (Array.isArray(window.PROJECTS)) return window.PROJECTS;
    return [];
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

  function tagList(project) {
    if (!project || !Array.isArray(project.tags)) return [];
    return project.tags.map(function (tag) {
      return String(tag == null ? "" : tag).trim();
    }).filter(Boolean);
  }

  function placeholderSvg(title) {
    var label = esc(title).slice(0, 36);
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 700\">" +
      "<rect width=\"800\" height=\"700\" fill=\"#f5f5f5\"/>" +
      "<rect x=\"48\" y=\"48\" width=\"96\" height=\"96\" fill=\"#090909\"/>" +
      "<rect x=\"144\" y=\"48\" width=\"96\" height=\"96\" fill=\"#ffffff\"/>" +
      "<text x=\"48\" y=\"640\" fill=\"#090909\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"36\">" +
      label + "</text></svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function thumbSrc(project, title) {
    var raw = String(project.thumb == null ? "" : project.thumb).trim();
    if (!raw) return placeholderSvg(title);
    var safe = safeUrl(raw);
    return safe ? safe : placeholderSvg(title);
  }

  function stackLabel(tags) {
    return tags.filter(function (tag) {
      return tag.toLowerCase() !== "web dev";
    }).join(", ");
  }

  function renderCard(project) {
    if (!project || typeof project !== "object") return "";
    var title = text(project.title);
    if (!title) return "";
    var href = safeUrl(project.href || "") || "#";
    var outbound = /^https?:\/\//i.test(href);
    var dated = dateParts(project.year || project.date);
    var tags = tagList(project);
    var alt = text(project.alt) || ("Screenshot of " + title);
    var src = thumbSrc(project, title);
    var bits = [];
    if (dated.label) {
      bits.push("<time" + (dated.iso ? " datetime=\"" + esc(dated.iso) + "\"" : "") + ">" + esc(dated.label) + "</time>");
    }
    var stacks = stackLabel(tags);
    if (stacks) bits.push(esc(stacks));
    var metaHtml = bits.length ? "<span class=\"card-meta\">" + bits.join(" · ") + "</span>" : "";
    return (
      "<li class=\"card\" data-title=\"" + esc(title) + "\" data-tags=\"" + esc(JSON.stringify(tags)) + "\">" +
        "<a class=\"card-link\" href=\"" + esc(href) + "\"" +
          (outbound ? " target=\"_blank\" rel=\"noopener\"" : "") + ">" +
          "<img class=\"card-thumb\" src=\"" + esc(src) + "\" alt=\"" + esc(alt) + "\" width=\"800\" height=\"700\">" +
          "<span class=\"card-name\">" + esc(title) + "</span>" +
          metaHtml +
          (outbound ? "<span class=\"visually-hidden\"> (opens in a new tab)</span>" : "") +
        "</a>" +
      "</li>"
    );
  }

  function bindThumbs(grid) {
    grid.querySelectorAll(".card-thumb").forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.getAttribute("data-fallback") === "true") return;
        img.setAttribute("data-fallback", "true");
        var card = img.closest(".card");
        var title = card ? card.getAttribute("data-title") || "Project" : "Project";
        img.src = placeholderSvg(title);
      });
    });
  }

  function renderGrid() {
    var grid = document.querySelector("[data-grid]");
    if (!grid) return;
    grid.innerHTML = projectList().map(renderCard).filter(Boolean).join("");
    bindThumbs(grid);
  }

  function cardTags(card) {
    try {
      var parsed = JSON.parse(card.getAttribute("data-tags") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function setFilter(tag) {
    var normalized = tag && tag !== "all" ? tag : "all";
    document.querySelectorAll(".tag-list [data-filter]").forEach(function (button) {
      var on = button.getAttribute("data-filter") === normalized;
      button.setAttribute("aria-pressed", on ? "true" : "false");
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
  renderGrid();
  setFilter("all");
  tickJakarta();
  window.setInterval(tickJakarta, 1000);
})();
