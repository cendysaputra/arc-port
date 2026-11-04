/**
 * Portfolio content. scripts/main.js renders window.SITE.
 * Replace these values when copy or images change; keep the field names.
 *
 *   name, sentence, about, description
 *   contact  { label, href, text }  href is https (the button label stays label)
 *   tags     Hero filter labels.
 *   projects[]
 *     id, title, href, thumb, alt, year, tags
 *     credit, creditHref are optional.
 *     thumb is a site path (assets/shots/name.jpg) or an https URL.
 *     year is shown in the card date slot (YYYY or YYYY/MM/DD).
 *
 * The last line keeps window.PROJECTS pointed at the same list.
 */
window.SITE = {
  name: "Cendy Saputra",
  sentence: "Web developer — situs WordPress & Laravel bersama Imajiner.",
  about: "Situs WordPress dan Laravel, dikerjakan bersama Imajiner.",
  description: "Portfolio of Cendy Saputra. Situs WordPress dan Laravel bersama Imajiner.",
  contact: {
    label: "Contact",
    href: "https://github.com/cendysaputra",
    text: "GitHub"
  },
  tags: ["Web Dev", "WordPress", "Laravel"],
  projects: [
    {
      id: "telematica",
      title: "Telematika Asset Monitoring",
      href: "https://telematica.co.id/",
      thumb: "assets/shots/telematica.jpg",
      alt: "Telematika homepage with a worker walking a rocky site under a dark sky",
      year: "2026",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "WordPress"]
    },
    {
      id: "gmmobil",
      title: "PT Gaya Makmur Mobil",
      href: "https://gmmobil.com/",
      thumb: "assets/shots/gmmobil.jpg",
      alt: "GM Mobil homepage with a spare-parts banner for FAW trucks",
      year: "2026",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "Laravel"]
    },
    {
      id: "greenland",
      title: "Greenland Properti",
      href: "https://greenland-property.com/",
      thumb: "assets/shots/greenland.jpg",
      alt: "Greenland Properti homepage showing a modern house and a property search",
      year: "2026",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "WordPress"]
    },
    {
      id: "solea",
      title: "Solea Residence",
      href: "https://solearesidence.com/",
      thumb: "assets/shots/solea.jpg",
      alt: "Solea Residence homepage with townhouses in Lebak Bulus",
      year: "2026",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "WordPress"]
    },
    {
      id: "balaikartini",
      title: "Balai Kartini",
      href: "https://balaikartini.co.id/",
      thumb: "assets/shots/balaikartini.jpg",
      alt: "Balai Kartini homepage over a highway view of Jakarta",
      year: "2025",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "WordPress"]
    },
    {
      id: "beachcity",
      title: "Beach City International Stadium",
      href: "https://beachcityjakarta.com/",
      thumb: "assets/shots/beachcity.jpg",
      alt: "Beach City International Stadium at night with the venue lit along the beach",
      year: "2024",
      credit: "Imajiner",
      creditHref: "https://imajiner.id",
      tags: ["Web Dev", "WordPress"]
    }
  ]
};

window.PROJECTS = window.SITE.projects;
