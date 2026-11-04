/**
 * Portfolio content. This is the only file to edit when the real bio,
 * project list, and images arrive. scripts/main.js renders window.SITE
 * and does not contain copy or image paths.
 *
 * Replace the values below and keep these field names:
 *   name         Hero and footer name.
 *   sentence     Hero sentence.
 *   about        Footer bio. Optional.
 *   description  Meta description. Optional.
 *   contact      { label, href }  mailto: or https:
 *   tags         Hero filter labels.
 *   projects[]   One object per project:
 *     id, title, href, thumb, alt, date, credit, creditHref, tags
 *     date is YYYY/MM/DD. tags is an array of strings.
 *     thumb is a site path (assets/thumbs/cover.svg) or an https URL
 *     from Drive, Notion, or a CDN. alt is required.
 *
 * The last line keeps window.PROJECTS pointed at the same list.
 */
window.SITE = {
  name: "Cendy Saputra",
  sentence: "I design and build quiet interfaces where type, grid, and a hard edge do the talking.",
  about: "Independent practice for editorial sites, product interfaces, and identities.",
  description: "Portfolio of Cendy Saputra. Quiet interfaces, editorial systems, and identities.",
  contact: {
    label: "Contact",
    href: "mailto:ce.createe@gmail.com"
  },
  tags: ["Interface", "Editorial", "Identity", "Type"],
  projects: [
    {
      id: "paper-margin",
      title: "Paper Margin",
      href: "#project-paper-margin",
      thumb: "assets/thumbs/paper-margin.svg",
      alt: "Editorial cover with a black rule, gray lines, and a blue ring",
      date: "2026/03/18",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Editorial", "Type"]
    },
    {
      id: "north-station",
      title: "North Station",
      href: "#project-north-station",
      thumb: "assets/thumbs/north-station.svg",
      alt: "Wayfinding cover of vertical bars, one of them blue",
      date: "2026/02/02",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Identity"]
    },
    {
      id: "keepsake",
      title: "Keepsake",
      href: "#project-keepsake",
      thumb: "assets/thumbs/keepsake.svg",
      alt: "Identity mark made of two centered frames and a blue square",
      date: "2025/11/20",
      credit: "With Mora Studio",
      creditHref: "#about",
      tags: ["Identity", "Editorial"]
    },
    {
      id: "quiet-ledger",
      title: "Quiet Ledger",
      href: "#project-quiet-ledger",
      thumb: "assets/thumbs/quiet-ledger.svg",
      alt: "Interface cover of ledger lines with one filled row",
      date: "2026/01/09",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Interface"]
    },
    {
      id: "harbor-type",
      title: "Harbor Type",
      href: "#project-harbor-type",
      thumb: "assets/thumbs/harbor-type.svg",
      alt: "Type specimen cover built as a geometric letter H",
      date: "2025/09/14",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Type"]
    },
    {
      id: "field-notes",
      title: "Field Notes",
      href: "#project-field-notes",
      thumb: "assets/thumbs/field-notes.svg",
      alt: "Editorial cover with crop marks and a solid photograph block",
      date: "2026/04/27",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Editorial"]
    },
    {
      id: "atelier-index",
      title: "Atelier Index",
      href: "#project-atelier-index",
      thumb: "assets/thumbs/atelier-index.svg",
      alt: "Index cover listing numbers 01 to 06 with one highlighted row",
      date: "2025/12/08",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Interface", "Identity"]
    },
    {
      id: "soft-grid",
      title: "Soft Grid",
      href: "#project-soft-grid",
      thumb: "assets/thumbs/soft-grid.svg",
      alt: "Modular grid cover with one black cell and one blue cell",
      date: "2026/06/30",
      credit: "Cendy Saputra",
      creditHref: "#about",
      tags: ["Interface", "Type"]
    }
  ]
};

window.PROJECTS = window.SITE.projects;
