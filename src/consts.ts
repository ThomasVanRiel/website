import type { Site, Links, Socials } from "@types"

// Global. Page titles and descriptions are localized in src/lib/i18n.ts (ui.pages.*).
export const SITE: Site = {
  TITLE: "Thomas VAN RIEL",
  DESCRIPTION: "Thomas Van Riel's personal website and articles.",
  AUTHOR: "Thomas Van Riel",
}

// Nav links. HREF is a bare (unprefixed) app path; the locale prefix is added at render
// time via localizePath(). Labels come from the i18n nav dictionary keyed by KEY.
export const LINKS: Links = [
  {
    KEY: "home",
    HREF: "/",
  },
  /*{
    KEY: "work",
    HREF: "/work",
  },*/
  {
    KEY: "articles",
    HREF: "/articles",
  },
  {
    KEY: "projects",
    HREF: "/projects",
  },
  /*{
    KEY: "photography",
    HREF: "/photography",
  },*/
]

// Order of the projects page, top to bottom, by folder name in src/content/projects.
// A project that is not in this list is left out of the page; its own URL keeps working.
export const PROJECT_ORDER = [
  "joveworks",
  "dsmrs",
  "mekasim",
  "vogelwijzer",
  "reclaudable",
  "train-tracks",
  "optics",
  "inky-dashboard",
  "chipmunk",
  "website",
]

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "thomas.van.riel@gmail.com",
    HREF: "mailto:thomas.van.riel@gmail.com",
  },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "thomasvanriel",
    HREF: "https://github.com/thomasvanriel"
  },
  {
    NAME: "Discord",
    ICON: "discord",
    TEXT: "thomasvanriel",
    HREF: "https://discordapp.com/users/thomasvanriel"
  },
  /*  
  { 
    NAME: "Youtube",
    ICON: "youtube",
    TEXT: "thomas-van-riel",
    HREF: "https://www.youtube.com/@thomas-van-riel"
  },
  */
]

